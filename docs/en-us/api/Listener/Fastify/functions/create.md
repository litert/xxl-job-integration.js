[Documents for @litert/xxl-job-integration](../../../index.md) / [Listener/Fastify](../index.md) / create

# Function: create()

> **create**(`executor`, `listenOpts`, `fastifyOpts`): `Promise`\<`FastifyInstance`\<`RawServerDefault`, `IncomingMessage`, `ServerResponse`\<`IncomingMessage`\>, `FastifyBaseLogger`, `FastifyTypeProviderDefault`\>\>

Defined in: [src/lib/Listener/Fastify.ts:231](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Listener/Fastify.ts#L231)

Create a new fastify instance and bind the XXL-Job executor API to it.

> To use this listener, you need to install the `fastify` package:

## Parameters

### executor

[`IExecutor`](../../../Executor/Typings/interfaces/IExecutor.md)

The XXL-Job executor instance to handle the API requests.

### listenOpts

`FastifyListenOptions`

The options for the Fastify server to listen on.

### fastifyOpts

`FastifyServerOptions` = `...`

The options for the Fastify server instance.

## Returns

`Promise`\<`FastifyInstance`\<`RawServerDefault`, `IncomingMessage`, `ServerResponse`\<`IncomingMessage`\>, `FastifyBaseLogger`, `FastifyTypeProviderDefault`\>\>

The created Fastify instance.
