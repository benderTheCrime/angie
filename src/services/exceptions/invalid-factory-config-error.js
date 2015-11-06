/**
 * @module invalid-factory-config-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// System Modules
import $$InvalidModuleConfigError from  './invalid-module-config-error';

/**
 * @desc The invalid module value error associated with factories.
 * @returns {object} SyntaxError
 * @since 0.4.4
 * @access public
 * @extends {$$InvalidModuleConfigError}
 * @example new $Exceptions().$$InvalidFactoryConfigError();
 */
class $$InvalidFactoryConfigError extends $$InvalidModuleConfigError {
    constructor(name) {
        return super('factory', name);
    }
}

export default $$InvalidFactoryConfigError;