/**
 * @module invalid-controller-config-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// System Modules
import $$InvalidModuleConfigError from  './invalid-module-config-error';

/**
 * @desc The invalid module value error associated with Controllers.
 * @returns {object} SyntaxError
 * @since 0.4.4
 * @access public
 * @extends {$$InvalidModuleConfigError}
 * @example $Exceptions.$$InvalidControllerConfigError();
 */
class $$InvalidControllerConfigError extends $$InvalidModuleConfigError {
    constructor(name) {
        return super('Controller', name);
    }
}

export default $$InvalidControllerConfigError;