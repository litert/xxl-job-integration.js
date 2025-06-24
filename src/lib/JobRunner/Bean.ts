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

/**
 * The function signature type of the job handler callback.
 */
export type IJobHandlerCallback = (ctx: dExe.IContext) => Promise<void> | void;

/**
 * The options for registering a job handler.
 */
export interface IHandlerOptions {

    /**
     * The name of the job handler, which must be unique.
     */
    name: string;

    /**
     * The handler function that will be called when the job is executed.
     */
    callback: IJobHandlerCallback;

    /**
     * How many task could be queued for the handler.
     *
     * @default 10
     */
    maxQueueDepth?: number;
}

/**
 * The job runner that handles job execution using registered bean handlers.
 */
export class XxlJobBeanHandlerRunner implements dExe.IJobRunner {

    public readonly type: cL.EJobType = cL.EJobType.BEAN;

    private readonly _handlers: Record<string, Required<IHandlerOptions>> = {};

    public prepare(args: dExe.IRunTaskArgs): dExe.IRunnerPrepareResult | null {

        const handler = this._handlers[args.name];

        if (!handler) {
            return null;
        }

        return { 'maxQueueDepth': handler.maxQueueDepth };
    }

    public add(opts: IHandlerOptions): void {

        if (this._handlers[opts.name]) {

            throw new eL.E_HANDLER_FOUND({ name: opts.name, type: this.type });
        }

        this._handlers[opts.name] = {
            'name': opts.name,
            'callback': opts.callback,
            'maxQueueDepth': opts.maxQueueDepth ?? cL.DEFAULT_MAX_QUEUE_DEPTH,
        };
    }

    public remove(name: string): void {

        delete this._handlers[name];
    }

    public async run(ctx: dExe.IContext): Promise<void> {

        const handler = this._handlers[ctx.task.name];

        if (!handler) {

            throw new eL.E_HANDLER_NOT_FOUND({ name: ctx.task.name, type: this.type });
        }

        const result = handler.callback(ctx);

        if (result instanceof Promise) {
            await result;
        }
    }
}
