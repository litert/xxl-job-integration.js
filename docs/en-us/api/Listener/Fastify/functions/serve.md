[Documents for @litert/xxl-job-integration](../../../index.md) / [Listener/Fastify](../index.md) / serve

# Function: serve()

> **serve**(`fastify`, `executor`, `prefix`): `void`

Defined in: [src/lib/Listener/Fastify.ts:52](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Listener/Fastify.ts#L52)

Bind the XXL-Job executor API to the Fastify instance.

> To use this listener, you need to install the `fastify` package:

## Parameters

### fastify

`FastifyInstance`

The Fastify instance to bind the API to.

### executor

[`IExecutor`](../../../Executor/Typings/interfaces/IExecutor.md)

The XXL-Job executor instance to handle the API requests.

### prefix

`string` = `''`

The URL path prefix for the API endpoints [default:""].

## Returns

`void`
