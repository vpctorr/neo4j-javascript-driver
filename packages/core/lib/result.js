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
import ResultSummary from './result-summary';
import { util, connectionHolder } from './internal';
import { newError, PROTOCOL_ERROR } from './error';
const { EMPTY_CONNECTION_HOLDER } = connectionHolder;
/**
 * @private
 * @param {Error} error The error
 * @returns {void}
 */
const DEFAULT_ON_ERROR = (error) => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-base-to-string
    console.log('Uncaught error when processing result: ' + error);
};
/**
 * @private
 * @param {ResultSummary} summary
 * @returns {void}
 */
const DEFAULT_ON_COMPLETED = (summary) => { };
/**
 * @private
 * @param {string[]} keys List of keys of the record in the result
 * @return {void}
 */
const DEFAULT_ON_KEYS = (keys) => { };
/**
 * A stream of {@link Record} representing the result of a query.
 * Can be consumed eagerly as {@link Promise} resolved with array of records and {@link ResultSummary}
 * summary, or rejected with error that contains {@link string} code and {@link string} message.
 * Alternatively can be consumed lazily using {@link Result#subscribe} function.
 * @access public
 */
class Result {
    _stack;
    _streamObserverPromise;
    _p;
    _query;
    _parameters;
    _connectionHolder;
    _keys;
    _summary;
    _error;
    _watermarks;
    /**
     * Inject the observer to be used.
     * @constructor
     * @access private
     * @param {Promise<observer.ResultStreamObserver>} streamObserverPromise
     * @param {mixed} query - Cypher query to execute
     * @param {Object} parameters - Map with parameters to use in query
     * @param {ConnectionHolder} connectionHolder - to be notified when result is either fully consumed or error happened.
     */
    constructor(streamObserverPromise, query, parameters, connectionHolder, watermarks = { high: Number.MAX_VALUE, low: Number.MAX_VALUE }) {
        this._stack = captureStacktrace();
        this._streamObserverPromise = streamObserverPromise;
        this._p = null;
        this._query = query;
        this._parameters = parameters ?? {};
        this._connectionHolder = connectionHolder ?? EMPTY_CONNECTION_HOLDER;
        this._keys = null;
        this._summary = null;
        this._error = null;
        this._watermarks = watermarks;
    }
    /**
     * Returns a promise for the field keys.
     *
     * *Should not be combined with {@link Result#subscribe} function.*
     *
     * @public
     * @returns {Promise<string[]>} - Field keys, in the order they will appear in records.
     }
     */
    keys() {
        if (this._keys !== null) {
            return Promise.resolve(this._keys);
        }
        else if (this._error !== null) {
            return Promise.reject(this._error);
        }
        return new Promise((resolve, reject) => {
            this._streamObserverPromise
                .then(observer => observer.subscribe(this._decorateObserver({
                onKeys: keys => resolve(keys),
                onError: err => reject(err)
            })))
                .catch(reject);
        });
    }
    /**
     * Returns a promise for the result summary.
     *
     * *Should not be combined with {@link Result#subscribe} function.*
     *
     * @public
     * @returns {Promise<ResultSummary>} - Result summary.
     *
     */
    summary() {
        if (this._summary !== null) {
            return Promise.resolve(this._summary);
        }
        else if (this._error !== null) {
            return Promise.reject(this._error);
        }
        return new Promise((resolve, reject) => {
            this._streamObserverPromise
                .then(o => {
                o.cancel();
                o.subscribe(this._decorateObserver({
                    onCompleted: summary => resolve(summary),
                    onError: err => reject(err)
                }));
            })
                .catch(reject);
        });
    }
    /**
     * Create and return new Promise
     *
     * @private
     * @return {Promise} new Promise.
     */
    _getOrCreatePromise() {
        if (this._p == null) {
            this._p = new Promise((resolve, reject) => {
                const records = [];
                const observer = {
                    onNext: (record) => {
                        records.push(record);
                    },
                    onCompleted: (summary) => {
                        resolve({ records, summary });
                    },
                    onError: (error) => {
                        reject(error);
                    }
                };
                this.subscribe(observer);
            });
        }
        return this._p;
    }
    /**
     * Provides a async iterator over the records in the result.
     *
     * *Should not be combined with {@link Result#subscribe} or ${@link Result#then} functions.*
     *
     * @public
     * @returns {PeekableAsyncIterator<Record<R>, ResultSummary>} The async iterator for the Results
     */
    [Symbol.asyncIterator]() {
        if (!this.isOpen()) {
            const error = newError('Result is already consumed');
            return {
                next: () => Promise.reject(error),
                peek: () => Promise.reject(error)
            };
        }
        const state = { paused: true, firstRun: true, finished: false };
        const controlFlow = () => {
            if (state.streaming == null) {
                return;
            }
            const size = state.queuedObserver?.size ?? 0;
            const queueSizeIsOverHighOrEqualWatermark = size >= this._watermarks.high;
            const queueSizeIsBellowOrEqualLowWatermark = size <= this._watermarks.low;
            if (queueSizeIsOverHighOrEqualWatermark && !state.paused) {
                state.paused = true;
                state.streaming.pause();
            }
            else if ((queueSizeIsBellowOrEqualLowWatermark && state.paused) || (state.firstRun && !queueSizeIsOverHighOrEqualWatermark)) {
                state.firstRun = false;
                state.paused = false;
                state.streaming.resume();
            }
        };
        const initializeObserver = async () => {
            if (state.queuedObserver === undefined) {
                state.queuedObserver = this._createQueuedResultObserver(controlFlow);
                state.streaming = await this._subscribe(state.queuedObserver, true).catch(() => undefined);
                controlFlow();
            }
            return state.queuedObserver;
        };
        const assertSummary = (summary) => {
            if (summary === undefined) {
                throw newError('InvalidState: Result stream finished without Summary', PROTOCOL_ERROR);
            }
            return true;
        };
        return {
            next: async () => {
                if (state.finished) {
                    if (assertSummary(state.summary)) {
                        return { done: true, value: state.summary };
                    }
                }
                const queuedObserver = await initializeObserver();
                const next = await queuedObserver.dequeue();
                if (next.done === true) {
                    state.finished = next.done;
                    state.summary = next.value;
                }
                return next;
            },
            return: async (value) => {
                if (state.finished) {
                    if (assertSummary(state.summary)) {
                        return { done: true, value: value ?? state.summary };
                    }
                }
                state.streaming?.cancel();
                const queuedObserver = await initializeObserver();
                const last = await queuedObserver.dequeueUntilDone();
                state.finished = true;
                last.value = value ?? last.value;
                state.summary = last.value;
                return last;
            },
            peek: async () => {
                if (state.finished) {
                    if (assertSummary(state.summary)) {
                        return { done: true, value: state.summary };
                    }
                }
                const queuedObserver = await initializeObserver();
                return await queuedObserver.head();
            }
        };
    }
    /**
     * Waits for all results and calls the passed in function with the results.
     *
     * *Should not be combined with {@link Result#subscribe} function.*
     *
     * @param {function(result: {records:Array<Record>, summary: ResultSummary})} onFulfilled - function to be called
     * when finished.
     * @param {function(error: {message:string, code:string})} onRejected - function to be called upon errors.
     * @return {Promise} promise.
     */
    then(onFulfilled, onRejected) {
        return this._getOrCreatePromise().then(onFulfilled, onRejected);
    }
    /**
     * Catch errors when using promises.
     *
     * *Should not be combined with {@link Result#subscribe} function.*
     *
     * @param {function(error: Neo4jError)} onRejected - Function to be called upon errors.
     * @return {Promise} promise.
     */
    catch(onRejected) {
        return this._getOrCreatePromise().catch(onRejected);
    }
    /**
     * Called when finally the result is done
     *
     * *Should not be combined with {@link Result#subscribe} function.*
     * @param {function()|null} onfinally - function when the promise finished
     * @return {Promise} promise.
     */
    [Symbol.toStringTag] = 'Result';
    finally(onfinally) {
        return this._getOrCreatePromise().finally(onfinally);
    }
    /**
     * Stream records to observer as they come in, this is a more efficient method
     * of handling the results, and allows you to handle arbitrarily large results.
     *
     * @param {Object} observer - Observer object
     * @param {function(keys: string[])} observer.onKeys - handle stream head, the field keys.
     * @param {function(record: Record)} observer.onNext - handle records, one by one.
     * @param {function(summary: ResultSummary)} observer.onCompleted - handle stream tail, the result summary.
     * @param {function(error: {message:string, code:string})} observer.onError - handle errors.
     * @return {void}
     */
    subscribe(observer) {
        this._subscribe(observer)
            .catch(() => { });
    }
    /**
     * Check if this result is active, i.e., neither a summary nor an error has been received by the result.
     * @return {boolean} `true` when neither a summary or nor an error has been received by the result.
     */
    isOpen() {
        return this._summary === null && this._error === null;
    }
    /**
     * Stream records to observer as they come in, this is a more efficient method
     * of handling the results, and allows you to handle arbitrarily large results.
     *
     * @access private
     * @param {ResultObserver} observer The observer to send records to.
     * @param {boolean} paused The flag to indicate if the stream should be started paused
     * @returns {Promise<observer.ResultStreamObserver>} The result stream observer.
     */
    _subscribe(observer, paused = false) {
        const _observer = this._decorateObserver(observer);
        return this._streamObserverPromise
            .then(o => {
            if (paused) {
                o.pause();
            }
            o.subscribe(_observer);
            return o;
        })
            .catch(error => {
            if (_observer.onError != null) {
                _observer.onError(error);
            }
            return Promise.reject(error);
        });
    }
    /**
     * Decorates the ResultObserver with the necessary methods.
     *
     * @access private
     * @param {ResultObserver} observer The ResultObserver to decorate.
     * @returns The decorated result observer
     */
    _decorateObserver(observer) {
        const onCompletedOriginal = observer.onCompleted ?? DEFAULT_ON_COMPLETED;
        const onErrorOriginal = observer.onError ?? DEFAULT_ON_ERROR;
        const onKeysOriginal = observer.onKeys ?? DEFAULT_ON_KEYS;
        const onCompletedWrapper = (metadata) => {
            this._releaseConnectionAndGetSummary(metadata).then(summary => {
                if (this._summary !== null) {
                    return onCompletedOriginal.call(observer, this._summary);
                }
                this._summary = summary;
                return onCompletedOriginal.call(observer, summary);
            }).catch(onErrorOriginal);
        };
        const onErrorWrapper = (error) => {
            // notify connection holder that the used connection is not needed any more because error happened
            // and result can't bee consumed any further; call the original onError callback after that
            this._connectionHolder.releaseConnection().then(() => {
                replaceStacktrace(error, this._stack);
                this._error = error;
                onErrorOriginal.call(observer, error);
            }).catch(onErrorOriginal);
        };
        const onKeysWrapper = (keys) => {
            this._keys = keys;
            return onKeysOriginal.call(observer, keys);
        };
        return {
            onNext: (observer.onNext != null) ? observer.onNext.bind(observer) : undefined,
            onKeys: onKeysWrapper,
            onCompleted: onCompletedWrapper,
            onError: onErrorWrapper
        };
    }
    /**
     * Signals the stream observer that the future records should be discarded on the server.
     *
     * @protected
     * @since 4.0.0
     * @returns {void}
     */
    _cancel() {
        if (this._summary === null && this._error === null) {
            this._streamObserverPromise.then(o => o.cancel())
                .catch(() => { });
        }
    }
    /**
     * @access private
     * @param metadata
     * @returns
     */
    _releaseConnectionAndGetSummary(metadata) {
        const { validatedQuery: query, params: parameters } = util.validateQueryAndParameters(this._query, this._parameters, {
            skipAsserts: true
        });
        const connectionHolder = this._connectionHolder;
        return connectionHolder
            .getConnection()
            .then(
        // onFulfilled:
        connection => connectionHolder
            .releaseConnection()
            .then(() => connection?.getProtocolVersion()), 
        // onRejected:
        _ => undefined)
            .then(protocolVersion => new ResultSummary(query, parameters, metadata, protocolVersion));
    }
    /**
     * @access private
     */
    _createQueuedResultObserver(onQueueSizeChanged) {
        function createResolvablePromise() {
            const resolvablePromise = {};
            resolvablePromise.promise = new Promise((resolve, reject) => {
                resolvablePromise.resolve = resolve;
                resolvablePromise.reject = reject;
            });
            return resolvablePromise;
        }
        function isError(elementOrError) {
            return elementOrError instanceof Error;
        }
        async function dequeue() {
            if (buffer.length > 0) {
                const element = buffer.shift() ?? newError('Unexpected empty buffer', PROTOCOL_ERROR);
                onQueueSizeChanged();
                if (isError(element)) {
                    throw element;
                }
                return element;
            }
            promiseHolder.resolvable = createResolvablePromise();
            return await promiseHolder.resolvable.promise;
        }
        const buffer = [];
        const promiseHolder = { resolvable: null };
        const observer = {
            onNext: (record) => {
                observer._push({ done: false, value: record });
            },
            onCompleted: (summary) => {
                observer._push({ done: true, value: summary });
            },
            onError: (error) => {
                observer._push(error);
            },
            _push(element) {
                if (promiseHolder.resolvable !== null) {
                    const resolvable = promiseHolder.resolvable;
                    promiseHolder.resolvable = null;
                    if (isError(element)) {
                        resolvable.reject(element);
                    }
                    else {
                        resolvable.resolve(element);
                    }
                }
                else {
                    buffer.push(element);
                    onQueueSizeChanged();
                }
            },
            dequeue,
            dequeueUntilDone: async () => {
                while (true) {
                    const element = await dequeue();
                    if (element.done === true) {
                        return element;
                    }
                }
            },
            head: async () => {
                if (buffer.length > 0) {
                    const element = buffer[0];
                    if (isError(element)) {
                        throw element;
                    }
                    return element;
                }
                promiseHolder.resolvable = createResolvablePromise();
                try {
                    const element = await promiseHolder.resolvable.promise;
                    buffer.unshift(element);
                    return element;
                }
                catch (error) {
                    buffer.unshift(error);
                    throw error;
                }
                finally {
                    onQueueSizeChanged();
                }
            },
            get size() {
                return buffer.length;
            }
        };
        return observer;
    }
}
function captureStacktrace() {
    const error = new Error('');
    if (error.stack != null) {
        return error.stack.replace(/^Error(\n\r)*/, ''); // we don't need the 'Error\n' part, if only it exists
    }
    return null;
}
/**
 * @private
 * @param {Error} error The error
 * @param {string| null} newStack The newStack
 * @returns {void}
 */
function replaceStacktrace(error, newStack) {
    if (newStack != null) {
        // Error.prototype.toString() concatenates error.name and error.message nicely
        // then we add the rest of the stack trace
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        error.stack = error.toString() + '\n' + newStack;
    }
}
export default Result;
