/**
 * @module redirect-response.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// Angie Modules
import BaseResponse from    './base-response';

/**
 * @desc RedirectResponse is either forced as a byproduct of the controller or
 * when no other route can be matched and an "otherwise" route is defined. It
 * is responsible for serving an empty response and setting up the headers
 * associated with a 302 response.
 * @since 0.4.0
 * @access private
 * @extends {BaseResponse}
 */
class RedirectResponse extends BaseResponse {

    /**
     * @desc Loads a redirect path and the response via BaseResponse
     * @since 0.4.0
     * @access private
     */
    constructor(path) {
        super();
        this.path = path || this.otherwise;
    }

    /**
     * @desc Sets up the headers associated with the RedirectResponse
     * @since 0.4.0
     * @access private
     */
    head() {
        this.response.setHeader('Location', this.path);
        return super.head(302);
    }

    /**
     * @desc Placeholder method
     * @since 0.4.0
     * @access private
     */
    write() {

        // There is no content in this method
        return new Promise(r => r());
    }

    /**
     * @desc Ends the redirect response (synchronously).
     * @since 0.4.0
     * @access private
     */
    writeSync() {
        this.response.end();
    }
}