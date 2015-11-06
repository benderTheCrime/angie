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
import { config } from                            '../Config';
import app from                                 '../Angie';
import $ScopeFactory from                       '../factories/scope';
import $CacheFactory from                       '../factories/$CacheFactory';
import {
    $templateCache,
    $$templateLoader,
    $resourceLoader
} from                                          '../factories/template-cache';
import $compile from                            '../factories/$Compile';
import $MimeType from                           '../services/mime-type';
import $Cookie from                             '../services/cookie';
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
    constructor(sessionKey, response) {

        // This is never exposed, but is maintained for consistency
        this.$$iid = uuid.v4();

        // Define $Response based instance of createServer.prototype.response
        this.response = response;

        // Define the Angie content string
        this.response.content = '';

        // Define a scope for our session
        $Scopes.put(sessionKey, new $ScopeFactory());
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

/**
 * @desc ControllerTemplateResponse defines any Angie response that has a path
 * which is associated with a template. It is responsible for calling the
 * controller and any post-processed templating.
 * @since 0.4.0
 * @access private
 * @extends {ControllerResponse}
 */
class ControllerTemplateResponse extends ControllerResponse {
    constructor() {
        super();
    }

    /**
     * @desc Sets up the headers associated with the ControllerTemplateResponse
     * @since 0.4.0
     * @access private
     */
    head() {
        return super.head();
    }

    /**
     * @desc Performs the Controller templating
     * @since 0.4.0
     * @access private
     */
    write() {
        let me = this;

        return super.write().then(function() {
            me.template = me.route.template;
        }).then(
            controllerTemplateRouteResponse.bind(this)
        );
    }
}

/**
 * @desc ControllerTemplatePathResponse defines any Angie response that has a
 * path which is associated with a template path. It is responsible for calling
 * the controller and any post-processed templating.
 * @since 0.4.0
 * @access private
 * @extends {ControllerResponse}
 */
class ControllerTemplatePathResponse extends ControllerResponse {
    constructor() {
        super();
    }

    /**
     * @desc Sets up the headers associated with the
     * ControllerTemplatePathResponse
     * @since 0.4.0
     * @access private
     */
    head() {
        return super.head();
    }

    /**
     * @desc Performs the Controller path templating
     * @since 0.4.0
     * @access private
     */
    write() {
        let me = this;

        return super.write().then(function() {
            let template = $templateCache.get(me.route.templatePath);

            // Check to see if we can associate the template path with a
            // mime type
            me.response.$headers[ 'Content-Type' ] =
                $MimeType.fromPath(me.route.templatePath);
            me.template = template;
        }).then(
            controllerTemplateRouteResponse.bind(this)
        );
    }
}

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
        return new Promise((r) => r());
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
    constructor() {
        super();
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

/**
 * @desc Resolves any situation in which a Controller is referenced where it
 * does not exist
 * @since 0.4.0
 * @access private
 * @extends {Reference}
 */
class $$ControllerNotFoundError extends ReferenceError {

    /**
     * @param {string} name Controller Name
     * @since 0.4.0
     * @access private
     */
    constructor(name) {
        $LogProvider.error(`Unknown Controller ${blue(name)}`);
        super();
    }
}

// Performs the templating inside of Controller Classes
function controllerTemplateRouteResponse() {
    if (this.template) {
        let match = this.template.toString().match(/!doctype ([a-z]+)/i),
            mime;

        // In the context where MIME type is not set, but we have a
        // DOCTYPE tag, we can force set the MIME
        // We want this here instead of the explicit template definition
        // in case the MIME failed earlier
        if (match && !this.response.$headers.hasOwnProperty('Content-Type')) {
            mime = this.response.$headers[ 'Content-Type' ] =
                $MimeType.$$(match[ 1 ].toLowerCase());
        } else {
            mime = this.response.$headers[ 'Content-Type' ];
        }

        // Check to see if this is an HTML template and has a DOCTYPE
        // and that the proper configuration options are set
        if (
            mime === 'text/html' &&
            config.loadDefaultScriptFile // &&
            // (
                // this.route.hasOwnProperty('useDefaultScriptFile') ||
                // this.route.useDefaultScriptFile !== false
            // )
        ) {
            $resourceLoader(config.loadDefaultScriptFile);
        }

        // Pull the response back in from wherever it was before
        this.content = this.response.content;

        // Render the template into the resoponse
        let me = this;
        return new Promise(function(resolve) {

            // $Compile to parse template strings and app.directives
            return $compile(me.template)(

                // In the context of the scope
                me.$scope
            ).then(function(template) {
                resolve(template);
            });
        }).then(function(template) {
            me.response.content = me.content += template;
            me.response.write(me.content);
        });
    }
}

export default $Response;
export {
    BaseResponse,
    AssetResponse,
    ControllerTemplateResponse,
    ControllerTemplatePathResponse,
    RedirectResponse,
    UnknownResponse,
    ErrorResponse,
    $CustomResponse
};