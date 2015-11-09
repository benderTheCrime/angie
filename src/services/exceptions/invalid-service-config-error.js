/**
 * @module invalid-service-config-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// System Modules
import $$InvalidModuleConfigError from  './invalid-module-config-error';

/**
 * @desc The invalid module value error associated with services.
 * @returns {object} SyntaxError
 * @since 0.4.4
 * @access public
 * @extends {$$InvalidModuleConfigError}
 * @example $Exceptions.$$InvalidServiceConfigError();
 */
class $$InvalidServiceConfigError extends $$InvalidModuleConfigError {
    constructor(name) {
        return super('service', name);
    }
}

export default $$InvalidServiceConfigError;