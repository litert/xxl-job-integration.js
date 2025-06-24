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

import type { Writable } from 'node:stream';
import * as NodeRL from 'node:readline/promises';
import * as LibXJ from '../Executor';
import * as NodeFS from 'node:fs';
import * as NodePath from 'node:path';
import { EventEmitter } from 'node:events';
import { BackgroundRunner } from '@litert/utils-async';

/**
 * The definition of the events emitted by the `FileLogCleaner` class.
 */
export interface IFileLogCleanerEvents {

    error: [error: unknown];

    cleaned: [file: string, time: number];
}

/**
 * The options for the `FileLogCleaner` class.
 */
export interface IFileLogCleanerOptions {

    /**
     * The path to the directory where the log files are stored.
     *
     * This directory must be accessible and writable by the application.
     */
    logDir: string;

    /**
     * The maximum age of log files to keep, in milliseconds.
     * Files older than this will be deleted.
     *
     * It's recommended to set this value based on your application's log retention policy.
     * Don't set this value too low, as it may cause the log files to be deleted too soon, before you have a chance to
     * read them. And also don't set this value too high, as it may cause the log directory to
     * accumulate too many old log files, which may use up too much disk space.
     */
    maxAgeMs: number;

    /**
     * The interval at which to check for old log files, in milliseconds.
     *
     * It's not recommended to set this value too low, as it may cause performance issues,
     * but also not too high, as it may cause old log files to accumulate.
     * A simple rule of this value is to set it to the same unit as the `maxAgeMs` value,
     *
     * For example, if your log files are reserved for days, you could set
     * `timerIntervalMs` to 86400000 (which is 24 hours/1 day in milliseconds).
     */
    timerIntervalMs: number;
}

/**
 * The cleaner for old log files in the specified directory.
 *
 * This class periodically checks the log directory for files that are older than a specified maximum age,
 * and removes them.
 *
 * **DON'T FORGET TO LISTEN ON THE `error` EVENT!**
 *
 * ## Events
 *
 * - error
 *
 *     When an error occurs during the registration or heartbeat process.
 *
 * - cleaned
 *
 *     When a log file is cleaned up.
 *
 * @noInheritDoc
 */
export class FileLogCleaner extends EventEmitter<IFileLogCleanerEvents> {

    private _timer: NodeJS.Timeout | null = null;

    private readonly _logDir: string;

    private readonly _maxAgeMs: number;

    private readonly _timerIntervalMs: number;

    private readonly _bgRunner = new BackgroundRunner();

    public constructor(opts: IFileLogCleanerOptions) {

        super();

        this._logDir = opts.logDir;
        this._maxAgeMs = opts.maxAgeMs;
        this._timerIntervalMs = opts.timerIntervalMs;
        this._bgRunner.on('error', (error) => this.emit('error', error));
    }

    /**
     * Start the timer to clean up old log files periodically.
     * If the timer is already running, this method does nothing.
     */
    public start(): void {

        if (this._timer !== null) {
            return; // Already started
        }

        this._timer = setInterval(
            () => { this._bgRunner.run(async () => { await this._clean(); }); },
            this._timerIntervalMs,
        );
    }

    /**
     * Stop the timer that cleans up old log files.
     * If the timer is not running, this method does nothing.
     */
    public stop(): void {

        if (this._timer === null) {
            return; // Already stopped
        }

        clearInterval(this._timer);
        this._timer = null;
    }

    private async _clean(): Promise<void> {

        const files = await NodeFS.promises.readdir(this._logDir);

        const now = Date.now();

        for (const file of files) {

            const filePath = NodePath.join(this._logDir, file);

            let stat: NodeFS.Stats;

            try {

                stat = await NodeFS.promises.stat(filePath);
            }
            catch (e) {

                this.emit('error', e);
                continue;
            }

            if (!stat.isFile()) {

                continue; // Not a file, skip
            }

            if (stat.ctimeMs > now - this._maxAgeMs) {

                continue; // File is still within the max age based on creation time
            }

            try {

                await NodeFS.promises.rm(filePath, { force: true, recursive: true });
            }
            catch (error) {

                this.emit('error', error);
                continue; // Skip to the next file
            }

            this.emit('cleaned', filePath, stat.ctimeMs);
        }
    }
}

