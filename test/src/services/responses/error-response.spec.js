// Test Modules
import { assert, expect } from          'chai';
import simple, { mock, spy } from       'simple-mock';

// System Modules
import $Injector from                   'angie-injector';

// Angie Modules
import { config } from                  '../../../../src/Config';
import * as $TemplateCache from         '../../../../src/factories/template-cache';
import ErrorResponse from             '../../../../src/services/responses/error-response';

describe('ErrorResponse', function() {
    const noop = () => false;
    let BaseResponseMock,
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
    });
    afterEach(simple.restore);
    describe('constructor', function() {
        afterEach(function() {
            delete config.development;
        });
        it('test no error', function() {
            let response = new ErrorResponse();
            assert(BaseResponseMock.called);
            expect(response.html).to.eq('<h1>Internal Server Error</h1>');
        });
        it('test error with stack', function() {
            config.development = true;
            let e = new Error('test'),
                response = new ErrorResponse(e);
            assert(BaseResponseMock.called);
            expect(response.html).to.eq(`<h1>${e}</h1><p>${e.stack}</p>`);
        });
        it('test error without stack', function() {
            config.development = true;
            let e = new Error('test'),
                response = new ErrorResponse('test');
            assert(BaseResponseMock.called);
            expect(response.html).to.eq('<h1>test</h1><p>No Traceback</p>');
        });
    });
    describe('methods', function() {
        beforeEach(function() {
            response = new ErrorResponse();
            response.response = $response;
        });
        it('head', function() {
            mock(BaseResponse.prototype, 'head', () => response);
            response.response.$headers = {};
            expect(response.head()).to.eq(response);
            expect(BaseResponse.prototype.head.calls[0].args[0]).to.eq(500);
        });
        it('write', function() {
            response.write();
            expect(writeSpy.calls[0].args[0]).to.eq(response.html);
        });
        it('writeSync', function() {
            response.writeSync();
            expect(writeSpy.calls[0].args[0]).to.eq(response.html);
        });
    });
});