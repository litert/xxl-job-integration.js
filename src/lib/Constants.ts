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

/**
 * The HTTP header used for authentication with the XXL-Job admin API.
 */
export const TOKEN_HEADER = 'xxl-job-access-token';

/**
 * The type of job that can be registered in the XXL-Job executor.
 */
export enum EJobType {

    /**
     * The job handler provided by the application itself, which is hardcoded.
     */
    BEAN = 'BEAN',

    /**
     * The job contains a JavaScript script that will be executed in a Node.js environment.
     */
    NODE_JS = 'GLUE_NODEJS',

    /**
     * The job contains a shell script that will be executed in a shell environment.
     */
    SHELL = 'GLUE_SHELL',

    PYTHON = 'GLUE_PYTHON',

    PHP = 'GLUE_PHP',

    POWERSHELL = 'GLUE_POWERSHELL',
}

/**
 * The strategy for handling task execution when a job already has a task running.
 */
export enum EExecutorBlockStrategy {

    /**
     * If the job has a running task, kill it, clean up the queue, and run the new one.
     */
    COVER_EARLY = 'COVER_EARLY',

    /**
     * If the job has a running task, discard the new one (mark as failed) and keep the old one running.
     */
    DISCARD_LATER = 'DISCARD_LATER',

    /**
     * If the job has a running task, wait until it finishes and then run the new one.
     */
    SERIAL_EXECUTION = 'SERIAL_EXECUTION',
}

/**
 * The default maximum queue depth for a job.
 *
 * The queue actually only useful with `EExecutorBlockStrategy.SERIAL_EXECUTION`, while the other two strategies
 * will always keep only one task being executed, and no other tasks in the queue.
 */
export const DEFAULT_MAX_QUEUE_DEPTH = 10;
