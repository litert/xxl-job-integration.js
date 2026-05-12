# Changes Logs

## v2.0.0

- chore: update dependencies for better performance and security.
- fix(logger): now the `ILogManager` interface must emit `error` event when any error occurs, 
    avoiding uncaught exceptions and allowing better error handling in the executor.

## v1.0.1

- fix(executor): separate the task errors from the `error` event.