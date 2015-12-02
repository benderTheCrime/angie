// TODO add all field uuids to single uuid with sub uuids
// TODO assign databinding frontend for "form" to find children with field names
// TODO add identifier for child inputs in form to be populated (ngie-form-iid)
// TODO check to see that form has the right node type
// TODO submission rules

/**
 * @module ngie-form.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 12/01/2015
 */

// System Modules
import uuid from                'node-uuid';
import { cyan } from            'chalk';
import $Injector from           'angie-injector';

// Angie Modules
import { default as link } from     './ngie-value';

export default function($Log) {
    return {
        priority: 1,
        restrict: 'A',
        link($scope, el, attrs) {
            if (el.nodeName.toLowerCase() !== 'form') {
                $Log.warn('ngieForm called on non-form element');
                return;
            }

            // TODO call link
        }
    };
}