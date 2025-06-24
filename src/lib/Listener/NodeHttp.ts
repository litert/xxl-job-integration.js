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

import * as NodeHttp from 'node:http';
import type { IExecutor } from '../Executor';
import { ExecutorApi, IApiReplyBase } from '../ApiSchema';
import { BackgroundRunner } from '@litert/utils-async';
import { EApiResultCode } from '../Errors';
import { TOKEN_HEADER } from '../Constants';

function authenticate(
    request: NodeHttp.IncomingMessage,
    reply: NodeHttp.ServerResponse,
    executor: IExecutor
): boolean {

    if (!executor.validateApiToken(request.headers[TOKEN_HEADER] as string)) {

        reply.writeHead(401, { 'Content-Type': 'application/json' });
        reply.end(JSON.stringify({
            'code': EApiResultCode.UNAUTHORIZED,
            'msg': 'Unauthorized access to the API.'
        } satisfies IApiReplyBase));
        return false;
    }

    return true;
}

/**
 * Bind the XXL-Job executor API to the a HTTP server router.
 *
 * @param router        The HTTP router to register the API endpoints.
 * @param executor      The XXL-Job executor instance to handle the API requests.
 * @param prefix        The URL path prefix for the API endpoints [default:""].
 */
export function serve(router: IRouter, executor: IExecutor, prefix: string = ''): void {

    router.register('POST', prefix + ExecutorApi.EApiEntry.HEARTBEAT, function(request, reply) {

        if (!authenticate(request, reply, executor)) {
            return;
        }

        sendReply(reply, EApiResultCode.OK, null);
    });

    router.register('POST', prefix + ExecutorApi.EApiEntry.RUN_JOB, async function(request, reply) {

        if (!authenticate(request, reply, executor)) {
            return;
        }

        try {

            const args = await fetchHttpBodyAsJson(request) as ExecutorApi.IRunJobArgs;

            if (!ExecutorApi.Validation.isValidRunJobArgs(args)) {
                sendReply(reply, EApiResultCode.BAD_REQUEST, 'Invalid parameters.');
                return;
            }

            const result = executor.enqueueTask({
                'args': args.executorParams,
                'type': args.glueType,
                'name': args.executorHandler,
                'strategyOnBlocked': args.executorBlockStrategy,
                'requestedAt': args.logDateTime,
                'taskId': args.logId,
                'jobId': args.jobId,
                'source': args.glueSource ? {
                    'code': args.glueSource,
                    'updatedAt': args.glueUpdatetime
                } : undefined,
                'timeoutSec': args.executorTimeout,
            });

            sendReply(reply, result.error.code, result.error.msg);
        }
        catch (e) {

            sendReply(reply, 500, (e as Error).message);
        }
    });

    router.register('POST', prefix + ExecutorApi.EApiEntry.DETECT_JOB, async function(request, reply) {

        if (!authenticate(request, reply, executor)) {
            return;
        }

        try {

            const args = await fetchHttpBodyAsJson(request) as ExecutorApi.IDetectJobArgs;

            if (!ExecutorApi.Validation.isValidDetectJobArgs(args)) {
                sendReply(reply, EApiResultCode.BAD_REQUEST, 'Invalid parameters.');
                return;
            }

            const result = executor.checkJobStatus(args.jobId);

            sendReply(reply, result.error.code, result.error.msg);
        }
        catch (e) {

            sendReply(reply, 500, (e as Error).message);
        }
    });

    router.register('POST', prefix + ExecutorApi.EApiEntry.KILL_JOB, async function(request, reply) {

        if (!authenticate(request, reply, executor)) {
            return;
        }

        try {
            const args = await fetchHttpBodyAsJson(request) as ExecutorApi.IKillJobArgs;

            if (!ExecutorApi.Validation.isValidKillJobArgs(args)) {
                sendReply(reply, EApiResultCode.BAD_REQUEST, 'Invalid parameters.');
                return;
            }

            const result = executor.killJob(args.jobId);

            sendReply(reply, result.error.code, result.error.msg);
        }
        catch (e) {

            sendReply(reply, 500, (e as Error).message);
        }
    });

    router.register('POST', prefix + ExecutorApi.EApiEntry.QUERY_JOB_LOG, async function(request, reply) {

        if (!authenticate(request, reply, executor)) {

            return;
        }

        try {

            const args = await fetchHttpBodyAsJson(request) as ExecutorApi.IQueryJobLogArgs;

            if (!ExecutorApi.Validation.isValidQueryJobLogArgs(args)) {
                sendReply(reply, EApiResultCode.BAD_REQUEST, 'Invalid parameters.');
                return;
            }

            const result = await executor.getTaskLog(args.logId, args.fromLineNum, args.logDateTim);

            if (result.error.code !== EApiResultCode.OK) {

                sendReply(reply, result.error.code, result.error.msg);
            }
            else {

                sendReply(reply, result.error.code, result.error.msg, {
                    'fromLineNum': result.data!.startLine,
                    'isEnd': !result.data!.hasMore,
                    'toLineNum': result.data!.endLine,
                    'logContent': result.data!.content
                });
            }
        }
        catch (e) {

            sendReply(reply, 500, (e as Error).message);
        }
    });
}

