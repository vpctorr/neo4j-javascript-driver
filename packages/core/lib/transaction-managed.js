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
 * Represents a transaction that is managed by the transaction executor.
 *
 * @public
 */
class ManagedTransaction {
    _run;
    /**
     * @private
     */
    constructor({ run }) {
        /**
         * @private
         */
        this._run = run;
    }
    /**
     * @private
     * @param {Transaction} tx - Transaction to wrap
     * @returns {ManagedTransaction} the ManagedTransaction
     */
    static fromTransaction(tx) {
        return new ManagedTransaction({
            run: tx.run.bind(tx)
        });
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
        return this._run(query, parameters);
    }
}
export default ManagedTransaction;
