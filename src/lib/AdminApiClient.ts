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

import { TOKEN_HEADER } from './Constants';
import { type IApiReplyBase }  from './ApiSchema';
import * as Undici from 'undici';

/**
 * The options for creating an instance of the XXL-Job admin API client.
 */
export interface IAdminApiClientOptions {

    /**
     * The base URL of the XXL-Job admin server.
     *
     * @example 'http://localhost:7070/xxl-job-admin'
     */
    baseUrl: string;

    /**
     * The access token for accessing the API of the XXL-Job admin server.
     *
     * @example 'default_token' (The default access token for the XXL-Job admin server)
     */
    apiToken: string;
}

/**
 * The interface for the XXL-Job admin API client.
 *
 * The built-in client uses the `undici` library for making HTTP requests.
 * You can create your own implementation of the `IAdminApiClient` interface if you want to use a different
 * HTTP client or have custom logic.
 */
export interface IAdminApiClient {

    /**
     * Update the base URL of the XXL-Job admin server.
     *
     * @param baseUrl   The base URL of the XXL-Job admin server, which should end with a slash.
     *
     * @example 'http://localhost:7070/xxl-job-admin'
     */
    setBaseUrl(baseUrl: string): void;

    /**
     * Update the access token for accessing the API of the XXL-Job admin server.
     *
     * @param apiToken   The access token for the XXL-Job admin server.
     */
    setApiToken(apiToken: string): void;

    /**
     * Invoke the API of the XXL-Job admin server with the specified path and arguments.
     *
     * @param path  The path of the API to invoke, which should start with a slash.
     * @param args  The arguments to pass to the API, which should be a plain object.
     */
    invoke<TArgs, TReply = IApiReplyBase>(path: string, args: TArgs): Promise<TReply>;

    /**
     * Validate if the given API token is valid.
     *
     * @param token     The API token to validate.
     */
    validateApiToken(token: string): boolean;
}

class XxlJobAdminApiClient implements IAdminApiClient {

    private _baseUrl: string;

    private _apiToken: string;

    public constructor(options: IAdminApiClientOptions) {

        this._baseUrl = options.baseUrl.replace(/\/+$/, '');
        this._apiToken = options.apiToken;
    }

    public setBaseUrl(baseUrl: string): void {

        this._baseUrl = baseUrl.replace(/\/+$/, '');
    }

    public setApiToken(apiToken: string): void {

        this._apiToken = apiToken;
    }

    public async invoke<TArgs, TReply>(path: string, args: TArgs): Promise<TReply> {

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            [TOKEN_HEADER]: this._apiToken,
        };

        const response = await Undici.fetch(`${this._baseUrl}${path}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(args),
        });

        if (!response.ok) {
            await response.body?.cancel();
            throw new Error(`Request failed with status ${response.status}`);
        }

        return response.json() as Promise<TReply>;
    }

    public validateApiToken(token: string): boolean {

        return token === this._apiToken;
    }
}

/**
 * Create a new instance of the built-in API client for XXL-Job admin .
 *
 * The built-in client uses the `undici` library for making HTTP requests.
 * You can create your own implementation of the `IAdminApiClient` interface if you want to use a different
 * HTTP client or have custom logic.
 *
 * @param options   The options for creating the API client.
 *
 * @returns The new instance of the API client.
 */
export function createAdminApiClient(options: IAdminApiClientOptions): IAdminApiClient {

    return new XxlJobAdminApiClient(options);
}
