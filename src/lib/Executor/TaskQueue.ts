/**
 *  Copyright 2025 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { EventEmitter } from 'node:events';
import type * as dL from './Typings';
import * as cL from '../Constants';
import * as eL from '../Errors';
import { AdminApi } from '../ApiSchema';
import type { IAdminApiClient } from '../AdminApiClient';
import { XxlJobContext } from './Context';
import { BackgroundRunner } from '@litert/utils-async';

interface ITask {

    readonly ac: AbortController;

    readonly ctx: XxlJobContext;
}

interface IQueueEvents {

    error: [error: unknown];

    empty: [];
}

interface ISubmitArgs {

    code: eL.EApiResultCode;

    msg: string;
}

export class XxlJobTaskQueue extends EventEmitter<IQueueEvents> {

    private static _$queueIdCounter = 0;

    /**
     * The unique ID of the queue, preventing from multiple instances of the queue running at the same time.
     */
    private _queueId = 0;

    /**
     * The queue of tasks to be executed.
     */
    private readonly _tasks: dL.IEnqueueTaskArgs[] = [];

    private readonly _bgRunner = new BackgroundRunner();

    /**
     * The API client object of the XXL-Job admin server.
     */
    private readonly _adminApiCli: IAdminApiClient;

    /**
     * The job runner that will execute the tasks in this queue.
     */
    private readonly _runner: dL.IJobRunner;

    /**
     * The log manager to handle the task logs.
     */
    private readonly _logMgr: dL.ILogManager;

    /**
     * The currently running task.
     */
    private _current: ITask | null = null;

    private readonly _timers: Record<string, NodeJS.Timeout> = {};

    public constructor(
        runner: dL.IJobRunner,
        adminApiCli: IAdminApiClient,
        logMgr: dL.ILogManager,
    ) {

        super();

        this._runner = runner;
        this._adminApiCli = adminApiCli;
        this._logMgr = logMgr;
        this._bgRunner.on('error', (e) => this.emit('error', e));
    }

    public isRunning(): boolean {

        return this._queueId > 0 || null !== this._current;
    }

    public getQueueSize(): number {

        return this._tasks.length + (this._current ? 1 : 0);
    }

    public enqueue(task: dL.IEnqueueTaskArgs): void {

        const prepareResult = this._runner.prepare(task);

        if (!prepareResult) {

            this._submitTaskResult(
                Date.now(),
                [task.taskId],
                {
                    code: eL.EApiResultCode.TASK_NOT_RUNNABLE,
                    msg: `The runner can not handle the task, please check the job settings.`,
                }
            );

            return;
        }

        switch (task.strategyOnBlocked) {
            case cL.EExecutorBlockStrategy.DISCARD_LATER:
                if (this.isRunning()) {

                    this._submitTaskResult(
                        Date.now(),
                        [task.taskId],
                        {
                            code: eL.EApiResultCode.TASK_DISCARDED,
                            msg: `The task is ignored due to the DISCARD_LATER strategy.`,
                        }
                    );
                    return;
                }
                break;
            case cL.EExecutorBlockStrategy.COVER_EARLY:
                // clean up the queue and stop the current job, and then enqueue the new task
                this._empty({
                    code: eL.EApiResultCode.TASK_DISCARDED,
                    msg: `The task is dequeued due to the COVER_EARLY strategy.`,
                });
                break;
            case cL.EExecutorBlockStrategy.SERIAL_EXECUTION:
                break;
            default:

                this._submitTaskResult(
                    Date.now(),
                    [task.taskId],
                    new eL.E_BLOCK_STRATEGY_UNSUPPORTED({
                        jobId: task.jobId,
                        reqId: task.taskId,
                        strategy: task.strategyOnBlocked as unknown as string,
                    }),
                );
                return;
        }

        if (prepareResult.maxQueueDepth <= this.getQueueSize()) {

            this._submitTaskResult(
                Date.now(),
                [task.taskId],
                {
                    code: eL.EApiResultCode.JOB_QUEUE_TOO_DEEP,
                    msg: `The job queue is full, please try again later.`,
                }
            );

            return;
        }

        this._tasks.push(task);

        if (task.timeoutSec > 0) {

            this._setupTimeoutTimer(task);
        }

        this._startQueue();
    }

    /**
     * Create a timeout timer for the task to remove it from the queue if
     * it hasn't been executed within the specified timeout.
     */
    private _setupTimeoutTimer(task: dL.IEnqueueTaskArgs): void {

        this._timers[task.taskId] = setTimeout(() => {

            delete this._timers[task.taskId];

            const idx = this._tasks.indexOf(task);

            if (idx === -1) {
                return;
            }

            if (Date.now() > task.requestedAt + task.timeoutSec * 1000) {

                this._tasks.splice(idx, 1);

                this._submitTaskResult(
                    Date.now(),
                    [task.taskId],
                    new eL.E_JOB_TIMEOUT({ jobId: task.jobId, taskId: task.taskId })
                );
            }

        }, task.timeoutSec * 1000);
    }

    private _empty(reason: ISubmitArgs): void {

        this._submitTaskResult(
            Date.now(),
            this._tasks.splice(0, this._tasks.length).map(i => i.taskId),
            reason,
        );

        if (this._current) {

            this._current.ac.abort();
        }
    }

    private _startQueue(): void {

        if (this._queueId > 0) {
            return;
        }

        const queueId = ++XxlJobTaskQueue._$queueIdCounter;
        this._queueId = queueId;

        this._bgRunner.run(async () => {

            await this._queueBody(queueId);
        });
    }

    private async _queueBody(queueId: number): Promise<void> {

        while (this._queueId === queueId) {

            const task = this._tasks.shift()!;

            if (!task) {

                break;
            }

            if (this._timers[task.taskId]) {

                clearTimeout(this._timers[task.taskId]);
                delete this._timers[task.taskId];
            }

            const JOB_STARTED_AT = Date.now();

            // check if the task is already timed out.
            if (task.timeoutSec > 0 && task.timeoutSec * 1000 + task.requestedAt < Date.now()) {

                this._submitTaskResult(
                    JOB_STARTED_AT,
                    [task.taskId],
                    new eL.E_JOB_TIMEOUT({ jobId: task.jobId, taskId: task.taskId }),
                );
                continue;
            }

            const ac = new AbortController();
            const ctx = new XxlJobContext(task, this._logMgr, task.timeoutSec * 1000, ac);

            try {

                const logOpenResult = this._logMgr.open(task.taskId);

                if (logOpenResult instanceof Promise) {
                    await logOpenResult;
                }

                this._current = { ac, ctx, };

                await this._runner.run(ctx);

                ctx.close();
            }
            catch (e) {

                this._submitTaskResult(JOB_STARTED_AT, [task.taskId], e as Error);
                this.emit('error', e);
                continue;
            }
            finally {

                this._current = null;

                this._bgRunner.run(async () => {

                    const logCloseResult = this._logMgr.close(task.taskId);

                    if (logCloseResult instanceof Promise) {
                        await logCloseResult;
                    }
                });
            }

            this._submitTaskResult(JOB_STARTED_AT, [task.taskId]);
        }

        if (this._queueId === queueId) {

            this.emit('empty');
            this._queueId = 0;
        }
    }

    /**
     * Stop the currently running task and empty the pending task queue.
     */
    public stop(): void {

        this._queueId = 0;

        this._empty({
            code: eL.EApiResultCode.JOB_KILLED,
            msg: `The queue of the job has been stopped.`,
        });

        this.emit('empty');
    }

    /**
     * Submit the result of a task execution.
     *
     * @param time The time when the task was started to be executed, as a UNIX timestamp in milliseconds.
     * @param taskIdList The list of task IDs that were executed.
     * @param e The error, if any, that occurred during task execution.
     */
    private _submitTaskResult(
        time: number,
        taskIdList: number[],
        e?: Error | ISubmitArgs,
    ): void {

        this._bgRunner.run(async () => {

            await this._adminApiCli.invoke<AdminApi.ISubmitJobResultArgs>(
                AdminApi.EApiEntry.SUBMIT_JOB_RESULT,
                taskIdList.map(id => ({

                    'handleCode': e === undefined ?
                        eL.EApiResultCode.OK :
                        e instanceof Error ? eL.EApiResultCode.HANDLER_FAILED : e.code,
                    'handleMsg': e === undefined ?
                        null :
                        e instanceof Error ? e.message : e.msg,
                    'logId': id,
                    'logDateTim': time,
                })),
            );
        });
    }
}
