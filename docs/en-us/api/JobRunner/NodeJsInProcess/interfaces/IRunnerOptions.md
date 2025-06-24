[Documents for @litert/xxl-job-integration](../../../index.md) / [JobRunner/NodeJsInProcess](../index.md) / IRunnerOptions

# Interface: IRunnerOptions

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:39](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L39)

The options for the Node.js script runner.

## Properties

### cacheTtl?

> `optional` **cacheTtl**: `number`

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:53](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L53)

The time-to-live (TTL) of each cached script in seconds.

#### Default

```ts
3600 (30 minutes)
```

***

### envData?

> `optional` **envData**: `IScriptEnvData` \| () => `IScriptEnvData`

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:46](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L46)

The (generator of) environment data that will be passed to the js script when it is executed.

#### Default

```ts
() => {}
```

***

### gcReservedPercentage?

> `optional` **gcReservedPercentage**: `number`

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:68](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L68)

How many percentage of the cached scripts should be kept when the garbage collector runs
due to the cache size limit.

#### Default

```ts
60%
```

***

### gcRunRatio?

> `optional` **gcRunRatio**: `number`

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:82](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L82)

The ratio of the garbage collector to run.

#### Default

```ts
0.5
```

***

### maxCacheScripts?

> `optional` **maxCacheScripts**: `number`

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:60](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L60)

The maximum quantity of the cache for the scripts.

#### Default

```ts
100
```

***

### maxQueueDepth?

> `optional` **maxQueueDepth**: `number`

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:75](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L75)

The maximum queue depth for the job handlers.

#### Default

```ts
10
```
