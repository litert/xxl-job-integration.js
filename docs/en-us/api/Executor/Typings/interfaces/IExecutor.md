[Documents for @litert/xxl-job-integration](../../../index.md) / [Executor/Typings](../index.md) / IExecutor

# Interface: IExecutor

Defined in: [src/lib/Executor/Typings.ts:282](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L282)

The interface for the executor that process the tasks from the xxl-job-admin.

## Events

- error

    When an error occurs insides the executor.

- task_error

    When an error occurs during executing a task.

## Extends

- `EventEmitter`\<[`IExecutorEvents`](IExecutorEvents.md)\>

## Methods

### \[captureRejectionSymbol\]()?

> `optional` **\[captureRejectionSymbol\]**\<`K`\>(`error`, `event`, ...`args`): `void`

Defined in: node\_modules/@types/node/events.d.ts:136

#### Type Parameters

##### K

`K`

#### Parameters

##### error

`Error`

##### event

keyof IExecutorEvents | `K`

##### args

...`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] : `never`

#### Returns

`void`

#### Inherited from

`EventEmitter.[captureRejectionSymbol]`

***

### addListener()

> **addListener**\<`K`\>(`eventName`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:597

Alias for `emitter.on(eventName, listener)`.

#### Type Parameters

##### K

`K`

#### Parameters

##### eventName

keyof IExecutorEvents | `K`

##### listener

`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`

#### Returns

`this`

#### Since

v0.1.26

#### Inherited from

`EventEmitter.addListener`

***

### checkJobStatus()

> **checkJobStatus**(`jobId`): [`IJobOpResult`](IJobOpResult.md)

Defined in: [src/lib/Executor/Typings.ts:298](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L298)

Detects if a job is running or not (`/idleBeat` API).

This method checks if a job is currently running based on its job ID, not by a log ID.

#### Parameters

##### jobId

`number`

The job ID to detect.

#### Returns

[`IJobOpResult`](IJobOpResult.md)

***

### emit()

> **emit**\<`K`\>(`eventName`, ...`args`): `boolean`

Defined in: node\_modules/@types/node/events.d.ts:859

Synchronously calls each of the listeners registered for the event named `eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

#### Type Parameters

##### K

`K`

#### Parameters

##### eventName

keyof IExecutorEvents | `K`

##### args

...`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] : `never`

#### Returns

`boolean`

#### Since

v0.1.26

#### Inherited from

`EventEmitter.emit`

***

### enqueueTask()

> **enqueueTask**(`opts`): [`IJobOpResult`](IJobOpResult.md)

Defined in: [src/lib/Executor/Typings.ts:305](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L305)

Starts executing a job with the given options.

#### Parameters

##### opts

[`IEnqueueTaskArgs`](IEnqueueTaskArgs.md)

The options for starting the job, from the `/run` API.

#### Returns

[`IJobOpResult`](IJobOpResult.md)

***

### eventNames()

> **eventNames**(): (`"error"` \| `"task_error"`)[]

Defined in: node\_modules/@types/node/events.d.ts:922

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

#### Returns

(`"error"` \| `"task_error"`)[]

#### Since

v6.0.0

#### Inherited from

`EventEmitter.eventNames`

***

### getMaxListeners()

> **getMaxListeners**(): `number`

Defined in: node\_modules/@types/node/events.d.ts:774

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to EventEmitter.defaultMaxListeners.

#### Returns

`number`

#### Since

v1.0.0

#### Inherited from

`EventEmitter.getMaxListeners`

***

### getTaskLog()

> **getTaskLog**(`taskId`, `startLine`, `datetime`): `Promise`\<[`IJobOpResult`](IJobOpResult.md)\<[`ILogRange`](ILogRange.md)\>\>

Defined in: [src/lib/Executor/Typings.ts:319](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L319)

Reads the log for a specific task, starting from a given line number and datetime.

#### Parameters

##### taskId

`number`

The task ID to get the log for.

##### startLine

`number`

The start line to read from.

##### datetime

`number`

The datetime when the task started.

#### Returns

`Promise`\<[`IJobOpResult`](IJobOpResult.md)\<[`ILogRange`](ILogRange.md)\>\>

***

### killJob()

> **killJob**(`jobId`): [`IJobOpResult`](IJobOpResult.md)

Defined in: [src/lib/Executor/Typings.ts:310](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L310)

Stop the currently running task and the queued tasks of the specified job ID.

#### Parameters

##### jobId

`number`

#### Returns

[`IJobOpResult`](IJobOpResult.md)

***

### listenerCount()

> **listenerCount**\<`K`\>(`eventName`, `listener?`): `number`

Defined in: node\_modules/@types/node/events.d.ts:868

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

#### Type Parameters

##### K

`K`

#### Parameters

##### eventName

The name of the event being listened for

keyof IExecutorEvents | `K`

##### listener?

`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`

The event handler function

#### Returns

`number`

#### Since

v3.2.0

#### Inherited from

`EventEmitter.listenerCount`

***

### listeners()

> **listeners**\<`K`\>(`eventName`): `K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`[]

Defined in: node\_modules/@types/node/events.d.ts:787

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

#### Type Parameters

##### K

`K`

#### Parameters

##### eventName

keyof IExecutorEvents | `K`

#### Returns

`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`[]

#### Since

v0.1.26

#### Inherited from

`EventEmitter.listeners`

***

### off()

> **off**\<`K`\>(`eventName`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:747

Alias for `emitter.removeListener()`.

#### Type Parameters

##### K

`K`

#### Parameters

##### eventName

keyof IExecutorEvents | `K`

##### listener

`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`

#### Returns

`this`

#### Since

v10.0.0

#### Inherited from

`EventEmitter.off`

***

### on()

> **on**\<`K`\>(`eventName`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:629

Adds the `listener` function to the end of the listeners array for the event
named `eventName`. No checks are made to see if the `listener` has already
been added. Multiple calls passing the same combination of `eventName` and
`listener` will result in the `listener` being added, and called, multiple times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The `emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Type Parameters

