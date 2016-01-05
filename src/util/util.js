/**
 * @module util.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/16/2015
 */

// Angie Modules
import StringUtil from      './util/string-util';
import FileUtil from        './util/file-util';

/**
 * @desc $Util empty function call helper
 * @since 0.2.3
 * @returns {undefined} undefined
 * @example $Util.noop(); // = undefined
 */
function noop() {
    return;
}

/**
 * @desc $Util function to check whether the given argument is an Array
 * @since 0.5.0
 * @returns {boolean} Whether or not the given argument is an Array
 * @example $Util.isArray([]); // = true
 */
function isArray(obj) {
    return obj instanceof Array || (
        typeof obj === 'object' && obj.hasOwnProperty('length')
    );
}

/**
 * @desc $Util function to check whether the given argument is a Set
 * @since 0.5.0
 * @returns {boolean} Whether or not the given argument is a Set
 * @example $Util.isSet(new Set()); // = true
 */
function toSet() {
    return new Set(toArray.apply(null, arguments));
}

/**
 * @desc toArray takes one or many arguments and converts them into an Array
 * @since 0.5.0
 * @returns {Array} Array combination of arguments
 * @example $Util.toArray(...);
 */
function toArray() {
    const ARGS = Array.prototype.slice.call(arguments);
    let arr = [];

    for (let arg of ARGS) {
        if (isArray(arg)) {
            arr = arr.concat(arg);
        } else if (arg) {
            arr.push(arg);
        }
    }

    return arr;
}

export default {
    noop,
    isArray,
    toSet,
    toArray
};
export {
    noop,
    isArray,
    toSet,
    toArray,
    StringUtil as $StringUtil,
    StringUtil as string,
    FileUtil as $FileUtil,
    FileUtil as file
};