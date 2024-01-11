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
// A common place for constructing error objects, to keep them
// uniform across the driver surface.
/**
 * Error code representing complete loss of service. Used by {@link Neo4jError#code}.
 * @type {string}
 */
const SERVICE_UNAVAILABLE = 'ServiceUnavailable';
/**
 * Error code representing transient loss of service. Used by {@link Neo4jError#code}.
 * @type {string}
 */
const SESSION_EXPIRED = 'SessionExpired';
/**
 * Error code representing serialization/deserialization issue in the Bolt protocol. Used by {@link Neo4jError#code}.
 * @type {string}
 */
const PROTOCOL_ERROR = 'ProtocolError';
/**
 * Error code representing an no classified error. Used by {@link Neo4jError#code}.
 * @type {string}
 */
const NOT_AVAILABLE = 'N/A';
/// TODO: Remove definitions of this.constructor and this.__proto__
/**
 * Class for all errors thrown/returned by the driver.
 */
class Neo4jError extends Error {
    /**
     * Optional error code. Will be populated when error originates in the database.
     */
    code;
    retriable;
    __proto__;
    /**
     * @constructor
     * @param {string} message - the error message
     * @param {string} code - Optional error code. Will be populated when error originates in the database.
     */
    constructor(message, code, cause) {
        // eslint-disable-next-line
        // @ts-ignore: not available in ES6 yet
        super(message, cause != null ? { cause } : undefined);
        this.constructor = Neo4jError;
        // eslint-disable-next-line no-proto
        this.__proto__ = Neo4jError.prototype;
        this.code = code;
        this.name = 'Neo4jError';
        /**
         * Indicates if the error is retriable.
         * @type {boolean} - true if the error is retriable
         */
        this.retriable = _isRetriableCode(code);
    }
    /**
     * Verifies if the given error is retriable.
     *
     * @param {object|undefined|null} error the error object
     * @returns {boolean} true if the error is retriable
     */
    static isRetriable(error) {
        return error !== null &&
            error !== undefined &&
            error instanceof Neo4jError &&
            error.retriable;
    }
}
/**
 * Create a new error from a message and error code
 * @param message the error message
 * @param code the error code
 * @return {Neo4jError} an {@link Neo4jError}
 * @private
 */
function newError(message, code, cause) {
    return new Neo4jError(message, code ?? NOT_AVAILABLE, cause);
}
/**
 * Verifies if the given error is retriable.
 *
 * @public
 * @param {object|undefined|null} error the error object
 * @returns {boolean} true if the error is retriable
 */
const isRetriableError = Neo4jError.isRetriable;
/**
 * @private
 * @param {string} code the error code
 * @returns {boolean} true if the error is a retriable error
 */
function _isRetriableCode(code) {
    return code === SERVICE_UNAVAILABLE ||
        code === SESSION_EXPIRED ||
        _isAuthorizationExpired(code) ||
        _isTransientError(code);
}
/**
 * @private
 * @param {string} code the error to check
 * @return {boolean} true if the error is a transient error
 */
function _isTransientError(code) {
    return code?.includes('TransientError') === true;
}
/**
 * @private
 * @param {string} code the error to check
 * @returns {boolean} true if the error is a service unavailable error
 */
function _isAuthorizationExpired(code) {
    return code === 'Neo.ClientError.Security.AuthorizationExpired';
}
export { newError, isRetriableError, Neo4jError, SERVICE_UNAVAILABLE, SESSION_EXPIRED, PROTOCOL_ERROR };
