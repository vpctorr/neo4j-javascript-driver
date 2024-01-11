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
import Record, { RecordShape } from './record';
import Result from './result';
import EagerResult from './result-eager';
import ResultSummary from './result-summary';
type ResultTransformer<T> = (result: Result) => Promise<T>;
/**
 * Protocol for transforming {@link Result}.
 *
 * @typedef {function<T>(result:Result):Promise<T>} ResultTransformer
 * @interface
 *
 * @see {@link resultTransformers} for provided implementations.
 * @see {@link Driver#executeQuery} for usage.
 */
/**
 * Defines the object which holds the common {@link ResultTransformer} used with {@link Driver#executeQuery}.
 */
declare class ResultTransformers {
    /**
     * Creates a {@link ResultTransformer} which transforms {@link Result} to {@link EagerResult}
     * by consuming the whole stream.
     *
     * This is the default implementation used in {@link Driver#executeQuery}
     *
     * @example
     * // This:
     * const { keys, records, summary } = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'}, {
     *   resultTransformer: neo4j.resultTransformers.eagerResultTransformer()
     * })
     * // is equivalent to:
     * const { keys, records, summary } = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'})
     *
     * @returns {ResultTransformer<EagerResult<Entries>>} The result transformer
     */
    eagerResultTransformer<Entries extends RecordShape = RecordShape>(): ResultTransformer<EagerResult<Entries>>;
    /**
     * Creates a {@link ResultTransformer} which maps the {@link Record} in the result and collects it
     * along with the {@link ResultSummary} and {@link Result#keys}.
     *
     * NOTE: The config object requires map or/and collect to be valid.
     *
     * @example
     * // Mapping the records
     * const { keys, records, summary } = await driver.executeQuery('MATCH (p:Person{ age: $age }) RETURN p.name as name', { age: 25 }, {
     *   resultTransformer: neo4j.resultTransformers.mappedResultTransformer({
     *     map(record) {
     *        return record.get('name')
     *     }
     *   })
     * })
     *
     * records.forEach(name => console.log(`${name} has 25`))
     *
     * @example
     * // Mapping records and collect result
     * const names = await driver.executeQuery('MATCH (p:Person{ age: $age }) RETURN p.name as name', { age: 25 }, {
     *   resultTransformer: neo4j.resultTransformers.mappedResultTransformer({
     *     map(record) {
     *        return record.get('name')
     *     },
     *     collect(records, summary, keys) {
     *        return records
     *     }
     *   })
     * })
     *
     * names.forEach(name => console.log(`${name} has 25`))
     *
     * @example
     * // The transformer can be defined one and used everywhere
     * const getRecordsAsObjects = neo4j.resultTransformers.mappedResultTransformer({
     *   map(record) {
     *      return record.toObject()
     *   },
     *   collect(objects) {
     *      return objects
     *   }
     * })
     *
     * // The usage in a driver.executeQuery
     * const objects = await driver.executeQuery('MATCH (p:Person{ age: $age }) RETURN p.name as name', { age: 25 }, {
     *   resultTransformer: getRecordsAsObjects
     * })
     * objects.forEach(object => console.log(`${object.name} has 25`))
     *
     *
     * // The usage in session.executeRead
     * const objects = await session.executeRead(tx => getRecordsAsObjects(tx.run('MATCH (p:Person{ age: $age }) RETURN p.name as name')))
     * objects.forEach(object => console.log(`${object.name} has 25`))
     *
     * @param {object} config The result transformer configuration
     * @param {function(record:Record):R} [config.map=function(record) {  return record }] Method called for mapping each record
     * @param {function(records:R[], summary:ResultSummary, keys:string[]):T} [config.collect=function(records, summary, keys) { return { records, summary, keys }}] Method called for mapping
     * the result data to the transformer output.
     * @returns {ResultTransformer<T>} The result transformer
     * @see {@link Driver#executeQuery}
     */
    mappedResultTransformer<R = Record, T = {
        records: R[];
        keys: string[];
        summary: ResultSummary;
    }>(config: {
        map?: (rec: Record) => R | undefined;
        collect?: (records: R[], summary: ResultSummary, keys: string[]) => T;
    }): ResultTransformer<T>;
}
/**
 * Holds the common {@link ResultTransformer} used with {@link Driver#executeQuery}.
 */
declare const resultTransformers: ResultTransformers;
export default resultTransformers;
export type { ResultTransformer };