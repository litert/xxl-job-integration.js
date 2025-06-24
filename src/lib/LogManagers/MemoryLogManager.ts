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

import * as LibXJ from '../Executor';

/**
 * The options for the `MemoryLogManager` class.
 */
export interface IMemoryLogManagerOptions {

    /**
     * The maximum age of log sections to keep, in milliseconds.
     * Log sections older than this will be deleted.
     *
     * It's recommended to set this value based on your application's log retention policy.
     * Don't set this value too low, as it may cause the log sections to be deleted too soon, before you have a chance to
     * read them. And also don't set this value too high, as it may cause the log directory to
     * accumulate too many old log sections, which may use up too much disk space.
     */
    maxAgeMs: number;

    /**
     * The interval at which to check for old log sections, in milliseconds.
     *
     * It's not recommended to set this value too low, as it may cause performance issues,
     * but also not too high, as it may cause old log sections to accumulate.
     * A simple rule of this value is to set it to the same unit as the `maxAgeMs` value,
     *
     * For example, if your log sections are reserved for days, you could set
     * `timerIntervalMs` to 86400000 (which is 24 hours/1 day in milliseconds).
     */
    timerIntervalMs: number;
}

interface ILogSection {

    lines: string[];

    createdAt: number;

    closed?: boolean;
}

/**
 * The implementation of the `ILogManager` interface that writes logs to memory in a specified directory.
 *
 * This class manages log sections for different tasks, allowing you to open, close, write logs, and read logs by range.
 */
export class MemoryLogManager implements LibXJ.ILogManager {

    private readonly _maxAgeMs: number;

    private readonly _timerIntervalMs: number;

    private _timer: NodeJS.Timeout | null = null;

    private readonly _logs: Record<string, ILogSection> = {};

    public constructor(opts: IMemoryLogManagerOptions) {

        this._maxAgeMs = opts.maxAgeMs;
        this._timerIntervalMs = opts.timerIntervalMs;
    }

    public startTimer(): void {

        if (this._timer) {
            return;
        }

        this._timer = setInterval(() => {

            const NOW = Date.now();

            for (const taskId in this._logs) {

                const logSection = this._logs[taskId];

                if (logSection.createdAt + this._maxAgeMs < NOW) {

                    // Remove the log section if it's older than the max age
                    delete this._logs[taskId];
                }
            }

        }, this._timerIntervalMs);
    }

    public stopTimer(): void {

        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    public open(taskId: number): void {

        this._logs[taskId] ??= { lines: [], createdAt: Date.now(), closed: false };
    }

    public close(taskId: number): void {

        const item = this._logs[taskId];

        if (!item) {
            return; // No logs for this task ID
        }

        item.closed = true;
    }

    public write(taskId: number, level: string, message: string): void {

        const logSection = this._logs[taskId];

        if (logSection?.closed ?? true) {

            return;
        }

        logSection.lines.push(`[${new Date().toISOString()}] [${level}] ${message}`);
    }

    public get(taskId: number, startLine: number): LibXJ.ILogRange | null {

        const logSection = this._logs[taskId];

        if (!logSection) {
            return null; // No logs for this task ID
        }

        const start = startLine - 1;

        // Filter lines based on the datetime and startLine
        const lines = logSection.lines.slice(start);

        return {
            'content': lines.join('\n') + '\n',
            'startLine': startLine,
            'endLine': logSection.lines.length,
            'hasMore': !logSection.closed,
        };
    }
}
