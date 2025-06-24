[Documents for @litert/xxl-job-integration](../../../index.md) / [Listener/NodeHttp](../index.md) / IHttpHandler

# Type Alias: IHttpHandler()

> **IHttpHandler** = (`request`, `reply`) => `void` \| `Promise`\<`void`\>

Defined in: [src/lib/Listener/NodeHttp.ts:190](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Listener/NodeHttp.ts#L190)

The handler function type for HTTP requests.

## Parameters

### request

`NodeHttp.IncomingMessage`

### reply

`NodeHttp.ServerResponse`

## Returns

`void` \| `Promise`\<`void`\>
