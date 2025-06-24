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

import * as cL from '../Constants';
import type { EventEmitter } from 'node:events';

/**
 * The context object passed to the job runner when running a task.
 */
export interface IContext {

    /**
     * The information of the current task.
     */
    readonly task: IRunTaskArgs;

    /**
     * The task should stop running after this time, as a UNIX timestamp in milliseconds.
     */
    readonly notAfter: number;

    /**
     * The signal to abort the task.
     *
     * The handler can watch this signal to check if the task has been aborted by timeout or by a kill request.
     */
    readonly signal: AbortSignal;

    /**
     * Write a line of log message to the task log storage.
     *
     * @param level     The log level (depending on the application, e.g. 'info', 'warn', 'error').
     * @param message   The log message to write.
     */
    log(level: string, message: string): void;

    /**
     * Check if the task is closed (e.g. by a timeout or a kill request).
     */
    isClosed(): boolean;

    /**
     * Check if the task is still active.
     */
    isActive(): boolean;
}

export interface IJobOpResult<T = null> {

    /**
     * The error information when an operation fails.
     */
    error: {

        /**
         * The code of the error, which is a number indicating the type of error.
         */
        code: number;
        msg: string | null;
    };

    data?: T;
}

/**
 * The arguments for executors, to put a task to the queue.
 */
export interface IEnqueueTaskArgs {

    /**
     * The job ID, which is unique, registered in the xxl-job-admin.
     *
     * @readonly
     */
    readonly jobId: number;

    /**
     * The type of the job (runner).
     */
    readonly type: cL.EJobType;

    /**
     * The arguments for the job, which is configured in the xxl-job-admin.
     */
    readonly args: string | null;

    /**
     * The name of the handler to run.
     *
     * > Only available for `EJobType.BEAN` jobs.
     */
    readonly name: string;

    /**
     * The strategy to use when the job is already running on the executor.
     */
    readonly strategyOnBlocked: cL.EExecutorBlockStrategy;

    /**
     * The source code of the job to be executed.
     *
     * > Only available for `EJobType.NODE_JS` jobs.
     */
    readonly source?: {

        /**
         * The content of source code of the job.
         */
        readonly code: string;

        /**
         * When the source code was last updated, as a UNIX timestamp in milliseconds.
         */
        readonly updatedAt: number;
    };

    /**
     * The task ID, which is unique for each task.
     */
    readonly taskId: number;

    /**
     * The timeout for the job in seconds.
     */
    readonly timeoutSec: number;

    /**
     * The time when the job was requested to run, as a UNIX timestamp in milliseconds.
     */
    readonly requestedAt: number;
}

/**
 * The arguments for runners to run a task.
 */
export type IRunTaskArgs = Omit<IEnqueueTaskArgs, 'type' | 'strategyOnBlock'>;

export interface IRunnerPrepareResult {

    /**
     * How many tasks could be waiting in the queue for this job.
     */
    maxQueueDepth: number;
}

/**
 * The runner who finally handles the tasks of a specific job type.
 */
export interface IJobRunner {

    /**
     * The type of the jobs that this runner can handle.
     */
    readonly type: cL.EJobType;

    /**
     * Run the task with the given context.
     *
     * @param ctx  The context of the task to run, which contains the task data and task information.
     */
    run(ctx: IContext): Promise<void> | void;

    /**
     * Prepare to run the task with the given arguments.
     *
     * @returns null if the task cannot be prepared, or an object containing settings for the task.
     */
    prepare(args: IRunTaskArgs): IRunnerPrepareResult | null;
}

/**
 * The result of the log reading operation.
 */
export interface ILogRange {

    /**
     * The line number of the first line in the log range.
     */
    startLine: number;

    /**
     * The line number of the last line in the log range.
     */
    endLine: number;

    /**
     * The content of the log range, which is a string containing the log messages.
     *
     * > Always ending with a newline character.
     */
    content: string;

    /**
     * Indicates if there are more lines to read after this range.
     *
     * For now, the XXL-Job will ignore this field when reading the log after the task is finished.
     *
     * So if the task is finished, a full log range should be returned.
     *
     * But, anyway, to avoid memory overflow or performance issues, truncating the log range to a certain size is fine
     * if it's necessary.
     */
    hasMore: boolean;
}

/**
 * The log manager interface.
 *
 * Implements the interface, to create a custom log manager/storage for the task logs.
 */
export interface ILogManager {

    /**
     * Initialize a log section for the given task ID.
     *
     * @param taskId    The task ID to initialize the log section for.
     */
    open(taskId: number): Promise<void> | void;

    /**
     * Close the log section for the given task ID.
     * @param taskId    The task ID to close the log section for.
     * @param clean     If true, the log section should be cleaned up after closing.
     */
    close(taskId: number): Promise<void> | void;

    /**
     * Write a log message to the task log storage.
     *
     * @param taskId    The task ID to write the log message for.
     * @param level     The log level (e.g. "info", "error").
     * @param message   The log message to write.
     */
    write(taskId: number, level: string, message: string): void;

    /**
     * Read a range of log for the given task ID, by the start line and datetime.
     *
     * > Don't always return the all rest lines, keep it less than a certain number of lines (e.g. 100),
     * > in case of memory overflow or performance issues.
     *
     * @param taskId    The task ID to read the log for.
     * @param startLine The start line to read from.
     * @param datetime  The datetime to read the log for.
     */
    get(taskId: number, startLine: number, datetime: number): Promise<ILogRange | null> | ILogRange | null;
}

export interface IExecutorEvents {

    error: [error: unknown];
}

/**
 * The interface for the executor that process the tasks from the xxl-job-admin.
 *
 * ## Events
 *
 * - error
 *
 *     When an error occurs during the registration or heartbeat process.
 */
export interface IExecutor extends EventEmitter<IExecutorEvents> {

    /**
     * Validate if the given API token is valid.
     *
     * @param token  The API token to validate.
     */
    validateApiToken(token: string): boolean;

    /**
     * Detects if a job is running or not (`/idleBeat` API).
     *
     * This method checks if a job is currently running based on its job ID, not by a log ID.
     *
     * @param jobId     The job ID to detect.
     */
    checkJobStatus(jobId: number): IJobOpResult;

    /**
     * Starts executing a job with the given options.
     *
     * @param opts  The options for starting the job, from the `/run` API.
     */
    enqueueTask(opts: IEnqueueTaskArgs): IJobOpResult;

    /**
     * Stop the currently running task and the queued tasks of the specified job ID.
     */
    killJob(jobId: number): IJobOpResult;

    /**
     * Reads the log for a specific task, starting from a given line number and datetime.
     *
     * @param taskId      The task ID to get the log for.
     * @param startLine   The start line to read from.
     * @param datetime    The datetime when the task started.
     */
    getTaskLog(taskId: number, startLine: number, datetime: number): Promise<IJobOpResult<ILogRange>>;

    /**
     * Register a runner for a specific type of job.
     *
     * @param runners    The job runner object to register.
     */
    registerRunner(runners: IJobRunner | IJobRunner[]): this;
}
