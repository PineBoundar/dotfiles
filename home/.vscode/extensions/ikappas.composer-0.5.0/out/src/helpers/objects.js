/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var Types = require('./types');
function clone(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof RegExp) {
        return obj;
    }
    var result = (Array.isArray(obj)) ? [] : {};
    Object.keys(obj).forEach(function (key) {
        if (obj[key] && typeof obj[key] === 'object') {
            result[key] = clone(obj[key]);
        }
        else {
            result[key] = obj[key];
        }
    });
    return result;
}
exports.clone = clone;
function deepClone(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    var result = (Array.isArray(obj)) ? [] : {};
    Object.getOwnPropertyNames(obj).forEach(function (key) {
        if (obj[key] && typeof obj[key] === 'object') {
            result[key] = deepClone(obj[key]);
        }
        else {
            result[key] = obj[key];
        }
    });
    return result;
}
exports.deepClone = deepClone;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function cloneAndChange(obj, changer) {
    return _cloneAndChange(obj, changer, []);
}
exports.cloneAndChange = cloneAndChange;
function _cloneAndChange(obj, changer, encounteredObjects) {
    if (Types.isUndefinedOrNull(obj)) {
        return obj;
    }
    var changed = changer(obj);
    if (typeof changed !== 'undefined') {
        return changed;
    }
    if (Types.isArray(obj)) {
        var r1 = [];
        for (var i1 = 0; i1 < obj.length; i1++) {
            r1.push(_cloneAndChange(obj[i1], changer, encounteredObjects));
        }
        return r1;
    }
    if (Types.isObject(obj)) {
        if (encounteredObjects.indexOf(obj) >= 0) {
            throw new Error('Cannot clone recursive data-structure');
        }
        encounteredObjects.push(obj);
        var r2 = {};
        for (var i2 in obj) {
            if (hasOwnProperty.call(obj, i2)) {
                r2[i2] = _cloneAndChange(obj[i2], changer, encounteredObjects);
            }
        }
        encounteredObjects.pop();
        return r2;
    }
    return obj;
}
// DON'T USE THESE FUNCTION UNLESS YOU KNOW HOW CHROME
// WORKS... WE HAVE SEEN VERY WEIRD BEHAVIOUR WITH CHROME >= 37
///**
// * Recursively call Object.freeze on object and any properties that are objects.
// */
//export function deepFreeze(obj:any):void {
//	Object.freeze(obj);
//	Object.keys(obj).forEach((key) => {
//		if(!(typeof obj[key] === 'object') || Object.isFrozen(obj[key])) {
//			return;
//		}
//
//		deepFreeze(obj[key]);
//	});
//	if(!Object.isFrozen(obj)) {
//		console.log('too warm');
//	}
//}
//
//export function deepSeal(obj:any):void {
//	Object.seal(obj);
//	Object.keys(obj).forEach((key) => {
//		if(!(typeof obj[key] === 'object') || Object.isSealed(obj[key])) {
//			return;
//		}
//
//		deepSeal(obj[key]);
//	});
//	if(!Object.isSealed(obj)) {
//		console.log('NOT sealed');
//	}
//}
/**
 * Copies all properties of source into destination. The optional parameter "overwrite" allows to control
 * if existing properties on the destination should be overwritten or not. Defaults to true (overwrite).
 */
function mixin(destination, source, overwrite) {
    if (overwrite === void 0) { overwrite = true; }
    if (!Types.isObject(destination)) {
        return source;
    }
    if (Types.isObject(source)) {
        Object.keys(source).forEach(function (key) {
            if (key in destination) {
                if (overwrite) {
                    if (Types.isObject(destination[key]) && Types.isObject(source[key])) {
                        mixin(destination[key], source[key], overwrite);
                    }
                    else {
                        destination[key] = source[key];
                    }
                }
            }
            else {
                destination[key] = source[key];
            }
        });
    }
    return destination;
}
exports.mixin = mixin;
function assign(destination) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) { return Object.keys(source).forEach(function (key) { return destination[key] = source[key]; }); });
    return destination;
}
exports.assign = assign;
function toObject(arr, keyMap, valueMap) {
    if (valueMap === void 0) { valueMap = function (x) { return x; }; }
    return arr.reduce(function (o, d) { return assign(o, (_a = {}, _a[keyMap(d)] = valueMap(d), _a)); var _a; }, Object.create(null));
}
exports.toObject = toObject;
/**
 * Returns a new object that has all values of {{obj}}
 * plus those from {{defaults}}.
 */
