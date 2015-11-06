/**
 * @module controller-response.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/16/2015
 */

/**
 * @desc ControllerResponse defines any Angie response that has a path which is
 * associated with a template or template path. It is responsible for calling
 * the controller and any post-processed templating.
 * @since 0.4.0
 * @access private
 * @extends {BaseResponse}
 */
class ControllerResponse extends BaseResponse {
    constructor() {
        super();
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
        this.$scope = $Injector.get('$scope');

        let me = this;
        return new Promise(function(resolve) {
            let controller = me.route.Controller || me.route.controller;

            // Assign a function that can be called to resolve async
            // behavior in Controllers
            app.services.$response.Controller = { done: resolve };

            // Get controller and compile scope
            if (typeof controller === 'function') {
                controller = controller;
            } else if (typeof controller === 'string') {
                if (app.Controllers[ controller ]) {
                    controller = app.Controllers[ controller ];
                } else {
                    throw new $$ControllerNotFoundError(controller);
                }
            } else {
                return resolve();
            }

            // Call the bound controller function
            let controllerResponse = new $injectionBinder(
                controller,
                'controller'
            ).call(me.$scope, resolve);

            // Resolve the Promise if the controller does not return a
            // function
            if (
                !controllerResponse ||
                !controllerResponse.constructor ||
                controllerResponse.constructor.name !== 'Promise'
            ) {
                resolve(controller);
            }
        });
    }
}

export default ControllerResponse;