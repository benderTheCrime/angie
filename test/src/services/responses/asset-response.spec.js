// Test Modules
import { assert, expect } from      'chai';
import simple, { mock, spy } from   'simple-mock';

// System Modules
import $Injector from               'angie-injector';

// Angie Modules
import { config } from              '../../../../src/Config';
import * as $TemplateCache from     '../../../../src/factories/template-cache';
import { $FileUtil } from           '../../../../src/util/util';
import BaseResponse from
    '../../../../src/services/responses/base-response';
import AssetResponse from
    '../../../../src/services/responses/asset-response';
import UnknownResponse from
    '../../../../src/services/responses/unknown-response';

/* eslint-disable no-unused-expressions */
describe('AssetResponse', function() {
    const noop = () => false;
    let BaseResponseMock,
        $request,
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
        BaseResponseMock = mock(
            BaseResponse.prototype,
            'constructor',
            () => true
        );
        $injectorMock = mock($Injector, 'get', () => $request);
    });
    afterEach(simple.restore);
    describe('constructor', function() {
        it('test content type from request.headers.accept', function() {
            response = new AssetResponse();
            assert(BaseResponseMock.called);
            expect(response.path).to.eq('test.html');
        });
    });
    describe('methods', function() {
        let headMock;

        beforeEach(function() {
            headMock = mock(
                BaseResponse.prototype,
                'head',
                () => response
            );
            response = new AssetResponse();
        });
        it('head', function() {
            expect(response.head()).to.eq(response);
            assert(headMock.called);
        });
        describe('write', function() {
            let $$templateLoaderMock;

            beforeEach(function() {
                $$templateLoaderMock = mock(
                    $TemplateCache,
                    '$$templateLoader',
                    () => 'test'
                );
                response.response = $response;
            });
            afterEach(function() {
                delete config.cacheStaticAssets;
                simple.restore();
            });
            it('test no asset template', function() {
                let headMock,
                    unknownWriteSpy = spy();
                $$templateLoaderMock.returnWith(false);
                mock(UnknownResponse.prototype, 'constructor', noop);
                headMock = mock(
                    UnknownResponse.prototype,
                    'head',
                    () => ({ write: unknownWriteSpy })
                );
                response.write();
                assert(headMock.called);
                assert(unknownWriteSpy.called);
            });
            it('test asset from $$templateLoader', function() {
                response.write();
                assert(writeSpy.called);
            });
        });
    });
    describe('$isRoutedAssetResourceResponse', function() {
        let injectorMock,
            fileMock;

        beforeEach(function() {
            injectorMock = mock($Injector, 'get', () => [ 'test' ]);
            fileMock = mock($FileUtil, 'find', () => true);
        });
        it('test found asset', function() {
            expect(
                AssetResponse.$isRoutedAssetResourceResponse('test')
            ).to.be.true;
            expect(fileMock.calls[ 0 ].args).to.deep.eq([ 'test', 'test' ]);
            expect(
                injectorMock.calls[ 0 ].args[ 0 ]
            ).to.eq('ANGIE_STATIC_DIRS');
        });
        it('test did not find asset', function() {
            fileMock.returnWith(false);
            expect(
                AssetResponse.$isRoutedAssetResourceResponse('test')
            ).to.be.false;
            expect(fileMock.calls[ 0 ].args).to.deep.eq([ 'test', 'test' ]);
            expect(
                injectorMock.calls[ 0 ].args[ 0 ]
            ).to.eq('ANGIE_STATIC_DIRS');
        });
    });
});

/* eslint-enable no-unused-expressions */