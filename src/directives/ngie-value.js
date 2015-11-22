/**
 * @module ngie-value.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 10/01/2015
 */

// System Modules
import uuid from        'node-uuid';
import { cyan } from    'chalk';
import $Injector from   'angie-injector';

function $$ngieValueFactory($Log) {
    return {
        priority: 1,
        restrict: 'A',
        link($scope, el, attrs) {
            const $Bind = $Injector.get('$Bind');

            // Value listeners are set up on the front end, for now, we just
            // implement an $$iid and REST the property
            // We deliberately do not drop the attribute
            const UUID = attrs.ngieIid = bindingUUID || attrs.ngieIid || uuid.v4();
            let bindingUUID;

            // TODO IMPORTANT!! If this is not included all rows will be
            // returned
            let id,
                filters,
                model,
                field;

            if (
                typeof attrs.ngieModel === 'string' &&
                attrs.ngieModel.indexOf('.') > -1
            ) {
                [ model, field ] = attrs.ngieModel.split('.');
            }

            if (typeof attrs.ngieModelFilters === 'string') {
                try {
                    filters = JSON.parse(attrs.ngieModelFilters);
                } catch(e) {
                    $Log.warn(
                        `Invalid filter object passed to ${cyan('ngieValue')}`
                    );
                }
            }

            // These attributes take precedence over their compound equivalent
            if (typeof attrs.ngieModelName === 'string') {
                model = attrs.ngieModelName;
            }

            // TODO many fields
            if (typeof attrs.ngieFieldName === 'string') {
                field = attrs.ngieFieldName;
            }

            if (typeof attrs.ngieModelId === 'string') {
                id = +attrs.ngieModelId;
            }

            if (!model) {
                $Log.warn(`
                    Model Name missing from ${cyan('ngieValue')},
                    falling back to default functionality
                `);
                attrs.value = attrs.ngieValue;
                el.removeAttr('ngie-value');
            } else {
                bindingUUID = $Bind(UUID, { id, filters, model, field });
            }

            el.removeAttr('ngie-model');
            el.removeAttr('ngie-model-id');
            el.removeAttr('ngie-model-filters');
        }
    };
}

export default $$ngieValueFactory;