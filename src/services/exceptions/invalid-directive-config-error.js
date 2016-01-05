/**
 * @module invalid-directive-config-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// System Modules
import $$InvalidModuleConfigError from  './invalid-module-config-error';

/**
 * @desc The invalid module value error associated with directives.
 * @returns {object} SyntaxError
 * @since 0.4.4
 * @access public
 * @extends {$$InvalidModuleConfigError}
 * @example $Exceptions.$$InvalidDirectiveConfigError();
 */
class $$InvalidDirectiveConfigError extends $$InvalidModuleConfigError {
    constructor(name) {
        return super(undefined, name);
    }
}

export default $$InvalidDirectiveConfigError;