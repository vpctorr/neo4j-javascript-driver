import { logging } from './logging';
import { auth, AuthTokenManagers, authTokenManagers, BookmarkManager, bookmarkManager, BookmarkManagerConfig, Connection, ConnectionProvider, Date, DateTime, Driver, Duration, EagerResult, error, int, Integer, isDate, isDateTime, isDuration, isInt, isLocalDateTime, isLocalTime, isNode, isPath, isPathSegment, isPoint, isRelationship, isRetriableError, isTime, isUnboundRelationship, LocalDateTime, LocalTime, ManagedTransaction, Neo4jError, Node, Notification, notificationCategory, NotificationCategory, NotificationFilter, NotificationFilterDisabledCategory, notificationFilterDisabledCategory, AuthTokenManager, AuthTokenAndExpiration, NotificationFilterMinimumSeverityLevel, notificationFilterMinimumSeverityLevel, NotificationPosition, notificationSeverityLevel, NotificationSeverityLevel, Path, PathSegment, Plan, Point, ProfiledPlan, QueryConfig, QueryResult, QueryStatistics, Record, RecordShape, Relationship, Result, ResultObserver, ResultSummary, ResultTransformer, resultTransformers, routing, RoutingControl, ServerInfo, Session, SessionConfig, Time, Transaction, TransactionPromise, types as coreTypes, UnboundRelationship } from 'neo4j-driver-core';
type AuthToken = coreTypes.AuthToken;
type Config = coreTypes.Config;
type TrustStrategy = coreTypes.TrustStrategy;
type EncryptionLevel = coreTypes.EncryptionLevel;
type SessionMode = coreTypes.SessionMode;
/**
 * Construct a new Neo4j Driver. This is your main entry point for this
 * library.
 *
 * @param {string} url The URL for the Neo4j database, for instance "neo4j://localhost" and/or "bolt://localhost"
 * @param {Map<string,string>| function()} authToken Authentication credentials. See {@link auth} for helpers.
 * @param {Config} config Configuration object. See the configuration section above for details.
 * @returns {Driver}
 */
declare function driver(url: string, authToken: AuthToken | AuthTokenManager, config?: Config): Driver;
/**
 * Verifies if the driver can reach a server at the given url.
 *
 * @experimental
 * @since 5.0.0
 * @param {string} url The URL for the Neo4j database, for instance "neo4j://localhost" and/or "bolt://localhost"
 * @param {Pick<Config, 'logging'>} config Configuration object. See the {@link driver}
 * @returns {true} When the server is reachable
 * @throws {Error} When the server is not reachable or the url is invalid
 */
declare function hasReachableServer(url: string, config?: Pick<Config, 'logging'>): Promise<true>;
/**
 * Object containing constructors for all neo4j types.
 */
declare const types: {
    Node: typeof Node;
    Relationship: typeof Relationship;
    UnboundRelationship: typeof UnboundRelationship;
    PathSegment: typeof PathSegment;
    Path: typeof Path;
    Result: typeof Result;
    EagerResult: typeof EagerResult;
    ResultSummary: typeof ResultSummary;
    Record: typeof Record;
    Point: typeof Point;
    Date: typeof Date;
    DateTime: typeof DateTime;
    Duration: typeof Duration;
    LocalDateTime: typeof LocalDateTime;
    LocalTime: typeof LocalTime;
    Time: typeof Time;
    Integer: typeof Integer;
};
/**
 * Object containing string constants representing session access modes.
 */
declare const session: {
    READ: coreTypes.SessionMode;
    WRITE: coreTypes.SessionMode;
};
/**
 * Object containing functions to work with {@link Integer} objects.
 */
declare const integer: {
    toNumber: typeof Integer.toNumber;
    toString: typeof Integer.toString;
    inSafeRange: typeof Integer.inSafeRange;
};
/**
 * Object containing functions to work with spatial types, like {@link Point}.
 */
declare const spatial: {
    isPoint: typeof isPoint;
};
/**
 * Object containing functions to work with temporal types, like {@link Time} or {@link Duration}.
 */
declare const temporal: {
    isDuration: typeof isDuration;
    isLocalTime: typeof isLocalTime;
    isTime: typeof isTime;
    isDate: typeof isDate;
    isLocalDateTime: typeof isLocalDateTime;
    isDateTime: typeof isDateTime;
};
/**
 * Object containing functions to work with graph types, like {@link Node} or {@link Relationship}.
 */
declare const graph: {
    isNode: typeof isNode;
    isPath: typeof isPath;
    isPathSegment: typeof isPathSegment;
    isRelationship: typeof isRelationship;
    isUnboundRelationship: typeof isUnboundRelationship;
};
/**
 * @private
 */
