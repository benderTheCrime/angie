/**
 * @module invalid-config-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// System Modules
import { cyan } from        'chalk';
import $LogProvider from    'angie-log';

/**
 * @desc A generic error thrown when an invalid configuration file is passed.
 * This can occur when an invalid or empty JSON object is passed (if the found
 * AngieFile is JSON) or if the JavaScript inside the config file is invalid.
 * It can also imply a valid AngieFile was not found. Valid names for this file
 * are "angiefile" with any mixed case written as JSON or a JavaScript file
 * (".js" or ".es6") that exports a JavaScript object.
 * @returns {object} Error
 * @since 0.4.4
 * @access public
 * @example $Exceptions.$$InvalidConfigError();
 */
class $$InvalidConfigError {
    constructor() {
        const msg = `Invalid application configuration. Check your ${
            cyan('AngieFile')
        }`;

        $LogProvider.error(msg);
        throw new Error(msg);
    }
}

export default $$InvalidConfigError;