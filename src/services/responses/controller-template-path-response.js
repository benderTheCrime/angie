/**
 * @module controller-response.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 11/6/2015
 */

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

export default ControllerTemplatePathResponse;