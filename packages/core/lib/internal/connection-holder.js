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
import { newError } from '../error';
import { assertString } from './util';
import { ACCESS_MODE_WRITE } from './constants';
import { Bookmarks } from './bookmarks';
import { Logger } from './logger';
/**
 * Utility to lazily initialize connections and return them back to the pool when unused.
 * @private
 */
class ConnectionHolder {
    _mode;
    _database;
    _bookmarks;
    _connectionProvider;
    _referenceCount;
    _connectionPromise;
    _impersonatedUser;
    _getConnectionAcquistionBookmarks;
    _onDatabaseNameResolved;
    _auth;
    _log;
    _closed;
    /**
     * @constructor
     * @param {object} params
     * @property {string} params.mode - the access mode for new connection holder.
     * @property {string} params.database - the target database name.
     * @property {Bookmarks} params.bookmarks - initial bookmarks
     * @property {ConnectionProvider} params.connectionProvider - the connection provider to acquire connections from.
     * @property {string?} params.impersonatedUser - the user which will be impersonated
     * @property {function(databaseName:string)} params.onDatabaseNameResolved - callback called when the database name is resolved
     * @property {function():Promise<Bookmarks>} params.getConnectionAcquistionBookmarks - called for getting Bookmarks for acquiring connections
     * @property {AuthToken} params.auth - the target auth for the to-be-acquired connection
     */
    constructor({ mode, database = '', bookmarks, connectionProvider, impersonatedUser, onDatabaseNameResolved, getConnectionAcquistionBookmarks, auth, log }) {
        this._mode = mode ?? ACCESS_MODE_WRITE;
        this._closed = false;
        this._database = database != null ? assertString(database, 'database') : '';
        this._bookmarks = bookmarks ?? Bookmarks.empty();
        this._connectionProvider = connectionProvider;
        this._impersonatedUser = impersonatedUser;
        this._referenceCount = 0;
        this._connectionPromise = Promise.resolve(null);
        this._onDatabaseNameResolved = onDatabaseNameResolved;
        this._auth = auth;
        this._log = log;
        this._logError = this._logError.bind(this);
        this._getConnectionAcquistionBookmarks = getConnectionAcquistionBookmarks ?? (() => Promise.resolve(Bookmarks.empty()));
    }
    mode() {
        return this._mode;
    }
    database() {
        return this._database;
    }
    setDatabase(database) {
        this._database = database;
    }
    bookmarks() {
        return this._bookmarks;
    }
    connectionProvider() {
        return this._connectionProvider;
    }
    referenceCount() {
        return this._referenceCount;
    }
    initializeConnection() {
        if (this._referenceCount === 0 && (this._connectionProvider != null)) {
            this._connectionPromise = this._createConnectionPromise(this._connectionProvider);
        }
        else {
            this._referenceCount++;
            return false;
        }
        this._referenceCount++;
        return true;
    }
    async _createConnectionPromise(connectionProvider) {
        return await connectionProvider.acquireConnection({
            accessMode: this._mode,
            database: this._database,
            bookmarks: await this._getBookmarks(),
            impersonatedUser: this._impersonatedUser,
            onDatabaseNameResolved: this._onDatabaseNameResolved,
            auth: this._auth
        });
    }
    async _getBookmarks() {
        return await this._getConnectionAcquistionBookmarks();
    }
    getConnection() {
        return this._connectionPromise;
    }
    releaseConnection() {
        if (this._referenceCount === 0) {
            return this._connectionPromise;
        }
        this._referenceCount--;
        if (this._referenceCount === 0) {
            return this._releaseConnection();
        }
        return this._connectionPromise;
    }
    close(hasTx) {
        this._closed = true;
        if (this._referenceCount === 0) {
            return this._connectionPromise;
        }
        this._referenceCount = 0;
        return this._releaseConnection(hasTx);
    }
    log() {
        return this._log;
    }
    /**
     * Return the current pooled connection instance to the connection pool.
     * We don't pool Session instances, to avoid users using the Session after they've called close.
     * The `Session` object is just a thin wrapper around Connection anyway, so it makes little difference.
     * @return {Promise} - promise resolved then connection is returned to the pool.
     * @private
     */
    _releaseConnection(hasTx) {
        this._connectionPromise = this._connectionPromise
            .then((connection) => {
            if (connection != null) {
                if (connection.isOpen() && (connection.hasOngoingObservableRequests() || hasTx === true)) {
                    return connection
                        .resetAndFlush()
                        .catch(ignoreError)
                        .then(() => connection.release().then(() => null));
                }
                return connection.release().then(() => null);
            }
            else {
                return Promise.resolve(null);
            }
        })
            .catch(this._logError);
        return this._connectionPromise;
    }
    _logError(error) {
        if (this._log.isWarnEnabled()) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            this._log.warn(`ConnectionHolder got an error while releasing the connection. Error ${error}. Stacktrace: ${error.stack}`);
        }
        return null;
    }
}
/**
 * Provides a interaction with a ConnectionHolder without change it state by
 * releasing or initilizing
 */
export default class ReadOnlyConnectionHolder extends ConnectionHolder {
    _connectionHolder;
    /**
     * Constructor
     * @param {ConnectionHolder} connectionHolder the connection holder which will treat the requests
     */
    constructor(connectionHolder) {
        super({
            mode: connectionHolder.mode(),
            database: connectionHolder.database(),
            bookmarks: connectionHolder.bookmarks(),
            // @ts-expect-error
            getConnectionAcquistionBookmarks: connectionHolder._getConnectionAcquistionBookmarks,
            connectionProvider: connectionHolder.connectionProvider(),
            log: connectionHolder.log()
        });
        this._connectionHolder = connectionHolder;
    }
    /**
     * Return the true if the connection is suppose to be initilized with the command.
     *
     * @return {boolean}
     */
    initializeConnection() {
        if (this._connectionHolder.referenceCount() === 0) {
            return false;
        }
        return true;
    }
    /**
     * Get the current connection promise.
     * @return {Promise<Connection>} promise resolved with the current connection.
     */
    getConnection() {
        return this._connectionHolder.getConnection();
    }
    /**
     * Get the current connection promise, doesn't performs the release
     * @return {Promise<Connection>} promise with the resolved current connection
     */
    releaseConnection() {
        return this._connectionHolder.getConnection().catch(() => Promise.resolve(null));
    }
    /**
     * Get the current connection promise, doesn't performs the connection close
     * @return {Promise<Connection>} promise with the resolved current connection
     */
    close() {
        return this._connectionHolder.getConnection().catch(() => Promise.resolve(null));
    }
}
class EmptyConnectionHolder extends ConnectionHolder {
    constructor() {
        super({
            // Empty logger
            log: Logger.create({})
        });
    }
    mode() {
        return undefined;
    }
    database() {
        return undefined;
    }
    initializeConnection() {
        // nothing to initialize
        return true;
    }
    async getConnection() {
        return await Promise.reject(newError('This connection holder does not serve connections'));
    }
    async releaseConnection() {
        return await Promise.resolve(null);
    }
    async close() {
        return await Promise.resolve(null);
    }
}
/**
 * Connection holder that does not manage any connections.
 * @type {ConnectionHolder}
 * @private
 */
const EMPTY_CONNECTION_HOLDER = new EmptyConnectionHolder();
// eslint-disable-next-line n/handle-callback-err
function ignoreError(error) {
    return null;
}
export { ConnectionHolder, ReadOnlyConnectionHolder, EMPTY_CONNECTION_HOLDER };
