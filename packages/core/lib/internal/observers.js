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
export class CompletedObserver {
    subscribe(observer) {
        apply(observer, observer.onKeys, []);
        apply(observer, observer.onCompleted, {});
    }
    cancel() {
        // do nothing
    }
    pause() {
        // do nothing
    }
    resume() {
        // do nothing
    }
    prepareToHandleSingleResponse() {
        // do nothing
    }
    markCompleted() {
        // do nothing
    }
    onError(error) {
        // nothing to do, already finished
        // eslint-disable-next-line
        // @ts-ignore: not available in ES oldest supported version
        throw new Error('CompletedObserver not supposed to call onError', { cause: error });
    }
}
export class FailedObserver {
    _error;
    _beforeError;
    _observers;
    constructor({ error, onError }) {
        this._error = error;
        this._beforeError = onError;
        this._observers = [];
        this.onError(error);
    }
    subscribe(observer) {
        apply(observer, observer.onError, this._error);
        this._observers.push(observer);
    }
    onError(error) {
        apply(this, this._beforeError, error);
        this._observers.forEach(o => apply(o, o.onError, error));
    }
    cancel() {
        // do nothing
    }
    pause() {
        // do nothing
    }
    resume() {
        // do nothing
    }
    markCompleted() {
        // do nothing
    }
    prepareToHandleSingleResponse() {
        // do nothing
    }
}
function apply(thisArg, func, param) {
    if (func != null) {
        func.bind(thisArg)(param);
    }
}
