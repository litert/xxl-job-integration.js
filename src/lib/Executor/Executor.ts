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
import { AdminApi } from '../ApiSchema';
import * as cL from '../Constants';
import * as eL from '../Errors';
import type { IAdminApiClient } from '../AdminApiClient';
import { XxlJobTaskQueue } from './TaskQueue';
import { BackgroundRunner } from '@litert/utils-async';

/**
 * The options for creating an executor instance.
 */
export interface IExecutorOptions {

    /**
     * The API client object of the XXL-Job admin server.
     */
    adminApiClient: IAdminApiClient;

    /**
     * The log manager to handle the task logs.
     */
    logManager: dL.ILogManager;
}

class XxlJobExecutor extends EventEmitter<dL.IExecutorEvents> implements dL.IExecutor {

    private readonly _adminApiCli: IAdminApiClient;

    private readonly _runners: Record<cL.EJobType, dL.IJobRunner> = {} as Record<cL.EJobType, dL.IJobRunner>;

    private readonly _jobQueues: Record<number, XxlJobTaskQueue> = {};

    private readonly _bgRunner = new BackgroundRunner();

    private readonly _logMgr: dL.ILogManager;

    public constructor(opts: IExecutorOptions) {

        super();

        this._adminApiCli = opts.adminApiClient;
        this._logMgr = opts.logManager;

        this._bgRunner.on('error', (e) => { this.emit('error', e); });
    }

    public registerRunner(runners: dL.IJobRunner | dL.IJobRunner[]): this {

        if (!Array.isArray(runners)) {

            runners = [runners];
        }

        for (const runner of runners) {

            if (this._runners[runner.type]) {

                throw new eL.E_RUNNER_FOUND({ type: runner.type });
            }

            this._runners[runner.type] = runner;
        }

        return this;
    }

    public enqueueTask(task: dL.IEnqueueTaskArgs): dL.IJobOpResult {

        const runner = this._runners[task.type];

        if (!runner) {

            this._bgRunner.runLater(async () => {

                await this._adminApiCli.invoke<AdminApi.ISubmitJobResultArgs>(
                    AdminApi.EApiEntry.SUBMIT_JOB_RESULT,
                    [{
                        'handleCode': eL.EApiResultCode.JOB_TYPE_UNSUPPORTED,
                        'handleMsg': `The job type "${task.type}" is not supported.`,
                        'logId': task.taskId,
                        'logDateTim': Date.now(),
                    }],
                );
            });

            return { data: null, error: { code: eL.EApiResultCode.OK, msg: null } };
        }

        this._getQueue(task.jobId, task.type).enqueue(task);

        return { data: null, error: { code: eL.EApiResultCode.OK, msg: null } };
    }

    private _getQueue(jobId: number, jobType: cL.EJobType): XxlJobTaskQueue {

        let queue = this._jobQueues[jobId];

        if (!queue) {

            queue = new XxlJobTaskQueue(
                this._runners[jobType],
                this._adminApiCli,
                this._logMgr,
            );

            queue.on('error', (e) => { this.emit('error', e); });
            queue.on('empty', () => { delete this._jobQueues[jobId]; });
            queue.on('task_error', (t, e) => { this.emit('task_error', t, e); });

            this._jobQueues[jobId] = queue;
        }

        return queue;
    }

    public checkJobStatus(jobId: number): dL.IJobOpResult {

        const queue = this._jobQueues[jobId];

        if (!queue?.isRunning()) {

            // return ok if not busy
            return { data: null, error: { code: eL.EApiResultCode.OK, msg: null } };
        }

        return {
            // return error if busy
            error: {
                code: eL.EApiResultCode.EXECUTOR_BUSY,
                msg: `Job#${jobId} is running.`
            },
            data: null,
        };
    }

    public killJob(jobId: number): dL.IJobOpResult {

        const queue = this._jobQueues[jobId];

        if (!queue) {

            return { data: null, error: { code: eL.EApiResultCode.OK, msg: null } };
        }

        queue.stop();

        return { data: null, error: { code: eL.EApiResultCode.OK, msg: null } };
    }

    public async getTaskLog(logId: number, startLine: number, dt: number): Promise<dL.IJobOpResult<dL.ILogRange>> {

        try {

            const result = await this._logMgr.get(logId, startLine, dt);

            if (!result) {

                return {

                    'error': {
                        'code': eL.EApiResultCode.LOG_NOT_FOUND,
                        'msg': `Log with ID ${logId} not found.`,
                    },
                };
            }

            return { data: result, error: { code: eL.EApiResultCode.OK, msg: null } };
        }
        catch (e) {

            return {
                'error': {
                    'code': eL.EApiResultCode.INTERNAL_SERVER_ERROR,
                    'msg': (e as Error).message,
                },
            };
        }
    }

    public validateApiToken(token: string): boolean {

        return this._adminApiCli.validateApiToken(token);
    }
}

export function createExecutor(opts: IExecutorOptions): dL.IExecutor {

    return new XxlJobExecutor(opts);
}
