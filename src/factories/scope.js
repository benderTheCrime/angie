/**
 * @module $ScopeProvider.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/16/2015
 */

// System Modules
import uuid from        'node-uuid';
import $Injector from   'angie-injector';

let sessionStorage,
    handlers = [];

// Clear out stale sessions
setInterval(function() {
    if (typeof sessionStorage === 'object') {
        for (let key of sessionStorage) {
            let value = sessionStorage[ key ];

            if (+value.expiry < +new Date()) {
                delete sessionStorage[ key ];
            }
        }
    }
}, 300);

/**
 * @desc $ScopeProvider is the parent class on which all of the content shared
 * across the request can be shared. It also provides methods for messaging
 * against and across the scope.
 * @todo Warning if key does not map to an object value on the given $scope
 * @todo persistence options for $scopes
 * @since 0.3.1
 * @access private
 */
class $$ScopeFactory {
    constructor() {
        this.$$iid = uuid.v4();
        this.$$bindings = {};
    }

    $bind(key, model) {

        // First we need to check that the key actually exists on the $scope
        if (this.hasOwnProperty(key)) {

            /**
             * The key exists in some capacity on the scope, we need to validate
             * that the model exists
             */
            if (typeof model === 'string') {

                // Attempt to look up our model by name
                model = $Injector.get(model);
            }

            if (typeof model === 'object') {
                this.$$bindings[ key ] = model.name;
            }
        }

        return this;
    }

    $createBinding() {
        return this.$bind.apply(this, arguments);
    }

    /**
     * @desc Sets up an event listener on the scope
     * @since 0.3.1
     * @param {string} name The name of the message to call the event listener
     * @param {function} fn The handler to call on message
     * @returns {boolean} A representation of whether the listener was attached
     * @access public
     * @example $scope.$on('test', () => undefined);
     */
    $on(name, fn) {
        if (typeof fn === 'function') {
            handlers.push({ [ name ]: fn });
            return true;
        }
        return false;
    }

    /**
     * @desc Calls an event listener on the scope
     * @since 0.3.1
     * @todo Replace `Array.prototype.slice.call` with `Array.from` when it is
     * supported without the polyfill
     * @param {string} name The name of the message to call the event listener
     * @param {boolean} async Should the handlers be called async?
     * @returns {boolean} A representation of whether the listeners were called
     * @access public
     * @example $scope.$broadcast('test', true);
     */
    $broadcast(name, async) {
        let args = Array.prototype.slice.call(arguments).splice(0, 1);
        for (let handler of handlers) {
            if (handler.hasOwnProperty(name)) {
                if (async) {
                    setImmediate(handler[ name ].bind(null, args));
                } else {
                    handler[ name ](args);
                }
            }
        }
        return true;
    }

    /**
     * @desc Sets up an observer on an object (shallow). This function does not
     * support dots.
     * @since 0.3.1
     * @todo deep watch
     * @param {object} obj The object upon which to set up the handler
     * @param {function} fn The handler to call on message
     * @returns {object} The passed object
     * @access public
     * @example $scope.$watch({}, () => undefined);
     */
    $watch(key, fn) {
        return Object.observe(this[ key ], fn);
    }

    /**
     * @desc Sets up an observer on an object (deep). This function does not
     * support dots.
     * @since 0.3.1
     * @param {object} obj The object upon which to set up the handler
     * @param {function} fn The handler to call on message
     * @access public
     * @example $scope.$watchCollection({ test: {} }, () => undefined);
     */
    // $watchCollection(key, fn) {
    //     let me = this;
    //     Object.observe(this[ key ], function(changes) {
    //         changes.forEach(function(change) {
    //             if (typeof me[ key ][ change.name ] === 'object') {
    //                 me.$watch(me[ key ][ change.name ], fn);
    //             }
    //         });
    //         fn.apply(me, arguments);
    //     });
    // }

    /**
     * @desc Removes all of the handlers from a listener
     * @since 0.3.1
     * @param {string} name The name of the message to call the event listener
     * @returns {boolean} A representation of whether the listeners were attached
     * @access public
     * @example $scope.$off('test');
     */
    $$off(name) {
        for (let handler of handlers) {
            if (handler.hasOwnProperty(name)) {
                handlers.splice(handlers.indexOf(handler), 1);
            }
        }
        return true;
    }

    /**
     * @desc Removes all of the watchers from an object
     * @since 0.3.1
     * @todo deep unwatch
     * @param {object} obj The object from which to remove the handler
     * @returns {boolean} A representation of whether the listeners were unattached
     * @access public
     * @example $scope.$$removeWatch({});
     */
    $$removeWatch(obj) {
        Object.unwatch(obj);

        return true;
    }

    /**
     * @desc Sets up or removes all handlers
     * @since 0.3.1
     * @param {Array} $handlers An optional list of handlers
     * @returns {Array} handlers
     * @access private
     */
    $$handlers($handlers) {
        handlers = $handlers || handlers;
        return handlers;
    }
}

export default $$ScopeFactory;