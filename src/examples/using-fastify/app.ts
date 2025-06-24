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

import * as LibXJ from '../../lib';
import { XxlJobBeanHandlerRunner } from '../../lib/JobRunner/Bean';
import * as LibXjFastify from '../../lib/Listener/Fastify';
import * as NodeTimer from 'node:timers/promises';
import { XxlJobNodeJsInProcessHandlerRunner } from '../../lib/JobRunner/NodeJsInProcess';
import { MemoryLogManager } from '../../lib/LogManagers/MemoryLogManager';

const nodejsRunner = new XxlJobNodeJsInProcessHandlerRunner({
    envData: { test: '1234' }
});

const beanRunner = new XxlJobBeanHandlerRunner();

beanRunner.add({
    'name': 'test1',
    'maxQueueDepth': 2,
    'callback': async (ctx) => {

        for (let i = 0; i < 5; i++) {
            if (!ctx.isActive()) {
                ctx.log('info', `Job test1 is stopped at iteration ${i}`);
                return;
            }
            ctx.log('info', `Job test1 is running at iteration ${i}`);
            await NodeTimer.setTimeout(1000, undefined, {
                signal: ctx.signal,
            });
        }

        // throw error if you want to test error handling
    },
});

const adminApiClient = LibXJ.createAdminApiClient({
    'apiToken': process.env.XXL_JOB_TEST_API_TOKEN ?? 'default_token',
    'baseUrl': process.env.XXL_JOB_TEST_ADMIN_BASEURL ?? 'http://localhost:7070/xxl-job-admin',
});

const logger = new MemoryLogManager({ maxAgeMs: 300000, timerIntervalMs: 60000 });

logger.startTimer();

const executor = LibXJ.createExecutor({
    adminApiClient: adminApiClient,
    logManager: logger,
});

executor.registerRunner([beanRunner, nodejsRunner]);

(async () => {

    await LibXjFastify.create(executor, {
        port: 28582,
        host: '0.0.0.0',
    });

    const register = LibXJ.createRegisterAgent(
        process.env.XXL_JOB_TEST_APP_NAME ?? 'my-test-app-1',
        process.env.XXL_JOB_TEST_APP_URL ?? 'http://192.168.137.2:28582',
        adminApiClient,
    );

    await register.register(true);

    console.log('XXL-JOB Executor is running on http://localhost:28582');
})();
