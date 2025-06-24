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

import * as eL from '../Errors';
import type * as dL from './Typings';

enum EContextStatus {
    CLOSED,
    ACTIVE,
}

export class XxlJobContext implements dL.IContext {

    private _status: EContextStatus = EContextStatus.ACTIVE;

    private _notAfter: number;

    public readonly task: dL.IRunTaskArgs;

    private _timer: NodeJS.Timeout | null = null;

    private readonly _logger: dL.ILogManager;

    public readonly signal: AbortSignal;

    public constructor(
        data: dL.IRunTaskArgs,
        logger: dL.ILogManager,
        timeoutMs: number,
        ac: AbortController,
    ) {

        this.signal = ac.signal;
        this.task = data;
        this._logger = logger;
        this._notAfter = timeoutMs > 0 ? Date.now() + timeoutMs : Number.MAX_SAFE_INTEGER;

        this.signal.addEventListener('abort', () => {

            if (this._status !== EContextStatus.ACTIVE) {

                return;
            }

            this._status = EContextStatus.CLOSED;

            if (this._timer) {

                clearTimeout(this._timer);
                this._timer = null;
            }

            this._notAfter = Date.now();
        });

        if (timeoutMs > 0) {

            this._timer = setTimeout(() => {

                this._timer = null;
                ac.abort('timeout');

                if (this._status !== EContextStatus.ACTIVE) {

                    return;
                }

                this._status = EContextStatus.CLOSED;

            }, timeoutMs);
        }
    }

    public log(level: string, message: string): void {

        this._logger.write(this.task.taskId, level, message);
    }

    /**
     * Close the context.
     */
    public close(): void {

        if (this._status !== EContextStatus.ACTIVE) {

            throw new eL.E_JOB_ABORTED();
        }

        this._status = EContextStatus.CLOSED;

        if (this._timer) {

            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    public isClosed(): boolean {

        return this._status !== EContextStatus.ACTIVE;
    }

    public isActive(): boolean {

        return this._status === EContextStatus.ACTIVE;
    }

    public get notAfter(): number {
        return this._notAfter;
    }
}
