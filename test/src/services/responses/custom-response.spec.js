// Test Modules
import { assert, expect } from          'chai';
import simple, { mock, spy } from       'simple-mock';

// Angie Modules
import BaseResponse from
    '../../../../src/services/responses/base-response';
import $CustomResponse from
    '../../../../src/services/responses/custom-response';

describe('$CustomResponse', function() {
    const noop = () => false;
    let BaseResponseMock,
        $response,
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

    /* eslint-disable no-new */
    it('constructor', function() {
        new $CustomResponse();
        assert(BaseResponseMock.called);
    });

    /* eslint-enable no-new */
    describe('methods', function() {
        let html;

        beforeEach(function() {
            html = 'test';
            response = new $CustomResponse();
            response.response = $response;
        });
        describe('head', function() {
            beforeEach(function() {
                response.response.$headers = {};
                mock(BaseResponse.prototype, 'head', () => response);
            });
            it('test without headers', function() {
                expect(response.head(504)).to.eq(response);
                expect(
                    BaseResponse.prototype.head.calls[ 0 ].args[ 0 ]
                ).to.eq(504);
            });
            it('test with additional response headers', function() {
                let test = 'test';
                expect(response.head(504, { test })).to.eq(response);
                expect(response.response.$headers).to.deep.eq({ test });
                expect(
                    BaseResponse.prototype.head.calls[ 0 ].args[ 0 ]
                ).to.eq(504);
            });
        });
        it('write', function() {
            response.write(html);
            expect(writeSpy.calls[ 0 ].args[ 0 ]).to.eq(html);
        });
        it('writeSync', function() {
            response.writeSync(html);
            expect(writeSpy.calls[ 0 ].args[ 0 ]).to.eq(html);
        });
    });
});