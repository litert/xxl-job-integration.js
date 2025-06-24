# LiteRT/XXL-Job Integration

[![Strict TypeScript Checked](https://badgen.net/badge/TS/Strict "Strict TypeScript Checked")](https://www.typescriptlang.org)
[![npm version](https://img.shields.io/npm/v/@litert/xxl-job-integration.svg?colorB=brightgreen)](https://www.npmjs.com/package/@litert/xxl-job-integration "Stable Version")
[![License](https://img.shields.io/npm/l/@litert/xxl-job-integration.svg?maxAge=2592000?style=plastic)](https://github.com/litert/xxl-job-integration.js/blob/master/LICENSE)
[![node](https://img.shields.io/node/v/@litert/xxl-job-integration.svg?colorB=brightgreen)](https://nodejs.org/dist/latest-v8.x/)
[![GitHub issues](https://img.shields.io/github/issues/litert/xxl-job-integration.js.svg)](https://github.com/litert/xxl-job-integration.js/issues)
[![GitHub Releases](https://img.shields.io/github/release/litert/xxl-job-integration.js.svg)](https://github.com/litert/xxl-job-integration.js/releases "Stable Release")

A lightweight integration of XXL-Job for NodeJS.

## Features

- [x] Completely flexible and composable

    The library is designed to be flexible and composable, allowing you to use only the features you need. And you can replace most of the components with other implementations if you want.

- [x] Glue Types

    - [x] [Bean](./src//lib/JobRunner/Bean.ts)

        Write your job handler in NodeJS, so it can be called by the XXL-Job server with a specific handler name.

    - [x] [NodeJS Script](./src/lib/JobRunner/NodeJsInProcess.ts)

        Run a NodeJS script in current process, which can be used to run a job handler written in NodeJS.

        This allows you to create extra job handlers without the need to change the executor code.

        > However, this may cause some RCE vulnerabilities if you use untrusted scripts, so be careful when using this feature.

    - [ ] Shell Script

        Not yet implemented, but will be available in the future.

    - [ ] Python Script

        Not yet implemented, but will be available in the future.

- [x] [Register Agent](./src/lib/RegisterAgent.ts)

    Automatically register the executor to the XXL-Job server and keep it alive.

- [x] Routing strategies

    - [x] FAIL_OVER
    - [x] BUSY_OVER

- [x] Log storage (with rotation support)

    - [x] Built-in: [MemoryLogManager](./src/lib/LogManagers/MemoryLogManager.ts)
    
        Store the logs in memory, which is suitable for development and testing purposes.

    - [x] Built-in: [FileLogManager](./src/lib/LogManagers/FileLogManager.ts)
    
        Store the logs in files, which is suitable for production environments. It supports log rotation based on file creation time.

    - [x] Custom logs storage

        You can also implement your own log storage to store the job logs in a persistent way as you want.

## Requirement

- TypeScript v5.0.0 (or newer)
- Node.js v18.0.0 (or newer)
- XXL-Job v3.1.0 (or newer)

    > The lower versions may work, but they are not tested and not guaranteed to work.

## Installation

```sh
npm i @litert/xxl-job-integration --save
```

## Example Usage

- [Using `node:http` and `FileLogManager` to run a job handler](./src/examples/quick-start/app.ts)
- [Using `fastify` and `MemoryLogManager` to run a job handler](./src/examples/using-fastify/app.ts)

## Documentation

- [Quick Start (en-US)](https://litert.org/projects/xxl-job-integration.js/guides/quick-start.html)

    A quick start guide to get you started with the library.

- [API Documentation (en-US)](https://litert.org/projects/xxl-job-integration.js/api.html)

    The API documentation of the library, including all the classes and methods.

## License

This library is published under [Apache-2.0](./LICENSE) license.
