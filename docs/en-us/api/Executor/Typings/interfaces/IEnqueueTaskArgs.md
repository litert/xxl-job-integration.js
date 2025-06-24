[Documents for @litert/xxl-job-integration](../../../index.md) / [Executor/Typings](../index.md) / IEnqueueTaskArgs

# Interface: IEnqueueTaskArgs

Defined in: [src/lib/Executor/Typings.ts:81](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L81)

The arguments for executors, to put a task to the queue.

## Properties

### args

> `readonly` **args**: `null` \| `string`

Defined in: [src/lib/Executor/Typings.ts:98](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L98)

The arguments for the job, which is configured in the xxl-job-admin.

***

### jobId

> `readonly` **jobId**: `number`

Defined in: [src/lib/Executor/Typings.ts:88](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L88)

The job ID, which is unique, registered in the xxl-job-admin.

***

### name

> `readonly` **name**: `string`

Defined in: [src/lib/Executor/Typings.ts:105](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L105)

The name of the handler to run.

> Only available for `EJobType.BEAN` jobs.

***

### requestedAt

> `readonly` **requestedAt**: `number`

Defined in: [src/lib/Executor/Typings.ts:143](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L143)

The time when the job was requested to run, as a UNIX timestamp in milliseconds.

***

### source?

> `readonly` `optional` **source**: `object`

Defined in: [src/lib/Executor/Typings.ts:117](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L117)

The source code of the job to be executed.

> Only available for `EJobType.NODE_JS` jobs.

#### code

> `readonly` **code**: `string`

The content of source code of the job.

#### updatedAt

> `readonly` **updatedAt**: `number`

When the source code was last updated, as a UNIX timestamp in milliseconds.

***

### strategyOnBlocked

> `readonly` **strategyOnBlocked**: [`EExecutorBlockStrategy`](../../../Constants/enumerations/EExecutorBlockStrategy.md)

Defined in: [src/lib/Executor/Typings.ts:110](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L110)

The strategy to use when the job is already running on the executor.

***

### taskId

> `readonly` **taskId**: `number`

Defined in: [src/lib/Executor/Typings.ts:133](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L133)

The task ID, which is unique for each task.

***

### timeoutSec

> `readonly` **timeoutSec**: `number`

Defined in: [src/lib/Executor/Typings.ts:138](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L138)

The timeout for the job in seconds.

***

### type

> `readonly` **type**: [`EJobType`](../../../Constants/enumerations/EJobType.md)

Defined in: [src/lib/Executor/Typings.ts:93](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L93)

The type of the job (runner).
