[Documents for @litert/xxl-job-integration](../../index.md) / [RegisterAgent](../index.md) / createRegisterAgent

# Function: createRegisterAgent()

> **createRegisterAgent**(`appName`, `executorUrl`, `adminApiClient`): [`IRegisterAgent`](../interfaces/IRegisterAgent.md)

Defined in: [src/lib/RegisterAgent.ts:254](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/RegisterAgent.ts#L254)

Create a new register agent for the XXL-Job executor.

## Parameters

### appName

`string`

The name of the application, which must match the pattern /^[a-z][-0-9a-z]{0,63}$/i.

### executorUrl

`string`

The URL of the executor, which should be accessible by the XXL-Job admin server.

### adminApiClient

[`IAdminApiClient`](../../AdminApiClient/interfaces/IAdminApiClient.md)

The admin API client to communicate with the XXL-Job admin server.

## Returns

[`IRegisterAgent`](../interfaces/IRegisterAgent.md)

The created register agent.
