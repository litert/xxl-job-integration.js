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
import * as LibXjNodeHttp from '../../lib/Listener/NodeHttp';
import * as NodeTimer from 'node:timers/promises';
import { AddressInfo } from 'node:net';
import { XxlJobNodeJsInProcessHandlerRunner } from '../../lib/JobRunner/NodeJsInProcess';
import { FileLogCleaner, FileLogManager } from '../../lib/LogManagers/FileLogManager';

const nodejsRunner = new XxlJobNodeJsInProcessHandlerRunner({
    envData: { test: '1234' }
});

const beanRunner = new XxlJobBeanHandlerRunner();

beanRunner.add({
    'name': 'test1',
    'maxQueueDepth': 20,
    'callback': async (ctx) => {

        const endTime = Date.now() + 30000; // Run for 30 seconds
        for (let i = 0; Date.now() < endTime; i++) {
            if (!ctx.isActive()) {
                ctx.log('info', `Job (Task#${ctx.task.taskId}) test1 is stopped at iteration ${i}`);
                return;
            }
            ctx.log('info', `Job (Task#${ctx.task.taskId}) test1 is running at iteration ${i}`);
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

const LOG_OUTPUT_DIR = `${__dirname}/../../test-env/executor-logs`;

const logCleaner = new FileLogCleaner({
    logDir: LOG_OUTPUT_DIR,
    maxAgeMs: 300 * 1000,
    timerIntervalMs: 300_000,
});

logCleaner.on('error', (e) => {

    console.error('Log cleaner error:', e);
});

logCleaner.on('cleaned', (f, time) => {

    console.info(`Log cleaner cleaned file: ${f} (created at: ${new Date(time).toISOString()})`);
});

logCleaner.start();

const executor = LibXJ.createExecutor({
    adminApiClient: adminApiClient,
    logManager: new FileLogManager({ logDir: LOG_OUTPUT_DIR }),
});

executor.registerRunner([beanRunner, nodejsRunner]);

executor.on('error', (e) => {
    console.error('Executor error:', e);
});

(async () => {

    const server = await LibXjNodeHttp.create(executor, {
        port: 0,
        host: '0.0.0.0',
    });

    const serverPort = (server.address() as AddressInfo).port;

    const register = LibXJ.createRegisterAgent(
        process.env.XXL_JOB_TEST_APP_NAME ?? 'my-test-app-1',
        process.env.XXL_JOB_TEST_APP_URL ?? `http://192.168.137.2:${serverPort}`,
        adminApiClient,
    );

    await register.register();

    register.startKeepAlive();

    console.log('XXL-JOB Executor is running on http://localhost:' + serverPort);
})();
