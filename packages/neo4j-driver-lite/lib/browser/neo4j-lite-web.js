(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.neo4j = factory());
})(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var lib$2 = {};

	var version$1 = {};

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
	Object.defineProperty(version$1, "__esModule", { value: true });
	// DO NOT CHANGE THE VERSION BELOW HERE
	// This is set by the build system at release time, using
	//
	// gulp set --x <releaseversion>
	//
	// This is set up this way to keep the version in the code in
	// sync with the npm package version, and to allow the build
	// system to control version names at packaging time.
	version$1.default = '0.0.0-dev';

	var logging = {};

	Object.defineProperty(logging, "__esModule", { value: true });
	logging.logging = void 0;
	/**
	 * Object containing predefined logging configurations. These are expected to be used as values of the driver config's `logging` property.
	 * @property {function(level: ?string): object} console the function to create a logging config that prints all messages to `console.log` with
	 * timestamp, level and message. It takes an optional `level` parameter which represents the maximum log level to be logged. Default value is 'info'.
	 */
	logging.logging = {
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
	// A common place for constructing error objects, to keep them
	// uniform across the driver surface.
	/**
	 * Error code representing complete loss of service. Used by {@link Neo4jError#code}.
	 * @type {string}
	 */
	const SERVICE_UNAVAILABLE$5 = 'ServiceUnavailable';
	/**
	 * Error code representing transient loss of service. Used by {@link Neo4jError#code}.
	 * @type {string}
	 */
	const SESSION_EXPIRED$2 = 'SessionExpired';
	/**
	 * Error code representing serialization/deserialization issue in the Bolt protocol. Used by {@link Neo4jError#code}.
	 * @type {string}
	 */
	const PROTOCOL_ERROR$6 = 'ProtocolError';
	/**
	 * Error code representing an no classified error. Used by {@link Neo4jError#code}.
	 * @type {string}
	 */
	const NOT_AVAILABLE$1 = 'N/A';
	/// TODO: Remove definitions of this.constructor and this.__proto__
	/**
	 * Class for all errors thrown/returned by the driver.
	 */
	class Neo4jError extends Error {
	    /**
	     * Optional error code. Will be populated when error originates in the database.
	     */
	    code;
	    retriable;
	    __proto__;
	    /**
	     * @constructor
	     * @param {string} message - the error message
	     * @param {string} code - Optional error code. Will be populated when error originates in the database.
	     */
	    constructor(message, code, cause) {
	        // eslint-disable-next-line
	        // @ts-ignore: not available in ES6 yet
	        super(message, cause != null ? { cause } : undefined);
	        this.constructor = Neo4jError;
	        // eslint-disable-next-line no-proto
	        this.__proto__ = Neo4jError.prototype;
	        this.code = code;
	        this.name = 'Neo4jError';
	        /**
	         * Indicates if the error is retriable.
	         * @type {boolean} - true if the error is retriable
	         */
	        this.retriable = _isRetriableCode(code);
	    }
	    /**
	     * Verifies if the given error is retriable.
	     *
	     * @param {object|undefined|null} error the error object
	     * @returns {boolean} true if the error is retriable
	     */
	    static isRetriable(error) {
	        return error !== null &&
	            error !== undefined &&
	            error instanceof Neo4jError &&
	            error.retriable;
	    }
	}
	/**
	 * Create a new error from a message and error code
	 * @param message the error message
	 * @param code the error code
	 * @return {Neo4jError} an {@link Neo4jError}
	 * @private
	 */
	function newError(message, code, cause) {
	    return new Neo4jError(message, code ?? NOT_AVAILABLE$1, cause);
	}
	/**
	 * Verifies if the given error is retriable.
	 *
	 * @public
	 * @param {object|undefined|null} error the error object
	 * @returns {boolean} true if the error is retriable
	 */
	const isRetriableError = Neo4jError.isRetriable;
	/**
	 * @private
	 * @param {string} code the error code
	 * @returns {boolean} true if the error is a retriable error
	 */
	function _isRetriableCode(code) {
	    return code === SERVICE_UNAVAILABLE$5 ||
	        code === SESSION_EXPIRED$2 ||
	        _isAuthorizationExpired(code) ||
	        _isTransientError(code);
	}
	/**
	 * @private
	 * @param {string} code the error to check
	 * @return {boolean} true if the error is a transient error
	 */
	function _isTransientError(code) {
	    return code?.includes('TransientError') === true;
	}
	/**
	 * @private
	 * @param {string} code the error to check
	 * @returns {boolean} true if the error is a service unavailable error
	 */
	function _isAuthorizationExpired(code) {
	    return code === 'Neo.ClientError.Security.AuthorizationExpired';
	}

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
	 * A cache of the Integer representations of small integer values.
	 * @type {!Object}
	 * @inner
	 * @private
	 */
	// eslint-disable-next-line no-use-before-define
	const INT_CACHE = new Map();
	/**
	 * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
	 * See exported functions for more convenient ways of operating integers.
	 * Use `int()` function to create new integers, `isInt()` to check if given object is integer,
	 * `inSafeRange()` to check if it is safe to convert given value to native number,
	 * `toNumber()` and `toString()` to convert given integer to number or string respectively.
	 * @access public
	 * @exports Integer
	 * @class A Integer class for representing a 64 bit two's-complement integer value.
	 * @param {number} low The low (signed) 32 bits of the long
	 * @param {number} high The high (signed) 32 bits of the long
	 *
	 * @constructor
	 */
	class Integer {
	    low;
	    high;
	    constructor(low, high) {
	        /**
	         * The low 32 bits as a signed value.
	         * @type {number}
	         * @expose
	         */
	        this.low = low ?? 0;
	        /**
	         * The high 32 bits as a signed value.
	         * @type {number}
	         * @expose
	         */
	        this.high = high ?? 0;
	    }
	    // The internal representation of an Integer is the two given signed, 32-bit values.
	    // We use 32-bit pieces because these are the size of integers on which
	    // JavaScript performs bit-operations.  For operations like addition and
	    // multiplication, we split each number into 16 bit pieces, which can easily be
	    // multiplied within JavaScript's floating-point representation without overflow
	    // or change in sign.
	    //
	    // In the algorithms below, we frequently reduce the negative case to the
	    // positive case by negating the input(s) and then post-processing the result.
	    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
	    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
	    // a positive number, it overflows back into a negative).  Not handling this
	    // case would often result in infinite recursion.
	    //
	    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
	    // methods on which they depend.
	    inSafeRange() {
	        return (this.greaterThanOrEqual(Integer.MIN_SAFE_VALUE) &&
	            this.lessThanOrEqual(Integer.MAX_SAFE_VALUE));
	    }
	    /**
	     * Converts the Integer to an exact javascript Number, assuming it is a 32 bit integer.
	     * @returns {number}
	     * @expose
	     */
	    toInt() {
	        return this.low;
	    }
	    /**
	     * Converts the Integer to a the nearest floating-point representation of this value (double, 53 bit mantissa).
	     * @returns {number}
	     * @expose
	     */
	    toNumber() {
	        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
	    }
	    /**
	     * Converts the Integer to a BigInt representation of this value
	     * @returns {bigint}
	     * @expose
	     */
	    toBigInt() {
	        if (this.isZero()) {
	            return BigInt(0);
	        }
	        else if (this.isPositive()) {
	            return (BigInt(this.high >>> 0) * BigInt(TWO_PWR_32_DBL) +
	                BigInt(this.low >>> 0));
	        }
	        else {
	            const negate = this.negate();
	            return (BigInt(-1) *
	                (BigInt(negate.high >>> 0) * BigInt(TWO_PWR_32_DBL) +
	                    BigInt(negate.low >>> 0)));
	        }
	    }
	    /**
	     * Converts the Integer to native number or -Infinity/+Infinity when it does not fit.
	     * @return {number}
	     * @package
	     */
	    toNumberOrInfinity() {
	        if (this.lessThan(Integer.MIN_SAFE_VALUE)) {
	            return Number.NEGATIVE_INFINITY;
	        }
	        else if (this.greaterThan(Integer.MAX_SAFE_VALUE)) {
	            return Number.POSITIVE_INFINITY;
	        }
	        else {
	            return this.toNumber();
	        }
	    }
	    /**
	     * Converts the Integer to a string written in the specified radix.
	     * @param {number=} radix Radix (2-36), defaults to 10
	     * @returns {string}
	     * @override
	     * @throws {RangeError} If `radix` is out of range
	     * @expose
	     */
	    toString(radix) {
	        radix = radix ?? 10;
	        if (radix < 2 || radix > 36) {
	            throw RangeError('radix out of range: ' + radix.toString());
	        }
	        if (this.isZero()) {
	            return '0';
	        }
	        let rem;
	        if (this.isNegative()) {
	            if (this.equals(Integer.MIN_VALUE)) {
	                // We need to change the Integer value before it can be negated, so we remove
	                // the bottom-most digit in this base and then recurse to do the rest.
	                const radixInteger = Integer.fromNumber(radix);
	                const div = this.div(radixInteger);
	                rem = div.multiply(radixInteger).subtract(this);
	                return div.toString(radix) + rem.toInt().toString(radix);
	            }
	            else {
	                return '-' + this.negate().toString(radix);
	            }
	        }
	        // Do several (6) digits each time through the loop, so as to
	        // minimize the calls to the very expensive emulated div.
	        const radixToPower = Integer.fromNumber(Math.pow(radix, 6));
	        // eslint-disable-next-line @typescript-eslint/no-this-alias
	        rem = this;
	        let result = '';
	        while (true) {
	            const remDiv = rem.div(radixToPower);
	            const intval = rem.subtract(remDiv.multiply(radixToPower)).toInt() >>> 0;
	            let digits = intval.toString(radix);
	            rem = remDiv;
	            if (rem.isZero()) {
	                return digits + result;
	            }
	            else {
	                while (digits.length < 6) {
	                    digits = '0' + digits;
	                }
	                result = '' + digits + result;
	            }
	        }
	    }
	    /**
	     * Converts the Integer to it primitive value.
	     *
	     * @since 5.4.0
	     * @returns {bigint}
	     *
	     * @see {@link Integer#toBigInt}
	     * @see {@link Integer#toInt}
	     * @see {@link Integer#toNumber}
	     * @see {@link Integer#toString}
	     */
	    valueOf() {
	        return this.toBigInt();
	    }
	    /**
	     * Gets the high 32 bits as a signed integer.
	     * @returns {number} Signed high bits
	     * @expose
	     */
	    getHighBits() {
	        return this.high;
	    }
	    /**
	     * Gets the low 32 bits as a signed integer.
	     * @returns {number} Signed low bits
	     * @expose
	     */
	    getLowBits() {
	        return this.low;
	    }
	    /**
	     * Gets the number of bits needed to represent the absolute value of this Integer.
	     * @returns {number}
	     * @expose
	     */
	    getNumBitsAbs() {
	        if (this.isNegative()) {
	            return this.equals(Integer.MIN_VALUE) ? 64 : this.negate().getNumBitsAbs();
	        }
	        const val = this.high !== 0 ? this.high : this.low;
	        let bit = 0;
	        for (bit = 31; bit > 0; bit--) {
	            if ((val & (1 << bit)) !== 0) {
	                break;
	            }
	        }
	        return this.high !== 0 ? bit + 33 : bit + 1;
	    }
	    /**
	     * Tests if this Integer's value equals zero.
	     * @returns {boolean}
	     * @expose
	     */
	    isZero() {
	        return this.high === 0 && this.low === 0;
	    }
	    /**
	     * Tests if this Integer's value is negative.
	     * @returns {boolean}
	     * @expose
	     */
	    isNegative() {
	        return this.high < 0;
	    }
	    /**
	     * Tests if this Integer's value is positive.
	     * @returns {boolean}
	     * @expose
	     */
	    isPositive() {
	        return this.high >= 0;
	    }
	    /**
	     * Tests if this Integer's value is odd.
	     * @returns {boolean}
	     * @expose
	     */
	    isOdd() {
	        return (this.low & 1) === 1;
	    }
	    /**
	     * Tests if this Integer's value is even.
	     * @returns {boolean}
	     * @expose
	     */
	    isEven() {
	        return (this.low & 1) === 0;
	    }
	    /**
	     * Tests if this Integer's value equals the specified's.
	     * @param {!Integer|number|string} other Other value
	     * @returns {boolean}
	     * @expose
	     */
	    equals(other) {
	        const theOther = Integer.fromValue(other);
	        return this.high === theOther.high && this.low === theOther.low;
	    }
	    /**
	     * Tests if this Integer's value differs from the specified's.
	     * @param {!Integer|number|string} other Other value
	     * @returns {boolean}
	     * @expose
	     */
	    notEquals(other) {
	        return !this.equals(/* validates */ other);
	    }
	    /**
	     * Tests if this Integer's value is less than the specified's.
	     * @param {!Integer|number|string} other Other value
	     * @returns {boolean}
	     * @expose
	     */
	    lessThan(other) {
	        return this.compare(/* validates */ other) < 0;
	    }
	    /**
	     * Tests if this Integer's value is less than or equal the specified's.
	     * @param {!Integer|number|string} other Other value
	     * @returns {boolean}
	     * @expose
	     */
	    lessThanOrEqual(other) {
	        return this.compare(/* validates */ other) <= 0;
	    }
	    /**
	     * Tests if this Integer's value is greater than the specified's.
	     * @param {!Integer|number|string} other Other value
	     * @returns {boolean}
	     * @expose
	     */
	    greaterThan(other) {
	        return this.compare(/* validates */ other) > 0;
	    }
	    /**
	     * Tests if this Integer's value is greater than or equal the specified's.
	     * @param {!Integer|number|string} other Other value
	     * @returns {boolean}
	     * @expose
	     */
	    greaterThanOrEqual(other) {
	        return this.compare(/* validates */ other) >= 0;
	    }
	    /**
	     * Compares this Integer's value with the specified's.
	     * @param {!Integer|number|string} other Other value
	     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
	     *  if the given one is greater
	     * @expose
	     */
	    compare(other) {
	        const theOther = Integer.fromValue(other);
	        if (this.equals(theOther)) {
	            return 0;
	        }
	        const thisNeg = this.isNegative();
	        const otherNeg = theOther.isNegative();
	        if (thisNeg && !otherNeg) {
	            return -1;
	        }
	        if (!thisNeg && otherNeg) {
	            return 1;
	        }
	        // At this point the sign bits are the same
	        return this.subtract(theOther).isNegative() ? -1 : 1;
	    }
	    /**
	     * Negates this Integer's value.
	     * @returns {!Integer} Negated Integer
	     * @expose
	     */
	    negate() {
	        if (this.equals(Integer.MIN_VALUE)) {
	            return Integer.MIN_VALUE;
	        }
	        return this.not().add(Integer.ONE);
	    }
	    /**
	     * Returns the sum of this and the specified Integer.
	     * @param {!Integer|number|string} addend Addend
	     * @returns {!Integer} Sum
	     * @expose
	     */
	    add(addend) {
	        const theAddend = Integer.fromValue(addend);
	        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
	        const a48 = this.high >>> 16;
	        const a32 = this.high & 0xffff;
	        const a16 = this.low >>> 16;
	        const a00 = this.low & 0xffff;
	        const b48 = theAddend.high >>> 16;
	        const b32 = theAddend.high & 0xffff;
	        const b16 = theAddend.low >>> 16;
	        const b00 = theAddend.low & 0xffff;
	        let c48 = 0;
	        let c32 = 0;
	        let c16 = 0;
	        let c00 = 0;
	        c00 += a00 + b00;
	        c16 += c00 >>> 16;
	        c00 &= 0xffff;
	        c16 += a16 + b16;
	        c32 += c16 >>> 16;
	        c16 &= 0xffff;
	        c32 += a32 + b32;
	        c48 += c32 >>> 16;
	        c32 &= 0xffff;
	        c48 += a48 + b48;
	        c48 &= 0xffff;
	        return Integer.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
	    }
	    /**
	     * Returns the difference of this and the specified Integer.
	     * @param {!Integer|number|string} subtrahend Subtrahend
	     * @returns {!Integer} Difference
	     * @expose
	     */
	    subtract(subtrahend) {
	        const theSubtrahend = Integer.fromValue(subtrahend);
	        return this.add(theSubtrahend.negate());
	    }
	    /**
	     * Returns the product of this and the specified Integer.
	     * @param {!Integer|number|string} multiplier Multiplier
	     * @returns {!Integer} Product
	     * @expose
	     */
	    multiply(multiplier) {
	        if (this.isZero()) {
	            return Integer.ZERO;
	        }
	        const theMultiplier = Integer.fromValue(multiplier);
	        if (theMultiplier.isZero()) {
	            return Integer.ZERO;
	        }
	        if (this.equals(Integer.MIN_VALUE)) {
	            return theMultiplier.isOdd() ? Integer.MIN_VALUE : Integer.ZERO;
	        }
	        if (theMultiplier.equals(Integer.MIN_VALUE)) {
	            return this.isOdd() ? Integer.MIN_VALUE : Integer.ZERO;
	        }
	        if (this.isNegative()) {
	            if (theMultiplier.isNegative()) {
	                return this.negate().multiply(theMultiplier.negate());
	            }
	            else {
	                return this.negate()
	                    .multiply(theMultiplier)
	                    .negate();
	            }
	        }
	        else if (theMultiplier.isNegative()) {
	            return this.multiply(theMultiplier.negate()).negate();
	        }
	        // If both longs are small, use float multiplication
	        if (this.lessThan(TWO_PWR_24) && theMultiplier.lessThan(TWO_PWR_24)) {
	            return Integer.fromNumber(this.toNumber() * theMultiplier.toNumber());
	        }
	        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
	        // We can skip products that would overflow.
	        const a48 = this.high >>> 16;
	        const a32 = this.high & 0xffff;
	        const a16 = this.low >>> 16;
	        const a00 = this.low & 0xffff;
	        const b48 = theMultiplier.high >>> 16;
	        const b32 = theMultiplier.high & 0xffff;
	        const b16 = theMultiplier.low >>> 16;
	        const b00 = theMultiplier.low & 0xffff;
	        let c48 = 0;
	        let c32 = 0;
	        let c16 = 0;
	        let c00 = 0;
	        c00 += a00 * b00;
	        c16 += c00 >>> 16;
	        c00 &= 0xffff;
	        c16 += a16 * b00;
	        c32 += c16 >>> 16;
	        c16 &= 0xffff;
	        c16 += a00 * b16;
	        c32 += c16 >>> 16;
	        c16 &= 0xffff;
	        c32 += a32 * b00;
	        c48 += c32 >>> 16;
	        c32 &= 0xffff;
	        c32 += a16 * b16;
	        c48 += c32 >>> 16;
	        c32 &= 0xffff;
	        c32 += a00 * b32;
	        c48 += c32 >>> 16;
	        c32 &= 0xffff;
	        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
	        c48 &= 0xffff;
	        return Integer.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
	    }
	    /**
	     * Returns this Integer divided by the specified.
	     * @param {!Integer|number|string} divisor Divisor
	     * @returns {!Integer} Quotient
	     * @expose
	     */
	    div(divisor) {
	        const theDivisor = Integer.fromValue(divisor);
	        if (theDivisor.isZero()) {
	            throw newError('division by zero');
	        }
	        if (this.isZero()) {
	            return Integer.ZERO;
	        }
	        let approx, rem, res;
	        if (this.equals(Integer.MIN_VALUE)) {
	            if (theDivisor.equals(Integer.ONE) ||
	                theDivisor.equals(Integer.NEG_ONE)) {
	                return Integer.MIN_VALUE;
	            }
	            if (theDivisor.equals(Integer.MIN_VALUE)) {
	                return Integer.ONE;
	            }
	            else {
	                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
	                const halfThis = this.shiftRight(1);
	                approx = halfThis.div(theDivisor).shiftLeft(1);
	                if (approx.equals(Integer.ZERO)) {
	                    return theDivisor.isNegative() ? Integer.ONE : Integer.NEG_ONE;
	                }
	                else {
	                    rem = this.subtract(theDivisor.multiply(approx));
	                    res = approx.add(rem.div(theDivisor));
	                    return res;
	                }
	            }
	        }
	        else if (theDivisor.equals(Integer.MIN_VALUE)) {
	            return Integer.ZERO;
	        }
	        if (this.isNegative()) {
	            if (theDivisor.isNegative()) {
	                return this.negate().div(theDivisor.negate());
	            }
	            return this.negate()
	                .div(theDivisor)
	                .negate();
	        }
	        else if (theDivisor.isNegative()) {
	            return this.div(theDivisor.negate()).negate();
	        }
	        // Repeat the following until the remainder is less than other:  find a
	        // floating-point that approximates remainder / other *from below*, add this
	        // into the result, and subtract it from the remainder.  It is critical that
	        // the approximate value is less than or equal to the real value so that the
	        // remainder never becomes negative.
	        res = Integer.ZERO;
	        // eslint-disable-next-line @typescript-eslint/no-this-alias
	        rem = this;
	        while (rem.greaterThanOrEqual(theDivisor)) {
	            // Approximate the result of division. This may be a little greater or
	            // smaller than the actual value.
	            approx = Math.max(1, Math.floor(rem.toNumber() / theDivisor.toNumber()));
	            // We will tweak the approximate result by changing it in the 48-th digit or
	            // the smallest non-fractional digit, whichever is larger.
	            const log2 = Math.ceil(Math.log(approx) / Math.LN2);
	            const delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
	            // Decrease the approximation until it is smaller than the remainder.  Note
	            // that if it is too large, the product overflows and is negative.
	            let approxRes = Integer.fromNumber(approx);
	            let approxRem = approxRes.multiply(theDivisor);
	            while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
	                approx -= delta;
	                approxRes = Integer.fromNumber(approx);
	                approxRem = approxRes.multiply(theDivisor);
	            }
	            // We know the answer can't be zero... and actually, zero would cause
	            // infinite recursion since we would make no progress.
	            if (approxRes.isZero()) {
	                approxRes = Integer.ONE;
	            }
	            res = res.add(approxRes);
	            rem = rem.subtract(approxRem);
	        }
	        return res;
	    }
	    /**
	     * Returns this Integer modulo the specified.
	     * @param {!Integer|number|string} divisor Divisor
	     * @returns {!Integer} Remainder
	     * @expose
	     */
	    modulo(divisor) {
	        const theDivisor = Integer.fromValue(divisor);
	        return this.subtract(this.div(theDivisor).multiply(theDivisor));
	    }
	    /**
	     * Returns the bitwise NOT of this Integer.
	     * @returns {!Integer}
	     * @expose
	     */
	    not() {
	        return Integer.fromBits(~this.low, ~this.high);
	    }
	    /**
	     * Returns the bitwise AND of this Integer and the specified.
	     * @param {!Integer|number|string} other Other Integer
	     * @returns {!Integer}
	     * @expose
	     */
	    and(other) {
	        const theOther = Integer.fromValue(other);
	        return Integer.fromBits(this.low & theOther.low, this.high & theOther.high);
	    }
	    /**
	     * Returns the bitwise OR of this Integer and the specified.
	     * @param {!Integer|number|string} other Other Integer
	     * @returns {!Integer}
	     * @expose
	     */
	    or(other) {
	        const theOther = Integer.fromValue(other);
	        return Integer.fromBits(this.low | theOther.low, this.high | theOther.high);
	    }
	    /**
	     * Returns the bitwise XOR of this Integer and the given one.
	     * @param {!Integer|number|string} other Other Integer
	     * @returns {!Integer}
	     * @expose
	     */
	    xor(other) {
	        const theOther = Integer.fromValue(other);
	        return Integer.fromBits(this.low ^ theOther.low, this.high ^ theOther.high);
	    }
	    /**
	     * Returns this Integer with bits shifted to the left by the given amount.
	     * @param {number|!Integer} numBits Number of bits
	     * @returns {!Integer} Shifted Integer
	     * @expose
	     */
	    shiftLeft(numBits) {
	        let bitsCount = Integer.toNumber(numBits);
	        if ((bitsCount &= 63) === 0) {
	            return Integer.ZERO;
	        }
	        else if (bitsCount < 32) {
	            return Integer.fromBits(this.low << bitsCount, (this.high << bitsCount) | (this.low >>> (32 - bitsCount)));
	        }
	        else {
	            return Integer.fromBits(0, this.low << (bitsCount - 32));
	        }
	    }
	    /**
	     * Returns this Integer with bits arithmetically shifted to the right by the given amount.
	     * @param {number|!Integer} numBits Number of bits
	     * @returns {!Integer} Shifted Integer
	     * @expose
	     */
	    shiftRight(numBits) {
	        let bitsCount = Integer.toNumber(numBits);
	        const numBitNum = Integer.toNumber(numBits);
	        if ((bitsCount &= 63) === 0) {
	            return Integer.ZERO;
	        }
	        else if (numBitNum < 32) {
	            return Integer.fromBits((this.low >>> bitsCount) | (this.high << (32 - bitsCount)), this.high >> bitsCount);
	        }
	        else {
	            return Integer.fromBits(this.high >> (bitsCount - 32), this.high >= 0 ? 0 : -1);
	        }
	    }
	    /**
	     * Signed zero.
	     * @type {!Integer}
	     * @expose
	     */
	    static ZERO = Integer.fromInt(0);
	    /**
	     * Signed one.
	     * @type {!Integer}
	     * @expose
	     */
	    static ONE = Integer.fromInt(1);
	    /**
	     * Signed negative one.
	     * @type {!Integer}
	     * @expose
	     */
	    static NEG_ONE = Integer.fromInt(-1);
	    /**
	     * Maximum signed value.
	     * @type {!Integer}
	     * @expose
	     */
	    static MAX_VALUE = Integer.fromBits(0xffffffff | 0, 0x7fffffff | 0);
	    /**
	     * Minimum signed value.
	     * @type {!Integer}
	     * @expose
	     */
	    static MIN_VALUE = Integer.fromBits(0, 0x80000000 | 0);
	    /**
	     * Minimum safe value.
	     * @type {!Integer}
	     * @expose
	     */
	    static MIN_SAFE_VALUE = Integer.fromBits(0x1 | 0, 0xffffffffffe00000 | 0);
	    /**
	     * Maximum safe value.
	     * @type {!Integer}
	     * @expose
	     */
	    static MAX_SAFE_VALUE = Integer.fromBits(0xffffffff | 0, 0x1fffff | 0);
	    /**
	     * An indicator used to reliably determine if an object is a Integer or not.
	     * @type {boolean}
	     * @const
	     * @expose
	     * @private
	     */
	    static __isInteger__ = true;
	    /**
	     * Tests if the specified object is a Integer.
	     * @access private
	     * @param {*} obj Object
	     * @returns {boolean}
	     * @expose
	     */
	    static isInteger(obj) {
	        return obj?.__isInteger__ === true;
	    }
	    /**
	     * Returns a Integer representing the given 32 bit integer value.
	     * @access private
	     * @param {number} value The 32 bit integer in question
	     * @returns {!Integer} The corresponding Integer value
	     * @expose
	     */
	    static fromInt(value) {
	        let cachedObj;
	        value = value | 0;
	        if (value >= -128 && value < 128) {
	            cachedObj = INT_CACHE.get(value);
	            if (cachedObj != null) {
	                return cachedObj;
	            }
	        }
	        const obj = new Integer(value, value < 0 ? -1 : 0);
	        if (value >= -128 && value < 128) {
	            INT_CACHE.set(value, obj);
	        }
	        return obj;
	    }
	    /**
	     * Returns a Integer representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
	     *  assumed to use 32 bits.
	     * @access private
	     * @param {number} lowBits The low 32 bits
	     * @param {number} highBits The high 32 bits
	     * @returns {!Integer} The corresponding Integer value
	     * @expose
	     */
	    static fromBits(lowBits, highBits) {
	        return new Integer(lowBits, highBits);
	    }
	    /**
	     * Returns a Integer representing the given value, provided that it is a finite number. Otherwise, zero is returned.
	     * @access private
	     * @param {number} value The number in question
	     * @returns {!Integer} The corresponding Integer value
	     * @expose
	     */
	    static fromNumber(value) {
	        if (isNaN(value) || !isFinite(value)) {
	            return Integer.ZERO;
	        }
	        if (value <= -TWO_PWR_63_DBL) {
	            return Integer.MIN_VALUE;
	        }
	        if (value + 1 >= TWO_PWR_63_DBL) {
	            return Integer.MAX_VALUE;
	        }
	        if (value < 0) {
	            return Integer.fromNumber(-value).negate();
	        }
	        return new Integer(value % TWO_PWR_32_DBL | 0, (value / TWO_PWR_32_DBL) | 0);
	    }
	    /**
	     * Returns a Integer representation of the given string, written using the specified radix.
	     * @access private
	     * @param {string} str The textual representation of the Integer
	     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
	     * @param {Object} [opts={}] Configuration options
	     * @param {boolean} [opts.strictStringValidation=false] Enable strict validation generated Integer.
	     * @returns {!Integer} The corresponding Integer value
	     * @expose
	     */
	    static fromString(str, radix, { strictStringValidation } = {}) {
	        if (str.length === 0) {
	            throw newError('number format error: empty string');
	        }
	        if (str === 'NaN' ||
	            str === 'Infinity' ||
	            str === '+Infinity' ||
	            str === '-Infinity') {
	            return Integer.ZERO;
	        }
	        radix = radix ?? 10;
	        if (radix < 2 || radix > 36) {
	            throw newError('radix out of range: ' + radix.toString());
	        }
	        let p;
	        if ((p = str.indexOf('-')) > 0) {
	            throw newError('number format error: interior "-" character: ' + str);
	        }
	        else if (p === 0) {
	            return Integer.fromString(str.substring(1), radix).negate();
	        }
	        // Do several (8) digits each time through the loop, so as to
	        // minimize the calls to the very expensive emulated div.
	        const radixToPower = Integer.fromNumber(Math.pow(radix, 8));
	        let result = Integer.ZERO;
	        for (let i = 0; i < str.length; i += 8) {
	            const size = Math.min(8, str.length - i);
	            const valueString = str.substring(i, i + size);
	            const value = parseInt(valueString, radix);
	            if (strictStringValidation === true && !_isValidNumberFromString(valueString, value, radix)) {
	                throw newError(`number format error: "${valueString}" is NaN in radix ${radix}: ${str}`);
	            }
	            if (size < 8) {
	                const power = Integer.fromNumber(Math.pow(radix, size));
	                result = result.multiply(power).add(Integer.fromNumber(value));
	            }
	            else {
	                result = result.multiply(radixToPower);
	                result = result.add(Integer.fromNumber(value));
	            }
	        }
	        return result;
	    }
	    /**
	     * Converts the specified value to a Integer.
	     * @access private
	     * @param {!Integer|number|string|bigint|!{low: number, high: number}} val Value
	     * @param {Object} [opts={}] Configuration options
	     * @param {boolean} [opts.strictStringValidation=false] Enable strict validation generated Integer.
	     * @param {boolean} [opts.ceilFloat=false] Enable round up float to the nearest Integer.
	     * @returns {!Integer}
	     * @expose
	     */
	    static fromValue(val, opts = {}) {
	        if (val /* is compatible */ instanceof Integer) {
	            return val;
	        }
	        if (typeof val === 'number') {
	            if (opts.ceilFloat === true) {
	                val = Math.ceil(val);
	            }
	            return Integer.fromNumber(val);
	        }
	        if (typeof val === 'string') {
	            return Integer.fromString(val, undefined, opts);
	        }
	        if (typeof val === 'bigint') {
	            return Integer.fromString(val.toString());
	        }
	        // Throws for non-objects, converts non-instanceof Integer:
	        return new Integer(val.low, val.high);
	    }
	    /**
	     * Converts the specified value to a number.
	     * @access private
	     * @param {!Integer|number|string|!{low: number, high: number}} val Value
	     * @returns {number}
	     * @expose
	     */
	    static toNumber(val) {
	        switch (typeof val) {
	            case 'number':
	                return val;
	            case 'bigint':
	                return Number(val);
	            default:
	                return Integer.fromValue(val).toNumber();
	        }
	    }
	    /**
	     * Converts the specified value to a string.
	     * @access private
	     * @param {!Integer|number|string|!{low: number, high: number}} val Value
	     * @param {number} radix optional radix for string conversion, defaults to 10
	     * @returns {string}
	     * @expose
	     */
	    static toString(val, radix) {
	        return Integer.fromValue(val).toString(radix);
	    }
	    /**
	     * Checks if the given value is in the safe range in order to be converted to a native number
	     * @access private
	     * @param {!Integer|number|string|!{low: number, high: number}} val Value
	     * @param {number} radix optional radix for string conversion, defaults to 10
	     * @returns {boolean}
	     * @expose
	     */
	    static inSafeRange(val) {
	        return Integer.fromValue(val).inSafeRange();
	    }
	}
	/**
	 * @private
	 * @param num
	 * @param radix
	 * @param minSize
	 * @returns {string}
	 */
	function _convertNumberToString(num, radix, minSize) {
	    const theNumberString = num.toString(radix);
	    const paddingLength = Math.max(minSize - theNumberString.length, 0);
	    const padding = '0'.repeat(paddingLength);
	    return `${padding}${theNumberString}`;
	}
	/**
	 *
	 * @private
	 * @param theString
	 * @param theNumber
	 * @param radix
	 * @return {boolean} True if valid
	 */
	function _isValidNumberFromString(theString, theNumber, radix) {
	    return !Number.isNaN(theString) &&
	        !Number.isNaN(theNumber) &&
	        _convertNumberToString(theNumber, radix, theString.length) === theString.toLowerCase();
	}
	Object.defineProperty(Integer.prototype, '__isInteger__', {
	    value: true,
	    enumerable: false,
	    configurable: false
	});
	/**
	 * @type {number}
	 * @const
	 * @inner
	 * @private
	 */
	const TWO_PWR_16_DBL = 1 << 16;
	/**
	 * @type {number}
	 * @const
	 * @inner
	 * @private
	 */
	const TWO_PWR_24_DBL = 1 << 24;
	/**
	 * @type {number}
	 * @const
	 * @inner
	 * @private
	 */
	const TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
	/**
	 * @type {number}
	 * @const
	 * @inner
	 * @private
	 */
	const TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
	/**
	 * @type {number}
	 * @const
	 * @inner
	 * @private
	 */
	const TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
	/**
	 * @type {!Integer}
	 * @const
	 * @inner
	 * @private
	 */
	const TWO_PWR_24 = Integer.fromInt(TWO_PWR_24_DBL);
	/**
	 * Cast value to Integer type.
	 * @access public
	 * @param {Mixed} value - The value to use.
	 * @param {Object} [opts={}] Configuration options
	 * @param {boolean} [opts.strictStringValidation=false] Enable strict validation generated Integer.
	 * @param {boolean} [opts.ceilFloat=false] Enable round up float to the nearest Integer.
	 * @return {Integer} - An object of type Integer.
	 */
	const int = Integer.fromValue;
	/**
	 * Check if a variable is of Integer type.
	 * @access public
	 * @param {Mixed} value - The variable to check.
	 * @return {Boolean} - Is it of the Integer type?
	 */
	const isInt = Integer.isInteger;
	/**
	 * Check if a variable can be safely converted to a number
	 * @access public
	 * @param {Mixed} value - The variable to check
	 * @return {Boolean} - true if it is safe to call toNumber on variable otherwise false
	 */
	const inSafeRange = Integer.inSafeRange;
	/**
	 * Converts a variable to a number
	 * @access public
	 * @param {Mixed} value - The variable to convert
	 * @return {number} - the variable as a number
	 */
	const toNumber = Integer.toNumber;
	/**
	 * Converts the integer to a string representation
	 * @access public
	 * @param {Mixed} value - The variable to convert
	 * @param {number} radix - radix to use in string conversion, defaults to 10
	 * @return {string} - returns a string representation of the integer
	 */
	const toString = Integer.toString;

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
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const __isBrokenObject__ = '__isBrokenObject__';
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const __reason__ = '__reason__';
	/**
	 * Creates a object which all method call will throw the given error
	 *
	 * @param {Error} error The error
	 * @param {any} object The object. Default: {}
	 * @returns {any} A broken object
	 */
	function createBrokenObject(error, object = {}) {
	    const fail = () => {
	        throw error;
	    };
	    return new Proxy(object, {
	        get: (_, p) => {
	            if (p === __isBrokenObject__) {
	                return true;
	            }
	            else if (p === __reason__) {
	                return error;
	            }
	            else if (p === 'toJSON') {
	                return undefined;
	            }
	            fail();
	        },
	        set: fail,
	        apply: fail,
	        construct: fail,
	        defineProperty: fail,
	        deleteProperty: fail,
	        getOwnPropertyDescriptor: fail,
	        getPrototypeOf: fail,
	        has: fail,
	        isExtensible: fail,
	        ownKeys: fail,
	        preventExtensions: fail,
	        setPrototypeOf: fail
	    });
	}
	/**
	 * Verifies if it is a Broken Object
	 * @param {any} object The object
	 * @returns {boolean} If it was created with createBrokenObject
	 */
	function isBrokenObject(object) {
	    return object !== null && typeof object === 'object' && object[__isBrokenObject__] === true;
	}
	/**
	 * Returns if the reason the object is broken.
	 *
	 * This method should only be called with instances create with {@link createBrokenObject}
	 *
	 * @param {any} object The object
	 * @returns {Error} The reason the object is broken
	 */
	function getBrokenObjectReason(object) {
	    return object[__reason__];
	}

	var objectUtil$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		createBrokenObject: createBrokenObject,
		isBrokenObject: isBrokenObject,
		getBrokenObjectReason: getBrokenObjectReason
	});

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
	 * Custom version on JSON.stringify that can handle values that normally don't support serialization, such as BigInt.
	 * @private
	 * @param val A JavaScript value, usually an object or array, to be converted.
	 * @returns A JSON string representing the given value.
	 */
	function stringify(val) {
	    return JSON.stringify(val, (_, value) => {
	        if (isBrokenObject(value)) {
	            return {
	                __isBrokenObject__: true,
	                __reason__: getBrokenObjectReason(value)
	            };
	        }
	        if (typeof value === 'bigint') {
	            return `${value}n`;
	        }
	        return value;
	    });
	}

	var json = /*#__PURE__*/Object.freeze({
		__proto__: null,
		stringify: stringify
	});

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
	const ENCRYPTION_ON$2 = 'ENCRYPTION_ON';
	const ENCRYPTION_OFF$2 = 'ENCRYPTION_OFF';
	/**
	 * Verifies if the object is null or empty
	 * @param obj The subject object
	 * @returns {boolean} True if it's empty object or null
	 */
	function isEmptyObjectOrNull(obj) {
	    if (obj === null) {
	        return true;
	    }
	    if (!isObject(obj)) {
	        return false;
	    }
	    for (const prop in obj) {
	        if (obj[prop] !== undefined) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * Verify if it's an object
	 * @param obj The subject
	 * @returns {boolean} True if it's an object
	 */
	function isObject(obj) {
	    return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
	}
	/**
	 * Check and normalize given query and parameters.
	 * @param {string|{text: string, parameters: Object}} query the query to check.
	 * @param {Object} parameters
	 * @return {{validatedQuery: string|{text: string, parameters: Object}, params: Object}} the normalized query with parameters.
	 * @throws TypeError when either given query or parameters are invalid.
	 */
	function validateQueryAndParameters(query, parameters, opt) {
	    let validatedQuery = '';
	    let params = parameters ?? {};
	    const skipAsserts = opt?.skipAsserts ?? false;
	    if (typeof query === 'string') {
	        validatedQuery = query;
	    }
	    else if (query instanceof String) {
	        validatedQuery = query.toString();
	    }
	    else if (typeof query === 'object' && query.text != null) {
	        validatedQuery = query.text;
	        params = query.parameters ?? {};
	    }
	    if (!skipAsserts) {
	        assertCypherQuery(validatedQuery);
	        assertQueryParameters(params);
	    }
	    return { validatedQuery, params };
	}
	/**
	 * Assert it's a object
	 * @param {any} obj The subject
	 * @param {string} objName The object name
	 * @returns {object} The subject object
	 * @throws {TypeError} when the supplied param is not an object
	 */
	function assertObject(obj, objName) {
	    if (!isObject(obj)) {
	        throw new TypeError(objName + ' expected to be an object but was: ' + stringify(obj));
	    }
	    return obj;
	}
	/**
	 * Assert it's a string
	 * @param {any} obj The subject
	 * @param {string} objName The object name
	 * @returns {string} The subject string
	 * @throws {TypeError} when the supplied param is not a string
	 */
	function assertString$1(obj, objName) {
	    if (!isString(obj)) {
	        throw new TypeError(stringify(objName) + ' expected to be string but was: ' + stringify(obj));
	    }
	    return obj;
	}
	/**
	 * Assert it's a number
	 * @param {any} obj The subject
	 * @param {string} objName The object name
	 * @returns {number} The number
	 * @throws {TypeError} when the supplied param is not a number
	 */
	function assertNumber(obj, objName) {
	    if (typeof obj !== 'number') {
	        throw new TypeError(objName + ' expected to be a number but was: ' + stringify(obj));
	    }
	    return obj;
	}
	/**
	 * Assert it's a number or integer
	 * @param {any} obj The subject
	 * @param {string} objName The object name
	 * @returns {number|Integer} The subject object
	 * @throws {TypeError} when the supplied param is not a number or integer
	 */
	function assertNumberOrInteger(obj, objName) {
	    if (typeof obj !== 'number' && typeof obj !== 'bigint' && !isInt(obj)) {
	        throw new TypeError(objName +
	            ' expected to be either a number or an Integer object but was: ' +
	            stringify(obj));
	    }
	    return obj;
	}
	/**
	 * Assert it's a valid datae
	 * @param {any} obj The subject
	 * @param {string} objName The object name
	 * @returns {Date} The valida date
	 * @throws {TypeError} when the supplied param is not a valid date
	 */
	function assertValidDate(obj, objName) {
	    if (Object.prototype.toString.call(obj) !== '[object Date]') {
	        throw new TypeError(objName +
	            ' expected to be a standard JavaScript Date but was: ' +
	            stringify(obj));
	    }
	    if (Number.isNaN(obj.getTime())) {
	        throw new TypeError(objName +
	            ' expected to be valid JavaScript Date but its time was NaN: ' +
	            stringify(obj));
	    }
	    return obj;
	}
	/**
	 * Validates a cypher query string
	 * @param {any} obj The query
	 * @returns {void}
	 * @throws {TypeError} if the query is not valid
	 */
	function assertCypherQuery(obj) {
	    assertString$1(obj, 'Cypher query');
	    if (obj.trim().length === 0) {
	        throw new TypeError('Cypher query is expected to be a non-empty string.');
	    }
	}
	/**
	 * Validates if the query parameters is an object
	 * @param {any} obj The parameters
	 * @returns {void}
	 * @throws {TypeError} if the parameters is not valid
	 */
	function assertQueryParameters(obj) {
	    if (!isObject(obj)) {
	        // objects created with `Object.create(null)` do not have a constructor property
	        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
	        const constructor = obj.constructor != null ? ' ' + obj.constructor.name : '';
	        throw new TypeError(`Query parameters are expected to either be undefined/null or an object, given:${constructor} ${JSON.stringify(obj)}`);
	    }
	}
	/**
	 * Verify if the supplied object is a string
	 *
	 * @param str The string
	 * @returns {boolean} True if the supplied object is an string
	 */
	function isString(str) {
	    return Object.prototype.toString.call(str) === '[object String]';
	}
	/**
	 * Verifies if object are the equals
	 * @param {unknown} a
	 * @param {unknown} b
	 * @returns {boolean}
	 */
	function equals$1(a, b) {
	    if (a === b) {
	        return true;
	    }
	    if (a === null || b === null) {
	        return false;
	    }
	    if (typeof a === 'object' && typeof b === 'object') {
	        const keysA = Object.keys(a);
	        const keysB = Object.keys(b);
	        if (keysA.length !== keysB.length) {
	            return false;
	        }
	        for (const key of keysA) {
	            if (!equals$1(a[key], b[key])) {
	                return false;
	            }
	        }
	        return true;
	    }
	    return false;
	}

	var util = /*#__PURE__*/Object.freeze({
		__proto__: null,
		isEmptyObjectOrNull: isEmptyObjectOrNull,
		isObject: isObject,
		isString: isString,
		assertObject: assertObject,
		assertString: assertString$1,
		assertNumber: assertNumber,
		assertNumberOrInteger: assertNumberOrInteger,
		assertValidDate: assertValidDate,
		validateQueryAndParameters: validateQueryAndParameters,
		equals: equals$1,
		ENCRYPTION_ON: ENCRYPTION_ON$2,
		ENCRYPTION_OFF: ENCRYPTION_OFF$2
	});

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
	/*
	  Code in this util should be compatible with code in the database that uses JSR-310 java.time APIs.

	  It is based on a library called ThreeTen (https://github.com/ThreeTen/threetenbp) which was derived
	  from JSR-310 reference implementation previously hosted on GitHub. Code uses `Integer` type everywhere
	  to correctly handle large integer values that are greater than `Number.MAX_SAFE_INTEGER`.

	  Please consult either ThreeTen or js-joda (https://github.com/js-joda/js-joda) when working with the
	  conversion functions.
	 */
	class ValueRange {
	    _minNumber;
	    _maxNumber;
	    _minInteger;
	    _maxInteger;
	    constructor(min, max) {
	        this._minNumber = min;
	        this._maxNumber = max;
	        this._minInteger = int(min);
	        this._maxInteger = int(max);
	    }
	    contains(value) {
	        if (isInt(value) && value instanceof Integer) {
	            return (value.greaterThanOrEqual(this._minInteger) &&
	                value.lessThanOrEqual(this._maxInteger));
	        }
	        else if (typeof value === 'bigint') {
	            const intValue = int(value);
	            return (intValue.greaterThanOrEqual(this._minInteger) &&
	                intValue.lessThanOrEqual(this._maxInteger));
	        }
	        else {
	            return value >= this._minNumber && value <= this._maxNumber;
	        }
	    }
	    toString() {
	        return `[${this._minNumber}, ${this._maxNumber}]`;
	    }
	}
	const YEAR_RANGE = new ValueRange(-999999999, 999999999);
	const MONTH_OF_YEAR_RANGE = new ValueRange(1, 12);
	const DAY_OF_MONTH_RANGE = new ValueRange(1, 31);
	const HOUR_OF_DAY_RANGE = new ValueRange(0, 23);
	const MINUTE_OF_HOUR_RANGE = new ValueRange(0, 59);
	const SECOND_OF_MINUTE_RANGE = new ValueRange(0, 59);
	const NANOSECOND_OF_SECOND_RANGE = new ValueRange(0, 999999999);
	const MINUTES_PER_HOUR = 60;
	const SECONDS_PER_MINUTE = 60;
	const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
	const NANOS_PER_SECOND$1 = 1000000000;
	const NANOS_PER_MILLISECOND = 1000000;
	const NANOS_PER_MINUTE$1 = NANOS_PER_SECOND$1 * SECONDS_PER_MINUTE;
	const NANOS_PER_HOUR$1 = NANOS_PER_MINUTE$1 * MINUTES_PER_HOUR;
	const DAYS_0000_TO_1970$1 = 719528;
	const DAYS_PER_400_YEAR_CYCLE$1 = 146097;
	const SECONDS_PER_DAY$1 = 86400;
	function normalizeSecondsForDuration(seconds, nanoseconds) {
	    return int(seconds).add(floorDiv$1(nanoseconds, NANOS_PER_SECOND$1));
	}
	function normalizeNanosecondsForDuration(nanoseconds) {
	    return floorMod$1(nanoseconds, NANOS_PER_SECOND$1);
	}
	/**
	 * Converts given local time into a single integer representing this same time in nanoseconds of the day.
	 * @param {Integer|number|string} hour the hour of the local time to convert.
	 * @param {Integer|number|string} minute the minute of the local time to convert.
	 * @param {Integer|number|string} second the second of the local time to convert.
	 * @param {Integer|number|string} nanosecond the nanosecond of the local time to convert.
	 * @return {Integer} nanoseconds representing the given local time.
	 */
	function localTimeToNanoOfDay$1(hour, minute, second, nanosecond) {
	    hour = int(hour);
	    minute = int(minute);
	    second = int(second);
	    nanosecond = int(nanosecond);
	    let totalNanos = hour.multiply(NANOS_PER_HOUR$1);
	    totalNanos = totalNanos.add(minute.multiply(NANOS_PER_MINUTE$1));
	    totalNanos = totalNanos.add(second.multiply(NANOS_PER_SECOND$1));
	    return totalNanos.add(nanosecond);
	}
	/**
	 * Converts given local date time into a single integer representing this same time in epoch seconds UTC.
	 * @param {Integer|number|string} year the year of the local date-time to convert.
	 * @param {Integer|number|string} month the month of the local date-time to convert.
	 * @param {Integer|number|string} day the day of the local date-time to convert.
	 * @param {Integer|number|string} hour the hour of the local date-time to convert.
	 * @param {Integer|number|string} minute the minute of the local date-time to convert.
	 * @param {Integer|number|string} second the second of the local date-time to convert.
	 * @param {Integer|number|string} nanosecond the nanosecond of the local date-time to convert.
	 * @return {Integer} epoch second in UTC representing the given local date time.
	 */
	function localDateTimeToEpochSecond$2(year, month, day, hour, minute, second, nanosecond) {
	    const epochDay = dateToEpochDay$1(year, month, day);
	    const localTimeSeconds = localTimeToSecondOfDay(hour, minute, second);
	    return epochDay.multiply(SECONDS_PER_DAY$1).add(localTimeSeconds);
	}
	/**
	 * Converts given local date into a single integer representing it's epoch day.
	 * @param {Integer|number|string} year the year of the local date to convert.
	 * @param {Integer|number|string} month the month of the local date to convert.
	 * @param {Integer|number|string} day the day of the local date to convert.
	 * @return {Integer} epoch day representing the given date.
	 */
	function dateToEpochDay$1(year, month, day) {
	    year = int(year);
	    month = int(month);
	    day = int(day);
	    let epochDay = year.multiply(365);
	    if (year.greaterThanOrEqual(0)) {
	        epochDay = epochDay.add(year
	            .add(3)
	            .div(4)
	            .subtract(year.add(99).div(100))
	            .add(year.add(399).div(400)));
	    }
	    else {
	        epochDay = epochDay.subtract(year
	            .div(-4)
	            .subtract(year.div(-100))
	            .add(year.div(-400)));
	    }
	    epochDay = epochDay.add(month
	        .multiply(367)
	        .subtract(362)
	        .div(12));
	    epochDay = epochDay.add(day.subtract(1));
	    if (month.greaterThan(2)) {
	        epochDay = epochDay.subtract(1);
	        if (!isLeapYear(year)) {
	            epochDay = epochDay.subtract(1);
	        }
	    }
	    return epochDay.subtract(DAYS_0000_TO_1970$1);
	}
	/**
	 * Format given duration to an ISO 8601 string.
	 * @param {Integer|number|string} months the number of months.
	 * @param {Integer|number|string} days the number of days.
	 * @param {Integer|number|string} seconds the number of seconds.
	 * @param {Integer|number|string} nanoseconds the number of nanoseconds.
	 * @return {string} ISO string that represents given duration.
	 */
	function durationToIsoString(months, days, seconds, nanoseconds) {
	    const monthsString = formatNumber(months);
	    const daysString = formatNumber(days);
	    const secondsAndNanosecondsString = formatSecondsAndNanosecondsForDuration(seconds, nanoseconds);
	    return `P${monthsString}M${daysString}DT${secondsAndNanosecondsString}S`;
	}
	/**
	 * Formats given time to an ISO 8601 string.
	 * @param {Integer|number|string} hour the hour value.
	 * @param {Integer|number|string} minute the minute value.
	 * @param {Integer|number|string} second the second value.
	 * @param {Integer|number|string} nanosecond the nanosecond value.
	 * @return {string} ISO string that represents given time.
	 */
	function timeToIsoString(hour, minute, second, nanosecond) {
	    const hourString = formatNumber(hour, 2);
	    const minuteString = formatNumber(minute, 2);
	    const secondString = formatNumber(second, 2);
	    const nanosecondString = formatNanosecond(nanosecond);
	    return `${hourString}:${minuteString}:${secondString}${nanosecondString}`;
	}
	/**
	 * Formats given time zone offset in seconds to string representation like '±HH:MM', '±HH:MM:SS' or 'Z' for UTC.
	 * @param {Integer|number|string} offsetSeconds the offset in seconds.
	 * @return {string} ISO string that represents given offset.
	 */
	function timeZoneOffsetToIsoString(offsetSeconds) {
	    offsetSeconds = int(offsetSeconds);
	    if (offsetSeconds.equals(0)) {
	        return 'Z';
	    }
	    const isNegative = offsetSeconds.isNegative();
	    if (isNegative) {
	        offsetSeconds = offsetSeconds.multiply(-1);
	    }
	    const signPrefix = isNegative ? '-' : '+';
	    const hours = formatNumber(offsetSeconds.div(SECONDS_PER_HOUR), 2);
	    const minutes = formatNumber(offsetSeconds.div(SECONDS_PER_MINUTE).modulo(MINUTES_PER_HOUR), 2);
	    const secondsValue = offsetSeconds.modulo(SECONDS_PER_MINUTE);
	    const seconds = secondsValue.equals(0) ? null : formatNumber(secondsValue, 2);
	    return seconds != null
	        ? `${signPrefix}${hours}:${minutes}:${seconds}`
	        : `${signPrefix}${hours}:${minutes}`;
	}
	/**
	 * Formats given date to an ISO 8601 string.
	 * @param {Integer|number|string} year the date year.
	 * @param {Integer|number|string} month the date month.
	 * @param {Integer|number|string} day the date day.
	 * @return {string} ISO string that represents given date.
	 */
	function dateToIsoString(year, month, day) {
	    const yearString = formatYear(year);
	    const monthString = formatNumber(month, 2);
	    const dayString = formatNumber(day, 2);
	    return `${yearString}-${monthString}-${dayString}`;
	}
	/**
	 * Convert the given iso date string to a JavaScript Date object
	 *
	 * @param {string} isoString The iso date string
	 * @returns {Date} the date
	 */
	function isoStringToStandardDate(isoString) {
	    return new Date(isoString);
	}
	/**
	 * Convert the given utc timestamp to a JavaScript Date object
	 *
	 * @param {number} utc Timestamp in UTC
	 * @returns {Date} the date
	 */
	function toStandardDate(utc) {
	    return new Date(utc);
	}
	/**
	 * Shortcut for creating a new StandardDate
	 * @param date
	 * @returns {Date} the standard date
	 */
	function newDate(date) {
	    return new Date(date);
	}
	/**
	 * Get the total number of nanoseconds from the milliseconds of the given standard JavaScript date and optional nanosecond part.
	 * @param {global.Date} standardDate the standard JavaScript date.
	 * @param {Integer|number|bigint|undefined} nanoseconds the optional number of nanoseconds.
	 * @return {Integer|number|bigint} the total amount of nanoseconds.
	 */
	function totalNanoseconds(standardDate, nanoseconds) {
	    nanoseconds = nanoseconds ?? 0;
	    const nanosFromMillis = standardDate.getMilliseconds() * NANOS_PER_MILLISECOND;
	    return add(nanoseconds, nanosFromMillis);
	}
	/**
	 * Get the time zone offset in seconds from the given standard JavaScript date.
	 *
	 * <b>Implementation note:</b>
	 * Time zone offset returned by the standard JavaScript date is the difference, in minutes, from local time to UTC.
	 * So positive value means offset is behind UTC and negative value means it is ahead.
	 * For Neo4j temporal types, like `Time` or `DateTime` offset is in seconds and represents difference from UTC to local time.
	 * This is different from standard JavaScript dates and that's why implementation negates the returned value.
	 *
	 * @param {global.Date} standardDate the standard JavaScript date.
	 * @return {number} the time zone offset in seconds.
	 */
	function timeZoneOffsetInSeconds(standardDate) {
	    const secondsPortion = standardDate.getSeconds() >= standardDate.getUTCSeconds()
	        ? standardDate.getSeconds() - standardDate.getUTCSeconds()
	        : standardDate.getSeconds() - standardDate.getUTCSeconds() + 60;
	    const offsetInMinutes = standardDate.getTimezoneOffset();
	    if (offsetInMinutes === 0) {
	        return 0 + secondsPortion;
	    }
	    return -1 * offsetInMinutes * SECONDS_PER_MINUTE + secondsPortion;
	}
	/**
	 * Assert that the year value is valid.
	 * @param {Integer|number} year the value to check.
	 * @return {Integer|number} the value of the year if it is valid. Exception is thrown otherwise.
	 */
	function assertValidYear(year) {
	    return assertValidTemporalValue(year, YEAR_RANGE, 'Year');
	}
	/**
	 * Assert that the month value is valid.
	 * @param {Integer|number} month the value to check.
	 * @return {Integer|number} the value of the month if it is valid. Exception is thrown otherwise.
	 */
	function assertValidMonth(month) {
	    return assertValidTemporalValue(month, MONTH_OF_YEAR_RANGE, 'Month');
	}
	/**
	 * Assert that the day value is valid.
	 * @param {Integer|number} day the value to check.
	 * @return {Integer|number} the value of the day if it is valid. Exception is thrown otherwise.
	 */
	function assertValidDay(day) {
	    return assertValidTemporalValue(day, DAY_OF_MONTH_RANGE, 'Day');
	}
	/**
	 * Assert that the hour value is valid.
	 * @param {Integer|number} hour the value to check.
	 * @return {Integer|number} the value of the hour if it is valid. Exception is thrown otherwise.
	 */
	function assertValidHour(hour) {
	    return assertValidTemporalValue(hour, HOUR_OF_DAY_RANGE, 'Hour');
	}
	/**
	 * Assert that the minute value is valid.
	 * @param {Integer|number} minute the value to check.
	 * @return {Integer|number} the value of the minute if it is valid. Exception is thrown otherwise.
	 */
	function assertValidMinute(minute) {
	    return assertValidTemporalValue(minute, MINUTE_OF_HOUR_RANGE, 'Minute');
	}
	/**
	 * Assert that the second value is valid.
	 * @param {Integer|number} second the value to check.
	 * @return {Integer|number} the value of the second if it is valid. Exception is thrown otherwise.
	 */
	function assertValidSecond(second) {
	    return assertValidTemporalValue(second, SECOND_OF_MINUTE_RANGE, 'Second');
	}
	/**
	 * Assert that the nanosecond value is valid.
	 * @param {Integer|number} nanosecond the value to check.
	 * @return {Integer|number} the value of the nanosecond if it is valid. Exception is thrown otherwise.
	 */
	function assertValidNanosecond(nanosecond) {
	    return assertValidTemporalValue(nanosecond, NANOSECOND_OF_SECOND_RANGE, 'Nanosecond');
	}
	function assertValidZoneId(fieldName, zoneId) {
	    try {
	        Intl.DateTimeFormat(undefined, { timeZone: zoneId });
	    }
	    catch (e) {
	        throw newError(`${fieldName} is expected to be a valid ZoneId but was: "${zoneId}"`);
	    }
	}
	/**
	 * Check if the given value is of expected type and is in the expected range.
	 * @param {Integer|number} value the value to check.
	 * @param {ValueRange} range the range.
	 * @param {string} name the name of the value.
	 * @return {Integer|number} the value if valid. Exception is thrown otherwise.
	 */
	function assertValidTemporalValue(value, range, name) {
	    assertNumberOrInteger(value, name);
	    if (!range.contains(value)) {
	        throw newError(`${name} is expected to be in range ${range.toString()} but was: ${value.toString()}`);
	    }
	    return value;
	}
	/**
	 * Converts given local time into a single integer representing this same time in seconds of the day. Nanoseconds are skipped.
	 * @param {Integer|number|string} hour the hour of the local time.
	 * @param {Integer|number|string} minute the minute of the local time.
	 * @param {Integer|number|string} second the second of the local time.
	 * @return {Integer} seconds representing the given local time.
	 */
	function localTimeToSecondOfDay(hour, minute, second) {
	    hour = int(hour);
	    minute = int(minute);
	    second = int(second);
	    let totalSeconds = hour.multiply(SECONDS_PER_HOUR);
	    totalSeconds = totalSeconds.add(minute.multiply(SECONDS_PER_MINUTE));
	    return totalSeconds.add(second);
	}
	/**
	 * Check if given year is a leap year. Uses algorithm described here {@link https://en.wikipedia.org/wiki/Leap_year#Algorithm}.
	 * @param {Integer|number|string} year the year to check. Will be converted to {@link Integer} for all calculations.
	 * @return {boolean} `true` if given year is a leap year, `false` otherwise.
	 */
	function isLeapYear(year) {
	    year = int(year);
	    if (!year.modulo(4).equals(0)) {
	        return false;
	    }
	    else if (!year.modulo(100).equals(0)) {
	        return true;
	    }
	    else if (!year.modulo(400).equals(0)) {
	        return false;
	    }
	    else {
	        return true;
	    }
	}
	/**
	 * @param {Integer|number|string} x the divident.
	 * @param {Integer|number|string} y the divisor.
	 * @return {Integer} the result.
	 */
	function floorDiv$1(x, y) {
	    x = int(x);
	    y = int(y);
	    let result = x.div(y);
	    if (x.isPositive() !== y.isPositive() && result.multiply(y).notEquals(x)) {
	        result = result.subtract(1);
	    }
	    return result;
	}
	/**
	 * @param {Integer|number|string} x the divident.
	 * @param {Integer|number|string} y the divisor.
	 * @return {Integer} the result.
	 */
	function floorMod$1(x, y) {
	    x = int(x);
	    y = int(y);
	    return x.subtract(floorDiv$1(x, y).multiply(y));
	}
	/**
	 * @param {Integer|number|string} seconds the number of seconds to format.
	 * @param {Integer|number|string} nanoseconds the number of nanoseconds to format.
	 * @return {string} formatted value.
	 */
	function formatSecondsAndNanosecondsForDuration(seconds, nanoseconds) {
	    seconds = int(seconds);
	    nanoseconds = int(nanoseconds);
	    let secondsString;
	    let nanosecondsString;
	    const secondsNegative = seconds.isNegative();
	    const nanosecondsGreaterThanZero = nanoseconds.greaterThan(0);
	    if (secondsNegative && nanosecondsGreaterThanZero) {
	        if (seconds.equals(-1)) {
	            secondsString = '-0';
	        }
	        else {
	            secondsString = seconds.add(1).toString();
	        }
	    }
	    else {
	        secondsString = seconds.toString();
	    }
	    if (nanosecondsGreaterThanZero) {
	        if (secondsNegative) {
	            nanosecondsString = formatNanosecond(nanoseconds
	                .negate()
	                .add(2 * NANOS_PER_SECOND$1)
	                .modulo(NANOS_PER_SECOND$1));
	        }
	        else {
	            nanosecondsString = formatNanosecond(nanoseconds.add(NANOS_PER_SECOND$1).modulo(NANOS_PER_SECOND$1));
	        }
	    }
	    return nanosecondsString != null ? secondsString + nanosecondsString : secondsString;
	}
	/**
	 * @param {Integer|number|string} value the number of nanoseconds to format.
	 * @return {string} formatted and possibly left-padded nanoseconds part as string.
	 */
	function formatNanosecond(value) {
	    value = int(value);
	    return value.equals(0) ? '' : '.' + formatNumber(value, 9);
	}
	/**
	 *
	 * @param {Integer|number|string} year The year to be formatted
	 * @return {string} formatted year
	 */
	function formatYear(year) {
	    const yearInteger = int(year);
	    if (yearInteger.isNegative() || yearInteger.greaterThan(9999)) {
	        return formatNumber(yearInteger, 6, { usePositiveSign: true });
	    }
	    return formatNumber(yearInteger, 4);
	}
	/**
	 * @param {Integer|number|string} num the number to format.
	 * @param {number} [stringLength=undefined] the string length to left-pad to.
	 * @return {string} formatted and possibly left-padded number as string.
	 */
	function formatNumber(num, stringLength, params) {
	    num = int(num);
	    const isNegative = num.isNegative();
	    if (isNegative) {
	        num = num.negate();
	    }
	    let numString = num.toString();
	    if (stringLength != null) {
	        // left pad the string with zeroes
	        while (numString.length < stringLength) {
	            numString = '0' + numString;
	        }
	    }
	    if (isNegative) {
	        return '-' + numString;
	    }
	    else if (params?.usePositiveSign === true) {
	        return '+' + numString;
	    }
	    return numString;
	}
	function add(x, y) {
	    if (x instanceof Integer) {
	        return x.add(y);
	    }
	    else if (typeof x === 'bigint') {
	        return x + BigInt(y);
	    }
	    return x + y;
	}

	var temporalUtil = /*#__PURE__*/Object.freeze({
		__proto__: null,
		YEAR_RANGE: YEAR_RANGE,
		MONTH_OF_YEAR_RANGE: MONTH_OF_YEAR_RANGE,
		DAY_OF_MONTH_RANGE: DAY_OF_MONTH_RANGE,
		HOUR_OF_DAY_RANGE: HOUR_OF_DAY_RANGE,
		MINUTE_OF_HOUR_RANGE: MINUTE_OF_HOUR_RANGE,
		SECOND_OF_MINUTE_RANGE: SECOND_OF_MINUTE_RANGE,
		NANOSECOND_OF_SECOND_RANGE: NANOSECOND_OF_SECOND_RANGE,
		MINUTES_PER_HOUR: MINUTES_PER_HOUR,
		SECONDS_PER_MINUTE: SECONDS_PER_MINUTE,
		SECONDS_PER_HOUR: SECONDS_PER_HOUR,
		NANOS_PER_SECOND: NANOS_PER_SECOND$1,
		NANOS_PER_MILLISECOND: NANOS_PER_MILLISECOND,
		NANOS_PER_MINUTE: NANOS_PER_MINUTE$1,
		NANOS_PER_HOUR: NANOS_PER_HOUR$1,
		DAYS_0000_TO_1970: DAYS_0000_TO_1970$1,
		DAYS_PER_400_YEAR_CYCLE: DAYS_PER_400_YEAR_CYCLE$1,
		SECONDS_PER_DAY: SECONDS_PER_DAY$1,
		normalizeSecondsForDuration: normalizeSecondsForDuration,
		normalizeNanosecondsForDuration: normalizeNanosecondsForDuration,
		localTimeToNanoOfDay: localTimeToNanoOfDay$1,
		localDateTimeToEpochSecond: localDateTimeToEpochSecond$2,
		dateToEpochDay: dateToEpochDay$1,
		durationToIsoString: durationToIsoString,
		timeToIsoString: timeToIsoString,
		timeZoneOffsetToIsoString: timeZoneOffsetToIsoString,
		dateToIsoString: dateToIsoString,
		isoStringToStandardDate: isoStringToStandardDate,
		toStandardDate: toStandardDate,
		newDate: newDate,
		totalNanoseconds: totalNanoseconds,
		timeZoneOffsetInSeconds: timeZoneOffsetInSeconds,
		assertValidYear: assertValidYear,
		assertValidMonth: assertValidMonth,
		assertValidDay: assertValidDay,
		assertValidHour: assertValidHour,
		assertValidMinute: assertValidMinute,
		assertValidSecond: assertValidSecond,
		assertValidNanosecond: assertValidNanosecond,
		assertValidZoneId: assertValidZoneId,
		floorDiv: floorDiv$1,
		floorMod: floorMod$1
	});

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
	const IDENTIFIER_PROPERTY_ATTRIBUTES$1 = {
	    value: true,
	    enumerable: false,
	    configurable: false,
	    writable: false
	};
	const DURATION_IDENTIFIER_PROPERTY = '__isDuration__';
	const LOCAL_TIME_IDENTIFIER_PROPERTY = '__isLocalTime__';
	const TIME_IDENTIFIER_PROPERTY = '__isTime__';
	const DATE_IDENTIFIER_PROPERTY = '__isDate__';
	const LOCAL_DATE_TIME_IDENTIFIER_PROPERTY = '__isLocalDateTime__';
	const DATE_TIME_IDENTIFIER_PROPERTY = '__isDateTime__';
	/**
	 * Represents an ISO 8601 duration. Contains both date-based values (years, months, days) and time-based values (seconds, nanoseconds).
	 * Created `Duration` objects are frozen with `Object.freeze()` in constructor and thus immutable.
	 */
	class Duration {
	    months;
	    days;
	    seconds;
	    nanoseconds;
	    /**
	     * @constructor
	     * @param {NumberOrInteger} months - The number of months for the new duration.
	     * @param {NumberOrInteger} days - The number of days for the new duration.
	     * @param {NumberOrInteger} seconds - The number of seconds for the new duration.
	     * @param {NumberOrInteger} nanoseconds - The number of nanoseconds for the new duration.
	     */
	    constructor(months, days, seconds, nanoseconds) {
	        /**
	         * The number of months.
	         * @type {NumberOrInteger}
	         */
	        this.months = assertNumberOrInteger(months, 'Months');
	        /**
	         * The number of days.
	         * @type {NumberOrInteger}
	         */
	        this.days = assertNumberOrInteger(days, 'Days');
	        assertNumberOrInteger(seconds, 'Seconds');
	        assertNumberOrInteger(nanoseconds, 'Nanoseconds');
	        /**
	         * The number of seconds.
	         * @type {NumberOrInteger}
	         */
	        this.seconds = normalizeSecondsForDuration(seconds, nanoseconds);
	        /**
	         * The number of nanoseconds.
	         * @type {NumberOrInteger}
	         */
	        this.nanoseconds = normalizeNanosecondsForDuration(nanoseconds);
	        Object.freeze(this);
	    }
	    /**
	     * @ignore
	     */
	    toString() {
	        return durationToIsoString(this.months, this.days, this.seconds, this.nanoseconds);
	    }
	}
	Object.defineProperty(Duration.prototype, DURATION_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES$1);
	/**
	 * Test if given object is an instance of {@link Duration} class.
	 * @param {Object} obj the object to test.
	 * @return {boolean} `true` if given object is a {@link Duration}, `false` otherwise.
	 */
	function isDuration(obj) {
	    return hasIdentifierProperty$1(obj, DURATION_IDENTIFIER_PROPERTY);
	}
	/**
	 * Represents an instant capturing the time of day, but not the date, nor the timezone.
	 * Created {@link LocalTime} objects are frozen with `Object.freeze()` in constructor and thus immutable.
	 */
	class LocalTime {
	    hour;
	    minute;
	    second;
	    nanosecond;
	    /**
	     * @constructor
	     * @param {NumberOrInteger} hour - The hour for the new local time.
	     * @param {NumberOrInteger} minute - The minute for the new local time.
	     * @param {NumberOrInteger} second - The second for the new local time.
	     * @param {NumberOrInteger} nanosecond - The nanosecond for the new local time.
	     */
	    constructor(hour, minute, second, nanosecond) {
	        /**
	         * The hour.
	         * @type {NumberOrInteger}
	         */
	        this.hour = assertValidHour(hour);
	        /**
	         * The minute.
	         * @type {NumberOrInteger}
	         */
	        this.minute = assertValidMinute(minute);
	        /**
	         * The second.
	         * @type {NumberOrInteger}
	         */
	        this.second = assertValidSecond(second);
	        /**
	         * The nanosecond.
	         * @type {NumberOrInteger}
	         */
	        this.nanosecond = assertValidNanosecond(nanosecond);
	        Object.freeze(this);
	    }
	    /**
	     * Create a {@link LocalTime} object from the given standard JavaScript `Date` and optional nanoseconds.
	     * Year, month, day and time zone offset components of the given date are ignored.
	     * @param {global.Date} standardDate - The standard JavaScript date to convert.
	     * @param {NumberOrInteger|undefined} nanosecond - The optional amount of nanoseconds.
	     * @return {LocalTime<number>} New LocalTime.
	     */
	    static fromStandardDate(standardDate, nanosecond) {
	        verifyStandardDateAndNanos(standardDate, nanosecond);
	        const totalNanoseconds$1 = totalNanoseconds(standardDate, nanosecond);
	        return new LocalTime(standardDate.getHours(), standardDate.getMinutes(), standardDate.getSeconds(), totalNanoseconds$1 instanceof Integer
	            ? totalNanoseconds$1.toInt()
	            : typeof totalNanoseconds$1 === 'bigint'
	                ? int(totalNanoseconds$1).toInt()
	                : totalNanoseconds$1);
	    }
	    /**
	     * @ignore
	     */
	    toString() {
	        return timeToIsoString(this.hour, this.minute, this.second, this.nanosecond);
	    }
	}
	Object.defineProperty(LocalTime.prototype, LOCAL_TIME_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES$1);
	/**
	 * Test if given object is an instance of {@link LocalTime} class.
	 * @param {Object} obj the object to test.
	 * @return {boolean} `true` if given object is a {@link LocalTime}, `false` otherwise.
	 */
	function isLocalTime(obj) {
	    return hasIdentifierProperty$1(obj, LOCAL_TIME_IDENTIFIER_PROPERTY);
	}
	/**
	 * Represents an instant capturing the time of day, and the timezone offset in seconds, but not the date.
	 * Created {@link Time} objects are frozen with `Object.freeze()` in constructor and thus immutable.
	 */
	class Time {
	    hour;
	    minute;
	    second;
	    nanosecond;
	    timeZoneOffsetSeconds;
	    /**
	     * @constructor
	     * @param {NumberOrInteger} hour - The hour for the new local time.
	     * @param {NumberOrInteger} minute - The minute for the new local time.
	     * @param {NumberOrInteger} second - The second for the new local time.
	     * @param {NumberOrInteger} nanosecond - The nanosecond for the new local time.
	     * @param {NumberOrInteger} timeZoneOffsetSeconds - The time zone offset in seconds. Value represents the difference, in seconds, from UTC to local time.
	     * This is different from standard JavaScript `Date.getTimezoneOffset()` which is the difference, in minutes, from local time to UTC.
	     */
	    constructor(hour, minute, second, nanosecond, timeZoneOffsetSeconds) {
	        /**
	         * The hour.
	         * @type {NumberOrInteger}
	         */
	        this.hour = assertValidHour(hour);
	        /**
	         * The minute.
	         * @type {NumberOrInteger}
	         */
	        this.minute = assertValidMinute(minute);
	        /**
	         * The second.
	         * @type {NumberOrInteger}
	         */
	        this.second = assertValidSecond(second);
	        /**
	         * The nanosecond.
	         * @type {NumberOrInteger}
	         */
	        this.nanosecond = assertValidNanosecond(nanosecond);
	        /**
	         * The time zone offset in seconds.
	         * @type {NumberOrInteger}
	         */
	        this.timeZoneOffsetSeconds = assertNumberOrInteger(timeZoneOffsetSeconds, 'Time zone offset in seconds');
	        Object.freeze(this);
	    }
	    /**
	     * Create a {@link Time} object from the given standard JavaScript `Date` and optional nanoseconds.
	     * Year, month and day components of the given date are ignored.
	     * @param {global.Date} standardDate - The standard JavaScript date to convert.
	     * @param {NumberOrInteger|undefined} nanosecond - The optional amount of nanoseconds.
	     * @return {Time<number>} New Time.
	     */
	    static fromStandardDate(standardDate, nanosecond) {
	        verifyStandardDateAndNanos(standardDate, nanosecond);
	        return new Time(standardDate.getHours(), standardDate.getMinutes(), standardDate.getSeconds(), toNumber(totalNanoseconds(standardDate, nanosecond)), timeZoneOffsetInSeconds(standardDate));
	    }
	    /**
	     * @ignore
	     */
	    toString() {
	        return (timeToIsoString(this.hour, this.minute, this.second, this.nanosecond) + timeZoneOffsetToIsoString(this.timeZoneOffsetSeconds));
	    }
	}
	Object.defineProperty(Time.prototype, TIME_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES$1);
	/**
	 * Test if given object is an instance of {@link Time} class.
	 * @param {Object} obj the object to test.
	 * @return {boolean} `true` if given object is a {@link Time}, `false` otherwise.
	 */
	function isTime(obj) {
	    return hasIdentifierProperty$1(obj, TIME_IDENTIFIER_PROPERTY);
	}
	/**
	 * Represents an instant capturing the date, but not the time, nor the timezone.
	 * Created {@link Date} objects are frozen with `Object.freeze()` in constructor and thus immutable.
	 */
	class Date$1 {
	    year;
	    month;
	    day;
	    /**
	     * @constructor
	     * @param {NumberOrInteger} year - The year for the new local date.
	     * @param {NumberOrInteger} month - The month for the new local date.
	     * @param {NumberOrInteger} day - The day for the new local date.
	     */
	    constructor(year, month, day) {
	        /**
	         * The year.
	         * @type {NumberOrInteger}
	         */
	        this.year = assertValidYear(year);
	        /**
	         * The month.
	         * @type {NumberOrInteger}
	         */
	        this.month = assertValidMonth(month);
	        /**
	         * The day.
	         * @type {NumberOrInteger}
	         */
	        this.day = assertValidDay(day);
	        Object.freeze(this);
	    }
	    /**
	     * Create a {@link Date} object from the given standard JavaScript `Date`.
	     * Hour, minute, second, millisecond and time zone offset components of the given date are ignored.
	     * @param {global.Date} standardDate - The standard JavaScript date to convert.
	     * @return {Date} New Date.
	     */
	    static fromStandardDate(standardDate) {
	        verifyStandardDateAndNanos(standardDate);
	        return new Date$1(standardDate.getFullYear(), standardDate.getMonth() + 1, standardDate.getDate());
	    }
	    /**
	     * Convert date to standard JavaScript `Date`.
	     *
	     * The time component of the returned `Date` is set to midnight
	     * and the time zone is set to UTC.
	     *
	     * @returns {StandardDate} Standard JavaScript `Date` at `00:00:00.000` UTC.
	     */
	    toStandardDate() {
	        return isoStringToStandardDate(this.toString());
	    }
	    /**
	     * @ignore
	     */
	    toString() {
	        return dateToIsoString(this.year, this.month, this.day);
	    }
	}
	Object.defineProperty(Date$1.prototype, DATE_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES$1);
	/**
	 * Test if given object is an instance of {@link Date} class.
	 * @param {Object} obj - The object to test.
	 * @return {boolean} `true` if given object is a {@link Date}, `false` otherwise.
	 */
	function isDate(obj) {
	    return hasIdentifierProperty$1(obj, DATE_IDENTIFIER_PROPERTY);
	}
	/**
	 * Represents an instant capturing the date and the time, but not the timezone.
	 * Created {@link LocalDateTime} objects are frozen with `Object.freeze()` in constructor and thus immutable.
	 */
	class LocalDateTime {
	    year;
	    month;
	    day;
	    hour;
	    minute;
	    second;
	    nanosecond;
	    /**
	     * @constructor
	     * @param {NumberOrInteger} year - The year for the new local date.
	     * @param {NumberOrInteger} month - The month for the new local date.
	     * @param {NumberOrInteger} day - The day for the new local date.
	     * @param {NumberOrInteger} hour - The hour for the new local time.
	     * @param {NumberOrInteger} minute - The minute for the new local time.
	     * @param {NumberOrInteger} second - The second for the new local time.
	     * @param {NumberOrInteger} nanosecond - The nanosecond for the new local time.
	     */
	    constructor(year, month, day, hour, minute, second, nanosecond) {
	        /**
	         * The year.
	         * @type {NumberOrInteger}
	         */
	        this.year = assertValidYear(year);
	        /**
	         * The month.
	         * @type {NumberOrInteger}
	         */
	        this.month = assertValidMonth(month);
	        /**
	         * The day.
	         * @type {NumberOrInteger}
	         */
	        this.day = assertValidDay(day);
	        /**
	         * The hour.
	         * @type {NumberOrInteger}
	         */
	        this.hour = assertValidHour(hour);
	        /**
	         * The minute.
	         * @type {NumberOrInteger}
	         */
	        this.minute = assertValidMinute(minute);
	        /**
	         * The second.
	         * @type {NumberOrInteger}
	         */
	        this.second = assertValidSecond(second);
	        /**
	         * The nanosecond.
	         * @type {NumberOrInteger}
	         */
	        this.nanosecond = assertValidNanosecond(nanosecond);
	        Object.freeze(this);
	    }
	    /**
	     * Create a {@link LocalDateTime} object from the given standard JavaScript `Date` and optional nanoseconds.
	     * Time zone offset component of the given date is ignored.
	     * @param {global.Date} standardDate - The standard JavaScript date to convert.
	     * @param {NumberOrInteger|undefined} nanosecond - The optional amount of nanoseconds.
	     * @return {LocalDateTime} New LocalDateTime.
	     */
	    static fromStandardDate(standardDate, nanosecond) {
	        verifyStandardDateAndNanos(standardDate, nanosecond);
	        return new LocalDateTime(standardDate.getFullYear(), standardDate.getMonth() + 1, standardDate.getDate(), standardDate.getHours(), standardDate.getMinutes(), standardDate.getSeconds(), toNumber(totalNanoseconds(standardDate, nanosecond)));
	    }
	    /**
	     * Convert date to standard JavaScript `Date`.
	     *
	     * @returns {StandardDate} Standard JavaScript `Date` at the local timezone
	     */
	    toStandardDate() {
	        return isoStringToStandardDate(this.toString());
	    }
	    /**
	     * @ignore
	     */
	    toString() {
	        return localDateTimeToString(this.year, this.month, this.day, this.hour, this.minute, this.second, this.nanosecond);
	    }
	}
	Object.defineProperty(LocalDateTime.prototype, LOCAL_DATE_TIME_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES$1);
	/**
	 * Test if given object is an instance of {@link LocalDateTime} class.
	 * @param {Object} obj - The object to test.
	 * @return {boolean} `true` if given object is a {@link LocalDateTime}, `false` otherwise.
	 */
	function isLocalDateTime(obj) {
	    return hasIdentifierProperty$1(obj, LOCAL_DATE_TIME_IDENTIFIER_PROPERTY);
	}
	/**
	 * Represents an instant capturing the date, the time and the timezone identifier.
	 * Created {@ DateTime} objects are frozen with `Object.freeze()` in constructor and thus immutable.
	 */
	class DateTime {
	    year;
	    month;
	    day;
	    hour;
	    minute;
	    second;
	    nanosecond;
	    timeZoneOffsetSeconds;
	    timeZoneId;
	    /**
	     * @constructor
	     * @param {NumberOrInteger} year - The year for the new date-time.
	     * @param {NumberOrInteger} month - The month for the new date-time.
	     * @param {NumberOrInteger} day - The day for the new date-time.
	     * @param {NumberOrInteger} hour - The hour for the new date-time.
	     * @param {NumberOrInteger} minute - The minute for the new date-time.
	     * @param {NumberOrInteger} second - The second for the new date-time.
	     * @param {NumberOrInteger} nanosecond - The nanosecond for the new date-time.
	     * @param {NumberOrInteger} timeZoneOffsetSeconds - The time zone offset in seconds. Either this argument or `timeZoneId` should be defined.
	     * Value represents the difference, in seconds, from UTC to local time.
	     * This is different from standard JavaScript `Date.getTimezoneOffset()` which is the difference, in minutes, from local time to UTC.
	     * @param {string|null} timeZoneId - The time zone id for the new date-time. Either this argument or `timeZoneOffsetSeconds` should be defined.
	     */
	    constructor(year, month, day, hour, minute, second, nanosecond, timeZoneOffsetSeconds, timeZoneId) {
	        /**
	         * The year.
	         * @type {NumberOrInteger}
	         */
	        this.year = assertValidYear(year);
	        /**
	         * The month.
	         * @type {NumberOrInteger}
	         */
	        this.month = assertValidMonth(month);
	        /**
	         * The day.
	         * @type {NumberOrInteger}
	         */
	        this.day = assertValidDay(day);
	        /**
	         * The hour.
	         * @type {NumberOrInteger}
	         */
	        this.hour = assertValidHour(hour);
	        /**
	         * The minute.
	         * @type {NumberOrInteger}
	         */
	        this.minute = assertValidMinute(minute);
	        /**
	         * The second.
	         * @type {NumberOrInteger}
	         */
	        this.second = assertValidSecond(second);
	        /**
	         * The nanosecond.
	         * @type {NumberOrInteger}
	         */
	        this.nanosecond = assertValidNanosecond(nanosecond);
	        const [offset, id] = verifyTimeZoneArguments(timeZoneOffsetSeconds, timeZoneId);
	        /**
	         * The time zone offset in seconds.
	         *
	         * *Either this or {@link timeZoneId} is defined.*
	         *
	         * @type {NumberOrInteger}
	         */
	        this.timeZoneOffsetSeconds = offset;
	        /**
	         * The time zone id.
	         *
	         * *Either this or {@link timeZoneOffsetSeconds} is defined.*
	         *
	         * @type {string}
	         */
	        this.timeZoneId = id ?? undefined;
	        Object.freeze(this);
	    }
	    /**
	     * Create a {@link DateTime} object from the given standard JavaScript `Date` and optional nanoseconds.
	     * @param {global.Date} standardDate - The standard JavaScript date to convert.
	     * @param {NumberOrInteger|undefined} nanosecond - The optional amount of nanoseconds.
	     * @return {DateTime} New DateTime.
	     */
	    static fromStandardDate(standardDate, nanosecond) {
	        verifyStandardDateAndNanos(standardDate, nanosecond);
	        return new DateTime(standardDate.getFullYear(), standardDate.getMonth() + 1, standardDate.getDate(), standardDate.getHours(), standardDate.getMinutes(), standardDate.getSeconds(), toNumber(totalNanoseconds(standardDate, nanosecond)), timeZoneOffsetInSeconds(standardDate), null /* no time zone id */);
	    }
	    /**
	     * Convert date to standard JavaScript `Date`.
	     *
	     * @returns {StandardDate} Standard JavaScript `Date` at the defined time zone offset
	     * @throws {Error} If the time zone offset is not defined in the object.
	     */
	    toStandardDate() {
	        return toStandardDate(this._toUTC());
	    }
	    /**
	     * @ignore
	     */
	    toString() {
	        const localDateTimeStr = localDateTimeToString(this.year, this.month, this.day, this.hour, this.minute, this.second, this.nanosecond);
	        const timeOffset = this.timeZoneOffsetSeconds != null
	            ? timeZoneOffsetToIsoString(this.timeZoneOffsetSeconds ?? 0)
	            : '';
	        const timeZoneStr = this.timeZoneId != null
	            ? `[${this.timeZoneId}]`
	            : '';
	        return localDateTimeStr + timeOffset + timeZoneStr;
	    }
	    /**
	     * @private
	     * @returns {number}
	     */
	    _toUTC() {
	        if (this.timeZoneOffsetSeconds === undefined) {
	            throw new Error('Requires DateTime created with time zone offset');
	        }
	        const epochSecond = localDateTimeToEpochSecond$2(this.year, this.month, this.day, this.hour, this.minute, this.second, this.nanosecond);
	        const utcSecond = epochSecond.subtract(this.timeZoneOffsetSeconds ?? 0);
	        return int(utcSecond)
	            .multiply(1000)
	            .add(int(this.nanosecond).div(1000000))
	            .toNumber();
	    }
	}
	Object.defineProperty(DateTime.prototype, DATE_TIME_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES$1);
	/**
	 * Test if given object is an instance of {@link DateTime} class.
	 * @param {Object} obj - The object to test.
	 * @return {boolean} `true` if given object is a {@link DateTime}, `false` otherwise.
	 */
	function isDateTime(obj) {
	    return hasIdentifierProperty$1(obj, DATE_TIME_IDENTIFIER_PROPERTY);
	}
	function hasIdentifierProperty$1(obj, property) {
	    return obj != null && obj[property] === true;
	}
	function localDateTimeToString(year, month, day, hour, minute, second, nanosecond) {
	    return (dateToIsoString(year, month, day) +
	        'T' +
	        timeToIsoString(hour, minute, second, nanosecond));
	}
	/**
	 * @private
	 * @param {NumberOrInteger} timeZoneOffsetSeconds
	 * @param {string | null } timeZoneId
	 * @returns {Array<NumberOrInteger | undefined | null, string | undefined | null>}
	 */
	function verifyTimeZoneArguments(timeZoneOffsetSeconds, timeZoneId) {
	    const offsetDefined = timeZoneOffsetSeconds !== null && timeZoneOffsetSeconds !== undefined;
	    const idDefined = timeZoneId !== null && timeZoneId !== undefined && timeZoneId !== '';
	    if (!offsetDefined && !idDefined) {
	        throw newError(
	        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	        `Unable to create DateTime without either time zone offset or id. Please specify either of them. Given offset: ${timeZoneOffsetSeconds} and id: ${timeZoneId}`);
	    }
	    const result = [undefined, undefined];
	    if (offsetDefined) {
	        assertNumberOrInteger(timeZoneOffsetSeconds, 'Time zone offset in seconds');
	        result[0] = timeZoneOffsetSeconds;
	    }
	    if (idDefined) {
	        assertString$1(timeZoneId, 'Time zone ID');
	        assertValidZoneId('Time zone ID', timeZoneId);
	        result[1] = timeZoneId;
	    }
	    return result;
	}
	/**
	 * @private
	 * @param {StandardDate} standardDate
	 * @param {NumberOrInteger} nanosecond
	 * @returns {void}
	 */
	function verifyStandardDateAndNanos(standardDate, nanosecond) {
	    assertValidDate(standardDate, 'Standard date');
	    if (nanosecond !== null && nanosecond !== undefined) {
	        assertNumberOrInteger(nanosecond, 'Nanosecond');
	    }
	}

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
	function generateFieldLookup(keys) {
	    const lookup = {};
	    keys.forEach((name, idx) => {
	        lookup[name] = idx;
	    });
	    return lookup;
	}
	/**
	 * Records make up the contents of the {@link Result}, and is how you access
	 * the output of a query. A simple query might yield a result stream
	 * with a single record, for instance:
	 *
	 *     MATCH (u:User) RETURN u.name, u.age
	 *
	 * This returns a stream of records with two fields, named `u.name` and `u.age`,
	 * each record represents one user found by the query above. You can access
	 * the values of each field either by name:
	 *
	 *     record.get("u.name")
	 *
	 * Or by it's position:
	 *
	 *     record.get(0)
	 *
	 * @access public
	 */
	class Record {
	    keys;
	    length;
	    _fields;
	    _fieldLookup;
	    /**
	     * Create a new record object.
	     * @constructor
	     * @protected
	     * @param {string[]} keys An array of field keys, in the order the fields appear in the record
	     * @param {Array} fields An array of field values
	     * @param {Object} fieldLookup An object of fieldName -> value index, used to map
	     *                            field names to values. If this is null, one will be
	     *                            generated.
	     */
	    constructor(keys, fields, fieldLookup) {
	        /**
	         * Field keys, in the order the fields appear in the record.
	         * @type {string[]}
	         */
	        this.keys = keys;
	        /**
	         * Number of fields
	         * @type {Number}
	         */
	        this.length = keys.length;
	        this._fields = fields;
	        this._fieldLookup = fieldLookup ?? generateFieldLookup(keys);
	    }
	    /**
	     * Run the given function for each field in this record. The function
	     * will get three arguments - the value, the key and this record, in that
	     * order.
	     *
	     * @param {function(value: Object, key: string, record: Record)} visitor the function to apply to each field.
	     * @returns {void} Nothing
	     */
	    forEach(visitor) {
	        for (const [key, value] of this.entries()) {
	            visitor(value, key, this);
	        }
	    }
	    /**
	     * Run the given function for each field in this record. The function
	     * will get three arguments - the value, the key and this record, in that
	     * order.
	     *
	     * @param {function(value: Object, key: string, record: Record)} visitor the function to apply on each field
	     * and return a value that is saved to the returned Array.
	     *
	     * @returns {Array}
	     */
	    map(visitor) {
	        const resultArray = [];
	        for (const [key, value] of this.entries()) {
	            resultArray.push(visitor(value, key, this));
	        }
	        return resultArray;
	    }
	    /**
	     * Iterate over results. Each iteration will yield an array
	     * of exactly two items - the key, and the value (in order).
	     *
	     * @generator
	     * @returns {IterableIterator<Array>}
	     */
	    *entries() {
	        for (let i = 0; i < this.keys.length; i++) {
	            yield [this.keys[i], this._fields[i]];
	        }
	    }
	    /**
	     * Iterate over values.
	     *
	     * @generator
	     * @returns {IterableIterator<Object>}
	     */
	    *values() {
	        for (let i = 0; i < this.keys.length; i++) {
	            yield this._fields[i];
	        }
	    }
	    /**
	     * Iterate over values. Delegates to {@link Record#values}
	     *
	     * @generator
	     * @returns {IterableIterator<Object>}
	     */
	    *[Symbol.iterator]() {
	        for (let i = 0; i < this.keys.length; i++) {
	            yield this._fields[i];
	        }
	    }
	    /**
	     * Generates an object out of the current Record
	     *
	     * @returns {Object}
	     */
	    toObject() {
	        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	        const obj = {};
	        for (const [key, value] of this.entries()) {
	            obj[key] = value;
	        }
	        return obj;
	    }
	    /**
	     * Get a value from this record, either by index or by field key.
	     *
	     * @param {string|Number} key Field key, or the index of the field.
	     * @returns {*}
	     */
	    get(key) {
	        let index;
	        if (!(typeof key === 'number')) {
	            index = this._fieldLookup[key];
	            if (index === undefined) {
	                throw newError(`This record has no field with key '${key.toString()}', available keys are: [` +
	                    this.keys.toString() +
	                    '].');
	            }
	        }
	        else {
	            index = key;
	        }
	        if (index > this._fields.length - 1 || index < 0) {
	            throw newError("This record has no field with index '" +
	                index.toString() +
	                "'. Remember that indexes start at `0`, " +
	                'and make sure your query returns records in the shape you meant it to.');
	        }
	        return this._fields[index];
	    }
	    /**
	     * Check if a value from this record, either by index or by field key, exists.
	     *
	     * @param {string|Number} key Field key, or the index of the field.
	     * @returns {boolean}
	     */
	    has(key) {
	        // if key is a number, we check if it is in the _fields array
	        if (typeof key === 'number') {
	            return key >= 0 && key < this._fields.length;
	        }
	        // if it's not a number, we check _fieldLookup dictionary directly
	        return this._fieldLookup[key] !== undefined;
	    }
	}

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
	const POINT_IDENTIFIER_PROPERTY = '__isPoint__';
	/**
	 * Represents a single two or three-dimensional point in a particular coordinate reference system.
	 * Created `Point` objects are frozen with `Object.freeze()` in constructor and thus immutable.
	 */
	class Point {
	    srid;
	    x;
	    y;
	    z;
	    /**
	     * @constructor
	     * @param {T} srid - The coordinate reference system identifier.
	     * @param {number} x - The `x` coordinate of the point.
	     * @param {number} y - The `y` coordinate of the point.
	     * @param {number} [z=undefined] - The `z` coordinate of the point or `undefined` if point has 2 dimensions.
	     */
	    constructor(srid, x, y, z) {
	        /**
	         * The coordinate reference system identifier.
	         * @type {T}
	         */
	        this.srid = assertNumberOrInteger(srid, 'SRID');
	        /**
	         * The `x` coordinate of the point.
	         * @type {number}
	         */
	        this.x = assertNumber(x, 'X coordinate');
	        /**
	         * The `y` coordinate of the point.
	         * @type {number}
	         */
	        this.y = assertNumber(y, 'Y coordinate');
	        /**
	         * The `z` coordinate of the point or `undefined` if point is 2-dimensional.
	         * @type {number}
	         */
	        this.z = z === null || z === undefined ? z : assertNumber(z, 'Z coordinate');
	        Object.freeze(this);
	    }
	    /**
	     * @ignore
	     */
	    toString() {
	        return this.z != null && !isNaN(this.z)
	            ? `Point{srid=${formatAsFloat(this.srid)}, x=${formatAsFloat(this.x)}, y=${formatAsFloat(this.y)}, z=${formatAsFloat(this.z)}}`
	            : `Point{srid=${formatAsFloat(this.srid)}, x=${formatAsFloat(this.x)}, y=${formatAsFloat(this.y)}}`;
	    }
	}
	function formatAsFloat(number) {
	    return Number.isInteger(number) ? number.toString() + '.0' : number.toString();
	}
	Object.defineProperty(Point.prototype, POINT_IDENTIFIER_PROPERTY, {
	    value: true,
	    enumerable: false,
	    configurable: false,
	    writable: false
	});
	/**
	 * Test if given object is an instance of {@link Point} class.
	 * @param {Object} obj the object to test.
	 * @return {boolean} `true` if given object is a {@link Point}, `false` otherwise.
	 */
	function isPoint(obj) {
	    const anyObj = obj;
	    return obj != null && anyObj[POINT_IDENTIFIER_PROPERTY] === true;
	}

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
	 * A ResultSummary instance contains structured metadata for a {@link Result}.
	 * @access public
	 */
	class ResultSummary {
	    query;
	    queryType;
	    counters;
	    updateStatistics;
	    plan;
	    profile;
	    notifications;
	    server;
	    resultConsumedAfter;
	    resultAvailableAfter;
	    database;
	    /**
	     * @constructor
	     * @param {string} query - The query this summary is for
	     * @param {Object} parameters - Parameters for the query
	     * @param {Object} metadata - Query metadata
	     * @param {number|undefined} protocolVersion - Bolt Protocol Version
	     */
	    constructor(query, parameters, metadata, protocolVersion) {
	        /**
	         * The query and parameters this summary is for.
	         * @type {{text: string, parameters: Object}}
	         * @public
	         */
	        this.query = { text: query, parameters };
	        /**
	         * The type of query executed. Can be "r" for read-only query, "rw" for read-write query,
	         * "w" for write-only query and "s" for schema-write query.
	         * String constants are available in {@link queryType} object.
	         * @type {string}
	         * @public
	         */
	        this.queryType = metadata.type;
	        /**
	         * Counters for operations the query triggered.
	         * @type {QueryStatistics}
	         * @public
	         */
	        this.counters = new QueryStatistics(metadata.stats ?? {});
	        // for backwards compatibility, remove in future version
	        /**
	         * Use {@link ResultSummary.counters} instead.
	         * @type {QueryStatistics}
	         * @deprecated
	         */
	        this.updateStatistics = this.counters;
	        /**
	         * This describes how the database will execute the query.
	         * Query plan for the executed query if available, otherwise undefined.
	         * Will only be populated for queries that start with "EXPLAIN".
	         * @type {Plan|false}
	         * @public
	         */
	        this.plan =
	            metadata.plan != null || metadata.profile != null
	                ? new Plan(metadata.plan ?? metadata.profile)
	                : false;
	        /**
	         * This describes how the database did execute your query. This will contain detailed information about what
	         * each step of the plan did. Profiled query plan for the executed query if available, otherwise undefined.
	         * Will only be populated for queries that start with "PROFILE".
	         * @type {ProfiledPlan}
	         * @public
	         */
	        this.profile = metadata.profile != null ? new ProfiledPlan(metadata.profile) : false;
	        /**
	         * An array of notifications that might arise when executing the query. Notifications can be warnings about
	         * problematic queries or other valuable information that can be presented in a client. Unlike failures
	         * or errors, notifications do not affect the execution of a query.
	         * @type {Array<Notification>}
	         * @public
	         */
	        this.notifications = this._buildNotifications(metadata.notifications);
	        /**
	         * The basic information of the server where the result is obtained from.
	         * @type {ServerInfo}
	         * @public
	         */
	        this.server = new ServerInfo(metadata.server, protocolVersion);
	        /**
	         * The time it took the server to consume the result.
	         * @type {number}
	         * @public
	         */
	        this.resultConsumedAfter = metadata.result_consumed_after;
	        /**
	         * The time it took the server to make the result available for consumption in milliseconds.
	         * @type {number}
	         * @public
	         */
	        this.resultAvailableAfter = metadata.result_available_after;
	        /**
	         * The database name where this summary is obtained from.
	         * @type {{name: string}}
	         * @public
	         */
	        this.database = { name: metadata.db ?? null };
	    }
	    _buildNotifications(notifications) {
	        if (notifications == null) {
	            return [];
	        }
	        return notifications.map(function (n) {
	            return new Notification(n);
	        });
	    }
	    /**
	     * Check if the result summary has a plan
	     * @return {boolean}
	     */
	    hasPlan() {
	        return this.plan instanceof Plan;
	    }
	    /**
	     * Check if the result summary has a profile
	     * @return {boolean}
	     */
	    hasProfile() {
	        return this.profile instanceof ProfiledPlan;
	    }
	}
	/**
	 * Class for execution plan received by prepending Cypher with EXPLAIN.
	 * @access public
	 */
	class Plan {
	    operatorType;
	    identifiers;
	    arguments;
	    children;
	    /**
	     * Create a Plan instance
	     * @constructor
	     * @param {Object} plan - Object with plan data
	     */
	    constructor(plan) {
	        this.operatorType = plan.operatorType;
	        this.identifiers = plan.identifiers;
	        this.arguments = plan.args;
	        this.children = plan.children != null
	            ? plan.children.map((child) => new Plan(child))
	            : [];
	    }
	}
	/**
	 * Class for execution plan received by prepending Cypher with PROFILE.
	 * @access public
	 */
	class ProfiledPlan {
	    operatorType;
	    identifiers;
	    arguments;
	    dbHits;
	    rows;
	    pageCacheMisses;
	    pageCacheHits;
	    pageCacheHitRatio;
	    time;
	    children;
	    /**
	     * Create a ProfiledPlan instance
	     * @constructor
	     * @param {Object} profile - Object with profile data
	     */
	    constructor(profile) {
	        this.operatorType = profile.operatorType;
	        this.identifiers = profile.identifiers;
	        this.arguments = profile.args;
	        this.dbHits = valueOrDefault$1('dbHits', profile);
	        this.rows = valueOrDefault$1('rows', profile);
	        this.pageCacheMisses = valueOrDefault$1('pageCacheMisses', profile);
	        this.pageCacheHits = valueOrDefault$1('pageCacheHits', profile);
	        this.pageCacheHitRatio = valueOrDefault$1('pageCacheHitRatio', profile);
	        this.time = valueOrDefault$1('time', profile);
	        this.children = profile.children != null
	            ? profile.children.map((child) => new ProfiledPlan(child))
	            : [];
	    }
	    hasPageCacheStats() {
	        return (this.pageCacheMisses > 0 ||
	            this.pageCacheHits > 0 ||
	            this.pageCacheHitRatio > 0);
	    }
	}
	/**
	 * Stats Query statistics dictionary for a {@link QueryStatistics}
	 * @public
	 */
	class Stats {
	    nodesCreated;
	    nodesDeleted;
	    relationshipsCreated;
	    relationshipsDeleted;
	    propertiesSet;
	    labelsAdded;
	    labelsRemoved;
	    indexesAdded;
	    indexesRemoved;
	    constraintsAdded;
	    constraintsRemoved;
	    /**
	     * @constructor
	     * @private
	     */
	    constructor() {
	        /**
	         * nodes created
	         * @type {number}
	         * @public
	         */
	        this.nodesCreated = 0;
	        /**
	         * nodes deleted
	         * @type {number}
	         * @public
	         */
	        this.nodesDeleted = 0;
	        /**
	         * relationships created
	         * @type {number}
	         * @public
	         */
	        this.relationshipsCreated = 0;
	        /**
	         * relationships deleted
	         * @type {number}
	         * @public
	         */
	        this.relationshipsDeleted = 0;
	        /**
	         * properties set
	         * @type {number}
	         * @public
	         */
	        this.propertiesSet = 0;
	        /**
	         * labels added
	         * @type {number}
	         * @public
	         */
	        this.labelsAdded = 0;
	        /**
	         * labels removed
	         * @type {number}
	         * @public
	         */
	        this.labelsRemoved = 0;
	        /**
	         * indexes added
	         * @type {number}
	         * @public
	         */
	        this.indexesAdded = 0;
	        /**
	         * indexes removed
	         * @type {number}
	         * @public
	         */
	        this.indexesRemoved = 0;
	        /**
	         * constraints added
	         * @type {number}
	         * @public
	         */
	        this.constraintsAdded = 0;
	        /**
	         * constraints removed
	         * @type {number}
	         * @public
	         */
	        this.constraintsRemoved = 0;
	    }
	}
	/**
	 * Get statistical information for a {@link Result}.
	 * @access public
	 */
	class QueryStatistics {
	    _stats;
	    _systemUpdates;
	    _containsSystemUpdates;
	    _containsUpdates;
	    /**
	     * Structurize the statistics
	     * @constructor
	     * @param {Object} statistics - Result statistics
	     */
	    constructor(statistics) {
	        this._stats = {
	            nodesCreated: 0,
	            nodesDeleted: 0,
	            relationshipsCreated: 0,
	            relationshipsDeleted: 0,
	            propertiesSet: 0,
	            labelsAdded: 0,
	            labelsRemoved: 0,
	            indexesAdded: 0,
	            indexesRemoved: 0,
	            constraintsAdded: 0,
	            constraintsRemoved: 0
	        };
	        this._systemUpdates = 0;
	        Object.keys(statistics).forEach(index => {
	            // To camelCase
	            const camelCaseIndex = index.replace(/(-\w)/g, m => m[1].toUpperCase());
	            if (camelCaseIndex in this._stats) {
	                this._stats[camelCaseIndex] = intValue(statistics[index]);
	            }
	            else if (camelCaseIndex === 'systemUpdates') {
	                this._systemUpdates = intValue(statistics[index]);
	            }
	            else if (camelCaseIndex === 'containsSystemUpdates') {
	                this._containsSystemUpdates = statistics[index];
	            }
	            else if (camelCaseIndex === 'containsUpdates') {
	                this._containsUpdates = statistics[index];
	            }
	        });
	        this._stats = Object.freeze(this._stats);
	    }
	    /**
	     * Did the database get updated?
	     * @return {boolean}
	     */
	    containsUpdates() {
	        return this._containsUpdates !== undefined
	            ? this._containsUpdates
	            : (Object.keys(this._stats).reduce((last, current) => {
	                return last + this._stats[current];
	            }, 0) > 0);
	    }
	    /**
	     * Returns the query statistics updates in a dictionary.
	     * @returns {Stats}
	     */
	    updates() {
	        return this._stats;
	    }
	    /**
	     * Return true if the system database get updated, otherwise false
	     * @returns {boolean} - If the system database get updated or not.
	     */
	    containsSystemUpdates() {
	        return this._containsSystemUpdates !== undefined
	            ? this._containsSystemUpdates
	            : this._systemUpdates > 0;
	    }
	    /**
	     * @returns {number} - Number of system updates
	     */
	    systemUpdates() {
	        return this._systemUpdates;
	    }
	}
	/**
	 * @typedef {'WARNING' | 'INFORMATION' | 'UNKNOWN'} NotificationSeverityLevel
	 */
	/**
	 * Constants that represents the Severity level in the {@link Notification}
	 */
	const notificationSeverityLevel = {
	    WARNING: 'WARNING',
	    INFORMATION: 'INFORMATION',
	    UNKNOWN: 'UNKNOWN'
	};
	Object.freeze(notificationSeverityLevel);
	const severityLevels = Object.values(notificationSeverityLevel);
	/**
	 * @typedef {'HINT' | 'UNRECOGNIZED' | 'UNSUPPORTED' |'PERFORMANCE' | 'TOPOLOGY' | 'SECURITY' | 'DEPRECATION' | 'GENERIC' | 'UNKNOWN' } NotificationCategory
	 */
	/**
	 * Constants that represents the Category in the {@link Notification}
	 */
	const notificationCategory = {
	    HINT: 'HINT',
	    UNRECOGNIZED: 'UNRECOGNIZED',
	    UNSUPPORTED: 'UNSUPPORTED',
	    PERFORMANCE: 'PERFORMANCE',
	    DEPRECATION: 'DEPRECATION',
	    TOPOLOGY: 'TOPOLOGY',
	    SECURITY: 'SECURITY',
	    GENERIC: 'GENERIC',
	    UNKNOWN: 'UNKNOWN'
	};
	Object.freeze(notificationCategory);
	const categories = Object.values(notificationCategory);
	/**
	 * Class for Cypher notifications
	 * @access public
	 */
	class Notification {
	    code;
	    title;
	    description;
	    severity;
	    position;
	    severityLevel;
	    category;
	    rawSeverityLevel;
	    rawCategory;
	    /**
	     * Create a Notification instance
	     * @constructor
	     * @param {Object} notification - Object with notification data
	     */
	    constructor(notification) {
	        /**
	         * The code
	         * @type {string}
	         * @public
	         */
	        this.code = notification.code;
	        /**
	         * The title
	         * @type {string}
	         * @public
	         */
	        this.title = notification.title;
	        /**
	         * The description
	         * @type {string}
	         * @public
	         */
	        this.description = notification.description;
	        /**
	         * The raw severity
	         *
	         * Use {@link Notification#rawSeverityLevel} for the raw value or {@link Notification#severityLevel} for an enumerated value.
	         *
	         * @type {string}
	         * @public
	         * @deprecated This property will be removed in 6.0.
	         */
	        this.severity = notification.severity;
	        /**
	         * The position which the notification had occur.
	         *
	         * @type {NotificationPosition}
	         * @public
	         */
	        this.position = Notification._constructPosition(notification.position);
	        /**
	         * The severity level
	         *
	         * @type {NotificationSeverityLevel}
	         * @public
	         * @example
	         * const { summary } = await session.run("RETURN 1")
	         *
	         * for (const notification of summary.notifications) {
	         *     switch(notification.severityLevel) {
	         *         case neo4j.notificationSeverityLevel.INFORMATION: // or simply 'INFORMATION'
	         *             console.info(`${notification.title} - ${notification.description}`)
	         *             break
	         *         case neo4j.notificationSeverityLevel.WARNING: // or simply 'WARNING'
	         *             console.warn(`${notification.title} - ${notification.description}`)
	         *             break
	         *         case neo4j.notificationSeverityLevel.UNKNOWN: // or simply 'UNKNOWN'
	         *         default:
	         *             // the raw info came from the server could be found at notification.rawSeverityLevel
	         *             console.log(`${notification.title} - ${notification.description}`)
	         *             break
	         *     }
	         * }
	         */
	        this.severityLevel = severityLevels.includes(notification.severity)
	            ? notification.severity
	            : notificationSeverityLevel.UNKNOWN;
	        /**
	         * The severity level returned by the server without any validation.
	         *
	         * @type {string}
	         * @public
	         */
	        this.rawSeverityLevel = notification.severity;
	        /**
	         * The category
	         *
	         * @type {NotificationCategory}
	         * @public
	         * @example
	         * const { summary } = await session.run("RETURN 1")
	         *
	         * for (const notification of summary.notifications) {
	         *     switch(notification.category) {
	         *         case neo4j.notificationCategory.QUERY: // or simply 'QUERY'
	         *             console.info(`${notification.title} - ${notification.description}`)
	         *             break
	         *         case neo4j.notificationCategory.PERFORMANCE: // or simply 'PERFORMANCE'
	         *             console.warn(`${notification.title} - ${notification.description}`)
	         *             break
	         *         case neo4j.notificationCategory.UNKNOWN: // or simply 'UNKNOWN'
	         *         default:
	         *             // the raw info came from the server could be found at notification.rawCategory
	         *             console.log(`${notification.title} - ${notification.description}`)
	         *             break
	         *     }
	         * }
	         */
	        this.category = categories.includes(notification.category)
	            ? notification.category
	            : notificationCategory.UNKNOWN;
	        /**
	         * The category returned by the server without any validation.
	         *
	         * @type {string|undefined}
	         * @public
	         */
	        this.rawCategory = notification.category;
	    }
	    static _constructPosition(pos) {
	        if (pos == null) {
	            return {};
	        }
	        /* eslint-disable @typescript-eslint/no-non-null-assertion */
	        return {
	            offset: intValue(pos.offset),
	            line: intValue(pos.line),
	            column: intValue(pos.column)
	        };
	        /* eslint-enable @typescript-eslint/no-non-null-assertion */
	    }
	}
	/**
	 * Class for exposing server info from a result.
	 * @access public
	 */
	class ServerInfo {
	    address;
	    protocolVersion;
	    agent;
	    /**
	     * Create a ServerInfo instance
	     * @constructor
	     * @param {Object} serverMeta - Object with serverMeta data
	     * @param {Object} connectionInfo - Bolt connection info
	     * @param {number} protocolVersion - Bolt Protocol Version
	     */
	    constructor(serverMeta, protocolVersion) {
	        if (serverMeta != null) {
	            /**
	             * The server adress
	             * @type {string}
	             * @public
	             */
	            this.address = serverMeta.address;
	            /**
	             * The server user agent string
	             * @type {string}
	             * @public
	             */
	            this.agent = serverMeta.version;
	        }
	        /**
	         * The protocol version used by the connection
	         * @type {number}
	         * @public
	         */
	        this.protocolVersion = protocolVersion;
	    }
	}
	function intValue(value) {
	    if (value instanceof Integer) {
	        return value.toNumber();
	    }
	    else if (typeof value === 'bigint') {
	        return int(value).toNumber();
	    }
	    else {
	        return value;
	    }
	}
	function valueOrDefault$1(key, values, defaultValue = 0) {
	    if (values !== false && key in values) {
	        const value = values[key];
	        return intValue(value);
	    }
	    else {
	        return defaultValue;
	    }
	}
	/**
	 * The constants for query types
	 * @type {{SCHEMA_WRITE: string, WRITE_ONLY: string, READ_ONLY: string, READ_WRITE: string}}
	 */
	const queryType = {
	    READ_ONLY: 'r',
	    READ_WRITE: 'rw',
	    WRITE_ONLY: 'w',
	    SCHEMA_WRITE: 's'
	};

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
	class CompletedObserver$1 {
	    subscribe(observer) {
	        apply(observer, observer.onKeys, []);
	        apply(observer, observer.onCompleted, {});
	    }
	    cancel() {
	        // do nothing
	    }
	    pause() {
	        // do nothing
	    }
	    resume() {
	        // do nothing
	    }
	    prepareToHandleSingleResponse() {
	        // do nothing
	    }
	    markCompleted() {
	        // do nothing
	    }
	    onError(error) {
	        // nothing to do, already finished
	        // eslint-disable-next-line
	        // @ts-ignore: not available in ES oldest supported version
	        throw new Error('CompletedObserver not supposed to call onError', { cause: error });
	    }
	}
	class FailedObserver$1 {
	    _error;
	    _beforeError;
	    _observers;
	    constructor({ error, onError }) {
	        this._error = error;
	        this._beforeError = onError;
	        this._observers = [];
	        this.onError(error);
	    }
	    subscribe(observer) {
	        apply(observer, observer.onError, this._error);
	        this._observers.push(observer);
	    }
	    onError(error) {
	        apply(this, this._beforeError, error);
	        this._observers.forEach(o => apply(o, o.onError, error));
	    }
	    cancel() {
	        // do nothing
	    }
	    pause() {
	        // do nothing
	    }
	    resume() {
	        // do nothing
	    }
	    markCompleted() {
	        // do nothing
	    }
	    prepareToHandleSingleResponse() {
	        // do nothing
	    }
	}
	function apply(thisArg, func, param) {
	    if (func != null) {
	        func.bind(thisArg)(param);
	    }
	}

	var observers = /*#__PURE__*/Object.freeze({
		__proto__: null,
		CompletedObserver: CompletedObserver$1,
		FailedObserver: FailedObserver$1
	});

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
	const BOOKMARKS_KEY = 'bookmarks';
	class Bookmarks$6 {
	    _values;
	    /**
	     * @constructor
	     * @param {string|string[]} values single bookmark as string or multiple bookmarks as a string array.
	     */
	    constructor(values) {
	        this._values = asStringArray(values);
	    }
	    static empty() {
	        return EMPTY_BOOKMARK;
	    }
	    /**
	     * Check if the given Bookmarks holder is meaningful and can be send to the database.
	     * @return {boolean} returns `true` bookmarks has a value, `false` otherwise.
	     */
	    isEmpty() {
	        return this._values.length === 0;
	    }
	    /**
	     * Get all bookmarks values as an array.
	     * @return {string[]} all values.
	     */
	    values() {
	        return this._values;
	    }
	    [Symbol.iterator]() {
	        return this._values[Symbol.iterator]();
	    }
	    /**
	     * Get these bookmarks as an object for begin transaction call.
	     * @return {Object} the value of this bookmarks holder as object.
	     */
	    asBeginTransactionParameters() {
	        if (this.isEmpty()) {
	            return {};
	        }
	        // Driver sends {bookmarks: "max", bookmarks: ["one", "two", "max"]} instead of simple
	        // {bookmarks: ["one", "two", "max"]} for backwards compatibility reasons. Old servers can only accept single
	        // bookmarks that is why driver has to parse and compare given list of bookmarks. This functionality will
	        // eventually be removed.
	        return {
	            [BOOKMARKS_KEY]: this._values
	        };
	    }
	}
	const EMPTY_BOOKMARK = new Bookmarks$6(null);
	/**
	 * Converts given value to an array.
	 * @param {string|string[]|Array} [value=undefined] argument to convert.
	 * @return {string[]} value converted to an array.
	 */
	function asStringArray(value) {
	    if (value == null || value === '') {
	        return [];
	    }
	    if (isString(value)) {
	        return [value];
	    }
	    if (Array.isArray(value)) {
	        const result = new Set();
	        const flattenedValue = flattenArray(value);
	        for (let i = 0; i < flattenedValue.length; i++) {
	            const element = flattenedValue[i];
	            // if it is undefined or null, ignore it
	            if (element !== undefined && element !== null) {
	                if (!isString(element)) {
	                    throw new TypeError(
	                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	                    `Bookmark value should be a string, given: '${element}'`);
	                }
	                result.add(element);
	            }
	        }
	        return [...result];
	    }
	    throw new TypeError(
	    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	    `Bookmarks should either be a string or a string array, given: '${value}'`);
	}
	/**
	 * Recursively flattens an array so that the result becomes a single array
	 * of values, which does not include any sub-arrays
	 *
	 * @param {Array} value
	 */
	function flattenArray(values) {
	    return values.reduce((dest, value) => Array.isArray(value)
	        ? dest.concat(flattenArray(value))
	        : dest.concat(value), []);
	}

	var bookmarks = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Bookmarks: Bookmarks$6
	});

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
	const FETCH_ALL$5 = -1;
	const DEFAULT_POOL_ACQUISITION_TIMEOUT = 60 * 1000; // 60 seconds
	const DEFAULT_POOL_MAX_SIZE = 100;
	const DEFAULT_CONNECTION_TIMEOUT_MILLIS = 30000; // 30 seconds by default
	const ACCESS_MODE_READ$1 = 'READ';
	const ACCESS_MODE_WRITE$1 = 'WRITE';
	const BOLT_PROTOCOL_V1$1 = 1;
	const BOLT_PROTOCOL_V2$1 = 2;
	const BOLT_PROTOCOL_V3$3 = 3;
	const BOLT_PROTOCOL_V4_0$3 = 4.0;
	const BOLT_PROTOCOL_V4_1$1 = 4.1;
	const BOLT_PROTOCOL_V4_2$1 = 4.2;
	const BOLT_PROTOCOL_V4_3$1 = 4.3;
	const BOLT_PROTOCOL_V4_4$3 = 4.4;
	const BOLT_PROTOCOL_V5_0$1 = 5.0;
	const BOLT_PROTOCOL_V5_1$3 = 5.1;
	const BOLT_PROTOCOL_V5_2$1 = 5.2;
	const BOLT_PROTOCOL_V5_3$1 = 5.3;
	const BOLT_PROTOCOL_V5_4$1 = 5.4;
	const TELEMETRY_APIS = {
	    MANAGED_TRANSACTION: 0,
	    UNMANAGED_TRANSACTION: 1,
	    AUTO_COMMIT_TRANSACTION: 2,
	    EXECUTE_QUERY: 3
	};

	var constants = /*#__PURE__*/Object.freeze({
		__proto__: null,
		FETCH_ALL: FETCH_ALL$5,
		ACCESS_MODE_READ: ACCESS_MODE_READ$1,
		ACCESS_MODE_WRITE: ACCESS_MODE_WRITE$1,
		DEFAULT_CONNECTION_TIMEOUT_MILLIS: DEFAULT_CONNECTION_TIMEOUT_MILLIS,
		DEFAULT_POOL_ACQUISITION_TIMEOUT: DEFAULT_POOL_ACQUISITION_TIMEOUT,
		DEFAULT_POOL_MAX_SIZE: DEFAULT_POOL_MAX_SIZE,
		BOLT_PROTOCOL_V1: BOLT_PROTOCOL_V1$1,
		BOLT_PROTOCOL_V2: BOLT_PROTOCOL_V2$1,
		BOLT_PROTOCOL_V3: BOLT_PROTOCOL_V3$3,
		BOLT_PROTOCOL_V4_0: BOLT_PROTOCOL_V4_0$3,
		BOLT_PROTOCOL_V4_1: BOLT_PROTOCOL_V4_1$1,
		BOLT_PROTOCOL_V4_2: BOLT_PROTOCOL_V4_2$1,
		BOLT_PROTOCOL_V4_3: BOLT_PROTOCOL_V4_3$1,
		BOLT_PROTOCOL_V4_4: BOLT_PROTOCOL_V4_4$3,
		BOLT_PROTOCOL_V5_0: BOLT_PROTOCOL_V5_0$1,
		BOLT_PROTOCOL_V5_1: BOLT_PROTOCOL_V5_1$3,
		BOLT_PROTOCOL_V5_2: BOLT_PROTOCOL_V5_2$1,
		BOLT_PROTOCOL_V5_3: BOLT_PROTOCOL_V5_3$1,
		BOLT_PROTOCOL_V5_4: BOLT_PROTOCOL_V5_4$1,
		TELEMETRY_APIS: TELEMETRY_APIS
	});

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
	const ERROR = 'error';
	const WARN = 'warn';
	const INFO = 'info';
	const DEBUG = 'debug';
	const DEFAULT_LEVEL = INFO;
	const levels = {
	    [ERROR]: 0,
	    [WARN]: 1,
	    [INFO]: 2,
	    [DEBUG]: 3
	};
	/**
	 * Logger used by the driver to notify about various internal events. Single logger should be used per driver.
	 */
	class Logger$3 {
	    _level;
	    _loggerFunction;
	    /**
	     * @constructor
	     * @param {string} level the enabled logging level.
	     * @param {function(level: string, message: string)} loggerFunction the function to write the log level and message.
	     */
	    constructor(level, loggerFunction) {
	        this._level = level;
	        this._loggerFunction = loggerFunction;
	    }
	    /**
	     * Create a new logger based on the given driver configuration.
	     * @param {Object} driverConfig the driver configuration as supplied by the user.
	     * @return {Logger} a new logger instance or a no-op logger when not configured.
	     */
	    static create(driverConfig) {
	        if (driverConfig?.logging != null) {
	            const loggingConfig = driverConfig.logging;
	            const level = extractConfiguredLevel(loggingConfig);
	            const loggerFunction = extractConfiguredLogger(loggingConfig);
	            return new Logger$3(level, loggerFunction);
	        }
	        return this.noOp();
	    }
	    /**
	     * Create a no-op logger implementation.
	     * @return {Logger} the no-op logger implementation.
	     */
	    static noOp() {
	        return noOpLogger;
	    }
	    /**
	     * Check if error logging is enabled, i.e. it is not a no-op implementation.
	     * @return {boolean} `true` when enabled, `false` otherwise.
	     */
	    isErrorEnabled() {
	        return isLevelEnabled(this._level, ERROR);
	    }
	    /**
	     * Log an error message.
	     * @param {string} message the message to log.
	     */
	    error(message) {
	        if (this.isErrorEnabled()) {
	            this._loggerFunction(ERROR, message);
	        }
	    }
	    /**
	     * Check if warn logging is enabled, i.e. it is not a no-op implementation.
	     * @return {boolean} `true` when enabled, `false` otherwise.
	     */
	    isWarnEnabled() {
	        return isLevelEnabled(this._level, WARN);
	    }
	    /**
	     * Log an warning message.
	     * @param {string} message the message to log.
	     */
	    warn(message) {
	        if (this.isWarnEnabled()) {
	            this._loggerFunction(WARN, message);
	        }
	    }
	    /**
	     * Check if info logging is enabled, i.e. it is not a no-op implementation.
	     * @return {boolean} `true` when enabled, `false` otherwise.
	     */
	    isInfoEnabled() {
	        return isLevelEnabled(this._level, INFO);
	    }
	    /**
	     * Log an info message.
	     * @param {string} message the message to log.
	     */
	    info(message) {
	        if (this.isInfoEnabled()) {
	            this._loggerFunction(INFO, message);
	        }
	    }
	    /**
	     * Check if debug logging is enabled, i.e. it is not a no-op implementation.
	     * @return {boolean} `true` when enabled, `false` otherwise.
	     */
	    isDebugEnabled() {
	        return isLevelEnabled(this._level, DEBUG);
	    }
	    /**
	     * Log a debug message.
	     * @param {string} message the message to log.
	     */
	    debug(message) {
	        if (this.isDebugEnabled()) {
	            this._loggerFunction(DEBUG, message);
	        }
	    }
	}
	class NoOpLogger extends Logger$3 {
	    constructor() {
	        super(INFO, (level, message) => { });
	    }
	    isErrorEnabled() {
	        return false;
	    }
	    error(message) { }
	    isWarnEnabled() {
	        return false;
	    }
	    warn(message) { }
	    isInfoEnabled() {
	        return false;
	    }
	    info(message) { }
	    isDebugEnabled() {
	        return false;
	    }
	    debug(message) { }
	}
	const noOpLogger = new NoOpLogger();
	/**
	 * Check if the given logging level is enabled.
	 * @param {string} configuredLevel the configured level.
	 * @param {string} targetLevel the level to check.
	 * @return {boolean} value of `true` when enabled, `false` otherwise.
	 */
	function isLevelEnabled(configuredLevel, targetLevel) {
	    return levels[configuredLevel] >= levels[targetLevel];
	}
	/**
	 * Extract the configured logging level from the driver's logging configuration.
	 * @param {Object} loggingConfig the logging configuration.
	 * @return {string} the configured log level or default when none configured.
	 */
	function extractConfiguredLevel(loggingConfig) {
	    if (loggingConfig?.level != null) {
	        const configuredLevel = loggingConfig.level;
	        const value = levels[configuredLevel];
	        if (value == null && value !== 0) {
	            throw newError(`Illegal logging level: ${configuredLevel}. Supported levels are: ${Object.keys(levels).toString()}`);
	        }
	        return configuredLevel;
	    }
	    return DEFAULT_LEVEL;
	}
	/**
	 * Extract the configured logger function from the driver's logging configuration.
	 * @param {Object} loggingConfig the logging configuration.
	 * @return {function(level: string, message: string)} the configured logging function.
	 */
	function extractConfiguredLogger(loggingConfig) {
	    if (loggingConfig?.logger != null) {
	        const configuredLogger = loggingConfig.logger;
	        if (configuredLogger != null && typeof configuredLogger === 'function') {
	            return configuredLogger;
	        }
	    }
	    throw newError(`Illegal logger function: ${loggingConfig?.logger?.toString() ?? 'undefined'}`);
	}

	var logger = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Logger: Logger$3
	});

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
	 * Utility to lazily initialize connections and return them back to the pool when unused.
	 * @private
	 */
	class ConnectionHolder {
	    _mode;
	    _database;
	    _bookmarks;
	    _connectionProvider;
	    _referenceCount;
	    _connectionPromise;
	    _impersonatedUser;
	    _getConnectionAcquistionBookmarks;
	    _onDatabaseNameResolved;
	    _auth;
	    _log;
	    _closed;
	    /**
	     * @constructor
	     * @param {object} params
	     * @property {string} params.mode - the access mode for new connection holder.
	     * @property {string} params.database - the target database name.
	     * @property {Bookmarks} params.bookmarks - initial bookmarks
	     * @property {ConnectionProvider} params.connectionProvider - the connection provider to acquire connections from.
	     * @property {string?} params.impersonatedUser - the user which will be impersonated
	     * @property {function(databaseName:string)} params.onDatabaseNameResolved - callback called when the database name is resolved
	     * @property {function():Promise<Bookmarks>} params.getConnectionAcquistionBookmarks - called for getting Bookmarks for acquiring connections
	     * @property {AuthToken} params.auth - the target auth for the to-be-acquired connection
	     */
	    constructor({ mode, database = '', bookmarks, connectionProvider, impersonatedUser, onDatabaseNameResolved, getConnectionAcquistionBookmarks, auth, log }) {
	        this._mode = mode ?? ACCESS_MODE_WRITE$1;
	        this._closed = false;
	        this._database = database != null ? assertString$1(database, 'database') : '';
	        this._bookmarks = bookmarks ?? Bookmarks$6.empty();
	        this._connectionProvider = connectionProvider;
	        this._impersonatedUser = impersonatedUser;
	        this._referenceCount = 0;
	        this._connectionPromise = Promise.resolve(null);
	        this._onDatabaseNameResolved = onDatabaseNameResolved;
	        this._auth = auth;
	        this._log = log;
	        this._logError = this._logError.bind(this);
	        this._getConnectionAcquistionBookmarks = getConnectionAcquistionBookmarks ?? (() => Promise.resolve(Bookmarks$6.empty()));
	    }
	    mode() {
	        return this._mode;
	    }
	    database() {
	        return this._database;
	    }
	    setDatabase(database) {
	        this._database = database;
	    }
	    bookmarks() {
	        return this._bookmarks;
	    }
	    connectionProvider() {
	        return this._connectionProvider;
	    }
	    referenceCount() {
	        return this._referenceCount;
	    }
	    initializeConnection() {
	        if (this._referenceCount === 0 && (this._connectionProvider != null)) {
	            this._connectionPromise = this._createConnectionPromise(this._connectionProvider);
	        }
	        else {
	            this._referenceCount++;
	            return false;
	        }
	        this._referenceCount++;
	        return true;
	    }
	    async _createConnectionPromise(connectionProvider) {
	        return await connectionProvider.acquireConnection({
	            accessMode: this._mode,
	            database: this._database,
	            bookmarks: await this._getBookmarks(),
	            impersonatedUser: this._impersonatedUser,
	            onDatabaseNameResolved: this._onDatabaseNameResolved,
	            auth: this._auth
	        });
	    }
	    async _getBookmarks() {
	        return await this._getConnectionAcquistionBookmarks();
	    }
	    getConnection() {
	        return this._connectionPromise;
	    }
	    releaseConnection() {
	        if (this._referenceCount === 0) {
	            return this._connectionPromise;
	        }
	        this._referenceCount--;
	        if (this._referenceCount === 0) {
	            return this._releaseConnection();
	        }
	        return this._connectionPromise;
	    }
	    close(hasTx) {
	        this._closed = true;
	        if (this._referenceCount === 0) {
	            return this._connectionPromise;
	        }
	        this._referenceCount = 0;
	        return this._releaseConnection(hasTx);
	    }
	    log() {
	        return this._log;
	    }
	    /**
	     * Return the current pooled connection instance to the connection pool.
	     * We don't pool Session instances, to avoid users using the Session after they've called close.
	     * The `Session` object is just a thin wrapper around Connection anyway, so it makes little difference.
	     * @return {Promise} - promise resolved then connection is returned to the pool.
	     * @private
	     */
	    _releaseConnection(hasTx) {
	        this._connectionPromise = this._connectionPromise
	            .then((connection) => {
	            if (connection != null) {
	                if (connection.isOpen() && (connection.hasOngoingObservableRequests() || hasTx === true)) {
	                    return connection
	                        .resetAndFlush()
	                        .catch(ignoreError)
	                        .then(() => connection.release().then(() => null));
	                }
	                return connection.release().then(() => null);
	            }
	            else {
	                return Promise.resolve(null);
	            }
	        })
	            .catch(this._logError);
	        return this._connectionPromise;
	    }
	    _logError(error) {
	        if (this._log.isWarnEnabled()) {
	            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	            this._log.warn(`ConnectionHolder got an error while releasing the connection. Error ${error}. Stacktrace: ${error.stack}`);
	        }
	        return null;
	    }
	}
	/**
	 * Provides a interaction with a ConnectionHolder without change it state by
	 * releasing or initilizing
	 */
	class ReadOnlyConnectionHolder extends ConnectionHolder {
	    _connectionHolder;
	    /**
	     * Constructor
	     * @param {ConnectionHolder} connectionHolder the connection holder which will treat the requests
	     */
	    constructor(connectionHolder) {
	        super({
	            mode: connectionHolder.mode(),
	            database: connectionHolder.database(),
	            bookmarks: connectionHolder.bookmarks(),
	            // @ts-expect-error
	            getConnectionAcquistionBookmarks: connectionHolder._getConnectionAcquistionBookmarks,
	            connectionProvider: connectionHolder.connectionProvider(),
	            log: connectionHolder.log()
	        });
	        this._connectionHolder = connectionHolder;
	    }
	    /**
	     * Return the true if the connection is suppose to be initilized with the command.
	     *
	     * @return {boolean}
	     */
	    initializeConnection() {
	        if (this._connectionHolder.referenceCount() === 0) {
	            return false;
	        }
	        return true;
	    }
	    /**
	     * Get the current connection promise.
	     * @return {Promise<Connection>} promise resolved with the current connection.
	     */
	    getConnection() {
	        return this._connectionHolder.getConnection();
	    }
	    /**
	     * Get the current connection promise, doesn't performs the release
	     * @return {Promise<Connection>} promise with the resolved current connection
	     */
	    releaseConnection() {
	        return this._connectionHolder.getConnection().catch(() => Promise.resolve(null));
	    }
	    /**
	     * Get the current connection promise, doesn't performs the connection close
	     * @return {Promise<Connection>} promise with the resolved current connection
	     */
	    close() {
	        return this._connectionHolder.getConnection().catch(() => Promise.resolve(null));
	    }
	}
	class EmptyConnectionHolder extends ConnectionHolder {
	    constructor() {
	        super({
	            // Empty logger
	            log: Logger$3.create({})
	        });
	    }
	    mode() {
	        return undefined;
	    }
	    database() {
	        return undefined;
	    }
	    initializeConnection() {
	        // nothing to initialize
	        return true;
	    }
	    async getConnection() {
	        return await Promise.reject(newError('This connection holder does not serve connections'));
	    }
	    async releaseConnection() {
	        return await Promise.resolve(null);
	    }
	    async close() {
	        return await Promise.resolve(null);
	    }
	}
	/**
	 * Connection holder that does not manage any connections.
	 * @type {ConnectionHolder}
	 * @private
	 */
	const EMPTY_CONNECTION_HOLDER$1 = new EmptyConnectionHolder();
	// eslint-disable-next-line n/handle-callback-err
	function ignoreError(error) {
	    return null;
	}

	var connectionHolder = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': ReadOnlyConnectionHolder,
		ConnectionHolder: ConnectionHolder,
		ReadOnlyConnectionHolder: ReadOnlyConnectionHolder,
		EMPTY_CONNECTION_HOLDER: EMPTY_CONNECTION_HOLDER$1
	});

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
	 * Internal holder of the transaction configuration.
	 * It performs input validation and value conversion for further serialization by the Bolt protocol layer.
	 * Users of the driver provide transaction configuration as regular objects `{timeout: 10, metadata: {key: 'value'}}`.
	 * Driver converts such objects to {@link TxConfig} immediately and uses converted values everywhere.
	 */
	class TxConfig$3 {
	    timeout;
	    metadata;
	    /**
	     * @constructor
	     * @param {Object} config the raw configuration object.
	     */
	    constructor(config, log) {
	        assertValidConfig(config);
	        this.timeout = extractTimeout(config, log);
	        this.metadata = extractMetadata(config);
	    }
	    /**
	     * Get an empty config object.
	     * @return {TxConfig} an empty config.
	     */
	    static empty() {
	        return EMPTY_CONFIG;
	    }
	    /**
	     * Check if this config object is empty. I.e. has no configuration values specified.
	     * @return {boolean} `true` if this object is empty, `false` otherwise.
	     */
	    isEmpty() {
	        return Object.values(this).every(value => value == null);
	    }
	}
	const EMPTY_CONFIG = new TxConfig$3({});
	/**
	 * @return {Integer|null}
	 */
	function extractTimeout(config, log) {
	    if (isObject(config) && config.timeout != null) {
	        assertNumberOrInteger(config.timeout, 'Transaction timeout');
	        if (isTimeoutFloat(config) && log?.isInfoEnabled() === true) {
	            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	            log?.info(`Transaction timeout expected to be an integer, got: ${config.timeout}. The value will be rounded up.`);
	        }
	        const timeout = int(config.timeout, { ceilFloat: true });
	        if (timeout.isNegative()) {
	            throw newError('Transaction timeout should not be negative');
	        }
	        return timeout;
	    }
	    return null;
	}
	function isTimeoutFloat(config) {
	    return typeof config.timeout === 'number' && !Number.isInteger(config.timeout);
	}
	/**
	 * @return {object|null}
	 */
	function extractMetadata(config) {
	    if (isObject(config) && config.metadata != null) {
	        const metadata = config.metadata;
	        assertObject(metadata, 'config.metadata');
	        if (Object.keys(metadata).length !== 0) {
	            // not an empty object
	            return metadata;
	        }
	    }
	    return null;
	}
	function assertValidConfig(config) {
	    if (config != null) {
	        assertObject(config, 'Transaction config');
	    }
	}

	var txConfig = /*#__PURE__*/Object.freeze({
		__proto__: null,
		TxConfig: TxConfig$3
	});

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
	const DEFAULT_MAX_RETRY_TIME_MS = 30 * 1000; // 30 seconds
	const DEFAULT_INITIAL_RETRY_DELAY_MS = 1000; // 1 seconds
	const DEFAULT_RETRY_DELAY_MULTIPLIER = 2.0;
	const DEFAULT_RETRY_DELAY_JITTER_FACTOR = 0.2;
	function setTimeoutWrapper(callback, ms, ...args) {
	    return setTimeout(callback, ms, ...args);
	}
	function clearTimeoutWrapper(timeoutId) {
	    return clearTimeout(timeoutId);
	}
	class TransactionExecutor {
	    _maxRetryTimeMs;
	    _initialRetryDelayMs;
	    _multiplier;
	    _jitterFactor;
	    _inFlightTimeoutIds;
	    _setTimeout;
	    _clearTimeout;
	    telemetryApi;
	    pipelineBegin;
	    constructor(maxRetryTimeMs, initialRetryDelayMs, multiplier, jitterFactor, dependencies = {
	        setTimeout: setTimeoutWrapper,
	        clearTimeout: clearTimeoutWrapper
	    }) {
	        this._maxRetryTimeMs = _valueOrDefault(maxRetryTimeMs, DEFAULT_MAX_RETRY_TIME_MS);
	        this._initialRetryDelayMs = _valueOrDefault(initialRetryDelayMs, DEFAULT_INITIAL_RETRY_DELAY_MS);
	        this._multiplier = _valueOrDefault(multiplier, DEFAULT_RETRY_DELAY_MULTIPLIER);
	        this._jitterFactor = _valueOrDefault(jitterFactor, DEFAULT_RETRY_DELAY_JITTER_FACTOR);
	        this._setTimeout = dependencies.setTimeout;
	        this._clearTimeout = dependencies.clearTimeout;
	        this._inFlightTimeoutIds = [];
	        this.pipelineBegin = false;
	        this.telemetryApi = TELEMETRY_APIS.MANAGED_TRANSACTION;
	        this._verifyAfterConstruction();
	    }
	    execute(transactionCreator, transactionWork, transactionWrapper) {
	        const context = {
	            apiTransactionConfig: {
	                api: this.telemetryApi,
	                onTelemetrySuccess: () => {
	                    context.apiTransactionConfig = undefined;
	                }
	            }
	        };
	        return new Promise((resolve, reject) => {
	            this._executeTransactionInsidePromise(transactionCreator, transactionWork, resolve, reject, transactionWrapper, context).catch(reject);
	        }).catch(error => {
	            const retryStartTimeMs = Date.now();
	            const retryDelayMs = this._initialRetryDelayMs;
	            return this._retryTransactionPromise(transactionCreator, transactionWork, error, retryStartTimeMs, retryDelayMs, transactionWrapper, context);
	        });
	    }
	    close() {
	        // cancel all existing timeouts to prevent further retries
	        this._inFlightTimeoutIds.forEach(timeoutId => this._clearTimeout(timeoutId));
	        this._inFlightTimeoutIds = [];
	    }
	    _retryTransactionPromise(transactionCreator, transactionWork, error, retryStartTime, retryDelayMs, transactionWrapper, executionContext) {
	        const elapsedTimeMs = Date.now() - retryStartTime;
	        if (elapsedTimeMs > this._maxRetryTimeMs || !isRetriableError(error)) {
	            return Promise.reject(error);
	        }
	        return new Promise((resolve, reject) => {
	            const nextRetryTime = this._computeDelayWithJitter(retryDelayMs);
	            const timeoutId = this._setTimeout(() => {
	                // filter out this timeoutId when time has come and function is being executed
	                this._inFlightTimeoutIds = this._inFlightTimeoutIds.filter(id => id !== timeoutId);
	                this._executeTransactionInsidePromise(transactionCreator, transactionWork, resolve, reject, transactionWrapper, executionContext).catch(reject);
	            }, nextRetryTime);
	            // add newly created timeoutId to the list of all in-flight timeouts
	            this._inFlightTimeoutIds.push(timeoutId);
	        }).catch(error => {
	            const nextRetryDelayMs = retryDelayMs * this._multiplier;
	            return this._retryTransactionPromise(transactionCreator, transactionWork, error, retryStartTime, nextRetryDelayMs, transactionWrapper, executionContext);
	        });
	    }
	    async _executeTransactionInsidePromise(transactionCreator, transactionWork, resolve, reject, transactionWrapper, executionContext) {
	        let tx;
	        try {
	            const txPromise = transactionCreator(executionContext?.apiTransactionConfig != null
	                ? { ...executionContext?.apiTransactionConfig }
	                : undefined);
	            tx = this.pipelineBegin ? txPromise : await txPromise;
	        }
	        catch (error) {
	            // failed to create a transaction
	            reject(error);
	            return;
	        }
	        // The conversion from `tx` as `unknown` then to `Tx` is necessary
	        // because it is not possible to be sure that `Tx` is a subtype of `Transaction`
	        // in using static type checking.
	        const wrap = transactionWrapper ?? ((tx) => tx);
	        const wrappedTx = wrap(tx);
	        const resultPromise = this._safeExecuteTransactionWork(wrappedTx, transactionWork);
	        resultPromise
	            .then(result => this._handleTransactionWorkSuccess(result, tx, resolve, reject))
	            .catch(error => this._handleTransactionWorkFailure(error, tx, reject));
	    }
	    _safeExecuteTransactionWork(tx, transactionWork) {
	        try {
	            const result = transactionWork(tx);
	            // user defined callback is supposed to return a promise, but it might not; so to protect against an
	            // incorrect API usage we wrap the returned value with a resolved promise; this is effectively a
	            // validation step without type checks
	            return Promise.resolve(result);
	        }
	        catch (error) {
	            return Promise.reject(error);
	        }
	    }
	    _handleTransactionWorkSuccess(result, tx, resolve, reject) {
	        if (tx.isOpen()) {
	            // transaction work returned resolved promise and transaction has not been committed/rolled back
	            // try to commit the transaction
	            tx.commit()
	                .then(() => {
	                // transaction was committed, return result to the user
	                resolve(result);
	            })
	                .catch(error => {
	                // transaction failed to commit, propagate the failure
	                reject(error);
	            });
	        }
	        else {
	            // transaction work returned resolved promise and transaction is already committed/rolled back
	            // return the result returned by given transaction work
	            resolve(result);
	        }
	    }
	    _handleTransactionWorkFailure(error, tx, reject) {
	        if (tx.isOpen()) {
	            // transaction work failed and the transaction is still open, roll it back and propagate the failure
	            tx.rollback()
	                .catch(ignore => {
	                // ignore the rollback error
	            })
	                .then(() => reject(error)) // propagate the original error we got from the transaction work
	                .catch(reject);
	        }
	        else {
	            // transaction is already rolled back, propagate the error
	            reject(error);
	        }
	    }
	    _computeDelayWithJitter(delayMs) {
	        const jitter = delayMs * this._jitterFactor;
	        const min = delayMs - jitter;
	        const max = delayMs + jitter;
	        return Math.random() * (max - min) + min;
	    }
	    _verifyAfterConstruction() {
	        if (this._maxRetryTimeMs < 0) {
	            throw newError('Max retry time should be >= 0: ' + this._maxRetryTimeMs.toString());
	        }
	        if (this._initialRetryDelayMs < 0) {
	            throw newError('Initial retry delay should >= 0: ' + this._initialRetryDelayMs.toString());
	        }
	        if (this._multiplier < 1.0) {
	            throw newError('Multiplier should be >= 1.0: ' + this._multiplier.toString());
	        }
	        if (this._jitterFactor < 0 || this._jitterFactor > 1) {
	            throw newError('Jitter factor should be in [0.0, 1.0]: ' + this._jitterFactor.toFixed());
	        }
	    }
	}
	function _valueOrDefault(value, defaultValue) {
	    if (value != null) {
	        return value;
	    }
	    return defaultValue;
	}

	var transactionExecutor = /*#__PURE__*/Object.freeze({
		__proto__: null,
		TransactionExecutor: TransactionExecutor
	});

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
	const DEFAULT_BOLT_PORT = 7687;
	const DEFAULT_HTTP_PORT = 7474;
	const DEFAULT_HTTPS_PORT = 7473;
	class Url {
	    scheme;
	    host;
	    port;
	    hostAndPort;
	    query;
	    constructor(scheme, host, port, hostAndPort, query) {
	        /**
	         * Nullable scheme (protocol) of the URL.
	         * Example: 'bolt', 'neo4j', 'http', 'https', etc.
	         * @type {string}
	         */
	        this.scheme = scheme;
	        /**
	         * Nonnull host name or IP address. IPv6 not wrapped in square brackets.
	         * Example: 'neo4j.com', 'localhost', '127.0.0.1', '192.168.10.15', '::1', '2001:4860:4860::8844', etc.
	         * @type {string}
	         */
	        this.host = host;
	        /**
	         * Nonnull number representing port. Default port for the given scheme is used if given URL string
	         * does not contain port. Example: 7687 for bolt, 7474 for HTTP and 7473 for HTTPS.
	         * @type {number}
	         */
	        this.port = port;
	        /**
	         * Nonnull host name or IP address plus port, separated by ':'. IPv6 wrapped in square brackets.
	         * Example: 'neo4j.com', 'neo4j.com:7687', '127.0.0.1', '127.0.0.1:8080', '[2001:4860:4860::8844]',
	         * '[2001:4860:4860::8844]:9090', etc.
	         * @type {string}
	         */
	        this.hostAndPort = hostAndPort;
	        /**
	         * Nonnull object representing parsed query string key-value pairs. Duplicated keys not supported.
	         * Example: '{}', '{'key1': 'value1', 'key2': 'value2'}', etc.
	         * @type {Object}
	         */
	        this.query = query;
	    }
	}
	function parseDatabaseUrl(url) {
	    assertString$1(url, 'URL');
	    const sanitized = sanitizeUrl(url);
	    const parsedUrl = uriJsParse(sanitized.url);
	    const scheme = sanitized.schemeMissing
	        ? null
	        : extractScheme(parsedUrl.scheme);
	    const host = extractHost(parsedUrl.host); // no square brackets for IPv6
	    const formattedHost = formatHost(host); // has square brackets for IPv6
	    const port = extractPort(parsedUrl.port, scheme);
	    const hostAndPort = `${formattedHost}:${port}`;
	    const query = extractQuery(
	    // @ts-expect-error
	    parsedUrl.query ?? extractResourceQueryString(parsedUrl.resourceName), url);
	    return new Url(scheme, host, port, hostAndPort, query);
	}
	function extractResourceQueryString(resource) {
	    if (typeof resource !== 'string') {
	        return null;
	    }
	    const [, query] = resource.split('?');
	    return query;
	}
	function sanitizeUrl(url) {
	    url = url.trim();
	    if (!url.includes('://')) {
	        // url does not contain scheme, add dummy 'none://' to make parser work correctly
	        return { schemeMissing: true, url: `none://${url}` };
	    }
	    return { schemeMissing: false, url };
	}
	function extractScheme(scheme) {
	    if (scheme != null) {
	        scheme = scheme.trim();
	        if (scheme.charAt(scheme.length - 1) === ':') {
	            scheme = scheme.substring(0, scheme.length - 1);
	        }
	        return scheme;
	    }
	    return null;
	}
	function extractHost(host, url) {
	    if (host == null) {
	        throw new Error('Unable to extract host from null or undefined URL');
	    }
	    return host.trim();
	}
	function extractPort(portString, scheme) {
	    const port = typeof portString === 'string' ? parseInt(portString, 10) : portString;
	    return port != null && !isNaN(port) ? port : defaultPortForScheme(scheme);
	}
	function extractQuery(queryString, url) {
	    const query = queryString != null ? trimAndSanitizeQuery(queryString) : null;
	    const context = {};
	    if (query != null) {
	        query.split('&').forEach((pair) => {
	            const keyValue = pair.split('=');
	            if (keyValue.length !== 2) {
	                throw new Error(`Invalid parameters: '${keyValue.toString()}' in URL '${url}'.`);
	            }
	            const key = trimAndVerifyQueryElement(keyValue[0], 'key', url);
	            const value = trimAndVerifyQueryElement(keyValue[1], 'value', url);
	            if (context[key] !== undefined) {
	                throw new Error(`Duplicated query parameters with key '${key}' in URL '${url}'`);
	            }
	            context[key] = value;
	        });
	    }
	    return context;
	}
	function trimAndSanitizeQuery(query) {
	    query = (query ?? '').trim();
	    if (query?.charAt(0) === '?') {
	        query = query.substring(1, query.length);
	    }
	    return query;
	}
	function trimAndVerifyQueryElement(element, name, url) {
	    element = (element ?? '').trim();
	    if (element === '') {
	        throw new Error(`Illegal empty ${name} in URL query '${url}'`);
	    }
	    return element;
	}
	function escapeIPv6Address(address) {
	    const startsWithSquareBracket = address.charAt(0) === '[';
	    const endsWithSquareBracket = address.charAt(address.length - 1) === ']';
	    if (!startsWithSquareBracket && !endsWithSquareBracket) {
	        return `[${address}]`;
	    }
	    else if (startsWithSquareBracket && endsWithSquareBracket) {
	        return address;
	    }
	    else {
	        throw new Error(`Illegal IPv6 address ${address}`);
	    }
	}
	function formatHost(host) {
	    if (host === '' || host == null) {
	        throw new Error(`Illegal host ${host}`);
	    }
	    const isIPv6Address = host.includes(':');
	    return isIPv6Address ? escapeIPv6Address(host) : host;
	}
	function formatIPv4Address(address, port) {
	    return `${address}:${port}`;
	}
	function formatIPv6Address(address, port) {
	    const escapedAddress = escapeIPv6Address(address);
	    return `${escapedAddress}:${port}`;
	}
	function defaultPortForScheme(scheme) {
	    if (scheme === 'http') {
	        return DEFAULT_HTTP_PORT;
	    }
	    else if (scheme === 'https') {
	        return DEFAULT_HTTPS_PORT;
	    }
	    else {
	        return DEFAULT_BOLT_PORT;
	    }
	}
	function uriJsParse(value) {
	    // JS version of Python partition function
	    function partition(s, delimiter) {
	        const i = s.indexOf(delimiter);
	        if (i >= 0)
	            return [s.substring(0, i), s[i], s.substring(i + 1)];
	        else
	            return [s, '', ''];
	    }
	    // JS version of Python rpartition function
	    function rpartition(s, delimiter) {
	        const i = s.lastIndexOf(delimiter);
	        if (i >= 0)
	            return [s.substring(0, i), s[i], s.substring(i + 1)];
	        else
	            return ['', '', s];
	    }
	    function between(s, ldelimiter, rdelimiter) {
	        const lpartition = partition(s, ldelimiter);
	        const rpartition = partition(lpartition[2], rdelimiter);
	        return [rpartition[0], rpartition[2]];
	    }
	    // Parse an authority string into an object
	    // with the following keys:
	    // - userInfo (optional, might contain both user name and password)
	    // - host
	    // - port (optional, included only as a string)
	    function parseAuthority(value) {
	        const parsed = {};
	        let parts;
	        // Parse user info
	        parts = rpartition(value, '@');
	        if (parts[1] === '@') {
	            parsed.userInfo = decodeURIComponent(parts[0]);
	            value = parts[2];
	        }
	        // Parse host and port
	        const [ipv6Host, rest] = between(value, '[', ']');
	        if (ipv6Host !== '') {
	            parsed.host = ipv6Host;
	            parts = partition(rest, ':');
	        }
	        else {
	            parts = partition(value, ':');
	            parsed.host = parts[0];
	        }
	        if (parts[1] === ':') {
	            parsed.port = parts[2];
	        }
	        return parsed;
	    }
	    let parsed = {};
	    let parts;
	    // Parse scheme
	    parts = partition(value, ':');
	    if (parts[1] === ':') {
	        parsed.scheme = decodeURIComponent(parts[0]);
	        value = parts[2];
	    }
	    // Parse fragment
	    parts = partition(value, '#');
	    if (parts[1] === '#') {
	        parsed.fragment = decodeURIComponent(parts[2]);
	        value = parts[0];
	    }
	    // Parse query
	    parts = partition(value, '?');
	    if (parts[1] === '?') {
	        parsed.query = parts[2];
	        value = parts[0];
	    }
	    // Parse authority and path
	    if (value.startsWith('//')) {
	        parts = partition(value.substr(2), '/');
	        parsed = { ...parsed, ...parseAuthority(parts[0]) };
	        parsed.path = parts[1] + parts[2];
	    }
	    else {
	        parsed.path = value;
	    }
	    return parsed;
	}

	var urlUtil = /*#__PURE__*/Object.freeze({
		__proto__: null,
		parseDatabaseUrl: parseDatabaseUrl,
		defaultPortForScheme: defaultPortForScheme,
		formatIPv4Address: formatIPv4Address,
		formatIPv6Address: formatIPv6Address,
		Url: Url
	});

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
	class ServerAddress$1 {
	    _host;
	    _resolved;
	    _port;
	    _hostPort;
	    _stringValue;
	    constructor(host, resolved, port, hostPort) {
	        this._host = assertString$1(host, 'host');
	        this._resolved = resolved != null ? assertString$1(resolved, 'resolved') : null;
	        this._port = assertNumber(port, 'port');
	        this._hostPort = hostPort;
	        this._stringValue = resolved != null ? `${hostPort}(${resolved})` : `${hostPort}`;
	    }
	    host() {
	        return this._host;
	    }
	    resolvedHost() {
	        return this._resolved != null ? this._resolved : this._host;
	    }
	    port() {
	        return this._port;
	    }
	    resolveWith(resolved) {
	        return new ServerAddress$1(this._host, resolved, this._port, this._hostPort);
	    }
	    asHostPort() {
	        return this._hostPort;
	    }
	    asKey() {
	        return this._hostPort;
	    }
	    toString() {
	        return this._stringValue;
	    }
	    static fromUrl(url) {
	        const urlParsed = parseDatabaseUrl(url);
	        return new ServerAddress$1(urlParsed.host, null, urlParsed.port, urlParsed.hostAndPort);
	    }
	}

	var serverAddress = /*#__PURE__*/Object.freeze({
		__proto__: null,
		ServerAddress: ServerAddress$1
	});

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
	/* eslint-disable @typescript-eslint/promise-function-async */
	class BaseHostNameResolver$1 {
	    resolve() {
	        throw new Error('Abstract function');
	    }
	    /**
	     * @protected
	     */
	    _resolveToItself(address) {
	        return Promise.resolve([address]);
	    }
	}

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
	function resolveToSelf(address) {
	    return Promise.resolve([address]);
	}
	class ConfiguredCustomResolver {
	    _resolverFunction;
	    constructor(resolverFunction) {
	        this._resolverFunction = resolverFunction ?? resolveToSelf;
	    }
	    resolve(seedRouter) {
	        return new Promise(resolve => resolve(this._resolverFunction(seedRouter.asHostPort()))).then(resolved => {
	            if (!Array.isArray(resolved)) {
	                throw new TypeError('Configured resolver function should either return an array of addresses or a Promise resolved with an array of addresses.' +
	                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	                    `Each address is '<host>:<port>'. Got: ${resolved}`);
	            }
	            return resolved.map(r => ServerAddress$1.fromUrl(r));
	        });
	    }
	}

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

	var index$8 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		BaseHostNameResolver: BaseHostNameResolver$1,
		ConfiguredCustomResolver: ConfiguredCustomResolver
	});

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
	/* eslint-disable */
	/**
	 * Constructs a BoltAgent structure from a given product version.
	 *
	 * @param {string} version The product version
	 * @param {function():SystemInfo} getSystemInfo Parameter used of inject system information and mock calls to the APIs.
	 * @returns {BoltAgent} The bolt agent
	 */
	function fromVersion(version, getSystemInfo = () => ({
	    get userAgent() {
	        // this should be defined as an `var` since we need to get information
	        // came from the global scope which not always will be defined
	        // and we don't want to override the information
	        var navigator;
	        // @ts-ignore: browser code so must be skipped by ts
	        return navigator?.userAgent;
	    }
	})) {
	    const systemInfo = getSystemInfo();
	    //USER_AGENT looks like 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
	    const platform = systemInfo.userAgent != null ? systemInfo.userAgent.split("(")[1].split(")")[0] : undefined;
	    const languageDetails = systemInfo.userAgent || undefined;
	    return {
	        product: `neo4j-javascript/${version}`,
	        platform,
	        languageDetails
	    };
	}
	/* eslint-enable */

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

	var index$7 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fromVersion: fromVersion
	});

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

	var internal = /*#__PURE__*/Object.freeze({
		__proto__: null,
		util: util,
		temporalUtil: temporalUtil,
		observer: observers,
		bookmarks: bookmarks,
		constants: constants,
		connectionHolder: connectionHolder,
		txConfig: txConfig,
		transactionExecutor: transactionExecutor,
		logger: logger,
		urlUtil: urlUtil,
		serverAddress: serverAddress,
		resolver: index$8,
		objectUtil: objectUtil$1,
		boltAgent: index$7
	});

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
	const { EMPTY_CONNECTION_HOLDER } = connectionHolder;
	/**
	 * @private
	 * @param {Error} error The error
	 * @returns {void}
	 */
	const DEFAULT_ON_ERROR = (error) => {
	    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-base-to-string
	    console.log('Uncaught error when processing result: ' + error);
	};
	/**
	 * @private
	 * @param {ResultSummary} summary
	 * @returns {void}
	 */
	const DEFAULT_ON_COMPLETED = (summary) => { };
	/**
	 * @private
	 * @param {string[]} keys List of keys of the record in the result
	 * @return {void}
	 */
	const DEFAULT_ON_KEYS = (keys) => { };
	/**
	 * A stream of {@link Record} representing the result of a query.
	 * Can be consumed eagerly as {@link Promise} resolved with array of records and {@link ResultSummary}
	 * summary, or rejected with error that contains {@link string} code and {@link string} message.
	 * Alternatively can be consumed lazily using {@link Result#subscribe} function.
	 * @access public
	 */
	class Result {
	    _stack;
	    _streamObserverPromise;
	    _p;
	    _query;
	    _parameters;
	    _connectionHolder;
	    _keys;
	    _summary;
	    _error;
	    _watermarks;
	    /**
	     * Inject the observer to be used.
	     * @constructor
	     * @access private
	     * @param {Promise<observer.ResultStreamObserver>} streamObserverPromise
	     * @param {mixed} query - Cypher query to execute
	     * @param {Object} parameters - Map with parameters to use in query
	     * @param {ConnectionHolder} connectionHolder - to be notified when result is either fully consumed or error happened.
	     */
	    constructor(streamObserverPromise, query, parameters, connectionHolder, watermarks = { high: Number.MAX_VALUE, low: Number.MAX_VALUE }) {
	        this._stack = captureStacktrace();
	        this._streamObserverPromise = streamObserverPromise;
	        this._p = null;
	        this._query = query;
	        this._parameters = parameters ?? {};
	        this._connectionHolder = connectionHolder ?? EMPTY_CONNECTION_HOLDER;
	        this._keys = null;
	        this._summary = null;
	        this._error = null;
	        this._watermarks = watermarks;
	    }
	    /**
	     * Returns a promise for the field keys.
	     *
	     * *Should not be combined with {@link Result#subscribe} function.*
	     *
	     * @public
	     * @returns {Promise<string[]>} - Field keys, in the order they will appear in records.
	     }
	     */
	    keys() {
	        if (this._keys !== null) {
	            return Promise.resolve(this._keys);
	        }
	        else if (this._error !== null) {
	            return Promise.reject(this._error);
	        }
	        return new Promise((resolve, reject) => {
	            this._streamObserverPromise
	                .then(observer => observer.subscribe(this._decorateObserver({
	                onKeys: keys => resolve(keys),
	                onError: err => reject(err)
	            })))
	                .catch(reject);
	        });
	    }
	    /**
	     * Returns a promise for the result summary.
	     *
	     * *Should not be combined with {@link Result#subscribe} function.*
	     *
	     * @public
	     * @returns {Promise<ResultSummary>} - Result summary.
	     *
	     */
	    summary() {
	        if (this._summary !== null) {
	            return Promise.resolve(this._summary);
	        }
	        else if (this._error !== null) {
	            return Promise.reject(this._error);
	        }
	        return new Promise((resolve, reject) => {
	            this._streamObserverPromise
	                .then(o => {
	                o.cancel();
	                o.subscribe(this._decorateObserver({
	                    onCompleted: summary => resolve(summary),
	                    onError: err => reject(err)
	                }));
	            })
	                .catch(reject);
	        });
	    }
	    /**
	     * Create and return new Promise
	     *
	     * @private
	     * @return {Promise} new Promise.
	     */
	    _getOrCreatePromise() {
	        if (this._p == null) {
	            this._p = new Promise((resolve, reject) => {
	                const records = [];
	                const observer = {
	                    onNext: (record) => {
	                        records.push(record);
	                    },
	                    onCompleted: (summary) => {
	                        resolve({ records, summary });
	                    },
	                    onError: (error) => {
	                        reject(error);
	                    }
	                };
	                this.subscribe(observer);
	            });
	        }
	        return this._p;
	    }
	    /**
	     * Provides a async iterator over the records in the result.
	     *
	     * *Should not be combined with {@link Result#subscribe} or ${@link Result#then} functions.*
	     *
	     * @public
	     * @returns {PeekableAsyncIterator<Record<R>, ResultSummary>} The async iterator for the Results
	     */
	    [Symbol.asyncIterator]() {
	        if (!this.isOpen()) {
	            const error = newError('Result is already consumed');
	            return {
	                next: () => Promise.reject(error),
	                peek: () => Promise.reject(error)
	            };
	        }
	        const state = { paused: true, firstRun: true, finished: false };
	        const controlFlow = () => {
	            if (state.streaming == null) {
	                return;
	            }
	            const size = state.queuedObserver?.size ?? 0;
	            const queueSizeIsOverHighOrEqualWatermark = size >= this._watermarks.high;
	            const queueSizeIsBellowOrEqualLowWatermark = size <= this._watermarks.low;
	            if (queueSizeIsOverHighOrEqualWatermark && !state.paused) {
	                state.paused = true;
	                state.streaming.pause();
	            }
	            else if ((queueSizeIsBellowOrEqualLowWatermark && state.paused) || (state.firstRun && !queueSizeIsOverHighOrEqualWatermark)) {
	                state.firstRun = false;
	                state.paused = false;
	                state.streaming.resume();
	            }
	        };
	        const initializeObserver = async () => {
	            if (state.queuedObserver === undefined) {
	                state.queuedObserver = this._createQueuedResultObserver(controlFlow);
	                state.streaming = await this._subscribe(state.queuedObserver, true).catch(() => undefined);
	                controlFlow();
	            }
	            return state.queuedObserver;
	        };
	        const assertSummary = (summary) => {
	            if (summary === undefined) {
	                throw newError('InvalidState: Result stream finished without Summary', PROTOCOL_ERROR$6);
	            }
	            return true;
	        };
	        return {
	            next: async () => {
	                if (state.finished) {
	                    if (assertSummary(state.summary)) {
	                        return { done: true, value: state.summary };
	                    }
	                }
	                const queuedObserver = await initializeObserver();
	                const next = await queuedObserver.dequeue();
	                if (next.done === true) {
	                    state.finished = next.done;
	                    state.summary = next.value;
	                }
	                return next;
	            },
	            return: async (value) => {
	                if (state.finished) {
	                    if (assertSummary(state.summary)) {
	                        return { done: true, value: value ?? state.summary };
	                    }
	                }
	                state.streaming?.cancel();
	                const queuedObserver = await initializeObserver();
	                const last = await queuedObserver.dequeueUntilDone();
	                state.finished = true;
	                last.value = value ?? last.value;
	                state.summary = last.value;
	                return last;
	            },
	            peek: async () => {
	                if (state.finished) {
	                    if (assertSummary(state.summary)) {
	                        return { done: true, value: state.summary };
	                    }
	                }
	                const queuedObserver = await initializeObserver();
	                return await queuedObserver.head();
	            }
	        };
	    }
	    /**
	     * Waits for all results and calls the passed in function with the results.
	     *
	     * *Should not be combined with {@link Result#subscribe} function.*
	     *
	     * @param {function(result: {records:Array<Record>, summary: ResultSummary})} onFulfilled - function to be called
	     * when finished.
	     * @param {function(error: {message:string, code:string})} onRejected - function to be called upon errors.
	     * @return {Promise} promise.
	     */
	    then(onFulfilled, onRejected) {
	        return this._getOrCreatePromise().then(onFulfilled, onRejected);
	    }
	    /**
	     * Catch errors when using promises.
	     *
	     * *Should not be combined with {@link Result#subscribe} function.*
	     *
	     * @param {function(error: Neo4jError)} onRejected - Function to be called upon errors.
	     * @return {Promise} promise.
	     */
	    catch(onRejected) {
	        return this._getOrCreatePromise().catch(onRejected);
	    }
	    /**
	     * Called when finally the result is done
	     *
	     * *Should not be combined with {@link Result#subscribe} function.*
	     * @param {function()|null} onfinally - function when the promise finished
	     * @return {Promise} promise.
	     */
	    [Symbol.toStringTag] = 'Result';
	    finally(onfinally) {
	        return this._getOrCreatePromise().finally(onfinally);
	    }
	    /**
	     * Stream records to observer as they come in, this is a more efficient method
	     * of handling the results, and allows you to handle arbitrarily large results.
	     *
	     * @param {Object} observer - Observer object
	     * @param {function(keys: string[])} observer.onKeys - handle stream head, the field keys.
	     * @param {function(record: Record)} observer.onNext - handle records, one by one.
	     * @param {function(summary: ResultSummary)} observer.onCompleted - handle stream tail, the result summary.
	     * @param {function(error: {message:string, code:string})} observer.onError - handle errors.
	     * @return {void}
	     */
	    subscribe(observer) {
	        this._subscribe(observer)
	            .catch(() => { });
	    }
	    /**
	     * Check if this result is active, i.e., neither a summary nor an error has been received by the result.
	     * @return {boolean} `true` when neither a summary or nor an error has been received by the result.
	     */
	    isOpen() {
	        return this._summary === null && this._error === null;
	    }
	    /**
	     * Stream records to observer as they come in, this is a more efficient method
	     * of handling the results, and allows you to handle arbitrarily large results.
	     *
	     * @access private
	     * @param {ResultObserver} observer The observer to send records to.
	     * @param {boolean} paused The flag to indicate if the stream should be started paused
	     * @returns {Promise<observer.ResultStreamObserver>} The result stream observer.
	     */
	    _subscribe(observer, paused = false) {
	        const _observer = this._decorateObserver(observer);
	        return this._streamObserverPromise
	            .then(o => {
	            if (paused) {
	                o.pause();
	            }
	            o.subscribe(_observer);
	            return o;
	        })
	            .catch(error => {
	            if (_observer.onError != null) {
	                _observer.onError(error);
	            }
	            return Promise.reject(error);
	        });
	    }
	    /**
	     * Decorates the ResultObserver with the necessary methods.
	     *
	     * @access private
	     * @param {ResultObserver} observer The ResultObserver to decorate.
	     * @returns The decorated result observer
	     */
	    _decorateObserver(observer) {
	        const onCompletedOriginal = observer.onCompleted ?? DEFAULT_ON_COMPLETED;
	        const onErrorOriginal = observer.onError ?? DEFAULT_ON_ERROR;
	        const onKeysOriginal = observer.onKeys ?? DEFAULT_ON_KEYS;
	        const onCompletedWrapper = (metadata) => {
	            this._releaseConnectionAndGetSummary(metadata).then(summary => {
	                if (this._summary !== null) {
	                    return onCompletedOriginal.call(observer, this._summary);
	                }
	                this._summary = summary;
	                return onCompletedOriginal.call(observer, summary);
	            }).catch(onErrorOriginal);
	        };
	        const onErrorWrapper = (error) => {
	            // notify connection holder that the used connection is not needed any more because error happened
	            // and result can't bee consumed any further; call the original onError callback after that
	            this._connectionHolder.releaseConnection().then(() => {
	                replaceStacktrace(error, this._stack);
	                this._error = error;
	                onErrorOriginal.call(observer, error);
	            }).catch(onErrorOriginal);
	        };
	        const onKeysWrapper = (keys) => {
	            this._keys = keys;
	            return onKeysOriginal.call(observer, keys);
	        };
	        return {
	            onNext: (observer.onNext != null) ? observer.onNext.bind(observer) : undefined,
	            onKeys: onKeysWrapper,
	            onCompleted: onCompletedWrapper,
	            onError: onErrorWrapper
	        };
	    }
	    /**
	     * Signals the stream observer that the future records should be discarded on the server.
	     *
	     * @protected
	     * @since 4.0.0
	     * @returns {void}
	     */
	    _cancel() {
	        if (this._summary === null && this._error === null) {
	            this._streamObserverPromise.then(o => o.cancel())
	                .catch(() => { });
	        }
	    }
	    /**
	     * @access private
	     * @param metadata
	     * @returns
	     */
	    _releaseConnectionAndGetSummary(metadata) {
	        const { validatedQuery: query, params: parameters } = validateQueryAndParameters(this._query, this._parameters, {
	            skipAsserts: true
	        });
	        const connectionHolder = this._connectionHolder;
	        return connectionHolder
	            .getConnection()
	            .then(
	        // onFulfilled:
	        connection => connectionHolder
	            .releaseConnection()
	            .then(() => connection?.getProtocolVersion()), 
	        // onRejected:
	        _ => undefined)
	            .then(protocolVersion => new ResultSummary(query, parameters, metadata, protocolVersion));
	    }
	    /**
	     * @access private
	     */
	    _createQueuedResultObserver(onQueueSizeChanged) {
	        function createResolvablePromise() {
	            const resolvablePromise = {};
	            resolvablePromise.promise = new Promise((resolve, reject) => {
	                resolvablePromise.resolve = resolve;
	                resolvablePromise.reject = reject;
	            });
	            return resolvablePromise;
	        }
	        function isError(elementOrError) {
	            return elementOrError instanceof Error;
	        }
	        async function dequeue() {
	            if (buffer.length > 0) {
	                const element = buffer.shift() ?? newError('Unexpected empty buffer', PROTOCOL_ERROR$6);
	                onQueueSizeChanged();
	                if (isError(element)) {
	                    throw element;
	                }
	                return element;
	            }
	            promiseHolder.resolvable = createResolvablePromise();
	            return await promiseHolder.resolvable.promise;
	        }
	        const buffer = [];
	        const promiseHolder = { resolvable: null };
	        const observer = {
	            onNext: (record) => {
	                observer._push({ done: false, value: record });
	            },
	            onCompleted: (summary) => {
	                observer._push({ done: true, value: summary });
	            },
	            onError: (error) => {
	                observer._push(error);
	            },
	            _push(element) {
	                if (promiseHolder.resolvable !== null) {
	                    const resolvable = promiseHolder.resolvable;
	                    promiseHolder.resolvable = null;
	                    if (isError(element)) {
	                        resolvable.reject(element);
	                    }
	                    else {
	                        resolvable.resolve(element);
	                    }
	                }
	                else {
	                    buffer.push(element);
	                    onQueueSizeChanged();
	                }
	            },
	            dequeue,
	            dequeueUntilDone: async () => {
	                while (true) {
	                    const element = await dequeue();
	                    if (element.done === true) {
	                        return element;
	                    }
	                }
	            },
	            head: async () => {
	                if (buffer.length > 0) {
	                    const element = buffer[0];
	                    if (isError(element)) {
	                        throw element;
	                    }
	                    return element;
	                }
	                promiseHolder.resolvable = createResolvablePromise();
	                try {
	                    const element = await promiseHolder.resolvable.promise;
	                    buffer.unshift(element);
	                    return element;
	                }
	                catch (error) {
	                    buffer.unshift(error);
	                    throw error;
	                }
	                finally {
	                    onQueueSizeChanged();
	                }
	            },
	            get size() {
	                return buffer.length;
	            }
	        };
	        return observer;
	    }
	}
	function captureStacktrace() {
	    const error = new Error('');
	    if (error.stack != null) {
	        return error.stack.replace(/^Error(\n\r)*/, ''); // we don't need the 'Error\n' part, if only it exists
	    }
	    return null;
	}
	/**
	 * @private
	 * @param {Error} error The error
	 * @param {string| null} newStack The newStack
	 * @returns {void}
	 */
	function replaceStacktrace(error, newStack) {
	    if (newStack != null) {
	        // Error.prototype.toString() concatenates error.name and error.message nicely
	        // then we add the rest of the stack trace
	        // eslint-disable-next-line @typescript-eslint/no-base-to-string
	        error.stack = error.toString() + '\n' + newStack;
	    }
	}

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
	 * Represents the fully streamed result
	 */
	class EagerResult {
	    keys;
	    records;
	    summary;
	    /**
	     * @constructor
	     * @private
	     * @param {string[]} keys The records keys
	     * @param {Record[]} records The resulted records
	     * @param {ResultSummary[]} summary The result Summary
	     */
	    constructor(keys, records, summary) {
	        /**
	         * Field keys, in the order the fields appear in the records.
	         * @type {string[]}
	         */
	        this.keys = keys;
	        /**
	         * Field records, in the order the records arrived from the server.
	         * @type {Record[]}
	         */
	        this.records = records;
	        /**
	         * Field summary
	         * @type {ResultSummary}
	         */
	        this.summary = summary;
	    }
	}

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
	 * Interface define a common way to acquire a connection
	 *
	 * @private
	 */
	class ConnectionProvider {
	    /**
	     * This method acquires a connection against the specified database.
	     *
	     * Access mode and Bookmarks only applies to routing driver. Access mode only
	     * differentiates the target server for the connection, where WRITE selects a
	     * WRITER server, whereas READ selects a READ server. Bookmarks, when specified,
	     * is only passed to the routing discovery procedure, for the system database to
	     * synchronize on creation of databases and is never used in direct drivers.
	     *
	     * @param {object} param - object parameter
	     * @property {string} param.accessMode - the access mode for the to-be-acquired connection
	     * @property {string} param.database - the target database for the to-be-acquired connection
	     * @property {Bookmarks} param.bookmarks - the bookmarks to send to routing discovery
	     * @property {string} param.impersonatedUser - the impersonated user
	     * @property {function (databaseName:string?)} param.onDatabaseNameResolved - Callback called when the database name get resolved
	     * @returns {Promise<Connection>}
	     */
	    acquireConnection(param) {
	        throw Error('Not implemented');
	    }
	    /**
	     * This method checks whether the backend database supports multi database functionality
	     * by checking protocol handshake result.
	     *
	     * @returns {Promise<boolean>}
	     */
	    supportsMultiDb() {
	        throw Error('Not implemented');
	    }
	    /**
	     * This method checks whether the backend database supports transaction config functionality
	     * by checking protocol handshake result.
	     *
	     * @returns {Promise<boolean>}
	     */
	    supportsTransactionConfig() {
	        throw Error('Not implemented');
	    }
	    /**
	     * This method checks whether the backend database supports transaction config functionality
	     * by checking protocol handshake result.
	     *
	     * @returns {Promise<boolean>}
	     */
	    supportsUserImpersonation() {
	        throw Error('Not implemented');
	    }
	    /**
	     * This method checks whether the driver session re-auth functionality
	     * by checking protocol handshake result
	     *
	     * @returns {Promise<boolean>}
	     */
	    supportsSessionAuth() {
	        throw Error('Not implemented');
	    }
	    /**
	     * This method verifies the connectivity of the database by trying to acquire a connection
	     * for each server available in the cluster.
	     *
	     * @param {object} param - object parameter
	     * @property {string} param.database - the target database for the to-be-acquired connection
	     * @property {string} param.accessMode - the access mode for the to-be-acquired connection
	     *
	     * @returns {Promise<ServerInfo>} promise resolved with server info or rejected with error.
	     */
	    verifyConnectivityAndGetServerInfo(param) {
	        throw Error('Not implemented');
	    }
	    /**
	     * This method verifies the authorization credentials work by trying to acquire a connection
	     * to one of the servers with the given credentials.
	     *
	     * @param {object} param - object parameter
	     * @property {AuthToken} param.auth - the target auth for the to-be-acquired connection
	     * @property {string} param.database - the target database for the to-be-acquired connection
	     * @property {string} param.accessMode - the access mode for the to-be-acquired connection
	     *
	     * @returns {Promise<boolean>} promise resolved with true if succeed, false if failed with
	     *  authentication issue and rejected with error if non-authentication error happens.
	     */
	    verifyAuthentication(param) {
	        throw Error('Not implemented');
	    }
	    /**
	     * Returns the protocol version negotiated via handshake.
	     *
	     * Note that this function call _always_ causes a round-trip to the server.
	     *
	     * @returns {Promise<number>} the protocol version negotiated via handshake.
	     * @throws {Error} When protocol negotiation fails
	     */
	    getNegotiatedProtocolVersion() {
	        throw Error('Not Implemented');
	    }
	    /**
	     * Closes this connection provider along with its internals (connections, pools, etc.)
	     *
	     * @returns {Promise<void>}
	     */
	    close() {
	        throw Error('Not implemented');
	    }
	}

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
	/* eslint-disable @typescript-eslint/promise-function-async */
	/**
	 * Interface which defines a connection for the core driver object.
	 *
	 *
	 * This connection exposes only methods used by the code module.
	 * Methods with connection implementation details can be defined and used
	 * by the implementation layer.
	 *
	 * @private
	 * @interface
	 */
	class Connection$1 {
	    beginTransaction(config) {
	        throw new Error('Not implemented');
	    }
	    run(query, parameters, config) {
	        throw new Error('Not implemented');
	    }
	    commitTransaction(config) {
	        throw new Error('Not implemented');
	    }
	    rollbackTransaction(config) {
	        throw new Error('Not implemented');
	    }
	    resetAndFlush() {
	        throw new Error('Not implemented');
	    }
	    isOpen() {
	        throw new Error('Not implemented');
	    }
	    getProtocolVersion() {
	        throw new Error('Not implemented');
	    }
	    hasOngoingObservableRequests() {
	        throw new Error('Not implemented');
	    }
	}

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
	 * Represents a transaction in the Neo4j database.
	 *
	 * @access public
	 */
	class Transaction {
	    _connectionHolder;
	    _reactive;
	    _state;
	    _onClose;
	    _onBookmarks;
	    _onConnection;
	    _onError;
	    _onComplete;
	    _fetchSize;
	    _results;
	    _impersonatedUser;
	    _lowRecordWatermak;
	    _highRecordWatermark;
	    _bookmarks;
	    _activePromise;
	    _acceptActive;
	    _notificationFilter;
	    _apiTelemetryConfig;
	    /**
	     * @constructor
	     * @param {object} args
	     * @param {ConnectionHolder} args.connectionHolder - the connection holder to get connection from.
	     * @param {function()} args.onClose - Function to be called when transaction is committed or rolled back.
	     * @param {function(bookmarks: Bookmarks)} args.onBookmarks callback invoked when new bookmark is produced.
	     * @param {function()} args.onConnection - Function to be called when a connection is obtained to ensure the conneciton
	     * is not yet released.
	     * @param {boolean} args.reactive whether this transaction generates reactive streams
	     * @param {number} args.fetchSize - the record fetch size in each pulling batch.
	     * @param {string} args.impersonatedUser - The name of the user which should be impersonated for the duration of the session.
	     * @param {number} args.highRecordWatermark - The high watermark for the record buffer.
	     * @param {number} args.lowRecordWatermark - The low watermark for the record buffer.
	     * @param {NotificationFilter} args.notificationFilter - The notification filter used for this transaction.
	     * @param {NonAutoCommitApiTelemetryConfig} args.apiTelemetryConfig - The api telemetry configuration. Empty/Null for disabling telemetry
	     */
	    constructor({ connectionHolder, onClose, onBookmarks, onConnection, reactive, fetchSize, impersonatedUser, highRecordWatermark, lowRecordWatermark, notificationFilter, apiTelemetryConfig }) {
	        this._connectionHolder = connectionHolder;
	        this._reactive = reactive;
	        this._state = _states$1.ACTIVE;
	        this._onClose = onClose;
	        this._onBookmarks = onBookmarks;
	        this._onConnection = onConnection;
	        this._onError = this._onErrorCallback.bind(this);
	        this._fetchSize = fetchSize;
	        this._onComplete = this._onCompleteCallback.bind(this);
	        this._results = [];
	        this._impersonatedUser = impersonatedUser;
	        this._lowRecordWatermak = lowRecordWatermark;
	        this._highRecordWatermark = highRecordWatermark;
	        this._bookmarks = Bookmarks$6.empty();
	        this._notificationFilter = notificationFilter;
	        this._apiTelemetryConfig = apiTelemetryConfig;
	        this._acceptActive = () => { }; // satisfy DenoJS
	        this._activePromise = new Promise((resolve, reject) => {
	            this._acceptActive = resolve;
	        });
	    }
	    /**
	     * @private
	     * @param {Bookmarks | string |  string []} bookmarks
	     * @param {TxConfig} txConfig
	     * @param {Object} events List of observers to events
	     * @returns {void}
	     */
	    _begin(getBookmarks, txConfig, events) {
	        this._connectionHolder
	            .getConnection()
	            .then(async (connection) => {
	            this._onConnection();
	            if (connection != null) {
	                this._bookmarks = await getBookmarks();
	                return connection.beginTransaction({
	                    bookmarks: this._bookmarks,
	                    txConfig,
	                    mode: this._connectionHolder.mode(),
	                    database: this._connectionHolder.database(),
	                    impersonatedUser: this._impersonatedUser,
	                    notificationFilter: this._notificationFilter,
	                    apiTelemetryConfig: this._apiTelemetryConfig,
	                    beforeError: (error) => {
	                        if (events != null) {
	                            events.onError(error);
	                        }
	                        this._onError(error).catch(() => { });
	                    },
	                    afterComplete: (metadata) => {
	                        if (events != null) {
	                            events.onComplete(metadata);
	                        }
	                        this._onComplete(metadata);
	                    }
	                });
	            }
	            else {
	                throw newError('No connection available');
	            }
	        })
	            .catch(error => {
	            if (events != null) {
	                events.onError(error);
	            }
	            this._onError(error).catch(() => { });
	        })
	            // It should make the transaction active anyway
	            // further errors will be treated by the existing
	            // observers
	            .finally(() => this._acceptActive());
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
	        const { validatedQuery, params } = validateQueryAndParameters(query, parameters);
	        const result = this._state.run(validatedQuery, params, {
	            connectionHolder: this._connectionHolder,
	            onError: this._onError,
	            onComplete: this._onComplete,
	            onConnection: this._onConnection,
	            reactive: this._reactive,
	            fetchSize: this._fetchSize,
	            highRecordWatermark: this._highRecordWatermark,
	            lowRecordWatermark: this._lowRecordWatermak,
	            preparationJob: this._activePromise
	        });
	        this._results.push(result);
	        return result;
	    }
	    /**
	     * Commits the transaction and returns the result.
	     *
	     * After committing the transaction can no longer be used.
	     *
	     * @returns {Promise<void>} An empty promise if committed successfully or error if any error happened during commit.
	     */
	    commit() {
	        const committed = this._state.commit({
	            connectionHolder: this._connectionHolder,
	            onError: this._onError,
	            onComplete: (meta) => this._onCompleteCallback(meta, this._bookmarks),
	            onConnection: this._onConnection,
	            pendingResults: this._results,
	            preparationJob: this._activePromise
	        });
	        this._state = committed.state;
	        // clean up
	        this._onClose();
	        return new Promise((resolve, reject) => {
	            committed.result.subscribe({
	                onCompleted: () => resolve(),
	                onError: (error) => reject(error)
	            });
	        });
	    }
	    /**
	     * Rollbacks the transaction.
	     *
	     * After rolling back, the transaction can no longer be used.
	     *
	     * @returns {Promise<void>} An empty promise if rolled back successfully or error if any error happened during
	     * rollback.
	     */
	    rollback() {
	        const rolledback = this._state.rollback({
	            connectionHolder: this._connectionHolder,
	            onError: this._onError,
	            onComplete: this._onComplete,
	            onConnection: this._onConnection,
	            pendingResults: this._results,
	            preparationJob: this._activePromise
	        });
	        this._state = rolledback.state;
	        // clean up
	        this._onClose();
	        return new Promise((resolve, reject) => {
	            rolledback.result.subscribe({
	                onCompleted: () => resolve(),
	                onError: (error) => reject(error)
	            });
	        });
	    }
	    /**
	     * Check if this transaction is active, which means commit and rollback did not happen.
	     * @return {boolean} `true` when not committed and not rolled back, `false` otherwise.
	     */
	    isOpen() {
	        return this._state === _states$1.ACTIVE;
	    }
	    /**
	     * Closes the transaction
	     *
	     * This method will roll back the transaction if it is not already committed or rolled back.
	     *
	     * @returns {Promise<void>} An empty promise if closed successfully or error if any error happened during
	     */
	    async close() {
	        if (this.isOpen()) {
	            await this.rollback();
	        }
	    }
	    // eslint-disable-next-line
	    // @ts-ignore
	    [Symbol.asyncDispose]() {
	        return this.close();
	    }
	    _onErrorCallback(error) {
	        // error will be "acknowledged" by sending a RESET message
	        // database will then forget about this transaction and cleanup all corresponding resources
	        // it is thus safe to move this transaction to a FAILED state and disallow any further interactions with it
	        this._state = _states$1.FAILED;
	        this._onClose();
	        this._results.forEach(result => {
	            if (result.isOpen()) {
	                // @ts-expect-error
	                result._streamObserverPromise
	                    .then(resultStreamObserver => resultStreamObserver.onError(error))
	                    // Nothing to do since we don't have a observer to notify the error
	                    // the result will be already broke in other ways.
	                    .catch((_) => { });
	            }
	        });
	        // release connection back to the pool
	        return this._connectionHolder.releaseConnection();
	    }
	    /**
	     * @private
	     * @param {object} meta The meta with bookmarks
	     * @returns {void}
	     */
	    _onCompleteCallback(meta, previousBookmarks) {
	        this._onBookmarks(new Bookmarks$6(meta?.bookmark), previousBookmarks ?? Bookmarks$6.empty(), meta?.db);
	    }
	}
	const _states$1 = {
	    // The transaction is running with no explicit success or failure marked
	    ACTIVE: {
	        commit: ({ connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob }) => {
	            return {
	                result: finishTransaction(true, connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob),
	                state: _states$1.SUCCEEDED
	            };
	        },
	        rollback: ({ connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob }) => {
	            return {
	                result: finishTransaction(false, connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob),
	                state: _states$1.ROLLED_BACK
	            };
	        },
	        run: (query, parameters, { connectionHolder, onError, onComplete, onConnection, reactive, fetchSize, highRecordWatermark, lowRecordWatermark, preparationJob }) => {
	            // RUN in explicit transaction can't contain bookmarks and transaction configuration
	            // No need to include mode and database name as it shall be included in begin
	            const requirements = preparationJob ?? Promise.resolve();
	            const observerPromise = connectionHolder.getConnection()
	                .then(conn => requirements.then(() => conn))
	                .then(conn => {
	                onConnection();
	                if (conn != null) {
	                    return conn.run(query, parameters, {
	                        bookmarks: Bookmarks$6.empty(),
	                        txConfig: TxConfig$3.empty(),
	                        beforeError: onError,
	                        afterComplete: onComplete,
	                        reactive,
	                        fetchSize,
	                        highRecordWatermark,
	                        lowRecordWatermark
	                    });
	                }
	                else {
	                    throw newError('No connection available');
	                }
	            })
	                .catch(error => new FailedObserver$1({ error, onError }));
	            return newCompletedResult(observerPromise, query, parameters, connectionHolder, highRecordWatermark, lowRecordWatermark);
	        }
	    },
	    // An error has occurred, transaction can no longer be used and no more messages will
	    // be sent for this transaction.
	    FAILED: {
	        commit: ({ connectionHolder, onError, onComplete }) => {
	            return {
	                result: newCompletedResult(new FailedObserver$1({
	                    error: newError('Cannot commit this transaction, because it has been rolled back either because of an error or explicit termination.'),
	                    onError
	                }), 'COMMIT', {}, connectionHolder, 0, // high watermark
	                0 // low watermark
	                ),
	                state: _states$1.FAILED
	            };
	        },
	        rollback: ({ connectionHolder, onError, onComplete }) => {
	            return {
	                result: newCompletedResult(new CompletedObserver$1(), 'ROLLBACK', {}, connectionHolder, 0, // high watermark
	                0 // low watermark
	                ),
	                state: _states$1.FAILED
	            };
	        },
	        run: (query, parameters, { connectionHolder, onError, onComplete }) => {
	            return newCompletedResult(new FailedObserver$1({
	                error: newError('Cannot run query in this transaction, because it has been rolled back either because of an error or explicit termination.'),
	                onError
	            }), query, parameters, connectionHolder, 0, // high watermark
	            0 // low watermark
	            );
	        }
	    },
	    // This transaction has successfully committed
	    SUCCEEDED: {
	        commit: ({ connectionHolder, onError, onComplete }) => {
	            return {
	                result: newCompletedResult(new FailedObserver$1({
	                    error: newError('Cannot commit this transaction, because it has already been committed.'),
	                    onError
	                }), 'COMMIT', {}, EMPTY_CONNECTION_HOLDER$1, 0, // high watermark
	                0 // low watermark
	                ),
	                state: _states$1.SUCCEEDED,
	                connectionHolder
	            };
	        },
	        rollback: ({ connectionHolder, onError, onComplete }) => {
	            return {
	                result: newCompletedResult(new FailedObserver$1({
	                    error: newError('Cannot rollback this transaction, because it has already been committed.'),
	                    onError
	                }), 'ROLLBACK', {}, EMPTY_CONNECTION_HOLDER$1, 0, // high watermark
	                0 // low watermark
	                ),
	                state: _states$1.SUCCEEDED,
	                connectionHolder
	            };
	        },
	        run: (query, parameters, { connectionHolder, onError, onComplete }) => {
	            return newCompletedResult(new FailedObserver$1({
	                error: newError('Cannot run query in this transaction, because it has already been committed.'),
	                onError
	            }), query, parameters, connectionHolder, 0, // high watermark
	            0 // low watermark
	            );
	        }
	    },
	    // This transaction has been rolled back
	    ROLLED_BACK: {
	        commit: ({ connectionHolder, onError, onComplete }) => {
	            return {
	                result: newCompletedResult(new FailedObserver$1({
	                    error: newError('Cannot commit this transaction, because it has already been rolled back.'),
	                    onError
	                }), 'COMMIT', {}, connectionHolder, 0, // high watermark
	                0 // low watermark
	                ),
	                state: _states$1.ROLLED_BACK
	            };
	        },
	        rollback: ({ connectionHolder, onError, onComplete }) => {
	            return {
	                result: newCompletedResult(new FailedObserver$1({
	                    error: newError('Cannot rollback this transaction, because it has already been rolled back.')
	                }), 'ROLLBACK', {}, connectionHolder, 0, // high watermark
	                0 // low watermark
	                ),
	                state: _states$1.ROLLED_BACK
	            };
	        },
	        run: (query, parameters, { connectionHolder, onError, onComplete }) => {
	            return newCompletedResult(new FailedObserver$1({
	                error: newError('Cannot run query in this transaction, because it has already been rolled back.'),
	                onError
	            }), query, parameters, connectionHolder, 0, // high watermark
	            0 // low watermark
	            );
	        }
	    }
	};
	/**
	 *
	 * @param {boolean} commit
	 * @param {ConnectionHolder} connectionHolder
	 * @param {function(err:Error): any} onError
	 * @param {function(metadata:object): any} onComplete
	 * @param {function() : any} onConnection
	 * @param {list<Result>>}pendingResults all run results in this transaction
	 */
	function finishTransaction(commit, connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob) {
	    const requirements = preparationJob ?? Promise.resolve();
	    const observerPromise = connectionHolder.getConnection()
	        .then(conn => requirements.then(() => conn))
	        .then(connection => {
	        onConnection();
	        pendingResults.forEach(r => r._cancel());
	        return Promise.all(pendingResults.map(result => result.summary())).then(results => {
	            if (connection != null) {
	                if (commit) {
	                    return connection.commitTransaction({
	                        beforeError: onError,
	                        afterComplete: onComplete
	                    });
	                }
	                else {
	                    return connection.rollbackTransaction({
	                        beforeError: onError,
	                        afterComplete: onComplete
	                    });
	                }
	            }
	            else {
	                throw newError('No connection available');
	            }
	        });
	    })
	        .catch(error => new FailedObserver$1({ error, onError }));
	    // for commit & rollback we need result that uses real connection holder and notifies it when
	    // connection is not needed and can be safely released to the pool
	    return new Result(observerPromise, commit ? 'COMMIT' : 'ROLLBACK', {}, connectionHolder, {
	        high: Number.MAX_VALUE,
	        low: Number.MAX_VALUE
	    });
	}
	/**
	 * Creates a {@link Result} with empty connection holder.
	 * For cases when result represents an intermediate or failed action, does not require any metadata and does not
	 * need to influence real connection holder to release connections.
	 * @param {ResultStreamObserver} observer - an observer for the created result.
	 * @param {string} query - the cypher query that produced the result.
	 * @param {Object} parameters - the parameters for cypher query that produced the result.
	 * @param {ConnectionHolder} connectionHolder - the connection holder used to get the result
	 * @return {Result} new result.
	 * @private
	 */
	function newCompletedResult(observerPromise, query, parameters, connectionHolder = EMPTY_CONNECTION_HOLDER$1, highRecordWatermark, lowRecordWatermark) {
	    return new Result(Promise.resolve(observerPromise), query, parameters, new ReadOnlyConnectionHolder(connectionHolder ?? EMPTY_CONNECTION_HOLDER$1), {
	        low: lowRecordWatermark,
	        high: highRecordWatermark
	    });
	}

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
	 * Represents a {@link Promise<Transaction>} object and a {@link Transaction} object.
	 *
	 * Resolving this object promise verifies the result of the transaction begin and returns the {@link Transaction} object in case of success.
	 *
	 * The object can still also used as {@link Transaction} for convenience. The result of begin will be checked
	 * during the next API calls in the object as it is in the transaction.
	 *
	 * @access public
	 */
	class TransactionPromise extends Transaction {
	    [Symbol.toStringTag] = 'TransactionPromise';
	    _beginError;
	    _beginMetadata;
	    _beginPromise;
	    _reject;
	    _resolve;
	    /**
	     * @constructor
	     * @param {object} args
	     * @param {ConnectionHolder} args.connectionHolder - the connection holder to get connection from.
	     * @param {function()} args.onClose - Function to be called when transaction is committed or rolled back.
	     * @param {function(bookmarks: Bookmarks)} args.onBookmarks callback invoked when new bookmark is produced.
	     * @param {function()} args.onConnection - Function to be called when a connection is obtained to ensure the connection
	     * is not yet released.
	     * @param {boolean} args.reactive whether this transaction generates reactive streams
	     * @param {number} args.fetchSize - the record fetch size in each pulling batch.
	     * @param {string} args.impersonatedUser - The name of the user which should be impersonated for the duration of the session.
	     * @param {NotificationFilter} args.notificationFilter - The notification filter used for this transaction.
	     * @param {NonAutoCommitApiTelemetryConfig} args.apiTelemetryConfig - The api telemetry configuration. Empty/Null for disabling telemetry
	     */
	    constructor({ connectionHolder, onClose, onBookmarks, onConnection, reactive, fetchSize, impersonatedUser, highRecordWatermark, lowRecordWatermark, notificationFilter, apiTelemetryConfig }) {
	        super({
	            connectionHolder,
	            onClose,
	            onBookmarks,
	            onConnection,
	            reactive,
	            fetchSize,
	            impersonatedUser,
	            highRecordWatermark,
	            lowRecordWatermark,
	            notificationFilter,
	            apiTelemetryConfig
	        });
	    }
	    /**
	     * Waits for the begin to complete.
	     *
	     * @param {function(transaction: Transaction)} onFulfilled - function to be called when finished.
	     * @param {function(error: {message:string, code:string})} onRejected - function to be called upon errors.
	     * @return {Promise} promise.
	     */
	    then(onfulfilled, onrejected) {
	        return this._getOrCreateBeginPromise().then(onfulfilled, onrejected);
	    }
	    /**
	     * Catch errors when using promises.
	     *
	     * @param {function(error: Neo4jError)} onRejected - Function to be called upon errors.
	     * @return {Promise} promise.
	     */
	    catch(onrejected) {
	        return this._getOrCreateBeginPromise().catch(onrejected);
	    }
	    /**
	     * Called when finally the begin is done
	     *
	     * @param {function()|null} onfinally - function when the promise finished
	     * @return {Promise} promise.
	     */
	    finally(onfinally) {
	        return this._getOrCreateBeginPromise().finally(onfinally);
	    }
	    _getOrCreateBeginPromise() {
	        if (this._beginPromise == null) {
	            this._beginPromise = new Promise((resolve, reject) => {
	                this._resolve = resolve;
	                this._reject = reject;
	                if (this._beginError != null) {
	                    reject(this._beginError);
	                }
	                if (this._beginMetadata != null) {
	                    resolve(this._toTransaction());
	                }
	            });
	        }
	        return this._beginPromise;
	    }
	    /**
	     * @access private
	     */
	    _toTransaction() {
	        return {
	            // eslint-disable-next-line @typescript-eslint/no-misused-promises
	            ...this,
	            run: super.run.bind(this),
	            commit: super.commit.bind(this),
	            rollback: super.rollback.bind(this),
	            close: super.close.bind(this),
	            isOpen: super.isOpen.bind(this),
	            _begin: this._begin.bind(this)
	        };
	    }
	    /**
	     * @access private
	     */
	    _begin(bookmarks, txConfig) {
	        return super._begin(bookmarks, txConfig, {
	            onError: this._onBeginError.bind(this),
	            onComplete: this._onBeginMetadata.bind(this)
	        });
	    }
	    /**
	     * @access private
	     * @returns {void}
	     */
	    _onBeginError(error) {
	        this._beginError = error;
	        if (this._reject != null) {
	            this._reject(error);
	        }
	    }
	    /**
	     * @access private
	     * @returns {void}
	     */
	    _onBeginMetadata(metadata) {
	        this._beginMetadata = metadata ?? {};
	        if (this._resolve != null) {
	            this._resolve(this._toTransaction());
	        }
	    }
	}

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
	 * A Session instance is used for handling the connection and
	 * sending queries through the connection.
	 * In a single session, multiple queries will be executed serially.
	 * In order to execute parallel queries, multiple sessions are required.
	 * @access public
	 */
	class Session {
	    _mode;
	    _database;
	    _reactive;
	    _fetchSize;
	    _readConnectionHolder;
	    _writeConnectionHolder;
	    _open;
	    _hasTx;
	    _lastBookmarks;
	    _configuredBookmarks;
	    _transactionExecutor;
	    _impersonatedUser;
	    _databaseNameResolved;
	    _lowRecordWatermark;
	    _highRecordWatermark;
	    _results;
	    _bookmarkManager;
	    _notificationFilter;
	    _log;
	    /**
	     * @constructor
	     * @protected
	     * @param {Object} args
	     * @param {string} args.mode the default access mode for this session.
	     * @param {ConnectionProvider} args.connectionProvider - The connection provider to acquire connections from.
	     * @param {Bookmarks} args.bookmarks - The initial bookmarks for this session.
	     * @param {string} args.database the database name
	     * @param {Object} args.config={} - This driver configuration.
	     * @param {boolean} args.reactive - Whether this session should create reactive streams
	     * @param {number} args.fetchSize - Defines how many records is pulled in each pulling batch
	     * @param {string} args.impersonatedUser - The username which the user wants to impersonate for the duration of the session.
	     * @param {AuthToken} args.auth - the target auth for the to-be-acquired connection
	     * @param {NotificationFilter} args.notificationFilter - The notification filter used for this session.
	     */
	    constructor({ mode, connectionProvider, bookmarks, database, config, reactive, fetchSize, impersonatedUser, bookmarkManager, notificationFilter, auth, log }) {
	        this._mode = mode;
	        this._database = database;
	        this._reactive = reactive;
	        this._fetchSize = fetchSize;
	        this._onDatabaseNameResolved = this._onDatabaseNameResolved.bind(this);
	        this._getConnectionAcquistionBookmarks = this._getConnectionAcquistionBookmarks.bind(this);
	        this._readConnectionHolder = new ConnectionHolder({
	            mode: ACCESS_MODE_READ$1,
	            auth,
	            database,
	            bookmarks,
	            connectionProvider,
	            impersonatedUser,
	            onDatabaseNameResolved: this._onDatabaseNameResolved,
	            getConnectionAcquistionBookmarks: this._getConnectionAcquistionBookmarks,
	            log
	        });
	        this._writeConnectionHolder = new ConnectionHolder({
	            mode: ACCESS_MODE_WRITE$1,
	            auth,
	            database,
	            bookmarks,
	            connectionProvider,
	            impersonatedUser,
	            onDatabaseNameResolved: this._onDatabaseNameResolved,
	            getConnectionAcquistionBookmarks: this._getConnectionAcquistionBookmarks,
	            log
	        });
	        this._open = true;
	        this._hasTx = false;
	        this._impersonatedUser = impersonatedUser;
	        this._lastBookmarks = bookmarks ?? Bookmarks$6.empty();
	        this._configuredBookmarks = this._lastBookmarks;
	        this._transactionExecutor = _createTransactionExecutor(config);
	        this._databaseNameResolved = this._database !== '';
	        const calculatedWatermaks = this._calculateWatermaks();
	        this._lowRecordWatermark = calculatedWatermaks.low;
	        this._highRecordWatermark = calculatedWatermaks.high;
	        this._results = [];
	        this._bookmarkManager = bookmarkManager;
	        this._notificationFilter = notificationFilter;
	        this._log = log;
	    }
	    /**
	     * Run Cypher query
	     * Could be called with a query object i.e.: `{text: "MATCH ...", parameters: {param: 1}}`
	     * or with the query and parameters as separate arguments.
	     *
	     * @public
	     * @param {mixed} query - Cypher query to execute
	     * @param {Object} parameters - Map with parameters to use in query
	     * @param {TransactionConfig} [transactionConfig] - Configuration for the new auto-commit transaction.
	     * @return {Result} New Result.
	     */
	    run(query, parameters, transactionConfig) {
	        const { validatedQuery, params } = validateQueryAndParameters(query, parameters);
	        const autoCommitTxConfig = (transactionConfig != null)
	            ? new TxConfig$3(transactionConfig, this._log)
	            : TxConfig$3.empty();
	        const result = this._run(validatedQuery, params, async (connection) => {
	            const bookmarks = await this._bookmarks();
	            this._assertSessionIsOpen();
	            return connection.run(validatedQuery, params, {
	                bookmarks,
	                txConfig: autoCommitTxConfig,
	                mode: this._mode,
	                database: this._database,
	                apiTelemetryConfig: {
	                    api: TELEMETRY_APIS.AUTO_COMMIT_TRANSACTION
	                },
	                impersonatedUser: this._impersonatedUser,
	                afterComplete: (meta) => this._onCompleteCallback(meta, bookmarks),
	                reactive: this._reactive,
	                fetchSize: this._fetchSize,
	                lowRecordWatermark: this._lowRecordWatermark,
	                highRecordWatermark: this._highRecordWatermark,
	                notificationFilter: this._notificationFilter
	            });
	        });
	        this._results.push(result);
	        return result;
	    }
	    _run(query, parameters, customRunner) {
	        const { connectionHolder, resultPromise } = this._acquireAndConsumeConnection(customRunner);
	        const observerPromise = resultPromise.catch(error => Promise.resolve(new FailedObserver$1({ error })));
	        const watermarks = { high: this._highRecordWatermark, low: this._lowRecordWatermark };
	        return new Result(observerPromise, query, parameters, connectionHolder, watermarks);
	    }
	    /**
	     * This method is used by Rediscovery on the neo4j-driver-bolt-protocol package.
	     *
	     * @private
	     * @param {function()} connectionConsumer The method which will use the connection
	     * @returns {Promise<T>} A connection promise
	     */
	    _acquireConnection(connectionConsumer) {
	        const { connectionHolder, resultPromise } = this._acquireAndConsumeConnection(connectionConsumer);
	        return resultPromise.then(async (result) => {
	            await connectionHolder.releaseConnection();
	            return result;
	        });
	    }
	    /**
	     * Acquires a {@link Connection}, consume it and return a promise of the result along with
	     * the {@link ConnectionHolder} used in the process.
	     *
	     * @private
	     * @param connectionConsumer
	     * @returns {object} The connection holder and connection promise.
	     */
	    _acquireAndConsumeConnection(connectionConsumer) {
	        let resultPromise;
	        const connectionHolder = this._connectionHolderWithMode(this._mode);
	        if (!this._open) {
	            resultPromise = Promise.reject(newError('Cannot run query in a closed session.'));
	        }
	        else if (!this._hasTx && connectionHolder.initializeConnection()) {
	            resultPromise = connectionHolder
	                .getConnection()
	                // Connection won't be null at this point since the initialize method
	                // return
	                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	                .then(connection => connectionConsumer(connection));
	        }
	        else {
	            resultPromise = Promise.reject(newError('Queries cannot be run directly on a ' +
	                'session with an open transaction; either run from within the ' +
	                'transaction or use a different session.'));
	        }
	        return { connectionHolder, resultPromise };
	    }
	    /**
	     * Begin a new transaction in this session. A session can have at most one transaction running at a time, if you
	     * want to run multiple concurrent transactions, you should use multiple concurrent sessions.
	     *
	     * While a transaction is open the session cannot be used to run queries outside the transaction.
	     *
	     * @param {TransactionConfig} [transactionConfig] - Configuration for the new auto-commit transaction.
	     * @returns {TransactionPromise} New Transaction.
	     */
	    beginTransaction(transactionConfig) {
	        // this function needs to support bookmarks parameter for backwards compatibility
	        // parameter was of type {string|string[]} and represented either a single or multiple bookmarks
	        // that's why we need to check parameter type and decide how to interpret the value
	        const arg = transactionConfig;
	        let txConfig = TxConfig$3.empty();
	        if (arg != null) {
	            txConfig = new TxConfig$3(arg, this._log);
	        }
	        return this._beginTransaction(this._mode, txConfig, { api: TELEMETRY_APIS.UNMANAGED_TRANSACTION });
	    }
	    _beginTransaction(accessMode, txConfig, apiTelemetryConfig) {
	        if (!this._open) {
	            throw newError('Cannot begin a transaction on a closed session.');
	        }
	        if (this._hasTx) {
	            throw newError('You cannot begin a transaction on a session with an open transaction; ' +
	                'either run from within the transaction or use a different session.');
	        }
	        const mode = Session._validateSessionMode(accessMode);
	        const connectionHolder = this._connectionHolderWithMode(mode);
	        connectionHolder.initializeConnection();
	        this._hasTx = true;
	        const tx = new TransactionPromise({
	            connectionHolder,
	            impersonatedUser: this._impersonatedUser,
	            onClose: this._transactionClosed.bind(this),
	            onBookmarks: (newBm, oldBm, db) => this._updateBookmarks(newBm, oldBm, db),
	            onConnection: this._assertSessionIsOpen.bind(this),
	            reactive: this._reactive,
	            fetchSize: this._fetchSize,
	            lowRecordWatermark: this._lowRecordWatermark,
	            highRecordWatermark: this._highRecordWatermark,
	            notificationFilter: this._notificationFilter,
	            apiTelemetryConfig
	        });
	        tx._begin(() => this._bookmarks(), txConfig);
	        return tx;
	    }
	    /**
	     * @private
	     * @returns {void}
	     */
	    _assertSessionIsOpen() {
	        if (!this._open) {
	            throw newError('You cannot run more transactions on a closed session.');
	        }
	    }
	    /**
	     * @private
	     * @returns {void}
	     */
	    _transactionClosed() {
	        this._hasTx = false;
	    }
	    /**
	     * Return the bookmarks received following the last completed {@link Transaction}.
	     *
	     * @deprecated This method will be removed in version 6.0. Please, use Session#lastBookmarks instead.
	     *
	     * @return {string[]} A reference to a previous transaction.
	     * @see {@link Session#lastBookmarks}
	     */
	    lastBookmark() {
	        return this.lastBookmarks();
	    }
	    /**
	     * Return the bookmarks received following the last completed {@link Transaction}.
	     *
	     * @return {string[]} A reference to a previous transaction.
	     */
	    lastBookmarks() {
	        return this._lastBookmarks.values();
	    }
	    async _bookmarks() {
	        const bookmarks = await this._bookmarkManager?.getBookmarks();
	        if (bookmarks === undefined) {
	            return this._lastBookmarks;
	        }
	        return new Bookmarks$6([...bookmarks, ...this._configuredBookmarks]);
	    }
	    /**
	     * Execute given unit of work in a {@link READ} transaction.
	     *
	     * Transaction will automatically be committed unless the given function throws or returns a rejected promise.
	     * Some failures of the given function or the commit itself will be retried with exponential backoff with initial
	     * delay of 1 second and maximum retry time of 30 seconds. Maximum retry time is configurable via driver config's
	     * `maxTransactionRetryTime` property in milliseconds.
	     *
	     * @deprecated This method will be removed in version 6.0. Please, use Session#executeRead instead.
	     *
	     * @param {function(tx: Transaction): Promise} transactionWork - Callback that executes operations against
	     * a given {@link Transaction}.
	     * @param {TransactionConfig} [transactionConfig] - Configuration for all transactions started to execute the unit of work.
	     * @return {Promise} Resolved promise as returned by the given function or rejected promise when given
	     * function or commit fails.
	     * @see {@link Session#executeRead}
	     */
	    readTransaction(transactionWork, transactionConfig) {
	        const config = new TxConfig$3(transactionConfig, this._log);
	        return this._runTransaction(ACCESS_MODE_READ$1, config, transactionWork);
	    }
	    /**
	     * Execute given unit of work in a {@link WRITE} transaction.
	     *
	     * Transaction will automatically be committed unless the given function throws or returns a rejected promise.
	     * Some failures of the given function or the commit itself will be retried with exponential backoff with initial
	     * delay of 1 second and maximum retry time of 30 seconds. Maximum retry time is configurable via driver config's
	     * `maxTransactionRetryTime` property in milliseconds.
	     *
	     * @deprecated This method will be removed in version 6.0. Please, use Session#executeWrite instead.
	     *
	     * @param {function(tx: Transaction): Promise} transactionWork - Callback that executes operations against
	     * a given {@link Transaction}.
	     * @param {TransactionConfig} [transactionConfig] - Configuration for all transactions started to execute the unit of work.
	     * @return {Promise} Resolved promise as returned by the given function or rejected promise when given
	     * function or commit fails.
	     * @see {@link Session#executeWrite}
	     */
	    writeTransaction(transactionWork, transactionConfig) {
	        const config = new TxConfig$3(transactionConfig, this._log);
	        return this._runTransaction(ACCESS_MODE_WRITE$1, config, transactionWork);
	    }
	    _runTransaction(accessMode, transactionConfig, transactionWork) {
	        return this._transactionExecutor.execute((apiTelemetryConfig) => this._beginTransaction(accessMode, transactionConfig, apiTelemetryConfig), transactionWork);
	    }
	    /**
	     * Execute given unit of work in a {@link READ} transaction.
	     *
	     * Transaction will automatically be committed unless the given function throws or returns a rejected promise.
	     * Some failures of the given function or the commit itself will be retried with exponential backoff with initial
	     * delay of 1 second and maximum retry time of 30 seconds. Maximum retry time is configurable via driver config's
	     * `maxTransactionRetryTime` property in milliseconds.
	     *
	     * @param {function(tx: ManagedTransaction): Promise} transactionWork - Callback that executes operations against
	     * a given {@link Transaction}.
	     * @param {TransactionConfig} [transactionConfig] - Configuration for all transactions started to execute the unit of work.
	     * @return {Promise} Resolved promise as returned by the given function or rejected promise when given
	     * function or commit fails.
	     */
	    executeRead(transactionWork, transactionConfig) {
	        const config = new TxConfig$3(transactionConfig, this._log);
	        return this._executeInTransaction(ACCESS_MODE_READ$1, config, transactionWork);
	    }
	    /**
	     * Execute given unit of work in a {@link WRITE} transaction.
	     *
	     * Transaction will automatically be committed unless the given function throws or returns a rejected promise.
	     * Some failures of the given function or the commit itself will be retried with exponential backoff with initial
	     * delay of 1 second and maximum retry time of 30 seconds. Maximum retry time is configurable via driver config's
	     * `maxTransactionRetryTime` property in milliseconds.
	     *
	     * @param {function(tx: ManagedTransaction): Promise} transactionWork - Callback that executes operations against
	     * a given {@link Transaction}.
	     * @param {TransactionConfig} [transactionConfig] - Configuration for all transactions started to execute the unit of work.
	     * @return {Promise} Resolved promise as returned by the given function or rejected promise when given
	     * function or commit fails.
	     */
	    executeWrite(transactionWork, transactionConfig) {
	        const config = new TxConfig$3(transactionConfig, this._log);
	        return this._executeInTransaction(ACCESS_MODE_WRITE$1, config, transactionWork);
	    }
	    /**
	     * @private
	     * @param {SessionMode} accessMode
	     * @param {TxConfig} transactionConfig
	     * @param {ManagedTransactionWork} transactionWork
	     * @returns {Promise}
	     */
	    _executeInTransaction(accessMode, transactionConfig, transactionWork) {
	        return this._transactionExecutor.execute((apiTelemetryConfig) => this._beginTransaction(accessMode, transactionConfig, apiTelemetryConfig), transactionWork, ManagedTransaction.fromTransaction);
	    }
	    /**
	     * Sets the resolved database name in the session context.
	     * @private
	     * @param {string|undefined} database The resolved database name
	     * @returns {void}
	     */
	    _onDatabaseNameResolved(database) {
	        if (!this._databaseNameResolved) {
	            const normalizedDatabase = database ?? '';
	            this._database = normalizedDatabase;
	            this._readConnectionHolder.setDatabase(normalizedDatabase);
	            this._writeConnectionHolder.setDatabase(normalizedDatabase);
	            this._databaseNameResolved = true;
	        }
	    }
	    async _getConnectionAcquistionBookmarks() {
	        const bookmarks = await this._bookmarkManager?.getBookmarks();
	        if (bookmarks === undefined) {
	            return this._lastBookmarks;
	        }
	        return new Bookmarks$6([...this._configuredBookmarks, ...bookmarks]);
	    }
	    /**
	     * Update value of the last bookmarks.
	     * @private
	     * @param {Bookmarks} newBookmarks - The new bookmarks.
	     * @returns {void}
	     */
	    _updateBookmarks(newBookmarks, previousBookmarks, database) {
	        if ((newBookmarks != null) && !newBookmarks.isEmpty()) {
	            this._bookmarkManager?.updateBookmarks(previousBookmarks?.values() ?? [], newBookmarks?.values() ?? []).catch(() => { });
	            this._lastBookmarks = newBookmarks;
	            this._configuredBookmarks = Bookmarks$6.empty();
	        }
	    }
	    /**
	     * Close this session.
	     * @return {Promise}
	     */
	    async close() {
	        if (this._open) {
	            this._open = false;
	            this._results.forEach(result => result._cancel());
	            this._transactionExecutor.close();
	            await this._readConnectionHolder.close(this._hasTx);
	            await this._writeConnectionHolder.close(this._hasTx);
	        }
	    }
	    // eslint-disable-next-line
	    // @ts-ignore
	    [Symbol.asyncDispose]() {
	        return this.close();
	    }
	    _connectionHolderWithMode(mode) {
	        if (mode === ACCESS_MODE_READ$1) {
	            return this._readConnectionHolder;
	        }
	        else if (mode === ACCESS_MODE_WRITE$1) {
	            return this._writeConnectionHolder;
	        }
	        else {
	            throw newError('Unknown access mode: ' + mode);
	        }
	    }
	    /**
	     * @private
	     * @param {Object} meta Connection metadatada
	     * @returns {void}
	     */
	    _onCompleteCallback(meta, previousBookmarks) {
	        this._updateBookmarks(new Bookmarks$6(meta.bookmark), previousBookmarks, meta.db);
	    }
	    /**
	     * @private
	     * @returns {void}
	     */
	    _calculateWatermaks() {
	        if (this._fetchSize === FETCH_ALL$5) {
	            return {
	                low: Number.MAX_VALUE, // we shall always lower than this number to enable auto pull
	                high: Number.MAX_VALUE // we shall never reach this number to disable auto pull
	            };
	        }
	        return {
	            low: 0.3 * this._fetchSize,
	            high: 0.7 * this._fetchSize
	        };
	    }
	    /**
	     * Configure the transaction executor
	     *
	     * This used by {@link Driver#executeQuery}
	     * @private
	     * @returns {void}
	     */
	    _configureTransactionExecutor(pipelined, telemetryApi) {
	        this._transactionExecutor.pipelineBegin = pipelined;
	        this._transactionExecutor.telemetryApi = telemetryApi;
	    }
	    /**
	     * @protected
	     */
	    static _validateSessionMode(rawMode) {
	        const mode = rawMode ?? ACCESS_MODE_WRITE$1;
	        if (mode !== ACCESS_MODE_READ$1 && mode !== ACCESS_MODE_WRITE$1) {
	            throw newError('Illegal session mode ' + mode);
	        }
	        return mode;
	    }
	}
	/**
	 * @private
	 * @param {object} config
	 * @returns {TransactionExecutor} The transaction executor
	 */
	function _createTransactionExecutor(config) {
	    const maxRetryTimeMs = config?.maxTransactionRetryTime ?? null;
	    return new TransactionExecutor(maxRetryTimeMs);
	}

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
	 * @typedef {Object} BookmarkManagerConfig
	 *
	 * @since 5.0
	 * @property {Iterable<string>} [initialBookmarks] Defines the initial set of bookmarks. The key is the database name and the values are the bookmarks.
	 * @property {function():Promise<Iterable<string>>} [bookmarksSupplier] Called for supplying extra bookmarks to the BookmarkManager
	 * @property {function(bookmarks: Iterable<string>): Promise<void>} [bookmarksConsumer] Called when the set of bookmarks  get updated
	 */
	/**
	 * Provides an configured {@link BookmarkManager} instance.
	 *
	 * @since 5.0
	 * @param {BookmarkManagerConfig} [config={}]
	 * @returns {BookmarkManager}
	 */
	function bookmarkManager(config = {}) {
	    const initialBookmarks = new Set(config.initialBookmarks);
	    return new Neo4jBookmarkManager(initialBookmarks, config.bookmarksSupplier, config.bookmarksConsumer);
	}
	class Neo4jBookmarkManager {
	    _bookmarks;
	    _bookmarksSupplier;
	    _bookmarksConsumer;
	    constructor(_bookmarks, _bookmarksSupplier, _bookmarksConsumer) {
	        this._bookmarks = _bookmarks;
	        this._bookmarksSupplier = _bookmarksSupplier;
	        this._bookmarksConsumer = _bookmarksConsumer;
	    }
	    async updateBookmarks(previousBookmarks, newBookmarks) {
	        const bookmarks = this._bookmarks;
	        for (const bm of previousBookmarks) {
	            bookmarks.delete(bm);
	        }
	        for (const bm of newBookmarks) {
	            bookmarks.add(bm);
	        }
	        if (typeof this._bookmarksConsumer === 'function') {
	            await this._bookmarksConsumer([...bookmarks]);
	        }
	    }
	    async getBookmarks() {
	        const bookmarks = new Set(this._bookmarks);
	        if (typeof this._bookmarksSupplier === 'function') {
	            const suppliedBookmarks = await this._bookmarksSupplier() ?? [];
	            for (const bm of suppliedBookmarks) {
	                bookmarks.add(bm);
	            }
	        }
	        return [...bookmarks];
	    }
	}

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
	async function createEagerResultFromResult(result) {
	    const { summary, records } = await result;
	    const keys = await result.keys();
	    return new EagerResult(keys, records, summary);
	}
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
	class ResultTransformers {
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
	    eagerResultTransformer() {
	        return createEagerResultFromResult;
	    }
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
	    mappedResultTransformer(config) {
	        if (config == null || (config.collect == null && config.map == null)) {
	            throw newError('Requires a map or/and a collect functions.');
	        }
	        return async (result) => {
	            return await new Promise((resolve, reject) => {
	                const state = { records: [], keys: [] };
	                result.subscribe({
	                    onKeys(keys) {
	                        state.keys = keys;
	                    },
	                    onNext(record) {
	                        if (config.map != null) {
	                            const mappedRecord = config.map(record);
	                            if (mappedRecord !== undefined) {
	                                state.records.push(mappedRecord);
	                            }
	                        }
	                        else {
	                            state.records.push(record);
	                        }
	                    },
	                    onCompleted(summary) {
	                        if (config.collect != null) {
	                            resolve(config.collect(state.records, summary, state.keys));
	                        }
	                        else {
	                            const obj = { records: state.records, summary, keys: state.keys };
	                            resolve(obj);
	                        }
	                    },
	                    onError(error) {
	                        reject(error);
	                    }
	                });
	            });
	        };
	    }
	}
	/**
	 * Holds the common {@link ResultTransformer} used with {@link Driver#executeQuery}.
	 */
	const resultTransformers = new ResultTransformers();
	Object.freeze(resultTransformers);

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
	class QueryExecutor {
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

	const DEFAULT_MAX_CONNECTION_LIFETIME = 60 * 60 * 1000; // 1 hour
	/**
	 * The default record fetch size. This is used in Bolt V4 protocol to pull query execution result in batches.
	 * @type {number}
	 */
	const DEFAULT_FETCH_SIZE = 1000;
	/**
	 * Constant that represents read session access mode.
	 * Should be used like this: `driver.session({ defaultAccessMode: neo4j.session.READ })`.
	 * @type {string}
	 */
	const READ$2 = ACCESS_MODE_READ$1;
	/**
	 * Constant that represents write session access mode.
	 * Should be used like this: `driver.session({ defaultAccessMode: neo4j.session.WRITE })`.
	 * @type {string}
	 */
	const WRITE$2 = ACCESS_MODE_WRITE$1;
	let idGenerator$1 = 0;
	/**
	 * The session configuration
	 *
	 * @interface
	 */
	class SessionConfig {
	    defaultAccessMode;
	    bookmarks;
	    database;
	    impersonatedUser;
	    fetchSize;
	    bookmarkManager;
	    notificationFilter;
	    auth;
	    /**
	     * @constructor
	     * @private
	     */
	    constructor() {
	        /**
	         * The access mode of this session, allowed values are {@link READ} and {@link WRITE}.
	         * **Default**: {@link WRITE}
	         * @type {string}
	         */
	        this.defaultAccessMode = WRITE$2;
	        /**
	         * The initial reference or references to some previous
	         * transactions. Value is optional and absence indicates that that the bookmarks do not exist or are unknown.
	         * @type {string|string[]|undefined}
	         */
	        this.bookmarks = [];
	        /**
	         * The database this session will operate on.
	         *
	         * This option has no explicit value by default, but it is recommended to set
	         * one if the target database is known in advance. This has the benefit of
	         * ensuring a consistent target database name throughout the session in a
	         * straightforward way and potentially simplifies driver logic as well as
	         * reduces network communication resulting in better performance.
	         *
	         * Usage of Cypher clauses like USE is not a replacement for this option.
	         * The driver does not parse any Cypher.
	         *
	         * When no explicit name is set, the driver behavior depends on the connection
	         * URI scheme supplied to the driver on instantiation and Bolt protocol
	         * version.
	         *
	         * Specifically, the following applies:
	         *
	         * - **bolt schemes** - queries are dispatched to the server for execution
	         *   without explicit database name supplied, meaning that the target database
	         *   name for query execution is determined by the server. It is important to
	         *   note that the target database may change (even within the same session),
	         *   for instance if the user's home database is changed on the server.
	         *
	         * - **neo4j schemes** - providing that Bolt protocol version 4.4, which was
	         *   introduced with Neo4j server 4.4, or above is available, the driver
	         *   fetches the user's home database name from the server on first query
	         *   execution within the session and uses the fetched database name
	         *   explicitly for all queries executed within the session. This ensures that
	         *   the database name remains consistent within the given session. For
	         *   instance, if the user's home database name is 'movies' and the server
	         *   supplies it to the driver upon database name fetching for the session,
	         *   all queries within that session are executed with the explicit database
	         *   name 'movies' supplied. Any change to the user’s home database is
	         *   reflected only in sessions created after such change takes effect. This
	         *   behavior requires additional network communication. In clustered
	         *   environments, it is strongly recommended to avoid a single point of
	         *   failure. For instance, by ensuring that the connection URI resolves to
	         *   multiple endpoints. For older Bolt protocol versions the behavior is the
	         *   same as described for the **bolt schemes** above.
	         *
	         * @type {string|undefined}
	         */
	        this.database = '';
	        /**
	         * The username which the user wants to impersonate for the duration of the session.
	         *
	         * @type {string|undefined}
	         */
	        this.impersonatedUser = undefined;
	        /**
	         * The {@link AuthToken} which will be used for the duration of the session.
	         *
	         * By default, the session will use connections authenticated with {@link AuthToken} configured in the
	         * driver creation. This configuration allows switch user and/or authorization information for the
	         * session lifetime.
	         *
	         * **Warning**: This option is only enable when the driver is connected with Neo4j Database servers
	         * which supports Bolt 5.1 and onwards.
	         *
	         * @type {AuthToken|undefined}
	         * @see {@link driver}
	         */
	        this.auth = undefined;
	        /**
	         * The record fetch size of each batch of this session.
	         *
	         * Use {@link FETCH_ALL} to always pull all records in one batch. This will override the config value set on driver config.
	         *
	         * @type {number|undefined}
	         */
	        this.fetchSize = undefined;
	        /**
	         * Configure a BookmarkManager for the session to use
	         *
	         * A BookmarkManager is a piece of software responsible for keeping casual consistency between different sessions by sharing bookmarks
	         * between the them.
	         * Enabling it is done by supplying an BookmarkManager implementation instance to this param.
	         * A default implementation could be acquired by calling the factory function {@link bookmarkManager}.
	         *
	         * **Warning**: Sharing the same BookmarkManager instance across multiple sessions can have a negative impact
	         * on performance since all the queries will wait for the latest changes being propagated across the cluster.
	         * For keeping consistency between a group of queries, use {@link Session} for grouping them.
	         * For keeping consistency between a group of sessions, use {@link BookmarkManager} instance for grouping them.
	         *
	         * @example
	         * const bookmarkManager = neo4j.bookmarkManager()
	         * const linkedSession1 = driver.session({ database:'neo4j', bookmarkManager })
	         * const linkedSession2 = driver.session({ database:'neo4j', bookmarkManager })
	         * const unlinkedSession = driver.session({ database:'neo4j' })
	         *
	         * // Creating Driver User
	         * const createUserQueryResult = await linkedSession1.run('CREATE (p:Person {name: $name})', { name: 'Driver User'})
	         *
	         * // Reading Driver User will *NOT* wait of the changes being propagated to the server before RUN the query
	         * // So the 'Driver User' person might not exist in the Result
	         * const unlinkedReadResult = await unlinkedSession.run('CREATE (p:Person {name: $name}) RETURN p', { name: 'Driver User'})
	         *
	         * // Reading Driver User will wait of the changes being propagated to the server before RUN the query
	         * // So the 'Driver User' person should exist in the Result, unless deleted.
	         * const linkedResult = await linkedSession2.run('CREATE (p:Person {name: $name}) RETURN p', { name: 'Driver User'})
	         *
	         * await linkedSession1.close()
	         * await linkedSession2.close()
	         * await unlinkedSession.close()
	         *
	         * @type {BookmarkManager|undefined}
	         * @since 5.0
	         */
	        this.bookmarkManager = undefined;
	        /**
	         * Configure filter for {@link Notification} objects returned in {@link ResultSummary#notifications}.
	         *
	         * This configuration enables filter notifications by:
	         *
	         * * the minimum severity level ({@link NotificationFilterMinimumSeverityLevel})
	         * * disabling notification categories ({@link NotificationFilterDisabledCategory})
	         *
	         *
	         * Disabling notifications can be done by defining the minimum severity level to 'OFF'.
	         * At driver level, when omitted, uses the server's default.
	         * At session level, when omitted, defaults to what filters have been configured at driver level.
	         *
	         * Disabling categories or severities allows the server to skip analysis for those, which can speed up query
	         * execution.
	         *
	         * @example
	         * // enabling warning notification, but disabling `HINT` and `DEPRECATION` notifications.
	         * const session = driver.session({
	         *     database: 'neo4j',
	         *     notificationFilter: {
	         *         minimumSeverityLevel: neo4j.notificationFilterMinimumSeverityLevel.WARNING, // or 'WARNING
	         *         disabledCategories: [
	         *             neo4j.notificationFilterDisabledCategory.HINT, // or 'HINT'
	         *             neo4j.notificationFilterDisabledCategory.DEPRECATION // or 'DEPRECATION'
	         *        ]
	         *     }
	         * })
	         *
	         * @example
	         * // disabling notifications for a session
	         * const session = driver.session({
	         *     database: 'neo4j',
	         *     notificationFilter: {
	         *         minimumSeverityLevel: neo4j.notificationFilterMinimumSeverityLevel.OFF // or 'OFF'
	         *     }
	         * })
	         *
	         * @example
	         * // using default values configured in the driver
	         * const sessionWithDefaultValues = driver.session({ database: 'neo4j' })
	         * // or driver.session({ database: 'neo4j', notificationFilter: undefined })
	         *
	         * // using default minimum severity level, but disabling 'HINT' and 'UNRECOGNIZED'
	         * // notification categories
	         * const sessionWithDefaultSeverityLevel = driver.session({
	         *     database: 'neo4j',
	         *     notificationFilter: {
	         *         disabledCategories: [
	         *             neo4j.notificationFilterDisabledCategory.HINT, // or 'HINT'
	         *             neo4j.notificationFilterDisabledCategory.UNRECOGNIZED // or 'UNRECOGNIZED'
	         *        ]
	         *     }
	         * })
	         *
	         * // using default disabled categories, but configuring minimum severity level to 'WARNING'
	         * const sessionWithDefaultSeverityLevel = driver.session({
	         *     database: 'neo4j',
	         *     notificationFilter: {
	         *         minimumSeverityLevel: neo4j.notificationFilterMinimumSeverityLevel.WARNING // or 'WARNING'
	         *     }
	         * })
	         *
	         * @type {NotificationFilter|undefined}
	         * @since 5.7
	         */
	        this.notificationFilter = undefined;
	    }
	}
	const ROUTING_WRITE = 'WRITE';
	const ROUTING_READ = 'READ';
	/**
	 * @typedef {'WRITE'|'READ'} RoutingControl
	 */
	/**
	 * Constants that represents routing modes.
	 *
	 * @example
	 * driver.executeQuery("<QUERY>", <PARAMETERS>, { routing: neo4j.routing.WRITE })
	 */
	const routing = {
	    WRITE: ROUTING_WRITE,
	    READ: ROUTING_READ
	};
	Object.freeze(routing);
	/**
	 * The query configuration
	 * @interface
	 */
	class QueryConfig {
	    routing;
	    database;
	    impersonatedUser;
	    bookmarkManager;
	    resultTransformer;
	    transactionConfig;
	    /**
	     * @constructor
	     * @private
	     */
	    constructor() {
	        /**
	         * Define the type of cluster member the query will be routed to.
	         *
	         * @type {RoutingControl}
	         */
	        this.routing = routing.WRITE;
	        /**
	         * Define the transformation will be applied to the Result before return from the
	         * query method.
	         *
	         * @type {ResultTransformer}
	         * @see {@link resultTransformers} for provided implementations.
	         */
	        this.resultTransformer = undefined;
	        /**
	         * The database this session will operate on.
	         *
	         * @type {string|undefined}
	         */
	        this.database = '';
	        /**
	         * The username which the user wants to impersonate for the duration of the query.
	         *
	         * @type {string|undefined}
	         */
	        this.impersonatedUser = undefined;
	        /**
	         * Configure a BookmarkManager for the session to use
	         *
	         * A BookmarkManager is a piece of software responsible for keeping casual consistency between different pieces of work by sharing bookmarks
	         * between the them.
	         *
	         * By default, it uses the driver's non mutable driver level bookmark manager. See, {@link Driver.executeQueryBookmarkManager}
	         *
	         * Can be set to null to disable causal chaining.
	         * @type {BookmarkManager|undefined|null}
	         */
	        this.bookmarkManager = undefined;
	        /**
	         * Configuration for all transactions started to execute the query.
	         *
	         * @type {TransactionConfig|undefined}
	         *
	         */
	        this.transactionConfig = undefined;
	    }
	}
	/**
	 * A driver maintains one or more {@link Session}s with a remote
	 * Neo4j instance. Through the {@link Session}s you can send queries
	 * and retrieve results from the database.
	 *
	 * Drivers are reasonably expensive to create - you should strive to keep one
	 * driver instance around per Neo4j Instance you connect to.
	 *
	 * @access public
	 */
	class Driver {
	    _id;
	    _meta;
	    _config;
	    _log;
	    _createConnectionProvider;
	    _connectionProvider;
	    _createSession;
	    _defaultExecuteQueryBookmarkManager;
	    _queryExecutor;
	    /**
	     * You should not be calling this directly, instead use {@link driver}.
	     * @constructor
	     * @protected
	     * @param {Object} meta Metainformation about the driver
	     * @param {Object} config
	     * @param {function(id: number, config:Object, log:Logger, hostNameResolver: ConfiguredCustomResolver): ConnectionProvider } createConnectionProvider Creates the connection provider
	     * @param {function(args): Session } createSession Creates the a session
	    */
	    constructor(meta, config = {}, createConnectionProvider, createSession = args => new Session(args), createQueryExecutor = createSession => new QueryExecutor(createSession)) {
	        sanitizeConfig(config);
	        const log = Logger$3.create(config);
	        validateConfig(config, log);
	        this._id = idGenerator$1++;
	        this._meta = meta;
	        this._config = config;
	        this._log = log;
	        this._createConnectionProvider = createConnectionProvider;
	        this._createSession = createSession;
	        this._defaultExecuteQueryBookmarkManager = bookmarkManager();
	        this._queryExecutor = createQueryExecutor(this.session.bind(this));
	        /**
	         * Reference to the connection provider. Initialized lazily by {@link _getOrCreateConnectionProvider}.
	         * @type {ConnectionProvider}
	         * @protected
	         */
	        this._connectionProvider = null;
	        this._afterConstruction();
	    }
	    /**
	     * The bookmark managed used by {@link Driver.executeQuery}
	     *
	     * @type {BookmarkManager}
	     */
	    get executeQueryBookmarkManager() {
	        return this._defaultExecuteQueryBookmarkManager;
	    }
	    /**
	     * Executes a query in a retriable context and returns a {@link EagerResult}.
	     *
	     * This method is a shortcut for a {@link Session#executeRead} and {@link Session#executeWrite}.
	     *
	     * NOTE: Because it is an explicit transaction from the server point of view, Cypher queries using
	     * "CALL {} IN TRANSACTIONS" or the older "USING PERIODIC COMMIT" construct will not work (call
	     * {@link Session#run} for these).
	     *
	     * @example
	     * // Run a simple write query
	     * const { keys, records, summary } = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'})
	     *
	     * @example
	     * // Run a read query
	     * const { keys, records, summary } = await driver.executeQuery(
	     *    'MATCH (p:Person{ name: $name }) RETURN p',
	     *    { name: 'Person1'},
	     *    { routing: neo4j.routing.READ})
	     *
	     * @example
	     * // Run a read query returning a Person Nodes per elementId
	     * const peopleMappedById = await driver.executeQuery(
	     *    'MATCH (p:Person{ name: $name }) RETURN p',
	     *    { name: 'Person1'},
	     *    {
	     *      resultTransformer: neo4j.resultTransformers.mappedResultTransformer({
	     *        map(record) {
	     *          const p = record.get('p')
	     *          return [p.elementId, p]
	     *        },
	     *        collect(elementIdPersonPairArray) {
	     *          return new Map(elementIdPersonPairArray)
	     *        }
	     *      })
	     *    }
	     * )
	     *
	     * const person = peopleMappedById.get("<ELEMENT_ID>")
	     *
	     * @example
	     * // these lines
	     * const transformedResult = await driver.executeQuery(
	     *    "<QUERY>",
	     *    <PARAMETERS>,
	     *    {
	     *       routing: neo4j.routing.WRITE,
	     *       resultTransformer: transformer,
	     *       database: "<DATABASE>",
	     *       impersonatedUser: "<USER>",
	     *       bookmarkManager: bookmarkManager
	     *    })
	     * // are equivalent to those
	     * const session = driver.session({
	     *    database: "<DATABASE>",
	     *    impersonatedUser: "<USER>",
	     *    bookmarkManager: bookmarkManager
	     * })
	     *
	     * try {
	     *    const transformedResult = await session.executeWrite(tx => {
	     *        const result = tx.run("<QUERY>", <PARAMETERS>)
	     *        return transformer(result)
	     *    })
	     * } finally {
	     *    await session.close()
	     * }
	     *
	     * @public
	     * @param {string | {text: string, parameters?: object}} query - Cypher query to execute
	     * @param {Object} parameters - Map with parameters to use in the query
	     * @param {QueryConfig<T>} config - The query configuration
	     * @returns {Promise<T>}
	     *
	     * @see {@link resultTransformers} for provided result transformers.
	     */
	    async executeQuery(query, parameters, config = {}) {
	        const bookmarkManager = config.bookmarkManager === null ? undefined : (config.bookmarkManager ?? this.executeQueryBookmarkManager);
	        const resultTransformer = (config.resultTransformer ?? resultTransformers.eagerResultTransformer());
	        const routingConfig = config.routing ?? routing.WRITE;
	        if (routingConfig !== routing.READ && routingConfig !== routing.WRITE) {
	            throw newError(`Illegal query routing config: "${routingConfig}"`);
	        }
	        return await this._queryExecutor.execute({
	            resultTransformer,
	            bookmarkManager,
	            routing: routingConfig,
	            database: config.database,
	            impersonatedUser: config.impersonatedUser,
	            transactionConfig: config.transactionConfig
	        }, query, parameters);
	    }
	    /**
	     * Verifies connectivity of this driver by trying to open a connection with the provided driver options.
	     *
	     * @deprecated This return of this method will change in 6.0.0 to not async return the {@link ServerInfo} and
	     * async return {@link void} instead. If you need to use the server info, use {@link getServerInfo} instead.
	     *
	     * @public
	     * @param {Object} param - The object parameter
	     * @param {string} param.database - The target database to verify connectivity for.
	     * @returns {Promise<ServerInfo>} promise resolved with server info or rejected with error.
	     */
	    verifyConnectivity({ database = '' } = {}) {
	        const connectionProvider = this._getOrCreateConnectionProvider();
	        return connectionProvider.verifyConnectivityAndGetServerInfo({ database, accessMode: READ$2 });
	    }
	    /**
	     * This method verifies the authorization credentials work by trying to acquire a connection
	     * to one of the servers with the given credentials.
	     *
	     * @param {object} param - object parameter
	     * @property {AuthToken} param.auth - the target auth for the to-be-acquired connection
	     * @property {string} param.database - the target database for the to-be-acquired connection
	     *
	     * @returns {Promise<boolean>} promise resolved with true if succeed, false if failed with
	     *  authentication issue and rejected with error if non-authentication error happens.
	     */
	    async verifyAuthentication({ database, auth } = {}) {
	        const connectionProvider = this._getOrCreateConnectionProvider();
	        return await connectionProvider.verifyAuthentication({
	            database: database ?? 'system',
	            auth,
	            accessMode: READ$2
	        });
	    }
	    /**
	     * Get ServerInfo for the giver database.
	     *
	     * @param {Object} param - The object parameter
	     * @param {string} param.database - The target database to verify connectivity for.
	     * @returns {Promise<ServerInfo>} promise resolved with the ServerInfo or rejected with error.
	     */
	    getServerInfo({ database = '' } = {}) {
	        const connectionProvider = this._getOrCreateConnectionProvider();
	        return connectionProvider.verifyConnectivityAndGetServerInfo({ database, accessMode: READ$2 });
	    }
	    /**
	     * Returns whether the server supports multi database capabilities based on the protocol
	     * version negotiated via handshake.
	     *
	     * Note that this function call _always_ causes a round-trip to the server.
	     *
	     * @returns {Promise<boolean>} promise resolved with a boolean or rejected with error.
	     */
	    supportsMultiDb() {
	        const connectionProvider = this._getOrCreateConnectionProvider();
	        return connectionProvider.supportsMultiDb();
	    }
	    /**
	     * Returns whether the server supports transaction config capabilities based on the protocol
	     * version negotiated via handshake.
	     *
	     * Note that this function call _always_ causes a round-trip to the server.
	     *
	     * @returns {Promise<boolean>} promise resolved with a boolean or rejected with error.
	     */
	    supportsTransactionConfig() {
	        const connectionProvider = this._getOrCreateConnectionProvider();
	        return connectionProvider.supportsTransactionConfig();
	    }
	    /**
	     * Returns whether the server supports user impersonation capabilities based on the protocol
	     * version negotiated via handshake.
	     *
	     * Note that this function call _always_ causes a round-trip to the server.
	     *
	     * @returns {Promise<boolean>} promise resolved with a boolean or rejected with error.
	     */
	    supportsUserImpersonation() {
	        const connectionProvider = this._getOrCreateConnectionProvider();
	        return connectionProvider.supportsUserImpersonation();
	    }
	    /**
	     * Returns whether the driver session re-auth functionality capabilities based on the protocol
	     * version negotiated via handshake.
	     *
	     * Note that this function call _always_ causes a round-trip to the server.
	     *
	     * @returns {Promise<boolean>} promise resolved with a boolean or rejected with error.
	     */
	    supportsSessionAuth() {
	        const connectionProvider = this._getOrCreateConnectionProvider();
	        return connectionProvider.supportsSessionAuth();
	    }
	    /**
	     * Returns the protocol version negotiated via handshake.
	     *
	     * Note that this function call _always_ causes a round-trip to the server.
	     *
	     * @returns {Promise<number>} the protocol version negotiated via handshake.
	     * @throws {Error} When protocol negotiation fails
	     */
	    getNegotiatedProtocolVersion() {
	        const connectionProvider = this._getOrCreateConnectionProvider();
	        return connectionProvider.getNegotiatedProtocolVersion();
	    }
	    /**
	     * Returns boolean to indicate if driver has been configured with encryption enabled.
	     *
	     * @returns {boolean}
	     */
	    isEncrypted() {
	        return this._isEncrypted();
	    }
	    /**
	     * @protected
	     * @returns {boolean}
	     */
	    _supportsRouting() {
	        return this._meta.routing;
	    }
	    /**
	     * Returns boolean to indicate if driver has been configured with encryption enabled.
	     *
	     * @protected
	     * @returns {boolean}
	     */
	    _isEncrypted() {
	        return this._config.encrypted === ENCRYPTION_ON$2 || this._config.encrypted === true;
	    }
	    /**
	     * Returns the configured trust strategy that the driver has been configured with.
	     *
	     * @protected
	     * @returns {TrustStrategy}
	     */
	    _getTrust() {
	        return this._config.trust;
	    }
	    /**
	     * Acquire a session to communicate with the database. The session will
	     * borrow connections from the underlying connection pool as required and
	     * should be considered lightweight and disposable.
	     *
	     * This comes with some responsibility - make sure you always call
	     * {@link close} when you are done using a session, and likewise,
	     * make sure you don't close your session before you are done using it. Once
	     * it is closed, the underlying connection will be released to the connection
	     * pool and made available for others to use.
	     *
	     * @public
	     * @param {SessionConfig} param - The session configuration
	     * @return {Session} new session.
	     */
	    session({ defaultAccessMode = WRITE$2, bookmarks: bookmarkOrBookmarks, database = '', impersonatedUser, fetchSize, bookmarkManager, notificationFilter, auth } = {}) {
	        return this._newSession({
	            defaultAccessMode,
	            bookmarkOrBookmarks,
	            database,
	            reactive: false,
	            impersonatedUser,
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            fetchSize: validateFetchSizeValue(fetchSize, this._config.fetchSize),
	            bookmarkManager,
	            notificationFilter,
	            auth
	        });
	    }
	    /**
	     * Close all open sessions and other associated resources. You should
	     * make sure to use this when you are done with this driver instance.
	     * @public
	     * @return {Promise<void>} promise resolved when the driver is closed.
	     */
	    close() {
	        this._log.info(`Driver ${this._id} closing`);
	        if (this._connectionProvider != null) {
	            return this._connectionProvider.close();
	        }
	        return Promise.resolve();
	    }
	    // eslint-disable-next-line
	    // @ts-ignore
	    [Symbol.asyncDispose]() {
	        return this.close();
	    }
	    /**
	     * @protected
	     * @returns {void}
	     */
	    _afterConstruction() {
	        this._log.info(`${this._meta.typename} driver ${this._id} created for server address ${this._meta.address.toString()}`);
	    }
	    /**
	     * @private
	     */
	    _newSession({ defaultAccessMode, bookmarkOrBookmarks, database, reactive, impersonatedUser, fetchSize, bookmarkManager, notificationFilter, auth }) {
	        const sessionMode = Session._validateSessionMode(defaultAccessMode);
	        const connectionProvider = this._getOrCreateConnectionProvider();
	        const bookmarks = bookmarkOrBookmarks != null
	            ? new Bookmarks$6(bookmarkOrBookmarks)
	            : Bookmarks$6.empty();
	        return this._createSession({
	            mode: sessionMode,
	            database: database ?? '',
	            connectionProvider,
	            bookmarks,
	            config: this._config,
	            reactive,
	            impersonatedUser,
	            fetchSize,
	            bookmarkManager,
	            notificationFilter,
	            auth,
	            log: this._log
	        });
	    }
	    /**
	     * @private
	     */
	    _getOrCreateConnectionProvider() {
	        if (this._connectionProvider == null) {
	            this._connectionProvider = this._createConnectionProvider(this._id, this._config, this._log, createHostNameResolver(this._config));
	        }
	        return this._connectionProvider;
	    }
	}
	/**
	 * @private
	 * @returns {Object} the given config.
	 */
	function validateConfig(config, log) {
	    const resolver = config.resolver;
	    if (resolver !== null && resolver !== undefined && typeof resolver !== 'function') {
	        throw new TypeError(`Configured resolver should be a function. Got: ${typeof resolver}`);
	    }
	    if (config.connectionAcquisitionTimeout < config.connectionTimeout) {
	        log.warn('Configuration for "connectionAcquisitionTimeout" should be greater than ' +
	            'or equal to "connectionTimeout". Otherwise, the connection acquisition ' +
	            'timeout will take precedence for over the connection timeout in scenarios ' +
	            'where a new connection is created while it is acquired');
	    }
	    return config;
	}
	/**
	 * @private
	 */
	function sanitizeConfig(config) {
	    config.maxConnectionLifetime = sanitizeIntValue(config.maxConnectionLifetime, DEFAULT_MAX_CONNECTION_LIFETIME);
	    config.maxConnectionPoolSize = sanitizeIntValue(config.maxConnectionPoolSize, DEFAULT_POOL_MAX_SIZE);
	    config.connectionAcquisitionTimeout = sanitizeIntValue(config.connectionAcquisitionTimeout, DEFAULT_POOL_ACQUISITION_TIMEOUT);
	    config.fetchSize = validateFetchSizeValue(config.fetchSize, DEFAULT_FETCH_SIZE);
	    config.connectionTimeout = extractConnectionTimeout(config);
	    config.connectionLivenessCheckTimeout =
	        validateConnectionLivenessCheckTimeoutSizeValue(config.connectionLivenessCheckTimeout);
	}
	/**
	 * @private
	 */
	function sanitizeIntValue(rawValue, defaultWhenAbsent) {
	    const sanitizedValue = parseInt(rawValue, 10);
	    if (sanitizedValue > 0 || sanitizedValue === 0) {
	        return sanitizedValue;
	    }
	    else if (sanitizedValue < 0) {
	        return Number.MAX_SAFE_INTEGER;
	    }
	    else {
	        return defaultWhenAbsent;
	    }
	}
	/**
	 * @private
	 */
	function validateFetchSizeValue(rawValue, defaultWhenAbsent) {
	    const fetchSize = parseInt(rawValue, 10);
	    if (fetchSize > 0 || fetchSize === FETCH_ALL$5) {
	        return fetchSize;
	    }
	    else if (fetchSize === 0 || fetchSize < 0) {
	        throw new Error(`The fetch size can only be a positive value or ${FETCH_ALL$5} for ALL. However fetchSize = ${fetchSize}`);
	    }
	    else {
	        return defaultWhenAbsent;
	    }
	}
	/**
	 * @private
	 */
	function extractConnectionTimeout(config) {
	    const configuredTimeout = parseInt(config.connectionTimeout, 10);
	    if (configuredTimeout === 0) {
	        // timeout explicitly configured to 0
	        return null;
	    }
	    else if (!isNaN(configuredTimeout) && configuredTimeout < 0) {
	        // timeout explicitly configured to a negative value
	        return null;
	    }
	    else if (isNaN(configuredTimeout)) {
	        // timeout not configured, use default value
	        return DEFAULT_CONNECTION_TIMEOUT_MILLIS;
	    }
	    else {
	        // timeout configured, use the provided value
	        return configuredTimeout;
	    }
	}
	/**
	 * @private
	 */
	function validateConnectionLivenessCheckTimeoutSizeValue(rawValue) {
	    if (rawValue == null) {
	        return undefined;
	    }
	    const connectionLivenessCheckTimeout = parseInt(rawValue, 10);
	    if (connectionLivenessCheckTimeout < 0 || Number.isNaN(connectionLivenessCheckTimeout)) {
	        throw new Error(`The connectionLivenessCheckTimeout can only be a positive value or 0 for always. However connectionLivenessCheckTimeout = ${connectionLivenessCheckTimeout}`);
	    }
	    return connectionLivenessCheckTimeout;
	}
	/**
	 * @private
	 * @returns {ConfiguredCustomResolver} new custom resolver that wraps the passed-in resolver function.
	 *              If resolved function is not specified, it defaults to an identity resolver.
	 */
	function createHostNameResolver(config) {
	    return new ConfiguredCustomResolver(config.resolver);
	}

	var driver = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Driver: Driver,
		READ: READ$2,
		WRITE: WRITE$2,
		routing: routing,
		SessionConfig: SessionConfig,
		QueryConfig: QueryConfig,
		'default': Driver
	});

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
	 * @property {function(username: string, password: string, realm: ?string)} basic the function to create a
	 * basic authentication token.
	 * @property {function(base64EncodedTicket: string)} kerberos the function to create a Kerberos authentication token.
	 * Accepts a single string argument - base64 encoded Kerberos ticket.
	 * @property {function(base64EncodedTicket: string)} bearer the function to create a Bearer authentication token.
	 * Accepts a single string argument - base64 encoded Bearer ticket.
	 * @property {function(principal: string, credentials: string, realm: string, scheme: string, parameters: ?object)} custom
	 * the function to create a custom authentication token.
	 */
	const auth = {
	    basic: (username, password, realm) => {
	        if (realm != null) {
	            return {
	                scheme: 'basic',
	                principal: username,
	                credentials: password,
	                realm
	            };
	        }
	        else {
	            return { scheme: 'basic', principal: username, credentials: password };
	        }
	    },
	    kerberos: (base64EncodedTicket) => {
	        return {
	            scheme: 'kerberos',
	            principal: '', // This empty string is required for backwards compatibility.
	            credentials: base64EncodedTicket
	        };
	    },
	    bearer: (base64EncodedToken) => {
	        return {
	            scheme: 'bearer',
	            credentials: base64EncodedToken
	        };
	    },
	    none: () => {
	        return {
	            scheme: 'none'
	        };
	    },
	    custom: (principal, credentials, realm, scheme, parameters) => {
	        const output = {
	            scheme,
	            principal
	        };
	        if (isNotEmpty(credentials)) {
	            output.credentials = credentials;
	        }
	        if (isNotEmpty(realm)) {
	            output.realm = realm;
	        }
	        if (isNotEmpty(parameters)) {
	            output.parameters = parameters;
	        }
	        return output;
	    }
	};
	function isNotEmpty(value) {
	    return !(value === null ||
	        value === undefined ||
	        value === '' ||
	        (Object.getPrototypeOf(value) === Object.prototype && Object.keys(value).length === 0));
	}

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
	 * Defines the object which holds the common {@link AuthTokenManager} used in the Driver
	 */
	class AuthTokenManagers {
	    /**
	     * Creates a {@link AuthTokenManager} for handle {@link AuthToken} which is expires.
	     *
	     * **Warning**: `tokenProvider` must only ever return auth information belonging to the same identity.
	     * Switching identities using the `AuthTokenManager` is undefined behavior.
	     *
	     * @param {object} param0 - The params
	     * @param {function(): Promise<AuthTokenAndExpiration>} param0.tokenProvider - Retrieves a new valid auth token.
	     * Must only ever return auth information belonging to the same identity.
	     * @returns {AuthTokenManager} The temporal auth data manager.
	     */
	    bearer({ tokenProvider }) {
	        if (typeof tokenProvider !== 'function') {
	            throw new TypeError(`tokenProvider should be function, but got: ${typeof tokenProvider}`);
	        }
	        return new ExpirationBasedAuthTokenManager(tokenProvider, [
	            'Neo.ClientError.Security.Unauthorized',
	            'Neo.ClientError.Security.TokenExpired'
	        ]);
	    }
	    /**
	     * Creates a {@link AuthTokenManager} for handle {@link AuthToken} and password rotation.
	     *
	     * **Warning**: `tokenProvider` must only ever return auth information belonging to the same identity.
	     * Switching identities using the `AuthTokenManager` is undefined behavior.
	     *
	     * @param {object} param0 - The params
	     * @param {function(): Promise<AuthToken>} param0.tokenProvider - Retrieves a new valid auth token.
	     * Must only ever return auth information belonging to the same identity.
	     * @returns {AuthTokenManager} The basic auth data manager.
	     */
	    basic({ tokenProvider }) {
	        if (typeof tokenProvider !== 'function') {
	            throw new TypeError(`tokenProvider should be function, but got: ${typeof tokenProvider}`);
	        }
	        return new ExpirationBasedAuthTokenManager(async () => {
	            return { token: await tokenProvider() };
	        }, ['Neo.ClientError.Security.Unauthorized']);
	    }
	}
	/**
	 * Holds the common {@link AuthTokenManagers} used in the Driver.
	 */
	const authTokenManagers = new AuthTokenManagers();
	Object.freeze(authTokenManagers);
	/**
	 * Create a {@link AuthTokenManager} for handle static {@link AuthToken}
	 *
	 * @private
	 * @param {param} args - The args
	 * @param {AuthToken} args.authToken - The static auth token which will always used in the driver.
	 * @returns {AuthTokenManager} The temporal auth data manager.
	 */
	function staticAuthTokenManager({ authToken }) {
	    return new StaticAuthTokenManager(authToken);
	}
	class TokenRefreshObservable {
	    _subscribers;
	    constructor(_subscribers = []) {
	        this._subscribers = _subscribers;
	    }
	    subscribe(sub) {
	        this._subscribers.push(sub);
	    }
	    onCompleted(data) {
	        this._subscribers.forEach(sub => sub.onCompleted(data));
	    }
	    onError(error) {
	        this._subscribers.forEach(sub => sub.onError(error));
	    }
	}
	class ExpirationBasedAuthTokenManager {
	    _tokenProvider;
	    _handledSecurityCodes;
	    _currentAuthData;
	    _refreshObservable;
	    constructor(_tokenProvider, _handledSecurityCodes, _currentAuthData, _refreshObservable) {
	        this._tokenProvider = _tokenProvider;
	        this._handledSecurityCodes = _handledSecurityCodes;
	        this._currentAuthData = _currentAuthData;
	        this._refreshObservable = _refreshObservable;
	    }
	    async getToken() {
	        if (this._currentAuthData === undefined ||
	            (this._currentAuthData.expiration !== undefined &&
	                this._currentAuthData.expiration < new Date())) {
	            await this._refreshAuthToken();
	        }
	        return this._currentAuthData?.token;
	    }
	    handleSecurityException(token, securityErrorCode) {
	        if (this._handledSecurityCodes.includes(securityErrorCode)) {
	            if (equals$1(token, this._currentAuthData?.token)) {
	                this._scheduleRefreshAuthToken();
	            }
	            return true;
	        }
	        return false;
	    }
	    _scheduleRefreshAuthToken(observer) {
	        if (this._refreshObservable === undefined) {
	            this._currentAuthData = undefined;
	            this._refreshObservable = new TokenRefreshObservable();
	            Promise.resolve(this._tokenProvider())
	                .then(data => {
	                this._currentAuthData = data;
	                this._refreshObservable?.onCompleted(data);
	            })
	                .catch(error => {
	                this._refreshObservable?.onError(error);
	            })
	                .finally(() => {
	                this._refreshObservable = undefined;
	            });
	        }
	        if (observer !== undefined) {
	            this._refreshObservable.subscribe(observer);
	        }
	    }
	    async _refreshAuthToken() {
	        return await new Promise((resolve, reject) => {
	            this._scheduleRefreshAuthToken({
	                onCompleted: resolve,
	                onError: reject
	            });
	        });
	    }
	}
	class StaticAuthTokenManager {
	    _authToken;
	    constructor(_authToken) {
	        this._authToken = _authToken;
	    }
	    getToken() {
	        return this._authToken;
	    }
	    handleSecurityException(_, __) {
	        return false;
	    }
	}

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
	 * The Neo4j Driver configuration.
	 *
	 * @interface
	 */
	class Config {
	    encrypted;
	    trust;
	    trustedCertificates;
	    knownHosts;
	    fetchSize;
	    maxConnectionPoolSize;
	    maxTransactionRetryTime;
	    maxConnectionLifetime;
	    connectionAcquisitionTimeout;
	    connectionLivenessCheckTimeout;
	    connectionTimeout;
	    disableLosslessIntegers;
	    notificationFilter;
	    useBigInt;
	    logging;
	    resolver;
	    userAgent;
	    telemetryDisabled;
	    /**
	     * @constructor
	     * @private
	     */
	    constructor() {
	        /**
	         * Encryption level
	         *
	         * @type {'ENCRYPTION_ON'|'ENCRYPTION_OFF'|undefined}
	         */
	        this.encrypted = undefined;
	        /**
	         * Trust strategy to use if encryption is enabled.
	         *
	         * There is no mode to disable trust other than disabling encryption altogether. The reason for
	         * this is that if you don't know who you are talking to, it is easy for an
	         * attacker to hijack your encrypted connection, rendering encryption pointless.
	         *
	         * TRUST_SYSTEM_CA_SIGNED_CERTIFICATES is the default choice. For NodeJS environments, this
	         * means that you trust whatever certificates are in the default trusted certificate
	         * store of the underlying system. For Browser environments, the trusted certificate
	         * store is usually managed by the browser. Refer to your system or browser documentation
	         * if you want to explicitly add a certificate as trusted.
	         *
	         * TRUST_CUSTOM_CA_SIGNED_CERTIFICATES is another option for trust verification -
	         * whenever we establish an encrypted connection, we ensure the host is using
	         * an encryption certificate that is in, or is signed by, a certificate given
	         * as trusted through configuration. This option is only available for NodeJS environments.
	         *
	         * TRUST_ALL_CERTIFICATES means that you trust everything without any verifications
	         * steps carried out.  This option is only available for NodeJS environments and should not
	         * be used on production systems.
	         *
	         * @type {'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES'|'TRUST_CUSTOM_CA_SIGNED_CERTIFICATES'|'TRUST_ALL_CERTIFICATES'|undefined}
	         */
	        this.trust = undefined;
	        /**
	         * List of one or more paths to trusted encryption certificates.
	         *
	         * This only works in the NodeJS bundle,
	         * and only matters if you use "TRUST_CUSTOM_CA_SIGNED_CERTIFICATES".
	         *
	         * The certificate files should be in regular X.509 PEM format.
	         *
	         * For instance, ['./trusted.pem']
	         *
	         * @type {?string[]}
	         * @see {@link Config#trust}
	         */
	        this.trustedCertificates = [];
	        /**
	         * The maximum total number of connections allowed to be managed by the connection pool, per host.
	         *
	         * This includes both in-use and idle connections.
	         *
	         * **Default**: ```100```
	         *
	         * @type {number|undefined}
	         */
	        this.maxConnectionPoolSize = 100;
	        /**
	         * The maximum allowed lifetime for a pooled connection in milliseconds.
	         *
	         * Pooled connections older than this
	         * threshold will be closed and removed from the pool. Such discarding happens during connection acquisition
	         * so that new session is never backed by an old connection. Setting this option to a low value will cause
	         * a high connection churn and might result in a performance hit. It is recommended to set maximum lifetime
	         * to a slightly smaller value than the one configured in network equipment (load balancer, proxy, firewall,
	         * etc. can also limit maximum connection lifetime). No maximum lifetime limit is imposed by default. Zero
	         * and negative values result in lifetime not being checked.
	         *
	         * **Default**: ```60 * 60 * 1000``` (1 hour)
	         *
	         * @type {number|undefined}
	         */
	        this.maxConnectionLifetime = 60 * 60 * 1000; // 1 hour
	        /**
	         * The maximum amount of time to wait to acquire a connection from the pool (to either create a new
	         * connection or borrow an existing one).
	         *
	         * **Default**: ```60000``` (1 minute)
	         *
	         * @type {number|undefined}
	         */
	        this.connectionAcquisitionTimeout = 60000; // 1 minute
	        /**
	         * Specify the maximum time in milliseconds transactions are allowed to retry via
	         * {@link Session#executeRead} and {@link Session#executeWrite} functions.
	         *
	         * These functions will retry the given unit of work on `ServiceUnavailable`, `SessionExpired` and transient
	         * errors with exponential backoff using an initial delay of 1 second.
	         *
	         * **Default**: ```30000``` (30 seconds)
	         *
	         * @type {number|undefined}
	         */
	        this.maxTransactionRetryTime = 30000; // 30 seconds
	        /**
	         * Specify the maximum time in milliseconds the connection can be idle without needing
	         * to perform a liveness check on acquire from the pool.
	         *
	         * Pooled connections that have been idle in the pool for longer than this
	         * timeout will be tested before they are used again, to ensure they are still live.
	         * If this option is set too low, an additional network call will be incurred
	         * when acquiring a connection, which causes a performance hit.
	         *
	         * If this is set high, you may receive sessions that are backed by no longer
	         * live connections, which will lead to exceptions in your application.
	         * Assuming the database is running, these exceptions will go away if you retry
	         * acquiring sessions.
	         *
	         * Hence, this parameter tunes a balance between the likelihood of your application
	         * seeing connection problems, and performance.
	         *
	         * You normally should not need to tune this parameter. No connection liveliness
	         * check is done by default. Value 0 means connections will always be tested for
	         * validity and negative values mean connections will never be tested.
	         *
	         * **Default**: ```undefined``` (Disabled)
	         *
	         * @type {number|undefined}
	         */
	        this.connectionLivenessCheckTimeout = undefined; // Disabled
	        /**
	         * Specify socket connection timeout in milliseconds.
	         *
	         * Negative and zero values result in no timeout being applied.
	         * Connection establishment will be then bound by the timeout configured
	         * on the operating system level.
	         *
	         * **Default**: ```30000``` (30 seconds)
	         *
	         * @type {number|undefined}
	         */
	        this.connectionTimeout = 30000; // 30 seconds
	        /**
	         * Make this driver always return native JavaScript numbers for integer values, instead of the
	         * dedicated {@link Integer} class.
	         *
	         * Values that do not fit in native number bit range will be represented as `Number.NEGATIVE_INFINITY` or `Number.POSITIVE_INFINITY`.
	         *
	         * **Warning:** {@link ResultSummary} It is not always safe to enable this setting when JavaScript applications are not the only ones
	         * interacting with the database. Stored numbers might in such case be not representable by native
	         * `Number` type and thus the driver will return lossy values. This might also happen when data was
	         * initially imported using neo4j import tool and contained numbers larger than
	         * `Number.MAX_SAFE_INTEGER`. Driver will then return positive infinity, which is lossy.
	         *
	         * **Default**: ```false```
	         *
	         * Default value for this option is `false` because native JavaScript numbers might result
	         * in loss of precision in the general case.
	         *
	         * @type {boolean|undefined}
	         */
	        this.disableLosslessIntegers = false;
	        /**
	         * Make this driver always return native Javascript `BigInt` for integer values,
	         * instead of the dedicated {@link Integer} class or `Number`.
	         *
	         * **Warning:** `BigInt` doesn't implement the method `toJSON`. To serialize it as `json`,
	         * it's needed to add a custom implementation of the `toJSON` on the
	         * `BigInt.prototype`. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json.
	         *
	         * **Default**: ```false``` (for backwards compatibility)
	         *
	         * @type {boolean|undefined}
	         */
	        this.useBigInt = false;
	        /**
	         * Specify the logging configuration for the driver. Object should have two properties `level` and `logger`.
	         *
	         * Property `level` represents the logging level which should be one of: 'error', 'warn', 'info' or 'debug'. This property is optional and
	         * its default value is 'info'. Levels have priorities: 'error': 0, 'warn': 1, 'info': 2, 'debug': 3. Enabling a certain level also enables all
	         * levels with lower priority. For example: 'error', 'warn' and 'info' will be logged when 'info' level is configured.
	         *
	         * Property `logger` represents the logging function which will be invoked for every log call with an acceptable level. The function should
	         * take two string arguments `level` and `message`. The function should not execute any blocking or long-running operations
	         * because it is often executed on a hot path.
	         *
	         * No logging is done by default. See `neo4j.logging` object that contains predefined logging implementations.
	         *
	         * @type {LoggingConfig|undefined}
	         * @see {@link logging}
	         */
	        this.logging = undefined;
	        /**
	         * Specify a custom server address resolver function used by the routing driver to resolve the initial address used to create the driver.
	         *
	         * Such resolution happens:
	         *   * during the very first rediscovery when driver is created
	         *   * when all the known routers from the current routing table have failed and driver needs to fallback to the initial address
	         *
	         *  In NodeJS environment driver defaults to performing a DNS resolution of the initial address using 'dns' module.
	         *  In browser environment driver uses the initial address as-is.
	         *  Value should be a function that takes a single string argument - the initial address. It should return an array of new addresses.
	         *  Address is a string of shape '<host>:<port>'. Provided function can return either a Promise resolved with an array of addresses
	         *  or array of addresses directly.
	         *
	         * @type {function(address: string) {} |undefined}
	         */
	        this.resolver = undefined;
	        /**
	         * Configure filter for Notification objects returned in {@Link ResultSummary#notifications}.
	         *
	         * See {@link SessionConfig#notificationFilter} for usage instructions.
	         *
	         * @type {NotificationFilter|undefined}
	         */
	        this.notificationFilter = undefined;
	        /**
	         * Optionally override the default user agent name.
	         *
	         * **Default**: ```'neo4j-javascript/<version>'```
	         *
	         * @type {string|undefined}
	         */
	        this.userAgent = undefined;
	        /**
	         * Specify if telemetry collection is disabled.
	         *
	         * By default, the driver will send anonymous usage statistics to the server it connects to if the server requests those.
	         * By setting ``telemetryDisabled=true``, the driver will not send any telemetry data.
	         *
	         * The driver transmits the following information:
	         *
	         * Every time one of the following APIs is used to execute a query (for the first time), the server is informed of this
	         * (without any further information like arguments, client identifiers, etc.):
	         *
	         * * {@link Driver#executeQuery}
	         * * {@link Session#run}
	         * * {@link Session#beginTransaction}
	         * * {@link Session#executeRead}
	         * * {@link Session#executeWrite}
	         * * {@link Session#writeTransaction}
	         * * {@link Session#readTransaction}
	         * * The reactive counterparts of methods above.
	         *
	         * Metrics are only collected when enabled both in server and driver instances.
	         *
	         * **Default**: ```false```
	         *
	         * @type {boolean}
	         */
	        this.telemetryDisabled = false;
	    }
	}
	class InternalConfig extends Config {
	    boltAgent;
	}

	var types = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Config: Config,
		InternalConfig: InternalConfig
	});

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
	 * Object containing string constants representing predefined {@link Neo4jError} codes.
	 */
	const error = {
	    SERVICE_UNAVAILABLE: SERVICE_UNAVAILABLE$5,
	    SESSION_EXPIRED: SESSION_EXPIRED$2,
	    PROTOCOL_ERROR: PROTOCOL_ERROR$6
	};
	/**
	 * @private
	 */
	const forExport = {
	    authTokenManagers,
	    newError,
	    Neo4jError,
	    isRetriableError,
	    error,
	    Integer,
	    int,
	    isInt,
	    inSafeRange,
	    toNumber,
	    toString,
	    internal,
	    isPoint,
	    Point,
	    Date: Date$1,
	    DateTime,
	    Duration,
	    isDate,
	    isDateTime,
	    isDuration,
	    isLocalDateTime,
	    isLocalTime,
	    isTime,
	    LocalDateTime,
	    LocalTime,
	    Time,
	    Node,
	    isNode,
	    Relationship,
	    isRelationship,
	    UnboundRelationship,
	    isUnboundRelationship,
	    Path,
	    isPath,
	    PathSegment,
	    isPathSegment,
	    Record,
	    ResultSummary,
	    queryType,
	    ServerInfo,
	    Notification,
	    Plan,
	    ProfiledPlan,
	    QueryStatistics,
	    Stats,
	    Result,
	    EagerResult,
	    Transaction,
	    ManagedTransaction,
	    TransactionPromise,
	    Session,
	    Driver,
	    Connection: Connection$1,
	    types,
	    driver,
	    json,
	    auth,
	    bookmarkManager,
	    routing,
	    resultTransformers,
	    notificationCategory,
	    notificationSeverityLevel,
	    notificationFilterDisabledCategory,
	    notificationFilterMinimumSeverityLevel
	};

	var lib$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		authTokenManagers: authTokenManagers,
		newError: newError,
		Neo4jError: Neo4jError,
		isRetriableError: isRetriableError,
		error: error,
		Integer: Integer,
		int: int,
		isInt: isInt,
		inSafeRange: inSafeRange,
		toNumber: toNumber,
		toString: toString,
		internal: internal,
		isPoint: isPoint,
		Point: Point,
		Date: Date$1,
		DateTime: DateTime,
		Duration: Duration,
		isDate: isDate,
		isDateTime: isDateTime,
		isDuration: isDuration,
		isLocalDateTime: isLocalDateTime,
		isLocalTime: isLocalTime,
		isTime: isTime,
		LocalDateTime: LocalDateTime,
		LocalTime: LocalTime,
		Time: Time,
		Node: Node,
		isNode: isNode,
		Relationship: Relationship,
		isRelationship: isRelationship,
		UnboundRelationship: UnboundRelationship,
		isUnboundRelationship: isUnboundRelationship,
		Path: Path,
		isPath: isPath,
		PathSegment: PathSegment,
		isPathSegment: isPathSegment,
		Record: Record,
		ResultSummary: ResultSummary,
		queryType: queryType,
		ServerInfo: ServerInfo,
		Notification: Notification,
		Plan: Plan,
		ProfiledPlan: ProfiledPlan,
		QueryStatistics: QueryStatistics,
		Stats: Stats,
		Result: Result,
		EagerResult: EagerResult,
		ConnectionProvider: ConnectionProvider,
		Connection: Connection$1,
		Transaction: Transaction,
		ManagedTransaction: ManagedTransaction,
		TransactionPromise: TransactionPromise,
		Session: Session,
		Driver: Driver,
		types: types,
		driver: driver,
		json: json,
		auth: auth,
		bookmarkManager: bookmarkManager,
		staticAuthTokenManager: staticAuthTokenManager,
		routing: routing,
		resultTransformers: resultTransformers,
		notificationCategory: notificationCategory,
		notificationSeverityLevel: notificationSeverityLevel,
		notificationFilterDisabledCategory: notificationFilterDisabledCategory,
		notificationFilterMinimumSeverityLevel: notificationFilterMinimumSeverityLevel,
		'default': forExport
	});

	var require$$2 = /*@__PURE__*/getAugmentedNamespace(lib$1);

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
	 * A facility to select most appropriate reader or writer among the given addresses for request processing.
	 */
	class LoadBalancingStrategy {
	    /**
	     * Select next most appropriate reader from the list of given readers.
	     * @param {string[]} knownReaders an array of currently known readers to select from.
	     * @return {string} most appropriate reader or `null` if given array is empty.
	     */
	    selectReader(knownReaders) {
	        throw new Error('Abstract function');
	    }
	    /**
	     * Select next most appropriate writer from the list of given writers.
	     * @param {string[]} knownWriters an array of currently known writers to select from.
	     * @return {string} most appropriate writer or `null` if given array is empty.
	     */
	    selectWriter(knownWriters) {
	        throw new Error('Abstract function');
	    }
	}

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
	class RoundRobinArrayIndex {
	    /**
	     * @constructor
	     * @param {number} [initialOffset=0] the initial offset for round robin.
	     */
	    constructor(initialOffset) {
	        this._offset = initialOffset || 0;
	    }
	    /**
	     * Get next index for an array with given length.
	     * @param {number} arrayLength the array length.
	     * @return {number} index in the array.
	     */
	    next(arrayLength) {
	        if (arrayLength === 0) {
	            return -1;
	        }
	        const nextOffset = this._offset;
	        this._offset += 1;
	        if (this._offset === Number.MAX_SAFE_INTEGER) {
	            this._offset = 0;
	        }
	        return nextOffset % arrayLength;
	    }
	}

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
	class LeastConnectedLoadBalancingStrategy extends LoadBalancingStrategy {
	    /**
	     * @constructor
	     * @param {Pool} connectionPool the connection pool of this driver.
	     */
	    constructor(connectionPool) {
	        super();
	        this._readersIndex = new RoundRobinArrayIndex();
	        this._writersIndex = new RoundRobinArrayIndex();
	        this._connectionPool = connectionPool;
	    }
	    /**
	     * @inheritDoc
	     */
	    selectReader(knownReaders) {
	        return this._select(knownReaders, this._readersIndex);
	    }
	    /**
	     * @inheritDoc
	     */
	    selectWriter(knownWriters) {
	        return this._select(knownWriters, this._writersIndex);
	    }
	    _select(addresses, roundRobinIndex) {
	        const length = addresses.length;
	        if (length === 0) {
	            return null;
	        }
	        // choose start index for iteration in round-robin fashion
	        const startIndex = roundRobinIndex.next(length);
	        let index = startIndex;
	        let leastConnectedAddress = null;
	        let leastActiveConnections = Number.MAX_SAFE_INTEGER;
	        // iterate over the array to find least connected address
	        do {
	            const address = addresses[index];
	            const activeConnections = this._connectionPool.activeResourceCount(address);
	            if (activeConnections < leastActiveConnections) {
	                leastConnectedAddress = address;
	                leastActiveConnections = activeConnections;
	            }
	            // loop over to the start of the array when end is reached
	            if (index === length - 1) {
	                index = 0;
	            }
	            else {
	                index++;
	            }
	        } while (index !== startIndex);
	        return leastConnectedAddress;
	    }
	}

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

	var index$6 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': LeastConnectedLoadBalancingStrategy,
		LoadBalancingStrategy: LoadBalancingStrategy,
		LeastConnectedLoadBalancingStrategy: LeastConnectedLoadBalancingStrategy
	});

	var buffer = {};

	var base64Js = {};

	base64Js.byteLength = byteLength;
	base64Js.toByteArray = toByteArray;
	base64Js.fromByteArray = fromByteArray;

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i];
	  revLookup[code.charCodeAt(i)] = i;
	}

	// Support decoding URL-safe base64 strings, as Node.js does.
	// See: https://en.wikipedia.org/wiki/Base64#URL_applications
	revLookup['-'.charCodeAt(0)] = 62;
	revLookup['_'.charCodeAt(0)] = 63;

	function getLens (b64) {
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // Trim off extra bytes after placeholder bytes are found
	  // See: https://github.com/beatgammit/base64-js/issues/42
	  var validLen = b64.indexOf('=');
	  if (validLen === -1) validLen = len;

	  var placeHoldersLen = validLen === len
	    ? 0
	    : 4 - (validLen % 4);

	  return [validLen, placeHoldersLen]
	}

	// base64 is 4/3 + up to two characters of the original data
	function byteLength (b64) {
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function _byteLength (b64, validLen, placeHoldersLen) {
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function toByteArray (b64) {
	  var tmp;
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];

	  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

	  var curByte = 0;

	  // if there are placeholders, only get up to the last complete 4 chars
	  var len = placeHoldersLen > 0
	    ? validLen - 4
	    : validLen;

	  var i;
	  for (i = 0; i < len; i += 4) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 18) |
	      (revLookup[b64.charCodeAt(i + 1)] << 12) |
	      (revLookup[b64.charCodeAt(i + 2)] << 6) |
	      revLookup[b64.charCodeAt(i + 3)];
	    arr[curByte++] = (tmp >> 16) & 0xFF;
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 2) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 2) |
	      (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 1) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 10) |
	      (revLookup[b64.charCodeAt(i + 1)] << 4) |
	      (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] +
	    lookup[num >> 12 & 0x3F] +
	    lookup[num >> 6 & 0x3F] +
	    lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp =
	      ((uint8[i] << 16) & 0xFF0000) +
	      ((uint8[i + 1] << 8) & 0xFF00) +
	      (uint8[i + 2] & 0xFF);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 2] +
	      lookup[(tmp << 4) & 0x3F] +
	      '=='
	    );
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 10] +
	      lookup[(tmp >> 4) & 0x3F] +
	      lookup[(tmp << 2) & 0x3F] +
	      '='
	    );
	  }

	  return parts.join('')
	}

	var ieee754 = {};

	/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

	ieee754.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	};

	ieee754.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = ((value * c) - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};

	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <https://feross.org>
	 * @license  MIT
	 */

	(function (exports) {

	const base64 = base64Js;
	const ieee754$1 = ieee754;
	const customInspectSymbol =
	  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
	    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
	    : null;

	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;

	const K_MAX_LENGTH = 0x7fffffff;
	exports.kMaxLength = K_MAX_LENGTH;

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
	 *               implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * We report that the browser does not support typed arrays if the are not subclassable
	 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
	 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
	 * for __proto__ and has a buggy typed array implementation.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

	if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
	    typeof console.error === 'function') {
	  console.error(
	    'This browser lacks typed array (Uint8Array) support which is required by ' +
	    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
	  );
	}

	function typedArraySupport () {
	  // Can typed array instances can be augmented?
	  try {
	    const arr = new Uint8Array(1);
	    const proto = { foo: function () { return 42 } };
	    Object.setPrototypeOf(proto, Uint8Array.prototype);
	    Object.setPrototypeOf(arr, proto);
	    return arr.foo() === 42
	  } catch (e) {
	    return false
	  }
	}

	Object.defineProperty(Buffer.prototype, 'parent', {
	  enumerable: true,
	  get: function () {
	    if (!Buffer.isBuffer(this)) return undefined
	    return this.buffer
	  }
	});

	Object.defineProperty(Buffer.prototype, 'offset', {
	  enumerable: true,
	  get: function () {
	    if (!Buffer.isBuffer(this)) return undefined
	    return this.byteOffset
	  }
	});

	function createBuffer (length) {
	  if (length > K_MAX_LENGTH) {
	    throw new RangeError('The value "' + length + '" is invalid for option "size"')
	  }
	  // Return an augmented `Uint8Array` instance
	  const buf = new Uint8Array(length);
	  Object.setPrototypeOf(buf, Buffer.prototype);
	  return buf
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new TypeError(
	        'The "string" argument must be of type string. Received type number'
	      )
	    }
	    return allocUnsafe(arg)
	  }
	  return from(arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192; // not used by this implementation

	function from (value, encodingOrOffset, length) {
	  if (typeof value === 'string') {
	    return fromString(value, encodingOrOffset)
	  }

	  if (ArrayBuffer.isView(value)) {
	    return fromArrayView(value)
	  }

	  if (value == null) {
	    throw new TypeError(
	      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
	      'or Array-like Object. Received type ' + (typeof value)
	    )
	  }

	  if (isInstance(value, ArrayBuffer) ||
	      (value && isInstance(value.buffer, ArrayBuffer))) {
	    return fromArrayBuffer(value, encodingOrOffset, length)
	  }

	  if (typeof SharedArrayBuffer !== 'undefined' &&
	      (isInstance(value, SharedArrayBuffer) ||
	      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
	    return fromArrayBuffer(value, encodingOrOffset, length)
	  }

	  if (typeof value === 'number') {
	    throw new TypeError(
	      'The "value" argument must not be of type number. Received type number'
	    )
	  }

	  const valueOf = value.valueOf && value.valueOf();
	  if (valueOf != null && valueOf !== value) {
	    return Buffer.from(valueOf, encodingOrOffset, length)
	  }

	  const b = fromObject(value);
	  if (b) return b

	  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
	      typeof value[Symbol.toPrimitive] === 'function') {
	    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
	  }

	  throw new TypeError(
	    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
	    'or Array-like Object. Received type ' + (typeof value)
	  )
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(value, encodingOrOffset, length)
	};

	// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
	// https://github.com/feross/buffer/pull/148
	Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
	Object.setPrototypeOf(Buffer, Uint8Array);

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be of type number')
	  } else if (size < 0) {
	    throw new RangeError('The value "' + size + '" is invalid for option "size"')
	  }
	}

	function alloc (size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpreted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(size).fill(fill, encoding)
	      : createBuffer(size).fill(fill)
	  }
	  return createBuffer(size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(size, fill, encoding)
	};

	function allocUnsafe (size) {
	  assertSize(size);
	  return createBuffer(size < 0 ? 0 : checked(size) | 0)
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(size)
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(size)
	};

	function fromString (string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('Unknown encoding: ' + encoding)
	  }

	  const length = byteLength(string, encoding) | 0;
	  let buf = createBuffer(length);

	  const actual = buf.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    buf = buf.slice(0, actual);
	  }

	  return buf
	}

	function fromArrayLike (array) {
	  const length = array.length < 0 ? 0 : checked(array.length) | 0;
	  const buf = createBuffer(length);
	  for (let i = 0; i < length; i += 1) {
	    buf[i] = array[i] & 255;
	  }
	  return buf
	}

	function fromArrayView (arrayView) {
	  if (isInstance(arrayView, Uint8Array)) {
	    const copy = new Uint8Array(arrayView);
	    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
	  }
	  return fromArrayLike(arrayView)
	}

	function fromArrayBuffer (array, byteOffset, length) {
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('"offset" is outside of buffer bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('"length" is outside of buffer bounds')
	  }

	  let buf;
	  if (byteOffset === undefined && length === undefined) {
	    buf = new Uint8Array(array);
	  } else if (length === undefined) {
	    buf = new Uint8Array(array, byteOffset);
	  } else {
	    buf = new Uint8Array(array, byteOffset, length);
	  }

	  // Return an augmented `Uint8Array` instance
	  Object.setPrototypeOf(buf, Buffer.prototype);

	  return buf
	}

	function fromObject (obj) {
	  if (Buffer.isBuffer(obj)) {
	    const len = checked(obj.length) | 0;
	    const buf = createBuffer(len);

	    if (buf.length === 0) {
	      return buf
	    }

	    obj.copy(buf, 0, 0, len);
	    return buf
	  }

	  if (obj.length !== undefined) {
	    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
	      return createBuffer(0)
	    }
	    return fromArrayLike(obj)
	  }

	  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
	    return fromArrayLike(obj.data)
	  }
	}

	function checked (length) {
	  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= K_MAX_LENGTH) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0;
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return b != null && b._isBuffer === true &&
	    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
	};

	Buffer.compare = function compare (a, b) {
	  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
	  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError(
	      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
	    )
	  }

	  if (a === b) return 0

	  let x = a.length;
	  let y = b.length;

	  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	};

	Buffer.concat = function concat (list, length) {
	  if (!Array.isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  let i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  const buffer = Buffer.allocUnsafe(length);
	  let pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    let buf = list[i];
	    if (isInstance(buf, Uint8Array)) {
	      if (pos + buf.length > buffer.length) {
	        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
	        buf.copy(buffer, pos);
	      } else {
	        Uint8Array.prototype.set.call(
	          buffer,
	          buf,
	          pos
	        );
	      }
	    } else if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    } else {
	      buf.copy(buffer, pos);
	    }
	    pos += buf.length;
	  }
	  return buffer
	};

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    throw new TypeError(
	      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
	      'Received type ' + typeof string
	    )
	  }

	  const len = string.length;
	  const mustMatch = (arguments.length > 2 && arguments[2] === true);
	  if (!mustMatch && len === 0) return 0

	  // Use a for loop to avoid recursion
	  let loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) {
	          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
	        }
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString (encoding, start, end) {
	  let loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
	// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
	// reliably in a browserify context because there could be multiple different
	// copies of the 'buffer' package in use. This method works even for Buffer
	// instances that were created from another copy of the `buffer` package.
	// See: https://github.com/feross/buffer/issues/154
	Buffer.prototype._isBuffer = true;

	function swap (b, n, m) {
	  const i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer.prototype.swap16 = function swap16 () {
	  const len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (let i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this
	};

	Buffer.prototype.swap32 = function swap32 () {
	  const len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (let i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this
	};

	Buffer.prototype.swap64 = function swap64 () {
	  const len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (let i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this
	};

	Buffer.prototype.toString = function toString () {
	  const length = this.length;
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	};

	Buffer.prototype.toLocaleString = Buffer.prototype.toString;

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	};

	Buffer.prototype.inspect = function inspect () {
	  let str = '';
	  const max = exports.INSPECT_MAX_BYTES;
	  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
	  if (this.length > max) str += ' ... ';
	  return '<Buffer ' + str + '>'
	};
	if (customInspectSymbol) {
	  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (isInstance(target, Uint8Array)) {
	    target = Buffer.from(target, target.offset, target.byteLength);
	  }
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError(
	      'The "target" argument must be one of type Buffer or Uint8Array. ' +
	      'Received type ' + (typeof target)
	    )
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0

	  let x = thisEnd - thisStart;
	  let y = end - start;
	  const len = Math.min(x, y);

	  const thisCopy = this.slice(thisStart, thisEnd);
	  const targetCopy = target.slice(start, end);

	  for (let i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset; // Coerce to Number.
	  if (numberIsNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1);
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  let indexSize = 1;
	  let arrLength = arr.length;
	  let valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  let i;
	  if (dir) {
	    let foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      let found = true;
	      for (let j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false;
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	};

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	};

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	};

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  const remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  const strLen = string.length;

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  let i;
	  for (i = 0; i < length; ++i) {
	    const parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (numberIsNaN(parsed)) return i
	    buf[offset + i] = parsed;
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset >>> 0;
	    if (isFinite(length)) {
	      length = length >>> 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  const remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8';

	  let loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return asciiWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	};

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end);
	  const res = [];

	  let i = start;
	  while (i < end) {
	    const firstByte = buf[i];
	    let codePoint = null;
	    let bytesPerSequence = (firstByte > 0xEF)
	      ? 4
	      : (firstByte > 0xDF)
	          ? 3
	          : (firstByte > 0xBF)
	              ? 2
	              : 1;

	    if (i + bytesPerSequence <= end) {
	      let secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	const MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray (codePoints) {
	  const len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  let res = '';
	  let i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    );
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  let ret = '';
	  end = Math.min(buf.length, end);

	  for (let i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  let ret = '';
	  end = Math.min(buf.length, end);

	  for (let i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  const len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  let out = '';
	  for (let i = start; i < end; ++i) {
	    out += hexSliceLookupTable[buf[i]];
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  const bytes = buf.slice(start, end);
	  let res = '';
	  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
	  for (let i = 0; i < bytes.length - 1; i += 2) {
	    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256));
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  const len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  const newBuf = this.subarray(start, end);
	  // Return an augmented `Uint8Array` instance
	  Object.setPrototypeOf(newBuf, Buffer.prototype);

	  return newBuf
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUintLE =
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  let val = this[offset];
	  let mul = 1;
	  let i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUintBE =
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  let val = this[offset + --byteLength];
	  let mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUint8 =
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset]
	};

	Buffer.prototype.readUint16LE =
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | (this[offset + 1] << 8)
	};

	Buffer.prototype.readUint16BE =
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return (this[offset] << 8) | this[offset + 1]
	};

	Buffer.prototype.readUint32LE =
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	};

	Buffer.prototype.readUint32BE =
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	};

	Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
	  offset = offset >>> 0;
	  validateNumber(offset, 'offset');
	  const first = this[offset];
	  const last = this[offset + 7];
	  if (first === undefined || last === undefined) {
	    boundsError(offset, this.length - 8);
	  }

	  const lo = first +
	    this[++offset] * 2 ** 8 +
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 24;

	  const hi = this[++offset] +
	    this[++offset] * 2 ** 8 +
	    this[++offset] * 2 ** 16 +
	    last * 2 ** 24;

	  return BigInt(lo) + (BigInt(hi) << BigInt(32))
	});

	Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
	  offset = offset >>> 0;
	  validateNumber(offset, 'offset');
	  const first = this[offset];
	  const last = this[offset + 7];
	  if (first === undefined || last === undefined) {
	    boundsError(offset, this.length - 8);
	  }

	  const hi = first * 2 ** 24 +
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 8 +
	    this[++offset];

	  const lo = this[++offset] * 2 ** 24 +
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 8 +
	    last;

	  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
	});

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  let val = this[offset];
	  let mul = 1;
	  let i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  let i = byteLength;
	  let mul = 1;
	  let val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	};

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  const val = this[offset] | (this[offset + 1] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  const val = this[offset + 1] | (this[offset] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	};

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	};

	Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
	  offset = offset >>> 0;
	  validateNumber(offset, 'offset');
	  const first = this[offset];
	  const last = this[offset + 7];
	  if (first === undefined || last === undefined) {
	    boundsError(offset, this.length - 8);
	  }

	  const val = this[offset + 4] +
	    this[offset + 5] * 2 ** 8 +
	    this[offset + 6] * 2 ** 16 +
	    (last << 24); // Overflow

	  return (BigInt(val) << BigInt(32)) +
	    BigInt(first +
	    this[++offset] * 2 ** 8 +
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 24)
	});

	Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
	  offset = offset >>> 0;
	  validateNumber(offset, 'offset');
	  const first = this[offset];
	  const last = this[offset + 7];
	  if (first === undefined || last === undefined) {
	    boundsError(offset, this.length - 8);
	  }

	  const val = (first << 24) + // Overflow
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 8 +
	    this[++offset];

	  return (BigInt(val) << BigInt(32)) +
	    BigInt(this[++offset] * 2 ** 24 +
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 8 +
	    last)
	});

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754$1.read(this, offset, true, 23, 4)
	};

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754$1.read(this, offset, false, 23, 4)
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754$1.read(this, offset, true, 52, 8)
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754$1.read(this, offset, false, 52, 8)
	};

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUintLE =
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) {
	    const maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  let mul = 1;
	  let i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUintBE =
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) {
	    const maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  let i = byteLength - 1;
	  let mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUint8 =
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeUint16LE =
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  this[offset] = (value & 0xff);
	  this[offset + 1] = (value >>> 8);
	  return offset + 2
	};

	Buffer.prototype.writeUint16BE =
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  this[offset] = (value >>> 8);
	  this[offset + 1] = (value & 0xff);
	  return offset + 2
	};

	Buffer.prototype.writeUint32LE =
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  this[offset + 3] = (value >>> 24);
	  this[offset + 2] = (value >>> 16);
	  this[offset + 1] = (value >>> 8);
	  this[offset] = (value & 0xff);
	  return offset + 4
	};

	Buffer.prototype.writeUint32BE =
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  this[offset] = (value >>> 24);
	  this[offset + 1] = (value >>> 16);
	  this[offset + 2] = (value >>> 8);
	  this[offset + 3] = (value & 0xff);
	  return offset + 4
	};

	function wrtBigUInt64LE (buf, value, offset, min, max) {
	  checkIntBI(value, min, max, buf, offset, 7);

	  let lo = Number(value & BigInt(0xffffffff));
	  buf[offset++] = lo;
	  lo = lo >> 8;
	  buf[offset++] = lo;
	  lo = lo >> 8;
	  buf[offset++] = lo;
	  lo = lo >> 8;
	  buf[offset++] = lo;
	  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
	  buf[offset++] = hi;
	  hi = hi >> 8;
	  buf[offset++] = hi;
	  hi = hi >> 8;
	  buf[offset++] = hi;
	  hi = hi >> 8;
	  buf[offset++] = hi;
	  return offset
	}

	function wrtBigUInt64BE (buf, value, offset, min, max) {
	  checkIntBI(value, min, max, buf, offset, 7);

	  let lo = Number(value & BigInt(0xffffffff));
	  buf[offset + 7] = lo;
	  lo = lo >> 8;
	  buf[offset + 6] = lo;
	  lo = lo >> 8;
	  buf[offset + 5] = lo;
	  lo = lo >> 8;
	  buf[offset + 4] = lo;
	  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
	  buf[offset + 3] = hi;
	  hi = hi >> 8;
	  buf[offset + 2] = hi;
	  hi = hi >> 8;
	  buf[offset + 1] = hi;
	  hi = hi >> 8;
	  buf[offset] = hi;
	  return offset + 8
	}

	Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
	  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
	});

	Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
	  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
	});

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    const limit = Math.pow(2, (8 * byteLength) - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  let i = 0;
	  let mul = 1;
	  let sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    const limit = Math.pow(2, (8 * byteLength) - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  let i = byteLength - 1;
	  let mul = 1;
	  let sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  this[offset] = (value & 0xff);
	  this[offset + 1] = (value >>> 8);
	  return offset + 2
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  this[offset] = (value >>> 8);
	  this[offset + 1] = (value & 0xff);
	  return offset + 2
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  this[offset] = (value & 0xff);
	  this[offset + 1] = (value >>> 8);
	  this[offset + 2] = (value >>> 16);
	  this[offset + 3] = (value >>> 24);
	  return offset + 4
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  this[offset] = (value >>> 24);
	  this[offset + 1] = (value >>> 16);
	  this[offset + 2] = (value >>> 8);
	  this[offset + 3] = (value & 0xff);
	  return offset + 4
	};

	Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
	  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
	});

	Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
	  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
	});

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4);
	  }
	  ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	};

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8);
	  }
	  ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  const len = end - start;

	  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
	    // Use built-in when available, missing from IE11
	    this.copyWithin(targetStart, start, end);
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, end),
	      targetStart
	    );
	  }

	  return len
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	    if (val.length === 1) {
	      const code = val.charCodeAt(0);
	      if ((encoding === 'utf8' && code < 128) ||
	          encoding === 'latin1') {
	        // Fast path: If `val` fits into a single byte, use that numeric value.
	        val = code;
	      }
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  } else if (typeof val === 'boolean') {
	    val = Number(val);
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  let i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    const bytes = Buffer.isBuffer(val)
	      ? val
	      : Buffer.from(val, encoding);
	    const len = bytes.length;
	    if (len === 0) {
	      throw new TypeError('The value "' + val +
	        '" is invalid for argument "value"')
	    }
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this
	};

	// CUSTOM ERRORS
	// =============

	// Simplified versions from Node, changed for Buffer-only usage
	const errors = {};
	function E (sym, getMessage, Base) {
	  errors[sym] = class NodeError extends Base {
	    constructor () {
	      super();

	      Object.defineProperty(this, 'message', {
	        value: getMessage.apply(this, arguments),
	        writable: true,
	        configurable: true
	      });

	      // Add the error code to the name to include it in the stack trace.
	      this.name = `${this.name} [${sym}]`;
	      // Access the stack to generate the error message including the error code
	      // from the name.
	      this.stack; // eslint-disable-line no-unused-expressions
	      // Reset the name to the actual name.
	      delete this.name;
	    }

	    get code () {
	      return sym
	    }

	    set code (value) {
	      Object.defineProperty(this, 'code', {
	        configurable: true,
	        enumerable: true,
	        value,
	        writable: true
	      });
	    }

	    toString () {
	      return `${this.name} [${sym}]: ${this.message}`
	    }
	  };
	}

	E('ERR_BUFFER_OUT_OF_BOUNDS',
	  function (name) {
	    if (name) {
	      return `${name} is outside of buffer bounds`
	    }

	    return 'Attempt to access memory outside buffer bounds'
	  }, RangeError);
	E('ERR_INVALID_ARG_TYPE',
	  function (name, actual) {
	    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
	  }, TypeError);
	E('ERR_OUT_OF_RANGE',
	  function (str, range, input) {
	    let msg = `The value of "${str}" is out of range.`;
	    let received = input;
	    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
	      received = addNumericalSeparator(String(input));
	    } else if (typeof input === 'bigint') {
	      received = String(input);
	      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
	        received = addNumericalSeparator(received);
	      }
	      received += 'n';
	    }
	    msg += ` It must be ${range}. Received ${received}`;
	    return msg
	  }, RangeError);

	function addNumericalSeparator (val) {
	  let res = '';
	  let i = val.length;
	  const start = val[0] === '-' ? 1 : 0;
	  for (; i >= start + 4; i -= 3) {
	    res = `_${val.slice(i - 3, i)}${res}`;
	  }
	  return `${val.slice(0, i)}${res}`
	}

	// CHECK FUNCTIONS
	// ===============

	function checkBounds (buf, offset, byteLength) {
	  validateNumber(offset, 'offset');
	  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
	    boundsError(offset, buf.length - (byteLength + 1));
	  }
	}

	function checkIntBI (value, min, max, buf, offset, byteLength) {
	  if (value > max || value < min) {
	    const n = typeof min === 'bigint' ? 'n' : '';
	    let range;
	    if (byteLength > 3) {
	      if (min === 0 || min === BigInt(0)) {
	        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`;
	      } else {
	        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
	                `${(byteLength + 1) * 8 - 1}${n}`;
	      }
	    } else {
	      range = `>= ${min}${n} and <= ${max}${n}`;
	    }
	    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
	  }
	  checkBounds(buf, offset, byteLength);
	}

	function validateNumber (value, name) {
	  if (typeof value !== 'number') {
	    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
	  }
	}

	function boundsError (value, length, type) {
	  if (Math.floor(value) !== value) {
	    validateNumber(value, type);
	    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
	  }

	  if (length < 0) {
	    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
	  }

	  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
	                                    `>= ${type ? 1 : 0} and <= ${length}`,
	                                    value)
	}

	// HELPER FUNCTIONS
	// ================

	const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

	function base64clean (str) {
	  // Node takes equal signs as end of the Base64 encoding
	  str = str.split('=')[0];
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = str.trim().replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity;
	  let codePoint;
	  const length = string.length;
	  let leadSurrogate = null;
	  const bytes = [];

	  for (let i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  const byteArray = [];
	  for (let i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  let c, hi, lo;
	  const byteArray = [];
	  for (let i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  let i;
	  for (i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i];
	  }
	  return i
	}

	// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
	// the `instanceof` check but they should be treated as of that type.
	// See: https://github.com/feross/buffer/issues/166
	function isInstance (obj, type) {
	  return obj instanceof type ||
	    (obj != null && obj.constructor != null && obj.constructor.name != null &&
	      obj.constructor.name === type.name)
	}
	function numberIsNaN (obj) {
	  // For IE11 support
	  return obj !== obj // eslint-disable-line no-self-compare
	}

	// Create lookup table for `toString('hex')`
	// See: https://github.com/feross/buffer/issues/219
	const hexSliceLookupTable = (function () {
	  const alphabet = '0123456789abcdef';
	  const table = new Array(256);
	  for (let i = 0; i < 16; ++i) {
	    const i16 = i * 16;
	    for (let j = 0; j < 16; ++j) {
	      table[i16 + j] = alphabet[i] + alphabet[j];
	    }
	  }
	  return table
	})();

	// Return not function with Error if BigInt not supported
	function defineBigIntMethod (fn) {
	  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
	}

	function BufferBigIntNotDefined () {
	  throw new Error('BigInt not supported')
	}
	}(buffer));

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
	 * Common base with default implementation for most buffer methods.
	 * Buffers are stateful - they track a current "position", this helps greatly
	 * when reading and writing from them incrementally. You can also ignore the
	 * stateful read/write methods.
	 * readXXX and writeXXX-methods move the inner position of the buffer.
	 * putXXX and getXXX-methods do not.
	 * @access private
	 */
	class BaseBuffer {
	    /**
	     * Create a instance with the injected size.
	     * @constructor
	     * @param {Integer} size
	     */
	    constructor(size) {
	        this.position = 0;
	        this.length = size;
	    }
	    getUInt8(position) {
	        throw new Error('Not implemented');
	    }
	    getInt8(position) {
	        throw new Error('Not implemented');
	    }
	    getFloat64(position) {
	        throw new Error('Not implemented');
	    }
	    putUInt8(position, val) {
	        throw new Error('Not implemented');
	    }
	    putInt8(position, val) {
	        throw new Error('Not implemented');
	    }
	    putFloat64(position, val) {
	        throw new Error('Not implemented');
	    }
	    /**
	     * @param p
	     */
	    getInt16(p) {
	        return (this.getInt8(p) << 8) | this.getUInt8(p + 1);
	    }
	    /**
	     * @param p
	     */
	    getUInt16(p) {
	        return (this.getUInt8(p) << 8) | this.getUInt8(p + 1);
	    }
	    /**
	     * @param p
	     */
	    getInt32(p) {
	        return ((this.getInt8(p) << 24) |
	            (this.getUInt8(p + 1) << 16) |
	            (this.getUInt8(p + 2) << 8) |
	            this.getUInt8(p + 3));
	    }
	    /**
	     * @param p
	     */
	    getUInt32(p) {
	        return ((this.getUInt8(p) << 24) |
	            (this.getUInt8(p + 1) << 16) |
	            (this.getUInt8(p + 2) << 8) |
	            this.getUInt8(p + 3));
	    }
	    /**
	     * @param p
	     */
	    getInt64(p) {
	        return ((this.getInt8(p) << 56) |
	            (this.getUInt8(p + 1) << 48) |
	            (this.getUInt8(p + 2) << 40) |
	            (this.getUInt8(p + 3) << 32) |
	            (this.getUInt8(p + 4) << 24) |
	            (this.getUInt8(p + 5) << 16) |
	            (this.getUInt8(p + 6) << 8) |
	            this.getUInt8(p + 7));
	    }
	    /**
	     * Get a slice of this buffer. This method does not copy any data,
	     * but simply provides a slice view of this buffer
	     * @param start
	     * @param length
	     */
	    getSlice(start, length) {
	        return new SliceBuffer(start, length, this);
	    }
	    /**
	     * @param p
	     * @param val
	     */
	    putInt16(p, val) {
	        this.putInt8(p, val >> 8);
	        this.putUInt8(p + 1, val & 0xff);
	    }
	    /**
	     * @param p
	     * @param val
	     */
	    putUInt16(p, val) {
	        this.putUInt8(p, (val >> 8) & 0xff);
	        this.putUInt8(p + 1, val & 0xff);
	    }
	    /**
	     * @param p
	     * @param val
	     */
	    putInt32(p, val) {
	        this.putInt8(p, val >> 24);
	        this.putUInt8(p + 1, (val >> 16) & 0xff);
	        this.putUInt8(p + 2, (val >> 8) & 0xff);
	        this.putUInt8(p + 3, val & 0xff);
	    }
	    /**
	     * @param p
	     * @param val
	     */
	    putUInt32(p, val) {
	        this.putUInt8(p, (val >> 24) & 0xff);
	        this.putUInt8(p + 1, (val >> 16) & 0xff);
	        this.putUInt8(p + 2, (val >> 8) & 0xff);
	        this.putUInt8(p + 3, val & 0xff);
	    }
	    /**
	     * @param p
	     * @param val
	     */
	    putInt64(p, val) {
	        this.putInt8(p, val >> 48);
	        this.putUInt8(p + 1, (val >> 42) & 0xff);
	        this.putUInt8(p + 2, (val >> 36) & 0xff);
	        this.putUInt8(p + 3, (val >> 30) & 0xff);
	        this.putUInt8(p + 4, (val >> 24) & 0xff);
	        this.putUInt8(p + 5, (val >> 16) & 0xff);
	        this.putUInt8(p + 6, (val >> 8) & 0xff);
	        this.putUInt8(p + 7, val & 0xff);
	    }
	    /**
	     * @param position
	     * @param other
	     */
	    putBytes(position, other) {
	        for (let i = 0, end = other.remaining(); i < end; i++) {
	            this.putUInt8(position + i, other.readUInt8());
	        }
	    }
	    /**
	     * Read from state position.
	     */
	    readUInt8() {
	        return this.getUInt8(this._updatePos(1));
	    }
	    /**
	     * Read from state position.
	     */
	    readInt8() {
	        return this.getInt8(this._updatePos(1));
	    }
	    /**
	     * Read from state position.
	     */
	    readUInt16() {
	        return this.getUInt16(this._updatePos(2));
	    }
	    /**
	     * Read from state position.
	     */
	    readUInt32() {
	        return this.getUInt32(this._updatePos(4));
	    }
	    /**
	     * Read from state position.
	     */
	    readInt16() {
	        return this.getInt16(this._updatePos(2));
	    }
	    /**
	     * Read from state position.
	     */
	    readInt32() {
	        return this.getInt32(this._updatePos(4));
	    }
	    /**
	     * Read from state position.
	     */
	    readInt64() {
	        return this.getInt32(this._updatePos(8));
	    }
	    /**
	     * Read from state position.
	     */
	    readFloat64() {
	        return this.getFloat64(this._updatePos(8));
	    }
	    /**
	     * Write to state position.
	     * @param val
	     */
	    writeUInt8(val) {
	        this.putUInt8(this._updatePos(1), val);
	    }
	    /**
	     * Write to state position.
	     * @param val
	     */
	    writeInt8(val) {
	        this.putInt8(this._updatePos(1), val);
	    }
	    /**
	     * Write to state position.
	     * @param val
	     */
	    writeInt16(val) {
	        this.putInt16(this._updatePos(2), val);
	    }
	    /**
	     * Write to state position.
	     * @param val
	     */
	    writeInt32(val) {
	        this.putInt32(this._updatePos(4), val);
	    }
	    /**
	     * Write to state position.
	     * @param val
	     */
	    writeUInt32(val) {
	        this.putUInt32(this._updatePos(4), val);
	    }
	    /**
	     * Write to state position.
	     * @param val
	     */
	    writeInt64(val) {
	        this.putInt64(this._updatePos(8), val);
	    }
	    /**
	     * Write to state position.
	     * @param val
	     */
	    writeFloat64(val) {
	        this.putFloat64(this._updatePos(8), val);
	    }
	    /**
	     * Write to state position.
	     * @param val
	     */
	    writeBytes(val) {
	        this.putBytes(this._updatePos(val.remaining()), val);
	    }
	    /**
	     * Get a slice of this buffer. This method does not copy any data,
	     * but simply provides a slice view of this buffer
	     * @param length
	     */
	    readSlice(length) {
	        return this.getSlice(this._updatePos(length), length);
	    }
	    _updatePos(length) {
	        const p = this.position;
	        this.position += length;
	        return p;
	    }
	    /**
	     * Get remaining
	     */
	    remaining() {
	        return this.length - this.position;
	    }
	    /**
	     * Has remaining
	     */
	    hasRemaining() {
	        return this.remaining() > 0;
	    }
	    /**
	     * Reset position state
	     */
	    reset() {
	        this.position = 0;
	    }
	    /**
	     * Get string representation of buffer and it's state.
	     * @return {string} Buffer as a string
	     */
	    toString() {
	        return (this.constructor.name +
	            '( position=' +
	            this.position +
	            ' )\n  ' +
	            this.toHex());
	    }
	    /**
	     * Get string representation of buffer.
	     * @return {string} Buffer as a string
	     */
	    toHex() {
	        let out = '';
	        for (let i = 0; i < this.length; i++) {
	            let hexByte = this.getUInt8(i).toString(16);
	            if (hexByte.length === 1) {
	                hexByte = '0' + hexByte;
	            }
	            out += hexByte;
	            if (i !== this.length - 1) {
	                out += ' ';
	            }
	        }
	        return out;
	    }
	}
	/**
	 * Represents a view as slice of another buffer.
	 * @access private
	 */
	class SliceBuffer extends BaseBuffer {
	    constructor(start, length, inner) {
	        super(length);
	        this._start = start;
	        this._inner = inner;
	    }
	    putUInt8(position, val) {
	        this._inner.putUInt8(this._start + position, val);
	    }
	    getUInt8(position) {
	        return this._inner.getUInt8(this._start + position);
	    }
	    putInt8(position, val) {
	        this._inner.putInt8(this._start + position, val);
	    }
	    putFloat64(position, val) {
	        this._inner.putFloat64(this._start + position, val);
	    }
	    getInt8(position) {
	        return this._inner.getInt8(this._start + position);
	    }
	    getFloat64(position) {
	        return this._inner.getFloat64(this._start + position);
	    }
	}

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

	var index$5 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': BaseBuffer,
		BaseBuffer: BaseBuffer
	});

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
	class ChannelBuffer extends BaseBuffer {
	    constructor(arg) {
	        const buffer = newChannelJSBuffer(arg);
	        super(buffer.length);
	        this._buffer = buffer;
	    }
	    getUInt8(position) {
	        return this._buffer.readUInt8(position);
	    }
	    getInt8(position) {
	        return this._buffer.readInt8(position);
	    }
	    getFloat64(position) {
	        return this._buffer.readDoubleBE(position);
	    }
	    putUInt8(position, val) {
	        this._buffer.writeUInt8(val, position);
	    }
	    putInt8(position, val) {
	        this._buffer.writeInt8(val, position);
	    }
	    putFloat64(position, val) {
	        this._buffer.writeDoubleBE(val, position);
	    }
	    putBytes(position, val) {
	        if (val instanceof ChannelBuffer) {
	            const bytesToCopy = Math.min(val.length - val.position, this.length - position);
	            val._buffer.copy(this._buffer, position, val.position, val.position + bytesToCopy);
	            val.position += bytesToCopy;
	        }
	        else {
	            super.putBytes(position, val);
	        }
	    }
	    getSlice(start, length) {
	        return new ChannelBuffer(this._buffer.slice(start, start + length));
	    }
	}
	/**
	 * Allocate a buffer
	 *
	 * @param {number} size The buffer sizzer
	 * @returns {BaseBuffer} The buffer
	 */
	function alloc(size) {
	    return new ChannelBuffer(size);
	}
	function newChannelJSBuffer(arg) {
	    if (arg instanceof buffer.Buffer) {
	        return arg;
	    }
	    else if (typeof arg === 'number' &&
	        typeof buffer.Buffer.alloc === 'function') {
	        // use static factory function present in newer NodeJS versions to allocate new buffer with specified size
	        return buffer.Buffer.alloc(arg);
	    }
	    else {
	        // fallback to the old, potentially deprecated constructor
	        // eslint-disable-next-line n/no-deprecated-api
	        return new buffer.Buffer(arg);
	    }
	}

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
	const { util: { ENCRYPTION_OFF: ENCRYPTION_OFF$1, ENCRYPTION_ON: ENCRYPTION_ON$1 } } = internal;
	const WS_OPEN = 1;
	const WS_CLOSED = 3;
	/**
	 * Create a new WebSocketChannel to be used in web browsers.
	 * @access private
	 */
	class WebSocketChannel {
	    /**
	     * Create new instance
	     * @param {ChannelConfig} config - configuration for this channel.
	     * @param {function(): string} protocolSupplier - function that detects protocol of the web page. Should only be used in tests.
	     */
	    constructor(config, protocolSupplier = detectWebPageProtocol, socketFactory = url => new WebSocket(url)) {
	        this._open = true;
	        this._pending = [];
	        this._error = null;
	        this._handleConnectionError = this._handleConnectionError.bind(this);
	        this._config = config;
	        this._receiveTimeout = null;
	        this._receiveTimeoutStarted = false;
	        this._receiveTimeoutId = null;
	        this._closingPromise = null;
	        const { scheme, error } = determineWebSocketScheme(config, protocolSupplier);
	        if (error) {
	            this._error = error;
	            return;
	        }
	        this._ws = createWebSocket(scheme, config.address, socketFactory);
	        this._ws.binaryType = 'arraybuffer';
	        const self = this;
	        // All connection errors are not sent to the error handler
	        // we must also check for dirty close calls
	        this._ws.onclose = function (e) {
	            if (e && !e.wasClean) {
	                self._handleConnectionError();
	            }
	            self._open = false;
	        };
	        this._ws.onopen = function () {
	            // Connected! Cancel the connection timeout
	            self._clearConnectionTimeout();
	            // Drain all pending messages
	            const pending = self._pending;
	            self._pending = null;
	            for (let i = 0; i < pending.length; i++) {
	                self.write(pending[i]);
	            }
	        };
	        this._ws.onmessage = event => {
	            this._resetTimeout();
	            if (self.onmessage) {
	                const b = new ChannelBuffer(event.data);
	                self.onmessage(b);
	            }
	        };
	        this._ws.onerror = this._handleConnectionError;
	        this._connectionTimeoutFired = false;
	        this._connectionTimeoutId = this._setupConnectionTimeout();
	    }
	    _handleConnectionError() {
	        if (this._connectionTimeoutFired) {
	            // timeout fired - not connected within configured time
	            this._error = newError(`Failed to establish connection in ${this._config.connectionTimeout}ms`, this._config.connectionErrorCode);
	            if (this.onerror) {
	                this.onerror(this._error);
	            }
	            return;
	        }
	        // onerror triggers on websocket close as well.. don't get me started.
	        if (this._open && !this._timedout) {
	            // http://stackoverflow.com/questions/25779831/how-to-catch-websocket-connection-to-ws-xxxnn-failed-connection-closed-be
	            this._error = newError('WebSocket connection failure. Due to security ' +
	                'constraints in your web browser, the reason for the failure is not available ' +
	                'to this Neo4j Driver. Please use your browsers development console to determine ' +
	                'the root cause of the failure. Common reasons include the database being ' +
	                'unavailable, using the wrong connection URL or temporary network problems. ' +
	                'If you have enabled encryption, ensure your browser is configured to trust the ' +
	                'certificate Neo4j is configured to use. WebSocket `readyState` is: ' +
	                this._ws.readyState, this._config.connectionErrorCode);
	            if (this.onerror) {
	                this.onerror(this._error);
	            }
	        }
	    }
	    /**
	     * Write the passed in buffer to connection
	     * @param {ChannelBuffer} buffer - Buffer to write
	     */
	    write(buffer) {
	        // If there is a pending queue, push this on that queue. This means
	        // we are not yet connected, so we queue things locally.
	        if (this._pending !== null) {
	            this._pending.push(buffer);
	        }
	        else if (buffer instanceof ChannelBuffer) {
	            try {
	                this._ws.send(buffer._buffer);
	            }
	            catch (error) {
	                if (this._ws.readyState !== WS_OPEN) {
	                    // Websocket has been closed
	                    this._handleConnectionError();
	                }
	                else {
	                    // Some other error occured
	                    throw error;
	                }
	            }
	        }
	        else {
	            throw newError("Don't know how to send buffer: " + buffer);
	        }
	    }
	    /**
	     * Close the connection
	     * @returns {Promise} A promise that will be resolved after channel is closed
	     */
	    close() {
	        if (this._closingPromise === null) {
	            this._closingPromise = new Promise((resolve, reject) => {
	                this._clearConnectionTimeout();
	                if (this._ws && this._ws.readyState !== WS_CLOSED) {
	                    this._open = false;
	                    this.stopReceiveTimeout();
	                    this._ws.onclose = () => {
	                        resolve();
	                    };
	                    this._ws.close();
	                }
	                else {
	                    resolve();
	                }
	            });
	        }
	        return this._closingPromise;
	    }
	    /**
	     * Setup the receive timeout for the channel.
	     *
	     * Not supported for the browser channel.
	     *
	     * @param {number} receiveTimeout The amount of time the channel will keep without receive any data before timeout (ms)
	     * @returns {void}
	     */
	    setupReceiveTimeout(receiveTimeout) {
	        this._receiveTimeout = receiveTimeout;
	    }
	    /**
	     * Stops the receive timeout for the channel.
	     */
	    stopReceiveTimeout() {
	        if (this._receiveTimeout !== null && this._receiveTimeoutStarted) {
	            this._receiveTimeoutStarted = false;
	            if (this._receiveTimeoutId != null) {
	                clearTimeout(this._receiveTimeoutId);
	            }
	            this._receiveTimeoutId = null;
	        }
	    }
	    /**
	     * Start the receive timeout for the channel.
	     */
	    startReceiveTimeout() {
	        if (this._open && this._receiveTimeout !== null && !this._receiveTimeoutStarted) {
	            this._receiveTimeoutStarted = true;
	            this._resetTimeout();
	        }
	    }
	    _resetTimeout() {
	        if (!this._receiveTimeoutStarted) {
	            return;
	        }
	        if (this._receiveTimeoutId !== null) {
	            clearTimeout(this._receiveTimeoutId);
	        }
	        this._receiveTimeoutId = setTimeout(() => {
	            this._receiveTimeoutId = null;
	            this._timedout = true;
	            this.stopReceiveTimeout();
	            this._error = newError(`Connection lost. Server didn't respond in ${this._receiveTimeout}ms`, this._config.connectionErrorCode);
	            this.close();
	            if (this.onerror) {
	                this.onerror(this._error);
	            }
	        }, this._receiveTimeout);
	    }
	    /**
	     * Set connection timeout on the given WebSocket, if configured.
	     * @return {number} the timeout id or null.
	     * @private
	     */
	    _setupConnectionTimeout() {
	        const timeout = this._config.connectionTimeout;
	        if (timeout) {
	            const webSocket = this._ws;
	            return setTimeout(() => {
	                if (webSocket.readyState !== WS_OPEN) {
	                    this._connectionTimeoutFired = true;
	                    webSocket.close();
	                }
	            }, timeout);
	        }
	        return null;
	    }
	    /**
	     * Remove active connection timeout, if any.
	     * @private
	     */
	    _clearConnectionTimeout() {
	        const timeoutId = this._connectionTimeoutId;
	        if (timeoutId || timeoutId === 0) {
	            this._connectionTimeoutFired = false;
	            this._connectionTimeoutId = null;
	            clearTimeout(timeoutId);
	        }
	    }
	}
	function createWebSocket(scheme, address, socketFactory) {
	    const url = scheme + '://' + address.asHostPort();
	    try {
	        return socketFactory(url);
	    }
	    catch (error) {
	        if (isIPv6AddressIssueOnWindows(error, address)) {
	            // WebSocket in IE and Edge browsers on Windows do not support regular IPv6 address syntax because they contain ':'.
	            // It's an invalid character for UNC (https://en.wikipedia.org/wiki/IPv6_address#Literal_IPv6_addresses_in_UNC_path_names)
	            // and Windows requires IPv6 to be changes in the following way:
	            //   1) replace all ':' with '-'
	            //   2) replace '%' with 's' for link-local address
	            //   3) append '.ipv6-literal.net' suffix
	            // only then resulting string can be considered a valid IPv6 address. Yes, this is extremely weird!
	            // For more details see:
	            //   https://social.msdn.microsoft.com/Forums/ie/en-US/06cca73b-63c2-4bf9-899b-b229c50449ff/whether-ie10-websocket-support-ipv6?forum=iewebdevelopment
	            //   https://www.itdojo.com/ipv6-addresses-and-unc-path-names-overcoming-illegal/
	            // Creation of WebSocket with unconverted address results in SyntaxError without message or stacktrace.
	            // That is why here we "catch" SyntaxError and rewrite IPv6 address if needed.
	            const windowsFriendlyUrl = asWindowsFriendlyIPv6Address(scheme, address);
	            return socketFactory(windowsFriendlyUrl);
	        }
	        else {
	            throw error;
	        }
	    }
	}
	function isIPv6AddressIssueOnWindows(error, address) {
	    return error.name === 'SyntaxError' && isIPv6Address(address.asHostPort());
	}
	function isIPv6Address(hostAndPort) {
	    return hostAndPort.charAt(0) === '[' && hostAndPort.indexOf(']') !== -1;
	}
	function asWindowsFriendlyIPv6Address(scheme, address) {
	    // replace all ':' with '-'
	    const hostWithoutColons = address.host().replace(/:/g, '-');
	    // replace '%' with 's' for link-local IPv6 address like 'fe80::1%lo0'
	    const hostWithoutPercent = hostWithoutColons.replace('%', 's');
	    // append magic '.ipv6-literal.net' suffix
	    const ipv6Host = hostWithoutPercent + '.ipv6-literal.net';
	    return `${scheme}://${ipv6Host}:${address.port()}`;
	}
	/**
	 * @param {ChannelConfig} config - configuration for the channel.
	 * @param {function(): string} protocolSupplier - function that detects protocol of the web page.
	 * @return {{scheme: string|null, error: Neo4jError|null}} object containing either scheme or error.
	 */
	function determineWebSocketScheme(config, protocolSupplier) {
	    const encryptionOn = isEncryptionExplicitlyTurnedOn(config);
	    const encryptionOff = isEncryptionExplicitlyTurnedOff(config);
	    const trust = config.trust;
	    const secureProtocol = isProtocolSecure(protocolSupplier);
	    verifyEncryptionSettings(encryptionOn, encryptionOff, secureProtocol);
	    if (encryptionOff) {
	        // encryption explicitly turned off in the config
	        return { scheme: 'ws', error: null };
	    }
	    if (secureProtocol) {
	        // driver is used in a secure https web page, use 'wss'
	        return { scheme: 'wss', error: null };
	    }
	    if (encryptionOn) {
	        // encryption explicitly requested in the config
	        if (!trust || trust === 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES') {
	            // trust strategy not specified or the only supported strategy is specified
	            return { scheme: 'wss', error: null };
	        }
	        else {
	            const error = newError('The browser version of this driver only supports one trust ' +
	                "strategy, 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES'. " +
	                trust +
	                ' is not supported. Please ' +
	                'either use TRUST_SYSTEM_CA_SIGNED_CERTIFICATES or disable encryption by setting ' +
	                '`encrypted:"' +
	                ENCRYPTION_OFF$1 +
	                '"` in the driver configuration.');
	            return { scheme: null, error };
	        }
	    }
	    // default to unencrypted web socket
	    return { scheme: 'ws', error: null };
	}
	/**
	 * @param {ChannelConfig} config - configuration for the channel.
	 * @return {boolean} `true` if encryption enabled in the config, `false` otherwise.
	 */
	function isEncryptionExplicitlyTurnedOn(config) {
	    return config.encrypted === true || config.encrypted === ENCRYPTION_ON$1;
	}
	/**
	 * @param {ChannelConfig} config - configuration for the channel.
	 * @return {boolean} `true` if encryption disabled in the config, `false` otherwise.
	 */
	function isEncryptionExplicitlyTurnedOff(config) {
	    return config.encrypted === false || config.encrypted === ENCRYPTION_OFF$1;
	}
	/**
	 * @param {function(): string} protocolSupplier - function that detects protocol of the web page.
	 * @return {boolean} `true` if protocol returned by the given function is secure, `false` otherwise.
	 */
	function isProtocolSecure(protocolSupplier) {
	    const protocol = typeof protocolSupplier === 'function' ? protocolSupplier() : '';
	    return protocol && protocol.toLowerCase().indexOf('https') >= 0;
	}
	function verifyEncryptionSettings(encryptionOn, encryptionOff, secureProtocol) {
	    if (secureProtocol === null) ;
	    else if (encryptionOn && !secureProtocol) {
	        // encryption explicitly turned on for a driver used on a HTTP web page
	        console.warn('Neo4j driver is configured to use secure WebSocket on a HTTP web page. ' +
	            'WebSockets might not work in a mixed content environment. ' +
	            'Please consider configuring driver to not use encryption.');
	    }
	    else if (encryptionOff && secureProtocol) {
	        // encryption explicitly turned off for a driver used on a HTTPS web page
	        console.warn('Neo4j driver is configured to use insecure WebSocket on a HTTPS web page. ' +
	            'WebSockets might not work in a mixed content environment. ' +
	            'Please consider configuring driver to use encryption.');
	    }
	}
	function detectWebPageProtocol() {
	    return typeof window !== 'undefined' && window.location
	        ? window.location.protocol
	        : null;
	}

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
	const { resolver: { BaseHostNameResolver } } = internal;
	class BrowserHostNameResolver extends BaseHostNameResolver {
	    resolve(address) {
	        return this._resolveToItself(address);
	    }
	}

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
	/*

	This module exports a set of components to be used in browser environment.
	They are not compatible with NodeJS environment.
	All files import/require APIs from `node/index.js` by default.
	Such imports are replaced at build time with `browser/index.js` when building a browser bundle.

	NOTE: exports in this module should have exactly the same names/structure as exports in `node/index.js`.

	 */
	const Channel = WebSocketChannel;
	const HostNameResolver = BrowserHostNameResolver;

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
	 * Buffer that combines multiple buffers, exposing them as one single buffer.
	 */
	class CombinedBuffer extends BaseBuffer {
	    constructor(buffers) {
	        let length = 0;
	        for (let i = 0; i < buffers.length; i++) {
	            length += buffers[i].length;
	        }
	        super(length);
	        this._buffers = buffers;
	    }
	    getUInt8(position) {
	        // Surely there's a faster way to do this.. some sort of lookup table thing?
	        for (let i = 0; i < this._buffers.length; i++) {
	            const buffer = this._buffers[i];
	            // If the position is not in the current buffer, skip the current buffer
	            if (position >= buffer.length) {
	                position -= buffer.length;
	            }
	            else {
	                return buffer.getUInt8(position);
	            }
	        }
	    }
	    getInt8(position) {
	        // Surely there's a faster way to do this.. some sort of lookup table thing?
	        for (let i = 0; i < this._buffers.length; i++) {
	            const buffer = this._buffers[i];
	            // If the position is not in the current buffer, skip the current buffer
	            if (position >= buffer.length) {
	                position -= buffer.length;
	            }
	            else {
	                return buffer.getInt8(position);
	            }
	        }
	    }
	    getFloat64(position) {
	        // At some point, a more efficient impl. For now, we copy the 8 bytes
	        // we want to read and depend on the platform impl of IEEE 754.
	        const b = alloc(8);
	        for (let i = 0; i < 8; i++) {
	            b.putUInt8(i, this.getUInt8(position + i));
	        }
	        return b.getFloat64(0);
	    }
	}

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
	const _CHUNK_HEADER_SIZE = 2;
	const _MESSAGE_BOUNDARY = 0x00;
	const _DEFAULT_BUFFER_SIZE = 1400; // http://stackoverflow.com/questions/2613734/maximum-packet-size-for-a-tcp-connection
	/**
	 * Looks like a writable buffer, chunks output transparently into a channel below.
	 * @access private
	 */
	class Chunker extends BaseBuffer {
	    constructor(channel, bufferSize) {
	        super(0);
	        this._bufferSize = bufferSize || _DEFAULT_BUFFER_SIZE;
	        this._ch = channel;
	        this._buffer = alloc(this._bufferSize);
	        this._currentChunkStart = 0;
	        this._chunkOpen = false;
	    }
	    putUInt8(position, val) {
	        this._ensure(1);
	        this._buffer.writeUInt8(val);
	    }
	    putInt8(position, val) {
	        this._ensure(1);
	        this._buffer.writeInt8(val);
	    }
	    putFloat64(position, val) {
	        this._ensure(8);
	        this._buffer.writeFloat64(val);
	    }
	    putBytes(position, data) {
	        // TODO: If data is larger than our chunk size or so, we're very likely better off just passing this buffer on
	        // rather than doing the copy here TODO: *however* note that we need some way to find out when the data has been
	        // written (and thus the buffer can be re-used) if we take that approach
	        while (data.remaining() > 0) {
	            // Ensure there is an open chunk, and that it has at least one byte of space left
	            this._ensure(1);
	            if (this._buffer.remaining() > data.remaining()) {
	                this._buffer.writeBytes(data);
	            }
	            else {
	                this._buffer.writeBytes(data.readSlice(this._buffer.remaining()));
	            }
	        }
	        return this;
	    }
	    flush() {
	        if (this._buffer.position > 0) {
	            this._closeChunkIfOpen();
	            // Local copy and clear the buffer field. This ensures that the buffer is not re-released if the flush call fails
	            const out = this._buffer;
	            this._buffer = null;
	            this._ch.write(out.getSlice(0, out.position));
	            // Alloc a new output buffer. We assume we're using NodeJS's buffer pooling under the hood here!
	            this._buffer = alloc(this._bufferSize);
	            this._chunkOpen = false;
	        }
	        return this;
	    }
	    /**
	     * Bolt messages are encoded in one or more chunks, and the boundary between two messages
	     * is encoded as a 0-length chunk, `00 00`. This inserts such a message boundary, closing
	     * any currently open chunk as needed
	     */
	    messageBoundary() {
	        this._closeChunkIfOpen();
	        if (this._buffer.remaining() < _CHUNK_HEADER_SIZE) {
	            this.flush();
	        }
	        // Write message boundary
	        this._buffer.writeInt16(_MESSAGE_BOUNDARY);
	    }
	    /** Ensure at least the given size is available for writing */
	    _ensure(size) {
	        const toWriteSize = this._chunkOpen ? size : size + _CHUNK_HEADER_SIZE;
	        if (this._buffer.remaining() < toWriteSize) {
	            this.flush();
	        }
	        if (!this._chunkOpen) {
	            this._currentChunkStart = this._buffer.position;
	            this._buffer.position = this._buffer.position + _CHUNK_HEADER_SIZE;
	            this._chunkOpen = true;
	        }
	    }
	    _closeChunkIfOpen() {
	        if (this._chunkOpen) {
	            const chunkSize = this._buffer.position - (this._currentChunkStart + _CHUNK_HEADER_SIZE);
	            this._buffer.putUInt16(this._currentChunkStart, chunkSize);
	            this._chunkOpen = false;
	        }
	    }
	}
	/**
	 * Combines chunks until a complete message is gathered up, and then forwards that
	 * message to an 'onmessage' listener.
	 * @access private
	 */
	class Dechunker {
	    constructor() {
	        this._currentMessage = [];
	        this._partialChunkHeader = 0;
	        this._state = this.AWAITING_CHUNK;
	    }
	    AWAITING_CHUNK(buf) {
	        if (buf.remaining() >= 2) {
	            // Whole header available, read that
	            return this._onHeader(buf.readUInt16());
	        }
	        else {
	            // Only one byte available, read that and wait for the second byte
	            this._partialChunkHeader = buf.readUInt8() << 8;
	            return this.IN_HEADER;
	        }
	    }
	    IN_HEADER(buf) {
	        // First header byte read, now we read the next one
	        return this._onHeader((this._partialChunkHeader | buf.readUInt8()) & 0xffff);
	    }
	    IN_CHUNK(buf) {
	        if (this._chunkSize <= buf.remaining()) {
	            // Current packet is larger than current chunk, or same size:
	            this._currentMessage.push(buf.readSlice(this._chunkSize));
	            return this.AWAITING_CHUNK;
	        }
	        else {
	            // Current packet is smaller than the chunk we're reading, split the current chunk itself up
	            this._chunkSize -= buf.remaining();
	            this._currentMessage.push(buf.readSlice(buf.remaining()));
	            return this.IN_CHUNK;
	        }
	    }
	    CLOSED(buf) {
	        // no-op
	    }
	    /** Called when a complete chunk header has been received */
	    _onHeader(header) {
	        if (header === 0) {
	            // Message boundary
	            let message;
	            switch (this._currentMessage.length) {
	                case 0:
	                    // Keep alive chunk, sent by server to keep network alive.
	                    return this.AWAITING_CHUNK;
	                case 1:
	                    // All data in one chunk, this signals the end of that chunk.
	                    message = this._currentMessage[0];
	                    break;
	                default:
	                    // A large chunk of data received, this signals that the last chunk has been received.
	                    message = new CombinedBuffer(this._currentMessage);
	                    break;
	            }
	            this._currentMessage = [];
	            this.onmessage(message);
	            return this.AWAITING_CHUNK;
	        }
	        else {
	            this._chunkSize = header;
	            return this.IN_CHUNK;
	        }
	    }
	    write(buf) {
	        while (buf.hasRemaining()) {
	            this._state = this._state(buf);
	        }
	    }
	}

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
	const { util: { ENCRYPTION_OFF, ENCRYPTION_ON } } = internal;
	const { SERVICE_UNAVAILABLE: SERVICE_UNAVAILABLE$4 } = error;
	const ALLOWED_VALUES_ENCRYPTED = [
	    null,
	    undefined,
	    true,
	    false,
	    ENCRYPTION_ON,
	    ENCRYPTION_OFF
	];
	const ALLOWED_VALUES_TRUST = [
	    null,
	    undefined,
	    'TRUST_ALL_CERTIFICATES',
	    'TRUST_CUSTOM_CA_SIGNED_CERTIFICATES',
	    'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES'
	];
	class ChannelConfig {
	    /**
	     * @constructor
	     * @param {ServerAddress} address the address for the channel to connect to.
	     * @param {Object} driverConfig the driver config provided by the user when driver is created.
	     * @param {string} connectionErrorCode the default error code to use on connection errors.
	     */
	    constructor(address, driverConfig, connectionErrorCode) {
	        this.address = address;
	        this.encrypted = extractEncrypted(driverConfig);
	        this.trust = extractTrust(driverConfig);
	        this.trustedCertificates = extractTrustedCertificates(driverConfig);
	        this.knownHostsPath = extractKnownHostsPath(driverConfig);
	        this.connectionErrorCode = connectionErrorCode || SERVICE_UNAVAILABLE$4;
	        this.connectionTimeout = driverConfig.connectionTimeout;
	    }
	}
	function extractEncrypted(driverConfig) {
	    const value = driverConfig.encrypted;
	    if (ALLOWED_VALUES_ENCRYPTED.indexOf(value) === -1) {
	        throw newError(`Illegal value of the encrypted setting ${value}. Expected one of ${ALLOWED_VALUES_ENCRYPTED}`);
	    }
	    return value;
	}
	function extractTrust(driverConfig) {
	    const value = driverConfig.trust;
	    if (ALLOWED_VALUES_TRUST.indexOf(value) === -1) {
	        throw newError(`Illegal value of the trust setting ${value}. Expected one of ${ALLOWED_VALUES_TRUST}`);
	    }
	    return value;
	}
	function extractTrustedCertificates(driverConfig) {
	    return driverConfig.trustedCertificates || [];
	}
	function extractKnownHostsPath(driverConfig) {
	    return driverConfig.knownHosts || null;
	}

	var safeBuffer = {exports: {}};

	/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

	(function (module, exports) {
	/* eslint-disable node/no-deprecated-api */
	var buffer$1 = buffer;
	var Buffer = buffer$1.Buffer;

	// alternative to using Object.keys for old browsers
	function copyProps (src, dst) {
	  for (var key in src) {
	    dst[key] = src[key];
	  }
	}
	if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
	  module.exports = buffer$1;
	} else {
	  // Copy properties from require('buffer')
	  copyProps(buffer$1, exports);
	  exports.Buffer = SafeBuffer;
	}

	function SafeBuffer (arg, encodingOrOffset, length) {
	  return Buffer(arg, encodingOrOffset, length)
	}

	SafeBuffer.prototype = Object.create(Buffer.prototype);

	// Copy static methods from Buffer
	copyProps(Buffer, SafeBuffer);

	SafeBuffer.from = function (arg, encodingOrOffset, length) {
	  if (typeof arg === 'number') {
	    throw new TypeError('Argument must not be a number')
	  }
	  return Buffer(arg, encodingOrOffset, length)
	};

	SafeBuffer.alloc = function (size, fill, encoding) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  var buf = Buffer(size);
	  if (fill !== undefined) {
	    if (typeof encoding === 'string') {
	      buf.fill(fill, encoding);
	    } else {
	      buf.fill(fill);
	    }
	  } else {
	    buf.fill(0);
	  }
	  return buf
	};

	SafeBuffer.allocUnsafe = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return Buffer(size)
	};

	SafeBuffer.allocUnsafeSlow = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return buffer$1.SlowBuffer(size)
	};
	}(safeBuffer, safeBuffer.exports));

	/*<replacement>*/

	var Buffer = safeBuffer.exports.Buffer;
	/*</replacement>*/

	var isEncoding = Buffer.isEncoding || function (encoding) {
	  encoding = '' + encoding;
	  switch (encoding && encoding.toLowerCase()) {
	    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
	      return true;
	    default:
	      return false;
	  }
	};

	function _normalizeEncoding(enc) {
	  if (!enc) return 'utf8';
	  var retried;
	  while (true) {
	    switch (enc) {
	      case 'utf8':
	      case 'utf-8':
	        return 'utf8';
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return 'utf16le';
	      case 'latin1':
	      case 'binary':
	        return 'latin1';
	      case 'base64':
	      case 'ascii':
	      case 'hex':
	        return enc;
	      default:
	        if (retried) return; // undefined
	        enc = ('' + enc).toLowerCase();
	        retried = true;
	    }
	  }
	}
	// Do not cache `Buffer.isEncoding` when checking encoding names as some
	// modules monkey-patch it to support additional encodings
	function normalizeEncoding(enc) {
	  var nenc = _normalizeEncoding(enc);
	  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
	  return nenc || enc;
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters.
	var StringDecoder_1 = StringDecoder;
	function StringDecoder(encoding) {
	  this.encoding = normalizeEncoding(encoding);
	  var nb;
	  switch (this.encoding) {
	    case 'utf16le':
	      this.text = utf16Text;
	      this.end = utf16End;
	      nb = 4;
	      break;
	    case 'utf8':
	      this.fillLast = utf8FillLast;
	      nb = 4;
	      break;
	    case 'base64':
	      this.text = base64Text;
	      this.end = base64End;
	      nb = 3;
	      break;
	    default:
	      this.write = simpleWrite;
	      this.end = simpleEnd;
	      return;
	  }
	  this.lastNeed = 0;
	  this.lastTotal = 0;
	  this.lastChar = Buffer.allocUnsafe(nb);
	}

	StringDecoder.prototype.write = function (buf) {
	  if (buf.length === 0) return '';
	  var r;
	  var i;
	  if (this.lastNeed) {
	    r = this.fillLast(buf);
	    if (r === undefined) return '';
	    i = this.lastNeed;
	    this.lastNeed = 0;
	  } else {
	    i = 0;
	  }
	  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
	  return r || '';
	};

	StringDecoder.prototype.end = utf8End;

	// Returns only complete characters in a Buffer
	StringDecoder.prototype.text = utf8Text;

	// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
	StringDecoder.prototype.fillLast = function (buf) {
	  if (this.lastNeed <= buf.length) {
	    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
	    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
	  }
	  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
	  this.lastNeed -= buf.length;
	};

	// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
	// continuation byte. If an invalid byte is detected, -2 is returned.
	function utf8CheckByte(byte) {
	  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
	  return byte >> 6 === 0x02 ? -1 : -2;
	}

	// Checks at most 3 bytes at the end of a Buffer in order to detect an
	// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
	// needed to complete the UTF-8 character (if applicable) are returned.
	function utf8CheckIncomplete(self, buf, i) {
	  var j = buf.length - 1;
	  if (j < i) return 0;
	  var nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) self.lastNeed = nb - 1;
	    return nb;
	  }
	  if (--j < i || nb === -2) return 0;
	  nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) self.lastNeed = nb - 2;
	    return nb;
	  }
	  if (--j < i || nb === -2) return 0;
	  nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) {
	      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
	    }
	    return nb;
	  }
	  return 0;
	}

	// Validates as many continuation bytes for a multi-byte UTF-8 character as
	// needed or are available. If we see a non-continuation byte where we expect
	// one, we "replace" the validated continuation bytes we've seen so far with
	// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
	// behavior. The continuation byte check is included three times in the case
	// where all of the continuation bytes for a character exist in the same buffer.
	// It is also done this way as a slight performance increase instead of using a
	// loop.
	function utf8CheckExtraBytes(self, buf, p) {
	  if ((buf[0] & 0xC0) !== 0x80) {
	    self.lastNeed = 0;
	    return '\ufffd';
	  }
	  if (self.lastNeed > 1 && buf.length > 1) {
	    if ((buf[1] & 0xC0) !== 0x80) {
	      self.lastNeed = 1;
	      return '\ufffd';
	    }
	    if (self.lastNeed > 2 && buf.length > 2) {
	      if ((buf[2] & 0xC0) !== 0x80) {
	        self.lastNeed = 2;
	        return '\ufffd';
	      }
	    }
	  }
	}

	// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
	function utf8FillLast(buf) {
	  var p = this.lastTotal - this.lastNeed;
	  var r = utf8CheckExtraBytes(this, buf);
	  if (r !== undefined) return r;
	  if (this.lastNeed <= buf.length) {
	    buf.copy(this.lastChar, p, 0, this.lastNeed);
	    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
	  }
	  buf.copy(this.lastChar, p, 0, buf.length);
	  this.lastNeed -= buf.length;
	}

	// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
	// partial character, the character's bytes are buffered until the required
	// number of bytes are available.
	function utf8Text(buf, i) {
	  var total = utf8CheckIncomplete(this, buf, i);
	  if (!this.lastNeed) return buf.toString('utf8', i);
	  this.lastTotal = total;
	  var end = buf.length - (total - this.lastNeed);
	  buf.copy(this.lastChar, 0, end);
	  return buf.toString('utf8', i, end);
	}

	// For UTF-8, a replacement character is added when ending on a partial
	// character.
	function utf8End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) return r + '\ufffd';
	  return r;
	}

	// UTF-16LE typically needs two bytes per character, but even if we have an even
	// number of bytes available, we need to check if we end on a leading/high
	// surrogate. In that case, we need to wait for the next two bytes in order to
	// decode the last character properly.
	function utf16Text(buf, i) {
	  if ((buf.length - i) % 2 === 0) {
	    var r = buf.toString('utf16le', i);
	    if (r) {
	      var c = r.charCodeAt(r.length - 1);
	      if (c >= 0xD800 && c <= 0xDBFF) {
	        this.lastNeed = 2;
	        this.lastTotal = 4;
	        this.lastChar[0] = buf[buf.length - 2];
	        this.lastChar[1] = buf[buf.length - 1];
	        return r.slice(0, -1);
	      }
	    }
	    return r;
	  }
	  this.lastNeed = 1;
	  this.lastTotal = 2;
	  this.lastChar[0] = buf[buf.length - 1];
	  return buf.toString('utf16le', i, buf.length - 1);
	}

	// For UTF-16LE we do not explicitly append special replacement characters if we
	// end on a partial character, we simply let v8 handle that.
	function utf16End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) {
	    var end = this.lastTotal - this.lastNeed;
	    return r + this.lastChar.toString('utf16le', 0, end);
	  }
	  return r;
	}

	function base64Text(buf, i) {
	  var n = (buf.length - i) % 3;
	  if (n === 0) return buf.toString('base64', i);
	  this.lastNeed = 3 - n;
	  this.lastTotal = 3;
	  if (n === 1) {
	    this.lastChar[0] = buf[buf.length - 1];
	  } else {
	    this.lastChar[0] = buf[buf.length - 2];
	    this.lastChar[1] = buf[buf.length - 1];
	  }
	  return buf.toString('base64', i, buf.length - n);
	}

	function base64End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
	  return r;
	}

	// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
	function simpleWrite(buf) {
	  return buf.toString(this.encoding);
	}

	function simpleEnd(buf) {
	  return buf && buf.length ? this.write(buf) : '';
	}

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
	const decoder = new StringDecoder_1('utf8');
	function encode(str) {
	    return new ChannelBuffer(newBuffer(str));
	}
	function decode(buffer, length) {
	    if (Object.prototype.hasOwnProperty.call(buffer, '_buffer')) {
	        return decodeChannelBuffer(buffer, length);
	    }
	    else if (Object.prototype.hasOwnProperty.call(buffer, '_buffers')) {
	        return decodeCombinedBuffer(buffer, length);
	    }
	    else {
	        throw newError(`Don't know how to decode strings from '${buffer}'`);
	    }
	}
	function decodeChannelBuffer(buffer, length) {
	    const start = buffer.position;
	    const end = start + length;
	    buffer.position = Math.min(end, buffer.length);
	    return buffer._buffer.toString('utf8', start, end);
	}
	function decodeCombinedBuffer(buffer, length) {
	    return streamDecodeCombinedBuffer(buffer, length, partBuffer => decoder.write(partBuffer._buffer), () => decoder.end());
	}
	function streamDecodeCombinedBuffer(combinedBuffers, length, decodeFn, endFn) {
	    let remainingBytesToRead = length;
	    let position = combinedBuffers.position;
	    combinedBuffers._updatePos(Math.min(length, combinedBuffers.length - position));
	    // Reduce CombinedBuffers to a decoded string
	    const out = combinedBuffers._buffers.reduce(function (last, partBuffer) {
	        if (remainingBytesToRead <= 0) {
	            return last;
	        }
	        else if (position >= partBuffer.length) {
	            position -= partBuffer.length;
	            return '';
	        }
	        else {
	            partBuffer._updatePos(position - partBuffer.position);
	            const bytesToRead = Math.min(partBuffer.length - position, remainingBytesToRead);
	            const lastSlice = partBuffer.readSlice(bytesToRead);
	            partBuffer._updatePos(bytesToRead);
	            remainingBytesToRead = Math.max(remainingBytesToRead - lastSlice.length, 0);
	            position = 0;
	            return last + decodeFn(lastSlice);
	        }
	    }, '');
	    return out + endFn();
	}
	function newBuffer(str) {
	    // use static factory function present in newer NodeJS versions to create a buffer containing the given string
	    // or fallback to the old, potentially deprecated constructor
	    if (typeof buffer.Buffer.from === 'function') {
	        return buffer.Buffer.from(str, 'utf8');
	    }
	    else {
	        // eslint-disable-next-line n/no-deprecated-api
	        return new buffer.Buffer(str, 'utf8');
	    }
	}
	var utf8 = {
	    encode,
	    decode
	};

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

	var index$4 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		ChannelConfig: ChannelConfig,
		alloc: alloc,
		utf8: utf8,
		Channel: Channel,
		HostNameResolver: HostNameResolver,
		Chunker: Chunker,
		Dechunker: Dechunker
	});

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
	const BOLT_MAGIC_PREAMBLE = 0x6060b017;
	function version(major, minor) {
	    return {
	        major,
	        minor
	    };
	}
	function createHandshakeMessage(versions) {
	    if (versions.length > 4) {
	        throw newError('It should not have more than 4 versions of the protocol');
	    }
	    const handshakeBuffer = alloc(5 * 4);
	    handshakeBuffer.writeInt32(BOLT_MAGIC_PREAMBLE);
	    versions.forEach(version => {
	        if (version instanceof Array) {
	            const { major, minor } = version[0];
	            const { minor: minMinor } = version[1];
	            const range = minor - minMinor;
	            handshakeBuffer.writeInt32((range << 16) | (minor << 8) | major);
	        }
	        else {
	            const { major, minor } = version;
	            handshakeBuffer.writeInt32((minor << 8) | major);
	        }
	    });
	    handshakeBuffer.reset();
	    return handshakeBuffer;
	}
	function parseNegotiatedResponse(buffer, log) {
	    const h = [
	        buffer.readUInt8(),
	        buffer.readUInt8(),
	        buffer.readUInt8(),
	        buffer.readUInt8()
	    ];
	    if (h[0] === 0x48 && h[1] === 0x54 && h[2] === 0x54 && h[3] === 0x50) {
	        log.error('Handshake failed since server responded with HTTP.');
	        throw newError('Server responded HTTP. Make sure you are not trying to connect to the http endpoint ' +
	            '(HTTP defaults to port 7474 whereas BOLT defaults to port 7687)');
	    }
	    return Number(h[3] + '.' + h[2]);
	}
	/**
	 * @return {BaseBuffer}
	 * @private
	 */
	function newHandshakeBuffer() {
	    return createHandshakeMessage([
	        [version(5, 4), version(5, 0)],
	        [version(4, 4), version(4, 2)],
	        version(4, 1),
	        version(3, 0)
	    ]);
	}
	/**
	 * This callback is displayed as a global member.
	 * @callback BufferConsumerCallback
	 * @param {buffer} buffer the remaining buffer
	 */
	/**
	 * @typedef HandshakeResult
	 * @property {number} protocolVersion The protocol version negotiated in the handshake
	 * @property {function(BufferConsumerCallback)} consumeRemainingBuffer A function to consume the remaining buffer if it exists
	 */
	/**
	 * Shake hands using the channel and return the protocol version
	 *
	 * @param {Channel} channel the channel use to shake hands
	 * @param {Logger} log the log object
	 * @returns {Promise<HandshakeResult>} Promise of protocol version and consumeRemainingBuffer
	 */
	function handshake(channel, log) {
	    return new Promise((resolve, reject) => {
	        const handshakeErrorHandler = error => {
	            reject(error);
	        };
	        channel.onerror = handshakeErrorHandler.bind(this);
	        if (channel._error) {
	            handshakeErrorHandler(channel._error);
	        }
	        channel.onmessage = buffer => {
	            try {
	                // read the response buffer and initialize the protocol
	                const protocolVersion = parseNegotiatedResponse(buffer, log);
	                resolve({
	                    protocolVersion,
	                    consumeRemainingBuffer: consumer => {
	                        if (buffer.hasRemaining()) {
	                            consumer(buffer.readSlice(buffer.remaining()));
	                        }
	                    }
	                });
	            }
	            catch (e) {
	                reject(e);
	            }
	        };
	        channel.write(newHandshakeBuffer());
	    });
	}

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
	 * Represente the raw version of the routing table
	 */
	class RawRoutingTable$1 {
	    /**
	     * Constructs the raw routing table for Record based result
	     * @param {Record} record The record which will be used get the raw routing table
	     * @returns {RawRoutingTable} The raw routing table
	     */
	    static ofRecord(record) {
	        if (record === null) {
	            return RawRoutingTable$1.ofNull();
	        }
	        return new RecordRawRoutingTable(record);
	    }
	    /**
	     * Constructs the raw routing table for Success result for a Routing Message
	     * @param {object} response The result
	     * @returns {RawRoutingTable} The raw routing table
	     */
	    static ofMessageResponse(response) {
	        if (response === null) {
	            return RawRoutingTable$1.ofNull();
	        }
	        return new ResponseRawRoutingTable(response);
	    }
	    /**
	     * Construct the raw routing table of a null response
	     *
	     * @returns {RawRoutingTable} the raw routing table
	     */
	    static ofNull() {
	        return new NullRawRoutingTable();
	    }
	    /**
	     * Get raw ttl
	     *
	     * @returns {number|string} ttl Time to live
	     */
	    get ttl() {
	        throw new Error('Not implemented');
	    }
	    /**
	     * Get raw db
	     *
	     * @returns {string?} The database name
	     */
	    get db() {
	        throw new Error('Not implemented');
	    }
	    /**
	     *
	     * @typedef {Object} ServerRole
	     * @property {string} role the role of the address on the cluster
	     * @property {string[]} addresses the address within the role
	     *
	     * @return {ServerRole[]} list of servers addresses
	     */
	    get servers() {
	        throw new Error('Not implemented');
	    }
	    /**
	     * Indicates the result is null
	     *
	     * @returns {boolean} Is null
	     */
	    get isNull() {
	        throw new Error('Not implemented');
	    }
	}
	/**
	 * Get the raw routing table information from route message response
	 */
	class ResponseRawRoutingTable extends RawRoutingTable$1 {
	    constructor(response) {
	        super();
	        this._response = response;
	    }
	    get ttl() {
	        return this._response.rt.ttl;
	    }
	    get servers() {
	        return this._response.rt.servers;
	    }
	    get db() {
	        return this._response.rt.db;
	    }
	    get isNull() {
	        return this._response === null;
	    }
	}
	/**
	 * Null routing table
	 */
	class NullRawRoutingTable extends RawRoutingTable$1 {
	    get isNull() {
	        return true;
	    }
	}
	/**
	 * Get the raw routing table information from the record
	 */
	class RecordRawRoutingTable extends RawRoutingTable$1 {
	    constructor(record) {
	        super();
	        this._record = record;
	    }
	    get ttl() {
	        return this._record.get('ttl');
	    }
	    get servers() {
	        return this._record.get('servers');
	    }
	    get db() {
	        return this._record.has('db') ? this._record.get('db') : null;
	    }
	    get isNull() {
	        return this._record === null;
	    }
	}

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
	const { constants: { FETCH_ALL: FETCH_ALL$4 } } = internal;
	const { PROTOCOL_ERROR: PROTOCOL_ERROR$5 } = error;
	class StreamObserver {
	    onNext(rawRecord) { }
	    onError(_error) { }
	    onCompleted(meta) { }
	}
	/**
	 * Handles a RUN/PULL_ALL, or RUN/DISCARD_ALL requests, maps the responses
	 * in a way that a user-provided observer can see these as a clean Stream
	 * of records.
	 * This class will queue up incoming messages until a user-provided observer
	 * for the incoming stream is registered. Thus, we keep fields around
	 * for tracking head/records/tail. These are only used if there is no
	 * observer registered.
	 * @access private
	 */
	class ResultStreamObserver extends StreamObserver {
	    /**
	     *
	     * @param {Object} param
	     * @param {Object} param.server
	     * @param {boolean} param.reactive
	     * @param {function(stmtId: number|Integer, n: number|Integer, observer: StreamObserver)} param.moreFunction -
	     * @param {function(stmtId: number|Integer, observer: StreamObserver)} param.discardFunction -
	     * @param {number|Integer} param.fetchSize -
	     * @param {function(err: Error): Promise|void} param.beforeError -
	     * @param {function(err: Error): Promise|void} param.afterError -
	     * @param {function(keys: string[]): Promise|void} param.beforeKeys -
	     * @param {function(keys: string[]): Promise|void} param.afterKeys -
	     * @param {function(metadata: Object): Promise|void} param.beforeComplete -
	     * @param {function(metadata: Object): Promise|void} param.afterComplete -
	     */
	    constructor({ reactive = false, moreFunction, discardFunction, fetchSize = FETCH_ALL$4, beforeError, afterError, beforeKeys, afterKeys, beforeComplete, afterComplete, server, highRecordWatermark = Number.MAX_VALUE, lowRecordWatermark = Number.MAX_VALUE } = {}) {
	        super();
	        this._fieldKeys = null;
	        this._fieldLookup = null;
	        this._head = null;
	        this._queuedRecords = [];
	        this._tail = null;
	        this._error = null;
	        this._observers = [];
	        this._meta = {};
	        this._server = server;
	        this._beforeError = beforeError;
	        this._afterError = afterError;
	        this._beforeKeys = beforeKeys;
	        this._afterKeys = afterKeys;
	        this._beforeComplete = beforeComplete;
	        this._afterComplete = afterComplete;
	        this._queryId = null;
	        this._moreFunction = moreFunction;
	        this._discardFunction = discardFunction;
	        this._discard = false;
	        this._fetchSize = fetchSize;
	        this._lowRecordWatermark = lowRecordWatermark;
	        this._highRecordWatermark = highRecordWatermark;
	        this._setState(reactive ? _states.READY : _states.READY_STREAMING);
	        this._setupAutoPull();
	        this._paused = false;
	    }
	    /**
	     * Pause the record consuming
	     *
	     * This function will supend the record consuming. It will not cancel the stream and the already
	     * requested records will be sent to the subscriber.
	     */
	    pause() {
	        this._paused = true;
	    }
	    /**
	     * Resume the record consuming
	     *
	     * This function will resume the record consuming fetching more records from the server.
	     */
	    resume() {
	        this._paused = false;
	        this._setupAutoPull(true);
	        this._state.pull(this);
	    }
	    /**
	     * Will be called on every record that comes in and transform a raw record
	     * to a Object. If user-provided observer is present, pass transformed record
	     * to it's onNext method, otherwise, push to record que.
	     * @param {Array} rawRecord - An array with the raw record
	     */
	    onNext(rawRecord) {
	        const record = new Record(this._fieldKeys, rawRecord, this._fieldLookup);
	        if (this._observers.some(o => o.onNext)) {
	            this._observers.forEach(o => {
	                if (o.onNext) {
	                    o.onNext(record);
	                }
	            });
	        }
	        else {
	            this._queuedRecords.push(record);
	            if (this._queuedRecords.length > this._highRecordWatermark) {
	                this._autoPull = false;
	            }
	        }
	    }
	    onCompleted(meta) {
	        this._state.onSuccess(this, meta);
	    }
	    /**
	     * Will be called on errors.
	     * If user-provided observer is present, pass the error
	     * to it's onError method, otherwise set instance variable _error.
	     * @param {Object} error - An error object
	     */
	    onError(error) {
	        this._state.onError(this, error);
	    }
	    /**
	     * Cancel pending record stream
	     */
	    cancel() {
	        this._discard = true;
	    }
	    /**
	     * Stream observer defaults to handling responses for two messages: RUN + PULL_ALL or RUN + DISCARD_ALL.
	     * Response for RUN initializes query keys. Response for PULL_ALL / DISCARD_ALL exposes the result stream.
	     *
	     * However, some operations can be represented as a single message which receives full metadata in a single response.
	     * For example, operations to begin, commit and rollback an explicit transaction use two messages in Bolt V1 but a single message in Bolt V3.
	     * Messages are `RUN "BEGIN" {}` + `PULL_ALL` in Bolt V1 and `BEGIN` in Bolt V3.
	     *
	     * This function prepares the observer to only handle a single response message.
	     */
	    prepareToHandleSingleResponse() {
	        this._head = [];
	        this._fieldKeys = [];
	        this._setState(_states.STREAMING);
	    }
	    /**
	     * Mark this observer as if it has completed with no metadata.
	     */
	    markCompleted() {
	        this._head = [];
	        this._fieldKeys = [];
	        this._tail = {};
	        this._setState(_states.SUCCEEDED);
	    }
	    /**
	     * Subscribe to events with provided observer.
	     * @param {Object} observer - Observer object
	     * @param {function(keys: String[])} observer.onKeys - Handle stream header, field keys.
	     * @param {function(record: Object)} observer.onNext - Handle records, one by one.
	     * @param {function(metadata: Object)} observer.onCompleted - Handle stream tail, the metadata.
	     * @param {function(error: Object)} observer.onError - Handle errors, should always be provided.
	     */
	    subscribe(observer) {
	        if (this._head && observer.onKeys) {
	            observer.onKeys(this._head);
	        }
	        if (this._queuedRecords.length > 0 && observer.onNext) {
	            for (let i = 0; i < this._queuedRecords.length; i++) {
	                observer.onNext(this._queuedRecords[i]);
	                if (this._queuedRecords.length - i - 1 <= this._lowRecordWatermark) {
	                    this._autoPull = true;
	                    if (this._state === _states.READY) {
	                        this._handleStreaming();
	                    }
	                }
	            }
	        }
	        if (this._tail && observer.onCompleted) {
	            observer.onCompleted(this._tail);
	        }
	        if (this._error) {
	            observer.onError(this._error);
	        }
	        this._observers.push(observer);
	        if (this._state === _states.READY) {
	            this._handleStreaming();
	        }
	    }
	    _handleHasMore(meta) {
	        // We've consumed current batch and server notified us that there're more
	        // records to stream. Let's invoke more or discard function based on whether
	        // the user wants to discard streaming or not
	        this._setState(_states.READY); // we've done streaming
	        this._handleStreaming();
	        delete meta.has_more;
	    }
	    _handlePullSuccess(meta) {
	        const completionMetadata = Object.assign(this._server ? { server: this._server } : {}, this._meta, meta);
	        if (![undefined, null, 'r', 'w', 'rw', 's'].includes(completionMetadata.type)) {
	            this.onError(newError(`Server returned invalid query type. Expected one of [undefined, null, "r", "w", "rw", "s"] but got '${completionMetadata.type}'`, PROTOCOL_ERROR$5));
	            return;
	        }
	        this._setState(_states.SUCCEEDED);
	        let beforeHandlerResult = null;
	        if (this._beforeComplete) {
	            beforeHandlerResult = this._beforeComplete(completionMetadata);
	        }
	        const continuation = () => {
	            // End of stream
	            this._tail = completionMetadata;
	            if (this._observers.some(o => o.onCompleted)) {
	                this._observers.forEach(o => {
	                    if (o.onCompleted) {
	                        o.onCompleted(completionMetadata);
	                    }
	                });
	            }
	            if (this._afterComplete) {
	                this._afterComplete(completionMetadata);
	            }
	        };
	        if (beforeHandlerResult) {
	            Promise.resolve(beforeHandlerResult).then(() => continuation());
	        }
	        else {
	            continuation();
	        }
	    }
	    _handleRunSuccess(meta, afterSuccess) {
	        if (this._fieldKeys === null) {
	            // Stream header, build a name->index field lookup table
	            // to be used by records. This is an optimization to make it
	            // faster to look up fields in a record by name, rather than by index.
	            // Since the records we get back via Bolt are just arrays of values.
	            this._fieldKeys = [];
	            this._fieldLookup = {};
	            if (meta.fields && meta.fields.length > 0) {
	                this._fieldKeys = meta.fields;
	                for (let i = 0; i < meta.fields.length; i++) {
	                    this._fieldLookup[meta.fields[i]] = i;
	                }
	                // remove fields key from metadata object
	                delete meta.fields;
	            }
	            // Extract server generated query id for use in requestMore and discard
	            // functions
	            if (meta.qid !== null && meta.qid !== undefined) {
	                this._queryId = meta.qid;
	                // remove qid from metadata object
	                delete meta.qid;
	            }
	            this._storeMetadataForCompletion(meta);
	            let beforeHandlerResult = null;
	            if (this._beforeKeys) {
	                beforeHandlerResult = this._beforeKeys(this._fieldKeys);
	            }
	            const continuation = () => {
	                this._head = this._fieldKeys;
	                if (this._observers.some(o => o.onKeys)) {
	                    this._observers.forEach(o => {
	                        if (o.onKeys) {
	                            o.onKeys(this._fieldKeys);
	                        }
	                    });
	                }
	                if (this._afterKeys) {
	                    this._afterKeys(this._fieldKeys);
	                }
	                afterSuccess();
	            };
	            if (beforeHandlerResult) {
	                Promise.resolve(beforeHandlerResult).then(() => continuation());
	            }
	            else {
	                continuation();
	            }
	        }
	    }
	    _handleError(error) {
	        this._setState(_states.FAILED);
	        this._error = error;
	        let beforeHandlerResult = null;
	        if (this._beforeError) {
	            beforeHandlerResult = this._beforeError(error);
	        }
	        const continuation = () => {
	            if (this._observers.some(o => o.onError)) {
	                this._observers.forEach(o => {
	                    if (o.onError) {
	                        o.onError(error);
	                    }
	                });
	            }
	            if (this._afterError) {
	                this._afterError(error);
	            }
	        };
	        if (beforeHandlerResult) {
	            Promise.resolve(beforeHandlerResult).then(() => continuation());
	        }
	        else {
	            continuation();
	        }
	    }
	    _handleStreaming() {
	        if (this._head && this._observers.some(o => o.onNext || o.onCompleted)) {
	            if (!this._paused && (this._discard || this._autoPull)) {
	                this._more();
	            }
	        }
	    }
	    _more() {
	        if (this._discard) {
	            this._discardFunction(this._queryId, this);
	        }
	        else {
	            this._moreFunction(this._queryId, this._fetchSize, this);
	        }
	        this._setState(_states.STREAMING);
	    }
	    _storeMetadataForCompletion(meta) {
	        const keys = Object.keys(meta);
	        let index = keys.length;
	        let key = '';
	        while (index--) {
	            key = keys[index];
	            this._meta[key] = meta[key];
	        }
	    }
	    _setState(state) {
	        this._state = state;
	    }
	    _setupAutoPull() {
	        this._autoPull = true;
	    }
	}
	class LoginObserver extends StreamObserver {
	    /**
	     *
	     * @param {Object} param -
	     * @param {function(err: Error)} param.onError
	     * @param {function(metadata)} param.onCompleted
	     */
	    constructor({ onError, onCompleted } = {}) {
	        super();
	        this._onError = onError;
	        this._onCompleted = onCompleted;
	    }
	    onNext(record) {
	        this.onError(newError('Received RECORD when initializing ' + stringify(record)));
	    }
	    onError(error) {
	        if (this._onError) {
	            this._onError(error);
	        }
	    }
	    onCompleted(metadata) {
	        if (this._onCompleted) {
	            this._onCompleted(metadata);
	        }
	    }
	}
	class LogoffObserver extends StreamObserver {
	    /**
	     *
	     * @param {Object} param -
	     * @param {function(err: Error)} param.onError
	     * @param {function(metadata)} param.onCompleted
	     */
	    constructor({ onError, onCompleted } = {}) {
	        super();
	        this._onError = onError;
	        this._onCompleted = onCompleted;
	    }
	    onNext(record) {
	        this.onError(newError('Received RECORD when logging off ' + stringify(record)));
	    }
	    onError(error) {
	        if (this._onError) {
	            this._onError(error);
	        }
	    }
	    onCompleted(metadata) {
	        if (this._onCompleted) {
	            this._onCompleted(metadata);
	        }
	    }
	}
	class ResetObserver extends StreamObserver {
	    /**
	     *
	     * @param {Object} param -
	     * @param {function(err: String)} param.onProtocolError
	     * @param {function(err: Error)} param.onError
	     * @param {function(metadata)} param.onComplete
	     */
	    constructor({ onProtocolError, onError, onComplete } = {}) {
	        super();
	        this._onProtocolError = onProtocolError;
	        this._onError = onError;
	        this._onComplete = onComplete;
	    }
	    onNext(record) {
	        this.onError(newError('Received RECORD when resetting: received record is: ' +
	            stringify(record), PROTOCOL_ERROR$5));
	    }
	    onError(error) {
	        if (error.code === PROTOCOL_ERROR$5 && this._onProtocolError) {
	            this._onProtocolError(error.message);
	        }
	        if (this._onError) {
	            this._onError(error);
	        }
	    }
	    onCompleted(metadata) {
	        if (this._onComplete) {
	            this._onComplete(metadata);
	        }
	    }
	}
	class TelemetryObserver extends ResultStreamObserver {
	    /**
	     *
	     * @param {Object} param -
	     * @param {function(err: Error)} param.onError
	     * @param {function(metadata)} param.onCompleted
	     */
	    constructor({ onError, onCompleted } = {}) {
	        super();
	        this._onError = onError;
	        this._onCompleted = onCompleted;
	    }
	    onNext(record) {
	        this.onError(newError('Received RECORD when sending telemetry ' + stringify(record), PROTOCOL_ERROR$5));
	    }
	    onError(error) {
	        if (this._onError) {
	            this._onError(error);
	        }
	    }
	    onCompleted(metadata) {
	        if (this._onCompleted) {
	            this._onCompleted(metadata);
	        }
	    }
	}
	class FailedObserver extends ResultStreamObserver {
	    constructor({ error, onError }) {
	        super({ beforeError: onError });
	        this.onError(error);
	    }
	}
	class CompletedObserver extends ResultStreamObserver {
	    constructor() {
	        super();
	        super.markCompleted();
	    }
	}
	class ProcedureRouteObserver extends StreamObserver {
	    constructor({ resultObserver, onProtocolError, onError, onCompleted }) {
	        super();
	        this._resultObserver = resultObserver;
	        this._onError = onError;
	        this._onCompleted = onCompleted;
	        this._records = [];
	        this._onProtocolError = onProtocolError;
	        resultObserver.subscribe(this);
	    }
	    onNext(record) {
	        this._records.push(record);
	    }
	    onError(error) {
	        if (error.code === PROTOCOL_ERROR$5 && this._onProtocolError) {
	            this._onProtocolError(error.message);
	        }
	        if (this._onError) {
	            this._onError(error);
	        }
	    }
	    onCompleted() {
	        if (this._records !== null && this._records.length !== 1) {
	            this.onError(newError('Illegal response from router. Received ' +
	                this._records.length +
	                ' records but expected only one.\n' +
	                stringify(this._records), PROTOCOL_ERROR$5));
	            return;
	        }
	        if (this._onCompleted) {
	            this._onCompleted(RawRoutingTable$1.ofRecord(this._records[0]));
	        }
	    }
	}
	class RouteObserver extends StreamObserver {
	    /**
	     *
	     * @param {Object} param -
	     * @param {function(err: String)} param.onProtocolError
	     * @param {function(err: Error)} param.onError
	     * @param {function(RawRoutingTable)} param.onCompleted
	     */
	    constructor({ onProtocolError, onError, onCompleted } = {}) {
	        super();
	        this._onProtocolError = onProtocolError;
	        this._onError = onError;
	        this._onCompleted = onCompleted;
	    }
	    onNext(record) {
	        this.onError(newError('Received RECORD when resetting: received record is: ' +
	            stringify(record), PROTOCOL_ERROR$5));
	    }
	    onError(error) {
	        if (error.code === PROTOCOL_ERROR$5 && this._onProtocolError) {
	            this._onProtocolError(error.message);
	        }
	        if (this._onError) {
	            this._onError(error);
	        }
	    }
	    onCompleted(metadata) {
	        if (this._onCompleted) {
	            this._onCompleted(RawRoutingTable$1.ofMessageResponse(metadata));
	        }
	    }
	}
	const _states = {
	    READY_STREAMING: {
	        // async start state
	        onSuccess: (streamObserver, meta) => {
	            streamObserver._handleRunSuccess(meta, () => {
	                streamObserver._setState(_states.STREAMING);
	            } // after run succeeded, async directly move to streaming
	            // state
	            );
	        },
	        onError: (streamObserver, error) => {
	            streamObserver._handleError(error);
	        },
	        name: () => {
	            return 'READY_STREAMING';
	        },
	        pull: () => { }
	    },
	    READY: {
	        // reactive start state
	        onSuccess: (streamObserver, meta) => {
	            streamObserver._handleRunSuccess(meta, () => streamObserver._handleStreaming() // after run succeeded received, reactive shall start pulling
	            );
	        },
	        onError: (streamObserver, error) => {
	            streamObserver._handleError(error);
	        },
	        name: () => {
	            return 'READY';
	        },
	        pull: streamObserver => streamObserver._more()
	    },
	    STREAMING: {
	        onSuccess: (streamObserver, meta) => {
	            if (meta.has_more) {
	                streamObserver._handleHasMore(meta);
	            }
	            else {
	                streamObserver._handlePullSuccess(meta);
	            }
	        },
	        onError: (streamObserver, error) => {
	            streamObserver._handleError(error);
	        },
	        name: () => {
	            return 'STREAMING';
	        },
	        pull: () => { }
	    },
	    FAILED: {
	        onError: _error => {
	            // more errors are ignored
	        },
	        name: () => {
	            return 'FAILED';
	        },
	        pull: () => { }
	    },
	    SUCCEEDED: {
	        name: () => {
	            return 'SUCCEEDED';
	        },
	        pull: () => { }
	    }
	};

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
	 * @param {TxConfig} txConfig the auto-commit transaction configuration.
	 * @param {function(error: string)} onProtocolError called when the txConfig is not empty.
	 * @param {ResultStreamObserver} observer the response observer.
	 */
	function assertTxConfigIsEmpty(txConfig, onProtocolError = () => { }, observer) {
	    if (txConfig && !txConfig.isEmpty()) {
	        const error = newError('Driver is connected to the database that does not support transaction configuration. ' +
	            'Please upgrade to neo4j 3.5.0 or later in order to use this functionality');
	        // unsupported API was used, consider this a fatal error for the current connection
	        onProtocolError(error.message);
	        observer.onError(error);
	        throw error;
	    }
	}
	/**
	 * Asserts that the passed-in database name is empty.
	 * @param {string} database
	 * @param {fuction(err: String)} onProtocolError Called when it doesn't have database set
	 */
	function assertDatabaseIsEmpty(database, onProtocolError = () => { }, observer) {
	    if (database) {
	        const error = newError('Driver is connected to the database that does not support multiple databases. ' +
	            'Please upgrade to neo4j 4.0.0 or later in order to use this functionality');
	        // unsupported API was used, consider this a fatal error for the current connection
	        onProtocolError(error.message);
	        observer.onError(error);
	        throw error;
	    }
	}
	/**
	 * Asserts that the passed-in impersonated user is empty
	 * @param {string} impersonatedUser
	 * @param {function (err:Error)} onProtocolError Called when it does have impersonated user set
	 * @param {any} observer
	 */
	function assertImpersonatedUserIsEmpty(impersonatedUser, onProtocolError = () => { }, observer) {
	    if (impersonatedUser) {
	        const error = newError('Driver is connected to the database that does not support user impersonation. ' +
	            'Please upgrade to neo4j 4.4.0 or later in order to use this functionality. ' +
	            `Trying to impersonate ${impersonatedUser}.`);
	        // unsupported API was used, consider this a fatal error for the current connection
	        onProtocolError(error.message);
	        observer.onError(error);
	        throw error;
	    }
	}
	/**
	 * Asserts that the passed-in notificationFilter is empty
	 * @param {NotificationFilter} notificationFilter
	 * @param {function (err:Error)} onProtocolError Called when it does have notificationFilter user set
	 * @param {any} observer
	 */
	function assertNotificationFilterIsEmpty(notificationFilter, onProtocolError = () => { }, observer) {
	    if (notificationFilter !== undefined) {
	        const error = newError('Driver is connected to a database that does not support user notification filters. ' +
	            'Please upgrade to Neo4j 5.7.0 or later in order to use this functionality. ' +
	            `Trying to set notifications to ${stringify(notificationFilter)}.`);
	        // unsupported API was used, consider this a fatal error for the current connection
	        onProtocolError(error.message);
	        observer.onError(error);
	        throw error;
	    }
	}

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
	 * Identity function.
	 *
	 * Identity functions are function which returns the input as output.
	 *
	 * @param {any} x
	 * @returns {any} the x
	 */
	function identity(x) {
	    return x;
	}
	/**
	 * Makes the function able to share ongoing requests
	 *
	 * @param {function(...args): Promise} func The function to be decorated
	 * @param {any} thisArg The `this` which should be used in the function call
	 * @return {function(...args): Promise} The decorated function
	 */
	function reuseOngoingRequest(func, thisArg = null) {
	    const ongoingRequests = new Map();
	    return function (...args) {
	        const key = stringify(args);
	        if (ongoingRequests.has(key)) {
	            return ongoingRequests.get(key);
	        }
	        const promise = func.apply(thisArg, args);
	        ongoingRequests.set(key, promise);
	        return promise.finally(() => {
	            ongoingRequests.delete(key);
	        });
	    };
	}

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
	function equals(a, b) {
	    if (a === b) {
	        return true;
	    }
	    if (a === null || b === null) {
	        return false;
	    }
	    if (typeof a === 'object' && typeof b === 'object') {
	        const keysA = Object.keys(a);
	        const keysB = Object.keys(b);
	        if (keysA.length !== keysB.length) {
	            return false;
	        }
	        for (const key of keysA) {
	            if (a[key] !== b[key]) {
	                return false;
	            }
	        }
	        return true;
	    }
	    return false;
	}

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
	const { PROTOCOL_ERROR: PROTOCOL_ERROR$4 } = error;
	/**
	 * A Structure have a signature and fields.
	 */
	class Structure {
	    /**
	     * Create new instance
	     */
	    constructor(signature, fields) {
	        this.signature = signature;
	        this.fields = fields;
	    }
	    get size() {
	        return this.fields.length;
	    }
	    toString() {
	        let fieldStr = '';
	        for (let i = 0; i < this.fields.length; i++) {
	            if (i > 0) {
	                fieldStr += ', ';
	            }
	            fieldStr += this.fields[i];
	        }
	        return 'Structure(' + this.signature + ', [' + fieldStr + '])';
	    }
	}
	function verifyStructSize(structName, expectedSize, actualSize) {
	    if (expectedSize !== actualSize) {
	        throw newError(`Wrong struct size for ${structName}, expected ${expectedSize} but was ${actualSize}`, PROTOCOL_ERROR$4);
	    }
	}

	var structure = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Structure: Structure,
		verifyStructSize: verifyStructSize,
		'default': Structure
	});

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
	const { PROTOCOL_ERROR: PROTOCOL_ERROR$3 } = error;
	const TINY_STRING = 0x80;
	const TINY_LIST = 0x90;
	const TINY_MAP = 0xa0;
	const TINY_STRUCT = 0xb0;
	const NULL = 0xc0;
	const FLOAT_64 = 0xc1;
	const FALSE = 0xc2;
	const TRUE = 0xc3;
	const INT_8 = 0xc8;
	const INT_16 = 0xc9;
	const INT_32 = 0xca;
	const INT_64 = 0xcb;
	const STRING_8 = 0xd0;
	const STRING_16 = 0xd1;
	const STRING_32 = 0xd2;
	const LIST_8 = 0xd4;
	const LIST_16 = 0xd5;
	const LIST_32 = 0xd6;
	const BYTES_8 = 0xcc;
	const BYTES_16 = 0xcd;
	const BYTES_32 = 0xce;
	const MAP_8 = 0xd8;
	const MAP_16 = 0xd9;
	const MAP_32 = 0xda;
	const STRUCT_8 = 0xdc;
	const STRUCT_16 = 0xdd;
	/**
	 * Class to pack
	 * @access private
	 */
	class Packer$1 {
	    /**
	     * @constructor
	     * @param {Chunker} channel the chunker backed by a network channel.
	     */
	    constructor(channel) {
	        this._ch = channel;
	        this._byteArraysSupported = true;
	    }
	    /**
	     * Creates a packable function out of the provided value
	     * @param x the value to pack
	     * @returns Function
	     */
	    packable(x, dehydrateStruct = identity) {
	        try {
	            x = dehydrateStruct(x);
	        }
	        catch (ex) {
	            return () => { throw ex; };
	        }
	        if (x === null) {
	            return () => this._ch.writeUInt8(NULL);
	        }
	        else if (x === true) {
	            return () => this._ch.writeUInt8(TRUE);
	        }
	        else if (x === false) {
	            return () => this._ch.writeUInt8(FALSE);
	        }
	        else if (typeof x === 'number') {
	            return () => this.packFloat(x);
	        }
	        else if (typeof x === 'string') {
	            return () => this.packString(x);
	        }
	        else if (typeof x === 'bigint') {
	            return () => this.packInteger(int(x));
	        }
	        else if (isInt(x)) {
	            return () => this.packInteger(x);
	        }
	        else if (x instanceof Int8Array) {
	            return () => this.packBytes(x);
	        }
	        else if (x instanceof Array) {
	            return () => {
	                this.packListHeader(x.length);
	                for (let i = 0; i < x.length; i++) {
	                    this.packable(x[i] === undefined ? null : x[i], dehydrateStruct)();
	                }
	            };
	        }
	        else if (isIterable(x)) {
	            return this.packableIterable(x, dehydrateStruct);
	        }
	        else if (x instanceof Structure) {
	            const packableFields = [];
	            for (let i = 0; i < x.fields.length; i++) {
	                packableFields[i] = this.packable(x.fields[i], dehydrateStruct);
	            }
	            return () => this.packStruct(x.signature, packableFields);
	        }
	        else if (typeof x === 'object') {
	            return () => {
	                const keys = Object.keys(x);
	                let count = 0;
	                for (let i = 0; i < keys.length; i++) {
	                    if (x[keys[i]] !== undefined) {
	                        count++;
	                    }
	                }
	                this.packMapHeader(count);
	                for (let i = 0; i < keys.length; i++) {
	                    const key = keys[i];
	                    if (x[key] !== undefined) {
	                        this.packString(key);
	                        this.packable(x[key], dehydrateStruct)();
	                    }
	                }
	            };
	        }
	        else {
	            return this._nonPackableValue(`Unable to pack the given value: ${x}`);
	        }
	    }
	    packableIterable(iterable, dehydrateStruct) {
	        try {
	            const array = Array.from(iterable);
	            return this.packable(array, dehydrateStruct);
	        }
	        catch (e) {
	            // handle errors from iterable to array conversion
	            throw newError(`Cannot pack given iterable, ${e.message}: ${iterable}`);
	        }
	    }
	    /**
	     * Packs a struct
	     * @param signature the signature of the struct
	     * @param packableFields the fields of the struct, make sure you call `packable on all fields`
	     */
	    packStruct(signature, packableFields) {
	        packableFields = packableFields || [];
	        this.packStructHeader(packableFields.length, signature);
	        for (let i = 0; i < packableFields.length; i++) {
	            packableFields[i]();
	        }
	    }
	    packInteger(x) {
	        const high = x.high;
	        const low = x.low;
	        if (x.greaterThanOrEqual(-0x10) && x.lessThan(0x80)) {
	            this._ch.writeInt8(low);
	        }
	        else if (x.greaterThanOrEqual(-0x80) && x.lessThan(-0x10)) {
	            this._ch.writeUInt8(INT_8);
	            this._ch.writeInt8(low);
	        }
	        else if (x.greaterThanOrEqual(-0x8000) && x.lessThan(0x8000)) {
	            this._ch.writeUInt8(INT_16);
	            this._ch.writeInt16(low);
	        }
	        else if (x.greaterThanOrEqual(-0x80000000) && x.lessThan(0x80000000)) {
	            this._ch.writeUInt8(INT_32);
	            this._ch.writeInt32(low);
	        }
	        else {
	            this._ch.writeUInt8(INT_64);
	            this._ch.writeInt32(high);
	            this._ch.writeInt32(low);
	        }
	    }
	    packFloat(x) {
	        this._ch.writeUInt8(FLOAT_64);
	        this._ch.writeFloat64(x);
	    }
	    packString(x) {
	        const bytes = utf8.encode(x);
	        const size = bytes.length;
	        if (size < 0x10) {
	            this._ch.writeUInt8(TINY_STRING | size);
	            this._ch.writeBytes(bytes);
	        }
	        else if (size < 0x100) {
	            this._ch.writeUInt8(STRING_8);
	            this._ch.writeUInt8(size);
	            this._ch.writeBytes(bytes);
	        }
	        else if (size < 0x10000) {
	            this._ch.writeUInt8(STRING_16);
	            this._ch.writeUInt8((size / 256) >> 0);
	            this._ch.writeUInt8(size % 256);
	            this._ch.writeBytes(bytes);
	        }
	        else if (size < 0x100000000) {
	            this._ch.writeUInt8(STRING_32);
	            this._ch.writeUInt8(((size / 16777216) >> 0) % 256);
	            this._ch.writeUInt8(((size / 65536) >> 0) % 256);
	            this._ch.writeUInt8(((size / 256) >> 0) % 256);
	            this._ch.writeUInt8(size % 256);
	            this._ch.writeBytes(bytes);
	        }
	        else {
	            throw newError('UTF-8 strings of size ' + size + ' are not supported');
	        }
	    }
	    packListHeader(size) {
	        if (size < 0x10) {
	            this._ch.writeUInt8(TINY_LIST | size);
	        }
	        else if (size < 0x100) {
	            this._ch.writeUInt8(LIST_8);
	            this._ch.writeUInt8(size);
	        }
	        else if (size < 0x10000) {
	            this._ch.writeUInt8(LIST_16);
	            this._ch.writeUInt8(((size / 256) >> 0) % 256);
	            this._ch.writeUInt8(size % 256);
	        }
	        else if (size < 0x100000000) {
	            this._ch.writeUInt8(LIST_32);
	            this._ch.writeUInt8(((size / 16777216) >> 0) % 256);
	            this._ch.writeUInt8(((size / 65536) >> 0) % 256);
	            this._ch.writeUInt8(((size / 256) >> 0) % 256);
	            this._ch.writeUInt8(size % 256);
	        }
	        else {
	            throw newError('Lists of size ' + size + ' are not supported');
	        }
	    }
	    packBytes(array) {
	        if (this._byteArraysSupported) {
	            this.packBytesHeader(array.length);
	            for (let i = 0; i < array.length; i++) {
	                this._ch.writeInt8(array[i]);
	            }
	        }
	        else {
	            throw newError('Byte arrays are not supported by the database this driver is connected to');
	        }
	    }
	    packBytesHeader(size) {
	        if (size < 0x100) {
	            this._ch.writeUInt8(BYTES_8);
	            this._ch.writeUInt8(size);
	        }
	        else if (size < 0x10000) {
	            this._ch.writeUInt8(BYTES_16);
	            this._ch.writeUInt8(((size / 256) >> 0) % 256);
	            this._ch.writeUInt8(size % 256);
	        }
	        else if (size < 0x100000000) {
	            this._ch.writeUInt8(BYTES_32);
	            this._ch.writeUInt8(((size / 16777216) >> 0) % 256);
	            this._ch.writeUInt8(((size / 65536) >> 0) % 256);
	            this._ch.writeUInt8(((size / 256) >> 0) % 256);
	            this._ch.writeUInt8(size % 256);
	        }
	        else {
	            throw newError('Byte arrays of size ' + size + ' are not supported');
	        }
	    }
	    packMapHeader(size) {
	        if (size < 0x10) {
	            this._ch.writeUInt8(TINY_MAP | size);
	        }
	        else if (size < 0x100) {
	            this._ch.writeUInt8(MAP_8);
	            this._ch.writeUInt8(size);
	        }
	        else if (size < 0x10000) {
	            this._ch.writeUInt8(MAP_16);
	            this._ch.writeUInt8((size / 256) >> 0);
	            this._ch.writeUInt8(size % 256);
	        }
	        else if (size < 0x100000000) {
	            this._ch.writeUInt8(MAP_32);
	            this._ch.writeUInt8(((size / 16777216) >> 0) % 256);
	            this._ch.writeUInt8(((size / 65536) >> 0) % 256);
	            this._ch.writeUInt8(((size / 256) >> 0) % 256);
	            this._ch.writeUInt8(size % 256);
	        }
	        else {
	            throw newError('Maps of size ' + size + ' are not supported');
	        }
	    }
	    packStructHeader(size, signature) {
	        if (size < 0x10) {
	            this._ch.writeUInt8(TINY_STRUCT | size);
	            this._ch.writeUInt8(signature);
	        }
	        else if (size < 0x100) {
	            this._ch.writeUInt8(STRUCT_8);
	            this._ch.writeUInt8(size);
	            this._ch.writeUInt8(signature);
	        }
	        else if (size < 0x10000) {
	            this._ch.writeUInt8(STRUCT_16);
	            this._ch.writeUInt8((size / 256) >> 0);
	            this._ch.writeUInt8(size % 256);
	        }
	        else {
	            throw newError('Structures of size ' + size + ' are not supported');
	        }
	    }
	    disableByteArrays() {
	        this._byteArraysSupported = false;
	    }
	    _nonPackableValue(message) {
	        return () => {
	            throw newError(message, PROTOCOL_ERROR$3);
	        };
	    }
	}
	/**
	 * Class to unpack
	 * @access private
	 */
	class Unpacker$1 {
	    /**
	     * @constructor
	     * @param {boolean} disableLosslessIntegers if this unpacker should convert all received integers to native JS numbers.
	     * @param {boolean} useBigInt if this unpacker should convert all received integers to Bigint
	     */
	    constructor(disableLosslessIntegers = false, useBigInt = false) {
	        this._disableLosslessIntegers = disableLosslessIntegers;
	        this._useBigInt = useBigInt;
	    }
	    unpack(buffer, hydrateStructure = identity) {
	        const marker = buffer.readUInt8();
	        const markerHigh = marker & 0xf0;
	        const markerLow = marker & 0x0f;
	        if (marker === NULL) {
	            return null;
	        }
	        const boolean = this._unpackBoolean(marker);
	        if (boolean !== null) {
	            return boolean;
	        }
	        const numberOrInteger = this._unpackNumberOrInteger(marker, buffer);
	        if (numberOrInteger !== null) {
	            if (isInt(numberOrInteger)) {
	                if (this._useBigInt) {
	                    return numberOrInteger.toBigInt();
	                }
	                else if (this._disableLosslessIntegers) {
	                    return numberOrInteger.toNumberOrInfinity();
	                }
	            }
	            return numberOrInteger;
	        }
	        const string = this._unpackString(marker, markerHigh, markerLow, buffer);
	        if (string !== null) {
	            return string;
	        }
	        const list = this._unpackList(marker, markerHigh, markerLow, buffer, hydrateStructure);
	        if (list !== null) {
	            return list;
	        }
	        const byteArray = this._unpackByteArray(marker, buffer);
	        if (byteArray !== null) {
	            return byteArray;
	        }
	        const map = this._unpackMap(marker, markerHigh, markerLow, buffer, hydrateStructure);
	        if (map !== null) {
	            return map;
	        }
	        const struct = this._unpackStruct(marker, markerHigh, markerLow, buffer, hydrateStructure);
	        if (struct !== null) {
	            return struct;
	        }
	        throw newError('Unknown packed value with marker ' + marker.toString(16));
	    }
	    unpackInteger(buffer) {
	        const marker = buffer.readUInt8();
	        const result = this._unpackInteger(marker, buffer);
	        if (result == null) {
	            throw newError('Unable to unpack integer value with marker ' + marker.toString(16));
	        }
	        return result;
	    }
	    _unpackBoolean(marker) {
	        if (marker === TRUE) {
	            return true;
	        }
	        else if (marker === FALSE) {
	            return false;
	        }
	        else {
	            return null;
	        }
	    }
	    _unpackNumberOrInteger(marker, buffer) {
	        if (marker === FLOAT_64) {
	            return buffer.readFloat64();
	        }
	        else {
	            return this._unpackInteger(marker, buffer);
	        }
	    }
	    _unpackInteger(marker, buffer) {
	        if (marker >= 0 && marker < 128) {
	            return int(marker);
	        }
	        else if (marker >= 240 && marker < 256) {
	            return int(marker - 256);
	        }
	        else if (marker === INT_8) {
	            return int(buffer.readInt8());
	        }
	        else if (marker === INT_16) {
	            return int(buffer.readInt16());
	        }
	        else if (marker === INT_32) {
	            const b = buffer.readInt32();
	            return int(b);
	        }
	        else if (marker === INT_64) {
	            const high = buffer.readInt32();
	            const low = buffer.readInt32();
	            return new Integer(low, high);
	        }
	        else {
	            return null;
	        }
	    }
	    _unpackString(marker, markerHigh, markerLow, buffer) {
	        if (markerHigh === TINY_STRING) {
	            return utf8.decode(buffer, markerLow);
	        }
	        else if (marker === STRING_8) {
	            return utf8.decode(buffer, buffer.readUInt8());
	        }
	        else if (marker === STRING_16) {
	            return utf8.decode(buffer, buffer.readUInt16());
	        }
	        else if (marker === STRING_32) {
	            return utf8.decode(buffer, buffer.readUInt32());
	        }
	        else {
	            return null;
	        }
	    }
	    _unpackList(marker, markerHigh, markerLow, buffer, hydrateStructure) {
	        if (markerHigh === TINY_LIST) {
	            return this._unpackListWithSize(markerLow, buffer, hydrateStructure);
	        }
	        else if (marker === LIST_8) {
	            return this._unpackListWithSize(buffer.readUInt8(), buffer, hydrateStructure);
	        }
	        else if (marker === LIST_16) {
	            return this._unpackListWithSize(buffer.readUInt16(), buffer, hydrateStructure);
	        }
	        else if (marker === LIST_32) {
	            return this._unpackListWithSize(buffer.readUInt32(), buffer, hydrateStructure);
	        }
	        else {
	            return null;
	        }
	    }
	    _unpackListWithSize(size, buffer, hydrateStructure) {
	        const value = [];
	        for (let i = 0; i < size; i++) {
	            value.push(this.unpack(buffer, hydrateStructure));
	        }
	        return value;
	    }
	    _unpackByteArray(marker, buffer) {
	        if (marker === BYTES_8) {
	            return this._unpackByteArrayWithSize(buffer.readUInt8(), buffer);
	        }
	        else if (marker === BYTES_16) {
	            return this._unpackByteArrayWithSize(buffer.readUInt16(), buffer);
	        }
	        else if (marker === BYTES_32) {
	            return this._unpackByteArrayWithSize(buffer.readUInt32(), buffer);
	        }
	        else {
	            return null;
	        }
	    }
	    _unpackByteArrayWithSize(size, buffer) {
	        const value = new Int8Array(size);
	        for (let i = 0; i < size; i++) {
	            value[i] = buffer.readInt8();
	        }
	        return value;
	    }
	    _unpackMap(marker, markerHigh, markerLow, buffer, hydrateStructure) {
	        if (markerHigh === TINY_MAP) {
	            return this._unpackMapWithSize(markerLow, buffer, hydrateStructure);
	        }
	        else if (marker === MAP_8) {
	            return this._unpackMapWithSize(buffer.readUInt8(), buffer, hydrateStructure);
	        }
	        else if (marker === MAP_16) {
	            return this._unpackMapWithSize(buffer.readUInt16(), buffer, hydrateStructure);
	        }
	        else if (marker === MAP_32) {
	            return this._unpackMapWithSize(buffer.readUInt32(), buffer, hydrateStructure);
	        }
	        else {
	            return null;
	        }
	    }
	    _unpackMapWithSize(size, buffer, hydrateStructure) {
	        const value = {};
	        for (let i = 0; i < size; i++) {
	            const key = this.unpack(buffer, hydrateStructure);
	            value[key] = this.unpack(buffer, hydrateStructure);
	        }
	        return value;
	    }
	    _unpackStruct(marker, markerHigh, markerLow, buffer, hydrateStructure) {
	        if (markerHigh === TINY_STRUCT) {
	            return this._unpackStructWithSize(markerLow, buffer, hydrateStructure);
	        }
	        else if (marker === STRUCT_8) {
	            return this._unpackStructWithSize(buffer.readUInt8(), buffer, hydrateStructure);
	        }
	        else if (marker === STRUCT_16) {
	            return this._unpackStructWithSize(buffer.readUInt16(), buffer, hydrateStructure);
	        }
	        else {
	            return null;
	        }
	    }
	    _unpackStructWithSize(structSize, buffer, hydrateStructure) {
	        const signature = buffer.readUInt8();
	        const structure = new Structure(signature, []);
	        for (let i = 0; i < structSize; i++) {
	            structure.fields.push(this.unpack(buffer, hydrateStructure));
	        }
	        return hydrateStructure(structure);
	    }
	}
	function isIterable(obj) {
	    if (obj == null) {
	        return false;
	    }
	    return typeof obj[Symbol.iterator] === 'function';
	}

	var packstreamV1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Packer: Packer$1,
		Unpacker: Unpacker$1
	});

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
	class Packer extends Packer$1 {
	    disableByteArrays() {
	        throw new Error('Bolt V2 should always support byte arrays');
	    }
	}
	class Unpacker extends Unpacker$1 {
	    /**
	     * @constructor
	     * @param {boolean} disableLosslessIntegers if this unpacker should convert all received integers to native JS numbers.
	     * @param {boolean} useBigInt if this unpacker should convert all received integers to Bigint
	     */
	    constructor(disableLosslessIntegers = false, useBigInt = false) {
	        super(disableLosslessIntegers, useBigInt);
	    }
	}

	var v2$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Packer: Packer,
		Unpacker: Unpacker
	});

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

	var index$3 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		v1: packstreamV1,
		v2: v2$1,
		structure: structure,
		'default': v2$1
	});

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
	const { constants: { ACCESS_MODE_READ, FETCH_ALL: FETCH_ALL$3 }, util: { assertString } } = internal;
	/* eslint-disable no-unused-vars */
	// Signature bytes for each request message type
	const INIT = 0x01; // 0000 0001 // INIT <user_agent> <authentication_token>
	const RESET = 0x0f; // 0000 1111 // RESET
	const RUN = 0x10; // 0001 0000 // RUN <query> <parameters>
	const PULL_ALL = 0x3f; // 0011 1111 // PULL_ALL
	const HELLO = 0x01; // 0000 0001 // HELLO <metadata>
	const GOODBYE = 0x02; // 0000 0010 // GOODBYE
	const BEGIN = 0x11; // 0001 0001 // BEGIN <metadata>
	const COMMIT = 0x12; // 0001 0010 // COMMIT
	const ROLLBACK = 0x13; // 0001 0011 // ROLLBACK
	const TELEMETRY = 0x54; // 0101 0100 // TELEMETRY <api>
	const ROUTE = 0x66; // 0110 0110 // ROUTE
	const LOGON = 0x6A; // LOGON
	const LOGOFF = 0x6B; // LOGOFF
	const DISCARD = 0x2f; // 0010 1111 // DISCARD
	const PULL = 0x3f; // 0011 1111 // PULL
	const READ_MODE = 'r';
	/* eslint-enable no-unused-vars */
	const NO_STATEMENT_ID = -1;
	const SIGNATURES = Object.freeze({
	    INIT,
	    RESET,
	    RUN,
	    PULL_ALL,
	    HELLO,
	    GOODBYE,
	    BEGIN,
	    COMMIT,
	    ROLLBACK,
	    TELEMETRY,
	    ROUTE,
	    LOGON,
	    LOGOFF,
	    DISCARD,
	    PULL
	});
	class RequestMessage {
	    constructor(signature, fields, toString) {
	        this.signature = signature;
	        this.fields = fields;
	        this.toString = toString;
	    }
	    /**
	     * Create a new INIT message.
	     * @param {string} clientName the client name.
	     * @param {Object} authToken the authentication token.
	     * @return {RequestMessage} new INIT message.
	     */
	    static init(clientName, authToken) {
	        return new RequestMessage(INIT, [clientName, authToken], () => `INIT ${clientName} {...}`);
	    }
	    /**
	     * Create a new RUN message.
	     * @param {string} query the cypher query.
	     * @param {Object} parameters the query parameters.
	     * @return {RequestMessage} new RUN message.
	     */
	    static run(query, parameters) {
	        return new RequestMessage(RUN, [query, parameters], () => `RUN ${query} ${stringify(parameters)}`);
	    }
	    /**
	     * Get a PULL_ALL message.
	     * @return {RequestMessage} the PULL_ALL message.
	     */
	    static pullAll() {
	        return PULL_ALL_MESSAGE;
	    }
	    /**
	     * Get a RESET message.
	     * @return {RequestMessage} the RESET message.
	     */
	    static reset() {
	        return RESET_MESSAGE;
	    }
	    /**
	     * Create a new HELLO message.
	     * @param {string} userAgent the user agent.
	     * @param {Object} authToken the authentication token.
	     * @param {Object} optional server side routing, set to routing context to turn on server side routing (> 4.1)
	     * @return {RequestMessage} new HELLO message.
	     */
	    static hello(userAgent, authToken, routing = null, patchs = null) {
	        const metadata = Object.assign({ user_agent: userAgent }, authToken);
	        if (routing) {
	            metadata.routing = routing;
	        }
	        if (patchs) {
	            metadata.patch_bolt = patchs;
	        }
	        return new RequestMessage(HELLO, [metadata], () => `HELLO {user_agent: '${userAgent}', ...}`);
	    }
	    /**
	     * Create a new HELLO message.
	     * @param {string} userAgent the user agent.
	     * @param {Object} optional server side routing, set to routing context to turn on server side routing (> 4.1)
	     * @return {RequestMessage} new HELLO message.
	     */
	    static hello5x1(userAgent, routing = null) {
	        const metadata = { user_agent: userAgent };
	        if (routing) {
	            metadata.routing = routing;
	        }
	        return new RequestMessage(HELLO, [metadata], () => `HELLO {user_agent: '${userAgent}', ...}`);
	    }
	    /**
	     * Create a new HELLO message.
	     * @param {string} userAgent the user agent.
	     * @param {NotificationFilter} notificationFilter the notification filter configured
	     * @param {Object} routing server side routing, set to routing context to turn on server side routing (> 4.1)
	     * @return {RequestMessage} new HELLO message.
	     */
	    static hello5x2(userAgent, notificationFilter = null, routing = null) {
	        const metadata = { user_agent: userAgent };
	        if (notificationFilter) {
	            if (notificationFilter.minimumSeverityLevel) {
	                metadata.notifications_minimum_severity = notificationFilter.minimumSeverityLevel;
	            }
	            if (notificationFilter.disabledCategories) {
	                metadata.notifications_disabled_categories = notificationFilter.disabledCategories;
	            }
	        }
	        if (routing) {
	            metadata.routing = routing;
	        }
	        return new RequestMessage(HELLO, [metadata], () => `HELLO ${stringify(metadata)}`);
	    }
	    /**
	     * Create a new HELLO message.
	     * @param {string} userAgent the user agent.
	     * @param {string} boltAgent the bolt agent.
	     * @param {NotificationFilter} notificationFilter the notification filter configured
	     * @param {Object} routing server side routing, set to routing context to turn on server side routing (> 4.1)
	     * @return {RequestMessage} new HELLO message.
	     */
	    static hello5x3(userAgent, boltAgent, notificationFilter = null, routing = null) {
	        const metadata = {};
	        if (userAgent) {
	            metadata.user_agent = userAgent;
	        }
	        if (boltAgent) {
	            metadata.bolt_agent = {
	                product: boltAgent.product,
	                platform: boltAgent.platform,
	                language: boltAgent.language,
	                language_details: boltAgent.languageDetails
	            };
	        }
	        if (notificationFilter) {
	            if (notificationFilter.minimumSeverityLevel) {
	                metadata.notifications_minimum_severity = notificationFilter.minimumSeverityLevel;
	            }
	            if (notificationFilter.disabledCategories) {
	                metadata.notifications_disabled_categories = notificationFilter.disabledCategories;
	            }
	        }
	        if (routing) {
	            metadata.routing = routing;
	        }
	        return new RequestMessage(HELLO, [metadata], () => `HELLO ${stringify(metadata)}`);
	    }
	    /**
	     * Create a new LOGON message.
	     *
	     * @param {object} authToken The auth token
	     * @returns {RequestMessage} new LOGON message
	     */
	    static logon(authToken) {
	        return new RequestMessage(LOGON, [authToken], () => 'LOGON { ... }');
	    }
	    /**
	     * Create a new LOGOFF message.
	     *
	     * @returns {RequestMessage} new LOGOFF message
	     */
	    static logoff() {
	        return new RequestMessage(LOGOFF, [], () => 'LOGOFF');
	    }
	    /**
	     * Create a new BEGIN message.
	     * @param {Bookmarks} bookmarks the bookmarks.
	     * @param {TxConfig} txConfig the configuration.
	     * @param {string} database the database name.
	     * @param {string} mode the access mode.
	     * @param {string} impersonatedUser the impersonated user.
	     * @param {NotificationFilter} notificationFilter the notification filter
	     * @return {RequestMessage} new BEGIN message.
	     */
	    static begin({ bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter } = {}) {
	        const metadata = buildTxMetadata(bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter);
	        return new RequestMessage(BEGIN, [metadata], () => `BEGIN ${stringify(metadata)}`);
	    }
	    /**
	     * Get a COMMIT message.
	     * @return {RequestMessage} the COMMIT message.
	     */
	    static commit() {
	        return COMMIT_MESSAGE;
	    }
	    /**
	     * Get a ROLLBACK message.
	     * @return {RequestMessage} the ROLLBACK message.
	     */
	    static rollback() {
	        return ROLLBACK_MESSAGE;
	    }
	    /**
	     * Create a new RUN message with additional metadata.
	     * @param {string} query the cypher query.
	     * @param {Object} parameters the query parameters.
	     * @param {Bookmarks} bookmarks the bookmarks.
	     * @param {TxConfig} txConfig the configuration.
	     * @param {string} database the database name.
	     * @param {string} mode the access mode.
	     * @param {string} impersonatedUser the impersonated user.
	     * @return {RequestMessage} new RUN message with additional metadata.
	     */
	    static runWithMetadata(query, parameters, { bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter } = {}) {
	        const metadata = buildTxMetadata(bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter);
	        return new RequestMessage(RUN, [query, parameters, metadata], () => `RUN ${query} ${stringify(parameters)} ${stringify(metadata)}`);
	    }
	    /**
	     * Get a GOODBYE message.
	     * @return {RequestMessage} the GOODBYE message.
	     */
	    static goodbye() {
	        return GOODBYE_MESSAGE;
	    }
	    /**
	     * Generates a new PULL message with additional metadata.
	     * @param {Integer|number} stmtId
	     * @param {Integer|number} n
	     * @return {RequestMessage} the PULL message.
	     */
	    static pull({ stmtId = NO_STATEMENT_ID, n = FETCH_ALL$3 } = {}) {
	        const metadata = buildStreamMetadata(stmtId === null || stmtId === undefined ? NO_STATEMENT_ID : stmtId, n || FETCH_ALL$3);
	        return new RequestMessage(PULL, [metadata], () => `PULL ${stringify(metadata)}`);
	    }
	    /**
	     * Generates a new DISCARD message with additional metadata.
	     * @param {Integer|number} stmtId
	     * @param {Integer|number} n
	     * @return {RequestMessage} the PULL message.
	     */
	    static discard({ stmtId = NO_STATEMENT_ID, n = FETCH_ALL$3 } = {}) {
	        const metadata = buildStreamMetadata(stmtId === null || stmtId === undefined ? NO_STATEMENT_ID : stmtId, n || FETCH_ALL$3);
	        return new RequestMessage(DISCARD, [metadata], () => `DISCARD ${stringify(metadata)}`);
	    }
	    static telemetry({ api }) {
	        const parsedApi = int(api);
	        return new RequestMessage(TELEMETRY, [parsedApi], () => `TELEMETRY ${parsedApi.toString()}`);
	    }
	    /**
	     * Generate the ROUTE message, this message is used to fetch the routing table from the server
	     *
	     * @param {object} routingContext The routing context used to define the routing table. Multi-datacenter deployments is one of its use cases
	     * @param {string[]} bookmarks The list of the bookmarks should be used
	     * @param {string} databaseName The name of the database to get the routing table for.
	     * @return {RequestMessage} the ROUTE message.
	     */
	    static route(routingContext = {}, bookmarks = [], databaseName = null) {
	        return new RequestMessage(ROUTE, [routingContext, bookmarks, databaseName], () => `ROUTE ${stringify(routingContext)} ${stringify(bookmarks)} ${databaseName}`);
	    }
	    /**
	     * Generate the ROUTE message, this message is used to fetch the routing table from the server
	     *
	     * @param {object} routingContext The routing context used to define the routing table. Multi-datacenter deployments is one of its use cases
	     * @param {string[]} bookmarks The list of the bookmarks should be used
	     * @param {object} databaseContext The context inforamtion of the database to get the routing table for.
	     * @param {string} databaseContext.databaseName The name of the database to get the routing table.
	     * @param {string} databaseContext.impersonatedUser The name of the user to impersonation when getting the routing table.
	     * @return {RequestMessage} the ROUTE message.
	     */
	    static routeV4x4(routingContext = {}, bookmarks = [], databaseContext = {}) {
	        const dbContext = {};
	        if (databaseContext.databaseName) {
	            dbContext.db = databaseContext.databaseName;
	        }
	        if (databaseContext.impersonatedUser) {
	            dbContext.imp_user = databaseContext.impersonatedUser;
	        }
	        return new RequestMessage(ROUTE, [routingContext, bookmarks, dbContext], () => `ROUTE ${stringify(routingContext)} ${stringify(bookmarks)} ${stringify(dbContext)}`);
	    }
	}
	/**
	 * Create an object that represent transaction metadata.
	 * @param {Bookmarks} bookmarks the bookmarks.
	 * @param {TxConfig} txConfig the configuration.
	 * @param {string} database the database name.
	 * @param {string} mode the access mode.
	 * @param {string} impersonatedUser the impersonated user mode.
	 * @param {notificationFilter} notificationFilter the notification filter
	 * @return {Object} a metadata object.
	 */
	function buildTxMetadata(bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter) {
	    const metadata = {};
	    if (!bookmarks.isEmpty()) {
	        metadata.bookmarks = bookmarks.values();
	    }
	    if (txConfig.timeout !== null) {
	        metadata.tx_timeout = txConfig.timeout;
	    }
	    if (txConfig.metadata) {
	        metadata.tx_metadata = txConfig.metadata;
	    }
	    if (database) {
	        metadata.db = assertString(database, 'database');
	    }
	    if (impersonatedUser) {
	        metadata.imp_user = assertString(impersonatedUser, 'impersonatedUser');
	    }
	    if (mode === ACCESS_MODE_READ) {
	        metadata.mode = READ_MODE;
	    }
	    if (notificationFilter) {
	        if (notificationFilter.minimumSeverityLevel) {
	            metadata.notifications_minimum_severity = notificationFilter.minimumSeverityLevel;
	        }
	        if (notificationFilter.disabledCategories) {
	            metadata.notifications_disabled_categories = notificationFilter.disabledCategories;
	        }
	    }
	    return metadata;
	}
	/**
	 * Create an object that represents streaming metadata.
	 * @param {Integer|number} stmtId The query id to stream its results.
	 * @param {Integer|number} n The number of records to stream.
	 * @returns {Object} a metadata object.
	 */
	function buildStreamMetadata(stmtId, n) {
	    const metadata = { n: int(n) };
	    if (stmtId !== NO_STATEMENT_ID) {
	        metadata.qid = int(stmtId);
	    }
	    return metadata;
	}
	// constants for messages that never change
	const PULL_ALL_MESSAGE = new RequestMessage(PULL_ALL, [], () => 'PULL_ALL');
	const RESET_MESSAGE = new RequestMessage(RESET, [], () => 'RESET');
	const COMMIT_MESSAGE = new RequestMessage(COMMIT, [], () => 'COMMIT');
	const ROLLBACK_MESSAGE = new RequestMessage(ROLLBACK, [], () => 'ROLLBACK');
	const GOODBYE_MESSAGE = new RequestMessage(GOODBYE, [], () => 'GOODBYE');

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
	const { objectUtil } = internal;
	/**
	 * Class responsible for applying the expected {@link TypeTransformer} to
	 * transform the driver types from and to {@link struct.Structure}
	 */
	class Transformer {
	    /**
	     * Constructor
	     * @param {TypeTransformer[]} transformers The type transformers
	     */
	    constructor(transformers) {
	        this._transformers = transformers;
	        this._transformersPerSignature = new Map(transformers.map(typeTransformer => [typeTransformer.signature, typeTransformer]));
	        this.fromStructure = this.fromStructure.bind(this);
	        this.toStructure = this.toStructure.bind(this);
	        Object.freeze(this);
	    }
	    /**
	     * Transform from structure to specific object
	     *
	     * @param {struct.Structure} struct The structure
	     * @returns {<T>|structure.Structure} The driver object or the structure if the transformer was not found.
	     */
	    fromStructure(struct) {
	        try {
	            if (struct instanceof Structure && this._transformersPerSignature.has(struct.signature)) {
	                const { fromStructure } = this._transformersPerSignature.get(struct.signature);
	                return fromStructure(struct);
	            }
	            return struct;
	        }
	        catch (error) {
	            return objectUtil.createBrokenObject(error);
	        }
	    }
	    /**
	     * Transform from object to structure
	     * @param {<T>} type The object to be transoformed in structure
	     * @returns {<T>|structure.Structure} The structure or the object, if any transformer was found
	     */
	    toStructure(type) {
	        const transformer = this._transformers.find(({ isTypeInstance }) => isTypeInstance(type));
	        if (transformer !== undefined) {
	            return transformer.toStructure(type);
	        }
	        return type;
	    }
	}
	/**
	 * @callback isTypeInstanceFunction
	 * @param {any} object The object
	 * @return {boolean} is instance of
	 */
	/**
	 * @callback toStructureFunction
	 * @param {any} object The object
	 * @return {structure.Structure} The structure
	 */
	/**
	 * @callback fromStructureFunction
	 * @param {structure.Structure} struct The structure
	 * @return {any} The object
	 */
	/**
	 * Class responsible for grouping the properties of a TypeTransformer
	 */
	class TypeTransformer {
	    /**
	     * @param {Object} param
	     * @param {number} param.signature The signature of the structure
	     * @param {isTypeInstanceFunction} param.isTypeInstance The function which checks if object is
	     *                instance of the type described by the TypeTransformer
	     * @param {toStructureFunction} param.toStructure The function which gets the object and converts to structure
	     * @param {fromStructureFunction} param.fromStructure The function which get the structure and covnverts to object
	     */
	    constructor({ signature, fromStructure, toStructure, isTypeInstance }) {
	        this.signature = signature;
	        this.isTypeInstance = isTypeInstance;
	        this.fromStructure = fromStructure;
	        this.toStructure = toStructure;
	        Object.freeze(this);
	    }
	    /**
	     * @param {Object} param
	     * @param {number} [param.signature] The signature of the structure
	     * @param {isTypeInstanceFunction} [param.isTypeInstance] The function which checks if object is
	     *                instance of the type described by the TypeTransformer
	     * @param {toStructureFunction} [param.toStructure] The function which gets the object and converts to structure
	     * @param {fromStructureFunction} pparam.fromStructure] The function which get the structure and covnverts to object
	     * @returns {TypeTransformer} A new type transform extends with new methods
	     */
	    extendsWith({ signature, fromStructure, toStructure, isTypeInstance }) {
	        return new TypeTransformer({
	            signature: signature || this.signature,
	            fromStructure: fromStructure || this.fromStructure,
	            toStructure: toStructure || this.toStructure,
	            isTypeInstance: isTypeInstance || this.isTypeInstance
	        });
	    }
	}

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
	const { PROTOCOL_ERROR: PROTOCOL_ERROR$2 } = error;
	const NODE = 0x4e;
	const NODE_STRUCT_SIZE$1 = 3;
	const RELATIONSHIP = 0x52;
	const RELATIONSHIP_STRUCT_SIZE$1 = 5;
	const UNBOUND_RELATIONSHIP = 0x72;
	const UNBOUND_RELATIONSHIP_STRUCT_SIZE$1 = 3;
	const PATH = 0x50;
	const PATH_STRUCT_SIZE = 3;
	/**
	 * Creates the Node Transformer
	 * @returns {TypeTransformer}
	 */
	function createNodeTransformer$1() {
	    return new TypeTransformer({
	        signature: NODE,
	        isTypeInstance: object => object instanceof Node,
	        toStructure: object => {
	            throw newError(`It is not allowed to pass nodes in query parameters, given: ${object}`, PROTOCOL_ERROR$2);
	        },
	        fromStructure: struct => {
	            verifyStructSize('Node', NODE_STRUCT_SIZE$1, struct.size);
	            const [identity, labels, properties] = struct.fields;
	            return new Node(identity, labels, properties);
	        }
	    });
	}
	/**
	 * Creates the Relationship Transformer
	 * @returns {TypeTransformer}
	 */
	function createRelationshipTransformer$1() {
	    return new TypeTransformer({
	        signature: RELATIONSHIP,
	        isTypeInstance: object => object instanceof Relationship,
	        toStructure: object => {
	            throw newError(`It is not allowed to pass relationships in query parameters, given: ${object}`, PROTOCOL_ERROR$2);
	        },
	        fromStructure: struct => {
	            verifyStructSize('Relationship', RELATIONSHIP_STRUCT_SIZE$1, struct.size);
	            const [identity, startNodeIdentity, endNodeIdentity, type, properties] = struct.fields;
	            return new Relationship(identity, startNodeIdentity, endNodeIdentity, type, properties);
	        }
	    });
	}
	/**
	 * Creates the Unbound Relationship Transformer
	 * @returns {TypeTransformer}
	 */
	function createUnboundRelationshipTransformer$1() {
	    return new TypeTransformer({
	        signature: UNBOUND_RELATIONSHIP,
	        isTypeInstance: object => object instanceof UnboundRelationship,
	        toStructure: object => {
	            throw newError(`It is not allowed to pass unbound relationships in query parameters, given: ${object}`, PROTOCOL_ERROR$2);
	        },
	        fromStructure: struct => {
	            verifyStructSize('UnboundRelationship', UNBOUND_RELATIONSHIP_STRUCT_SIZE$1, struct.size);
	            const [identity, type, properties] = struct.fields;
	            return new UnboundRelationship(identity, type, properties);
	        }
	    });
	}
	/**
	 * Creates the Path Transformer
	 * @returns {TypeTransformer}
	 */
	function createPathTransformer() {
	    return new TypeTransformer({
	        signature: PATH,
	        isTypeInstance: object => object instanceof Path,
	        toStructure: object => {
	            throw newError(`It is not allowed to pass paths in query parameters, given: ${object}`, PROTOCOL_ERROR$2);
	        },
	        fromStructure: struct => {
	            verifyStructSize('Path', PATH_STRUCT_SIZE, struct.size);
	            const [nodes, rels, sequence] = struct.fields;
	            const segments = [];
	            let prevNode = nodes[0];
	            for (let i = 0; i < sequence.length; i += 2) {
	                const nextNode = nodes[sequence[i + 1]];
	                const relIndex = toNumber(sequence[i]);
	                let rel;
	                if (relIndex > 0) {
	                    rel = rels[relIndex - 1];
	                    if (rel instanceof UnboundRelationship) {
	                        // To avoid duplication, relationships in a path do not contain
	                        // information about their start and end nodes, that's instead
	                        // inferred from the path sequence. This is us inferring (and,
	                        // for performance reasons remembering) the start/end of a rel.
	                        rels[relIndex - 1] = rel = rel.bindTo(prevNode, nextNode);
	                    }
	                }
	                else {
	                    rel = rels[-relIndex - 1];
	                    if (rel instanceof UnboundRelationship) {
	                        // See above
	                        rels[-relIndex - 1] = rel = rel.bindTo(nextNode, prevNode);
	                    }
	                }
	                // Done hydrating one path segment.
	                segments.push(new PathSegment(prevNode, rel, nextNode));
	                prevNode = nextNode;
	            }
	            return new Path(nodes[0], nodes[nodes.length - 1], segments);
	        }
	    });
	}
	var v1 = {
	    createNodeTransformer: createNodeTransformer$1,
	    createRelationshipTransformer: createRelationshipTransformer$1,
	    createUnboundRelationshipTransformer: createUnboundRelationshipTransformer$1,
	    createPathTransformer
	};

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
	const { bookmarks: { Bookmarks: Bookmarks$5 }, constants: { ACCESS_MODE_WRITE, BOLT_PROTOCOL_V1 }, 
	// eslint-disable-next-line no-unused-vars
	logger: { Logger: Logger$2 }, txConfig: { TxConfig: TxConfig$2 } } = internal;
	class BoltProtocol$d {
	    /**
	     * @callback CreateResponseHandler Creates the response handler
	     * @param {BoltProtocol} protocol The bolt protocol
	     * @returns {ResponseHandler} The response handler
	     */
	    /**
	     * @callback OnProtocolError Handles protocol error
	     * @param {string} error The description
	     */
	    /**
	     * @constructor
	     * @param {Object} server the server informatio.
	     * @param {Chunker} chunker the chunker.
	     * @param {Object} packstreamConfig Packstream configuration
	     * @param {boolean} packstreamConfig.disableLosslessIntegers if this connection should convert all received integers to native JS numbers.
	     * @param {boolean} packstreamConfig.useBigInt if this connection should convert all received integers to native BigInt numbers.
	     * @param {CreateResponseHandler} createResponseHandler Function which creates the response handler
	     * @param {Logger} log the logger
	     * @param {OnProtocolError} onProtocolError handles protocol errors
	     */
	    constructor(server, chunker, { disableLosslessIntegers, useBigInt } = {}, createResponseHandler = () => null, log, onProtocolError) {
	        this._server = server || {};
	        this._chunker = chunker;
	        this._packer = this._createPacker(chunker);
	        this._unpacker = this._createUnpacker(disableLosslessIntegers, useBigInt);
	        this._responseHandler = createResponseHandler(this);
	        this._log = log;
	        this._onProtocolError = onProtocolError;
	        this._fatalError = null;
	        this._lastMessageSignature = null;
	        this._config = { disableLosslessIntegers, useBigInt };
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(v1).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    /**
	     * Returns the numerical version identifier for this protocol
	     */
	    get version() {
	        return BOLT_PROTOCOL_V1;
	    }
	    /**
	     * @property {boolean} supportsReAuth Either if the protocol version supports re-auth or not.
	     */
	    get supportsReAuth() {
	        return false;
	    }
	    /**
	     * @property {boolean} initialized Either if the protocol was initialized or not
	     */
	    get initialized() {
	        return !!this._initialized;
	    }
	    /**
	     * @property {object} authToken The token used in the last login
	     */
	    get authToken() {
	        return this._authToken;
	    }
	    /**
	     * Get the packer.
	     * @return {Packer} the protocol's packer.
	     */
	    packer() {
	        return this._packer;
	    }
	    /**
	     * Creates a packable function out of the provided value
	     * @param x the value to pack
	     * @returns Function
	     */
	    packable(x) {
	        return this._packer.packable(x, this.transformer.toStructure);
	    }
	    /**
	     * Get the unpacker.
	     * @return {Unpacker} the protocol's unpacker.
	     */
	    unpacker() {
	        return this._unpacker;
	    }
	    /**
	     * Unpack a buffer
	     * @param {Buffer} buf
	     * @returns {any|null} The unpacked value
	     */
	    unpack(buf) {
	        return this._unpacker.unpack(buf, this.transformer.fromStructure);
	    }
	    /**
	     * Transform metadata received in SUCCESS message before it is passed to the handler.
	     * @param {Object} metadata the received metadata.
	     * @return {Object} transformed metadata.
	     */
	    transformMetadata(metadata) {
	        return metadata;
	    }
	    /**
	     * Perform initialization and authentication of the underlying connection.
	     * @param {Object} param
	     * @param {string} param.userAgent the user agent.
	     * @param {Object} param.authToken the authentication token.
	     * @param {NotificationFilter} param.notificationFilter the notification filter.
	     * @param {function(err: Error)} param.onError the callback to invoke on error.
	     * @param {function()} param.onComplete the callback to invoke on completion.
	     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
	     */
	    initialize({ userAgent, boltAgent, authToken, notificationFilter, onError, onComplete } = {}) {
	        const observer = new LoginObserver({
	            onError: error => this._onLoginError(error, onError),
	            onCompleted: metadata => this._onLoginCompleted(metadata, onComplete)
	        });
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        this.write(RequestMessage.init(userAgent, authToken), observer, true);
	        return observer;
	    }
	    /**
	     * Performs logoff of the underlying connection
	     *
	     * @param {Object} param
	     * @param {function(err: Error)} param.onError the callback to invoke on error.
	     * @param {function()} param.onComplete the callback to invoke on completion.
	     * @param {boolean} param.flush whether to flush the buffered messages.
	     *
	     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
	     */
	    logoff({ onComplete, onError, flush } = {}) {
	        const observer = new LogoffObserver({
	            onCompleted: onComplete,
	            onError
	        });
	        // TODO: Verify the Neo4j version in the message
	        const error = newError('Driver is connected to a database that does not support logoff. ' +
	            'Please upgrade to Neo4j 5.5.0 or later in order to use this functionality.');
	        // unsupported API was used, consider this a fatal error for the current connection
	        this._onProtocolError(error.message);
	        observer.onError(error);
	        throw error;
	    }
	    /**
	     * Performs login of the underlying connection
	     *
	     * @param {Object} args
	     * @param {Object} args.authToken the authentication token.
	     * @param {function(err: Error)} args.onError the callback to invoke on error.
	     * @param {function()} args.onComplete the callback to invoke on completion.
	     * @param {boolean} args.flush whether to flush the buffered messages.
	     *
	     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
	     */
	    logon({ authToken, onComplete, onError, flush } = {}) {
	        const observer = new LoginObserver({
	            onCompleted: () => this._onLoginCompleted({}, authToken, onComplete),
	            onError: (error) => this._onLoginError(error, onError)
	        });
	        // TODO: Verify the Neo4j version in the message
	        const error = newError('Driver is connected to a database that does not support logon. ' +
	            'Please upgrade to Neo4j 5.5.0 or later in order to use this functionality.');
	        // unsupported API was used, consider this a fatal error for the current connection
	        this._onProtocolError(error.message);
	        observer.onError(error);
	        throw error;
	    }
	    /**
	     * Perform protocol related operations for closing this connection
	     */
	    prepareToClose() {
	        // no need to notify the database in this protocol version
	    }
	    /**
	     * Begin an explicit transaction.
	     * @param {Object} param
	     * @param {Bookmarks} param.bookmarks the bookmarks.
	     * @param {TxConfig} param.txConfig the configuration.
	     * @param {string} param.database the target database name.
	     * @param {string} param.mode the access mode.
	     * @param {string} param.impersonatedUser the impersonated user
	     * @param {NotificationFilter} param.notificationFilter the notification filter.
	     * @param {function(err: Error)} param.beforeError the callback to invoke before handling the error.
	     * @param {function(err: Error)} param.afterError the callback to invoke after handling the error.
	     * @param {function()} param.beforeComplete the callback to invoke before handling the completion.
	     * @param {function()} param.afterComplete the callback to invoke after handling the completion.
	     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
	     */
	    beginTransaction({ bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter, beforeError, afterError, beforeComplete, afterComplete } = {}) {
	        return this.run('BEGIN', bookmarks ? bookmarks.asBeginTransactionParameters() : {}, {
	            bookmarks,
	            txConfig,
	            database,
	            mode,
	            impersonatedUser,
	            notificationFilter,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete,
	            flush: false
	        });
	    }
	    /**
	     * Commit the explicit transaction.
	     * @param {Object} param
	     * @param {function(err: Error)} param.beforeError the callback to invoke before handling the error.
	     * @param {function(err: Error)} param.afterError the callback to invoke after handling the error.
	     * @param {function()} param.beforeComplete the callback to invoke before handling the completion.
	     * @param {function()} param.afterComplete the callback to invoke after handling the completion.
	     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
	     */
	    commitTransaction({ beforeError, afterError, beforeComplete, afterComplete } = {}) {
	        // WRITE access mode is used as a place holder here, it has
	        // no effect on behaviour for Bolt V1 & V2
	        return this.run('COMMIT', {}, {
	            bookmarks: Bookmarks$5.empty(),
	            txConfig: TxConfig$2.empty(),
	            mode: ACCESS_MODE_WRITE,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete
	        });
	    }
	    /**
	     * Rollback the explicit transaction.
	     * @param {Object} param
	     * @param {function(err: Error)} param.beforeError the callback to invoke before handling the error.
	     * @param {function(err: Error)} param.afterError the callback to invoke after handling the error.
	     * @param {function()} param.beforeComplete the callback to invoke before handling the completion.
	     * @param {function()} param.afterComplete the callback to invoke after handling the completion.
	     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
	     */
	    rollbackTransaction({ beforeError, afterError, beforeComplete, afterComplete } = {}) {
	        // WRITE access mode is used as a place holder here, it has
	        // no effect on behaviour for Bolt V1 & V2
	        return this.run('ROLLBACK', {}, {
	            bookmarks: Bookmarks$5.empty(),
	            txConfig: TxConfig$2.empty(),
	            mode: ACCESS_MODE_WRITE,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete
	        });
	    }
	    /**
	     * Send a Cypher query through the underlying connection.
	     * @param {string} query the cypher query.
	     * @param {Object} parameters the query parameters.
	     * @param {Object} param
	     * @param {Bookmarks} param.bookmarks the bookmarks.
	     * @param {TxConfig} param.txConfig the transaction configuration.
	     * @param {string} param.database the target database name.
	     * @param {string} param.impersonatedUser the impersonated user
	     * @param {NotificationFilter} param.notificationFilter the notification filter.
	     * @param {string} param.mode the access mode.
	     * @param {function(keys: string[])} param.beforeKeys the callback to invoke before handling the keys.
	     * @param {function(keys: string[])} param.afterKeys the callback to invoke after handling the keys.
	     * @param {function(err: Error)} param.beforeError the callback to invoke before handling the error.
	     * @param {function(err: Error)} param.afterError the callback to invoke after handling the error.
	     * @param {function()} param.beforeComplete the callback to invoke before handling the completion.
	     * @param {function()} param.afterComplete the callback to invoke after handling the completion.
	     * @param {boolean} param.flush whether to flush the buffered messages.
	     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
	     */
	    run(query, parameters, { bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter, beforeKeys, afterKeys, beforeError, afterError, beforeComplete, afterComplete, flush = true, highRecordWatermark = Number.MAX_VALUE, lowRecordWatermark = Number.MAX_VALUE } = {}) {
	        const observer = new ResultStreamObserver({
	            server: this._server,
	            beforeKeys,
	            afterKeys,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete,
	            highRecordWatermark,
	            lowRecordWatermark
	        });
	        // bookmarks and mode are ignored in this version of the protocol
	        assertTxConfigIsEmpty(txConfig, this._onProtocolError, observer);
	        // passing in a database name on this protocol version throws an error
	        assertDatabaseIsEmpty(database, this._onProtocolError, observer);
	        // passing impersonated user on this protocol version throws an error
	        assertImpersonatedUserIsEmpty(impersonatedUser, this._onProtocolError, observer);
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        this.write(RequestMessage.run(query, parameters), observer, false);
	        this.write(RequestMessage.pullAll(), observer, flush);
	        return observer;
	    }
	    get currentFailure() {
	        return this._responseHandler.currentFailure;
	    }
	    /**
	     * Send a RESET through the underlying connection.
	     * @param {Object} param
	     * @param {function(err: Error)} param.onError the callback to invoke on error.
	     * @param {function()} param.onComplete the callback to invoke on completion.
	     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
	     */
	    reset({ onError, onComplete } = {}) {
	        const observer = new ResetObserver({
	            onProtocolError: this._onProtocolError,
	            onError,
	            onComplete
	        });
	        this.write(RequestMessage.reset(), observer, true);
	        return observer;
	    }
	    /**
	     * Send a TELEMETRY through the underlying connection.
	     *
	     * @param {object} param0 Message params
	     * @param {number} param0.api The API called
	     * @param {object} param1 Configuration and callbacks
	     * @param {function()} param1.onCompleted Called when completed
	     * @param {function()} param1.onError Called when error
	     * @return {StreamObserver} the stream observer that monitors the corresponding server response.
	     */
	    telemetry({ api }, { onError, onCompleted } = {}) {
	        const observer = new CompletedObserver();
	        if (onCompleted) {
	            onCompleted();
	        }
	        return observer;
	    }
	    _createPacker(chunker) {
	        return new Packer$1(chunker);
	    }
	    _createUnpacker(disableLosslessIntegers, useBigInt) {
	        return new Unpacker$1(disableLosslessIntegers, useBigInt);
	    }
	    /**
	     * Write a message to the network channel.
	     * @param {RequestMessage} message the message to write.
	     * @param {StreamObserver} observer the response observer.
	     * @param {boolean} flush `true` if flush should happen after the message is written to the buffer.
	     */
	    write(message, observer, flush) {
	        const queued = this.queueObserverIfProtocolIsNotBroken(observer);
	        if (queued) {
	            if (this._log.isDebugEnabled()) {
	                this._log.debug(`C: ${message}`);
	            }
	            this._lastMessageSignature = message.signature;
	            const messageStruct = new Structure(message.signature, message.fields);
	            this.packable(messageStruct)();
	            this._chunker.messageBoundary();
	            if (flush) {
	                this._chunker.flush();
	            }
	        }
	    }
	    isLastMessageLogon() {
	        return this._lastMessageSignature === SIGNATURES.HELLO ||
	            this._lastMessageSignature === SIGNATURES.LOGON;
	    }
	    isLastMessageReset() {
	        return this._lastMessageSignature === SIGNATURES.RESET;
	    }
	    /**
	     * Notifies faltal erros to the observers and mark the protocol in the fatal error state.
	     * @param {Error} error The error
	     */
	    notifyFatalError(error) {
	        this._fatalError = error;
	        return this._responseHandler._notifyErrorToObservers(error);
	    }
	    /**
	     * Updates the the current observer with the next one on the queue.
	     */
	    updateCurrentObserver() {
	        return this._responseHandler._updateCurrentObserver();
	    }
	    /**
	     * Checks if exist an ongoing observable requests
	     * @return {boolean}
	     */
	    hasOngoingObservableRequests() {
	        return this._responseHandler.hasOngoingObservableRequests();
	    }
	    /**
	     * Enqueue the observer if the protocol is not broken.
	     * In case it's broken, the observer will be notified about the error.
	     *
	     * @param {StreamObserver} observer The observer
	     * @returns {boolean} if it was queued
	     */
	    queueObserverIfProtocolIsNotBroken(observer) {
	        if (this.isBroken()) {
	            this.notifyFatalErrorToObserver(observer);
	            return false;
	        }
	        return this._responseHandler._queueObserver(observer);
	    }
	    /**
	     * Veritfy the protocol is not broken.
	     * @returns {boolean}
	     */
	    isBroken() {
	        return !!this._fatalError;
	    }
	    /**
	     * Notifies the current fatal error to the observer
	     *
	     * @param {StreamObserver} observer The observer
	     */
	    notifyFatalErrorToObserver(observer) {
	        if (observer && observer.onError) {
	            observer.onError(this._fatalError);
	        }
	    }
	    /**
	     * Reset current failure on the observable response handler to null.
	     */
	    resetFailure() {
	        this._responseHandler._resetFailure();
	    }
	    _onLoginCompleted(metadata, authToken, onCompleted) {
	        this._initialized = true;
	        this._authToken = authToken;
	        if (metadata) {
	            const serverVersion = metadata.server;
	            if (!this._server.version) {
	                this._server.version = serverVersion;
	            }
	        }
	        if (onCompleted) {
	            onCompleted(metadata);
	        }
	    }
	    _onLoginError(error, onError) {
	        this._onProtocolError(error.message);
	        if (onError) {
	            onError(error);
	        }
	    }
	}

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
	const { temporalUtil: { DAYS_0000_TO_1970, DAYS_PER_400_YEAR_CYCLE, NANOS_PER_HOUR, NANOS_PER_MINUTE, NANOS_PER_SECOND, SECONDS_PER_DAY, floorDiv, floorMod } } = internal;
	/**
	 * Converts given epoch day to a local date.
	 * @param {Integer|number|string} epochDay the epoch day to convert.
	 * @return {Date} the date representing the epoch day in years, months and days.
	 */
	function epochDayToDate(epochDay) {
	    epochDay = int(epochDay);
	    let zeroDay = epochDay.add(DAYS_0000_TO_1970).subtract(60);
	    let adjust = int(0);
	    if (zeroDay.lessThan(0)) {
	        const adjustCycles = zeroDay
	            .add(1)
	            .div(DAYS_PER_400_YEAR_CYCLE)
	            .subtract(1);
	        adjust = adjustCycles.multiply(400);
	        zeroDay = zeroDay.add(adjustCycles.multiply(-DAYS_PER_400_YEAR_CYCLE));
	    }
	    let year = zeroDay
	        .multiply(400)
	        .add(591)
	        .div(DAYS_PER_400_YEAR_CYCLE);
	    let dayOfYearEst = zeroDay.subtract(year
	        .multiply(365)
	        .add(year.div(4))
	        .subtract(year.div(100))
	        .add(year.div(400)));
	    if (dayOfYearEst.lessThan(0)) {
	        year = year.subtract(1);
	        dayOfYearEst = zeroDay.subtract(year
	            .multiply(365)
	            .add(year.div(4))
	            .subtract(year.div(100))
	            .add(year.div(400)));
	    }
	    year = year.add(adjust);
	    const marchDayOfYear = dayOfYearEst;
	    const marchMonth = marchDayOfYear
	        .multiply(5)
	        .add(2)
	        .div(153);
	    const month = marchMonth
	        .add(2)
	        .modulo(12)
	        .add(1);
	    const day = marchDayOfYear
	        .subtract(marchMonth
	        .multiply(306)
	        .add(5)
	        .div(10))
	        .add(1);
	    year = year.add(marchMonth.div(10));
	    return new Date$1(year, month, day);
	}
	/**
	 * Converts nanoseconds of the day into local time.
	 * @param {Integer|number|string} nanoOfDay the nanoseconds of the day to convert.
	 * @return {LocalTime} the local time representing given nanoseconds of the day.
	 */
	function nanoOfDayToLocalTime(nanoOfDay) {
	    nanoOfDay = int(nanoOfDay);
	    const hour = nanoOfDay.div(NANOS_PER_HOUR);
	    nanoOfDay = nanoOfDay.subtract(hour.multiply(NANOS_PER_HOUR));
	    const minute = nanoOfDay.div(NANOS_PER_MINUTE);
	    nanoOfDay = nanoOfDay.subtract(minute.multiply(NANOS_PER_MINUTE));
	    const second = nanoOfDay.div(NANOS_PER_SECOND);
	    const nanosecond = nanoOfDay.subtract(second.multiply(NANOS_PER_SECOND));
	    return new LocalTime(hour, minute, second, nanosecond);
	}
	/**
	 * Converts given epoch second and nanosecond adjustment into a local date time object.
	 * @param {Integer|number|string} epochSecond the epoch second to use.
	 * @param {Integer|number|string} nano the nanosecond to use.
	 * @return {LocalDateTime} the local date time representing given epoch second and nano.
	 */
	function epochSecondAndNanoToLocalDateTime(epochSecond, nano) {
	    const epochDay = floorDiv(epochSecond, SECONDS_PER_DAY);
	    const secondsOfDay = floorMod(epochSecond, SECONDS_PER_DAY);
	    const nanoOfDay = secondsOfDay.multiply(NANOS_PER_SECOND).add(nano);
	    const localDate = epochDayToDate(epochDay);
	    const localTime = nanoOfDayToLocalTime(nanoOfDay);
	    return new LocalDateTime(localDate.year, localDate.month, localDate.day, localTime.hour, localTime.minute, localTime.second, localTime.nanosecond);
	}

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
	const { temporalUtil: { dateToEpochDay, localDateTimeToEpochSecond: localDateTimeToEpochSecond$1, localTimeToNanoOfDay } } = internal;
	const POINT_2D = 0x58;
	const POINT_2D_STRUCT_SIZE = 3;
	const POINT_3D = 0x59;
	const POINT_3D_STRUCT_SIZE = 4;
	const DURATION = 0x45;
	const DURATION_STRUCT_SIZE = 4;
	const LOCAL_TIME = 0x74;
	const LOCAL_TIME_STRUCT_SIZE = 1;
	const TIME = 0x54;
	const TIME_STRUCT_SIZE = 2;
	const DATE = 0x44;
	const DATE_STRUCT_SIZE = 1;
	const LOCAL_DATE_TIME = 0x64;
	const LOCAL_DATE_TIME_STRUCT_SIZE = 2;
	const DATE_TIME_WITH_ZONE_OFFSET$1 = 0x46;
	const DATE_TIME_WITH_ZONE_OFFSET_STRUCT_SIZE$1 = 3;
	const DATE_TIME_WITH_ZONE_ID$1 = 0x66;
	const DATE_TIME_WITH_ZONE_ID_STRUCT_SIZE$1 = 3;
	/**
	 * Creates the Point2D Transformer
	 * @returns {TypeTransformer}
	 */
	function createPoint2DTransformer() {
	    return new TypeTransformer({
	        signature: POINT_2D,
	        isTypeInstance: point => isPoint(point) && (point.z === null || point.z === undefined),
	        toStructure: point => new Structure(POINT_2D, [
	            int(point.srid),
	            point.x,
	            point.y
	        ]),
	        fromStructure: struct => {
	            verifyStructSize('Point2D', POINT_2D_STRUCT_SIZE, struct.size);
	            const [srid, x, y] = struct.fields;
	            return new Point(srid, x, y, undefined // z
	            );
	        }
	    });
	}
	/**
	 * Creates the Point3D Transformer
	 * @returns {TypeTransformer}
	 */
	function createPoint3DTransformer() {
	    return new TypeTransformer({
	        signature: POINT_3D,
	        isTypeInstance: point => isPoint(point) && point.z !== null && point.z !== undefined,
	        toStructure: point => new Structure(POINT_3D, [
	            int(point.srid),
	            point.x,
	            point.y,
	            point.z
	        ]),
	        fromStructure: struct => {
	            verifyStructSize('Point3D', POINT_3D_STRUCT_SIZE, struct.size);
	            const [srid, x, y, z] = struct.fields;
	            return new Point(srid, x, y, z);
	        }
	    });
	}
	/**
	 * Creates the Duration Transformer
	 * @returns {TypeTransformer}
	 */
	function createDurationTransformer() {
	    return new TypeTransformer({
	        signature: DURATION,
	        isTypeInstance: isDuration,
	        toStructure: value => {
	            const months = int(value.months);
	            const days = int(value.days);
	            const seconds = int(value.seconds);
	            const nanoseconds = int(value.nanoseconds);
	            return new Structure(DURATION, [months, days, seconds, nanoseconds]);
	        },
	        fromStructure: struct => {
	            verifyStructSize('Duration', DURATION_STRUCT_SIZE, struct.size);
	            const [months, days, seconds, nanoseconds] = struct.fields;
	            return new Duration(months, days, seconds, nanoseconds);
	        }
	    });
	}
	/**
	 * Creates the LocalTime Transformer
	 * @param {Object} param
	 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
	 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
	 * @returns {TypeTransformer}
	 */
	function createLocalTimeTransformer({ disableLosslessIntegers, useBigInt }) {
	    return new TypeTransformer({
	        signature: LOCAL_TIME,
	        isTypeInstance: isLocalTime,
	        toStructure: value => {
	            const nanoOfDay = localTimeToNanoOfDay(value.hour, value.minute, value.second, value.nanosecond);
	            return new Structure(LOCAL_TIME, [nanoOfDay]);
	        },
	        fromStructure: struct => {
	            verifyStructSize('LocalTime', LOCAL_TIME_STRUCT_SIZE, struct.size);
	            const [nanoOfDay] = struct.fields;
	            const result = nanoOfDayToLocalTime(nanoOfDay);
	            return convertIntegerPropsIfNeeded$1(result, disableLosslessIntegers, useBigInt);
	        }
	    });
	}
	/**
	 * Creates the Time Transformer
	 * @param {Object} param
	 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
	 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
	 * @returns {TypeTransformer}
	 */
	function createTimeTransformer({ disableLosslessIntegers, useBigInt }) {
	    return new TypeTransformer({
	        signature: TIME,
	        isTypeInstance: isTime,
	        toStructure: value => {
	            const nanoOfDay = localTimeToNanoOfDay(value.hour, value.minute, value.second, value.nanosecond);
	            const offsetSeconds = int(value.timeZoneOffsetSeconds);
	            return new Structure(TIME, [nanoOfDay, offsetSeconds]);
	        },
	        fromStructure: struct => {
	            verifyStructSize('Time', TIME_STRUCT_SIZE, struct.size);
	            const [nanoOfDay, offsetSeconds] = struct.fields;
	            const localTime = nanoOfDayToLocalTime(nanoOfDay);
	            const result = new Time(localTime.hour, localTime.minute, localTime.second, localTime.nanosecond, offsetSeconds);
	            return convertIntegerPropsIfNeeded$1(result, disableLosslessIntegers, useBigInt);
	        }
	    });
	}
	/**
	 * Creates the Date Transformer
	 * @param {Object} param
	 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
	 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
	 * @returns {TypeTransformer}
	 */
	function createDateTransformer({ disableLosslessIntegers, useBigInt }) {
	    return new TypeTransformer({
	        signature: DATE,
	        isTypeInstance: isDate,
	        toStructure: value => {
	            const epochDay = dateToEpochDay(value.year, value.month, value.day);
	            return new Structure(DATE, [epochDay]);
	        },
	        fromStructure: struct => {
	            verifyStructSize('Date', DATE_STRUCT_SIZE, struct.size);
	            const [epochDay] = struct.fields;
	            const result = epochDayToDate(epochDay);
	            return convertIntegerPropsIfNeeded$1(result, disableLosslessIntegers, useBigInt);
	        }
	    });
	}
	/**
	 * Creates the LocalDateTime Transformer
	 * @param {Object} param
	 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
	 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
	 * @returns {TypeTransformer}
	 */
	function createLocalDateTimeTransformer({ disableLosslessIntegers, useBigInt }) {
	    return new TypeTransformer({
	        signature: LOCAL_DATE_TIME,
	        isTypeInstance: isLocalDateTime,
	        toStructure: value => {
	            const epochSecond = localDateTimeToEpochSecond$1(value.year, value.month, value.day, value.hour, value.minute, value.second, value.nanosecond);
	            const nano = int(value.nanosecond);
	            return new Structure(LOCAL_DATE_TIME, [epochSecond, nano]);
	        },
	        fromStructure: struct => {
	            verifyStructSize('LocalDateTime', LOCAL_DATE_TIME_STRUCT_SIZE, struct.size);
	            const [epochSecond, nano] = struct.fields;
	            const result = epochSecondAndNanoToLocalDateTime(epochSecond, nano);
	            return convertIntegerPropsIfNeeded$1(result, disableLosslessIntegers, useBigInt);
	        }
	    });
	}
	/**
	 * Creates the DateTime with ZoneId Transformer
	 * @param {Object} param
	 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
	 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
	 * @returns {TypeTransformer}
	 */
	function createDateTimeWithZoneIdTransformer$1({ disableLosslessIntegers, useBigInt }) {
	    return new TypeTransformer({
	        signature: DATE_TIME_WITH_ZONE_ID$1,
	        isTypeInstance: object => isDateTime(object) && object.timeZoneId != null,
	        toStructure: value => {
	            const epochSecond = localDateTimeToEpochSecond$1(value.year, value.month, value.day, value.hour, value.minute, value.second, value.nanosecond);
	            const nano = int(value.nanosecond);
	            const timeZoneId = value.timeZoneId;
	            return new Structure(DATE_TIME_WITH_ZONE_ID$1, [epochSecond, nano, timeZoneId]);
	        },
	        fromStructure: struct => {
	            verifyStructSize('DateTimeWithZoneId', DATE_TIME_WITH_ZONE_ID_STRUCT_SIZE$1, struct.size);
	            const [epochSecond, nano, timeZoneId] = struct.fields;
	            const localDateTime = epochSecondAndNanoToLocalDateTime(epochSecond, nano);
	            const result = new DateTime(localDateTime.year, localDateTime.month, localDateTime.day, localDateTime.hour, localDateTime.minute, localDateTime.second, localDateTime.nanosecond, null, timeZoneId);
	            return convertIntegerPropsIfNeeded$1(result, disableLosslessIntegers, useBigInt);
	        }
	    });
	}
	/**
	 * Creates the DateTime with Offset Transformer
	 * @param {Object} param
	 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
	 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
	 * @returns {TypeTransformer}
	 */
	function createDateTimeWithOffsetTransformer$1({ disableLosslessIntegers, useBigInt }) {
	    return new TypeTransformer({
	        signature: DATE_TIME_WITH_ZONE_OFFSET$1,
	        isTypeInstance: object => isDateTime(object) && object.timeZoneId == null,
	        toStructure: value => {
	            const epochSecond = localDateTimeToEpochSecond$1(value.year, value.month, value.day, value.hour, value.minute, value.second, value.nanosecond);
	            const nano = int(value.nanosecond);
	            const timeZoneOffsetSeconds = int(value.timeZoneOffsetSeconds);
	            return new Structure(DATE_TIME_WITH_ZONE_OFFSET$1, [epochSecond, nano, timeZoneOffsetSeconds]);
	        },
	        fromStructure: struct => {
	            verifyStructSize('DateTimeWithZoneOffset', DATE_TIME_WITH_ZONE_OFFSET_STRUCT_SIZE$1, struct.size);
	            const [epochSecond, nano, timeZoneOffsetSeconds] = struct.fields;
	            const localDateTime = epochSecondAndNanoToLocalDateTime(epochSecond, nano);
	            const result = new DateTime(localDateTime.year, localDateTime.month, localDateTime.day, localDateTime.hour, localDateTime.minute, localDateTime.second, localDateTime.nanosecond, timeZoneOffsetSeconds, null);
	            return convertIntegerPropsIfNeeded$1(result, disableLosslessIntegers, useBigInt);
	        }
	    });
	}
	function convertIntegerPropsIfNeeded$1(obj, disableLosslessIntegers, useBigInt) {
	    if (!disableLosslessIntegers && !useBigInt) {
	        return obj;
	    }
	    const convert = value => useBigInt ? value.toBigInt() : value.toNumberOrInfinity();
	    const clone = Object.create(Object.getPrototypeOf(obj));
	    for (const prop in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, prop) === true) {
	            const value = obj[prop];
	            clone[prop] = isInt(value) ? convert(value) : value;
	        }
	    }
	    Object.freeze(clone);
	    return clone;
	}
	var v2 = {
	    ...v1,
	    createPoint2DTransformer,
	    createPoint3DTransformer,
	    createDurationTransformer,
	    createLocalTimeTransformer,
	    createTimeTransformer,
	    createDateTransformer,
	    createLocalDateTimeTransformer,
	    createDateTimeWithZoneIdTransformer: createDateTimeWithZoneIdTransformer$1,
	    createDateTimeWithOffsetTransformer: createDateTimeWithOffsetTransformer$1
	};

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
	const { constants: { BOLT_PROTOCOL_V2 } } = internal;
	class BoltProtocol$c extends BoltProtocol$d {
	    _createPacker(chunker) {
	        return new v2$1.Packer(chunker);
	    }
	    _createUnpacker(disableLosslessIntegers, useBigInt) {
	        return new v2$1.Unpacker(disableLosslessIntegers, useBigInt);
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(v2).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    get version() {
	        return BOLT_PROTOCOL_V2;
	    }
	}

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
	var v3 = {
	    ...v2
	};

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
	const { 
	// eslint-disable-next-line no-unused-vars
	bookmarks: { Bookmarks: Bookmarks$4 }, constants: { BOLT_PROTOCOL_V3: BOLT_PROTOCOL_V3$2 }, txConfig: { TxConfig: TxConfig$1 } } = internal;
	const CONTEXT$1 = 'context';
	const CALL_GET_ROUTING_TABLE = `CALL dbms.cluster.routing.getRoutingTable($${CONTEXT$1})`;
	const noOpObserver = new StreamObserver();
	class BoltProtocol$b extends BoltProtocol$c {
	    get version() {
	        return BOLT_PROTOCOL_V3$2;
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(v3).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    transformMetadata(metadata) {
	        if ('t_first' in metadata) {
	            // Bolt V3 uses shorter key 't_first' to represent 'result_available_after'
	            // adjust the key to be the same as in Bolt V1 so that ResultSummary can retrieve the value
	            metadata.result_available_after = metadata.t_first;
	            delete metadata.t_first;
	        }
	        if ('t_last' in metadata) {
	            // Bolt V3 uses shorter key 't_last' to represent 'result_consumed_after'
	            // adjust the key to be the same as in Bolt V1 so that ResultSummary can retrieve the value
	            metadata.result_consumed_after = metadata.t_last;
	            delete metadata.t_last;
	        }
	        return metadata;
	    }
	    initialize({ userAgent, boltAgent, authToken, notificationFilter, onError, onComplete } = {}) {
	        const observer = new LoginObserver({
	            onError: error => this._onLoginError(error, onError),
	            onCompleted: metadata => this._onLoginCompleted(metadata, authToken, onComplete)
	        });
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        this.write(RequestMessage.hello(userAgent, authToken), observer, true);
	        return observer;
	    }
	    prepareToClose() {
	        this.write(RequestMessage.goodbye(), noOpObserver, true);
	    }
	    beginTransaction({ bookmarks, txConfig, database, impersonatedUser, notificationFilter, mode, beforeError, afterError, beforeComplete, afterComplete } = {}) {
	        const observer = new ResultStreamObserver({
	            server: this._server,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete
	        });
	        observer.prepareToHandleSingleResponse();
	        // passing in a database name on this protocol version throws an error
	        assertDatabaseIsEmpty(database, this._onProtocolError, observer);
	        // passing impersonated user on this protocol version throws an error
	        assertImpersonatedUserIsEmpty(impersonatedUser, this._onProtocolError, observer);
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        this.write(RequestMessage.begin({ bookmarks, txConfig, mode }), observer, true);
	        return observer;
	    }
	    commitTransaction({ beforeError, afterError, beforeComplete, afterComplete } = {}) {
	        const observer = new ResultStreamObserver({
	            server: this._server,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete
	        });
	        observer.prepareToHandleSingleResponse();
	        this.write(RequestMessage.commit(), observer, true);
	        return observer;
	    }
	    rollbackTransaction({ beforeError, afterError, beforeComplete, afterComplete } = {}) {
	        const observer = new ResultStreamObserver({
	            server: this._server,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete
	        });
	        observer.prepareToHandleSingleResponse();
	        this.write(RequestMessage.rollback(), observer, true);
	        return observer;
	    }
	    run(query, parameters, { bookmarks, txConfig, database, impersonatedUser, notificationFilter, mode, beforeKeys, afterKeys, beforeError, afterError, beforeComplete, afterComplete, flush = true, highRecordWatermark = Number.MAX_VALUE, lowRecordWatermark = Number.MAX_VALUE } = {}) {
	        const observer = new ResultStreamObserver({
	            server: this._server,
	            beforeKeys,
	            afterKeys,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete,
	            highRecordWatermark,
	            lowRecordWatermark
	        });
	        // passing in a database name on this protocol version throws an error
	        assertDatabaseIsEmpty(database, this._onProtocolError, observer);
	        // passing impersonated user on this protocol version throws an error
	        assertImpersonatedUserIsEmpty(impersonatedUser, this._onProtocolError, observer);
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        this.write(RequestMessage.runWithMetadata(query, parameters, {
	            bookmarks,
	            txConfig,
	            mode
	        }), observer, false);
	        this.write(RequestMessage.pullAll(), observer, flush);
	        return observer;
	    }
	    /**
	     * Request routing information
	     *
	     * @param {Object} param -
	     * @param {object} param.routingContext The routing context used to define the routing table.
	     *  Multi-datacenter deployments is one of its use cases
	     * @param {string} param.databaseName The database name
	     * @param {Bookmarks} params.sessionContext.bookmarks The bookmarks used for requesting the routing table
	     * @param {string} params.sessionContext.mode The session mode
	     * @param {string} params.sessionContext.database The database name used on the session
	     * @param {function()} params.sessionContext.afterComplete The session param used after the session closed
	     * @param {function(err: Error)} param.onError
	     * @param {function(RawRoutingTable)} param.onCompleted
	     * @returns {RouteObserver} the route observer
	     */
	    requestRoutingInformation({ routingContext = {}, sessionContext = {}, onError, onCompleted }) {
	        const resultObserver = this.run(CALL_GET_ROUTING_TABLE, { [CONTEXT$1]: routingContext }, { ...sessionContext, txConfig: TxConfig$1.empty() });
	        return new ProcedureRouteObserver({
	            resultObserver,
	            onProtocolError: this._onProtocolError,
	            onError,
	            onCompleted
	        });
	    }
	}

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
	var v4x0 = {
	    ...v3
	};

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
	const { 
	// eslint-disable-next-line no-unused-vars
	bookmarks: { Bookmarks: Bookmarks$3 }, constants: { BOLT_PROTOCOL_V4_0: BOLT_PROTOCOL_V4_0$2, FETCH_ALL: FETCH_ALL$2 }, txConfig: { TxConfig } } = internal;
	const CONTEXT = 'context';
	const DATABASE = 'database';
	const CALL_GET_ROUTING_TABLE_MULTI_DB = `CALL dbms.routing.getRoutingTable($${CONTEXT}, $${DATABASE})`;
	class BoltProtocol$a extends BoltProtocol$b {
	    get version() {
	        return BOLT_PROTOCOL_V4_0$2;
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(v4x0).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    beginTransaction({ bookmarks, txConfig, database, impersonatedUser, notificationFilter, mode, beforeError, afterError, beforeComplete, afterComplete } = {}) {
	        const observer = new ResultStreamObserver({
	            server: this._server,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete
	        });
	        observer.prepareToHandleSingleResponse();
	        // passing impersonated user on this protocol version throws an error
	        assertImpersonatedUserIsEmpty(impersonatedUser, this._onProtocolError, observer);
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        this.write(RequestMessage.begin({ bookmarks, txConfig, database, mode }), observer, true);
	        return observer;
	    }
	    run(query, parameters, { bookmarks, txConfig, database, impersonatedUser, notificationFilter, mode, beforeKeys, afterKeys, beforeError, afterError, beforeComplete, afterComplete, flush = true, reactive = false, fetchSize = FETCH_ALL$2, highRecordWatermark = Number.MAX_VALUE, lowRecordWatermark = Number.MAX_VALUE } = {}) {
	        const observer = new ResultStreamObserver({
	            server: this._server,
	            reactive,
	            fetchSize,
	            moreFunction: this._requestMore.bind(this),
	            discardFunction: this._requestDiscard.bind(this),
	            beforeKeys,
	            afterKeys,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete,
	            highRecordWatermark,
	            lowRecordWatermark
	        });
	        // passing impersonated user on this protocol version throws an error
	        assertImpersonatedUserIsEmpty(impersonatedUser, this._onProtocolError, observer);
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        const flushRun = reactive;
	        this.write(RequestMessage.runWithMetadata(query, parameters, {
	            bookmarks,
	            txConfig,
	            database,
	            mode
	        }), observer, flushRun && flush);
	        if (!reactive) {
	            this.write(RequestMessage.pull({ n: fetchSize }), observer, flush);
	        }
	        return observer;
	    }
	    _requestMore(stmtId, n, observer) {
	        this.write(RequestMessage.pull({ stmtId, n }), observer, true);
	    }
	    _requestDiscard(stmtId, observer) {
	        this.write(RequestMessage.discard({ stmtId }), observer, true);
	    }
	    _noOp() { }
	    /**
	     * Request routing information
	     *
	     * @param {Object} param -
	     * @param {object} param.routingContext The routing context used to define the routing table.
	     *  Multi-datacenter deployments is one of its use cases
	     * @param {string} param.databaseName The database name
	     * @param {Bookmarks} params.sessionContext.bookmarks The bookmarks used for requesting the routing table
	     * @param {string} params.sessionContext.mode The session mode
	     * @param {string} params.sessionContext.database The database name used on the session
	     * @param {function()} params.sessionContext.afterComplete The session param used after the session closed
	     * @param {function(err: Error)} param.onError
	     * @param {function(RawRoutingTable)} param.onCompleted
	     * @returns {RouteObserver} the route observer
	     */
	    requestRoutingInformation({ routingContext = {}, databaseName = null, sessionContext = {}, onError, onCompleted }) {
	        const resultObserver = this.run(CALL_GET_ROUTING_TABLE_MULTI_DB, {
	            [CONTEXT]: routingContext,
	            [DATABASE]: databaseName
	        }, { ...sessionContext, txConfig: TxConfig.empty() });
	        return new ProcedureRouteObserver({
	            resultObserver,
	            onProtocolError: this._onProtocolError,
	            onError,
	            onCompleted
	        });
	    }
	}

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
	var v4x1 = {
	    ...v4x0
	};

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
	const { constants: { BOLT_PROTOCOL_V4_1 } } = internal;
	class BoltProtocol$9 extends BoltProtocol$a {
	    /**
	     * @constructor
	     * @param {Object} server the server informatio.
	     * @param {Chunker} chunker the chunker.
	     * @param {Object} packstreamConfig Packstream configuration
	     * @param {boolean} packstreamConfig.disableLosslessIntegers if this connection should convert all received integers to native JS numbers.
	     * @param {boolean} packstreamConfig.useBigInt if this connection should convert all received integers to native BigInt numbers.
	     * @param {CreateResponseHandler} createResponseHandler Function which creates the response handler
	     * @param {Logger} log the logger
	     * @param {Object} serversideRouting
	     *
	     */
	    constructor(server, chunker, packstreamConfig, createResponseHandler = () => null, log, onProtocolError, serversideRouting) {
	        super(server, chunker, packstreamConfig, createResponseHandler, log, onProtocolError);
	        this._serversideRouting = serversideRouting;
	    }
	    get version() {
	        return BOLT_PROTOCOL_V4_1;
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(v4x1).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    initialize({ userAgent, boltAgent, authToken, notificationFilter, onError, onComplete } = {}) {
	        const observer = new LoginObserver({
	            onError: error => this._onLoginError(error, onError),
	            onCompleted: metadata => this._onLoginCompleted(metadata, authToken, onComplete)
	        });
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        this.write(RequestMessage.hello(userAgent, authToken, this._serversideRouting), observer, true);
	        return observer;
	    }
	}

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
	var v4x2 = {
	    ...v4x1
	};

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
	const { constants: { BOLT_PROTOCOL_V4_2 } } = internal;
	class BoltProtocol$8 extends BoltProtocol$9 {
	    get version() {
	        return BOLT_PROTOCOL_V4_2;
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(v4x2).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	}

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
	var transformersFactories$1 = {
	    ...v4x2
	};

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
	var v4x4 = {
	    ...transformersFactories$1
	};

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
	const { temporalUtil: { localDateTimeToEpochSecond } } = internal;
	const DATE_TIME_WITH_ZONE_OFFSET = 0x49;
	const DATE_TIME_WITH_ZONE_OFFSET_STRUCT_SIZE = 3;
	const DATE_TIME_WITH_ZONE_ID = 0x69;
	const DATE_TIME_WITH_ZONE_ID_STRUCT_SIZE = 3;
	function createDateTimeWithZoneIdTransformer(config, logger) {
	    const { disableLosslessIntegers, useBigInt } = config;
	    const dateTimeWithZoneIdTransformer = v4x4.createDateTimeWithZoneIdTransformer(config);
	    return dateTimeWithZoneIdTransformer.extendsWith({
	        signature: DATE_TIME_WITH_ZONE_ID,
	        fromStructure: struct => {
	            verifyStructSize('DateTimeWithZoneId', DATE_TIME_WITH_ZONE_ID_STRUCT_SIZE, struct.size);
	            const [epochSecond, nano, timeZoneId] = struct.fields;
	            const localDateTime = getTimeInZoneId(timeZoneId, epochSecond, nano);
	            const result = new DateTime(localDateTime.year, localDateTime.month, localDateTime.day, localDateTime.hour, localDateTime.minute, localDateTime.second, int(nano), localDateTime.timeZoneOffsetSeconds, timeZoneId);
	            return convertIntegerPropsIfNeeded(result, disableLosslessIntegers, useBigInt);
	        },
	        toStructure: value => {
	            const epochSecond = localDateTimeToEpochSecond(value.year, value.month, value.day, value.hour, value.minute, value.second, value.nanosecond);
	            const offset = value.timeZoneOffsetSeconds != null
	                ? value.timeZoneOffsetSeconds
	                : getOffsetFromZoneId(value.timeZoneId, epochSecond, value.nanosecond);
	            if (value.timeZoneOffsetSeconds == null) {
	                logger.warn('DateTime objects without "timeZoneOffsetSeconds" property ' +
	                    'are prune to bugs related to ambiguous times. For instance, ' +
	                    '2022-10-30T2:30:00[Europe/Berlin] could be GMT+1 or GMT+2.');
	            }
	            const utc = epochSecond.subtract(offset);
	            const nano = int(value.nanosecond);
	            const timeZoneId = value.timeZoneId;
	            return new Structure(DATE_TIME_WITH_ZONE_ID, [utc, nano, timeZoneId]);
	        }
	    });
	}
	/**
	 * Returns the offset for a given timezone id
	 *
	 * Javascript doesn't have support for direct getting the timezone offset from a given
	 * TimeZoneId and DateTime in the given TimeZoneId. For solving this issue,
	 *
	 * 1. The ZoneId is applied to the timestamp, so we could make the difference between the
	 * given timestamp and the new calculated one. This is the offset for the timezone
	 * in the utc is equal to epoch (some time in the future or past)
	 * 2. The offset is subtracted from the timestamp, so we have an estimated utc timestamp.
	 * 3. The ZoneId is applied to the new timestamp, se we could could make the difference
	 * between the new timestamp and the calculated one. This is the offset for the given timezone.
	 *
	 * Example:
	 *    Input: 2022-3-27 1:59:59 'Europe/Berlin'
	 *    Apply 1, 2022-3-27 1:59:59 => 2022-3-27 3:59:59 'Europe/Berlin' +2:00
	 *    Apply 2, 2022-3-27 1:59:59 - 2:00 => 2022-3-26 23:59:59
	 *    Apply 3, 2022-3-26 23:59:59 => 2022-3-27 00:59:59 'Europe/Berlin' +1:00
	 *  The offset is +1 hour.
	 *
	 * @param {string} timeZoneId The timezone id
	 * @param {Integer} epochSecond The epoch second in the timezone id
	 * @param {Integerable} nanosecond The nanoseconds in the timezone id
	 * @returns The timezone offset
	 */
	function getOffsetFromZoneId(timeZoneId, epochSecond, nanosecond) {
	    const dateTimeWithZoneAppliedTwice = getTimeInZoneId(timeZoneId, epochSecond, nanosecond);
	    // The wallclock form the current date time
	    const epochWithZoneAppliedTwice = localDateTimeToEpochSecond(dateTimeWithZoneAppliedTwice.year, dateTimeWithZoneAppliedTwice.month, dateTimeWithZoneAppliedTwice.day, dateTimeWithZoneAppliedTwice.hour, dateTimeWithZoneAppliedTwice.minute, dateTimeWithZoneAppliedTwice.second, nanosecond);
	    const offsetOfZoneInTheFutureUtc = epochWithZoneAppliedTwice.subtract(epochSecond);
	    const guessedUtc = epochSecond.subtract(offsetOfZoneInTheFutureUtc);
	    const zonedDateTimeFromGuessedUtc = getTimeInZoneId(timeZoneId, guessedUtc, nanosecond);
	    const zonedEpochFromGuessedUtc = localDateTimeToEpochSecond(zonedDateTimeFromGuessedUtc.year, zonedDateTimeFromGuessedUtc.month, zonedDateTimeFromGuessedUtc.day, zonedDateTimeFromGuessedUtc.hour, zonedDateTimeFromGuessedUtc.minute, zonedDateTimeFromGuessedUtc.second, nanosecond);
	    const offset = zonedEpochFromGuessedUtc.subtract(guessedUtc);
	    return offset;
	}
	function getTimeInZoneId(timeZoneId, epochSecond, nano) {
	    const formatter = new Intl.DateTimeFormat('en-US', {
	        timeZone: timeZoneId,
	        year: 'numeric',
	        month: 'numeric',
	        day: 'numeric',
	        hour: 'numeric',
	        minute: 'numeric',
	        second: 'numeric',
	        hour12: false,
	        era: 'narrow'
	    });
	    const utc = int(epochSecond)
	        .multiply(1000)
	        .add(int(nano).div(1000000))
	        .toNumber();
	    const formattedUtcParts = formatter.formatToParts(utc);
	    const localDateTime = formattedUtcParts.reduce((obj, currentValue) => {
	        if (currentValue.type === 'era') {
	            obj.adjustEra =
	                currentValue.value.toUpperCase() === 'B'
	                    ? year => year.subtract(1).negate() // 1BC equals to year 0 in astronomical year numbering
	                    : identity;
	        }
	        else if (currentValue.type === 'hour') {
	            obj.hour = int(currentValue.value).modulo(24);
	        }
	        else if (currentValue.type !== 'literal') {
	            obj[currentValue.type] = int(currentValue.value);
	        }
	        return obj;
	    }, {});
	    localDateTime.year = localDateTime.adjustEra(localDateTime.year);
	    const epochInTimeZone = localDateTimeToEpochSecond(localDateTime.year, localDateTime.month, localDateTime.day, localDateTime.hour, localDateTime.minute, localDateTime.second, localDateTime.nanosecond);
	    localDateTime.timeZoneOffsetSeconds = epochInTimeZone.subtract(epochSecond);
	    localDateTime.hour = localDateTime.hour.modulo(24);
	    return localDateTime;
	}
	function createDateTimeWithOffsetTransformer(config) {
	    const { disableLosslessIntegers, useBigInt } = config;
	    const dateTimeWithOffsetTransformer = v4x4.createDateTimeWithOffsetTransformer(config);
	    return dateTimeWithOffsetTransformer.extendsWith({
	        signature: DATE_TIME_WITH_ZONE_OFFSET,
	        toStructure: value => {
	            const epochSecond = localDateTimeToEpochSecond(value.year, value.month, value.day, value.hour, value.minute, value.second, value.nanosecond);
	            const nano = int(value.nanosecond);
	            const timeZoneOffsetSeconds = int(value.timeZoneOffsetSeconds);
	            const utcSecond = epochSecond.subtract(timeZoneOffsetSeconds);
	            return new Structure(DATE_TIME_WITH_ZONE_OFFSET, [utcSecond, nano, timeZoneOffsetSeconds]);
	        },
	        fromStructure: struct => {
	            verifyStructSize('DateTimeWithZoneOffset', DATE_TIME_WITH_ZONE_OFFSET_STRUCT_SIZE, struct.size);
	            const [utcSecond, nano, timeZoneOffsetSeconds] = struct.fields;
	            const epochSecond = int(utcSecond).add(timeZoneOffsetSeconds);
	            const localDateTime = epochSecondAndNanoToLocalDateTime(epochSecond, nano);
	            const result = new DateTime(localDateTime.year, localDateTime.month, localDateTime.day, localDateTime.hour, localDateTime.minute, localDateTime.second, localDateTime.nanosecond, timeZoneOffsetSeconds, null);
	            return convertIntegerPropsIfNeeded(result, disableLosslessIntegers, useBigInt);
	        }
	    });
	}
	function convertIntegerPropsIfNeeded(obj, disableLosslessIntegers, useBigInt) {
	    if (!disableLosslessIntegers && !useBigInt) {
	        return obj;
	    }
	    const convert = value => useBigInt ? value.toBigInt() : value.toNumberOrInfinity();
	    const clone = Object.create(Object.getPrototypeOf(obj));
	    for (const prop in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, prop) === true) {
	            const value = obj[prop];
	            clone[prop] = isInt(value) ? convert(value) : value;
	        }
	    }
	    Object.freeze(clone);
	    return clone;
	}
	var v5x0Utc = {
	    createDateTimeWithZoneIdTransformer,
	    createDateTimeWithOffsetTransformer
	};

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
	const { bookmarks: { Bookmarks: Bookmarks$2 }, constants: { BOLT_PROTOCOL_V4_3 } } = internal;
	class BoltProtocol$7 extends BoltProtocol$8 {
	    get version() {
	        return BOLT_PROTOCOL_V4_3;
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(transformersFactories$1).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    /**
	     * Request routing information
	     *
	     * @param {Object} param -
	     * @param {object} param.routingContext The routing context used to define the routing table.
	     *  Multi-datacenter deployments is one of its use cases
	     * @param {string} param.databaseName The database name
	     * @param {Bookmarks} params.sessionContext.bookmarks The bookmarks used for requesting the routing table
	     * @param {function(err: Error)} param.onError
	     * @param {function(RawRoutingTable)} param.onCompleted
	     * @returns {RouteObserver} the route observer
	     */
	    requestRoutingInformation({ routingContext = {}, databaseName = null, sessionContext = {}, onError, onCompleted }) {
	        const observer = new RouteObserver({
	            onProtocolError: this._onProtocolError,
	            onError,
	            onCompleted
	        });
	        const bookmarks = sessionContext.bookmarks || Bookmarks$2.empty();
	        this.write(RequestMessage.route(routingContext, bookmarks.values(), databaseName), observer, true);
	        return observer;
	    }
	    /**
	     * Initialize a connection with the server
	     *
	     * @param {Object} args The params
	     * @param {string} args.userAgent The user agent
	     * @param {any} args.authToken The auth token
	     * @param {NotificationFilter} args.notificationFilter The notification filter.
	     * @param {function(error)} args.onError On error callback
	     * @param {function(onComplte)} args.onComplete On complete callback
	     * @returns {LoginObserver} The Login observer
	     */
	    initialize({ userAgent, boltAgent, authToken, notificationFilter, onError, onComplete } = {}) {
	        const observer = new LoginObserver({
	            onError: error => this._onLoginError(error, onError),
	            onCompleted: metadata => {
	                if (metadata.patch_bolt !== undefined) {
	                    this._applyPatches(metadata.patch_bolt);
	                }
	                return this._onLoginCompleted(metadata, authToken, onComplete);
	            }
	        });
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        this.write(RequestMessage.hello(userAgent, authToken, this._serversideRouting, ['utc']), observer, true);
	        return observer;
	    }
	    /**
	     *
	     * @param {string[]} patches Patches to be applied to the protocol
	     */
	    _applyPatches(patches) {
	        if (patches.includes('utc')) {
	            this._applyUtcPatch();
	        }
	    }
	    _applyUtcPatch() {
	        this._transformer = new Transformer(Object.values({
	            ...transformersFactories$1,
	            ...v5x0Utc
	        }).map(create => create(this._config, this._log)));
	    }
	}

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
	const { constants: { BOLT_PROTOCOL_V4_4: BOLT_PROTOCOL_V4_4$2, FETCH_ALL: FETCH_ALL$1 }, bookmarks: { Bookmarks: Bookmarks$1 } } = internal;
	class BoltProtocol$6 extends BoltProtocol$7 {
	    get version() {
	        return BOLT_PROTOCOL_V4_4$2;
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(v4x4).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    /**
	    * Request routing information
	    *
	    * @param {Object} param -
	    * @param {object} param.routingContext The routing context used to define the routing table.
	    *  Multi-datacenter deployments is one of its use cases
	    * @param {string} param.databaseName The database name
	    * @param {Bookmarks} params.sessionContext.bookmarks The bookmarks used for requesting the routing table
	    * @param {function(err: Error)} param.onError
	    * @param {function(RawRoutingTable)} param.onCompleted
	    * @returns {RouteObserver} the route observer
	    */
	    requestRoutingInformation({ routingContext = {}, databaseName = null, impersonatedUser = null, sessionContext = {}, onError, onCompleted }) {
	        const observer = new RouteObserver({
	            onProtocolError: this._onProtocolError,
	            onError,
	            onCompleted
	        });
	        const bookmarks = sessionContext.bookmarks || Bookmarks$1.empty();
	        this.write(RequestMessage.routeV4x4(routingContext, bookmarks.values(), { databaseName, impersonatedUser }), observer, true);
	        return observer;
	    }
	    run(query, parameters, { bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter, beforeKeys, afterKeys, beforeError, afterError, beforeComplete, afterComplete, flush = true, reactive = false, fetchSize = FETCH_ALL$1, highRecordWatermark = Number.MAX_VALUE, lowRecordWatermark = Number.MAX_VALUE } = {}) {
	        const observer = new ResultStreamObserver({
	            server: this._server,
	            reactive,
	            fetchSize,
	            moreFunction: this._requestMore.bind(this),
	            discardFunction: this._requestDiscard.bind(this),
	            beforeKeys,
	            afterKeys,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete,
	            highRecordWatermark,
	            lowRecordWatermark
	        });
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        const flushRun = reactive;
	        this.write(RequestMessage.runWithMetadata(query, parameters, {
	            bookmarks,
	            txConfig,
	            database,
	            mode,
	            impersonatedUser
	        }), observer, flushRun && flush);
	        if (!reactive) {
	            this.write(RequestMessage.pull({ n: fetchSize }), observer, flush);
	        }
	        return observer;
	    }
	    beginTransaction({ bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter, beforeError, afterError, beforeComplete, afterComplete } = {}) {
	        const observer = new ResultStreamObserver({
	            server: this._server,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete
	        });
	        observer.prepareToHandleSingleResponse();
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        this.write(RequestMessage.begin({ bookmarks, txConfig, database, mode, impersonatedUser }), observer, true);
	        return observer;
	    }
	    _applyUtcPatch() {
	        this._transformer = new Transformer(Object.values({
	            ...v4x4,
	            ...v5x0Utc
	        }).map(create => create(this._config, this._log)));
	    }
	}

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
	const NODE_STRUCT_SIZE = 4;
	const RELATIONSHIP_STRUCT_SIZE = 8;
	const UNBOUND_RELATIONSHIP_STRUCT_SIZE = 4;
	/**
	 * Create an extend Node transformer with support to elementId
	 * @param {any} config
	 * @returns {TypeTransformer}
	 */
	function createNodeTransformer(config) {
	    const node4x4Transformer = v4x4.createNodeTransformer(config);
	    return node4x4Transformer.extendsWith({
	        fromStructure: struct => {
	            verifyStructSize('Node', NODE_STRUCT_SIZE, struct.size);
	            const [identity, lables, properties, elementId] = struct.fields;
	            return new Node(identity, lables, properties, elementId);
	        }
	    });
	}
	/**
	 * Create an extend Relationship transformer with support to elementId
	 * @param {any} config
	 * @returns {TypeTransformer}
	 */
	function createRelationshipTransformer(config) {
	    const relationship4x4Transformer = v4x4.createRelationshipTransformer(config);
	    return relationship4x4Transformer.extendsWith({
	        fromStructure: struct => {
	            verifyStructSize('Relationship', RELATIONSHIP_STRUCT_SIZE, struct.size);
	            const [identity, startNodeIdentity, endNodeIdentity, type, properties, elementId, startNodeElementId, endNodeElementId] = struct.fields;
	            return new Relationship(identity, startNodeIdentity, endNodeIdentity, type, properties, elementId, startNodeElementId, endNodeElementId);
	        }
	    });
	}
	/**
	 * Create an extend Unbound Relationship transformer with support to elementId
	 * @param {any} config
	 * @returns {TypeTransformer}
	 */
	function createUnboundRelationshipTransformer(config) {
	    const unboundRelationshipTransformer = v4x4.createUnboundRelationshipTransformer(config);
	    return unboundRelationshipTransformer.extendsWith({
	        fromStructure: struct => {
	            verifyStructSize('UnboundRelationship', UNBOUND_RELATIONSHIP_STRUCT_SIZE, struct.size);
	            const [identity, type, properties, elementId] = struct.fields;
	            return new UnboundRelationship(identity, type, properties, elementId);
	        }
	    });
	}
	var v5x0 = {
	    ...v4x4,
	    ...v5x0Utc,
	    createNodeTransformer,
	    createRelationshipTransformer,
	    createUnboundRelationshipTransformer
	};

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
	const { constants: { BOLT_PROTOCOL_V5_0 } } = internal;
	class BoltProtocol$5 extends BoltProtocol$6 {
	    get version() {
	        return BOLT_PROTOCOL_V5_0;
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(v5x0).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    /**
	     * Initialize a connection with the server
	     *
	     * @param {Object} args The params
	     * @param {string} args.userAgent The user agent
	     * @param {any} args.authToken The auth token
	     * @param {NotificationFilter} args.notificationFilter The notification filter.
	     * @param {function(error)} args.onError On error callback
	     * @param {function(onComplte)} args.onComplete On complete callback
	     * @returns {LoginObserver} The Login observer
	     */
	    initialize({ userAgent, boltAgent, authToken, notificationFilter, onError, onComplete } = {}) {
	        const observer = new LoginObserver({
	            onError: error => this._onLoginError(error, onError),
	            onCompleted: metadata => this._onLoginCompleted(metadata, authToken, onComplete)
	        });
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        this.write(RequestMessage.hello(userAgent, authToken, this._serversideRouting), observer, true);
	        return observer;
	    }
	}

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
	var v5x1 = {
	    ...v5x0
	};

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
	const { constants: { BOLT_PROTOCOL_V5_1: BOLT_PROTOCOL_V5_1$2 } } = internal;
	class BoltProtocol$4 extends BoltProtocol$5 {
	    get version() {
	        return BOLT_PROTOCOL_V5_1$2;
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(v5x1).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    get supportsReAuth() {
	        return true;
	    }
	    /**
	     * Initialize a connection with the server
	     *
	     * @param {Object} args The params
	     * @param {string} args.userAgent The user agent
	     * @param {any} args.authToken The auth token
	     * @param {NotificationFilter} args.notificationFilter The notification filters.
	     * @param {function(error)} args.onError On error callback
	     * @param {function(onComplete)} args.onComplete On complete callback
	     * @returns {LoginObserver} The Login observer
	     */
	    initialize({ userAgent, boltAgent, authToken, notificationFilter, onError, onComplete } = {}) {
	        const state = {};
	        const observer = new LoginObserver({
	            onError: error => this._onLoginError(error, onError),
	            onCompleted: metadata => {
	                state.metadata = metadata;
	                return this._onLoginCompleted(metadata);
	            }
	        });
	        // passing notification filter on this protocol version throws an error
	        assertNotificationFilterIsEmpty(notificationFilter, this._onProtocolError, observer);
	        this.write(RequestMessage.hello5x1(userAgent, this._serversideRouting), observer, false);
	        return this.logon({
	            authToken,
	            onComplete: metadata => onComplete({ ...metadata, ...state.metadata }),
	            onError,
	            flush: true
	        });
	    }
	    /**
	     * Performs login of the underlying connection
	     *
	     * @param {Object} args
	     * @param {Object} args.authToken the authentication token.
	     * @param {function(err: Error)} args.onError the callback to invoke on error.
	     * @param {function()} args.onComplete the callback to invoke on completion.
	     * @param {boolean} args.flush whether to flush the buffered messages.
	     *
	     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
	     */
	    logon({ authToken, onComplete, onError, flush } = {}) {
	        const observer = new LoginObserver({
	            onCompleted: () => this._onLoginCompleted(null, authToken, onComplete),
	            onError: (error) => this._onLoginError(error, onError)
	        });
	        this.write(RequestMessage.logon(authToken), observer, flush);
	        return observer;
	    }
	    /**
	     * Performs logoff of the underlying connection
	     *
	     * @param {Object} param
	     * @param {function(err: Error)} param.onError the callback to invoke on error.
	     * @param {function()} param.onComplete the callback to invoke on completion.
	     * @param {boolean} param.flush whether to flush the buffered messages.
	     *
	     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
	    */
	    logoff({ onComplete, onError, flush } = {}) {
	        const observer = new LogoffObserver({
	            onCompleted: onComplete,
	            onError
	        });
	        this.write(RequestMessage.logoff(), observer, flush);
	        return observer;
	    }
	}

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
	var v5x2 = {
	    ...v5x1
	};

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
	const { constants: { BOLT_PROTOCOL_V5_2, FETCH_ALL } } = internal;
	class BoltProtocol$3 extends BoltProtocol$4 {
	    get version() {
	        return BOLT_PROTOCOL_V5_2;
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(v5x2).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    get supportsReAuth() {
	        return true;
	    }
	    /**
	     * Initialize a connection with the server
	     *
	     * @param {Object} args The params
	     * @param {string} args.userAgent The user agent
	     * @param {string} args.boltAgent The bolt agent
	     * @param {any} args.authToken The auth token
	     * @param {NotificationFilter} args.notificationFilter The notification filters.
	     * @param {function(error)} args.onError On error callback
	     * @param {function(onComplete)} args.onComplete On complete callback
	     * @returns {LoginObserver} The Login observer
	     */
	    initialize({ userAgent, boltAgent, authToken, notificationFilter, onError, onComplete } = {}) {
	        const state = {};
	        const observer = new LoginObserver({
	            onError: error => this._onLoginError(error, onError),
	            onCompleted: metadata => {
	                state.metadata = metadata;
	                return this._onLoginCompleted(metadata);
	            }
	        });
	        this.write(
	        // if useragent is null then for all versions before 5.3 it should be bolt agent by default
	        RequestMessage.hello5x2(userAgent, notificationFilter, this._serversideRouting), observer, false);
	        return this.logon({
	            authToken,
	            onComplete: metadata => onComplete({ ...metadata, ...state.metadata }),
	            onError,
	            flush: true
	        });
	    }
	    beginTransaction({ bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter, beforeError, afterError, beforeComplete, afterComplete } = {}) {
	        const observer = new ResultStreamObserver({
	            server: this._server,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete
	        });
	        observer.prepareToHandleSingleResponse();
	        this.write(RequestMessage.begin({ bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter }), observer, true);
	        return observer;
	    }
	    run(query, parameters, { bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter, beforeKeys, afterKeys, beforeError, afterError, beforeComplete, afterComplete, flush = true, reactive = false, fetchSize = FETCH_ALL, highRecordWatermark = Number.MAX_VALUE, lowRecordWatermark = Number.MAX_VALUE } = {}) {
	        const observer = new ResultStreamObserver({
	            server: this._server,
	            reactive,
	            fetchSize,
	            moreFunction: this._requestMore.bind(this),
	            discardFunction: this._requestDiscard.bind(this),
	            beforeKeys,
	            afterKeys,
	            beforeError,
	            afterError,
	            beforeComplete,
	            afterComplete,
	            highRecordWatermark,
	            lowRecordWatermark
	        });
	        const flushRun = reactive;
	        this.write(RequestMessage.runWithMetadata(query, parameters, {
	            bookmarks,
	            txConfig,
	            database,
	            mode,
	            impersonatedUser,
	            notificationFilter
	        }), observer, flushRun && flush);
	        if (!reactive) {
	            this.write(RequestMessage.pull({ n: fetchSize }), observer, flush);
	        }
	        return observer;
	    }
	}

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
	var v5x3 = {
	    ...v5x2
	};

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
	const { constants: { BOLT_PROTOCOL_V5_3 } } = internal;
	class BoltProtocol$2 extends BoltProtocol$3 {
	    get version() {
	        return BOLT_PROTOCOL_V5_3;
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(v5x3).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    /**
	     * Initialize a connection with the server
	     *
	     * @param {Object} args The params
	     * @param {string} args.userAgent The user agent
	     * @param {any} args.authToken The auth token
	     * @param {NotificationFilter} args.notificationFilter The notification filters.
	     * @param {function(error)} args.onError On error callback
	     * @param {function(onComplete)} args.onComplete On complete callback
	     * @returns {LoginObserver} The Login observer
	     */
	    initialize({ userAgent, boltAgent, authToken, notificationFilter, onError, onComplete } = {}) {
	        const state = {};
	        const observer = new LoginObserver({
	            onError: error => this._onLoginError(error, onError),
	            onCompleted: metadata => {
	                state.metadata = metadata;
	                return this._onLoginCompleted(metadata);
	            }
	        });
	        this.write(RequestMessage.hello5x3(userAgent, boltAgent, notificationFilter, this._serversideRouting), observer, false);
	        return this.logon({
	            authToken,
	            onComplete: metadata => onComplete({ ...metadata, ...state.metadata }),
	            onError,
	            flush: true
	        });
	    }
	}

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
	var transformersFactories = {
	    ...v5x3
	};

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
	const { constants: { BOLT_PROTOCOL_V5_4 } } = internal;
	class BoltProtocol$1 extends BoltProtocol$2 {
	    get version() {
	        return BOLT_PROTOCOL_V5_4;
	    }
	    get transformer() {
	        if (this._transformer === undefined) {
	            this._transformer = new Transformer(Object.values(transformersFactories).map(create => create(this._config, this._log)));
	        }
	        return this._transformer;
	    }
	    /**
	     * Send a TELEMETRY through the underlying connection.
	     *
	     * @param {object} param0 Message params
	     * @param {number} param0.api The API called
	     * @param {object} param1 Configuration and callbacks callbacks
	     * @param {function()} param1.onCompleted Called when completed
	     * @param {function()} param1.onError Called when error
	     * @return {StreamObserver} the stream observer that monitors the corresponding server response.
	     */
	    telemetry({ api }, { onError, onCompleted } = {}) {
	        const observer = new TelemetryObserver({ onCompleted, onError });
	        this.write(RequestMessage.telemetry({ api }), observer, false);
	        return observer;
	    }
	}

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
	// Signature bytes for each response message type
	const SUCCESS = 0x70; // 0111 0000 // SUCCESS <metadata>
	const RECORD = 0x71; // 0111 0001 // RECORD <value>
	const IGNORED = 0x7e; // 0111 1110 // IGNORED <metadata>
	const FAILURE = 0x7f; // 0111 1111 // FAILURE <metadata>
	function NO_OP() { }
	function NO_OP_IDENTITY(subject) {
	    return subject;
	}
	const NO_OP_OBSERVER = {
	    onNext: NO_OP,
	    onCompleted: NO_OP,
	    onError: NO_OP
	};
	/**
	 * Treat the protocol responses and notify the observers
	 */
	class ResponseHandler {
	    /**
	     * Called when something went wrong with the connectio
	     * @callback ResponseHandler~Observer~OnErrorApplyTransformation
	     * @param {any} error The error
	     * @returns {any} The new error
	     */
	    /**
	     * Called when something went wrong with the connectio
	     * @callback ResponseHandler~Observer~OnError
	     * @param {any} error The error
	     */
	    /**
	     * Called when something went wrong with the connectio
	     * @callback ResponseHandler~MetadataTransformer
	     * @param {any} metadata The metadata got onSuccess
	     * @returns {any} The transformed metadata
	     */
	    /**
	     * @typedef {Object} ResponseHandler~Observer
	     * @property {ResponseHandler~Observer~OnError} onError Invoke when a connection error occurs
	     * @property {ResponseHandler~Observer~OnError} onFailure Invoke when a protocol failure occurs
	     * @property {ResponseHandler~Observer~OnErrorApplyTransformation} onErrorApplyTransformation Invoke just after the failure occurs,
	     *  before notify to respective observer. This method should transform the failure reason to the approprited one.
	     */
	    /**
	     * Constructor
	     * @param {Object} param The params
	     * @param {ResponseHandler~MetadataTransformer} transformMetadata Transform metadata when the SUCCESS is received.
	     * @param {Channel} channel The channel used to exchange messages
	     * @param {Logger} log The logger
	     * @param {ResponseHandler~Observer} observer Object which will be notified about errors
	     */
	    constructor({ transformMetadata, log, observer } = {}) {
	        this._pendingObservers = [];
	        this._log = log;
	        this._transformMetadata = transformMetadata || NO_OP_IDENTITY;
	        this._observer = Object.assign({
	            onObserversCountChange: NO_OP,
	            onError: NO_OP,
	            onFailure: NO_OP,
	            onErrorApplyTransformation: NO_OP_IDENTITY
	        }, observer);
	    }
	    get currentFailure() {
	        return this._currentFailure;
	    }
	    handleResponse(msg) {
	        const payload = msg.fields[0];
	        switch (msg.signature) {
	            case RECORD:
	                if (this._log.isDebugEnabled()) {
	                    this._log.debug(`S: RECORD ${stringify(msg)}`);
	                }
	                this._currentObserver.onNext(payload);
	                break;
	            case SUCCESS:
	                if (this._log.isDebugEnabled()) {
	                    this._log.debug(`S: SUCCESS ${stringify(msg)}`);
	                }
	                try {
	                    const metadata = this._transformMetadata(payload);
	                    this._currentObserver.onCompleted(metadata);
	                }
	                finally {
	                    this._updateCurrentObserver();
	                }
	                break;
	            case FAILURE:
	                if (this._log.isDebugEnabled()) {
	                    this._log.debug(`S: FAILURE ${stringify(msg)}`);
	                }
	                try {
	                    const standardizedCode = _standardizeCode(payload.code);
	                    const error = newError(payload.message, standardizedCode);
	                    this._currentFailure = this._observer.onErrorApplyTransformation(error);
	                    this._currentObserver.onError(this._currentFailure);
	                }
	                finally {
	                    this._updateCurrentObserver();
	                    // Things are now broken. Pending observers will get FAILURE messages routed until we are done handling this failure.
	                    this._observer.onFailure(this._currentFailure);
	                }
	                break;
	            case IGNORED:
	                if (this._log.isDebugEnabled()) {
	                    this._log.debug(`S: IGNORED ${stringify(msg)}`);
	                }
	                try {
	                    if (this._currentFailure && this._currentObserver.onError) {
	                        this._currentObserver.onError(this._currentFailure);
	                    }
	                    else if (this._currentObserver.onError) {
	                        this._currentObserver.onError(newError('Ignored either because of an error or RESET'));
	                    }
	                }
	                finally {
	                    this._updateCurrentObserver();
	                }
	                break;
	            default:
	                this._observer.onError(newError('Unknown Bolt protocol message: ' + msg));
	        }
	    }
	    /*
	     * Pop next pending observer form the list of observers and make it current observer.
	     * @protected
	     */
	    _updateCurrentObserver() {
	        this._currentObserver = this._pendingObservers.shift();
	        this._observer.onObserversCountChange(this._observersCount);
	    }
	    get _observersCount() {
	        return this._currentObserver == null ? this._pendingObservers.length : this._pendingObservers.length + 1;
	    }
	    _queueObserver(observer) {
	        observer = observer || NO_OP_OBSERVER;
	        observer.onCompleted = observer.onCompleted || NO_OP;
	        observer.onError = observer.onError || NO_OP;
	        observer.onNext = observer.onNext || NO_OP;
	        if (this._currentObserver === undefined) {
	            this._currentObserver = observer;
	        }
	        else {
	            this._pendingObservers.push(observer);
	        }
	        this._observer.onObserversCountChange(this._observersCount);
	        return true;
	    }
	    _notifyErrorToObservers(error) {
	        if (this._currentObserver && this._currentObserver.onError) {
	            this._currentObserver.onError(error);
	        }
	        while (this._pendingObservers.length > 0) {
	            const observer = this._pendingObservers.shift();
	            if (observer && observer.onError) {
	                observer.onError(error);
	            }
	        }
	    }
	    hasOngoingObservableRequests() {
	        return this._currentObserver != null || this._pendingObservers.length > 0;
	    }
	    _resetFailure() {
	        this._currentFailure = null;
	    }
	}
	/**
	 * Standardize error classification that are different between 5.x and previous versions.
	 *
	 * The transient error were clean-up for being retrieable and because of this
	 * `Terminated` and `LockClientStopped` were reclassified as `ClientError`.
	 *
	 * @param {string} code
	 * @returns {string} the standardized error code
	 */
	function _standardizeCode(code) {
	    if (code === 'Neo.TransientError.Transaction.Terminated') {
	        return 'Neo.ClientError.Transaction.Terminated';
	    }
	    else if (code === 'Neo.TransientError.Transaction.LockClientStopped') {
	        return 'Neo.ClientError.Transaction.LockClientStopped';
	    }
	    return code;
	}

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
	 * Creates a protocol with a given version
	 *
	 * @param {object} config
	 * @param {number} config.version The version of the protocol
	 * @param {channel} config.channel The channel
	 * @param {Chunker} config.chunker The chunker
	 * @param {Dechunker} config.dechunker The dechunker
	 * @param {Logger} config.log The logger
	 * @param {ResponseHandler~Observer} config.observer Observer
	 * @param {boolean} config.disableLosslessIntegers Disable the lossless integers
	 * @param {boolean} packstreamConfig.useBigInt if this connection should convert all received integers to native BigInt numbers.
	 * @param {boolean} config.serversideRouting It's using server side routing
	 */
	function create({ version, chunker, dechunker, channel, disableLosslessIntegers, useBigInt, serversideRouting, server, // server info
	log, observer } = {}) {
	    const createResponseHandler = protocol => {
	        const responseHandler = new ResponseHandler({
	            transformMetadata: protocol.transformMetadata.bind(protocol),
	            log,
	            observer
	        });
	        // reset the error handler to just handle errors and forget about the handshake promise
	        channel.onerror = observer.onError.bind(observer);
	        // Ok, protocol running. Simply forward all messages to the dechunker
	        channel.onmessage = buf => dechunker.write(buf);
	        // setup dechunker to dechunk messages and forward them to the message handler
	        dechunker.onmessage = buf => {
	            try {
	                responseHandler.handleResponse(protocol.unpack(buf));
	            }
	            catch (e) {
	                return observer.onError(e);
	            }
	        };
	        return responseHandler;
	    };
	    return createProtocol(version, server, chunker, { disableLosslessIntegers, useBigInt }, serversideRouting, createResponseHandler, observer.onProtocolError.bind(observer), log);
	}
	function createProtocol(version, server, chunker, packingConfig, serversideRouting, createResponseHandler, onProtocolError, log) {
	    switch (version) {
	        case 1:
	            return new BoltProtocol$d(server, chunker, packingConfig, createResponseHandler, log, onProtocolError);
	        case 2:
	            return new BoltProtocol$c(server, chunker, packingConfig, createResponseHandler, log, onProtocolError);
	        case 3:
	            return new BoltProtocol$b(server, chunker, packingConfig, createResponseHandler, log, onProtocolError);
	        case 4.0:
	            return new BoltProtocol$a(server, chunker, packingConfig, createResponseHandler, log, onProtocolError);
	        case 4.1:
	            return new BoltProtocol$9(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
	        case 4.2:
	            return new BoltProtocol$8(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
	        case 4.3:
	            return new BoltProtocol$7(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
	        case 4.4:
	            return new BoltProtocol$6(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
	        case 5.0:
	            return new BoltProtocol$5(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
	        case 5.1:
	            return new BoltProtocol$4(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
	        case 5.2:
	            return new BoltProtocol$3(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
	        case 5.3:
	            return new BoltProtocol$2(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
	        case 5.4:
	            return new BoltProtocol$1(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
	        default:
	            throw newError('Unknown Bolt protocol version: ' + version);
	    }
	}

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
	const BoltProtocol = BoltProtocol$7;
	const RawRoutingTable = RawRoutingTable$1;
	var Bolt = {
	    handshake,
	    create
	};

	var index$2 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		BoltProtocol: BoltProtocol,
		RawRoutingTable: RawRoutingTable,
		'default': Bolt,
		StreamObserver: StreamObserver,
		ResultStreamObserver: ResultStreamObserver,
		LoginObserver: LoginObserver,
		LogoffObserver: LogoffObserver,
		ResetObserver: ResetObserver,
		FailedObserver: FailedObserver,
		CompletedObserver: CompletedObserver,
		RouteObserver: RouteObserver,
		ProcedureRouteObserver: ProcedureRouteObserver,
		TelemetryObserver: TelemetryObserver
	});

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
	const DEFAULT_MAX_SIZE = 100;
	const DEFAULT_ACQUISITION_TIMEOUT = 60 * 1000; // 60 seconds
	class PoolConfig {
	    constructor(maxSize, acquisitionTimeout) {
	        this.maxSize = valueOrDefault(maxSize, DEFAULT_MAX_SIZE);
	        this.acquisitionTimeout = valueOrDefault(acquisitionTimeout, DEFAULT_ACQUISITION_TIMEOUT);
	    }
	    static defaultConfig() {
	        return new PoolConfig(DEFAULT_MAX_SIZE, DEFAULT_ACQUISITION_TIMEOUT);
	    }
	    static fromDriverConfig(config) {
	        const maxSizeConfigured = isConfigured(config.maxConnectionPoolSize);
	        const maxSize = maxSizeConfigured
	            ? config.maxConnectionPoolSize
	            : DEFAULT_MAX_SIZE;
	        const acquisitionTimeoutConfigured = isConfigured(config.connectionAcquisitionTimeout);
	        const acquisitionTimeout = acquisitionTimeoutConfigured
	            ? config.connectionAcquisitionTimeout
	            : DEFAULT_ACQUISITION_TIMEOUT;
	        return new PoolConfig(maxSize, acquisitionTimeout);
	    }
	}
	function valueOrDefault(value, defaultValue) {
	    return value === 0 || value ? value : defaultValue;
	}
	function isConfigured(value) {
	    return value === 0 || value;
	}

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
	const { logger: { Logger: Logger$1 } } = internal;
	class Pool {
	    /**
	     * @param {function(acquisitionContext: object, address: ServerAddress, function(address: ServerAddress, resource: object): Promise<object>): Promise<object>} create
	     *                an allocation function that creates a promise with a new resource. It's given an address for which to
	     *                allocate the connection and a function that will return the resource to the pool if invoked, which is
	     *                meant to be called on .dispose or .close or whatever mechanism the resource uses to finalize.
	     * @param {function(acquisitionContext: object, resource: object): boolean} validateOnAcquire
	     *                called at various times when an instance is acquired
	     *                If this returns false, the resource will be evicted
	     * @param {function(resource: object): boolean} validateOnRelease
	     *                called at various times when an instance is released
	     *                If this returns false, the resource will be evicted
	     * @param {function(resource: object): Promise<void>} destroy
	     *                called with the resource when it is evicted from this pool
	     * @param {function(resource: object, observer: { onError }): void} installIdleObserver
	     *                called when the resource is released back to pool
	     * @param {function(resource: object): void} removeIdleObserver
	     *                called when the resource is acquired from the pool
	     * @param {PoolConfig} config configuration for the new driver.
	     * @param {Logger} log the driver logger.
	     */
	    constructor({ create = (acquisitionContext, address, release) => Promise.resolve(), destroy = conn => Promise.resolve(), validateOnAcquire = (acquisitionContext, conn) => true, validateOnRelease = (conn) => true, installIdleObserver = (conn, observer) => { }, removeIdleObserver = conn => { }, config = PoolConfig.defaultConfig(), log = Logger$1.noOp() } = {}) {
	        this._create = create;
	        this._destroy = destroy;
	        this._validateOnAcquire = validateOnAcquire;
	        this._validateOnRelease = validateOnRelease;
	        this._installIdleObserver = installIdleObserver;
	        this._removeIdleObserver = removeIdleObserver;
	        this._maxSize = config.maxSize;
	        this._acquisitionTimeout = config.acquisitionTimeout;
	        this._pools = {};
	        this._pendingCreates = {};
	        this._acquireRequests = {};
	        this._activeResourceCounts = {};
	        this._release = this._release.bind(this);
	        this._log = log;
	        this._closed = false;
	    }
	    /**
	     * Acquire and idle resource fom the pool or create a new one.
	     * @param {object} acquisitionContext the acquisition context used for create and validateOnAcquire connection
	     * @param {ServerAddress} address the address for which we're acquiring.
	     * @param {object} config the config
	     * @param {boolean} config.requireNew Indicate it requires a new resource
	     * @return {Promise<Object>} resource that is ready to use.
	     */
	    acquire(acquisitionContext, address, config) {
	        const key = address.asKey();
	        // We're out of resources and will try to acquire later on when an existing resource is released.
	        const allRequests = this._acquireRequests;
	        const requests = allRequests[key];
	        if (!requests) {
	            allRequests[key] = [];
	        }
	        return new Promise((resolve, reject) => {
	            let request = null;
	            const timeoutId = setTimeout(() => {
	                // acquisition timeout fired
	                // remove request from the queue of pending requests, if it's still there
	                // request might've been taken out by the release operation
	                const pendingRequests = allRequests[key];
	                if (pendingRequests) {
	                    allRequests[key] = pendingRequests.filter(item => item !== request);
	                }
	                if (request.isCompleted()) ;
	                else {
	                    // request is still pending and needs to be failed
	                    const activeCount = this.activeResourceCount(address);
	                    const idleCount = this.has(address) ? this._pools[key].length : 0;
	                    request.reject(newError(`Connection acquisition timed out in ${this._acquisitionTimeout} ms. Pool status: Active conn count = ${activeCount}, Idle conn count = ${idleCount}.`));
	                }
	            }, this._acquisitionTimeout);
	            request = new PendingRequest(key, acquisitionContext, config, resolve, reject, timeoutId, this._log);
	            allRequests[key].push(request);
	            this._processPendingAcquireRequests(address);
	        });
	    }
	    /**
	     * Destroy all idle resources for the given address.
	     * @param {ServerAddress} address the address of the server to purge its pool.
	     * @returns {Promise<void>} A promise that is resolved when the resources are purged
	     */
	    purge(address) {
	        return this._purgeKey(address.asKey());
	    }
	    apply(address, resourceConsumer) {
	        const key = address.asKey();
	        if (key in this._pools) {
	            this._pools[key].apply(resourceConsumer);
	        }
	    }
	    /**
	     * Destroy all idle resources in this pool.
	     * @returns {Promise<void>} A promise that is resolved when the resources are purged
	     */
	    async close() {
	        this._closed = true;
	        /**
	         * The lack of Promise consuming was making the driver do not close properly in the scenario
	         * captured at result.test.js:it('should handle missing onCompleted'). The test was timing out
	         * because while wainting for the driver close.
	         *
	         * Consuming the Promise.all or by calling then or by awaiting in the result inside this method solved
	         * the issue somehow.
	         *
	         * PS: the return of this method was already awaited at PooledConnectionProvider.close, but the await bellow
	         * seems to be need also.
	         */
	        return await Promise.all(Object.keys(this._pools).map(key => this._purgeKey(key)));
	    }
	    /**
	     * Keep the idle resources for the provided addresses and purge the rest.
	     * @returns {Promise<void>} A promise that is resolved when the other resources are purged
	     */
	    keepAll(addresses) {
	        const keysToKeep = addresses.map(a => a.asKey());
	        const keysPresent = Object.keys(this._pools);
	        const keysToPurge = keysPresent.filter(k => keysToKeep.indexOf(k) === -1);
	        return Promise.all(keysToPurge.map(key => this._purgeKey(key)));
	    }
	    /**
	     * Check if this pool contains resources for the given address.
	     * @param {ServerAddress} address the address of the server to check.
	     * @return {boolean} `true` when pool contains entries for the given key, <code>false</code> otherwise.
	     */
	    has(address) {
	        return address.asKey() in this._pools;
	    }
	    /**
	     * Get count of active (checked out of the pool) resources for the given key.
	     * @param {ServerAddress} address the address of the server to check.
	     * @return {number} count of resources acquired by clients.
	     */
	    activeResourceCount(address) {
	        return this._activeResourceCounts[address.asKey()] || 0;
	    }
	    _getOrInitializePoolFor(key) {
	        let pool = this._pools[key];
	        if (!pool) {
	            pool = new SingleAddressPool();
	            this._pools[key] = pool;
	            this._pendingCreates[key] = 0;
	        }
	        return pool;
	    }
	    async _acquire(acquisitionContext, address, requireNew) {
	        if (this._closed) {
	            throw newError('Pool is closed, it is no more able to serve requests.');
	        }
	        const key = address.asKey();
	        const pool = this._getOrInitializePoolFor(key);
	        if (!requireNew) {
	            while (pool.length) {
	                const resource = pool.pop();
	                if (this._removeIdleObserver) {
	                    this._removeIdleObserver(resource);
	                }
	                if (await this._validateOnAcquire(acquisitionContext, resource)) {
	                    // idle resource is valid and can be acquired
	                    resourceAcquired(key, this._activeResourceCounts);
	                    if (this._log.isDebugEnabled()) {
	                        this._log.debug(`${resource} acquired from the pool ${key}`);
	                    }
	                    return { resource, pool };
	                }
	                else {
	                    pool.removeInUse(resource);
	                    await this._destroy(resource);
	                }
	            }
	        }
	        // Ensure requested max pool size
	        if (this._maxSize > 0) {
	            // Include pending creates when checking pool size since these probably will add
	            // to the number when fulfilled.
	            const numConnections = this.activeResourceCount(address) + this._pendingCreates[key];
	            if (numConnections >= this._maxSize) {
	                // Will put this request in queue instead since the pool is full
	                return { resource: null, pool };
	            }
	        }
	        // there exist no idle valid resources, create a new one for acquisition
	        // Keep track of how many pending creates there are to avoid making too many connections.
	        this._pendingCreates[key] = this._pendingCreates[key] + 1;
	        let resource;
	        try {
	            const numConnections = this.activeResourceCount(address) + pool.length;
	            if (numConnections >= this._maxSize && requireNew) {
	                const resource = pool.pop();
	                if (this._removeIdleObserver) {
	                    this._removeIdleObserver(resource);
	                }
	                pool.removeInUse(resource);
	                await this._destroy(resource);
	            }
	            // Invoke callback that creates actual connection
	            resource = await this._create(acquisitionContext, address, (address, resource) => this._release(address, resource, pool));
	            pool.pushInUse(resource);
	            resourceAcquired(key, this._activeResourceCounts);
	            if (this._log.isDebugEnabled()) {
	                this._log.debug(`${resource} created for the pool ${key}`);
	            }
	        }
	        finally {
	            this._pendingCreates[key] = this._pendingCreates[key] - 1;
	        }
	        return { resource, pool };
	    }
	    async _release(address, resource, pool) {
	        const key = address.asKey();
	        try {
	            if (pool.isActive()) {
	                // there exist idle connections for the given key
	                if (!await this._validateOnRelease(resource)) {
	                    if (this._log.isDebugEnabled()) {
	                        this._log.debug(`${resource} destroyed and can't be released to the pool ${key} because it is not functional`);
	                    }
	                    pool.removeInUse(resource);
	                    await this._destroy(resource);
	                }
	                else {
	                    if (this._installIdleObserver) {
	                        this._installIdleObserver(resource, {
	                            onError: error => {
	                                this._log.debug(`Idle connection ${resource} destroyed because of error: ${error}`);
	                                const pool = this._pools[key];
	                                if (pool) {
	                                    this._pools[key] = pool.filter(r => r !== resource);
	                                    pool.removeInUse(resource);
	                                }
	                                // let's not care about background clean-ups due to errors but just trigger the destroy
	                                // process for the resource, we especially catch any errors and ignore them to avoid
	                                // unhandled promise rejection warnings
	                                this._destroy(resource).catch(() => { });
	                            }
	                        });
	                    }
	                    pool.push(resource);
	                    if (this._log.isDebugEnabled()) {
	                        this._log.debug(`${resource} released to the pool ${key}`);
	                    }
	                }
	            }
	            else {
	                // key has been purged, don't put it back, just destroy the resource
	                if (this._log.isDebugEnabled()) {
	                    this._log.debug(`${resource} destroyed and can't be released to the pool ${key} because pool has been purged`);
	                }
	                pool.removeInUse(resource);
	                await this._destroy(resource);
	            }
	        }
	        finally {
	            resourceReleased(key, this._activeResourceCounts);
	            this._processPendingAcquireRequests(address);
	        }
	    }
	    async _purgeKey(key) {
	        const pool = this._pools[key];
	        const destructionList = [];
	        if (pool) {
	            while (pool.length) {
	                const resource = pool.pop();
	                if (this._removeIdleObserver) {
	                    this._removeIdleObserver(resource);
	                }
	                destructionList.push(this._destroy(resource));
	            }
	            pool.close();
	            delete this._pools[key];
	            await Promise.all(destructionList);
	        }
	    }
	    _processPendingAcquireRequests(address) {
	        const key = address.asKey();
	        const requests = this._acquireRequests[key];
	        if (requests) {
	            const pendingRequest = requests.shift(); // pop a pending acquire request
	            if (pendingRequest) {
	                this._acquire(pendingRequest.context, address, pendingRequest.requireNew)
	                    .catch(error => {
	                    // failed to acquire/create a new connection to resolve the pending acquire request
	                    // propagate the error by failing the pending request
	                    pendingRequest.reject(error);
	                    return { resource: null };
	                })
	                    .then(({ resource, pool }) => {
	                    if (resource) {
	                        // managed to acquire a valid resource from the pool
	                        if (pendingRequest.isCompleted()) {
	                            // request has been completed, most likely failed by a timeout
	                            // return the acquired resource back to the pool
	                            this._release(address, resource, pool);
	                        }
	                        else {
	                            // request is still pending and can be resolved with the newly acquired resource
	                            pendingRequest.resolve(resource); // resolve the pending request with the acquired resource
	                        }
	                    }
	                    else {
	                        // failed to acquire a valid resource from the pool
	                        // return the pending request back to the pool
	                        if (!pendingRequest.isCompleted()) {
	                            if (!this._acquireRequests[key]) {
	                                this._acquireRequests[key] = [];
	                            }
	                            this._acquireRequests[key].unshift(pendingRequest);
	                        }
	                    }
	                });
	            }
	            else {
	                delete this._acquireRequests[key];
	            }
	        }
	    }
	}
	/**
	 * Increment active (checked out of the pool) resource counter.
	 * @param {string} key the resource group identifier (server address for connections).
	 * @param {Object.<string, number>} activeResourceCounts the object holding active counts per key.
	 */
	function resourceAcquired(key, activeResourceCounts) {
	    const currentCount = activeResourceCounts[key] || 0;
	    activeResourceCounts[key] = currentCount + 1;
	}
	/**
	 * Decrement active (checked out of the pool) resource counter.
	 * @param {string} key the resource group identifier (server address for connections).
	 * @param {Object.<string, number>} activeResourceCounts the object holding active counts per key.
	 */
	function resourceReleased(key, activeResourceCounts) {
	    const currentCount = activeResourceCounts[key] || 0;
	    const nextCount = currentCount - 1;
	    if (nextCount > 0) {
	        activeResourceCounts[key] = nextCount;
	    }
	    else {
	        delete activeResourceCounts[key];
	    }
	}
	class PendingRequest {
	    constructor(key, context, config, resolve, reject, timeoutId, log) {
	        this._key = key;
	        this._context = context;
	        this._resolve = resolve;
	        this._reject = reject;
	        this._timeoutId = timeoutId;
	        this._log = log;
	        this._completed = false;
	        this._config = config || {};
	    }
	    get context() {
	        return this._context;
	    }
	    get requireNew() {
	        return this._config.requireNew || false;
	    }
	    isCompleted() {
	        return this._completed;
	    }
	    resolve(resource) {
	        if (this._completed) {
	            return;
	        }
	        this._completed = true;
	        clearTimeout(this._timeoutId);
	        if (this._log.isDebugEnabled()) {
	            this._log.debug(`${resource} acquired from the pool ${this._key}`);
	        }
	        this._resolve(resource);
	    }
	    reject(error) {
	        if (this._completed) {
	            return;
	        }
	        this._completed = true;
	        clearTimeout(this._timeoutId);
	        this._reject(error);
	    }
	}
	class SingleAddressPool {
	    constructor() {
	        this._active = true;
	        this._elements = [];
	        this._elementsInUse = new Set();
	    }
	    isActive() {
	        return this._active;
	    }
	    close() {
	        this._active = false;
	        this._elements = [];
	        this._elementsInUse = new Set();
	    }
	    filter(predicate) {
	        this._elements = this._elements.filter(predicate);
	        return this;
	    }
	    apply(resourceConsumer) {
	        this._elements.forEach(resourceConsumer);
	        this._elementsInUse.forEach(resourceConsumer);
	    }
	    get length() {
	        return this._elements.length;
	    }
	    pop() {
	        const element = this._elements.pop();
	        this._elementsInUse.add(element);
	        return element;
	    }
	    push(element) {
	        this._elementsInUse.delete(element);
	        return this._elements.push(element);
	    }
	    pushInUse(element) {
	        this._elementsInUse.add(element);
	    }
	    removeInUse(element) {
	        this._elementsInUse.delete(element);
	    }
	}

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

	var index$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': Pool,
		Pool: Pool,
		PoolConfig: PoolConfig,
		DEFAULT_ACQUISITION_TIMEOUT: DEFAULT_ACQUISITION_TIMEOUT,
		DEFAULT_MAX_SIZE: DEFAULT_MAX_SIZE
	});

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
	class SingleConnectionProvider extends ConnectionProvider {
	    constructor(connection) {
	        super();
	        this._connection = connection;
	    }
	    /**
	     * See {@link ConnectionProvider} for more information about this method and
	     * its arguments.
	     */
	    acquireConnection({ accessMode, database, bookmarks } = {}) {
	        const connection = this._connection;
	        this._connection = null;
	        return Promise.resolve(connection);
	    }
	}

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
	class Connection extends Connection$1 {
	    /**
	     * @param {ConnectionErrorHandler} errorHandler the error handler
	     */
	    constructor(errorHandler) {
	        super();
	        this._errorHandler = errorHandler;
	    }
	    get id() {
	        throw new Error('not implemented');
	    }
	    get databaseId() {
	        throw new Error('not implemented');
	    }
	    set databaseId(value) {
	        throw new Error('not implemented');
	    }
	    get authToken() {
	        throw new Error('not implemented');
	    }
	    set authToken(value) {
	        throw new Error('not implemented');
	    }
	    get supportsReAuth() {
	        throw new Error('not implemented');
	    }
	    get creationTimestamp() {
	        throw new Error('not implemented');
	    }
	    set idleTimestamp(value) {
	        throw new Error('not implemented');
	    }
	    get idleTimestamp() {
	        throw new Error('not implemented');
	    }
	    /**
	     * @returns {BoltProtocol} the underlying bolt protocol assigned to this connection
	     */
	    protocol() {
	        throw new Error('not implemented');
	    }
	    /**
	     * @returns {ServerAddress} the server address this connection is opened against
	     */
	    get address() {
	        throw new Error('not implemented');
	    }
	    /**
	     * @returns {ServerVersion} the version of the server this connection is connected to
	     */
	    get version() {
	        throw new Error('not implemented');
	    }
	    set version(value) {
	        throw new Error('not implemented');
	    }
	    get server() {
	        throw new Error('not implemented');
	    }
	    /**
	     * Connect to the target address, negotiate Bolt protocol and send initialization message.
	     * @param {string} userAgent the user agent for this driver.
	     * @param {Object} boltAgent the bolt agent for this driver.
	     * @param {Object} authToken the object containing auth information.
	     * @param {boolean} shouldWaitReAuth whether ot not the connection will wait for re-authentication to happen
	     * @return {Promise<Connection>} promise resolved with the current connection if connection is successful. Rejected promise otherwise.
	     */
	    connect(userAgent, boltAgent, authToken, shouldWaitReAuth) {
	        throw new Error('not implemented');
	    }
	    /**
	     * Write a message to the network channel.
	     * @param {RequestMessage} message the message to write.
	     * @param {ResultStreamObserver} observer the response observer.
	     * @param {boolean} flush `true` if flush should happen after the message is written to the buffer.
	     */
	    write(message, observer, flush) {
	        throw new Error('not implemented');
	    }
	    /**
	     * Call close on the channel.
	     * @returns {Promise<void>} - A promise that will be resolved when the connection is closed.
	     *
	     */
	    close() {
	        throw new Error('not implemented');
	    }
	    /**
	     *
	     * @param error
	     * @param address
	     * @returns {Neo4jError|*}
	     */
	    handleAndTransformError(error, address) {
	        if (this._errorHandler) {
	            return this._errorHandler.handleAndTransformError(error, address, this);
	        }
	        return error;
	    }
	}

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
	const { PROTOCOL_ERROR: PROTOCOL_ERROR$1 } = error;
	const { logger: { Logger } } = internal;
	let idGenerator = 0;
	/**
	 * Crete new connection to the provided address. Returned connection is not connected.
	 * @param {ServerAddress} address - the Bolt endpoint to connect to.
	 * @param {Object} config - the driver configuration.
	 * @param {ConnectionErrorHandler} errorHandler - the error handler for connection errors.
	 * @param {Logger} log - configured logger.
	 * @return {Connection} - new connection.
	 */
	function createChannelConnection(address, config, errorHandler, log, serversideRouting = null, createChannel = channelConfig => new Channel(channelConfig)) {
	    const channelConfig = new ChannelConfig(address, config, errorHandler.errorCode());
	    const channel = createChannel(channelConfig);
	    return Bolt.handshake(channel, log)
	        .then(({ protocolVersion: version, consumeRemainingBuffer }) => {
	        const chunker = new Chunker(channel);
	        const dechunker = new Dechunker();
	        const createProtocol = conn => Bolt.create({
	            version,
	            channel,
	            chunker,
	            dechunker,
	            disableLosslessIntegers: config.disableLosslessIntegers,
	            useBigInt: config.useBigInt,
	            serversideRouting,
	            server: conn.server,
	            log: conn.logger,
	            observer: {
	                onObserversCountChange: conn._handleOngoingRequestsNumberChange.bind(conn),
	                onError: conn._handleFatalError.bind(conn),
	                onFailure: conn._resetOnFailure.bind(conn),
	                onProtocolError: conn._handleProtocolError.bind(conn),
	                onErrorApplyTransformation: error => conn.handleAndTransformError(error, conn._address)
	            }
	        });
	        const connection = new ChannelConnection(channel, errorHandler, address, log, config.disableLosslessIntegers, serversideRouting, chunker, config.notificationFilter, createProtocol, config.telemetryDisabled);
	        // forward all pending bytes to the dechunker
	        consumeRemainingBuffer(buffer => dechunker.write(buffer));
	        return connection;
	    })
	        .catch(reason => channel.close().then(() => {
	        throw reason;
	    }));
	}
	class ChannelConnection extends Connection {
	    /**
	     * @constructor
	     * @param {Channel} channel - channel with a 'write' function and a 'onmessage' callback property.
	     * @param {ConnectionErrorHandler} errorHandler the error handler.
	     * @param {ServerAddress} address - the server address to connect to.
	     * @param {Logger} log - the configured logger.
	     * @param {boolean} disableLosslessIntegers if this connection should convert all received integers to native JS numbers.
	     * @param {Chunker} chunker the chunker
	     * @param protocolSupplier Bolt protocol supplier
	     */
	    constructor(channel, errorHandler, address, log, disableLosslessIntegers = false, serversideRouting = null, chunker, // to be removed,
	    notificationFilter, protocolSupplier, telemetryDisabled) {
	        super(errorHandler);
	        this._authToken = null;
	        this._idle = false;
	        this._reseting = false;
	        this._resetObservers = [];
	        this._id = idGenerator++;
	        this._address = address;
	        this._server = { address: address.asHostPort() };
	        this._creationTimestamp = Date.now();
	        this._disableLosslessIntegers = disableLosslessIntegers;
	        this._ch = channel;
	        this._chunker = chunker;
	        this._log = createConnectionLogger(this, log);
	        this._serversideRouting = serversideRouting;
	        this._notificationFilter = notificationFilter;
	        this._telemetryDisabledDriverConfig = telemetryDisabled === true;
	        this._telemetryDisabledConnection = true;
	        // connection from the database, returned in response for HELLO message and might not be available
	        this._dbConnectionId = null;
	        // bolt protocol is initially not initialized
	        /**
	         * @private
	         * @type {BoltProtocol}
	         */
	        this._protocol = protocolSupplier(this);
	        // Set to true on fatal errors, to get this out of connection pool.
	        this._isBroken = false;
	        if (this._log.isDebugEnabled()) {
	            this._log.debug(`created towards ${address}`);
	        }
	    }
	    beginTransaction(config) {
	        this._sendTelemetryIfEnabled(config);
	        return this._protocol.beginTransaction(config);
	    }
	    run(query, parameters, config) {
	        this._sendTelemetryIfEnabled(config);
	        return this._protocol.run(query, parameters, config);
	    }
	    _sendTelemetryIfEnabled(config) {
	        if (this._telemetryDisabledConnection ||
	            this._telemetryDisabledDriverConfig ||
	            config == null ||
	            config.apiTelemetryConfig == null) {
	            return;
	        }
	        this._protocol.telemetry({
	            api: config.apiTelemetryConfig.api
	        }, {
	            onCompleted: config.apiTelemetryConfig.onTelemetrySuccess,
	            onError: config.beforeError
	        });
	    }
	    commitTransaction(config) {
	        return this._protocol.commitTransaction(config);
	    }
	    rollbackTransaction(config) {
	        return this._protocol.rollbackTransaction(config);
	    }
	    getProtocolVersion() {
	        return this._protocol.version;
	    }
	    get authToken() {
	        return this._authToken;
	    }
	    set authToken(value) {
	        this._authToken = value;
	    }
	    get supportsReAuth() {
	        return this._protocol.supportsReAuth;
	    }
	    get id() {
	        return this._id;
	    }
	    get databaseId() {
	        return this._dbConnectionId;
	    }
	    set databaseId(value) {
	        this._dbConnectionId = value;
	    }
	    set idleTimestamp(value) {
	        this._idleTimestamp = value;
	    }
	    get idleTimestamp() {
	        return this._idleTimestamp;
	    }
	    get creationTimestamp() {
	        return this._creationTimestamp;
	    }
	    /**
	     * Send initialization message.
	     * @param {string} userAgent the user agent for this driver.
	     * @param {Object} boltAgent the bolt agent for this driver.
	     * @param {Object} authToken the object containing auth information.
	     * @param {boolean} waitReAuth whether ot not the connection will wait for re-authentication to happen
	     * @return {Promise<Connection>} promise resolved with the current connection if connection is successful. Rejected promise otherwise.
	     */
	    async connect(userAgent, boltAgent, authToken, waitReAuth) {
	        if (this._protocol.initialized && !this._protocol.supportsReAuth) {
	            throw newError('Connection does not support re-auth');
	        }
	        this._authToken = authToken;
	        if (!this._protocol.initialized) {
	            return await this._initialize(userAgent, boltAgent, authToken);
	        }
	        if (waitReAuth) {
	            return await new Promise((resolve, reject) => {
	                this._protocol.logoff({
	                    onError: reject
	                });
	                this._protocol.logon({
	                    authToken,
	                    onError: reject,
	                    onComplete: () => resolve(this),
	                    flush: true
	                });
	            });
	        }
	        this._protocol.logoff();
	        this._protocol.logon({ authToken, flush: true });
	        return this;
	    }
	    /**
	     * Perform protocol-specific initialization which includes authentication.
	     * @param {string} userAgent the user agent for this driver.
	     * @param {string} boltAgent the bolt agent for this driver.
	     * @param {Object} authToken the object containing auth information.
	     * @return {Promise<Connection>} promise resolved with the current connection if initialization is successful. Rejected promise otherwise.
	     */
	    _initialize(userAgent, boltAgent, authToken) {
	        const self = this;
	        return new Promise((resolve, reject) => {
	            this._protocol.initialize({
	                userAgent,
	                boltAgent,
	                authToken,
	                notificationFilter: this._notificationFilter,
	                onError: err => reject(err),
	                onComplete: metadata => {
	                    if (metadata) {
	                        // read server version from the response metadata, if it is available
	                        const serverVersion = metadata.server;
	                        if (!this.version || serverVersion) {
	                            this.version = serverVersion;
	                        }
	                        // read database connection id from the response metadata, if it is available
	                        const dbConnectionId = metadata.connection_id;
	                        if (!this.databaseId) {
	                            this.databaseId = dbConnectionId;
	                        }
	                        if (metadata.hints) {
	                            const receiveTimeoutRaw = metadata.hints['connection.recv_timeout_seconds'];
	                            if (receiveTimeoutRaw !== null &&
	                                receiveTimeoutRaw !== undefined) {
	                                const receiveTimeoutInSeconds = toNumber(receiveTimeoutRaw);
	                                if (Number.isInteger(receiveTimeoutInSeconds) &&
	                                    receiveTimeoutInSeconds > 0) {
	                                    this._ch.setupReceiveTimeout(receiveTimeoutInSeconds * 1000);
	                                }
	                                else {
	                                    this._log.info(`Server located at ${this._address} supplied an invalid connection receive timeout value (${receiveTimeoutInSeconds}). ` +
	                                        'Please, verify the server configuration and status because this can be the symptom of a bigger issue.');
	                                }
	                            }
	                            const telemetryEnabledHint = metadata.hints['telemetry.enabled'];
	                            if (telemetryEnabledHint === true) {
	                                this._telemetryDisabledConnection = false;
	                            }
	                        }
	                    }
	                    resolve(self);
	                }
	            });
	        });
	    }
	    /**
	     * Get the Bolt protocol for the connection.
	     * @return {BoltProtocol} the protocol.
	     */
	    protocol() {
	        return this._protocol;
	    }
	    get address() {
	        return this._address;
	    }
	    /**
	     * Get the version of the connected server.
	     * Available only after initialization
	     *
	     * @returns {ServerVersion} version
	     */
	    get version() {
	        return this._server.version;
	    }
	    set version(value) {
	        this._server.version = value;
	    }
	    get server() {
	        return this._server;
	    }
	    get logger() {
	        return this._log;
	    }
	    /**
	     * "Fatal" means the connection is dead. Only call this if something
	     * happens that cannot be recovered from. This will lead to all subscribers
	     * failing, and the connection getting ejected from the session pool.
	     *
	     * @param error an error object, forwarded to all current and future subscribers
	     */
	    _handleFatalError(error) {
	        this._isBroken = true;
	        this._error = this.handleAndTransformError(this._protocol.currentFailure || error, this._address);
	        if (this._log.isErrorEnabled()) {
	            this._log.error(`experienced a fatal error caused by ${this._error} (${stringify(this._error)})`);
	        }
	        this._protocol.notifyFatalError(this._error);
	    }
	    /**
	     * This method is used by the {@link PooledConnectionProvider}
	     *
	     * @param {any} observer
	     */
	    _setIdle(observer) {
	        this._idle = true;
	        this._ch.stopReceiveTimeout();
	        this._protocol.queueObserverIfProtocolIsNotBroken(observer);
	    }
	    /**
	     * This method is used by the {@link PooledConnectionProvider}
	     */
	    _unsetIdle() {
	        this._idle = false;
	        this._updateCurrentObserver();
	    }
	    /**
	     * This method still here because of the connection-channel.tests.js
	     *
	     * @param {any} observer
	     */
	    _queueObserver(observer) {
	        return this._protocol.queueObserverIfProtocolIsNotBroken(observer);
	    }
	    hasOngoingObservableRequests() {
	        return !this._idle && this._protocol.hasOngoingObservableRequests();
	    }
	    /**
	     * Send a RESET-message to the database. Message is immediately flushed to the network.
	     * @return {Promise<void>} promise resolved when SUCCESS-message response arrives, or failed when other response messages arrives.
	     */
	    resetAndFlush() {
	        return new Promise((resolve, reject) => {
	            this._reset({
	                onError: error => {
	                    if (this._isBroken) {
	                        // handling a fatal error, no need to raise a protocol violation
	                        reject(error);
	                    }
	                    else {
	                        const neo4jError = this._handleProtocolError('Received FAILURE as a response for RESET: ' + error);
	                        reject(neo4jError);
	                    }
	                },
	                onComplete: () => {
	                    resolve();
	                }
	            });
	        });
	    }
	    _resetOnFailure() {
	        if (!this.isOpen()) {
	            return;
	        }
	        this._reset({
	            onError: () => {
	                this._protocol.resetFailure();
	            },
	            onComplete: () => {
	                this._protocol.resetFailure();
	            }
	        });
	    }
	    _reset(observer) {
	        if (this._reseting) {
	            if (!this._protocol.isLastMessageReset()) {
	                this._protocol.reset({
	                    onError: error => {
	                        observer.onError(error);
	                    },
	                    onComplete: () => {
	                        observer.onComplete();
	                    }
	                });
	            }
	            else {
	                this._resetObservers.push(observer);
	            }
	            return;
	        }
	        this._resetObservers.push(observer);
	        this._reseting = true;
	        const notifyFinish = (notify) => {
	            this._reseting = false;
	            const observers = this._resetObservers;
	            this._resetObservers = [];
	            observers.forEach(notify);
	        };
	        this._protocol.reset({
	            onError: error => {
	                notifyFinish(obs => obs.onError(error));
	            },
	            onComplete: () => {
	                notifyFinish(obs => obs.onComplete());
	            }
	        });
	    }
	    /*
	     * Pop next pending observer form the list of observers and make it current observer.
	     * @protected
	     */
	    _updateCurrentObserver() {
	        this._protocol.updateCurrentObserver();
	    }
	    /** Check if this connection is in working condition */
	    isOpen() {
	        return !this._isBroken && this._ch._open;
	    }
	    /**
	     * Starts and stops the receive timeout timer.
	     * @param {number} requestsNumber Ongoing requests number
	     */
	    _handleOngoingRequestsNumberChange(requestsNumber) {
	        if (this._idle) {
	            return;
	        }
	        if (requestsNumber === 0) {
	            this._ch.stopReceiveTimeout();
	        }
	        else {
	            this._ch.startReceiveTimeout();
	        }
	    }
	    /**
	     * Call close on the channel.
	     * @returns {Promise<void>} - A promise that will be resolved when the underlying channel is closed.
	     */
	    async close() {
	        if (this._log.isDebugEnabled()) {
	            this._log.debug('closing');
	        }
	        if (this._protocol && this.isOpen()) {
	            // protocol has been initialized and this connection is healthy
	            // notify the database about the upcoming close of the connection
	            this._protocol.prepareToClose();
	        }
	        await this._ch.close();
	        if (this._log.isDebugEnabled()) {
	            this._log.debug('closed');
	        }
	    }
	    toString() {
	        return `Connection [${this.id}][${this.databaseId || ''}]`;
	    }
	    _handleProtocolError(message) {
	        this._protocol.resetFailure();
	        this._updateCurrentObserver();
	        const error = newError(message, PROTOCOL_ERROR$1);
	        this._handleFatalError(error);
	        return error;
	    }
	}
	/**
	 * Creates a log with the connection info as prefix
	 * @param {Connection} connection The connection
	 * @param {Logger} logger The logger
	 * @returns {Logger} The new logger with enriched messages
	 */
	function createConnectionLogger(connection, logger) {
	    return new Logger(logger._level, (level, message) => logger._loggerFunction(level, `${connection} ${message}`));
	}

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
	class DelegateConnection extends Connection {
	    /**
	     * @param delegate {Connection} the delegated connection
	     * @param errorHandler {ConnectionErrorHandler} the error handler
	     */
	    constructor(delegate, errorHandler) {
	        super(errorHandler);
	        if (errorHandler) {
	            this._originalErrorHandler = delegate._errorHandler;
	            delegate._errorHandler = this._errorHandler;
	        }
	        this._delegate = delegate;
	    }
	    beginTransaction(config) {
	        return this._delegate.beginTransaction(config);
	    }
	    run(query, param, config) {
	        return this._delegate.run(query, param, config);
	    }
	    commitTransaction(config) {
	        return this._delegate.commitTransaction(config);
	    }
	    rollbackTransaction(config) {
	        return this._delegate.rollbackTransaction(config);
	    }
	    getProtocolVersion() {
	        return this._delegate.getProtocolVersion();
	    }
	    get id() {
	        return this._delegate.id;
	    }
	    get databaseId() {
	        return this._delegate.databaseId;
	    }
	    set databaseId(value) {
	        this._delegate.databaseId = value;
	    }
	    get server() {
	        return this._delegate.server;
	    }
	    get authToken() {
	        return this._delegate.authToken;
	    }
	    get supportsReAuth() {
	        return this._delegate.supportsReAuth;
	    }
	    set authToken(value) {
	        this._delegate.authToken = value;
	    }
	    get address() {
	        return this._delegate.address;
	    }
	    get version() {
	        return this._delegate.version;
	    }
	    set version(value) {
	        this._delegate.version = value;
	    }
	    get creationTimestamp() {
	        return this._delegate.creationTimestamp;
	    }
	    set idleTimestamp(value) {
	        this._delegate.idleTimestamp = value;
	    }
	    get idleTimestamp() {
	        return this._delegate.idleTimestamp;
	    }
	    isOpen() {
	        return this._delegate.isOpen();
	    }
	    protocol() {
	        return this._delegate.protocol();
	    }
	    connect(userAgent, boltAgent, authToken, waitReAuth) {
	        return this._delegate.connect(userAgent, boltAgent, authToken, waitReAuth);
	    }
	    write(message, observer, flush) {
	        return this._delegate.write(message, observer, flush);
	    }
	    resetAndFlush() {
	        return this._delegate.resetAndFlush();
	    }
	    hasOngoingObservableRequests() {
	        return this._delegate.hasOngoingObservableRequests();
	    }
	    close() {
	        return this._delegate.close();
	    }
	    release() {
	        if (this._originalErrorHandler) {
	            this._delegate._errorHandler = this._originalErrorHandler;
	        }
	        return this._delegate.release();
	    }
	}

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
	const { SERVICE_UNAVAILABLE: SERVICE_UNAVAILABLE$3, SESSION_EXPIRED: SESSION_EXPIRED$1 } = error;
	class ConnectionErrorHandler {
	    constructor(errorCode, handleUnavailability, handleWriteFailure, handleSecurityError) {
	        this._errorCode = errorCode;
	        this._handleUnavailability = handleUnavailability || noOpHandler;
	        this._handleWriteFailure = handleWriteFailure || noOpHandler;
	        this._handleSecurityError = handleSecurityError || noOpHandler;
	    }
	    static create({ errorCode, handleUnavailability, handleWriteFailure, handleSecurityError }) {
	        return new ConnectionErrorHandler(errorCode, handleUnavailability, handleWriteFailure, handleSecurityError);
	    }
	    /**
	     * Error code to use for network errors.
	     * @return {string} the error code.
	     */
	    errorCode() {
	        return this._errorCode;
	    }
	    /**
	     * Handle and transform the error.
	     * @param {Neo4jError} error the original error.
	     * @param {ServerAddress} address the address of the connection where the error happened.
	     * @return {Neo4jError} new error that should be propagated to the user.
	     */
	    handleAndTransformError(error, address, connection) {
	        if (isSecurityError(error)) {
	            return this._handleSecurityError(error, address, connection);
	        }
	        if (isAvailabilityError(error)) {
	            return this._handleUnavailability(error, address, connection);
	        }
	        if (isFailureToWrite(error)) {
	            return this._handleWriteFailure(error, address, connection);
	        }
	        return error;
	    }
	}
	function isSecurityError(error) {
	    return error != null &&
	        error.code != null &&
	        error.code.startsWith('Neo.ClientError.Security.');
	}
	function isAvailabilityError(error) {
	    if (error) {
	        return (error.code === SESSION_EXPIRED$1 ||
	            error.code === SERVICE_UNAVAILABLE$3 ||
	            error.code === 'Neo.TransientError.General.DatabaseUnavailable');
	    }
	    return false;
	}
	function isFailureToWrite(error) {
	    if (error) {
	        return (error.code === 'Neo.ClientError.Cluster.NotALeader' ||
	            error.code === 'Neo.ClientError.General.ForbiddenOnReadOnlyDatabase');
	    }
	    return false;
	}
	function noOpHandler(error) {
	    return error;
	}

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
	 * Class which provides Authorization for {@link Connection}
	 */
	class AuthenticationProvider {
	    constructor({ authTokenManager, userAgent, boltAgent }) {
	        this._authTokenManager = authTokenManager || staticAuthTokenManager({});
	        this._userAgent = userAgent;
	        this._boltAgent = boltAgent;
	    }
	    async authenticate({ connection, auth, skipReAuth, waitReAuth, forceReAuth }) {
	        if (auth != null) {
	            const shouldReAuth = connection.supportsReAuth === true && ((!equals(connection.authToken, auth) && skipReAuth !== true) ||
	                forceReAuth === true);
	            if (connection.authToken == null || shouldReAuth) {
	                return await connection.connect(this._userAgent, this._boltAgent, auth, waitReAuth || false);
	            }
	            return connection;
	        }
	        const authToken = await this._authTokenManager.getToken();
	        if (!equals(authToken, connection.authToken)) {
	            return await connection.connect(this._userAgent, this._boltAgent, authToken, false);
	        }
	        return connection;
	    }
	    handleError({ connection, code }) {
	        if (connection &&
	            code.startsWith('Neo.ClientError.Security.')) {
	            return this._authTokenManager.handleSecurityException(connection.authToken, code);
	        }
	        return false;
	    }
	}

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
	class LivenessCheckProvider {
	    constructor({ connectionLivenessCheckTimeout }) {
	        this._connectionLivenessCheckTimeout = connectionLivenessCheckTimeout;
	    }
	    /**
	     * Checks connection liveness with configured params.
	     *
	     * @param {Connection} connection
	     * @returns {Promise<true>} If liveness checks succeed, throws otherwise
	     */
	    async check(connection) {
	        if (this._isCheckDisabled || this._isNewlyCreatedConnection(connection)) {
	            return true;
	        }
	        const idleFor = Date.now() - connection.idleTimestamp;
	        if (this._connectionLivenessCheckTimeout === 0 ||
	            idleFor > this._connectionLivenessCheckTimeout) {
	            return await connection.resetAndFlush()
	                .then(() => true);
	        }
	        return true;
	    }
	    get _isCheckDisabled() {
	        return this._connectionLivenessCheckTimeout == null || this._connectionLivenessCheckTimeout < 0;
	    }
	    _isNewlyCreatedConnection(connection) {
	        return connection.authToken == null;
	    }
	}

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
	const { SERVICE_UNAVAILABLE: SERVICE_UNAVAILABLE$2 } = error;
	const AUTHENTICATION_ERRORS = [
	    'Neo.ClientError.Security.CredentialsExpired',
	    'Neo.ClientError.Security.Forbidden',
	    'Neo.ClientError.Security.TokenExpired',
	    'Neo.ClientError.Security.Unauthorized'
	];
	class PooledConnectionProvider extends ConnectionProvider {
	    constructor({ id, config, log, userAgent, boltAgent, authTokenManager, newPool = (...args) => new Pool(...args) }, createChannelConnectionHook = null) {
	        super();
	        this._id = id;
	        this._config = config;
	        this._log = log;
	        this._authenticationProvider = new AuthenticationProvider({ authTokenManager, userAgent, boltAgent });
	        this._livenessCheckProvider = new LivenessCheckProvider({ connectionLivenessCheckTimeout: config.connectionLivenessCheckTimeout });
	        this._userAgent = userAgent;
	        this._boltAgent = boltAgent;
	        this._createChannelConnection =
	            createChannelConnectionHook ||
	                (address => {
	                    return createChannelConnection(address, this._config, this._createConnectionErrorHandler(), this._log);
	                });
	        this._connectionPool = newPool({
	            create: this._createConnection.bind(this),
	            destroy: this._destroyConnection.bind(this),
	            validateOnAcquire: this._validateConnectionOnAcquire.bind(this),
	            validateOnRelease: this._validateConnectionOnRelease.bind(this),
	            installIdleObserver: PooledConnectionProvider._installIdleObserverOnConnection.bind(this),
	            removeIdleObserver: PooledConnectionProvider._removeIdleObserverOnConnection.bind(this),
	            config: PoolConfig.fromDriverConfig(config),
	            log: this._log
	        });
	        this._openConnections = {};
	    }
	    _createConnectionErrorHandler() {
	        return new ConnectionErrorHandler(SERVICE_UNAVAILABLE$2);
	    }
	    /**
	     * Create a new connection and initialize it.
	     * @return {Promise<Connection>} promise resolved with a new connection or rejected when failed to connect.
	     * @access private
	     */
	    _createConnection({ auth }, address, release) {
	        return this._createChannelConnection(address).then(connection => {
	            connection.release = () => {
	                connection.idleTimestamp = Date.now();
	                return release(address, connection);
	            };
	            this._openConnections[connection.id] = connection;
	            return this._authenticationProvider.authenticate({ connection, auth })
	                .catch(error => {
	                // let's destroy this connection
	                this._destroyConnection(connection);
	                // propagate the error because connection failed to connect / initialize
	                throw error;
	            });
	        });
	    }
	    async _validateConnectionOnAcquire({ auth, skipReAuth }, conn) {
	        if (!this._validateConnection(conn)) {
	            return false;
	        }
	        try {
	            await this._livenessCheckProvider.check(conn);
	        }
	        catch (error) {
	            this._log.debug(`The connection ${conn.id} is not alive because of an error ${error.code} '${error.message}'`);
	            return false;
	        }
	        try {
	            await this._authenticationProvider.authenticate({ connection: conn, auth, skipReAuth });
	            return true;
	        }
	        catch (error) {
	            this._log.debug(`The connection ${conn.id} is not valid because of an error ${error.code} '${error.message}'`);
	            return false;
	        }
	    }
	    _validateConnectionOnRelease(conn) {
	        return conn._sticky !== true && this._validateConnection(conn);
	    }
	    /**
	     * Check that a connection is usable
	     * @return {boolean} true if the connection is open
	     * @access private
	     **/
	    _validateConnection(conn) {
	        if (!conn.isOpen()) {
	            return false;
	        }
	        const maxConnectionLifetime = this._config.maxConnectionLifetime;
	        const lifetime = Date.now() - conn.creationTimestamp;
	        if (lifetime > maxConnectionLifetime) {
	            return false;
	        }
	        return true;
	    }
	    /**
	     * Dispose of a connection.
	     * @return {Connection} the connection to dispose.
	     * @access private
	     */
	    _destroyConnection(conn) {
	        delete this._openConnections[conn.id];
	        return conn.close();
	    }
	    /**
	     * Acquire a connection from the pool and return it ServerInfo
	     * @param {object} param
	     * @param {string} param.address the server address
	     * @return {Promise<ServerInfo>} the server info
	     */
	    async _verifyConnectivityAndGetServerVersion({ address }) {
	        const connection = await this._connectionPool.acquire({}, address);
	        const serverInfo = new ServerInfo(connection.server, connection.protocol().version);
	        try {
	            if (!connection.protocol().isLastMessageLogon()) {
	                await connection.resetAndFlush();
	            }
	        }
	        finally {
	            await connection.release();
	        }
	        return serverInfo;
	    }
	    async _verifyAuthentication({ getAddress, auth }) {
	        const connectionsToRelease = [];
	        try {
	            const address = await getAddress();
	            const connection = await this._connectionPool.acquire({ auth, skipReAuth: true }, address);
	            connectionsToRelease.push(connection);
	            const lastMessageIsNotLogin = !connection.protocol().isLastMessageLogon();
	            if (!connection.supportsReAuth) {
	                throw newError('Driver is connected to a database that does not support user switch.');
	            }
	            if (lastMessageIsNotLogin && connection.supportsReAuth) {
	                await this._authenticationProvider.authenticate({ connection, auth, waitReAuth: true, forceReAuth: true });
	            }
	            else if (lastMessageIsNotLogin && !connection.supportsReAuth) {
	                const stickyConnection = await this._connectionPool.acquire({ auth }, address, { requireNew: true });
	                stickyConnection._sticky = true;
	                connectionsToRelease.push(stickyConnection);
	            }
	            return true;
	        }
	        catch (error) {
	            if (AUTHENTICATION_ERRORS.includes(error.code)) {
	                return false;
	            }
	            throw error;
	        }
	        finally {
	            await Promise.all(connectionsToRelease.map(conn => conn.release()));
	        }
	    }
	    async _verifyStickyConnection({ auth, connection, address }) {
	        const connectionWithSameCredentials = equals(auth, connection.authToken);
	        const shouldCreateStickyConnection = !connectionWithSameCredentials;
	        connection._sticky = connectionWithSameCredentials && !connection.supportsReAuth;
	        if (shouldCreateStickyConnection || connection._sticky) {
	            await connection.release();
	            throw newError('Driver is connected to a database that does not support user switch.');
	        }
	    }
	    async close() {
	        // purge all idle connections in the connection pool
	        await this._connectionPool.close();
	        // then close all connections driver has ever created
	        // it is needed to close connections that are active right now and are acquired from the pool
	        await Promise.all(Object.values(this._openConnections).map(c => c.close()));
	    }
	    static _installIdleObserverOnConnection(conn, observer) {
	        conn._setIdle(observer);
	    }
	    static _removeIdleObserverOnConnection(conn) {
	        conn._unsetIdle();
	    }
	    _handleSecurityError(error, address, connection) {
	        const handled = this._authenticationProvider.handleError({ connection, code: error.code });
	        if (handled) {
	            error.retriable = true;
	        }
	        if (error.code === 'Neo.ClientError.Security.AuthorizationExpired') {
	            this._connectionPool.apply(address, (conn) => { conn.authToken = null; });
	        }
	        if (connection) {
	            connection.close().catch(() => undefined);
	        }
	        return error;
	    }
	}

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
	const { constants: { BOLT_PROTOCOL_V3: BOLT_PROTOCOL_V3$1, BOLT_PROTOCOL_V4_0: BOLT_PROTOCOL_V4_0$1, BOLT_PROTOCOL_V4_4: BOLT_PROTOCOL_V4_4$1, BOLT_PROTOCOL_V5_1: BOLT_PROTOCOL_V5_1$1 } } = internal;
	const { SERVICE_UNAVAILABLE: SERVICE_UNAVAILABLE$1 } = error;
	class DirectConnectionProvider extends PooledConnectionProvider {
	    constructor({ id, config, log, address, userAgent, boltAgent, authTokenManager, newPool }) {
	        super({ id, config, log, userAgent, boltAgent, authTokenManager, newPool });
	        this._address = address;
	    }
	    /**
	     * See {@link ConnectionProvider} for more information about this method and
	     * its arguments.
	     */
	    async acquireConnection({ accessMode, database, bookmarks, auth, forceReAuth } = {}) {
	        const databaseSpecificErrorHandler = ConnectionErrorHandler.create({
	            errorCode: SERVICE_UNAVAILABLE$1,
	            handleSecurityError: (error, address, conn) => this._handleSecurityError(error, address, conn, database)
	        });
	        const connection = await this._connectionPool.acquire({ auth, forceReAuth }, this._address);
	        if (auth) {
	            await this._verifyStickyConnection({
	                auth,
	                connection,
	                address: this._address
	            });
	            return connection;
	        }
	        return new DelegateConnection(connection, databaseSpecificErrorHandler);
	    }
	    _handleSecurityError(error, address, connection, database) {
	        this._log.warn(`Direct driver ${this._id} will close connection to ${address} for database '${database}' because of an error ${error.code} '${error.message}'`);
	        return super._handleSecurityError(error, address, connection);
	    }
	    async _hasProtocolVersion(versionPredicate) {
	        const connection = await createChannelConnection(this._address, this._config, this._createConnectionErrorHandler(), this._log);
	        const protocolVersion = connection.protocol()
	            ? connection.protocol().version
	            : null;
	        await connection.close();
	        if (protocolVersion) {
	            return versionPredicate(protocolVersion);
	        }
	        return false;
	    }
	    async supportsMultiDb() {
	        return await this._hasProtocolVersion(version => version >= BOLT_PROTOCOL_V4_0$1);
	    }
	    getNegotiatedProtocolVersion() {
	        return new Promise((resolve, reject) => {
	            this._hasProtocolVersion(resolve)
	                .catch(reject);
	        });
	    }
	    async supportsTransactionConfig() {
	        return await this._hasProtocolVersion(version => version >= BOLT_PROTOCOL_V3$1);
	    }
	    async supportsUserImpersonation() {
	        return await this._hasProtocolVersion(version => version >= BOLT_PROTOCOL_V4_4$1);
	    }
	    async supportsSessionAuth() {
	        return await this._hasProtocolVersion(version => version >= BOLT_PROTOCOL_V5_1$1);
	    }
	    async verifyAuthentication({ auth }) {
	        return this._verifyAuthentication({
	            auth,
	            getAddress: () => this._address
	        });
	    }
	    async verifyConnectivityAndGetServerInfo() {
	        return await this._verifyConnectivityAndGetServerVersion({ address: this._address });
	    }
	}

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
	const { constants: { ACCESS_MODE_WRITE: WRITE$1, ACCESS_MODE_READ: READ$1 }, serverAddress: { ServerAddress } } = internal;
	const { PROTOCOL_ERROR } = error;
	const MIN_ROUTERS = 1;
	/**
	 * The routing table object used to determine the role of the servers in the driver.
	 */
	class RoutingTable {
	    constructor({ database, routers, readers, writers, expirationTime, ttl } = {}) {
	        this.database = database || null;
	        this.databaseName = database || 'default database';
	        this.routers = routers || [];
	        this.readers = readers || [];
	        this.writers = writers || [];
	        this.expirationTime = expirationTime || int(0);
	        this.ttl = ttl;
	    }
	    /**
	     * Create a valid routing table from a raw object
	     *
	     * @param {string} database the database name. It is used for logging purposes
	     * @param {ServerAddress} routerAddress The router address, it is used for loggin purposes
	     * @param {RawRoutingTable} rawRoutingTable Method used to get the raw routing table to be processed
	     * @param {RoutingTable} The valid Routing Table
	     */
	    static fromRawRoutingTable(database, routerAddress, rawRoutingTable) {
	        return createValidRoutingTable(database, routerAddress, rawRoutingTable);
	    }
	    forget(address) {
	        // Don't remove it from the set of routers, since that might mean we lose our ability to re-discover,
	        // just remove it from the set of readers and writers, so that we don't use it for actual work without
	        // performing discovery first.
	        this.readers = removeFromArray(this.readers, address);
	        this.writers = removeFromArray(this.writers, address);
	    }
	    forgetRouter(address) {
	        this.routers = removeFromArray(this.routers, address);
	    }
	    forgetWriter(address) {
	        this.writers = removeFromArray(this.writers, address);
	    }
	    /**
	     * Check if this routing table is fresh to perform the required operation.
	     * @param {string} accessMode the type of operation. Allowed values are {@link READ} and {@link WRITE}.
	     * @return {boolean} `true` when this table contains servers to serve the required operation, `false` otherwise.
	     */
	    isStaleFor(accessMode) {
	        return (this.expirationTime.lessThan(Date.now()) ||
	            this.routers.length < MIN_ROUTERS ||
	            (accessMode === READ$1 && this.readers.length === 0) ||
	            (accessMode === WRITE$1 && this.writers.length === 0));
	    }
	    /**
	     * Check if this routing table is expired for specified amount of duration
	     *
	     * @param {Integer} duration amount of duration in milliseconds to check for expiration
	     * @returns {boolean}
	     */
	    isExpiredFor(duration) {
	        return this.expirationTime.add(duration).lessThan(Date.now());
	    }
	    allServers() {
	        return [...this.routers, ...this.readers, ...this.writers];
	    }
	    toString() {
	        return ('RoutingTable[' +
	            `database=${this.databaseName}, ` +
	            `expirationTime=${this.expirationTime}, ` +
	            `currentTime=${Date.now()}, ` +
	            `routers=[${this.routers}], ` +
	            `readers=[${this.readers}], ` +
	            `writers=[${this.writers}]]`);
	    }
	}
	/**
	 * Remove all occurrences of the element in the array.
	 * @param {Array} array the array to filter.
	 * @param {Object} element the element to remove.
	 * @return {Array} new filtered array.
	 */
	function removeFromArray(array, element) {
	    return array.filter(item => item.asKey() !== element.asKey());
	}
	/**
	 * Create a valid routing table from a raw object
	 *
	 * @param {string} db the database name. It is used for logging purposes
	 * @param {ServerAddress} routerAddress The router address, it is used for loggin purposes
	 * @param {RawRoutingTable} rawRoutingTable Method used to get the raw routing table to be processed
	 * @param {RoutingTable} The valid Routing Table
	 */
	function createValidRoutingTable(database, routerAddress, rawRoutingTable) {
	    const ttl = rawRoutingTable.ttl;
	    const expirationTime = calculateExpirationTime(rawRoutingTable, routerAddress);
	    const { routers, readers, writers } = parseServers(rawRoutingTable, routerAddress);
	    assertNonEmpty(routers, 'routers', routerAddress);
	    assertNonEmpty(readers, 'readers', routerAddress);
	    return new RoutingTable({
	        database: database || rawRoutingTable.db,
	        routers,
	        readers,
	        writers,
	        expirationTime,
	        ttl
	    });
	}
	/**
	 * Parse server from the RawRoutingTable.
	 *
	 * @param {RawRoutingTable} rawRoutingTable the raw routing table
	 * @param {string} routerAddress the router address
	 * @returns {Object} The object with the list of routers, readers and writers
	 */
	function parseServers(rawRoutingTable, routerAddress) {
	    try {
	        let routers = [];
	        let readers = [];
	        let writers = [];
	        rawRoutingTable.servers.forEach(server => {
	            const role = server.role;
	            const addresses = server.addresses;
	            if (role === 'ROUTE') {
	                routers = parseArray(addresses).map(address => ServerAddress.fromUrl(address));
	            }
	            else if (role === 'WRITE') {
	                writers = parseArray(addresses).map(address => ServerAddress.fromUrl(address));
	            }
	            else if (role === 'READ') {
	                readers = parseArray(addresses).map(address => ServerAddress.fromUrl(address));
	            }
	        });
	        return {
	            routers,
	            readers,
	            writers
	        };
	    }
	    catch (error) {
	        throw newError(`Unable to parse servers entry from router ${routerAddress} from addresses:\n${stringify(rawRoutingTable.servers)}\nError message: ${error.message}`, PROTOCOL_ERROR);
	    }
	}
	/**
	 * Call the expiration time using the ttls from the raw routing table and return it
	 *
	 * @param {RawRoutingTable} rawRoutingTable the routing table
	 * @param {string} routerAddress the router address
	 * @returns {number} the ttl
	 */
	function calculateExpirationTime(rawRoutingTable, routerAddress) {
	    try {
	        const now = int(Date.now());
	        const expires = int(rawRoutingTable.ttl)
	            .multiply(1000)
	            .add(now);
	        // if the server uses a really big expire time like Long.MAX_VALUE this may have overflowed
	        if (expires.lessThan(now)) {
	            return Integer.MAX_VALUE;
	        }
	        return expires;
	    }
	    catch (error) {
	        throw newError(`Unable to parse TTL entry from router ${routerAddress} from raw routing table:\n${stringify(rawRoutingTable)}\nError message: ${error.message}`, PROTOCOL_ERROR);
	    }
	}
	/**
	 * Assert if serverAddressesArray is not empty, throws and PROTOCOL_ERROR otherwise
	 *
	 * @param {string[]} serverAddressesArray array of addresses
	 * @param {string} serversName the server name
	 * @param {string} routerAddress the router address
	 */
	function assertNonEmpty(serverAddressesArray, serversName, routerAddress) {
	    if (serverAddressesArray.length === 0) {
	        throw newError('Received no ' + serversName + ' from router ' + routerAddress, PROTOCOL_ERROR);
	    }
	}
	function parseArray(addresses) {
	    if (!Array.isArray(addresses)) {
	        throw new TypeError('Array expected but got: ' + addresses);
	    }
	    return Array.from(addresses);
	}

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
	class Rediscovery {
	    /**
	     * @constructor
	     * @param {object} routingContext
	     */
	    constructor(routingContext) {
	        this._routingContext = routingContext;
	    }
	    /**
	     * Try to fetch new routing table from the given router.
	     * @param {Session} session the session to use.
	     * @param {string} database the database for which to lookup routing table.
	     * @param {ServerAddress} routerAddress the URL of the router.
	     * @param {string} impersonatedUser The impersonated user
	     * @return {Promise<RoutingTable>} promise resolved with new routing table or null when connection error happened.
	     */
	    lookupRoutingTableOnRouter(session, database, routerAddress, impersonatedUser) {
	        return session._acquireConnection(connection => {
	            return this._requestRawRoutingTable(connection, session, database, routerAddress, impersonatedUser).then(rawRoutingTable => {
	                if (rawRoutingTable.isNull) {
	                    return null;
	                }
	                return RoutingTable.fromRawRoutingTable(database, routerAddress, rawRoutingTable);
	            });
	        });
	    }
	    _requestRawRoutingTable(connection, session, database, routerAddress, impersonatedUser) {
	        return new Promise((resolve, reject) => {
	            connection.protocol().requestRoutingInformation({
	                routingContext: this._routingContext,
	                databaseName: database,
	                impersonatedUser,
	                sessionContext: {
	                    bookmarks: session._lastBookmarks,
	                    mode: session._mode,
	                    database: session._database,
	                    afterComplete: session._onComplete
	                },
	                onCompleted: resolve,
	                onError: reject
	            });
	        });
	    }
	}

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
	const { SERVICE_UNAVAILABLE, SESSION_EXPIRED } = error;
	const { bookmarks: { Bookmarks }, constants: { ACCESS_MODE_READ: READ, ACCESS_MODE_WRITE: WRITE, BOLT_PROTOCOL_V3, BOLT_PROTOCOL_V4_0, BOLT_PROTOCOL_V4_4, BOLT_PROTOCOL_V5_1 } } = internal;
	const PROCEDURE_NOT_FOUND_CODE = 'Neo.ClientError.Procedure.ProcedureNotFound';
	const DATABASE_NOT_FOUND_CODE = 'Neo.ClientError.Database.DatabaseNotFound';
	const INVALID_BOOKMARK_CODE = 'Neo.ClientError.Transaction.InvalidBookmark';
	const INVALID_BOOKMARK_MIXTURE_CODE = 'Neo.ClientError.Transaction.InvalidBookmarkMixture';
	const AUTHORIZATION_EXPIRED_CODE = 'Neo.ClientError.Security.AuthorizationExpired';
	const INVALID_ARGUMENT_ERROR = 'Neo.ClientError.Statement.ArgumentError';
	const INVALID_REQUEST_ERROR = 'Neo.ClientError.Request.Invalid';
	const STATEMENT_TYPE_ERROR = 'Neo.ClientError.Statement.TypeError';
	const NOT_AVAILABLE = 'N/A';
	const SYSTEM_DB_NAME = 'system';
	const DEFAULT_DB_NAME = null;
	const DEFAULT_ROUTING_TABLE_PURGE_DELAY = int(30000);
	class RoutingConnectionProvider extends PooledConnectionProvider {
	    constructor({ id, address, routingContext, hostNameResolver, config, log, userAgent, boltAgent, authTokenManager, routingTablePurgeDelay, newPool }) {
	        super({ id, config, log, userAgent, boltAgent, authTokenManager, newPool }, address => {
	            return createChannelConnection(address, this._config, this._createConnectionErrorHandler(), this._log, this._routingContext);
	        });
	        this._routingContext = { ...routingContext, address: address.toString() };
	        this._seedRouter = address;
	        this._rediscovery = new Rediscovery(this._routingContext);
	        this._loadBalancingStrategy = new LeastConnectedLoadBalancingStrategy(this._connectionPool);
	        this._hostNameResolver = hostNameResolver;
	        this._dnsResolver = new HostNameResolver();
	        this._log = log;
	        this._useSeedRouter = true;
	        this._routingTableRegistry = new RoutingTableRegistry(routingTablePurgeDelay
	            ? int(routingTablePurgeDelay)
	            : DEFAULT_ROUTING_TABLE_PURGE_DELAY);
	        this._refreshRoutingTable = reuseOngoingRequest(this._refreshRoutingTable, this);
	    }
	    _createConnectionErrorHandler() {
	        // connection errors mean SERVICE_UNAVAILABLE for direct driver but for routing driver they should only
	        // result in SESSION_EXPIRED because there might still exist other servers capable of serving the request
	        return new ConnectionErrorHandler(SESSION_EXPIRED);
	    }
	    _handleUnavailability(error, address, database) {
	        this._log.warn(`Routing driver ${this._id} will forget ${address} for database '${database}' because of an error ${error.code} '${error.message}'`);
	        this.forget(address, database || DEFAULT_DB_NAME);
	        return error;
	    }
	    _handleSecurityError(error, address, connection, database) {
	        this._log.warn(`Routing driver ${this._id} will close connections to ${address} for database '${database}' because of an error ${error.code} '${error.message}'`);
	        return super._handleSecurityError(error, address, connection, database);
	    }
	    _handleWriteFailure(error, address, database) {
	        this._log.warn(`Routing driver ${this._id} will forget writer ${address} for database '${database}' because of an error ${error.code} '${error.message}'`);
	        this.forgetWriter(address, database || DEFAULT_DB_NAME);
	        return newError('No longer possible to write to server at ' + address, SESSION_EXPIRED, error);
	    }
	    /**
	     * See {@link ConnectionProvider} for more information about this method and
	     * its arguments.
	     */
	    async acquireConnection({ accessMode, database, bookmarks, impersonatedUser, onDatabaseNameResolved, auth } = {}) {
	        let name;
	        let address;
	        const context = { database: database || DEFAULT_DB_NAME };
	        const databaseSpecificErrorHandler = new ConnectionErrorHandler(SESSION_EXPIRED, (error, address) => this._handleUnavailability(error, address, context.database), (error, address) => this._handleWriteFailure(error, address, context.database), (error, address, conn) => this._handleSecurityError(error, address, conn, context.database));
	        const routingTable = await this._freshRoutingTable({
	            accessMode,
	            database: context.database,
	            bookmarks,
	            impersonatedUser,
	            auth,
	            onDatabaseNameResolved: (databaseName) => {
	                context.database = context.database || databaseName;
	                if (onDatabaseNameResolved) {
	                    onDatabaseNameResolved(databaseName);
	                }
	            }
	        });
	        // select a target server based on specified access mode
	        if (accessMode === READ) {
	            address = this._loadBalancingStrategy.selectReader(routingTable.readers);
	            name = 'read';
	        }
	        else if (accessMode === WRITE) {
	            address = this._loadBalancingStrategy.selectWriter(routingTable.writers);
	            name = 'write';
	        }
	        else {
	            throw newError('Illegal mode ' + accessMode);
	        }
	        // we couldn't select a target server
	        if (!address) {
	            throw newError(`Failed to obtain connection towards ${name} server. Known routing table is: ${routingTable}`, SESSION_EXPIRED);
	        }
	        try {
	            const connection = await this._connectionPool.acquire({ auth }, address);
	            if (auth) {
	                await this._verifyStickyConnection({
	                    auth,
	                    connection,
	                    address
	                });
	                return connection;
	            }
	            return new DelegateConnection(connection, databaseSpecificErrorHandler);
	        }
	        catch (error) {
	            const transformed = databaseSpecificErrorHandler.handleAndTransformError(error, address);
	            throw transformed;
	        }
	    }
	    async _hasProtocolVersion(versionPredicate) {
	        const addresses = await this._resolveSeedRouter(this._seedRouter);
	        let lastError;
	        for (let i = 0; i < addresses.length; i++) {
	            try {
	                const connection = await createChannelConnection(addresses[i], this._config, this._createConnectionErrorHandler(), this._log);
	                const protocolVersion = connection.protocol()
	                    ? connection.protocol().version
	                    : null;
	                await connection.close();
	                if (protocolVersion) {
	                    return versionPredicate(protocolVersion);
	                }
	                return false;
	            }
	            catch (error) {
	                lastError = error;
	            }
	        }
	        if (lastError) {
	            throw lastError;
	        }
	        return false;
	    }
	    async supportsMultiDb() {
	        return await this._hasProtocolVersion(version => version >= BOLT_PROTOCOL_V4_0);
	    }
	    async supportsTransactionConfig() {
	        return await this._hasProtocolVersion(version => version >= BOLT_PROTOCOL_V3);
	    }
	    async supportsUserImpersonation() {
	        return await this._hasProtocolVersion(version => version >= BOLT_PROTOCOL_V4_4);
	    }
	    async supportsSessionAuth() {
	        return await this._hasProtocolVersion(version => version >= BOLT_PROTOCOL_V5_1);
	    }
	    getNegotiatedProtocolVersion() {
	        return new Promise((resolve, reject) => {
	            this._hasProtocolVersion(resolve)
	                .catch(reject);
	        });
	    }
	    async verifyAuthentication({ database, accessMode, auth }) {
	        return this._verifyAuthentication({
	            auth,
	            getAddress: async () => {
	                const context = { database: database || DEFAULT_DB_NAME };
	                const routingTable = await this._freshRoutingTable({
	                    accessMode,
	                    database: context.database,
	                    auth,
	                    onDatabaseNameResolved: (databaseName) => {
	                        context.database = context.database || databaseName;
	                    }
	                });
	                const servers = accessMode === WRITE ? routingTable.writers : routingTable.readers;
	                if (servers.length === 0) {
	                    throw newError(`No servers available for database '${context.database}' with access mode '${accessMode}'`, SERVICE_UNAVAILABLE);
	                }
	                return servers[0];
	            }
	        });
	    }
	    async verifyConnectivityAndGetServerInfo({ database, accessMode }) {
	        const context = { database: database || DEFAULT_DB_NAME };
	        const routingTable = await this._freshRoutingTable({
	            accessMode,
	            database: context.database,
	            onDatabaseNameResolved: (databaseName) => {
	                context.database = context.database || databaseName;
	            }
	        });
	        const servers = accessMode === WRITE ? routingTable.writers : routingTable.readers;
	        let error = newError(`No servers available for database '${context.database}' with access mode '${accessMode}'`, SERVICE_UNAVAILABLE);
	        for (const address of servers) {
	            try {
	                const serverInfo = await this._verifyConnectivityAndGetServerVersion({ address });
	                return serverInfo;
	            }
	            catch (e) {
	                error = e;
	            }
	        }
	        throw error;
	    }
	    forget(address, database) {
	        this._routingTableRegistry.apply(database, {
	            applyWhenExists: routingTable => routingTable.forget(address)
	        });
	        // We're firing and forgetting this operation explicitly and listening for any
	        // errors to avoid unhandled promise rejection
	        this._connectionPool.purge(address).catch(() => { });
	    }
	    forgetWriter(address, database) {
	        this._routingTableRegistry.apply(database, {
	            applyWhenExists: routingTable => routingTable.forgetWriter(address)
	        });
	    }
	    _freshRoutingTable({ accessMode, database, bookmarks, impersonatedUser, onDatabaseNameResolved, auth } = {}) {
	        const currentRoutingTable = this._routingTableRegistry.get(database, () => new RoutingTable({ database }));
	        if (!currentRoutingTable.isStaleFor(accessMode)) {
	            return currentRoutingTable;
	        }
	        this._log.info(`Routing table is stale for database: "${database}" and access mode: "${accessMode}": ${currentRoutingTable}`);
	        return this._refreshRoutingTable(currentRoutingTable, bookmarks, impersonatedUser, auth)
	            .then(newRoutingTable => {
	            onDatabaseNameResolved(newRoutingTable.database);
	            return newRoutingTable;
	        });
	    }
	    _refreshRoutingTable(currentRoutingTable, bookmarks, impersonatedUser, auth) {
	        const knownRouters = currentRoutingTable.routers;
	        if (this._useSeedRouter) {
	            return this._fetchRoutingTableFromSeedRouterFallbackToKnownRouters(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth);
	        }
	        return this._fetchRoutingTableFromKnownRoutersFallbackToSeedRouter(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth);
	    }
	    async _fetchRoutingTableFromSeedRouterFallbackToKnownRouters(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth) {
	        // we start with seed router, no routers were probed before
	        const seenRouters = [];
	        let [newRoutingTable, error] = await this._fetchRoutingTableUsingSeedRouter(seenRouters, this._seedRouter, currentRoutingTable, bookmarks, impersonatedUser, auth);
	        if (newRoutingTable) {
	            this._useSeedRouter = false;
	        }
	        else {
	            // seed router did not return a valid routing table - try to use other known routers
	            const [newRoutingTable2, error2] = await this._fetchRoutingTableUsingKnownRouters(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth);
	            newRoutingTable = newRoutingTable2;
	            error = error2 || error;
	        }
	        return await this._applyRoutingTableIfPossible(currentRoutingTable, newRoutingTable, error);
	    }
	    async _fetchRoutingTableFromKnownRoutersFallbackToSeedRouter(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth) {
	        let [newRoutingTable, error] = await this._fetchRoutingTableUsingKnownRouters(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth);
	        if (!newRoutingTable) {
	            // none of the known routers returned a valid routing table - try to use seed router address for rediscovery
	            [newRoutingTable, error] = await this._fetchRoutingTableUsingSeedRouter(knownRouters, this._seedRouter, currentRoutingTable, bookmarks, impersonatedUser, auth);
	        }
	        return await this._applyRoutingTableIfPossible(currentRoutingTable, newRoutingTable, error);
	    }
	    async _fetchRoutingTableUsingKnownRouters(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth) {
	        const [newRoutingTable, error] = await this._fetchRoutingTable(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth);
	        if (newRoutingTable) {
	            // one of the known routers returned a valid routing table - use it
	            return [newRoutingTable, null];
	        }
	        // returned routing table was undefined, this means a connection error happened and the last known
	        // router did not return a valid routing table, so we need to forget it
	        const lastRouterIndex = knownRouters.length - 1;
	        RoutingConnectionProvider._forgetRouter(currentRoutingTable, knownRouters, lastRouterIndex);
	        return [null, error];
	    }
	    async _fetchRoutingTableUsingSeedRouter(seenRouters, seedRouter, routingTable, bookmarks, impersonatedUser, auth) {
	        const resolvedAddresses = await this._resolveSeedRouter(seedRouter);
	        // filter out all addresses that we've already tried
	        const newAddresses = resolvedAddresses.filter(address => seenRouters.indexOf(address) < 0);
	        return await this._fetchRoutingTable(newAddresses, routingTable, bookmarks, impersonatedUser, auth);
	    }
	    async _resolveSeedRouter(seedRouter) {
	        const resolvedAddresses = await this._hostNameResolver.resolve(seedRouter);
	        const dnsResolvedAddresses = await Promise.all(resolvedAddresses.map(address => this._dnsResolver.resolve(address)));
	        return [].concat.apply([], dnsResolvedAddresses);
	    }
	    async _fetchRoutingTable(routerAddresses, routingTable, bookmarks, impersonatedUser, auth) {
	        return routerAddresses.reduce(async (refreshedTablePromise, currentRouter, currentIndex) => {
	            const [newRoutingTable] = await refreshedTablePromise;
	            if (newRoutingTable) {
	                // valid routing table was fetched - just return it, try next router otherwise
	                return [newRoutingTable, null];
	            }
	            else {
	                // returned routing table was undefined, this means a connection error happened and we need to forget the
	                // previous router and try the next one
	                const previousRouterIndex = currentIndex - 1;
	                RoutingConnectionProvider._forgetRouter(routingTable, routerAddresses, previousRouterIndex);
	            }
	            // try next router
	            const [session, error] = await this._createSessionForRediscovery(currentRouter, bookmarks, impersonatedUser, auth);
	            if (session) {
	                try {
	                    return [await this._rediscovery.lookupRoutingTableOnRouter(session, routingTable.database, currentRouter, impersonatedUser), null];
	                }
	                catch (error) {
	                    return this._handleRediscoveryError(error, currentRouter);
	                }
	                finally {
	                    session.close();
	                }
	            }
	            else {
	                // unable to acquire connection and create session towards the current router
	                // return null to signal that the next router should be tried
	                return [null, error];
	            }
	        }, Promise.resolve([null, null]));
	    }
	    async _createSessionForRediscovery(routerAddress, bookmarks, impersonatedUser, auth) {
	        try {
	            const connection = await this._connectionPool.acquire({ auth }, routerAddress);
	            if (auth) {
	                await this._verifyStickyConnection({
	                    auth,
	                    connection,
	                    address: routerAddress
	                });
	            }
	            const databaseSpecificErrorHandler = ConnectionErrorHandler.create({
	                errorCode: SESSION_EXPIRED,
	                handleSecurityError: (error, address, conn) => this._handleSecurityError(error, address, conn)
	            });
	            const delegateConnection = !connection._sticky
	                ? new DelegateConnection(connection, databaseSpecificErrorHandler)
	                : new DelegateConnection(connection);
	            const connectionProvider = new SingleConnectionProvider(delegateConnection);
	            const protocolVersion = connection.protocol().version;
	            if (protocolVersion < 4.0) {
	                return [new Session({
	                        mode: WRITE,
	                        bookmarks: Bookmarks.empty(),
	                        connectionProvider
	                    }), null];
	            }
	            return [new Session({
	                    mode: READ,
	                    database: SYSTEM_DB_NAME,
	                    bookmarks,
	                    connectionProvider,
	                    impersonatedUser
	                }), null];
	        }
	        catch (error) {
	            return this._handleRediscoveryError(error, routerAddress);
	        }
	    }
	    _handleRediscoveryError(error, routerAddress) {
	        if (_isFailFastError(error) || _isFailFastSecurityError(error)) {
	            throw error;
	        }
	        else if (error.code === PROCEDURE_NOT_FOUND_CODE) {
	            // throw when getServers procedure not found because this is clearly a configuration issue
	            throw newError(`Server at ${routerAddress.asHostPort()} can't perform routing. Make sure you are connecting to a causal cluster`, SERVICE_UNAVAILABLE, error);
	        }
	        this._log.warn(`unable to fetch routing table because of an error ${error}`);
	        return [null, error];
	    }
	    async _applyRoutingTableIfPossible(currentRoutingTable, newRoutingTable, error) {
	        if (!newRoutingTable) {
	            // none of routing servers returned valid routing table, throw exception
	            throw newError(`Could not perform discovery. No routing servers available. Known routing table: ${currentRoutingTable}`, SERVICE_UNAVAILABLE, error);
	        }
	        if (newRoutingTable.writers.length === 0) {
	            // use seed router next time. this is important when cluster is partitioned. it tries to make sure driver
	            // does not always get routing table without writers because it talks exclusively to a minority partition
	            this._useSeedRouter = true;
	        }
	        await this._updateRoutingTable(newRoutingTable);
	        return newRoutingTable;
	    }
	    async _updateRoutingTable(newRoutingTable) {
	        // close old connections to servers not present in the new routing table
	        await this._connectionPool.keepAll(newRoutingTable.allServers());
	        this._routingTableRegistry.removeExpired();
	        this._routingTableRegistry.register(newRoutingTable);
	        this._log.info(`Updated routing table ${newRoutingTable}`);
	    }
	    static _forgetRouter(routingTable, routersArray, routerIndex) {
	        const address = routersArray[routerIndex];
	        if (routingTable && address) {
	            routingTable.forgetRouter(address);
	        }
	    }
	}
	/**
	 * Responsible for keeping track of the existing routing tables
	 */
	class RoutingTableRegistry {
	    /**
	     * Constructor
	     * @param {int} routingTablePurgeDelay The routing table purge delay
	     */
	    constructor(routingTablePurgeDelay) {
	        this._tables = new Map();
	        this._routingTablePurgeDelay = routingTablePurgeDelay;
	    }
	    /**
	     * Put a routing table in the registry
	     *
	     * @param {RoutingTable} table The routing table
	     * @returns {RoutingTableRegistry} this
	     */
	    register(table) {
	        this._tables.set(table.database, table);
	        return this;
	    }
	    /**
	     * Apply function in the routing table for an specific database. If the database name is not defined, the function will
	     * be applied for each element
	     *
	     * @param {string} database The database name
	     * @param {object} callbacks The actions
	     * @param {function (RoutingTable)} callbacks.applyWhenExists Call when the db exists or when the database property is not informed
	     * @param {function ()} callbacks.applyWhenDontExists Call when the database doesn't have the routing table registred
	     * @returns {RoutingTableRegistry} this
	     */
	    apply(database, { applyWhenExists, applyWhenDontExists = () => { } } = {}) {
	        if (this._tables.has(database)) {
	            applyWhenExists(this._tables.get(database));
	        }
	        else if (typeof database === 'string' || database === null) {
	            applyWhenDontExists();
	        }
	        else {
	            this._forEach(applyWhenExists);
	        }
	        return this;
	    }
	    /**
	     * Retrieves a routing table from a given database name
	     *
	     * @param {string|impersonatedUser} impersonatedUser The impersonated User
	     * @param {string} database The database name
	     * @param {function()|RoutingTable} defaultSupplier The routing table supplier, if it's not a function or not exists, it will return itself as default value
	     * @returns {RoutingTable} The routing table for the respective database
	     */
	    get(database, defaultSupplier) {
	        if (this._tables.has(database)) {
	            return this._tables.get(database);
	        }
	        return typeof defaultSupplier === 'function'
	            ? defaultSupplier()
	            : defaultSupplier;
	    }
	    /**
	     * Remove the routing table which is already expired
	     * @returns {RoutingTableRegistry} this
	     */
	    removeExpired() {
	        return this._removeIf(value => value.isExpiredFor(this._routingTablePurgeDelay));
	    }
	    _forEach(apply) {
	        for (const [, value] of this._tables) {
	            apply(value);
	        }
	        return this;
	    }
	    _remove(key) {
	        this._tables.delete(key);
	        return this;
	    }
	    _removeIf(predicate) {
	        for (const [key, value] of this._tables) {
	            if (predicate(value)) {
	                this._remove(key);
	            }
	        }
	        return this;
	    }
	}
	function _isFailFastError(error) {
	    return [
	        DATABASE_NOT_FOUND_CODE,
	        INVALID_BOOKMARK_CODE,
	        INVALID_BOOKMARK_MIXTURE_CODE,
	        INVALID_ARGUMENT_ERROR,
	        INVALID_REQUEST_ERROR,
	        STATEMENT_TYPE_ERROR,
	        NOT_AVAILABLE
	    ].includes(error.code);
	}
	function _isFailFastSecurityError(error) {
	    return error.code.startsWith('Neo.ClientError.Security.') &&
	        ![
	            AUTHORIZATION_EXPIRED_CODE
	        ].includes(error.code);
	}

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

	var lib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		loadBalancing: index$6,
		bolt: index$2,
		buf: index$5,
		channel: index$4,
		packstream: index$3,
		pool: index$1,
		SingleConnectionProvider: SingleConnectionProvider,
		PooledConnectionProvider: PooledConnectionProvider,
		DirectConnectionProvider: DirectConnectionProvider,
		RoutingConnectionProvider: RoutingConnectionProvider
	});

	var require$$3 = /*@__PURE__*/getAugmentedNamespace(lib);

	(function (exports) {
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
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
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
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
	var version_1 = __importDefault(version$1);
	var logging_1 = logging;
	Object.defineProperty(exports, "logging", { enumerable: true, get: function () { return logging_1.logging; } });
	var neo4j_driver_core_1 = require$$2;
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
	var neo4j_driver_bolt_connection_1 = require$$3;
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
	}(lib$2));

	var index = /*@__PURE__*/getDefaultExportFromCjs(lib$2);

	return index;

}));
