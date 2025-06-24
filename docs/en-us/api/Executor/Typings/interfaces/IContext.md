[Documents for @litert/xxl-job-integration](../../../index.md) / [Executor/Typings](../index.md) / IContext

# Interface: IContext

Defined in: [src/lib/Executor/Typings.ts:23](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L23)

The context object passed to the job runner when running a task.

## Properties

### notAfter

> `readonly` **notAfter**: `number`

Defined in: [src/lib/Executor/Typings.ts:33](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L33)

The task should stop running after this time, as a UNIX timestamp in milliseconds.

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [src/lib/Executor/Typings.ts:40](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L40)

The signal to abort the task.

The handler can watch this signal to check if the task has been aborted by timeout or by a kill request.

***

### task

> `readonly` **task**: [`IRunTaskArgs`](../type-aliases/IRunTaskArgs.md)

Defined in: [src/lib/Executor/Typings.ts:28](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L28)

The information of the current task.

## Methods

### isActive()

> **isActive**(): `boolean`

Defined in: [src/lib/Executor/Typings.ts:58](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L58)

Check if the task is still active.

#### Returns

`boolean`

***

### isClosed()

> **isClosed**(): `boolean`

Defined in: [src/lib/Executor/Typings.ts:53](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L53)

Check if the task is closed (e.g. by a timeout or a kill request).

#### Returns

`boolean`

***

### log()

> **log**(`level`, `message`): `void`

Defined in: [src/lib/Executor/Typings.ts:48](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L48)

Write a line of log message to the task log storage.

#### Parameters

##### level

`string`

The log level (depending on the application, e.g. 'info', 'warn', 'error').

##### message

`string`

The log message to write.

#### Returns

`void`
