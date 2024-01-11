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
/* eslint-disable @typescript-eslint/promise-function-async */
import { validateQueryAndParameters } from './internal/util';
import { ReadOnlyConnectionHolder, EMPTY_CONNECTION_HOLDER } from './internal/connection-holder';
import { Bookmarks } from './internal/bookmarks';
import { TxConfig } from './internal/tx-config';
import { FailedObserver, CompletedObserver } from './internal/observers';
import { newError } from './error';
import Result from './result';
/**
 * Represents a transaction in the Neo4j database.
 *
 * @access public
 */
class Transaction {
    _connectionHolder;
    _reactive;
    _state;
    _onClose;
    _onBookmarks;
    _onConnection;
    _onError;
    _onComplete;
    _fetchSize;
    _results;
    _impersonatedUser;
    _lowRecordWatermak;
    _highRecordWatermark;
    _bookmarks;
    _activePromise;
    _acceptActive;
    _notificationFilter;
    _apiTelemetryConfig;
    /**
     * @constructor
     * @param {object} args
     * @param {ConnectionHolder} args.connectionHolder - the connection holder to get connection from.
     * @param {function()} args.onClose - Function to be called when transaction is committed or rolled back.
     * @param {function(bookmarks: Bookmarks)} args.onBookmarks callback invoked when new bookmark is produced.
     * @param {function()} args.onConnection - Function to be called when a connection is obtained to ensure the conneciton
     * is not yet released.
     * @param {boolean} args.reactive whether this transaction generates reactive streams
     * @param {number} args.fetchSize - the record fetch size in each pulling batch.
     * @param {string} args.impersonatedUser - The name of the user which should be impersonated for the duration of the session.
     * @param {number} args.highRecordWatermark - The high watermark for the record buffer.
     * @param {number} args.lowRecordWatermark - The low watermark for the record buffer.
     * @param {NotificationFilter} args.notificationFilter - The notification filter used for this transaction.
     * @param {NonAutoCommitApiTelemetryConfig} args.apiTelemetryConfig - The api telemetry configuration. Empty/Null for disabling telemetry
     */
    constructor({ connectionHolder, onClose, onBookmarks, onConnection, reactive, fetchSize, impersonatedUser, highRecordWatermark, lowRecordWatermark, notificationFilter, apiTelemetryConfig }) {
        this._connectionHolder = connectionHolder;
        this._reactive = reactive;
        this._state = _states.ACTIVE;
        this._onClose = onClose;
        this._onBookmarks = onBookmarks;
        this._onConnection = onConnection;
        this._onError = this._onErrorCallback.bind(this);
        this._fetchSize = fetchSize;
        this._onComplete = this._onCompleteCallback.bind(this);
        this._results = [];
        this._impersonatedUser = impersonatedUser;
        this._lowRecordWatermak = lowRecordWatermark;
        this._highRecordWatermark = highRecordWatermark;
        this._bookmarks = Bookmarks.empty();
        this._notificationFilter = notificationFilter;
        this._apiTelemetryConfig = apiTelemetryConfig;
        this._acceptActive = () => { }; // satisfy DenoJS
        this._activePromise = new Promise((resolve, reject) => {
            this._acceptActive = resolve;
        });
    }
    /**
     * @private
     * @param {Bookmarks | string |  string []} bookmarks
     * @param {TxConfig} txConfig
     * @param {Object} events List of observers to events
     * @returns {void}
     */
    _begin(getBookmarks, txConfig, events) {
        this._connectionHolder
            .getConnection()
            .then(async (connection) => {
            this._onConnection();
            if (connection != null) {
                this._bookmarks = await getBookmarks();
                return connection.beginTransaction({
                    bookmarks: this._bookmarks,
                    txConfig,
                    mode: this._connectionHolder.mode(),
                    database: this._connectionHolder.database(),
                    impersonatedUser: this._impersonatedUser,
                    notificationFilter: this._notificationFilter,
                    apiTelemetryConfig: this._apiTelemetryConfig,
                    beforeError: (error) => {
                        if (events != null) {
                            events.onError(error);
                        }
                        this._onError(error).catch(() => { });
                    },
                    afterComplete: (metadata) => {
                        if (events != null) {
                            events.onComplete(metadata);
                        }
                        this._onComplete(metadata);
                    }
                });
            }
            else {
                throw newError('No connection available');
            }
        })
            .catch(error => {
            if (events != null) {
                events.onError(error);
            }
            this._onError(error).catch(() => { });
        })
            // It should make the transaction active anyway
            // further errors will be treated by the existing
            // observers
            .finally(() => this._acceptActive());
    }
    /**
     * Run Cypher query
     * Could be called with a query object i.e.: `{text: "MATCH ...", parameters: {param: 1}}`
     * or with the query and parameters as separate arguments.
     * @param {mixed} query - Cypher query to execute
     * @param {Object} parameters - Map with parameters to use in query
     * @return {Result} New Result
     */
    run(query, parameters) {
        const { validatedQuery, params } = validateQueryAndParameters(query, parameters);
        const result = this._state.run(validatedQuery, params, {
            connectionHolder: this._connectionHolder,
            onError: this._onError,
            onComplete: this._onComplete,
            onConnection: this._onConnection,
            reactive: this._reactive,
            fetchSize: this._fetchSize,
            highRecordWatermark: this._highRecordWatermark,
            lowRecordWatermark: this._lowRecordWatermak,
            preparationJob: this._activePromise
        });
        this._results.push(result);
        return result;
    }
    /**
     * Commits the transaction and returns the result.
     *
     * After committing the transaction can no longer be used.
     *
     * @returns {Promise<void>} An empty promise if committed successfully or error if any error happened during commit.
     */
    commit() {
        const committed = this._state.commit({
            connectionHolder: this._connectionHolder,
            onError: this._onError,
            onComplete: (meta) => this._onCompleteCallback(meta, this._bookmarks),
            onConnection: this._onConnection,
            pendingResults: this._results,
            preparationJob: this._activePromise
        });
        this._state = committed.state;
        // clean up
        this._onClose();
        return new Promise((resolve, reject) => {
            committed.result.subscribe({
                onCompleted: () => resolve(),
                onError: (error) => reject(error)
            });
        });
    }
    /**
     * Rollbacks the transaction.
     *
     * After rolling back, the transaction can no longer be used.
     *
     * @returns {Promise<void>} An empty promise if rolled back successfully or error if any error happened during
     * rollback.
     */
    rollback() {
        const rolledback = this._state.rollback({
            connectionHolder: this._connectionHolder,
            onError: this._onError,
            onComplete: this._onComplete,
            onConnection: this._onConnection,
            pendingResults: this._results,
            preparationJob: this._activePromise
        });
        this._state = rolledback.state;
        // clean up
        this._onClose();
        return new Promise((resolve, reject) => {
            rolledback.result.subscribe({
                onCompleted: () => resolve(),
                onError: (error) => reject(error)
            });
        });
    }
    /**
     * Check if this transaction is active, which means commit and rollback did not happen.
     * @return {boolean} `true` when not committed and not rolled back, `false` otherwise.
     */
    isOpen() {
        return this._state === _states.ACTIVE;
    }
    /**
     * Closes the transaction
     *
     * This method will roll back the transaction if it is not already committed or rolled back.
     *
     * @returns {Promise<void>} An empty promise if closed successfully or error if any error happened during
     */
    async close() {
        if (this.isOpen()) {
            await this.rollback();
        }
    }
    // eslint-disable-next-line
    // @ts-ignore
    [Symbol.asyncDispose]() {
        return this.close();
    }
    _onErrorCallback(error) {
        // error will be "acknowledged" by sending a RESET message
        // database will then forget about this transaction and cleanup all corresponding resources
        // it is thus safe to move this transaction to a FAILED state and disallow any further interactions with it
        this._state = _states.FAILED;
        this._onClose();
        this._results.forEach(result => {
            if (result.isOpen()) {
                // @ts-expect-error
                result._streamObserverPromise
                    .then(resultStreamObserver => resultStreamObserver.onError(error))
                    // Nothing to do since we don't have a observer to notify the error
                    // the result will be already broke in other ways.
                    .catch((_) => { });
            }
        });
        // release connection back to the pool
        return this._connectionHolder.releaseConnection();
    }
    /**
     * @private
     * @param {object} meta The meta with bookmarks
     * @returns {void}
     */
    _onCompleteCallback(meta, previousBookmarks) {
        this._onBookmarks(new Bookmarks(meta?.bookmark), previousBookmarks ?? Bookmarks.empty(), meta?.db);
    }
}
const _states = {
    // The transaction is running with no explicit success or failure marked
    ACTIVE: {
        commit: ({ connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob }) => {
            return {
                result: finishTransaction(true, connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob),
                state: _states.SUCCEEDED
            };
        },
        rollback: ({ connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob }) => {
            return {
                result: finishTransaction(false, connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob),
                state: _states.ROLLED_BACK
            };
        },
        run: (query, parameters, { connectionHolder, onError, onComplete, onConnection, reactive, fetchSize, highRecordWatermark, lowRecordWatermark, preparationJob }) => {
            // RUN in explicit transaction can't contain bookmarks and transaction configuration
            // No need to include mode and database name as it shall be included in begin
            const requirements = preparationJob ?? Promise.resolve();
            const observerPromise = connectionHolder.getConnection()
                .then(conn => requirements.then(() => conn))
                .then(conn => {
                onConnection();
                if (conn != null) {
                    return conn.run(query, parameters, {
                        bookmarks: Bookmarks.empty(),
                        txConfig: TxConfig.empty(),
                        beforeError: onError,
                        afterComplete: onComplete,
                        reactive,
                        fetchSize,
                        highRecordWatermark,
                        lowRecordWatermark
                    });
                }
                else {
                    throw newError('No connection available');
                }
            })
                .catch(error => new FailedObserver({ error, onError }));
            return newCompletedResult(observerPromise, query, parameters, connectionHolder, highRecordWatermark, lowRecordWatermark);
        }
    },
    // An error has occurred, transaction can no longer be used and no more messages will
    // be sent for this transaction.
    FAILED: {
        commit: ({ connectionHolder, onError, onComplete }) => {
            return {
                result: newCompletedResult(new FailedObserver({
                    error: newError('Cannot commit this transaction, because it has been rolled back either because of an error or explicit termination.'),
                    onError
                }), 'COMMIT', {}, connectionHolder, 0, // high watermark
                0 // low watermark
                ),
                state: _states.FAILED
            };
        },
        rollback: ({ connectionHolder, onError, onComplete }) => {
            return {
                result: newCompletedResult(new CompletedObserver(), 'ROLLBACK', {}, connectionHolder, 0, // high watermark
                0 // low watermark
                ),
                state: _states.FAILED
            };
        },
        run: (query, parameters, { connectionHolder, onError, onComplete }) => {
            return newCompletedResult(new FailedObserver({
                error: newError('Cannot run query in this transaction, because it has been rolled back either because of an error or explicit termination.'),
                onError
            }), query, parameters, connectionHolder, 0, // high watermark
            0 // low watermark
            );
        }
    },
    // This transaction has successfully committed
    SUCCEEDED: {
        commit: ({ connectionHolder, onError, onComplete }) => {
            return {
                result: newCompletedResult(new FailedObserver({
                    error: newError('Cannot commit this transaction, because it has already been committed.'),
                    onError
                }), 'COMMIT', {}, EMPTY_CONNECTION_HOLDER, 0, // high watermark
                0 // low watermark
                ),
                state: _states.SUCCEEDED,
                connectionHolder
            };
        },
        rollback: ({ connectionHolder, onError, onComplete }) => {
            return {
                result: newCompletedResult(new FailedObserver({
                    error: newError('Cannot rollback this transaction, because it has already been committed.'),
                    onError
                }), 'ROLLBACK', {}, EMPTY_CONNECTION_HOLDER, 0, // high watermark
                0 // low watermark
                ),
                state: _states.SUCCEEDED,
                connectionHolder
            };
        },
        run: (query, parameters, { connectionHolder, onError, onComplete }) => {
            return newCompletedResult(new FailedObserver({
                error: newError('Cannot run query in this transaction, because it has already been committed.'),
                onError
            }), query, parameters, connectionHolder, 0, // high watermark
            0 // low watermark
            );
        }
    },
    // This transaction has been rolled back
    ROLLED_BACK: {
        commit: ({ connectionHolder, onError, onComplete }) => {
            return {
                result: newCompletedResult(new FailedObserver({
                    error: newError('Cannot commit this transaction, because it has already been rolled back.'),
                    onError
                }), 'COMMIT', {}, connectionHolder, 0, // high watermark
                0 // low watermark
                ),
                state: _states.ROLLED_BACK
            };
        },
        rollback: ({ connectionHolder, onError, onComplete }) => {
            return {
                result: newCompletedResult(new FailedObserver({
                    error: newError('Cannot rollback this transaction, because it has already been rolled back.')
                }), 'ROLLBACK', {}, connectionHolder, 0, // high watermark
                0 // low watermark
                ),
                state: _states.ROLLED_BACK
            };
        },
        run: (query, parameters, { connectionHolder, onError, onComplete }) => {
            return newCompletedResult(new FailedObserver({
                error: newError('Cannot run query in this transaction, because it has already been rolled back.'),
                onError
            }), query, parameters, connectionHolder, 0, // high watermark
            0 // low watermark
            );
        }
    }
};
/**
 *
 * @param {boolean} commit
 * @param {ConnectionHolder} connectionHolder
 * @param {function(err:Error): any} onError
 * @param {function(metadata:object): any} onComplete
 * @param {function() : any} onConnection
 * @param {list<Result>>}pendingResults all run results in this transaction
 */
