/**
 * @module response.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/16/2015
 */

// System Modules
import util from                                'util';
import uuid from                                'node-uuid';
import { blue } from                            'chalk';
import $Injector, { $injectionBinder } from     'angie-injector';
import $LogProvider from                        'angie-log';

// Angie Modules
import { config } from                          '../Config';
import app from                                 '../Angie';
import $ScopeFactory from                       '../factories/scope';
import $CacheFactory from                       '../factories/$CacheFactory';
import {
    $templateCache,
    $$templateLoader,
    $resourceLoader
} from                                          '../factories/template-cache';
import $compile from                            '../factories/$Compile';
import $MimeType from                           './mime-type';
import $Cookie from                             './cookie';
import AssetResponse from                       './responses/asset-response';
import ControllerTemplateResponse from          './responses/controller-template-response';
import ControllerTemplatePathResponse from      './responses/controller-template-path-response';
import RedirectResponse from                    './responses/redirect-response';
import UnknownResponse from                     './responses/unknown-response';
import ErrorResponse from                       './responses/error-response';
import $CustomResponse from                     './responses/custom-response';
import $Util, { $FileUtil } from                '../util/util';

const $Scopes = new $CacheFactory('$scopes');

/**
 * @desc The $Response class controls all of the content contained in the
 * response from the Angie application. This is an extended NodeJS http/https
 * createServer response and is responsible for storing this response and the
 * content associated with the response. It can be required using a module
 * import, but probably should not be unless it is being subclassed for a
 * dependency package. It can also be used as an injected provider using
 * `$request`.
 * @since 0.4.0
 * @access public
 * @example $Injector.get('$response');
 */
class $Response {
    constructor(response) {

        // This is never exposed, but is maintained for consistency
        this.$$iid = uuid.v4();

        // Define $Response based instance of createServer.prototype.response
        this.response = response;

        // Define the Angie content string
        this.response.content = '';

        // Define a scope for our session
        this.$scope = new $ScopeFactory();
    }

    /**
     * @desc Sets a header on the instance's encapsulation of NodeJS response.
     * This function performs no safe checks on the headers.
     * @param {string} [param=''] k The name of the header
     * @param {string} [param=''] v The value of the header
     * @since 0.4.4
     * @example new $Response(res).header('X-Frame-Options', 'SAMEORIGIN');
     */
    header(k = '', v = '') {
        this.response.setHeader(k, v);

        return this;
    }
}

export default $Response;
export {
    AssetResponse,
    ControllerTemplateResponse,
    ControllerTemplatePathResponse,
    RedirectResponse,
    UnknownResponse,
    ErrorResponse,
    $CustomResponse
};