import { stringify } from './json';
const IDENTIFIER_PROPERTY_ATTRIBUTES = {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false
};
const NODE_IDENTIFIER_PROPERTY = '__isNode__';
const RELATIONSHIP_IDENTIFIER_PROPERTY = '__isRelationship__';
const UNBOUND_RELATIONSHIP_IDENTIFIER_PROPERTY = '__isUnboundRelationship__';
const PATH_IDENTIFIER_PROPERTY = '__isPath__';
const PATH_SEGMENT_IDENTIFIER_PROPERTY = '__isPathSegment__';
function hasIdentifierProperty(obj, property) {
    return obj != null && obj[property] === true;
}
/**
 * Class for Node Type.
 */
class Node {
    identity;
    labels;
    properties;
    elementId;
    /**
     * @constructor
     * @protected
     * @param {NumberOrInteger} identity - Unique identity
     * @param {Array<string>} labels - Array for all labels
     * @param {Properties} properties - Map with node properties
     * @param {string} elementId - Node element identifier
     */
    constructor(identity, labels, properties, elementId) {
        /**
         * Identity of the node.
         * @type {NumberOrInteger}
         * @deprecated use {@link Node#elementId} instead
         */
        this.identity = identity;
        /**
         * Labels of the node.
         * @type {string[]}
         */
        this.labels = labels;
        /**
         * Properties of the node.
         * @type {Properties}
         */
        this.properties = properties;
        /**
         * The Node element identifier.
         * @type {string}
         */
        this.elementId = _valueOrGetDefault(elementId, () => identity.toString());
    }
    /**
     * @ignore
     */
    toString() {
        let s = '(' + this.elementId;
        for (let i = 0; i < this.labels.length; i++) {
            s += ':' + this.labels[i];
        }
        const keys = Object.keys(this.properties);
        if (keys.length > 0) {
            s += ' {';
            for (let i = 0; i < keys.length; i++) {
                if (i > 0)
                    s += ',';
                s += keys[i] + ':' + stringify(this.properties[keys[i]]);
            }
            s += '}';
        }
        s += ')';
        return s;
    }
}
Object.defineProperty(Node.prototype, NODE_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link Node} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link Node}, `false` otherwise.
 */
function isNode(obj) {
    return hasIdentifierProperty(obj, NODE_IDENTIFIER_PROPERTY);
}
/**
 * Class for Relationship Type.
 */
class Relationship {
    identity;
    start;
    end;
    type;
    properties;
    elementId;
    startNodeElementId;
    endNodeElementId;
    /**
     * @constructor
     * @protected
     * @param {NumberOrInteger} identity - Unique identity
     * @param {NumberOrInteger} start - Identity of start Node
     * @param {NumberOrInteger} end - Identity of end Node
     * @param {string} type - Relationship type
     * @param {Properties} properties - Map with relationship properties
     * @param {string} elementId - Relationship element identifier
     * @param {string} startNodeElementId - Start Node element identifier
     * @param {string} endNodeElementId - End Node element identifier
     */
    constructor(identity, start, end, type, properties, elementId, startNodeElementId, endNodeElementId) {
        /**
         * Identity of the relationship.
         * @type {NumberOrInteger}
         * @deprecated use {@link Relationship#elementId} instead
         */
        this.identity = identity;
        /**
         * Identity of the start node.
         * @type {NumberOrInteger}
         * @deprecated use {@link Relationship#startNodeElementId} instead
         */
        this.start = start;
        /**
         * Identity of the end node.
         * @type {NumberOrInteger}
         * @deprecated use {@link Relationship#endNodeElementId} instead
         */
        this.end = end;
        /**
         * Type of the relationship.
         * @type {string}
         */
        this.type = type;
        /**
         * Properties of the relationship.
         * @type {Properties}
         */
        this.properties = properties;
        /**
         * The Relationship element identifier.
         * @type {string}
         */
        this.elementId = _valueOrGetDefault(elementId, () => identity.toString());
        /**
         * The Start Node element identifier.
         * @type {string}
         */
        this.startNodeElementId = _valueOrGetDefault(startNodeElementId, () => start.toString());
        /**
         * The End Node element identifier.
         * @type {string}
         */
        this.endNodeElementId = _valueOrGetDefault(endNodeElementId, () => end.toString());
    }
    /**
     * @ignore
     */
    toString() {
        let s = '(' + this.startNodeElementId + ')-[:' + this.type;
        const keys = Object.keys(this.properties);
        if (keys.length > 0) {
            s += ' {';
            for (let i = 0; i < keys.length; i++) {
                if (i > 0)
                    s += ',';
                s += keys[i] + ':' + stringify(this.properties[keys[i]]);
            }
            s += '}';
        }
        s += ']->(' + this.endNodeElementId + ')';
        return s;
    }
}
Object.defineProperty(Relationship.prototype, RELATIONSHIP_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link Relationship} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link Relationship}, `false` otherwise.
 */
