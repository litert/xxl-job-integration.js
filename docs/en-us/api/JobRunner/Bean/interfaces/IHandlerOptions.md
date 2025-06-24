[Documents for @litert/xxl-job-integration](../../../index.md) / [JobRunner/Bean](../index.md) / IHandlerOptions

# Interface: IHandlerOptions

Defined in: [src/lib/JobRunner/Bean.ts:29](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/Bean.ts#L29)

The options for registering a job handler.

## Properties

### callback

> **callback**: [`IJobHandlerCallback`](../type-aliases/IJobHandlerCallback.md)

Defined in: [src/lib/JobRunner/Bean.ts:39](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/Bean.ts#L39)

The handler function that will be called when the job is executed.

***

### maxQueueDepth?

> `optional` **maxQueueDepth**: `number`

Defined in: [src/lib/JobRunner/Bean.ts:46](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/Bean.ts#L46)

How many task could be queued for the handler.

#### Default

```ts
10
```

***

### name

> **name**: `string`

Defined in: [src/lib/JobRunner/Bean.ts:34](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/Bean.ts#L34)

The name of the job handler, which must be unique.
