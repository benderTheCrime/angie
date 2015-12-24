// Test Modules
import { assert, expect } from          'chai';
import simple, { mock, spy } from       'simple-mock';

// System Modules
import $Injector from                   'angie-injector';

// Angie Modules
import { config } from                  '../../../src/Config';
import * as $TemplateCache from         '../../../src/factories/template-cache';
import $Response from                   '../../../src/services/response';

describe('$Response', function() {
    it('constructor', function() {
        const $response = new $Response({});
        expect($response.hasOwnProperty('$$iid')).to.be.true;
        expect($response.hasOwnProperty('$scope')).to.be.true;
        expect($response.$scope.hasOwnProperty('$$bindings')).to.be.true;
        expect($response.$scope.$$bindings).to.deep.eq({});
        expect($response.$scope.hasOwnProperty('$$iid')).to.be.true;
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
                $response.response.setHeader.calls[0].args
            ).to.deep.eq([ 'k', 'v' ]);
        });
    });
});