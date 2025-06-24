[Documents for @litert/xxl-job-integration](../../index.md) / [Constants](../index.md) / EExecutorBlockStrategy

# Enumeration: EExecutorBlockStrategy

Defined in: [src/lib/Constants.ts:52](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L52)

The strategy for handling task execution when a job already has a task running.

## Enumeration Members

### COVER\_EARLY

> **COVER\_EARLY**: `"COVER_EARLY"`

Defined in: [src/lib/Constants.ts:57](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L57)

If the job has a running task, kill it, clean up the queue, and run the new one.

***

### DISCARD\_LATER

> **DISCARD\_LATER**: `"DISCARD_LATER"`

Defined in: [src/lib/Constants.ts:62](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L62)

If the job has a running task, discard the new one (mark as failed) and keep the old one running.

***

### SERIAL\_EXECUTION

> **SERIAL\_EXECUTION**: `"SERIAL_EXECUTION"`

Defined in: [src/lib/Constants.ts:67](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L67)

If the job has a running task, wait until it finishes and then run the new one.
