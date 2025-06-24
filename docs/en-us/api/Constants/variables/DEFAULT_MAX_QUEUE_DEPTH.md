[Documents for @litert/xxl-job-integration](../../index.md) / [Constants](../index.md) / DEFAULT\_MAX\_QUEUE\_DEPTH

# Variable: DEFAULT\_MAX\_QUEUE\_DEPTH

> `const` **DEFAULT\_MAX\_QUEUE\_DEPTH**: `10` = `10`

Defined in: [src/lib/Constants.ts:76](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L76)

The default maximum queue depth for a job.

The queue actually only useful with `EExecutorBlockStrategy.SERIAL_EXECUTION`, while the other two strategies
will always keep only one task being executed, and no other tasks in the queue.
