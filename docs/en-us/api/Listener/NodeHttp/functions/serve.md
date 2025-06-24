[Documents for @litert/xxl-job-integration](../../../index.md) / [Listener/NodeHttp](../index.md) / serve

# Function: serve()

> **serve**(`router`, `executor`, `prefix`): `void`

Defined in: [src/lib/Listener/NodeHttp.ts:50](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Listener/NodeHttp.ts#L50)

Bind the XXL-Job executor API to the a HTTP server router.

## Parameters

### router

[`IRouter`](../interfaces/IRouter.md)

The HTTP router to register the API endpoints.

### executor

[`IExecutor`](../../../Executor/Typings/interfaces/IExecutor.md)

The XXL-Job executor instance to handle the API requests.

### prefix

`string` = `''`

The URL path prefix for the API endpoints [default:""].

## Returns

`void`
