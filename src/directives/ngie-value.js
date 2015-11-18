/**
 * @module ngie-value.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 10/01/2015
 */

// System Modules
import uuid from    'node-uuid';

const t = s => s.toString().replace(/\s{2,}/g, '');

function $$ngieValueFactory($Bind) {
    return {
        priority: 1,
        restrict: 'A',

        // TODO this won't work because these props are shared across many
        // directives - do we define the binding in the html and then process it
        // with a uuid in here?
        modelName: '',
        fieldName: '',
        model: 'model.field',
        link($scope, el, attrs) {

            // Value listeners are set up on the front end, for now, we just
            // implement an $$iid and REST the property

            // TODO add unit $$iid
            // TODO this needs to be better - how is this extensible for a user?
            // TODO throw conflated element uuids on the front end
            // We deliberately do not drop the attribute
            const UUID = uuid.v4();

            // TODO IMPORTANT!! If this is not included all rows will be
            // returned
            let id,
                model,
                field;

            if (
                typeof attrs.ngieModel === 'string' &&
                attrs.ngieModel.indexOf('.') > -1
            ) {
                [ model, field ] = attrs.ngieModel.split('.');
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

            if (!(field && model)) {
                $Log.warn(t`
                    Model Name or Field Name missing from value, falling back to
                    default functionality
                `);
                attrs.value = attrs.ngieValue;
                el.removeAttr('ngie-value');
            } else {
                $Bind(uuid, { id, model, field });
            }


            // TODO figure out how this is registered on the backend listeners
            // and how the front end replicates those listeners
            attrs.test = 'BLAH';
        }
    };
}

export default $$ngieValueFactory;

// TODO we don't want to expose the model name, so we make the directive a
// specialized directive