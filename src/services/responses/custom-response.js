/**
 * @module custom-response.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// System Modules
import util from            'util';

// Angie Modules
import BaseResponse from    './base-response';

/**
 * @desc $CustomResponse is an exposed custom response method which can be used
 * to defined any response outside of the pre-canned response classes. It is,
 * for example, used by the Angie server to return a Gateway Timeout (504) in
 * the event that a request is not resolved within the timeframe defined by the
 * AngieFile.json `responseErrorTimeout`.
 * @since 0.4.0
 * @access private
 * @extends {BaseResponse}
 */
class $CustomResponse extends BaseResponse {
    constructor(scoping) {
        super(scoping);
    }

    /**
     * @desc Sets up the headers associated with the CustomResponse
     * @since 0.4.0
     * @access private
     */
    head(code = 200, headers = {}) {
        this.response.$headers = util._extend(this.response.$headers, headers);
        return super.head(code);
    }

    /**
     * @desc Writes the custom data to the response.
     * @since 0.4.0
     * @access private
     */
    write(data) {
        let me = this;

        return new Promise(function(resolve) {
            me.writeSync(data);
            resolve();
        });
    }

    /**
     * @desc Writes the custom data to the response synchronously.
     * @since 0.4.0
     * @access private
     */
    writeSync(data) {
        this.response.write(data);
    }
}

export default $CustomResponse;