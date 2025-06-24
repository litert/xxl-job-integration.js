[Documents for @litert/xxl-job-integration](../../index.md) / [AdminApiClient](../index.md) / IAdminApiClientOptions

# Interface: IAdminApiClientOptions

Defined in: [src/lib/AdminApiClient.ts:24](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/AdminApiClient.ts#L24)

The options for creating an instance of the XXL-Job admin API client.

## Properties

### apiToken

> **apiToken**: `string`

Defined in: [src/lib/AdminApiClient.ts:38](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/AdminApiClient.ts#L38)

The access token for accessing the API of the XXL-Job admin server.

#### Example

```ts
'default_token' (The default access token for the XXL-Job admin server)
```

***

### baseUrl

> **baseUrl**: `string`

Defined in: [src/lib/AdminApiClient.ts:31](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/AdminApiClient.ts#L31)

The base URL of the XXL-Job admin server.

#### Example

```ts
'http://localhost:7070/xxl-job-admin'
```
