[Documents for @litert/xxl-job-integration](../../../index.md) / [Listener/NodeHttp](../index.md) / IListenOptions

# Interface: IListenOptions

Defined in: [src/lib/Listener/NodeHttp.ts:210](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Listener/NodeHttp.ts#L210)

The options for creating a server listener.

## Properties

### backlog?

> `optional` **backlog**: `number`

Defined in: [src/lib/Listener/NodeHttp.ts:226](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Listener/NodeHttp.ts#L226)

The maximum number of pending connections in the queue.
Defaults to 511 if not specified.

***

### host

> **host**: `string`

Defined in: [src/lib/Listener/NodeHttp.ts:220](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Listener/NodeHttp.ts#L220)

The host to bind the server to.

***

### port

> **port**: `number`

Defined in: [src/lib/Listener/NodeHttp.ts:215](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Listener/NodeHttp.ts#L215)

The port to listen on.
