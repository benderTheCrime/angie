/**
 * @module base-response.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// System modules
import $Injector from   'angie-injector';

/**
 * @desc BaseResponse defines the default Angie response. It is responsible for
 * serving the default response and setting up the headers associated with the
 * default response.
 * @todo Move Content-Type resolution to $Response constructor
 * @since 0.4.0
 * @access private
 */
class BaseResponse {
    constructor(scoping) {
        let request,
            contentType;

        console.log('IN REQ');

        [
            request,
            this.response
        ]  = $Injector.get('$request', '$response', scoping);

        // Set the route and otherwise
        [
            this.path,
            this.route,
            this.otherwise
        ] = [
            request.path,
            request.route,
            request.otherwise
        ];

        this.scoping = scoping;

        // Parse out the response content type
        contentType = request.headers ? request.headers.accept : null;
        if (contentType && contentType.indexOf(',') > -1) {
            contentType = contentType.split(',')[0];
        } else {
            contentType = $MimeType.fromPath(request.path);
        }

        // Set the response headers
        this.response.$headers = { 'Content-Type': contentType };
    }

    /**
     * @desc Sets up the headers associated with the Asset Response
     * @since 0.4.0
     * @access private
     */
    head(code = 200) {
        this.response.statusCode = code;

        for (let header in this.response.$headers) {
            this.response.setHeader(header, this.response.$headers[ header ]);
        }

        return this;
    }

    /**
     * @desc Loads the default Angie template html file, `index.html`, and
     * writes the file to the response.
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
     * @desc Loads the default Angie template html file, `index.html`, and
     * writes the file to the response synchronously
     * @since 0.4.0
     * @access private
     */
    writeSync() {
        this.response.write($$templateLoader('html/index.html'));
    }
}

export default BaseResponse;