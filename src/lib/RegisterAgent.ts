/**
 *  Copyright 2025 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { EventEmitter } from 'node:events';
import type { IAdminApiClient } from './AdminApiClient';
import { AdminApi }  from './ApiSchema';
import * as eL from './Errors';
import { BackgroundRunner } from '@litert/utils-async';

/**
 * The interface for the register-control agent of the XXL-Job executor.
 * The agent must implement these features:
 *
 * - Register the executor to the XXL-Job admin server.
 * - Keep the executor registered by periodically sending heartbeat to the XXL-Job admin server.
 *
 * ## Events
 *
 * - error
 *
 *     When an error occurs during the registration or heartbeat process.
 *
 * - heartbeat
 *
 *     When the agent successfully sent a heartbeat to the XXL-Job admin server
 *
 * @noInheritDoc
 */
export interface IRegisterAgent extends EventEmitter<IRegisterAgentEvents> {

    /**
     * The name of the application that this executor belongs to.
     *
     * @param name The name of the application, which should match the pattern /^[a-z][-0-9a-z]{0,63}$/i.
     */
    setAppName(name: string): this;

    /**
     * Update the executor URL of this agent.
     *
     * @param url  The URL of the executor, which should be accessible by the XXL-Job admin server.
     */
    setExecutorUrl(url: string): this;

    /**
     * Register the executor to the XXL-Job admin server.
     *
     * This method only does once registration. And the XXL-Job admin server requires the executor to keep registering
     * itself periodically.
     *
     * Thus, the recommended usage is:
     *
     * ```ts
     * // Call this method once to register the executor
     * // and this step could also check the registration could be done successfully.
     * await agent.register();
     *
     * // start the timer to keep the executor registered.
     * // The timer will be triggered every 30 seconds.
     * agent.startKeepAlive();
     * ```
     *
     * @param startTimer If true, the agent will start the keep-alive timer after register successfully. [default: true]
     */
    register(startTimer?: boolean): Promise<void>;

    /**
     * Unregister the executor from the XXL-Job admin server.
     *
     * This method will stop the keep-alive timer after unregistering the executor successfully.
     */
    unregister(): Promise<void>;

    /**
     * Start the keep-alive timer to periodically register the executor to the XXL-Job admin server.
     */
    startKeepAlive(): this;

    /**
     * Stop the keep-alive timer.
     */
    stopKeepAlive(): this;
}

/**
 * The events emitted by the register agent.
 */
export interface IRegisterAgentEvents {

    error: [error: unknown];

    /**
     * When the agent successfully sent a heartbeat to the XXL-Job admin server.
     */
    heartbeat: [];
}

const RE_APP_NAME = /^[a-z][-0-9a-z]{0,63}$/i;
const KEEPALIVE_INTERVAL = 30 * 1000; // 30 seconds

class XxlJobRegisterAgent extends EventEmitter<IRegisterAgentEvents> implements IRegisterAgent {

    private _appName: string = '';

    private _executorUrl: string = '';

    private readonly _apiCli: IAdminApiClient;

    private _timer: NodeJS.Timeout | null = null;

    private readonly _bgRunner = new BackgroundRunner();

    public constructor(appName: string, executorUrl: string, adminApiClient: IAdminApiClient) {

        super();
        this._checkAppName(appName);
        this._appName = appName;
        this._executorUrl = executorUrl;
        this._apiCli = adminApiClient;
        this._bgRunner.on('error', (e) => { this.emit('error', e); });
    }

    /**
     * Check if the application name is valid (required by the XXL-Job admin server).
     */
    private _checkAppName(name: string): void {

        if (!RE_APP_NAME.test(name)) {
            throw new eL.E_INVALID_APP_NAME({ name });
        }
    }

    public setAppName(name: string): this {
        this._checkAppName(name);
        this._appName = name;
        return this;
    }

    public setExecutorUrl(url: string): this {
        this._executorUrl = url;
        return this;
    }

    public startKeepAlive(): this {

        if (this._timer) {

            clearInterval(this._timer);
        }

        this._timer = setInterval(() => {

            this._bgRunner.run(async () => {

                try {

                    await this.register();
                    this.emit('heartbeat');
                }
                catch (e) {

                    this.emit('error', e as eL.XxlJobError);
                }
            });

        }, KEEPALIVE_INTERVAL);

        return this;
    }

    public stopKeepAlive(): this {

        if (this._timer) {

            clearInterval(this._timer);
            this._timer = null;
        }

        return this;
    }

    public async register(startTimer: boolean = true): Promise<void> {

        const result = await this._apiCli.invoke<AdminApi.IRegisterArgs>(AdminApi.EApiEntry.REGISTER, {
            'registryGroup': 'EXECUTOR',
            'registryKey': this._appName,
            'registryValue': this._executorUrl,
        });

        if (result.code !== 200) {

            throw new eL.E_REGISTER_FAILED();
        }

        if (!this._timer && startTimer) {

            this.startKeepAlive();
        }
    }

    public async unregister(): Promise<void> {

        const isTimerRunning = !!this._timer;

        this.stopKeepAlive(); // prevent from registering again while unregistering

        try {

            const result = await this._apiCli.invoke<AdminApi.IUnregisterArgs>(AdminApi.EApiEntry.UNREGISTER, {
                'registryGroup': 'EXECUTOR',
                'registryKey': this._appName,
                'registryValue': this._executorUrl,
            });

            if (result.code !== 200) {

                throw new Error(`Failed to unregister agent: ${result.msg!}`);
            }
        }
        catch (e) {

            if (isTimerRunning) {

                this.startKeepAlive(); // restart the timer if it was running before
            }

            throw e;
        }
    }
}

/**
 * Create a new register agent for the XXL-Job executor.
 *
 * @param appName           The name of the application, which must match the pattern /^[a-z][-0-9a-z]{0,63}$/i.
 * @param executorUrl       The URL of the executor, which should be accessible by the XXL-Job admin server.
 * @param adminApiClient    The admin API client to communicate with the XXL-Job admin server.
 *
 * @returns The created register agent.
 */
export function createRegisterAgent(
    appName: string,
    executorUrl: string,
    adminApiClient: IAdminApiClient,
): IRegisterAgent {

    return new XxlJobRegisterAgent(appName, executorUrl, adminApiClient);
}
