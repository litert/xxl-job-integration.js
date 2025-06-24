[Documents for @litert/xxl-job-integration](../../../index.md) / [Executor/Typings](../index.md) / IJobOpResult

# Interface: IJobOpResult\<T\>

Defined in: [src/lib/Executor/Typings.ts:61](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L61)

## Type Parameters

### T

`T` = `null`

## Properties

### data?

> `optional` **data**: `T`

Defined in: [src/lib/Executor/Typings.ts:75](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L75)

***

### error

> **error**: `object`

Defined in: [src/lib/Executor/Typings.ts:66](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L66)

The error information when an operation fails.

#### code

> **code**: `number`

The code of the error, which is a number indicating the type of error.

#### msg

> **msg**: `null` \| `string`
