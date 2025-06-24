[Documents for @litert/xxl-job-integration](../../../index.md) / [LogManagers/FileLogManager](../index.md) / IFileLogCleanerOptions

# Interface: IFileLogCleanerOptions

Defined in: [src/lib/LogManagers/FileLogManager.ts:38](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L38)

The options for the `FileLogCleaner` class.

## Properties

### logDir

> **logDir**: `string`

Defined in: [src/lib/LogManagers/FileLogManager.ts:45](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L45)

The path to the directory where the log files are stored.

This directory must be accessible and writable by the application.

***

### maxAgeMs

> **maxAgeMs**: `number`

Defined in: [src/lib/LogManagers/FileLogManager.ts:56](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L56)

The maximum age of log files to keep, in milliseconds.
Files older than this will be deleted.

It's recommended to set this value based on your application's log retention policy.
Don't set this value too low, as it may cause the log files to be deleted too soon, before you have a chance to
read them. And also don't set this value too high, as it may cause the log directory to
accumulate too many old log files, which may use up too much disk space.

***

### timerIntervalMs

> **timerIntervalMs**: `number`

Defined in: [src/lib/LogManagers/FileLogManager.ts:68](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L68)

The interval at which to check for old log files, in milliseconds.

It's not recommended to set this value too low, as it may cause performance issues,
but also not too high, as it may cause old log files to accumulate.
A simple rule of this value is to set it to the same unit as the `maxAgeMs` value,

For example, if your log files are reserved for days, you could set
`timerIntervalMs` to 86400000 (which is 24 hours/1 day in milliseconds).
