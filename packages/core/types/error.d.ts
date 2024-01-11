/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Error code representing complete loss of service. Used by {@link Neo4jError#code}.
 * @type {string}
 */
declare const SERVICE_UNAVAILABLE: string;
/**
 * Error code representing transient loss of service. Used by {@link Neo4jError#code}.
 * @type {string}
 */
declare const SESSION_EXPIRED: string;
/**
 * Error code representing serialization/deserialization issue in the Bolt protocol. Used by {@link Neo4jError#code}.
 * @type {string}
 */
declare const PROTOCOL_ERROR: string;
/**
 * Error code representing an no classified error. Used by {@link Neo4jError#code}.
 * @type {string}
 */
declare const NOT_AVAILABLE: string;
/**
 * Possible error codes in the {@link Neo4jError}
 */
type Neo4jErrorCode = typeof SERVICE_UNAVAILABLE | typeof SESSION_EXPIRED | typeof PROTOCOL_ERROR | typeof NOT_AVAILABLE;
/**
 * Class for all errors thrown/returned by the driver.
 */
declare class Neo4jError extends Error {
    /**
     * Optional error code. Will be populated when error originates in the database.
     */
    code: Neo4jErrorCode;
    retriable: boolean;
    __proto__: Neo4jError;
    /**
     * @constructor
     * @param {string} message - the error message
     * @param {string} code - Optional error code. Will be populated when error originates in the database.
     */
    constructor(message: string, code: Neo4jErrorCode, cause?: Error);
    /**
     * Verifies if the given error is retriable.
     *
     * @param {object|undefined|null} error the error object
     * @returns {boolean} true if the error is retriable
     */
    static isRetriable(error?: any | null): boolean;
}
/**
 * Create a new error from a message and error code
 * @param message the error message
 * @param code the error code
 * @return {Neo4jError} an {@link Neo4jError}
 * @private
 */
declare function newError(message: string, code?: Neo4jErrorCode, cause?: Error): Neo4jError;
/**
 * Verifies if the given error is retriable.
 *
 * @public
 * @param {object|undefined|null} error the error object
 * @returns {boolean} true if the error is retriable
 */
declare const isRetriableError: typeof Neo4jError.isRetriable;
export { newError, isRetriableError, Neo4jError, SERVICE_UNAVAILABLE, SESSION_EXPIRED, PROTOCOL_ERROR };