[Documents for @litert/xxl-job-integration](../../../index.md) / [Executor/Typings](../index.md) / ILogRange

# Interface: ILogRange

Defined in: [src/lib/Executor/Typings.ts:187](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L187)

The result of the log reading operation.

## Properties

### content

> **content**: `string`

Defined in: [src/lib/Executor/Typings.ts:204](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L204)

The content of the log range, which is a string containing the log messages.

> Always ending with a newline character.

***

### endLine

> **endLine**: `number`

Defined in: [src/lib/Executor/Typings.ts:197](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L197)

The line number of the last line in the log range.

***

### hasMore

> **hasMore**: `boolean`

Defined in: [src/lib/Executor/Typings.ts:216](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L216)

Indicates if there are more lines to read after this range.

For now, the XXL-Job will ignore this field when reading the log after the task is finished.

So if the task is finished, a full log range should be returned.

But, anyway, to avoid memory overflow or performance issues, truncating the log range to a certain size is fine
if it's necessary.

***

### startLine

> **startLine**: `number`

Defined in: [src/lib/Executor/Typings.ts:192](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L192)

The line number of the first line in the log range.
