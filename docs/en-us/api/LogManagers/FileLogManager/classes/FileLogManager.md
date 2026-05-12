[Documents for @litert/xxl-job-integration](../../../index.md) / [LogManagers/FileLogManager](../index.md) / FileLogManager

# Class: FileLogManager

Defined in: [src/lib/LogManagers/FileLogManager.ts:230](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L230)

The implementation of the `ILogManager` interface that writes logs to files in a specified directory.

This class manages log files for different tasks, allowing you to open, close, write logs, and read logs by range.

This class does not handle log file cleanup, so you may want to use `FileLogCleaner` to manage old log files.

## Extends

- `EventEmitter`\<[`ILogManagerEvents`](../../../Executor/Typings/interfaces/ILogManagerEvents.md)\>

## Implements

- [`ILogManager`](../../../Executor/Typings/interfaces/ILogManager.md)

## Constructors

### Constructor

> **new FileLogManager**(`opts`): `FileLogManager`

Defined in: [src/lib/LogManagers/FileLogManager.ts:238](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L238)

#### Parameters

##### opts

[`IFileLogManagerOptions`](../interfaces/IFileLogManagerOptions.md)

#### Returns

`FileLogManager`

#### Overrides

`EventEmitter<LibXJ.ILogManagerEvents>.constructor`

## Methods

### close()

> **close**(`taskId`): `void`

Defined in: [src/lib/LogManagers/FileLogManager.ts:280](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L280)

Close the log section for the given task ID.

#### Parameters

##### taskId

`number`

The task ID to close the log section for.

#### Returns

`void`

#### Implementation of

[`ILogManager`](../../../Executor/Typings/interfaces/ILogManager.md).[`close`](../../../Executor/Typings/interfaces/ILogManager.md#close)

***

### get()

> **get**(`taskId`, `startLine`): `Promise`\<[`ILogRange`](../../../Executor/Typings/interfaces/ILogRange.md) \| `null`\>

Defined in: [src/lib/LogManagers/FileLogManager.ts:321](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L321)

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

#### Returns

`Promise`\<[`ILogRange`](../../../Executor/Typings/interfaces/ILogRange.md) \| `null`\>

#### Implementation of

[`ILogManager`](../../../Executor/Typings/interfaces/ILogManager.md).[`get`](../../../Executor/Typings/interfaces/ILogManager.md#get)

***

### open()

> **open**(`taskId`): `Promise`\<`void`\>

Defined in: [src/lib/LogManagers/FileLogManager.ts:246](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L246)

Initialize a log section for the given task ID.

#### Parameters

##### taskId

`number`

The task ID to initialize the log section for.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ILogManager`](../../../Executor/Typings/interfaces/ILogManager.md).[`open`](../../../Executor/Typings/interfaces/ILogManager.md#open)

***

### write()

> **write**(`taskId`, `level`, `message`): `void`

Defined in: [src/lib/LogManagers/FileLogManager.ts:295](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L295)

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

#### Implementation of

[`ILogManager`](../../../Executor/Typings/interfaces/ILogManager.md).[`write`](../../../Executor/Typings/interfaces/ILogManager.md#write)
