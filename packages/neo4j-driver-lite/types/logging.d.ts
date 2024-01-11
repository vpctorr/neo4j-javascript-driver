import { types as coreTypes } from 'neo4j-driver-core';
type LogLevel = coreTypes.LogLevel;
/**
 * Object containing predefined logging configurations. These are expected to be used as values of the driver config's `logging` property.
 * @property {function(level: ?string): object} console the function to create a logging config that prints all messages to `console.log` with
 * timestamp, level and message. It takes an optional `level` parameter which represents the maximum log level to be logged. Default value is 'info'.
 */
export declare const logging: {
    console: (level: LogLevel) => {
        level: coreTypes.LogLevel;
        logger: (level: LogLevel, message: string) => void;
    };
};
export {};
