// Test Modules
import { assert, expect } from          'chai';
import simple, { mock, spy } from       'simple-mock';

// System Modules
import $Injector from                   'angie-injector';

// Angie Modules
import { config } from                  '../../../../src/Config';
import * as $TemplateCache from         '../../../../src/factories/template-cache';
import UnknownResponse from             '../../../../src/services/responses/unknown-response';

describe('UnknownResponse', function() {
    const noop = () => false;
    let BaseResponseMock,
        $$templateLoaderMock,
        $request,
        $response,
        $injectorMock,
        writeHeadSpy,
        writeSpy,
        response;

    beforeEach(function() {
        writeHeadSpy = spy();
        writeSpy = spy();
        $request = {
            headers: {
                accept: 'text/html,'
            },
            path: 'test.html'
        };
        $response = {
            test: 'test',
            $responseContent: '',
            writeHead: writeHeadSpy,
            write: writeSpy
        };
    });
    beforeEach(function() {
        BaseResponseMock = mock(BaseResponse.prototype, 'constructor', noop);
        $$templateLoaderMock = mock(
            $TemplateCache,
            '$$templateLoader',
            () => 'test'
        );
    });
    afterEach(simple.restore);
    it('constructor', function() {
        let response = new UnknownResponse();
        assert(BaseResponseMock.called);
        expect($$templateLoaderMock.calls[0].args[0]).to.eq('html/404.html');
    });
    describe('methods', function() {
        beforeEach(function() {
            response = new UnknownResponse();
            response.response = $response;
        });
        it('head', function() {
            mock(BaseResponse.prototype, 'head', () => response);
            response.response.$headers = {};
            expect(response.head()).to.eq(response);
            expect(
                BaseResponse.prototype.head.calls[0].args[0]
            ).to.eq(404);
        });
        it('write', function() {
            response.write();
            expect(writeSpy.calls[0].args[0]).to.eq('test');
        });
    });
});