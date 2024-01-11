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
import { newError, Neo4jError, isRetriableError } from './error';
import Integer, { int, isInt, inSafeRange, toNumber, toString } from './integer';
import { Date, DateTime, Duration, isDate, isDateTime, isDuration, isLocalDateTime, isLocalTime, isTime, LocalDateTime, LocalTime, Time } from './temporal-types';
import { StandardDate, NumberOrInteger, Node, isNode, Relationship, isRelationship, UnboundRelationship, isUnboundRelationship, Path, isPath, PathSegment, isPathSegment } from './graph-types';
import Record, { RecordShape } from './record';
import { isPoint, Point } from './spatial-types';
import ResultSummary, { queryType, ServerInfo, Notification, NotificationPosition, Plan, ProfiledPlan, QueryStatistics, Stats, NotificationSeverityLevel, NotificationCategory, notificationCategory, notificationSeverityLevel } from './result-summary';
import NotificationFilter, { notificationFilterDisabledCategory, NotificationFilterDisabledCategory, notificationFilterMinimumSeverityLevel, NotificationFilterMinimumSeverityLevel } from './notification-filter';
import Result, { QueryResult, ResultObserver } from './result';
import EagerResult from './result-eager';
import ConnectionProvider from './connection-provider';
import Connection from './connection';
import Transaction from './transaction';
import ManagedTransaction from './transaction-managed';
import TransactionPromise from './transaction-promise';
import Session, { TransactionConfig } from './session';
import Driver, * as driver from './driver';
import auth from './auth';
import BookmarkManager, { BookmarkManagerConfig, bookmarkManager } from './bookmark-manager';
import AuthTokenManager, { authTokenManagers, AuthTokenManagers, staticAuthTokenManager, AuthTokenAndExpiration } from './auth-token-manager';
import { SessionConfig, QueryConfig, RoutingControl, routing } from './driver';
import { Config } from './types';
import * as types from './types';
import * as json from './json';
import resultTransformers, { ResultTransformer } from './result-transformers';
import * as internal from './internal';
/**
 * Object containing string constants representing predefined {@link Neo4jError} codes.
 */
declare const error: {
    SERVICE_UNAVAILABLE: string;
    SESSION_EXPIRED: string;
    PROTOCOL_ERROR: string;
};
/**
 * @private
 */
