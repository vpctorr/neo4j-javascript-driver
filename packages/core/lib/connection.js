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
/**
 * Interface which defines a connection for the core driver object.
 *
 *
 * This connection exposes only methods used by the code module.
 * Methods with connection implementation details can be defined and used
 * by the implementation layer.
 *
 * @private
 * @interface
 */
class Connection {
    beginTransaction(config) {
        throw new Error('Not implemented');
    }
    run(query, parameters, config) {
        throw new Error('Not implemented');
    }
    commitTransaction(config) {
        throw new Error('Not implemented');
    }
    rollbackTransaction(config) {
        throw new Error('Not implemented');
    }
    resetAndFlush() {
        throw new Error('Not implemented');
    }
    isOpen() {
        throw new Error('Not implemented');
    }
    getProtocolVersion() {
        throw new Error('Not implemented');
    }
    hasOngoingObservableRequests() {
        throw new Error('Not implemented');
    }
}
export default Connection;
