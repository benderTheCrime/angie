/**
 * @module project-creation-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 12/21/2015
 */

// System Modules
import $LogProvider from    'angie-log';

 /**
  * @desc Thrown when there is a problem scaffolding a new Angie application
  * @throws {Error}
  * @since 0.5.0
  * @access private
  * @example throw new $Exceptions.$$ProjectCreationError();
  */
class $$ProjectCreationError {

    /**
     * @since 0.5.0
     * @access private
     */
    constructor(e) {
        $LogProvider.error(e);

        if (e instanceof Error) {
            throw e;
        }

        throw new Error(e);
    }
}

export default $$ProjectCreationError;