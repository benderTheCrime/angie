/**
 * @module invalid-module-config-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// System Modules
import { cyan } from        'chalk';
import $LogProvider from    'angie-log';

/**
 * @desc A parent class for the invalid module errors thrown when a declared
 * module value is not valid for the specified module type.
 * @returns {object} SyntaxError
 * @since 0.4.4
 * @access private
 */
class $$InvalidModuleConfigError {
    constructor(type = 'directive', name) {
        const msg = `Invalid configuration for ${type} ${cyan(name)}`;

        $LogProvider.error(msg);
        throw new SyntaxError(msg);
    }
}

export default $$InvalidModuleConfigError;