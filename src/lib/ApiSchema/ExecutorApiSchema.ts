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

import { EExecutorBlockStrategy, EJobType } from '../Constants';
import type { IApiReplyBase } from './BaseApiSchema';
export * as Validation from './ExecutorApiSchema.Validation';

/**
 * The URL entry points for the XXL-Job Executor API.
 */
export enum EApiEntry {

    /**
     * This is used for FAIL_OVER routing method.
     *
     * The executor must return 200 if the server is alive.
     *
     * @see IHeartbeatArgs
     */
    HEARTBEAT = '/beat',

    /**
     * This is used for BUSY_OVER routing method.
     *
     * The executor should return 200 if the job handler is idle, or other code if the job handler is busy or not available.
     *
     * @see IDetectJobArgs
     */
    DETECT_JOB = '/idleBeat',

    /**
     * @see IRunJobArgs
     */
    RUN_JOB = '/run',

    /**
     * @see IKillJobArgs
     */
    KILL_JOB = '/kill',

    /**
     * @see IQueryJobLogArgs
     */
    QUERY_JOB_LOG = '/log',
}

/**
 * @see EApiEntry.HEARTBEAT
 */
export type IHeartbeatArgs = unknown;

/**
 * @see EApiEntry.DETECT_JOB
 */
export interface IDetectJobArgs {

    jobId: number;
}

/**
 * @see EApiEntry.RUN_JOB
 */
export interface IRunJobArgs {

    jobId: number;

    executorHandler: string;

    executorParams: string | null;

    executorBlockStrategy: EExecutorBlockStrategy;

    executorTimeout: number;

    logId: number;

    logDateTime: number;

    glueType: EJobType;

    glueSource: string | null;

    glueUpdatetime: number;

    broadcastIndex: number;

    broadcastTotal: number;
}

/**
 * @see EApiEntry.KILL_JOB
 */
export interface IKillJobArgs {
    jobId: number;
}

/**
 * @see EApiEntry.QUERY_JOB_LOG
 */
export interface IQueryJobLogArgs {
    logDateTim: number;
    logId: number;
    fromLineNum: number;
}

export interface IQueryJobLogReply extends IApiReplyBase {

    content: {

        fromLineNum: number;

        toLineNum: number;

        logContent: string;

        isEnd: boolean;
    };
}
