"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = exports.TransactionPromise = exports.ManagedTransaction = exports.Transaction = exports.Session = exports.ServerInfo = exports.Notification = exports.QueryStatistics = exports.ProfiledPlan = exports.Plan = exports.Integer = exports.Path = exports.PathSegment = exports.UnboundRelationship = exports.Relationship = exports.Node = exports.ResultSummary = exports.Record = exports.EagerResult = exports.Result = exports.Driver = exports.temporal = exports.spatial = exports.graph = exports.error = exports.routing = exports.session = exports.types = exports.logging = exports.auth = exports.isRetriableError = exports.Neo4jError = exports.integer = exports.isUnboundRelationship = exports.isRelationship = exports.isPathSegment = exports.isPath = exports.isNode = exports.isDateTime = exports.isLocalDateTime = exports.isDate = exports.isTime = exports.isLocalTime = exports.isDuration = exports.isPoint = exports.isInt = exports.int = exports.hasReachableServer = exports.driver = exports.authTokenManagers = void 0;
exports.notificationFilterMinimumSeverityLevel = exports.notificationFilterDisabledCategory = exports.notificationSeverityLevel = exports.notificationCategory = exports.resultTransformers = exports.bookmarkManager = exports.Connection = exports.ConnectionProvider = exports.DateTime = exports.LocalDateTime = exports.Date = exports.Time = exports.LocalTime = exports.Duration = void 0;
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
var version_1 = __importDefault(require("./version"));
var logging_1 = require("./logging");
Object.defineProperty(exports, "logging", { enumerable: true, get: function () { return logging_1.logging; } });
var neo4j_driver_core_1 = require("neo4j-driver-core");
Object.defineProperty(exports, "auth", { enumerable: true, get: function () { return neo4j_driver_core_1.auth; } });
Object.defineProperty(exports, "authTokenManagers", { enumerable: true, get: function () { return neo4j_driver_core_1.authTokenManagers; } });
Object.defineProperty(exports, "bookmarkManager", { enumerable: true, get: function () { return neo4j_driver_core_1.bookmarkManager; } });
Object.defineProperty(exports, "Connection", { enumerable: true, get: function () { return neo4j_driver_core_1.Connection; } });
Object.defineProperty(exports, "ConnectionProvider", { enumerable: true, get: function () { return neo4j_driver_core_1.ConnectionProvider; } });
Object.defineProperty(exports, "Date", { enumerable: true, get: function () { return neo4j_driver_core_1.Date; } });
Object.defineProperty(exports, "DateTime", { enumerable: true, get: function () { return neo4j_driver_core_1.DateTime; } });
Object.defineProperty(exports, "Driver", { enumerable: true, get: function () { return neo4j_driver_core_1.Driver; } });
Object.defineProperty(exports, "Duration", { enumerable: true, get: function () { return neo4j_driver_core_1.Duration; } });
Object.defineProperty(exports, "EagerResult", { enumerable: true, get: function () { return neo4j_driver_core_1.EagerResult; } });
Object.defineProperty(exports, "error", { enumerable: true, get: function () { return neo4j_driver_core_1.error; } });
Object.defineProperty(exports, "int", { enumerable: true, get: function () { return neo4j_driver_core_1.int; } });
Object.defineProperty(exports, "Integer", { enumerable: true, get: function () { return neo4j_driver_core_1.Integer; } });
Object.defineProperty(exports, "isDate", { enumerable: true, get: function () { return neo4j_driver_core_1.isDate; } });
Object.defineProperty(exports, "isDateTime", { enumerable: true, get: function () { return neo4j_driver_core_1.isDateTime; } });
Object.defineProperty(exports, "isDuration", { enumerable: true, get: function () { return neo4j_driver_core_1.isDuration; } });
Object.defineProperty(exports, "isInt", { enumerable: true, get: function () { return neo4j_driver_core_1.isInt; } });
Object.defineProperty(exports, "isLocalDateTime", { enumerable: true, get: function () { return neo4j_driver_core_1.isLocalDateTime; } });
Object.defineProperty(exports, "isLocalTime", { enumerable: true, get: function () { return neo4j_driver_core_1.isLocalTime; } });
Object.defineProperty(exports, "isNode", { enumerable: true, get: function () { return neo4j_driver_core_1.isNode; } });
Object.defineProperty(exports, "isPath", { enumerable: true, get: function () { return neo4j_driver_core_1.isPath; } });
Object.defineProperty(exports, "isPathSegment", { enumerable: true, get: function () { return neo4j_driver_core_1.isPathSegment; } });
Object.defineProperty(exports, "isPoint", { enumerable: true, get: function () { return neo4j_driver_core_1.isPoint; } });
Object.defineProperty(exports, "isRelationship", { enumerable: true, get: function () { return neo4j_driver_core_1.isRelationship; } });
Object.defineProperty(exports, "isRetriableError", { enumerable: true, get: function () { return neo4j_driver_core_1.isRetriableError; } });
Object.defineProperty(exports, "isTime", { enumerable: true, get: function () { return neo4j_driver_core_1.isTime; } });
Object.defineProperty(exports, "isUnboundRelationship", { enumerable: true, get: function () { return neo4j_driver_core_1.isUnboundRelationship; } });
Object.defineProperty(exports, "LocalDateTime", { enumerable: true, get: function () { return neo4j_driver_core_1.LocalDateTime; } });
Object.defineProperty(exports, "LocalTime", { enumerable: true, get: function () { return neo4j_driver_core_1.LocalTime; } });
Object.defineProperty(exports, "ManagedTransaction", { enumerable: true, get: function () { return neo4j_driver_core_1.ManagedTransaction; } });
Object.defineProperty(exports, "Neo4jError", { enumerable: true, get: function () { return neo4j_driver_core_1.Neo4jError; } });
Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return neo4j_driver_core_1.Node; } });
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return neo4j_driver_core_1.Notification; } });
Object.defineProperty(exports, "notificationCategory", { enumerable: true, get: function () { return neo4j_driver_core_1.notificationCategory; } });
Object.defineProperty(exports, "notificationFilterDisabledCategory", { enumerable: true, get: function () { return neo4j_driver_core_1.notificationFilterDisabledCategory; } });
Object.defineProperty(exports, "notificationFilterMinimumSeverityLevel", { enumerable: true, get: function () { return neo4j_driver_core_1.notificationFilterMinimumSeverityLevel; } });
Object.defineProperty(exports, "notificationSeverityLevel", { enumerable: true, get: function () { return neo4j_driver_core_1.notificationSeverityLevel; } });
Object.defineProperty(exports, "Path", { enumerable: true, get: function () { return neo4j_driver_core_1.Path; } });
Object.defineProperty(exports, "PathSegment", { enumerable: true, get: function () { return neo4j_driver_core_1.PathSegment; } });
Object.defineProperty(exports, "Plan", { enumerable: true, get: function () { return neo4j_driver_core_1.Plan; } });
Object.defineProperty(exports, "Point", { enumerable: true, get: function () { return neo4j_driver_core_1.Point; } });
Object.defineProperty(exports, "ProfiledPlan", { enumerable: true, get: function () { return neo4j_driver_core_1.ProfiledPlan; } });
Object.defineProperty(exports, "QueryStatistics", { enumerable: true, get: function () { return neo4j_driver_core_1.QueryStatistics; } });
Object.defineProperty(exports, "Record", { enumerable: true, get: function () { return neo4j_driver_core_1.Record; } });
Object.defineProperty(exports, "Relationship", { enumerable: true, get: function () { return neo4j_driver_core_1.Relationship; } });
Object.defineProperty(exports, "Result", { enumerable: true, get: function () { return neo4j_driver_core_1.Result; } });
Object.defineProperty(exports, "ResultSummary", { enumerable: true, get: function () { return neo4j_driver_core_1.ResultSummary; } });
Object.defineProperty(exports, "resultTransformers", { enumerable: true, get: function () { return neo4j_driver_core_1.resultTransformers; } });
Object.defineProperty(exports, "routing", { enumerable: true, get: function () { return neo4j_driver_core_1.routing; } });
Object.defineProperty(exports, "ServerInfo", { enumerable: true, get: function () { return neo4j_driver_core_1.ServerInfo; } });
Object.defineProperty(exports, "Session", { enumerable: true, get: function () { return neo4j_driver_core_1.Session; } });
Object.defineProperty(exports, "Time", { enumerable: true, get: function () { return neo4j_driver_core_1.Time; } });
Object.defineProperty(exports, "Transaction", { enumerable: true, get: function () { return neo4j_driver_core_1.Transaction; } });
Object.defineProperty(exports, "TransactionPromise", { enumerable: true, get: function () { return neo4j_driver_core_1.TransactionPromise; } });
Object.defineProperty(exports, "UnboundRelationship", { enumerable: true, get: function () { return neo4j_driver_core_1.UnboundRelationship; } });
var neo4j_driver_bolt_connection_1 = require("neo4j-driver-bolt-connection");
var READ = neo4j_driver_core_1.driver.READ, WRITE = neo4j_driver_core_1.driver.WRITE;
var _a = neo4j_driver_core_1.internal.util, ENCRYPTION_ON = _a.ENCRYPTION_ON, assertString = _a.assertString, isEmptyObjectOrNull = _a.isEmptyObjectOrNull, ServerAddress = neo4j_driver_core_1.internal.serverAddress.ServerAddress, urlUtil = neo4j_driver_core_1.internal.urlUtil;
var USER_AGENT = 'neo4j-javascript/' + version_1.default;
function isAuthTokenManager(value) {
    if (typeof value === 'object' &&
        value != null &&
        'getToken' in value &&
        'handleSecurityException' in value) {
        var manager = value;
        return typeof manager.getToken === 'function' &&
            typeof manager.handleSecurityException === 'function';
    }
    return false;
}
function createAuthManager(authTokenOrProvider) {
    var _a;
    if (isAuthTokenManager(authTokenOrProvider)) {
        return authTokenOrProvider;
    }
    var authToken = authTokenOrProvider;
    // Sanitize authority token. Nicer error from server when a scheme is set.
    authToken = authToken !== null && authToken !== void 0 ? authToken : {};
    authToken.scheme = (_a = authToken.scheme) !== null && _a !== void 0 ? _a : 'none';
    return (0, neo4j_driver_core_1.staticAuthTokenManager)({ authToken: authToken });
}
/**
 * Construct a new Neo4j Driver. This is your main entry point for this
 * library.
 *
 * @param {string} url The URL for the Neo4j database, for instance "neo4j://localhost" and/or "bolt://localhost"
 * @param {Map<string,string>| function()} authToken Authentication credentials. See {@link auth} for helpers.
 * @param {Config} config Configuration object. See the configuration section above for details.
 * @returns {Driver}
 */