function isRelationship(obj) {
    return hasIdentifierProperty(obj, RELATIONSHIP_IDENTIFIER_PROPERTY);
}
/**
 * Class for UnboundRelationship Type.
 * @access private
 */
class UnboundRelationship {
    identity;
    type;
    properties;
    elementId;
    /**
     * @constructor
     * @protected
     * @param {NumberOrInteger} identity - Unique identity
     * @param {string} type - Relationship type
     * @param {Properties} properties - Map with relationship properties
     * @param {string} elementId - Relationship element identifier
     */
    constructor(identity, type, properties, elementId) {
        /**
         * Identity of the relationship.
         * @type {NumberOrInteger}
         * @deprecated use {@link UnboundRelationship#elementId} instead
         */
        this.identity = identity;
        /**
         * Type of the relationship.
         * @type {string}
         */
        this.type = type;
        /**
         * Properties of the relationship.
         * @type {Properties}
         */
        this.properties = properties;
        /**
         * The Relationship element identifier.
         * @type {string}
         */
        this.elementId = _valueOrGetDefault(elementId, () => identity.toString());
    }
    /**
     * Bind relationship
     *
     * @protected
     * @deprecated use {@link UnboundRelationship#bindTo} instead
     * @param {Integer} start - Identity of start node
     * @param {Integer} end - Identity of end node
     * @return {Relationship} - Created relationship
     */
    bind(start, end) {
        return new Relationship(this.identity, start, end, this.type, this.properties, this.elementId);
    }
    /**
     * Bind relationship
     *
     * @protected
     * @param {Node} start - Start Node
     * @param {Node} end - End Node
     * @return {Relationship} - Created relationship
     */
    bindTo(start, end) {
        return new Relationship(this.identity, start.identity, end.identity, this.type, this.properties, this.elementId, start.elementId, end.elementId);
    }
    /**
     * @ignore
     */
    toString() {
        let s = '-[:' + this.type;
        const keys = Object.keys(this.properties);
        if (keys.length > 0) {
            s += ' {';
            for (let i = 0; i < keys.length; i++) {
                if (i > 0)
                    s += ',';
                s += keys[i] + ':' + stringify(this.properties[keys[i]]);
            }
            s += '}';
        }
        s += ']->';
        return s;
    }
}
Object.defineProperty(UnboundRelationship.prototype, UNBOUND_RELATIONSHIP_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link UnboundRelationship} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link UnboundRelationship}, `false` otherwise.
 */
function isUnboundRelationship(obj) {
    return hasIdentifierProperty(obj, UNBOUND_RELATIONSHIP_IDENTIFIER_PROPERTY);
}
/**
 * Class for PathSegment Type.
 */
class PathSegment {
    start;
    relationship;
    end;
    /**
     * @constructor
     * @protected
     * @param {Node} start - start node
     * @param {Relationship} rel - relationship that connects start and end node
     * @param {Node} end - end node
     */
    constructor(start, rel, end) {
        /**
         * Start node.
         * @type {Node}
         */
        this.start = start;
        /**
         * Relationship.
         * @type {Relationship}
         */
        this.relationship = rel;
        /**
         * End node.
         * @type {Node}
         */
        this.end = end;
    }
}
Object.defineProperty(PathSegment.prototype, PATH_SEGMENT_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link PathSegment} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link PathSegment}, `false` otherwise.
 */
function isPathSegment(obj) {
    return hasIdentifierProperty(obj, PATH_SEGMENT_IDENTIFIER_PROPERTY);
}
/**
 * Class for Path Type.
 */
class Path {
    start;
    end;
    segments;
    length;
    /**
     * @constructor
     * @protected
     * @param {Node} start  - start node
     * @param {Node} end - end node
     * @param {Array<PathSegment>} segments - Array of Segments
     */
    constructor(start, end, segments) {
        /**
         * Start node.
         * @type {Node}
         */
        this.start = start;
        /**
         * End node.
         * @type {Node}
         */
        this.end = end;
        /**
         * Segments.
         * @type {Array<PathSegment>}
         */
        this.segments = segments;
        /**
         * Length of the segments.
         * @type {Number}
         */
        this.length = segments.length;
    }
}
Object.defineProperty(Path.prototype, PATH_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link Path} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link Path}, `false` otherwise.
 */
function isPath(obj) {
    return hasIdentifierProperty(obj, PATH_IDENTIFIER_PROPERTY);
}
function _valueOrGetDefault(value, getDefault) {
    return value === undefined || value === null ? getDefault() : value;
}
export { Node, isNode, Relationship, isRelationship, UnboundRelationship, isUnboundRelationship, Path, isPath, PathSegment, isPathSegment };
