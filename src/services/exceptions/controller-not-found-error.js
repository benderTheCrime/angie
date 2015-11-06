/**
 * @module invalid-controller-config-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// System Modules
import { cyan } from        'chalk';
import $LogProvider from    'angie-log';

/**
 * @desc Resolves any situation in which a Controller is referenced where it
 * does not exist
 * @since 0.4.0
 * @access private
 */
class $$ControllerNotFoundError {

    /**
     * @param {string} name Controller Name
     * @since 0.4.0
     * @access private
     */
    constructor(name) {
        const msg = `Unknown Controller ${chalk.cyan(name)}`;

        $LogProvider.error(msg);
        throw new ReferenceError(msg);
    }
}

export default $$ControllerNotFoundError;