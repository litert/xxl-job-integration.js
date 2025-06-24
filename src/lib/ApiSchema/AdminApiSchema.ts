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

/**
 * The URL entry points for the XXL-Job Admin API.
 */
export enum EApiEntry {

    /**
     * @see IRegisterArgs
     */
    REGISTER = '/api/registry',
    /**
     * @see IUnregisterArgs
     */
    UNREGISTER = '/api/registryRemove',
    /**
     * @see ISubmitJobResultArgs
     */
    SUBMIT_JOB_RESULT = '/api/callback',
}

/**
 * @see EApiEntry.REGISTER
 */
export interface IRegisterArgs {

    registryGroup: 'EXECUTOR';

    registryKey: string;

    registryValue: string;
}

/**
 * @see EApiEntry.SUBMIT_JOB_RESULT
 */
export type ISubmitJobResultArgs = ITaskExecutionResult[];

export interface ITaskExecutionResult {

    logId: number;

    logDateTim: number;

    handleCode: number;

    handleMsg: string | null;
}

/**
 * @see EApiEntry.UNREGISTER
 */
export type IUnregisterArgs = IRegisterArgs;
