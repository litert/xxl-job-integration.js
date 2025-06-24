[Documents for @litert/xxl-job-integration](../../index.md) / [AdminApiClient](../index.md) / IAdminApiClient

# Interface: IAdminApiClient

Defined in: [src/lib/AdminApiClient.ts:48](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/AdminApiClient.ts#L48)

The interface for the XXL-Job admin API client.

The built-in client uses the `undici` library for making HTTP requests.
You can create your own implementation of the `IAdminApiClient` interface if you want to use a different
HTTP client or have custom logic.

## Methods

### invoke()

> **invoke**\<`TArgs`, `TReply`\>(`path`, `args`): `Promise`\<`TReply`\>

Defined in: [src/lib/AdminApiClient.ts:72](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/AdminApiClient.ts#L72)

Invoke the API of the XXL-Job admin server with the specified path and arguments.

#### Type Parameters

##### TArgs

`TArgs`

##### TReply

`TReply` = `IApiReplyBase`

#### Parameters

##### path

`string`

The path of the API to invoke, which should start with a slash.

##### args

`TArgs`

The arguments to pass to the API, which should be a plain object.

#### Returns

`Promise`\<`TReply`\>

***

### setApiToken()

> **setApiToken**(`apiToken`): `void`

Defined in: [src/lib/AdminApiClient.ts:64](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/AdminApiClient.ts#L64)

Update the access token for accessing the API of the XXL-Job admin server.

#### Parameters

##### apiToken

`string`

The access token for the XXL-Job admin server.

#### Returns

`void`

***

### setBaseUrl()

> **setBaseUrl**(`baseUrl`): `void`

Defined in: [src/lib/AdminApiClient.ts:57](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/AdminApiClient.ts#L57)

Update the base URL of the XXL-Job admin server.

#### Parameters

##### baseUrl

`string`

The base URL of the XXL-Job admin server, which should end with a slash.

#### Returns

`void`

#### Example

```ts
'http://localhost:7070/xxl-job-admin'
```

***

### validateApiToken()

> **validateApiToken**(`token`): `boolean`

Defined in: [src/lib/AdminApiClient.ts:79](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/AdminApiClient.ts#L79)

Validate if the given API token is valid.

#### Parameters

##### token

`string`

The API token to validate.

#### Returns

`boolean`
