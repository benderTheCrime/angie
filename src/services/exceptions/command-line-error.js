/**
 * @module command-line-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 12/13/2015
 */

// System Modules
import { cyan } from        'chalk';
import $LogProvider from    'angie-log';

const TYPES = [
    null,
    'create',
    'run'
];

/**
 * @desc Handles any errors associated with using Angie from the command line
 * @since 0.4.6
 * @access private
 */
class $$CommandLineError {

    /**
     * @param {string} name Command line component name
     * @since 0.4.6
     * @access private
     */
    constructor(i) {
        const MSG = `No valid ${TYPES[ i ]} command component specified, ` +
            'please see the help commands for more options';

        $LogProvider.error(MSG);
        throw new Error(MSG);
    }
}

export default $$CommandLineError;