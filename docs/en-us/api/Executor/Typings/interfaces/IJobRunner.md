[Documents for @litert/xxl-job-integration](../../../index.md) / [Executor/Typings](../index.md) / IJobRunner

# Interface: IJobRunner

Defined in: [src/lib/Executor/Typings.ts:162](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L162)

The runner who finally handles the tasks of a specific job type.

## Properties

### type

> `readonly` **type**: [`EJobType`](../../../Constants/enumerations/EJobType.md)

Defined in: [src/lib/Executor/Typings.ts:167](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L167)

The type of the jobs that this runner can handle.

## Methods

### prepare()

> **prepare**(`args`): `null` \| [`IRunnerPrepareResult`](IRunnerPrepareResult.md)

Defined in: [src/lib/Executor/Typings.ts:181](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L181)

Prepare to run the task with the given arguments.

#### Parameters

##### args

[`IRunTaskArgs`](../type-aliases/IRunTaskArgs.md)

#### Returns

`null` \| [`IRunnerPrepareResult`](IRunnerPrepareResult.md)

null if the task cannot be prepared, or an object containing settings for the task.

***

### run()

> **run**(`ctx`): `void` \| `Promise`\<`void`\>

Defined in: [src/lib/Executor/Typings.ts:174](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L174)

Run the task with the given context.

#### Parameters

##### ctx

[`IContext`](IContext.md)

The context of the task to run, which contains the task data and task information.

#### Returns

`void` \| `Promise`\<`void`\>
