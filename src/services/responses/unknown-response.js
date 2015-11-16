/**
 * @module unknown-response.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// Angie Modules
import BaseResponse from    './base-response';

/**
 * @desc UnknownResponse writes any Angie response that has a path which cannot
 * be mapped to a route or a static asset. It is responsible for serving an
 * unknown response and setting up the headers associated with a 404 response.
 * @since 0.4.0
 * @access private
 * @extends {BaseResponse}
 */
class UnknownResponse extends BaseResponse {

    /**
     * @desc Loads the 404.html and the response via BaseResponse
     * @since 0.4.0
     * @access private
     */
    constructor() {
        super();
        this.html = $$templateLoader('html/404.html');
    }

    /**
     * @desc Sets up the headers associated with the UnknownResponse
     * @since 0.4.0
     * @access private
     */
    head() {
        return super.head(404);
    }

    /**
     * @desc Writes the 404 html to the response.
     * @since 0.4.0
     * @access private
     */
    write() {
        let me = this;

        return new Promise(function(resolve) {
            me.response.write(me.html);
            resolve();
        });
    }
}

export default UnknownResponse;