declare const forExport: {
    authTokenManagers: AuthTokenManagers;
    driver: typeof driver;
    hasReachableServer: typeof hasReachableServer;
    int: typeof Integer.fromValue;
    isInt: typeof Integer.isInteger;
    isPoint: typeof isPoint;
    isDuration: typeof isDuration;
    isLocalTime: typeof isLocalTime;
    isTime: typeof isTime;
    isDate: typeof isDate;
    isLocalDateTime: typeof isLocalDateTime;
    isDateTime: typeof isDateTime;
    isNode: typeof isNode;
    isPath: typeof isPath;
    isPathSegment: typeof isPathSegment;
    isRelationship: typeof isRelationship;
    isUnboundRelationship: typeof isUnboundRelationship;
    integer: {
        toNumber: typeof Integer.toNumber;
        toString: typeof Integer.toString;
        inSafeRange: typeof Integer.inSafeRange;
    };
    Neo4jError: typeof Neo4jError;
    isRetriableError: typeof Neo4jError.isRetriable;
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
    logging: {
        console: (level: coreTypes.LogLevel) => {
            level: coreTypes.LogLevel;
            logger: (level: coreTypes.LogLevel, message: string) => void;
        };
    };
    types: {
        Node: typeof Node;
        Relationship: typeof Relationship;
        UnboundRelationship: typeof UnboundRelationship;
        PathSegment: typeof PathSegment;
        Path: typeof Path;
        Result: typeof Result;
        EagerResult: typeof EagerResult;
        ResultSummary: typeof ResultSummary;
        Record: typeof Record;
        Point: typeof Point;
        Date: typeof Date;
        DateTime: typeof DateTime;
        Duration: typeof Duration;
        LocalDateTime: typeof LocalDateTime;
        LocalTime: typeof LocalTime;
        Time: typeof Time;
        Integer: typeof Integer;
    };
    session: {
        READ: coreTypes.SessionMode;
        WRITE: coreTypes.SessionMode;
    };
    routing: {
        WRITE: "WRITE";
        READ: "READ";
    };
    error: {
        SERVICE_UNAVAILABLE: string;
        SESSION_EXPIRED: string;
        PROTOCOL_ERROR: string;
    };
    graph: {
        isNode: typeof isNode;
        isPath: typeof isPath;
        isPathSegment: typeof isPathSegment;
        isRelationship: typeof isRelationship;
        isUnboundRelationship: typeof isUnboundRelationship;
    };
    spatial: {
        isPoint: typeof isPoint;
    };
    temporal: {
        isDuration: typeof isDuration;
        isLocalTime: typeof isLocalTime;
        isTime: typeof isTime;
        isDate: typeof isDate;
        isLocalDateTime: typeof isLocalDateTime;
        isDateTime: typeof isDateTime;
    };
    Driver: typeof Driver;
    Result: typeof Result;
    EagerResult: typeof EagerResult;
    Record: typeof Record;
    ResultSummary: typeof ResultSummary;
    Node: typeof Node;
    Relationship: typeof Relationship;
    UnboundRelationship: typeof UnboundRelationship;
    PathSegment: typeof PathSegment;
    Path: typeof Path;
    Integer: typeof Integer;
    Plan: typeof Plan;
    ProfiledPlan: typeof ProfiledPlan;
    QueryStatistics: typeof QueryStatistics;
    Notification: typeof Notification;
    ServerInfo: typeof ServerInfo;
    Session: typeof Session;
    Transaction: typeof Transaction;
    ManagedTransaction: typeof ManagedTransaction;
    TransactionPromise: typeof TransactionPromise;
    Point: typeof Point;
    Duration: typeof Duration;
    LocalTime: typeof LocalTime;
    Time: typeof Time;
    Date: typeof Date;
    LocalDateTime: typeof LocalDateTime;
    DateTime: typeof DateTime;
    ConnectionProvider: typeof ConnectionProvider;
    Connection: typeof Connection;
    bookmarkManager: typeof bookmarkManager;
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
export { authTokenManagers, driver, hasReachableServer, int, isInt, isPoint, isDuration, isLocalTime, isTime, isDate, isLocalDateTime, isDateTime, isNode, isPath, isPathSegment, isRelationship, isUnboundRelationship, integer, Neo4jError, isRetriableError, auth, logging, types, session, routing, error, graph, spatial, temporal, Driver, Result, EagerResult, Record, ResultSummary, Node, Relationship, UnboundRelationship, PathSegment, Path, Integer, Plan, ProfiledPlan, QueryStatistics, Notification, ServerInfo, Session, Transaction, ManagedTransaction, TransactionPromise, Point, Duration, LocalTime, Time, Date, LocalDateTime, DateTime, ConnectionProvider, Connection, bookmarkManager, resultTransformers, notificationCategory, notificationSeverityLevel, notificationFilterDisabledCategory, notificationFilterMinimumSeverityLevel };
export type { QueryResult, AuthToken, AuthTokenManager, AuthTokenManagers, AuthTokenAndExpiration, Config, EncryptionLevel, TrustStrategy, SessionMode, ResultObserver, NotificationPosition, BookmarkManager, BookmarkManagerConfig, SessionConfig, QueryConfig, RoutingControl, RecordShape, ResultTransformer, NotificationCategory, NotificationSeverityLevel, NotificationFilter, NotificationFilterDisabledCategory, NotificationFilterMinimumSeverityLevel };
export default forExport;
