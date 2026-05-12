[Documents for @litert/xxl-job-integration](../../../index.md) / [LogManagers/FileLogManager](../index.md) / IFileLogManagerOptions

# Interface: IFileLogManagerOptions

Defined in: [src/lib/LogManagers/FileLogManager.ts:194](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L194)

The options for the `FileLogManager` class.

## Properties

### logDir

> **logDir**: `string`

Defined in: [src/lib/LogManagers/FileLogManager.ts:200](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L200)

Where to store the log files.
This directory will be created if it does not exist.

***

### maxLinesAtOnce?

> `optional` **maxLinesAtOnce?**: `number`

Defined in: [src/lib/LogManagers/FileLogManager.ts:213](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L213)

The maximum number of lines to read at once when fetching logs.
This is to prevent memory overflow or performance issues.

However, this may also cause the log reading to be incomplete if the task is finished already,
because the XXL-Job admin server does not read the logs by range after the task is finished.
So, if the task is finished, a truncated log range might be returned depending on this value.

#### Default

```ts
1000
```

#### See

[DEFAULT\_MAX\_LINE\_AT\_ONCE](../variables/DEFAULT_MAX_LINE_AT_ONCE.md)
