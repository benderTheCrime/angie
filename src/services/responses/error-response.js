/**
 * @module error-response.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// Angie modules
import BaseResponse from    './base-response';

/**
 * @desc ErrorResponse defines a generic error response from Angie. It is called
 * in the event that no routes or static assets are found, there is an issue
 * with the 404 path, or a generic error occurs. It is responsible for serving an
 * error response and setting up the headers associated with a 500 response.
 * @since 0.4.0
 * @access private
 * @extends {BaseResponse}
 */
class ErrorResponse extends BaseResponse {

    /**
     * @desc Loads the error response message and the response via BaseResponse
     * @since 0.4.0
     * @todo $compile the template 500.html with the error if it exists
     * @access private
     */
    constructor(e) {
        super();

        const RESPONSE_HEADER_MESSAGES =
            $Injector.get('RESPONSE_HEADER_MESSAGES');
        let html = '<h1>';

        if (e && config.development === true) {
            html += `${e}</h1><p>${e.stack || 'No Traceback'}</p>`;
        } else {

            // Call the response header constants to write the html
            html += `${RESPONSE_HEADER_MESSAGES[ '500' ]}</h1>`;
        }

        this.html = html;
    }

    /**
     * @desc Sets up the headers associated with the ErrorResponse
     * @since 0.4.0
     * @access private
     */
    head() {
        return super.head(500);
    }

    /**
     * @desc Writes the 500 html to the response.
     * @since 0.4.0
     * @access private
     */
    write() {
        let me = this;

        return new Promise(function(resolve) {
            me.writeSync();
            resolve();
        });
    }

    /**
     * @desc Writes the 500 html to the response synchronously.
     * @since 0.4.0
     * @access private
     */
    writeSync() {
        this.response.write(this.html);
    }
}

export default ErrorResponse;