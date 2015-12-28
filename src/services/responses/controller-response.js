/**
 * @module controller-response.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// System Modules
import util from                        'util';

// Angie Modules
import { config } from                  '../../Config';
import BaseResponse from                './base-response';
import $$ControllerNotFoundError from
    '../exceptions/controller-not-found-error';
import $MimeType from                   '../mime-type';
import { $resourceLoader } from         '../../factories/template-cache';
import $compile from                    '../../factories/$Compile';

/**
 * @desc ControllerResponse defines any Angie response that has a path which is
 * associated with a template or template path. It is responsible for calling
 * the controller and any post-processed templating.
 * @since 0.4.0
 * @access private
 * @extends {BaseResponse}
 */
class ControllerResponse extends BaseResponse {
    constructor(scoping) {
        super(scoping);
    }

    /**
     * @desc Sets up the headers associated with the ControllerResponse
     * @since 0.4.0
     * @access private
     */
    head() {
        return super.head();
    }

    /**
     * @desc Performs the Controller and calls any templating in the response
     * @since 0.4.0
     * @access private
     */
    write() {
        let me = this;

        return new Promise(function(resolve) {
            let controller = me.route.Controller || me.route.controller,
                controllerResponse;

            // Get controller and compile scope
            if (typeof controller === 'string') {
                if (app.Controllers[ controller ]) {
                    controller = app.Controllers[ controller ];
                } else {
                    throw new $$ControllerNotFoundError(controller);
                }
            } else {
                return resolve();
            }

            // Call the bound controller function
            controllerResponse = new $injectionBinder(
                controller,
                util._extend({ type: 'controller' }, this.scoping)
            ).call(me.$scope, resolve);

            resolve(controllerResponse);
        });
    }

    // Performs the templating inside of Controller Classes
    controllerTemplateRouteResponse() {
        if (this.template) {
            let me = this,
                match = this.template.toString().match(/!doctype ([a-z]+)/i),
                scope = this.scoping.$scope.val,
                mime;

            /**
             * In the context where MIME type is not set, but we have a
             * DOCTYPE tag, we can force set the MIME
             * We want this here instead of the explicit template definition
             * in case the MIME failed earlier
             */
            if (
                match &&
                !this.response.$headers.hasOwnProperty('Content-Type')
            ) {
                mime = this.response.$headers[ 'Content-Type' ] =
                    $MimeType.$$(match[ 1 ].toLowerCase());
            } else {
                mime = this.response.$headers[ 'Content-Type' ];
            }

            /**
             * Check to see if this is an HTML template and has a DOCTYPE
             * and that the proper configuration options are set
             */
            if (mime === 'text/html' && config.loadDefaultScriptFile) {
                $resourceLoader(config.loadDefaultScriptFile, this.scoping);
            }

            // Pull the response back in from wherever it was before
            this.content = this.response.content;

            // $Compile to parse template strings and app.directives
            return $compile(me.template)(

                // In the context of the scope
                scope
            ).then(function(template) {
                me.response.content = me.content += template;
                me.response.write(me.content);
            });
        }
    }
}

export default ControllerResponse;