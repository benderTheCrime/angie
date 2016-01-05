// Test Modules
import { expect } from                  'chai';
import simple, { spy, mock } from       'simple-mock';

// Angie Modules
import $Response from                   '../../../src/services/response';

/* eslint-disable no-unused-expressions */
describe('$Response', function() {
    beforeEach(function() {
        mock(global, 'setInterval', () => false);
    });
    afterEach(simple.restore);
    it('constructor', function() {
        const $response = new $Response({});
        expect($response.hasOwnProperty('$$iid')).to.be.true;
        expect($response.hasOwnProperty('$scope')).to.be.true;
        expect($response.$scope.hasOwnProperty('$$iid')).to.be.true;
        expect($response.$scope.hasOwnProperty('$$bindings')).to.be.true;
        expect($response.$scope.$$bindings).to.deep.eq({});
    });
    describe('header', function() {
        let $response;

        beforeEach(function() {
            $response = new $Response({
                setHeader: spy()
            });
        });
        it('test header calls setHeader', function() {
            $response.header('k', 'v');
            expect(
                $response.response.setHeader.calls[ 0 ].args
            ).to.deep.eq([ 'k', 'v' ]);
        });
    });
});

/* eslint-enable no-unused-expressions */