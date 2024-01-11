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
import { TELEMETRY_APIS } from './constants';
export default class QueryExecutor {
    _createSession;
    constructor(_createSession) {
        this._createSession = _createSession;
    }
    async execute(config, query, parameters) {
        const session = this._createSession({
            database: config.database,
            bookmarkManager: config.bookmarkManager,
            impersonatedUser: config.impersonatedUser
        });
        // @ts-expect-error The method is private for external users
        session._configureTransactionExecutor(true, TELEMETRY_APIS.EXECUTE_QUERY);
        try {
            const executeInTransaction = config.routing === 'READ'
                ? session.executeRead.bind(session)
                : session.executeWrite.bind(session);
            return await executeInTransaction(async (tx) => {
                const result = tx.run(query, parameters);
                return await config.resultTransformer(result);
            }, config.transactionConfig);
        }
        finally {
            await session.close();
        }
    }
}
