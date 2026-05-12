[Documents for @litert/xxl-job-integration](../../../index.md) / [LogManagers/FileLogManager](../index.md) / FileLogCleaner

# Class: FileLogCleaner

Defined in: [src/lib/LogManagers/FileLogManager.ts:92](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L92)

The cleaner for old log files in the specified directory.

This class periodically checks the log directory for files that are older than a specified maximum age,
and removes them.

**DON'T FORGET TO LISTEN ON THE `error` EVENT!**

## Events

- error

    When an error occurs during the registration or heartbeat process.

- cleaned

    When a log file is cleaned up.

## Extends

- `EventEmitter`\<[`IFileLogCleanerEvents`](../interfaces/IFileLogCleanerEvents.md)\>

## Constructors

### Constructor

> **new FileLogCleaner**(`opts`): `FileLogCleaner`

Defined in: [src/lib/LogManagers/FileLogManager.ts:104](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L104)

#### Parameters

##### opts

[`IFileLogCleanerOptions`](../interfaces/IFileLogCleanerOptions.md)

#### Returns

`FileLogCleaner`

#### Overrides

`EventEmitter<IFileLogCleanerEvents>.constructor`

## Methods

### start()

> **start**(): `void`

Defined in: [src/lib/LogManagers/FileLogManager.ts:118](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L118)

Start the timer to clean up old log files periodically.
If the timer is already running, this method does nothing.

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [src/lib/LogManagers/FileLogManager.ts:134](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/LogManagers/FileLogManager.ts#L134)

Stop the timer that cleans up old log files.
If the timer is not running, this method does nothing.

#### Returns

`void`