function driver(url, authToken, config) {
    var _a, _b;
    if (config === void 0) { config = {}; }
    assertString(url, 'Bolt URL');
    var parsedUrl = urlUtil.parseDatabaseUrl(url);
    // enabling set boltAgent
    var _config = config;
    // Determine entryption/trust options from the URL.
    var routing = false;
    var encrypted = false;
    var trust;
    switch (parsedUrl.scheme) {
        case 'bolt':
            break;
        case 'bolt+s':
            encrypted = true;
            trust = 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES';
            break;
        case 'bolt+ssc':
            encrypted = true;
            trust = 'TRUST_ALL_CERTIFICATES';
            break;
        case 'neo4j':
            routing = true;
            break;
        case 'neo4j+s':
            encrypted = true;
            trust = 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES';
            routing = true;
            break;
        case 'neo4j+ssc':
            encrypted = true;
            trust = 'TRUST_ALL_CERTIFICATES';
            routing = true;
            break;
        default:
            throw new Error("Unknown scheme: ".concat((_a = parsedUrl.scheme) !== null && _a !== void 0 ? _a : 'null'));
    }
    // Encryption enabled on URL, propagate trust to the config.
    if (encrypted) {
        // Check for configuration conflict between URL and config.
        if ('encrypted' in _config || 'trust' in _config) {
            throw new Error('Encryption/trust can only be configured either through URL or config, not both');
        }
        _config.encrypted = ENCRYPTION_ON;
        _config.trust = trust;
    }
    var authTokenManager = createAuthManager(authToken);
    // Use default user agent or user agent specified by user.
    _config.userAgent = (_b = _config.userAgent) !== null && _b !== void 0 ? _b : USER_AGENT;
    _config.boltAgent = neo4j_driver_core_1.internal.boltAgent.fromVersion('neo4j-javascript/' + version_1.default);
    var address = ServerAddress.fromUrl(parsedUrl.hostAndPort);
    var meta = {
        address: address,
        typename: routing ? 'Routing' : 'Direct',
        routing: routing
    };
    return new neo4j_driver_core_1.Driver(meta, _config, createConnectionProviderFunction());
    function createConnectionProviderFunction() {
        if (routing) {
            return function (id, config, log, hostNameResolver) {
                return new neo4j_driver_bolt_connection_1.RoutingConnectionProvider({
                    id: id,
                    config: config,
                    log: log,
                    hostNameResolver: hostNameResolver,
                    authTokenManager: authTokenManager,
                    address: address,
                    userAgent: config.userAgent,
                    boltAgent: config.boltAgent,
                    routingContext: parsedUrl.query
                });
            };
        }
        else {
            if (!isEmptyObjectOrNull(parsedUrl.query)) {
                throw new Error("Parameters are not supported with none routed scheme. Given URL: '".concat(url, "'"));
            }
            return function (id, config, log) {
                return new neo4j_driver_bolt_connection_1.DirectConnectionProvider({
                    id: id,
                    config: config,
                    log: log,
                    authTokenManager: authTokenManager,
                    address: address,
                    userAgent: config.userAgent,
                    boltAgent: config.boltAgent
                });
            };
        }
    }
}
exports.driver = driver;
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
function hasReachableServer(url, config) {
    return __awaiter(this, void 0, void 0, function () {
        var nonLoggedDriver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nonLoggedDriver = driver(url, { scheme: 'none', principal: '', credentials: '' }, config);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 5]);
                    return [4 /*yield*/, nonLoggedDriver.getNegotiatedProtocolVersion()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3: return [4 /*yield*/, nonLoggedDriver.close()];
                case 4:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.hasReachableServer = hasReachableServer;
/**
 * Object containing constructors for all neo4j types.
 */
var types = {
    Node: neo4j_driver_core_1.Node,
    Relationship: neo4j_driver_core_1.Relationship,
    UnboundRelationship: neo4j_driver_core_1.UnboundRelationship,
    PathSegment: neo4j_driver_core_1.PathSegment,
    Path: neo4j_driver_core_1.Path,
    Result: neo4j_driver_core_1.Result,
    EagerResult: neo4j_driver_core_1.EagerResult,
    ResultSummary: neo4j_driver_core_1.ResultSummary,
    Record: neo4j_driver_core_1.Record,
    Point: neo4j_driver_core_1.Point,
    Date: neo4j_driver_core_1.Date,
    DateTime: neo4j_driver_core_1.DateTime,
    Duration: neo4j_driver_core_1.Duration,
    LocalDateTime: neo4j_driver_core_1.LocalDateTime,
    LocalTime: neo4j_driver_core_1.LocalTime,
    Time: neo4j_driver_core_1.Time,
    Integer: neo4j_driver_core_1.Integer
};
exports.types = types;
/**
 * Object containing string constants representing session access modes.
 */
var session = {
    READ: READ,
    WRITE: WRITE
};
exports.session = session;
/**
 * Object containing functions to work with {@link Integer} objects.
 */
var integer = {
    toNumber: neo4j_driver_core_1.toNumber,
    toString: neo4j_driver_core_1.toString,
    inSafeRange: neo4j_driver_core_1.inSafeRange
};
exports.integer = integer;
/**
 * Object containing functions to work with spatial types, like {@link Point}.
 */
var spatial = {
    isPoint: neo4j_driver_core_1.isPoint
};
exports.spatial = spatial;
/**
 * Object containing functions to work with temporal types, like {@link Time} or {@link Duration}.
 */
var temporal = {
    isDuration: neo4j_driver_core_1.isDuration,
    isLocalTime: neo4j_driver_core_1.isLocalTime,
    isTime: neo4j_driver_core_1.isTime,
    isDate: neo4j_driver_core_1.isDate,
    isLocalDateTime: neo4j_driver_core_1.isLocalDateTime,
    isDateTime: neo4j_driver_core_1.isDateTime
};
exports.temporal = temporal;
/**
 * Object containing functions to work with graph types, like {@link Node} or {@link Relationship}.
 */
var graph = {
    isNode: neo4j_driver_core_1.isNode,
    isPath: neo4j_driver_core_1.isPath,
    isPathSegment: neo4j_driver_core_1.isPathSegment,
    isRelationship: neo4j_driver_core_1.isRelationship,
    isUnboundRelationship: neo4j_driver_core_1.isUnboundRelationship
};
exports.graph = graph;
/**
 * @private
 */
var forExport = {
    authTokenManagers: neo4j_driver_core_1.authTokenManagers,
    driver: driver,
    hasReachableServer: hasReachableServer,
    int: neo4j_driver_core_1.int,
    isInt: neo4j_driver_core_1.isInt,
    isPoint: neo4j_driver_core_1.isPoint,
    isDuration: neo4j_driver_core_1.isDuration,
    isLocalTime: neo4j_driver_core_1.isLocalTime,
    isTime: neo4j_driver_core_1.isTime,
    isDate: neo4j_driver_core_1.isDate,
    isLocalDateTime: neo4j_driver_core_1.isLocalDateTime,
    isDateTime: neo4j_driver_core_1.isDateTime,
    isNode: neo4j_driver_core_1.isNode,
    isPath: neo4j_driver_core_1.isPath,
    isPathSegment: neo4j_driver_core_1.isPathSegment,
    isRelationship: neo4j_driver_core_1.isRelationship,
    isUnboundRelationship: neo4j_driver_core_1.isUnboundRelationship,
    integer: integer,
    Neo4jError: neo4j_driver_core_1.Neo4jError,
    isRetriableError: neo4j_driver_core_1.isRetriableError,
    auth: neo4j_driver_core_1.auth,
    logging: logging_1.logging,
    types: types,
    session: session,
    routing: neo4j_driver_core_1.routing,
    error: neo4j_driver_core_1.error,
    graph: graph,
    spatial: spatial,
    temporal: temporal,
    Driver: neo4j_driver_core_1.Driver,
    Result: neo4j_driver_core_1.Result,
    EagerResult: neo4j_driver_core_1.EagerResult,
    Record: neo4j_driver_core_1.Record,
    ResultSummary: neo4j_driver_core_1.ResultSummary,
    Node: neo4j_driver_core_1.Node,
    Relationship: neo4j_driver_core_1.Relationship,
    UnboundRelationship: neo4j_driver_core_1.UnboundRelationship,
    PathSegment: neo4j_driver_core_1.PathSegment,
    Path: neo4j_driver_core_1.Path,
    Integer: neo4j_driver_core_1.Integer,
    Plan: neo4j_driver_core_1.Plan,
    ProfiledPlan: neo4j_driver_core_1.ProfiledPlan,
    QueryStatistics: neo4j_driver_core_1.QueryStatistics,
    Notification: neo4j_driver_core_1.Notification,
    ServerInfo: neo4j_driver_core_1.ServerInfo,
    Session: neo4j_driver_core_1.Session,
    Transaction: neo4j_driver_core_1.Transaction,
    ManagedTransaction: neo4j_driver_core_1.ManagedTransaction,
    TransactionPromise: neo4j_driver_core_1.TransactionPromise,
    Point: neo4j_driver_core_1.Point,
    Duration: neo4j_driver_core_1.Duration,
    LocalTime: neo4j_driver_core_1.LocalTime,
    Time: neo4j_driver_core_1.Time,
    Date: neo4j_driver_core_1.Date,
    LocalDateTime: neo4j_driver_core_1.LocalDateTime,
    DateTime: neo4j_driver_core_1.DateTime,
    ConnectionProvider: neo4j_driver_core_1.ConnectionProvider,
    Connection: neo4j_driver_core_1.Connection,
    bookmarkManager: neo4j_driver_core_1.bookmarkManager,
    resultTransformers: neo4j_driver_core_1.resultTransformers,
    notificationCategory: neo4j_driver_core_1.notificationCategory,
    notificationSeverityLevel: neo4j_driver_core_1.notificationSeverityLevel,
    notificationFilterDisabledCategory: neo4j_driver_core_1.notificationFilterDisabledCategory,
    notificationFilterMinimumSeverityLevel: neo4j_driver_core_1.notificationFilterMinimumSeverityLevel
};
exports.default = forExport;