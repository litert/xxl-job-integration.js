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
import * as eL from '../Errors';
import type * as dExe from '../Executor';

type IScriptExecutor = (args: string, envData: IScriptEnvData, ctx: dExe.IContext) => Promise<void>;

interface IScript {

    jobId: number;

    edition: number;

    expiringAt: number;

    execute: IScriptExecutor;
}

type IScriptEnvData = Record<string, unknown>;

/**
 * The options for the Node.js script runner.
 */
export interface IRunnerOptions {

    /**
     * The (generator of) environment data that will be passed to the js script when it is executed.
     *
     * @default () => {}
     */
    envData?: IScriptEnvData | (() => IScriptEnvData);

    /**
     * The time-to-live (TTL) of each cached script in seconds.
     *
     * @default 3600 (30 minutes)
     */
    cacheTtl?: number;

    /**
     * The maximum quantity of the cache for the scripts.
     *
     * @default 100
     */
    maxCacheScripts?: number;

    /**
     * How many percentage of the cached scripts should be kept when the garbage collector runs
     * due to the cache size limit.
     *
     * @default 60%
     */
    gcReservedPercentage?: number;

    /**
     * The maximum queue depth for the job handlers.
     *
     * @default 10
     */
    maxQueueDepth?: number;

    /**
     * The ratio of the garbage collector to run.
     *
     * @default 0.5
     */
    gcRunRatio?: number;
}

const DEFAULT_CACHE_TTL = 3600;
const DEFAULT_MAX_CACHE_SIZE = 100;
const DEFAULT_GC_RESERVED_PCT = 60;
const DEFAULT_MAX_QUEUE_DEPTH = cL.DEFAULT_MAX_QUEUE_DEPTH;
const DEFAULT_GC_RUN_RATIO = 0.5;

/**
 * The task runner for Node.js scripts that are executed in current process.
 *
 * WATCH OUT: Don't run any untrusted code here, as it will possibly cause RCE
 * (Remote Code Execution) vulnerabilities.
 */
export class XxlJobNodeJsInProcessHandlerRunner implements dExe.IJobRunner {

    public readonly type: cL.EJobType = cL.EJobType.NODE_JS;

    private readonly _scripts: Record<string, IScript> = {};

    private readonly _makeEnvData: () => IScriptEnvData;

    private readonly _opts: Required<Omit<IRunnerOptions, 'envData'>>;

    public constructor(opts: IRunnerOptions = {}) {

        this._opts = {
            'cacheTtl': (opts.cacheTtl ?? DEFAULT_CACHE_TTL) * 1000,
            'maxCacheScripts': opts.maxCacheScripts ?? DEFAULT_MAX_CACHE_SIZE,
            'gcReservedPercentage': opts.gcReservedPercentage ?? DEFAULT_GC_RESERVED_PCT,
            'maxQueueDepth': opts.maxQueueDepth ?? DEFAULT_MAX_QUEUE_DEPTH,
            'gcRunRatio': opts.gcRunRatio ?? DEFAULT_GC_RUN_RATIO,
        };

        if (typeof opts.envData === 'function') {

            this._makeEnvData = opts.envData;
        }
        else {

            opts.envData ??= {};
            this._makeEnvData = () => ({ ...opts.envData });
        }
    }

    public prepare(args: dExe.IRunTaskArgs): dExe.IRunnerPrepareResult | null {

        const script = this._scripts[args.jobId];

        if (script?.edition !== args.source!.updatedAt) {

            this._scripts[args.jobId] = {
                'jobId': args.jobId,
                'edition': args.source!.updatedAt,
                'expiringAt': Date.now() + this._opts.cacheTtl,
                'execute': this._createAsyncFunction(['args', 'envData', 'ctx'], args.source!.code),
                // 'execute': new Function('args', 'envData', 'ctx', args.source!.code) as IScriptExecutor,
            };
        }

        if (Math.random() < this._opts.gcRunRatio) {

            this._gc();
        }

        return { 'maxQueueDepth': this._opts.maxQueueDepth };
    }

    private _createAsyncFunction(args: string[], code: string): IScriptExecutor {

        const fnBody = `return async (args, envData, ctx) => { ${code} };`;
        return (new Function(...args, fnBody))() as IScriptExecutor;
    }

    private _gc(): void {

        const NOW = Date.now();
        const keys = Object.keys(this._scripts);
        let removed = 0;

        for (const key of keys) {

            const script = this._scripts[key];

            if (script.expiringAt <= NOW) {

                delete this._scripts[key];
                removed++;
            }
        }

        const maxToKeep = Math.floor(this._opts.maxCacheScripts * (this._opts.gcReservedPercentage / 100));

        if (keys.length - removed > maxToKeep) {

            const sortedKeys = keys.sort((a, b) => this._scripts[a].expiringAt - this._scripts[b].expiringAt);
            const toRemove = sortedKeys.slice(0, maxToKeep); // Keep the oldest scripts

            for (const key of toRemove) {
                delete this._scripts[key];
            }
        }
    }

    public async run(ctx: dExe.IContext): Promise<void> {

        const handler = this._scripts[ctx.task.jobId];

        if (!handler) {

            throw new eL.E_HANDLER_NOT_FOUND({ name: ctx.task.name, type: this.type });
        }

        const result = handler.execute(ctx.task.args ?? '', this._makeEnvData(), ctx);

        if (result instanceof Promise) {

            await result;
        }
    }
}
