[Documents for @litert/xxl-job-integration](../../index.md) / [RegisterAgent](../index.md) / IRegisterAgent

# Interface: IRegisterAgent

Defined in: [src/lib/RegisterAgent.ts:42](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/RegisterAgent.ts#L42)

The interface for the register-control agent of the XXL-Job executor.
The agent must implement these features:

- Register the executor to the XXL-Job admin server.
- Keep the executor registered by periodically sending heartbeat to the XXL-Job admin server.

## Events

- error

    When an error occurs during the registration or heartbeat process.

- heartbeat

    When the agent successfully sent a heartbeat to the XXL-Job admin server

## Extends

- `EventEmitter`\<[`IRegisterAgentEvents`](IRegisterAgentEvents.md)\>

## Methods

### register()

> **register**(`startTimer?`): `Promise`\<`void`\>

Defined in: [src/lib/RegisterAgent.ts:78](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/RegisterAgent.ts#L78)

Register the executor to the XXL-Job admin server.

This method only does once registration. And the XXL-Job admin server requires the executor to keep registering
itself periodically.

Thus, the recommended usage is:

```ts
// Call this method once to register the executor
// and this step could also check the registration could be done successfully.
await agent.register();

// start the timer to keep the executor registered.
// The timer will be triggered every 30 seconds.
agent.startKeepAlive();
```

#### Parameters

##### startTimer?

`boolean`

If true, the agent will start the keep-alive timer after register successfully. [default: true]

#### Returns

`Promise`\<`void`\>

***

### setAppName()

> **setAppName**(`name`): `this`

Defined in: [src/lib/RegisterAgent.ts:49](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/RegisterAgent.ts#L49)

The name of the application that this executor belongs to.

#### Parameters

##### name

`string`

The name of the application, which should match the pattern /^[a-z][-0-9a-z]{0,63}$/i.

#### Returns

`this`

***

### setExecutorUrl()

> **setExecutorUrl**(`url`): `this`

Defined in: [src/lib/RegisterAgent.ts:56](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/RegisterAgent.ts#L56)

Update the executor URL of this agent.

#### Parameters

##### url

`string`

The URL of the executor, which should be accessible by the XXL-Job admin server.

#### Returns

`this`

***

### startKeepAlive()

> **startKeepAlive**(): `this`

Defined in: [src/lib/RegisterAgent.ts:90](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/RegisterAgent.ts#L90)

Start the keep-alive timer to periodically register the executor to the XXL-Job admin server.

#### Returns

`this`

***

### stopKeepAlive()

> **stopKeepAlive**(): `this`

Defined in: [src/lib/RegisterAgent.ts:95](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/RegisterAgent.ts#L95)

Stop the keep-alive timer.

#### Returns

`this`

***

### unregister()

> **unregister**(): `Promise`\<`void`\>

Defined in: [src/lib/RegisterAgent.ts:85](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/RegisterAgent.ts#L85)

Unregister the executor from the XXL-Job admin server.

This method will stop the keep-alive timer after unregistering the executor successfully.

#### Returns

`Promise`\<`void`\>
