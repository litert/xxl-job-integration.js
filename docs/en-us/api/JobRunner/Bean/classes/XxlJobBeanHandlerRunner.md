[Documents for @litert/xxl-job-integration](../../../index.md) / [JobRunner/Bean](../index.md) / XxlJobBeanHandlerRunner

# Class: XxlJobBeanHandlerRunner

Defined in: [src/lib/JobRunner/Bean.ts:52](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/Bean.ts#L52)

The job runner that handles job execution using registered bean handlers.

## Implements

- [`IJobRunner`](../../../Executor/Typings/interfaces/IJobRunner.md)

## Constructors

### Constructor

> **new XxlJobBeanHandlerRunner**(): `XxlJobBeanHandlerRunner`

#### Returns

`XxlJobBeanHandlerRunner`

## Properties

### type

> `readonly` **type**: [`EJobType`](../../../Constants/enumerations/EJobType.md) = `cL.EJobType.BEAN`

Defined in: [src/lib/JobRunner/Bean.ts:54](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/Bean.ts#L54)

The type of the jobs that this runner can handle.

#### Implementation of

[`IJobRunner`](../../../Executor/Typings/interfaces/IJobRunner.md).[`type`](../../../Executor/Typings/interfaces/IJobRunner.md#type)

## Methods

### add()

> **add**(`opts`): `void`

Defined in: [src/lib/JobRunner/Bean.ts:69](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/Bean.ts#L69)

#### Parameters

##### opts

[`IHandlerOptions`](../interfaces/IHandlerOptions.md)

#### Returns

`void`

***

### prepare()

> **prepare**(`args`): `null` \| [`IRunnerPrepareResult`](../../../Executor/Typings/interfaces/IRunnerPrepareResult.md)

Defined in: [src/lib/JobRunner/Bean.ts:58](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/Bean.ts#L58)

Prepare to run the task with the given arguments.

#### Parameters

##### args

[`IRunTaskArgs`](../../../Executor/Typings/type-aliases/IRunTaskArgs.md)

#### Returns

`null` \| [`IRunnerPrepareResult`](../../../Executor/Typings/interfaces/IRunnerPrepareResult.md)

null if the task cannot be prepared, or an object containing settings for the task.

#### Implementation of

[`IJobRunner`](../../../Executor/Typings/interfaces/IJobRunner.md).[`prepare`](../../../Executor/Typings/interfaces/IJobRunner.md#prepare)

***

### remove()

> **remove**(`name`): `void`

Defined in: [src/lib/JobRunner/Bean.ts:83](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/Bean.ts#L83)

#### Parameters

##### name

`string`

#### Returns

`void`

***

### run()

> **run**(`ctx`): `Promise`\<`void`\>

Defined in: [src/lib/JobRunner/Bean.ts:88](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/Bean.ts#L88)

Run the task with the given context.

#### Parameters

##### ctx

[`IContext`](../../../Executor/Typings/interfaces/IContext.md)

The context of the task to run, which contains the task data and task information.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IJobRunner`](../../../Executor/Typings/interfaces/IJobRunner.md).[`run`](../../../Executor/Typings/interfaces/IJobRunner.md#run)
