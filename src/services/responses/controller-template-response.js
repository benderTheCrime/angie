/**
 * @module controller-template-response.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

// Angie Modules
import ControllerResponse from  './controller-response';

/**
 * @desc ControllerTemplateResponse defines any Angie response that has a path
 * which is associated with a template. It is responsible for calling the
 * controller and any post-processed templating.
 * @since 0.4.0
 * @access private
 * @extends {ControllerResponse}
 */
class ControllerTemplateResponse extends ControllerResponse {
    constructor(scoping) {
        super(scoping);
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
        }).then(() => me.controllerTemplateRouteResponse());
    }
}

export default ControllerTemplateResponse;