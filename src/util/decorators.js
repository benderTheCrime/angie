/**
 * @module decorators.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/16/2015
 */

/**
 * @desc Base creates a generic function wrapper for module type decorators.
 * These decorators are intended to be associated with classes. The decorator
 * itself will attempt to create a module out of the wrapped class based on the
 * name of the used decorator. Current options include:
 *     - Controller
 *     - directive
 * @since 0.5.0
 * @access private
 * @returns {function} The wrapped decorator
 */
function Base(name) {
    return obj => {
        global.app[ name ](obj.name, obj);
    };
}

const Controller = Base('Controller');
const directive = Base('directive');

export {
    Controller,
    directive
};