/**
 * The handler function type for HTTP requests.
 */
export type IHttpHandler = (request: NodeHttp.IncomingMessage, reply: NodeHttp.ServerResponse) => void | Promise<void>;

/**
 * The interface for a HTTP router.
 */
export interface IRouter {

    /**
     * Register a handler for a specific HTTP method and path.
     *
     * @param method    The HTTP method (e.g., 'GET', 'POST').
     * @param path      The path to match, without trailing slashes.
     * @param handler   The handler function to call when the method and path match.
     */
    register(method: string, path: string, handler: IHttpHandler): void;
}

/**
 * The options for creating a server listener.
 */
export interface IListenOptions {

    /**
     * The port to listen on.
     */
    port: number;

    /**
     * The host to bind the server to.
     */
    host: string;

    /**
     * The maximum number of pending connections in the queue.
     * Defaults to 511 if not specified.
     */
    backlog?: number;
}

/**
 * Create a new HTTP server, and bind it to the given executor manager.
 *
 * @param executor       The executor to bind the server to.
 * @param listenOpts     The options for creating the server listener.
 *
 * @returns The created HTTP server instance. **Don't forget to listen on the `error` event of the server.**
 */
export async function create(
    executor: IExecutor,
    listenOpts: IListenOptions,
): Promise<NodeHttp.Server> {

    const router = new HttpSimpleRouter();
    const bgRunner = new BackgroundRunner();

    serve(router, executor);

    const server = NodeHttp.createServer(function(request, reply) {

        try {

            const ret = router.handle(request, reply);

            bgRunner.run(async () => {

                try {

                    await ret;
                }
                catch {

                    onHandlerError(reply);
                }
            });
        }
        catch {

            onHandlerError(reply);
        }
    });

    bgRunner.on('error', (err) => { server.emit('error', err); });

    return new Promise<NodeHttp.Server>((resolve, reject) => {

        const onError = (err: Error): void => { reject(err); };

        server.on('error', onError);

        server.listen(listenOpts.port, listenOpts.host, listenOpts.backlog ?? 511, () => {
            server.off('error', onError);
            resolve(server);
        });

        return server;
    });
}

class HttpSimpleRouter implements IRouter {

    private readonly _handlers: Record<string, IHttpHandler> = {};

    public register(method: string, path: string, handler: IHttpHandler): void {
        const key = `${method.toUpperCase()} ${path.replace(/\/+$/, '') || '/'}`;
        this._handlers[key] = handler;
    }

    public handle(request: NodeHttp.IncomingMessage, reply: NodeHttp.ServerResponse): void | Promise<void> {

        const path = request.url!.split('?')[0].replace(/\/+$/, '') || '/';

        const key = `${request.method!} ${path}`;
        const handler = this._handlers[key];

        if (handler) {
            return handler(request, reply);
        }
        else {
            reply.writeHead(404).end('Not Found');
        }
    }
}

function onHandlerError(reply: NodeHttp.ServerResponse): void {

    if (!reply.headersSent) {

        reply.writeHead(500).end('Internal Server Error');
    }
    else {

        reply.end();
    }
}

function sendReply(
    reply: NodeHttp.ServerResponse,
    code: number,
    msg: string | null,
    content?: unknown
): void {

    const response: IApiReplyBase = { code, msg };

    if (content !== undefined) {
        (response as any).content = content;
    }

    if (!reply.headersSent) {
        reply.writeHead(code, { 'Content-Type': 'application/json' });
        reply.end(JSON.stringify(response));
    }
    else {

        reply.end();
    }
}

function fetchHttpBodyAsJson(req: NodeHttp.IncomingMessage, timeout: number = 5000): Promise<unknown> {

    return new Promise((resolve, reject) => {

        const chunks: Buffer[] = [];

        req.setTimeout(timeout, () => { req.destroy(new Error('Request timeout')); });

        req.on('error', (err: Error) => { reject(err); });

        req.on('data', (chunk: Buffer) => chunks.push(chunk));

        req.on('end', () => {

            try {

                const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                resolve(body);
            }
            catch (e) {

                reject(e);
            }
        });
    });
}
