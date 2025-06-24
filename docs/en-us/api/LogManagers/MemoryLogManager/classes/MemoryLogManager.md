[Documents for @litert/xxl-job-integration](../../../index.md) / [LogManagers/MemoryLogManager](../index.md) / MemoryLogManager

# Class: MemoryLogManager

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:62](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L62)

The implementation of the `ILogManager` interface that writes logs to memory in a specified directory.

This class manages log sections for different tasks, allowing you to open, close, write logs, and read logs by range.

## Implements

- [`ILogManager`](../../../Executor/Typings/interfaces/ILogManager.md)

## Constructors

### Constructor

> **new MemoryLogManager**(`opts`): `MemoryLogManager`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:72](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L72)

#### Parameters

##### opts

[`IMemoryLogManagerOptions`](../interfaces/IMemoryLogManagerOptions.md)

#### Returns

`MemoryLogManager`

## Methods

### close()

> **close**(`taskId`): `void`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:115](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L115)

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

> **get**(`taskId`, `startLine`): `null` \| [`ILogRange`](../../../Executor/Typings/interfaces/ILogRange.md)

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:138](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L138)

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

`null` \| [`ILogRange`](../../../Executor/Typings/interfaces/ILogRange.md)

#### Implementation of

[`ILogManager`](../../../Executor/Typings/interfaces/ILogManager.md).[`get`](../../../Executor/Typings/interfaces/ILogManager.md#get)

***

### open()

> **open**(`taskId`): `void`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:110](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L110)

Initialize a log section for the given task ID.

#### Parameters

##### taskId

`number`

The task ID to initialize the log section for.

#### Returns

`void`

#### Implementation of

[`ILogManager`](../../../Executor/Typings/interfaces/ILogManager.md).[`open`](../../../Executor/Typings/interfaces/ILogManager.md#open)

***

### startTimer()

> **startTimer**(): `void`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:78](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L78)

#### Returns

`void`

***

### stopTimer()

> **stopTimer**(): `void`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:102](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L102)

#### Returns

`void`

***

### write()

> **write**(`taskId`, `level`, `message`): `void`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:126](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L126)

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