declare const forExport: {
    authTokenManagers: AuthTokenManagers;
    newError: typeof newError;
    Neo4jError: typeof Neo4jError;
    isRetriableError: typeof Neo4jError.isRetriable;
    error: {
        SERVICE_UNAVAILABLE: string;
        SESSION_EXPIRED: string;
        PROTOCOL_ERROR: string;
    };
    Integer: typeof Integer;
    int: typeof Integer.fromValue;
    isInt: typeof Integer.isInteger;
    inSafeRange: typeof Integer.inSafeRange;
    toNumber: typeof Integer.toNumber;
    toString: typeof Integer.toString;
    internal: typeof internal;
    isPoint: typeof isPoint;
    Point: typeof Point;
    Date: typeof Date;
    DateTime: typeof DateTime;
    Duration: typeof Duration;
    isDate: typeof isDate;
    isDateTime: typeof isDateTime;
    isDuration: typeof isDuration;
    isLocalDateTime: typeof isLocalDateTime;
    isLocalTime: typeof isLocalTime;
    isTime: typeof isTime;
    LocalDateTime: typeof LocalDateTime;
    LocalTime: typeof LocalTime;
    Time: typeof Time;
    Node: typeof Node;
    isNode: typeof isNode;
    Relationship: typeof Relationship;
    isRelationship: typeof isRelationship;
    UnboundRelationship: typeof UnboundRelationship;
    isUnboundRelationship: typeof isUnboundRelationship;
    Path: typeof Path;
    isPath: typeof isPath;
    PathSegment: typeof PathSegment;
    isPathSegment: typeof isPathSegment;
    Record: typeof Record;
    ResultSummary: typeof ResultSummary;
    queryType: {
        READ_ONLY: string;
        READ_WRITE: string;
        WRITE_ONLY: string;
        SCHEMA_WRITE: string;
    };
    ServerInfo: typeof ServerInfo;
    Notification: typeof Notification;
    Plan: typeof Plan;
    ProfiledPlan: typeof ProfiledPlan;
    QueryStatistics: typeof QueryStatistics;
    Stats: typeof Stats;
    Result: typeof Result;
    EagerResult: typeof EagerResult;
    Transaction: typeof Transaction;
    ManagedTransaction: typeof ManagedTransaction;
    TransactionPromise: typeof TransactionPromise;
    Session: typeof Session;
    Driver: typeof Driver;
    Connection: typeof Connection;
    types: typeof types;
    driver: typeof driver;
    json: typeof json;
    auth: {
        basic: (username: string, password: string, realm?: string | undefined) => {
            scheme: string;
            principal: string;
            credentials: string;
            realm: string;
        } | {
            scheme: string;
            principal: string;
            credentials: string;
            realm?: undefined;
        };
        kerberos: (base64EncodedTicket: string) => {
            scheme: string;
            principal: string;
            credentials: string;
        };
        bearer: (base64EncodedToken: string) => {
            scheme: string;
            credentials: string;
        };
        none: () => {
            scheme: string;
        };
        custom: (principal: string, credentials: string, realm: string, scheme: string, parameters?: object | undefined) => any;
    };
    bookmarkManager: typeof bookmarkManager;
    routing: {
        WRITE: "WRITE";
        READ: "READ";
    };
    resultTransformers: {
        eagerResultTransformer<Entries extends RecordShape = RecordShape>(): ResultTransformer<EagerResult<Entries>>;
        mappedResultTransformer<R = Record<RecordShape<PropertyKey, any>, PropertyKey, RecordShape<PropertyKey, number>>, T = {
            records: R[];
            keys: string[];
            summary: ResultSummary<Integer>;
        }>(config: {
            map?: ((rec: Record<RecordShape<PropertyKey, any>, PropertyKey, RecordShape<PropertyKey, number>>) => R | undefined) | undefined;
            collect?: ((records: R[], summary: ResultSummary<Integer>, keys: string[]) => T) | undefined;
        }): ResultTransformer<T>;
    };
    notificationCategory: {
        UNKNOWN: "UNKNOWN";
        HINT: "HINT";
        UNRECOGNIZED: "UNRECOGNIZED";
        UNSUPPORTED: "UNSUPPORTED";
        PERFORMANCE: "PERFORMANCE";
        TOPOLOGY: "TOPOLOGY";
        SECURITY: "SECURITY";
        DEPRECATION: "DEPRECATION";
        GENERIC: "GENERIC";
    };
    notificationSeverityLevel: {
        WARNING: "WARNING";
        INFORMATION: "INFORMATION";
        UNKNOWN: "UNKNOWN";
    };
    notificationFilterDisabledCategory: {
        HINT: "HINT";
        UNRECOGNIZED: "UNRECOGNIZED";
        UNSUPPORTED: "UNSUPPORTED";
        PERFORMANCE: "PERFORMANCE";
        TOPOLOGY: "TOPOLOGY";
        SECURITY: "SECURITY";
        DEPRECATION: "DEPRECATION";
        GENERIC: "GENERIC";
    };
    notificationFilterMinimumSeverityLevel: {
        WARNING: "WARNING";
        INFORMATION: "INFORMATION";
        OFF: "OFF";
    };
};
export { authTokenManagers, newError, Neo4jError, isRetriableError, error, Integer, int, isInt, inSafeRange, toNumber, toString, internal, isPoint, Point, Date, DateTime, Duration, isDate, isDateTime, isDuration, isLocalDateTime, isLocalTime, isTime, LocalDateTime, LocalTime, Time, Node, isNode, Relationship, isRelationship, UnboundRelationship, isUnboundRelationship, Path, isPath, PathSegment, isPathSegment, Record, ResultSummary, queryType, ServerInfo, Notification, Plan, ProfiledPlan, QueryStatistics, Stats, Result, EagerResult, ConnectionProvider, Connection, Transaction, ManagedTransaction, TransactionPromise, Session, Driver, types, driver, json, auth, bookmarkManager, staticAuthTokenManager, routing, resultTransformers, notificationCategory, notificationSeverityLevel, notificationFilterDisabledCategory, notificationFilterMinimumSeverityLevel };
export type { StandardDate, NumberOrInteger, NotificationPosition, QueryResult, ResultObserver, TransactionConfig, BookmarkManager, BookmarkManagerConfig, AuthTokenManager, AuthTokenManagers, AuthTokenAndExpiration, Config, SessionConfig, QueryConfig, RoutingControl, RecordShape, ResultTransformer, NotificationCategory, NotificationSeverityLevel, NotificationFilter, NotificationFilterDisabledCategory, NotificationFilterMinimumSeverityLevel };
export default forExport;
