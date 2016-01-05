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

            // Value listeners are set up on the front end, for now, we just
            // implement an $$iid and REST the property
            // We deliberately do not drop the attribute
            const $Bind = $Injector.get('$Bind');
            const UUID = attrs.ngieIid = attrs.ngieIid || uuid.v4();
            let id,
                filters,
                model,
                field;

            if (
                typeof attrs.ngieModel === 'string' &&
                attrs.ngieModel.indexOf('.') > -1
            ) {
                [ model, field ] = attrs.ngieModel.split('.');
                delete attrs.ngieModel;
            }

            if (typeof attrs.ngieModelFilters === 'string') {
                try {
                    filters = JSON.parse(attrs.ngieModelFilters);
                    delete attrs.ngieModelFilters;
                } catch (e) {
                    $Log.warn(
                        `Invalid filter object passed to ${cyan('ngieValue')}`
                    );
                }
            }

            // These attributes take precedence over their compound equivalent
            if (typeof attrs.ngieModelName === 'string') {
                model = attrs.ngieModelName;
                delete attrs.ngieModelName;
            }

            if (typeof attrs.ngieFieldName === 'string') {
                field = attrs.ngieFieldName;
                delete attrs.ngieFieldName;
            }

            if (typeof attrs.ngieModelId === 'string') {
                id = +attrs.ngieModelId;
                delete attrs.ngieModelId;
            }

            if (model) {
                attrs.ngieIid = $Bind(UUID, { id, filters, model, field });
            } else {
                $Log.warn(`
                    Model Name missing from ${cyan('ngieValue')},
                    falling back to default functionality
                `);
                attrs.value = attrs.ngieValue || '';
            }

            el.removeAttr('ngie-value')
                .removeAttr('ngie-model')
                .removeAttr('ngie-model-name')
                .removeAttr('ngie-field-name')
                .removeAttr('ngie-model-id')
                .removeAttr('ngie-model-filters');
        }
    };
}

export default $$ngieValueFactory;