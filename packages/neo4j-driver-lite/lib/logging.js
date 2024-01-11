"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logging = void 0;
/**
 * Object containing predefined logging configurations. These are expected to be used as values of the driver config's `logging` property.
 * @property {function(level: ?string): object} console the function to create a logging config that prints all messages to `console.log` with
 * timestamp, level and message. It takes an optional `level` parameter which represents the maximum log level to be logged. Default value is 'info'.
 */
exports.logging = {
    console: function (level) {
        return {
            level: level,
            logger: function (level, message) {
                return console.log("".concat(Date.now(), " ").concat(level.toUpperCase(), " ").concat(message));
            }
            // Note: This 'logging' object is in its own file so we can easily access the global Date object here without conflicting
            // with the Neo4j Date class, and without relying on 'globalThis' which isn't compatible with Node 10.
        };
    }
};
