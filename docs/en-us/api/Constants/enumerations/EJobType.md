[Documents for @litert/xxl-job-integration](../../index.md) / [Constants](../index.md) / EJobType

# Enumeration: EJobType

Defined in: [src/lib/Constants.ts:25](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L25)

The type of job that can be registered in the XXL-Job executor.

## Enumeration Members

### BEAN

> **BEAN**: `"BEAN"`

Defined in: [src/lib/Constants.ts:30](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L30)

The job handler provided by the application itself, which is hardcoded.

***

### NODE\_JS

> **NODE\_JS**: `"GLUE_NODEJS"`

Defined in: [src/lib/Constants.ts:35](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L35)

The job contains a JavaScript script that will be executed in a Node.js environment.

***

### PHP

> **PHP**: `"GLUE_PHP"`

Defined in: [src/lib/Constants.ts:44](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L44)

***

### POWERSHELL

> **POWERSHELL**: `"GLUE_POWERSHELL"`

Defined in: [src/lib/Constants.ts:46](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L46)

***

### PYTHON

> **PYTHON**: `"GLUE_PYTHON"`

Defined in: [src/lib/Constants.ts:42](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L42)

***

### SHELL

> **SHELL**: `"GLUE_SHELL"`

Defined in: [src/lib/Constants.ts:40](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Constants.ts#L40)

The job contains a shell script that will be executed in a shell environment.