/**
 * The options for the `FileLogManager` class.
 */
export interface IFileLogManagerOptions {

    /**
     * Where to store the log files.
     * This directory will be created if it does not exist.
     */
    logDir: string;

    /**
     * The maximum number of lines to read at once when fetching logs.
     * This is to prevent memory overflow or performance issues.
     *
     * However, this may also cause the log reading to be incomplete if the task is finished already,
     * because the XXL-Job admin server does not read the logs by range after the task is finished.
     * So, if the task is finished, a truncated log range might be returned depending on this value.
     *
     * @default 1000
     * @see {@link DEFAULT_MAX_LINE_AT_ONCE}
     */
    maxLinesAtOnce?: number;
}

/**
 * The default value for the `maxLinesAtOnce` option in the `IFileLogManagerOptions`.
 */
export const DEFAULT_MAX_LINE_AT_ONCE = 1000;

/**
 * The implementation of the `ILogManager` interface that writes logs to files in a specified directory.
 *
 * This class manages log files for different tasks, allowing you to open, close, write logs, and read logs by range.
 *
 * This class does not handle log file cleanup, so you may want to use `FileLogCleaner` to manage old log files.
 */
export class FileLogManager implements LibXJ.ILogManager {

    private readonly _logStreams: Record<number, Writable> = {};

    private readonly _logDir: string;

    private readonly _maxLinesAtOnce: number;

    public constructor(opts: IFileLogManagerOptions) {

        this._logDir = opts.logDir;
        this._maxLinesAtOnce = opts.maxLinesAtOnce ?? DEFAULT_MAX_LINE_AT_ONCE;
    }

    public async open(taskId: number): Promise<void> {

        try {

            const stat = await NodeFS.promises.stat(this._logDir);

            if (!stat.isDirectory()) {

                throw new Error(`Output path "${this._logDir}" is not a directory.`);
            }
        }
        catch (e) {

            if ((e as any)?.code === 'ENOENT') {

                // Directory does not exist, create it
                await NodeFS.promises.mkdir(this._logDir, { recursive: true });
            }
            else {
                // Other error, rethrow
                throw e;
            }
        }

        this._logStreams[taskId] ??= NodeFS.createWriteStream(this._getLogFilePath(taskId));
    }

    public close(taskId: number): void {

        const stream = this._logStreams[taskId];

        if (stream) {
            stream.end();
            delete this._logStreams[taskId];
        }
    }

    private _getLogFilePath(taskId: number): string {

        return NodePath.join(this._logDir, `task-${taskId}.log`);
    }

    public write(taskId: number, level: string, message: string): void {

        const stream = this._logStreams[taskId];

        if (!stream) {
            return;
        }

        stream.write(`[${new Date().toISOString()}][${level}] ${message}\n`);
    }

    public async get(taskId: number, startLine: number): Promise<LibXJ.ILogRange | null> {

        const rl = NodeRL.createInterface(NodeFS.createReadStream(this._getLogFilePath(taskId)));
        const lines: string[] = [];
        const endingLine = startLine + this._maxLinesAtOnce;

        let hasMore = false;

        const isRunning = !!this._logStreams[taskId];

        try {

            let linesRead = 0;

            for await (const line of rl) {

                linesRead++;

                if (linesRead < startLine) {
                    continue;
                }

                if (linesRead === endingLine && !isRunning) {
                    hasMore = true;
                    break;
                }

                lines.push(line);
            }
        }
        catch {

            return {
                startLine,
                endLine: 0,
                content: '',
                hasMore: false,
            };
        }
        finally {

            rl.close();
        }

        if (hasMore && !this._logStreams[taskId]) {

            lines.push('... (more lines not shown)');
        }

        return {
            startLine,
            endLine: startLine + lines.length - 1,
            hasMore: isRunning,
            content: lines.join('\n') + '\n',
        };
    }
}
