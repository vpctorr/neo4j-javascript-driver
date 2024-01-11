/**
 * @typedef {'WARNING' | 'INFORMATION' | 'OFF'} NotificationFilterMinimumSeverityLevel
 */
/**
 * Constants that represents the minimum Severity level in the {@link NotificationFilter}
 */
const notificationFilterMinimumSeverityLevel = {
    OFF: 'OFF',
    WARNING: 'WARNING',
    INFORMATION: 'INFORMATION'
};
Object.freeze(notificationFilterMinimumSeverityLevel);
/**
 * @typedef {'HINT' | 'UNRECOGNIZED' | 'UNSUPPORTED' |'PERFORMANCE' | 'TOPOLOGY' | 'SECURITY' | 'DEPRECATION' | 'GENERIC'} NotificationFilterDisabledCategory
 */
/**
 * Constants that represents the disabled categories in the {@link NotificationFilter}
 */
const notificationFilterDisabledCategory = {
    HINT: 'HINT',
    UNRECOGNIZED: 'UNRECOGNIZED',
    UNSUPPORTED: 'UNSUPPORTED',
    PERFORMANCE: 'PERFORMANCE',
    TOPOLOGY: 'TOPOLOGY',
    SECURITY: 'SECURITY',
    DEPRECATION: 'DEPRECATION',
    GENERIC: 'GENERIC'
};
Object.freeze(notificationFilterDisabledCategory);
/**
 * The notification filter object which can be configured in
 * the session and driver creation.
 *
 * Values not defined are interpreted as default.
 *
 * @interface
 */
class NotificationFilter {
    minimumSeverityLevel;
    disabledCategories;
    /**
     * @constructor
     * @private
     */
    constructor() {
        /**
         * The minimum level of all notifications to receive.
         *
         * @public
         * @type {?NotificationFilterMinimumSeverityLevel}
         */
        this.minimumSeverityLevel = undefined;
        /**
         * Categories the user would like to opt-out of receiving.
         * @type {?NotificationFilterDisabledCategory[]}
         */
        this.disabledCategories = undefined;
        throw new Error('Not implemented');
    }
}
export default NotificationFilter;
export { notificationFilterMinimumSeverityLevel, notificationFilterDisabledCategory };
