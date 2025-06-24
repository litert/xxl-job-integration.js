[Documents for @litert/xxl-job-integration](../../../index.md) / [LogManagers/MemoryLogManager](../index.md) / IMemoryLogManagerOptions

# Interface: IMemoryLogManagerOptions

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:22](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L22)

The options for the `MemoryLogManager` class.

## Properties

### maxAgeMs

> **maxAgeMs**: `number`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:33](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L33)

The maximum age of log sections to keep, in milliseconds.
Log sections older than this will be deleted.

It's recommended to set this value based on your application's log retention policy.
Don't set this value too low, as it may cause the log sections to be deleted too soon, before you have a chance to
read them. And also don't set this value too high, as it may cause the log directory to
accumulate too many old log sections, which may use up too much disk space.

***

### timerIntervalMs

> **timerIntervalMs**: `number`

Defined in: [src/lib/LogManagers/MemoryLogManager.ts:45](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/MemoryLogManager.ts#L45)

The interval at which to check for old log sections, in milliseconds.

It's not recommended to set this value too low, as it may cause performance issues,
but also not too high, as it may cause old log sections to accumulate.
A simple rule of this value is to set it to the same unit as the `maxAgeMs` value,

For example, if your log sections are reserved for days, you could set
`timerIntervalMs` to 86400000 (which is 24 hours/1 day in milliseconds).
