[Documents for @litert/xxl-job-integration](../../../index.md) / [JobRunner/NodeJsInProcess](../index.md) / XxlJobNodeJsInProcessHandlerRunner

# Class: XxlJobNodeJsInProcessHandlerRunner

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:97](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L97)

The task runner for Node.js scripts that are executed in current process.

WATCH OUT: Don't run any untrusted code here, as it will possibly cause RCE
(Remote Code Execution) vulnerabilities.

## Implements

- [`IJobRunner`](../../../Executor/Typings/interfaces/IJobRunner.md)

## Constructors

### Constructor

> **new XxlJobNodeJsInProcessHandlerRunner**(`opts`): `XxlJobNodeJsInProcessHandlerRunner`

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:107](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L107)

#### Parameters

##### opts

[`IRunnerOptions`](../interfaces/IRunnerOptions.md) = `{}`

#### Returns

`XxlJobNodeJsInProcessHandlerRunner`

## Properties

### type

> `readonly` **type**: [`EJobType`](../../../Constants/enumerations/EJobType.md) = `cL.EJobType.NODE_JS`

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:99](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L99)

The type of the jobs that this runner can handle.

#### Implementation of

[`IJobRunner`](../../../Executor/Typings/interfaces/IJobRunner.md).[`type`](../../../Executor/Typings/interfaces/IJobRunner.md#type)

## Methods

### prepare()

> **prepare**(`args`): `null` \| [`IRunnerPrepareResult`](../../../Executor/Typings/interfaces/IRunnerPrepareResult.md)

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:128](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L128)

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

### run()

> **run**(`ctx`): `Promise`\<`void`\>

Defined in: [src/lib/JobRunner/NodeJsInProcess.ts:187](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/JobRunner/NodeJsInProcess.ts#L187)

Run the task with the given context.

#### Parameters

##### ctx

[`IContext`](../../../Executor/Typings/interfaces/IContext.md)

The context of the task to run, which contains the task data and task information.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IJobRunner`](../../../Executor/Typings/interfaces/IJobRunner.md).[`run`](../../../Executor/Typings/interfaces/IJobRunner.md#run)
