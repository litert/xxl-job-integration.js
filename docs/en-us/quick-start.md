# Quick Start

## Overview

This guide will help you quick start with the basic usage of the library.
For more detailed information, please refer to the [API documentation](https://litert.org/projects/xxl-job-integration.js/api/).

## Installation

You can install the library using npm:

```bash
npm install @litert/xxl-job-integration
```

## Importing the Library

This library provides following components for integration with XXL Job:

- Main Framework

    The module exports the main framework for XXL Job integration by default (index.js).

    - Executor

        The component that accepts the task requests and executes the tasks.

    - Admin API Client

        The API client that communicates with the XXL Job Admin server.

    - Register Agent

        The component that registers the executor with the XXL Job Admin server,
        and keeps the registration alive.

    Let's import the framework firstly:

    ```ts
    import * as LibXJ from '@litert/xxl-job-integration';
    ```

- Components

    And some optional/replaceable components that should be imported and used separately:

    - HTTP Listener

        The component that listens for HTTP requests from the XXL Job Admin server.

        - [Using `node:http` module](https://litert.org/projects/xxl-job-integration.js/api/Listener/NodeHttp/)

            ```ts
            import * as NodeHttpListener from '@litert/xxl-job-integration/lib/Listener/NodeHttp';
            ```

        - [Using `fastify` framework](https://litert.org/projects/xxl-job-integration.js/api/Listener/Fastify/)

            ```ts
            import * as FastifyListener from '@litert/xxl-job-integration/lib/Listener/Fastify';
            ```

    - Log Manager

        The component that manages the logs of the executed tasks.

        - [MemoryLogManager](https://litert.org/projects/xxl-job-integration.js/api/LogManagers/MemoryLogManager/)

            ```ts
            import * as MemoryLogs from '@litert/xxl-job-integration/lib/LogManagers/MemoryLogManager';
            ```

        - [FileLogManager](https://litert.org/projects/xxl-job-integration.js/api/LogManagers/FileLogManager/)

            ```ts
            import * as FileLogs from '@litert/xxl-job-integration/lib/LogManagers/FileLogManager';
            ```

    - Job Runner

        The component that runs the tasks of determined type.

        The XXL-Job admin server supports multiple types of tasks. By now, the built-in job runner contains the following types:

        - [Bean Runner](https://litert.org/projects/xxl-job-integration.js/api/JobRunner/Bean/)

            ```ts
            import { XxlJobBeanHandlerRunner } from '@litert/xxl-job-integration/lib/JobRunner/Bean';
            ```

        - [NodeJS In-Process Runner](https://litert.org/projects/xxl-job-integration.js/api/JobRunner/NodeJsInProcess/)

            ```ts
            import { XxlJobNodeJsInProcessHandlerRunner } from '@litert/xxl-job-integration/lib/JobRunner/NodeJsInProcess';
            ```

## First Executor Example

Here is a full example with following features:

- Using `fastify` as the HTTP listener.
- Using `MemoryLogManager` as the log manager, the logs of each task will be stored in memory.
- Using job runner of `Bean` type, writing the predefined job handler in NodeJS.
- Using job runner of `NodeJS` type, running a NodeJS script in the current process.

```ts
import * as LibXJ from '@litert/xxl-job-integration';
import { XxlJobBeanHandlerRunner } from '@litert/xxl-job-integration/lib/JobRunner/Bean';
import * as LibXjFastify from '@litert/xxl-job-integration/lib/Listener/Fastify';
import * as NodeTimer from 'node:timers/promises';
import { XxlJobNodeJsInProcessHandlerRunner } from '@litert/xxl-job-integration/lib/JobRunner/NodeJsInProcess';
import { MemoryLogManager } from '@litert/xxl-job-integration/lib/LogManagers/MemoryLogManager';

// create a in-process NodeJS script runner
// this allows you to create a job with a NodeJS script in XXL-Job Admin server,
// and the script will be executed in the current process.
const nodejsRunner = new XxlJobNodeJsInProcessHandlerRunner({
    // the environment data that will be passed to the script
    // so you can use it in the script.
    // When each task is executed, a copy of this data will be passed to the script.
    // This is useful for passing some configuration data to the script.
    // For example, you can pass some predefined data to the script.
    envData: { test: '1234' }
});

// Now let's create a bean runner, where bean is a predefined job handler written in NodeJS.
// This runner is a registry of named job handlers.
// Each job handler has a name, and can be called by the XXL-Job Admin server with the specific name.
const beanRunner = new XxlJobBeanHandlerRunner();

// Let's register a job handler named "test1".
beanRunner.add({
    'name': 'test1',
    'maxQueueDepth': 2, // At most 2 tasks can be queued for this job handler.
    'callback': async (ctx) => {

        for (let i = 0; i < 5; i++) {
            if (!ctx.isActive()) {
                ctx.log('info', `Job test1 is stopped at iteration ${i}`);
                return;
            }
            ctx.log('info', `Job test1 is running at iteration ${i}`);
            await NodeTimer.setTimeout(1000, undefined, {
                // an AbortSignal is contained in the context object
                // you can use it to control some asynchronous operations
                signal: ctx.signal,
            });
        }

        // throw error if you want to test error handling
    },
});

// Create an API client for the XXL-Job Admin server.
const adminApiClient = LibXJ.createAdminApiClient({
    'apiToken': process.env.XXL_JOB_TEST_API_TOKEN ?? 'default_token',
    'baseUrl': process.env.XXL_JOB_TEST_ADMIN_BASEURL ?? 'http://localhost:7070/xxl-job-admin',
});

// Create a log manager to manage the logs of the executed tasks.
const logger = new MemoryLogManager({ maxAgeMs: 300000, timerIntervalMs: 60000 });

// Start the log GC timer, which will clean the old logs periodically.
logger.startTimer();

// Now create the executor, just put the logger and the admin API client into the executor.
const executor = LibXJ.createExecutor({
    adminApiClient: adminApiClient,
    logManager: logger,
});

// Register the job runners to the executor.
executor.registerRunner([beanRunner, nodejsRunner]);

// Finally, create the HTTP listener using `fastify` framework,
// and bind the executor to the listener.
// The listener will listen for HTTP requests from the XXL Job Admin server.
// The executor will handle the requests and execute the tasks.
(async () => {

    // Create the HTTP listener using `fastify` framework.
    await LibXjFastify.create(executor, {
        port: 28582,
        host: '0.0.0.0',
    });

    // create a register agent to register the executor with the XXL Job Admin server
    // and keep the registration alive.
    const register = LibXJ.createRegisterAgent(
        process.env.XXL_JOB_TEST_APP_NAME ?? 'my-test-app-1',
        process.env.XXL_JOB_TEST_APP_URL ?? 'http://192.168.137.2:28582',
        adminApiClient,
    );

    // Register the executor with the XXL Job Admin server.
    // The first parameter is the flag to indicate whether to start the timer for keeping the registration alive.
    await register.register(true);

    console.log('XXL-JOB Executor is running on http://localhost:28582');
})();
```
