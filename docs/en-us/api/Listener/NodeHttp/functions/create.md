[Documents for @litert/xxl-job-integration](../../../index.md) / [Listener/NodeHttp](../index.md) / create

# Function: create()

> **create**(`executor`, `listenOpts`): `Promise`\<`Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>\>

Defined in: [src/lib/Listener/NodeHttp.ts:237](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Listener/NodeHttp.ts#L237)

Create a new HTTP server, and bind it to the given executor manager.

## Parameters

### executor

[`IExecutor`](../../../Executor/Typings/interfaces/IExecutor.md)

The executor to bind the server to.

### listenOpts

[`IListenOptions`](../interfaces/IListenOptions.md)

The options for creating the server listener.

## Returns

`Promise`\<`Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>\>

The created HTTP server instance. **Don't forget to listen on the `error` event of the server.**
