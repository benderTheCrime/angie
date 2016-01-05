// Test Modules
import { assert, expect } from      'chai';
import simple, { mock, spy } from   'simple-mock';

import BaseResponse from
    '../../../../src/services/responses/base-response';
import RedirectResponse from
    '../../../../src/services/responses/redirect-response';

describe('RedirectResponse', function() {
    let BaseResponseMock,
        $response,
        writeHeadSpy,
        writeSpy,
        response;

    beforeEach(function() {
        writeHeadSpy = spy();
        writeSpy = spy();
        $response = {
            test: 'test',
            $responseContent: '',
            writeHead: writeHeadSpy,
            write: writeSpy
        };
    });
    beforeEach(function() {
        BaseResponseMock = mock(
            BaseResponse.prototype,
            'constructor',
            function() {
                this.otherwise = 'test2';
            }
        );
    });
    afterEach(simple.restore);
    describe('constructor', function() {
        it('test with argument path', function() {
            let response = new RedirectResponse('test');
            assert(BaseResponseMock.called);
            expect(response.path).to.eq('test');
        });
        it('test without argument path', function() {
            let response = new RedirectResponse();
            assert(BaseResponseMock.called);
            expect(response.path).to.eq('test2');
        });
    });
    describe('methods', function() {
        beforeEach(function() {
            response = new RedirectResponse('test');

            $response.end = spy();
            $response.setHeader = spy();
            response.response = $response;
        });
        it('head', function() {
            expect(response.head()).to.eq(response);
            expect(response.response.statusCode).to.eq(302);
            expect(
                $response.setHeader.calls[ 0 ].args
            ).to.deep.eq([ 'Location', 'test' ]);
        });
        it('write', function() {
            expect(response.write().then).to.be.a('function');
        });
        it('writeSync', function() {
            response.writeSync();
            assert($response.end.called);
        });
    });
});