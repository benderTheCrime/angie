/**
 * @module $Compile.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/16/2015
 */

// System Modules
import cheerio from                 'cheerio';
import { cyan } from                'chalk';
import $LogProvider from            'angie-log';

// Angie Modules
import app from                     '../Angie';
import { $$templateLoader } from    './template-cache';
import * as $Util from              '../util/util';

/**
 * @desc $compile is provided to any service, Controller, directive, Model, or
 * view which has included it as an argument.
 *
 * $compile is responsible for parsing all templates and templatePath files that
 * are passed into a Controller. It will parse all triple bracketted statements,
 * all ngie-native directives, and all custom directives.
 *
 * The triple bracket statement is utilized as a result of the Angular/Mustache/
 * Handlebars standard of two brackets. While you can also do three brackets in
 * either of the latter cases, it is generally considered unsafe and most
 * definitely so in this case.
 *
 * Native directives are called "ngie" to avoid namespace collisions. Dirty
 * checking is performed on directive names for camelCasing,
 * underscore_separation, and dash-separation.
 * @since 0.2.2
 * @param {string} t Template string to be processed
 * @returns {function} Template function, compiles in whatever scope is passed
 * @access public
 * @example $compile('{{{test}}}')({ test: 1 }) === 1; // true
 */
function $compile(t) {

    if (!t) {
        return $Util.noop;
    }

    // We need to call template.toString() because we did not load with utf8
    let template = t.toString(),
        directives = [];

    // Direct reference by directive name to directive object
    for (let $directive in app.directives) {
        let directive = app.directives[ $directive ];
        if (!directive.$names) {
            directive.$names = [
                $directive,
                $directive.toLowerCase(),
                $Util.string.toUnderscore($directive),
                $Util.string.toDash($directive)
            ];
        }

        // Add all parsed directve names to directives
        directives.push(directive);
    }

    // Sort our directives for priority
    directives.sort(function(a, b) {
        if (!a.priority && !b.priority) {
            return 0;
        } else if ((a.priority && !b.priority) || (a.priority > b.priority)) {
            return 1;
        }
        return -1;
    });

    /**
     * @desc Function returned by $compile
     * @since 0.2.2
     * @param {object} scope [param={}] Template string to be processed
     * @param {boolean} assignDOMServices [param=true] Create a new
     * $window/$document?
     * @returns {string} The compiled template
     */
    return function $templateCompile(scope = {}) {

        // Temporary template object, lets us hang on to our template
        let tmpLet = template,
            proms = [],
            $ = cheerio.load(tmpLet.replace(/<!?\s+?\s+?doctype\s+?>/i, ''), {
                decodeEntities: false
            }),
            els = $('*');

        els.each(function(_, el) {
            directives.forEach(function(directive) {
                let type;

                if (
                    el.attribs &&
                    directive.$names.some(v => el.attribs.hasOwnProperty(v))
                ) {
                    type = 'A';
                } else if (
                    el.attribs &&
                    el.attribs.class &&
                    directive.$names.some(v => el.attribs.class.indexOf(v) > -1)
                ) {
                    type = 'C';
                } else if (
                    el.name &&
                    directive.$names.indexOf(el.name.toLowerCase()) > -1
                ) {
                    type = 'E';
                }

                // Check that the restriction is valid
                if (
                    type && (
                        !directive.hasOwnProperty('restrict') ||
                        (
                            directive.hasOwnProperty('restrict') &&
                            directive.restrict.indexOf(type) > -1
                        )
                    )
                ) {
                    let prom = $$processDirective(
                            $(el), scope, directive, type
                        );
                    proms.push(prom);
                }
            });
        });

        return Promise.all(proms).then(function() {
            return $$matchBrackets($.html(), scope);
        });
    };
}

// TODO observance on attributes
// TODO consider removing all attributes from the element and keying off which
// are preserved in the link function, or finding the diff
function $$processDirective(el, scope, directive) {
    let attr = el[ 0 ].attribs || {},
        parsedAttrs = {},
        template,
        prom;

    // Template parsing
    if (
        directive.hasOwnProperty('templatePath') &&
        directive.templatePath.indexOf('.html') > -1
    ) {
        template = $$templateLoader(directive.templatePath, 'template', 'utf8');
    } else if (directive.hasOwnProperty('template')) {
        template = directive.template;
    }

    if (template) {

        // Setup the template HTML observing the prepend/append properties
        prom = $compile(template)(scope, false).then(function(t) {
            el.html(
                `${directive.prepend === true ?
                    `${t}${el.html()}` : `${el.html()}${t}`
                }`
            );
        });
    } else {
        prom = new Promise(r => r());
    }

    if (Object.keys(attr).length) {
        for (let key in attr) {
            if (attr[ key ]) {
                parsedAttrs[ $Util.string.toCamel(key) ] = attr[ key ];
            }
        }
    }

    // Link functionality
    if (
        directive.hasOwnProperty('link') &&
        typeof directive.link === 'function'
    ) {
        prom = prom.then(function() {
            return new Promise(function(resolve) {
                const link = directive.link.call(
                    scope, scope, el, parsedAttrs
                );

                resolve(link);
            });
        }).then(function() {
            if (el.attr) {
                for (let key in parsedAttrs) {

                    // Replace all of the element attrs with parsedAttrs
                    if (directive.$names.indexOf(key) === -1) {
                        el.attr($Util.string.toDash(key), parsedAttrs[ key ]);
                    }
                }
            }
        });
    }

    return prom;
}

function $$matchBrackets(html, scope) {

    // Parse simple listeners/expressions
    return html.replace(/(\{{2,3}('\{{2,3})?[^\}\{]+(\}{2,3}')?\}{2,3})/g,
        function(m) {

            // Remove the bracket mustaches
            const PARSED_LISTENER = m.replace(/^(\{{2,3})|(\}{2,3})$|;/g, '')
                .trim();
            let val = '';

            // Evaluate the expression
            try {
                val = $$safeEvalFn.call(scope, PARSED_LISTENER);
            } catch (e) {

                // There is no reason to throw an error on unfound $scope variables
                if (!(e instanceof ReferenceError)) {
                    $LogProvider.warn(
                        `Template ${cyan('$compile')} Error: ${e}`
                    );
                }
            }

            return val;
        });
}

// A private function to evaluate the parsed template string in the context of
// `scope`
function $$safeEvalFn(str) {
    let keyStr = '';

    // Perform any parsing that needs to be performed on the scope value
    for (let key in this) {
        let val = this[ key ];
        if (!val && val !== 0 && val !== '') {
            continue;
        } else if (
            typeof val === 'symbol' ||
            typeof val === 'string'
        ) {
            val = `"${val}"`;
        } else if (typeof val === 'object') {
            val = JSON.stringify(val);
        }

        // I don't like having to use var here
        keyStr += `var ${key}=${val};`;
    }

    // Literal eval is executed in its own context here to reduce security issues
    /* eslint-disable */
    return eval([ keyStr, str ].join(''));

    /* eslint-enable */
}

export default $compile;
export { $$safeEvalFn };