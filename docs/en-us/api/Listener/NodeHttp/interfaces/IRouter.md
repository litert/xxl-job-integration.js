[Documents for @litert/xxl-job-integration](../../../index.md) / [Listener/NodeHttp](../index.md) / IRouter

# Interface: IRouter

Defined in: [src/lib/Listener/NodeHttp.ts:195](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Listener/NodeHttp.ts#L195)

The interface for a HTTP router.

## Methods

### register()

> **register**(`method`, `path`, `handler`): `void`

Defined in: [src/lib/Listener/NodeHttp.ts:204](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Listener/NodeHttp.ts#L204)

Register a handler for a specific HTTP method and path.

#### Parameters

##### method

`string`

The HTTP method (e.g., 'GET', 'POST').

##### path

`string`

The path to match, without trailing slashes.

##### handler

[`IHttpHandler`](../type-aliases/IHttpHandler.md)

The handler function to call when the method and path match.

#### Returns

`void`
