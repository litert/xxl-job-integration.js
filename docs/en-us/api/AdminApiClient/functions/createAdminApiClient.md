[Documents for @litert/xxl-job-integration](../../index.md) / [AdminApiClient](../index.md) / createAdminApiClient

# Function: createAdminApiClient()

> **createAdminApiClient**(`options`): [`IAdminApiClient`](../interfaces/IAdminApiClient.md)

Defined in: [src/lib/AdminApiClient.ts:142](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/AdminApiClient.ts#L142)

Create a new instance of the built-in API client for XXL-Job admin .

The built-in client uses the `undici` library for making HTTP requests.
You can create your own implementation of the `IAdminApiClient` interface if you want to use a different
HTTP client or have custom logic.

## Parameters

### options

[`IAdminApiClientOptions`](../interfaces/IAdminApiClientOptions.md)

The options for creating the API client.

## Returns

[`IAdminApiClient`](../interfaces/IAdminApiClient.md)

The new instance of the API client.
