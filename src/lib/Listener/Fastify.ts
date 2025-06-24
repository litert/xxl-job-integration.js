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

import Fastify, {
    type FastifyServerOptions,
    type FastifyInstance,
    type FastifyListenOptions,
    type FastifyReply,
    type FastifyRequest,
} from 'fastify';
import type { IExecutor } from '../Executor';
import { ExecutorApi, IApiReplyBase } from '../ApiSchema';
import { EApiResultCode } from '../Errors';
import { TOKEN_HEADER } from '../Constants';

function authenticate(request: FastifyRequest, reply: FastifyReply, executor: IExecutor): boolean {

    if (!executor.validateApiToken(request.headers[TOKEN_HEADER] as string)) {

        reply.send({
            'code': EApiResultCode.UNAUTHORIZED,
            'msg': 'Unauthorized access to the API.'
        } satisfies IApiReplyBase);
        return false;
    }

    return true;
}

/**
 * Bind the XXL-Job executor API to the Fastify instance.
 *
 * > To use this listener, you need to install the `fastify` package:
 *
 * @param fastify       The Fastify instance to bind the API to.
 * @param executor      The XXL-Job executor instance to handle the API requests.
 * @param prefix        The URL path prefix for the API endpoints [default:""].
 */
export function serve(fastify: FastifyInstance, executor: IExecutor, prefix: string = ''): void {

    fastify.post(prefix + ExecutorApi.EApiEntry.HEARTBEAT, function(request, reply) {

        if (!authenticate(request, reply, executor)) {
            return;
        }

        reply.send({ code: EApiResultCode.OK, msg: null } satisfies IApiReplyBase);
    });

    fastify.post(prefix + ExecutorApi.EApiEntry.RUN_JOB, function(request, reply) {

        if (!authenticate(request, reply, executor)) {
            return;
        }

        try {

            const args = request.body as ExecutorApi.IRunJobArgs;

            if (!ExecutorApi.Validation.isValidRunJobArgs(args)) {

                reply.send({ 'code': EApiResultCode.BAD_REQUEST, 'msg': 'Invalid parameters.' } satisfies IApiReplyBase);
                return;
            }

            const result = executor.enqueueTask({
                'args': args.executorParams,
                'type': args.glueType,
                'name': args.executorHandler,
                'requestedAt': args.logDateTime,
                'strategyOnBlocked': args.executorBlockStrategy,
                'taskId': args.logId,
                'jobId': args.jobId,
                'source': args.glueSource ? {
                    'code': args.glueSource,
                    'updatedAt': args.glueUpdatetime
                } : undefined,
                'timeoutSec': args.executorTimeout,
            });

            reply.send({
                'code': result.error.code,
                'msg': result.error.msg,
            } satisfies IApiReplyBase);
        }
        catch (e) {

            reply.send({
                'code': 500,
                'msg': (e as Error).message
            } satisfies IApiReplyBase);
        }
    });

    fastify.post(prefix + ExecutorApi.EApiEntry.DETECT_JOB, function(request, reply) {

        if (!authenticate(request, reply, executor)) {
            return;
        }

        try {

            const args = request.body as ExecutorApi.IDetectJobArgs;

            if (!ExecutorApi.Validation.isValidDetectJobArgs(args)) {

                reply.send({ 'code': EApiResultCode.BAD_REQUEST, 'msg': 'Invalid parameters.' } satisfies IApiReplyBase);
                return;
            }

            const result = executor.checkJobStatus(args.jobId);

            reply.send({
                'code': result.error.code,
                'msg': result.error.msg,
            } satisfies IApiReplyBase);
        }
        catch (e) {

            reply.send({
                'code': 500,
                'msg': (e as Error).message
            } satisfies IApiReplyBase);
        }
    });

    fastify.post(prefix + ExecutorApi.EApiEntry.KILL_JOB, function(request, reply) {

        if (!authenticate(request, reply, executor)) {
            return;
        }

        try {
            const args = request.body as ExecutorApi.IDetectJobArgs;

            if (!ExecutorApi.Validation.isValidKillJobArgs(args)) {

                reply.send({ 'code': EApiResultCode.BAD_REQUEST, 'msg': 'Invalid parameters.' } satisfies IApiReplyBase);
                return;
            }

            const result = executor.killJob(args.jobId);

            reply.send({
                'code': result.error.code,
                'msg': result.error.msg,
            } satisfies IApiReplyBase);
        }
        catch (e) {

            reply.send({
                'code': 500,
                'msg': (e as Error).message
            } satisfies IApiReplyBase);
        }
    });

    fastify.post(prefix + ExecutorApi.EApiEntry.QUERY_JOB_LOG, async function(request, reply) {

        if (!authenticate(request, reply, executor)) {
            return;
        }

        try {

            const args = request.body as ExecutorApi.IQueryJobLogArgs;

            if (!ExecutorApi.Validation.isValidQueryJobLogArgs(args)) {

                reply.send({ 'code': EApiResultCode.BAD_REQUEST, 'msg': 'Invalid parameters.' } satisfies IApiReplyBase);
                return;
            }

            const result = await executor.getTaskLog(args.logId, args.fromLineNum, args.logDateTim);

            if (result.error.code !== EApiResultCode.OK) {

                reply.send({
                    'code': result.error.code,
                    'msg': result.error.msg,
                } satisfies IApiReplyBase);
            }
            else {

                reply.send({
                    'code': result.error.code,
                    'msg': result.error.msg,
                    'content': {
                        'fromLineNum': result.data!.startLine,
                        'isEnd': !result.data!.hasMore,
                        'toLineNum': result.data!.endLine,
                        'logContent': result.data!.content
                    }
                } satisfies ExecutorApi.IQueryJobLogReply);
            }
        }
        catch (e) {

            reply.send({
                'code': 500,
                'msg': (e as Error).message
            } satisfies IApiReplyBase);
        }
    });
}

/**
 * Create a new fastify instance and bind the XXL-Job executor API to it.
 *
 * > To use this listener, you need to install the `fastify` package:
 *
 * @param executor      The XXL-Job executor instance to handle the API requests.
 * @param listenOpts    The options for the Fastify server to listen on.
 * @param fastifyOpts   The options for the Fastify server instance.
 *
 * @returns The created Fastify instance.
 */
export async function create(
    executor: IExecutor,
    listenOpts: FastifyListenOptions,
    fastifyOpts: FastifyServerOptions = { logger: true }
): Promise<FastifyInstance> {

    const inst = Fastify(fastifyOpts);

    serve(inst, executor);

    return new Promise<FastifyInstance>((resolve, reject) => {

        inst.listen(listenOpts, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(inst);
            }
        });
    });
}
