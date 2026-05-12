[Documents for @litert/xxl-job-integration](../../../index.md) / [LogManagers/MemoryLogManager](../index.md) / MemoryLogManager

# Class: MemoryLogManager

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:69](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L69)

The implementation of the `ILogManager` interface that writes logs to memory in a specified directory.

This class manages log sections for different tasks, allowing you to open, close, write logs, and read logs by range.

## Warning

This log manager stores all logs in memory, which is only suitable for testing or small-scale applications.
  For production use, consider using `FileLogManager` or implementing a custom log manager that writes to a more
  durable storage.

## Extends

- `EventEmitter`\<[`ILogManagerEvents`](../../../Executor/Typings/interfaces/ILogManagerEvents.md)\>

## Implements

- [`ILogManager`](../../../Executor/Typings/interfaces/ILogManager.md)

## Constructors

### Constructor

> **new MemoryLogManager**(`opts`): `MemoryLogManager`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:79](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L79)

#### Parameters

##### opts

[`IMemoryLogManagerOptions`](../interfaces/IMemoryLogManagerOptions.md)

#### Returns

`MemoryLogManager`

#### Overrides

`EventEmitter<LibXJ.ILogManagerEvents>.constructor`

## Methods

### close()

> **close**(`taskId`): `void`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:124](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L124)

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

> **get**(`taskId`, `startLine`): [`ILogRange`](../../../Executor/Typings/interfaces/ILogRange.md) \| `null`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:147](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L147)

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

[`ILogRange`](../../../Executor/Typings/interfaces/ILogRange.md) \| `null`

#### Implementation of

[`ILogManager`](../../../Executor/Typings/interfaces/ILogManager.md).[`get`](../../../Executor/Typings/interfaces/ILogManager.md#get)

***

### open()

> **open**(`taskId`): `void`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:119](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L119)

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

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:87](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L87)

#### Returns

`void`

***

### stopTimer()

> **stopTimer**(): `void`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:111](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L111)

#### Returns

`void`

***

### write()

> **write**(`taskId`, `level`, `message`): `void`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:135](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L135)

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