##### K

`K`

#### Parameters

##### eventName

The name of the event.

keyof IExecutorEvents | `K`

##### listener

`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`

The callback function

#### Returns

`this`

#### Since

v0.1.101

#### Inherited from

`EventEmitter.on`

***

### once()

> **once**\<`K`\>(`eventName`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:659

Adds a **one-time** `listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The `emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Type Parameters

##### K

`K`

#### Parameters

##### eventName

The name of the event.

keyof IExecutorEvents | `K`

##### listener

`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`

The callback function

#### Returns

`this`

#### Since

v0.3.0

#### Inherited from

`EventEmitter.once`

***

### prependListener()

> **prependListener**\<`K`\>(`eventName`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:886

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`
and `listener` will result in the `listener` being added, and called, multiple times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

##### K

`K`

#### Parameters

##### eventName

The name of the event.

keyof IExecutorEvents | `K`

##### listener

`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`

The callback function

#### Returns

`this`

#### Since

v6.0.0

#### Inherited from

`EventEmitter.prependListener`

***

### prependOnceListener()

> **prependOnceListener**\<`K`\>(`eventName`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:902

Adds a **one-time**`listener` function for the event named `eventName` to the _beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

##### K

`K`

#### Parameters

##### eventName

The name of the event.

keyof IExecutorEvents | `K`

##### listener

`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`

The callback function

#### Returns

`this`

#### Since

v6.0.0

#### Inherited from

`EventEmitter.prependOnceListener`

***

### rawListeners()

> **rawListeners**\<`K`\>(`eventName`): `K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`[]

Defined in: node\_modules/@types/node/events.d.ts:818

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

#### Type Parameters

##### K

`K`

#### Parameters

##### eventName

keyof IExecutorEvents | `K`

#### Returns

`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`[]

#### Since

v9.4.0

#### Inherited from

`EventEmitter.rawListeners`

***

### registerRunner()

> **registerRunner**(`runners`): `this`

Defined in: [src/lib/Executor/Typings.ts:326](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L326)

Register a runner for a specific type of job.

#### Parameters

##### runners

The job runner object to register.

[`IJobRunner`](IJobRunner.md) | [`IJobRunner`](IJobRunner.md)[]

#### Returns

`this`

***

### removeAllListeners()

> **removeAllListeners**(`eventName?`): `this`

Defined in: node\_modules/@types/node/events.d.ts:758

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

##### eventName?

`unknown`

#### Returns

`this`

#### Since

v0.1.26

#### Inherited from

`EventEmitter.removeAllListeners`

***

### removeListener()

> **removeListener**\<`K`\>(`eventName`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:742

Removes the specified `listener` from the listener array for the event named `eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any `removeListener()` or `removeAllListeners()` calls _after_ emitting and _before_ the last listener finishes execution
will not remove them from`emit()` in progress. Subsequent events behave as expected.

```js
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indices of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')` listener is removed:

```js
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

##### K

`K`

#### Parameters

##### eventName

keyof IExecutorEvents | `K`

##### listener

`K` *extends* keyof [`IExecutorEvents`](IExecutorEvents.md) ? [`IExecutorEvents`](IExecutorEvents.md)\[`K`\<`K`\>\] *extends* `unknown`[] ? (...`args`) => `void` : `never` : `never`

#### Returns

`this`

#### Since

v0.1.26

#### Inherited from

`EventEmitter.removeListener`

***

### setMaxListeners()

> **setMaxListeners**(`n`): `this`

Defined in: node\_modules/@types/node/events.d.ts:768

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to `Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

##### n

`number`

#### Returns

`this`

#### Since

v0.3.5

#### Inherited from

`EventEmitter.setMaxListeners`

***

### validateApiToken()

> **validateApiToken**(`token`): `boolean`

Defined in: [src/lib/Executor/Typings.ts:289](https://github.com/litert/xxl-job-integration.js/blob/master/src/lib/Executor/Typings.ts#L289)

Validate if the given API token is valid.

#### Parameters

##### token

`string`

The API token to validate.

#### Returns

`boolean`
