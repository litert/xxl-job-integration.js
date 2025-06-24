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
 * The error class for XXL-Job.
 */
export abstract class XxlJobError extends Error {

    public constructor(
        /**
         * The name of the error.
         */
        name: string,
        /**
         * The message of the error.
         */
        message: string,
        public readonly ctx: Record<string, unknown> = {},
        /**
         * The metadata of the error.
         */
        public readonly origin: unknown = null
    ) {

        super(message);
        this.name = name;
    }
}

export const E_HANDLER_NOT_FOUND = class extends XxlJobError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'handler_not_found',
            'No such handler is registered.',
            ctx,
            origin,
        );
    }
};

export const E_INVALID_APP_NAME = class extends XxlJobError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'invalid_app_name',
            'The application name is invalid. It should match the pattern /^[a-z][-0-9a-z]{0,63}$/i.',
            ctx,
            origin,
        );
    }
};

export const E_JOB_ABORTED = class extends XxlJobError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'job_aborted',
            'The job has been aborted.',
            ctx,
            origin,
        );
    }
};

export const E_HANDLER_FOUND = class extends XxlJobError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'handler_found',
            'A handler with the specific name has been already registered.',
            ctx,
            origin,
        );
    }
};

export const E_RUNNER_FOUND = class extends XxlJobError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'runner_found',
            'A runner with the specific type has been already registered.',
            ctx,
            origin,
        );
    }
};

export const E_BLOCK_STRATEGY_UNSUPPORTED = class extends XxlJobError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'block_strategy_unsupported',
            'The block strategy is not supported.',
            ctx,
            origin,
        );
    }
};

export const E_JOB_TIMEOUT = class extends XxlJobError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'job_timeout',
            'The job has been timeout.',
            ctx,
            origin,
        );
    }
};

export const E_REGISTER_FAILED = class extends XxlJobError {

    public constructor(ctx: Record<string, unknown> = {}, origin?: unknown) {

        super(
            'register_failed',
            'Failed to register the executor.',
            ctx,
            origin,
        );
    }
};

export enum EApiResultCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED,
    EXECUTOR_BUSY,
    TASK_NOT_RUNNABLE,
    LOG_NOT_FOUND,
    JOB_QUEUE_TOO_DEEP,
    JOB_TYPE_UNSUPPORTED,
    TASK_DISCARDED,
    JOB_KILLED,
    HANDLER_FAILED,
    INTERNAL_SERVER_ERROR,
}