function finishTransaction(commit, connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob) {
    const requirements = preparationJob ?? Promise.resolve();
    const observerPromise = connectionHolder.getConnection()
        .then(conn => requirements.then(() => conn))
        .then(connection => {
        onConnection();
        pendingResults.forEach(r => r._cancel());
        return Promise.all(pendingResults.map(result => result.summary())).then(results => {
            if (connection != null) {
                if (commit) {
                    return connection.commitTransaction({
                        beforeError: onError,
                        afterComplete: onComplete
                    });
                }
                else {
                    return connection.rollbackTransaction({
                        beforeError: onError,
                        afterComplete: onComplete
                    });
                }
            }
            else {
                throw newError('No connection available');
            }
        });
    })
        .catch(error => new FailedObserver({ error, onError }));
    // for commit & rollback we need result that uses real connection holder and notifies it when
    // connection is not needed and can be safely released to the pool
    return new Result(observerPromise, commit ? 'COMMIT' : 'ROLLBACK', {}, connectionHolder, {
        high: Number.MAX_VALUE,
        low: Number.MAX_VALUE
    });
}
/**
 * Creates a {@link Result} with empty connection holder.
 * For cases when result represents an intermediate or failed action, does not require any metadata and does not
 * need to influence real connection holder to release connections.
 * @param {ResultStreamObserver} observer - an observer for the created result.
 * @param {string} query - the cypher query that produced the result.
 * @param {Object} parameters - the parameters for cypher query that produced the result.
 * @param {ConnectionHolder} connectionHolder - the connection holder used to get the result
 * @return {Result} new result.
 * @private
 */
function newCompletedResult(observerPromise, query, parameters, connectionHolder = EMPTY_CONNECTION_HOLDER, highRecordWatermark, lowRecordWatermark) {
    return new Result(Promise.resolve(observerPromise), query, parameters, new ReadOnlyConnectionHolder(connectionHolder ?? EMPTY_CONNECTION_HOLDER), {
        low: lowRecordWatermark,
        high: highRecordWatermark
    });
}
export default Transaction;