function withDefaults(obj, defaults) {
    return mixin(clone(defaults), obj || {});
}
exports.withDefaults = withDefaults;
function equals(one, other) {
    if (one === other) {
        return true;
    }
    if (one === null || one === undefined || other === null || other === undefined) {
        return false;
    }
    if (typeof one !== typeof other) {
        return false;
    }
    if (typeof one !== 'object') {
        return false;
    }
    if ((Array.isArray(one)) !== (Array.isArray(other))) {
        return false;
    }
    var i, key;
    if (Array.isArray(one)) {
        if (one.length !== other.length) {
            return false;
        }
        for (i = 0; i < one.length; i++) {
            if (!equals(one[i], other[i])) {
                return false;
            }
        }
    }
    else {
        var oneKeys = [];
        for (key in one) {
            oneKeys.push(key);
        }
        oneKeys.sort();
        var otherKeys = [];
        for (key in other) {
            otherKeys.push(key);
        }
        otherKeys.sort();
        if (!equals(oneKeys, otherKeys)) {
            return false;
        }
        for (i = 0; i < oneKeys.length; i++) {
            if (!equals(one[oneKeys[i]], other[oneKeys[i]])) {
                return false;
            }
        }
    }
    return true;
}
exports.equals = equals;
function ensureProperty(obj, property, defaultValue) {
    if (typeof obj[property] === 'undefined') {
        obj[property] = defaultValue;
    }
}
exports.ensureProperty = ensureProperty;
function arrayToHash(array) {
    var result = {};
    for (var i = 0; i < array.length; ++i) {
        result[array[i]] = true;
    }
    return result;
}
exports.arrayToHash = arrayToHash;
/**
 * Given an array of strings, returns a function which, given a string
 * returns true or false whether the string is in that array.
 */
function createKeywordMatcher(arr, caseInsensitive) {
    if (caseInsensitive === void 0) { caseInsensitive = false; }
    if (caseInsensitive) {
        arr = arr.map(function (x) { return x.toLowerCase(); });
    }
    var hash = arrayToHash(arr);
    if (caseInsensitive) {
        return function (word) {
            return hash[word.toLowerCase()] !== undefined && hash.hasOwnProperty(word.toLowerCase());
        };
    }
    else {
        return function (word) {
            return hash[word] !== undefined && hash.hasOwnProperty(word);
        };
    }
}
exports.createKeywordMatcher = createKeywordMatcher;
/**
 * Started from TypeScript's __extends function to make a type a subclass of a specific class.
 * Modified to work with properties already defined on the derivedClass, since we can't get TS
 * to call this method before the constructor definition.
 */
function derive(baseClass, derivedClass) {
    for (var prop in baseClass) {
        if (baseClass.hasOwnProperty(prop)) {
            derivedClass[prop] = baseClass[prop];
        }
    }
    derivedClass = derivedClass || function () { };
    var basePrototype = baseClass.prototype;
    var derivedPrototype = derivedClass.prototype;
    derivedClass.prototype = Object.create(basePrototype);
    for (var prop in derivedPrototype) {
        if (derivedPrototype.hasOwnProperty(prop)) {
            // handle getters and setters properly
            Object.defineProperty(derivedClass.prototype, prop, Object.getOwnPropertyDescriptor(derivedPrototype, prop));
        }
    }
    // Cast to any due to Bug 16188:PropertyDescriptor set and get function should be optional.
    Object.defineProperty(derivedClass.prototype, 'constructor', { value: derivedClass, writable: true, configurable: true, enumerable: true });
}
exports.derive = derive;
/**
 * Calls JSON.Stringify with a replacer to break apart any circular references.
 * This prevents JSON.stringify from throwing the exception
 *  "Uncaught TypeError: Converting circular structure to JSON"
 */
function safeStringify(obj) {
    var seen = [];
    return JSON.stringify(obj, function (key, value) {
        if (Types.isObject(value) || Array.isArray(value)) {
            if (seen.indexOf(value) !== -1) {
                return '[Circular]';
            }
            else {
                seen.push(value);
            }
        }
        return value;
    });
}
exports.safeStringify = safeStringify;
//# sourceMappingURL=objects.js.map