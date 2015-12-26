// Test Modules
import { assert, expect } from      'chai';
import simple, { mock, spy } from   'simple-mock';

// Angie Modules
import * as $TemplateCache from     '../../../../src/factories/template-cache';
import BaseResponse from
    '../../../../src/services/responses/base-response';
import UnknownResponse from
    '../../../../src/services/responses/unknown-response';

describe('UnknownResponse', function() {
    const noop = () => false;
    let BaseResponseMock,
        $$templateLoaderMock,
        $response,
        writeHeadSpy,
        writeSpy;

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

    /* eslint-disable no-new */
    it('constructor', function() {
        new UnknownResponse();
        assert(BaseResponseMock.called);
        expect(
            $$templateLoaderMock.calls[ 0 ].args[ 0 ]
        ).to.eq('html/404.html');
    });

    /* eslint-enable no-new */
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
                BaseResponse.prototype.head.calls[ 0 ].args[ 0 ]
            ).to.eq(404);
        });
        it('write', function() {
            response.write();
            expect(writeSpy.calls[ 0 ].args[ 0 ]).to.eq('test');
        });
    });
});