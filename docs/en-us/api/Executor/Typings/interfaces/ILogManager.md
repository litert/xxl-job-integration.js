[Documents for @litert/xxl-job-integration](../../../index.md) / [Executor/Typings](../index.md) / ILogManager

# Interface: ILogManager

Defined in: [src/lib/Executor/Typings.ts:226](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L226)

The log manager interface.

Implements the interface, to create a custom log manager/storage for the task logs.

## Extends

- `EventEmitter`\<[`ILogManagerEvents`](ILogManagerEvents.md)\>

## Methods

### close()

> **close**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [src/lib/Executor/Typings.ts:240](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L240)

Close the log section for the given task ID.

#### Parameters

##### taskId

`number`

The task ID to close the log section for.

#### Returns

`void` \| `Promise`\<`void`\>

***

### get()

> **get**(`taskId`, `startLine`, `datetime`): [`ILogRange`](ILogRange.md) \| `Promise`\<[`ILogRange`](ILogRange.md) \| `null`\> \| `null`

Defined in: [src/lib/Executor/Typings.ts:261](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L261)

Read a range of log for the given task ID, by the start line and datetime.

> Don't always return the all rest lines, keep it less than a certain number of lines (e.g. 100),
> in case of memory overflow or performance issues.

#### Parameters

##### taskId

`number`

The task ID to read the log for.

##### startLine

`number`

The start line to read from.

##### datetime

`number`

The datetime to read the log for.

#### Returns

[`ILogRange`](ILogRange.md) \| `Promise`\<[`ILogRange`](ILogRange.md) \| `null`\> \| `null`

***

### open()

> **open**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [src/lib/Executor/Typings.ts:233](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L233)

Initialize a log section for the given task ID.

#### Parameters

##### taskId

`number`

The task ID to initialize the log section for.

#### Returns

`void` \| `Promise`\<`void`\>

***

### write()

> **write**(`taskId`, `level`, `message`): `void`

Defined in: [src/lib/Executor/Typings.ts:249](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L249)

Write a log message to the task log storage.

#### Parameters

##### taskId

`number`

The task ID to write the log message for.

##### level

`string`

The log level (e.g. "info", "error").

##### message

`string`

The log message to write.

#### Returns

`void`
