// Test Modules
import {assert, expect} from        'chai';
import simple, {mock, spy} from     'simple-mock';

// System Modules
import {default as $Injector} from  'angie-injector';

// Angie Modules
import {config} from                '../../../src/Config';
import $CacheFactory from           '../../../src/factories/$CacheFactory';
import * as $TemplateCache from     '../../../src/factories/$TemplateCache';
import * as $Responses from         '../../../src/services/$Response';
import {$FileUtil} from             '../../../src/util/Util';

describe('$Response', function() {
    it('constructor', function() {
        expect(new $Responses.default({})).to.deep.eq({
            response: { $responseContent: '' }
        });
    });
});

describe('$Responses', function() {
    let $request,
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
    afterEach(simple.restore);
    describe('BaseResponse', function() {
        beforeEach(function() {
            $injectorMock = mock($Injector, 'get', () => [ $request, $response ]);
        });
        describe('constructor', function() {
            it('test content type from request.headers.accept', function() {
                response = new $Responses.BaseResponse();
                expect(response.responseContentType).to.eq('text/html');
                expect(
                    response.responseHeaders[ 'Content-Type' ]
                ).to.eq('text/html');
            });
            it('test content type no "," use request.path', function() {
                $injectorMock.returnWith([
                    {
                        headers: {
                            accept: 'text/plain'
                        },
                        path: 'test.html',
                        route: 'test',
                        otherwise: 'test'
                    },
                    $response
                ]);
                response = new $Responses.BaseResponse();
                expect(response.path).to.eq('test.html');
                expect(response.route).to.eq('test');
                expect(response.otherwise).to.eq('test');
                expect(response.responseContentType).to.eq('text/html');
                expect(
                    response.responseHeaders[ 'Content-Type' ]
                ).to.eq('text/html');
            });
            it('test content type empty headers use request.path', function() {
                $injectorMock.returnWith([
                    {
                        headers: {},
                        path: 'test.html'
                    },
                    $response
                ]);
                response = new $Responses.BaseResponse();
                expect(response.responseContentType).to.eq('text/html');
                expect(
                    response.responseHeaders[ 'Content-Type' ]
                ).to.eq('text/html');
            });
            it('test content type no headers use request.path', function() {
                $injectorMock.returnWith([
                    {
                        path: 'test.html'
                    },
                    $response
                ]);
                response = new $Responses.BaseResponse();
                expect(response.responseContentType).to.eq('text/html');
                expect(
                    response.responseHeaders[ 'Content-Type' ]
                ).to.eq('text/html');
            });
        });
        describe('methods', function() {
            beforeEach(function() {
                response = new $Responses.BaseResponse();
            });
            it('head', function() {
                expect(response.response.test).to.eq('test');
                expect(response.head()).to.eq(response);
                expect(writeHeadSpy.calls[0].args).to.deep.eq(
                    [ 200, 'Ok', { 'Content-Type': 'text/html' } ]
                );
            });
            describe('write', function() {
                beforeEach(function() {
                    mock(response, 'writeSync', () => true);
                });
                it(
                    'test write calls response.writeSync',
                    function() {
                        response.write();
                        assert(response.writeSync.called);
                    }
                );
            });
            describe('writeSync', function() {
                beforeEach(function() {
                    mock($TemplateCache, '$$templateLoader', () => 'test');
                });
                it(
                    'test writeSync calls $$templateLoader',
                    function() {
                        response.writeSync();
                        expect(
                            $TemplateCache.$$templateLoader.calls[0].args[0]
                        ).to.eq('html/index.html');
                        expect(
                            response.response.write.calls[0].args[0]
                        ).to.eq('test');
                    }
                );
            });
        });
    });
    describe('AssetResponse', function() {
        let BaseResponseMock;

        beforeEach(function() {
            BaseResponseMock = mock(
                $Responses.BaseResponse.prototype,
                'constructor',
                () => true
            );
            $injectorMock = mock($Injector, 'get', () => $request);
        });
        describe('constructor', function() {
            it('test content type from request.headers.accept', function() {
                response = new $Responses.AssetResponse();
                assert(BaseResponseMock.called);
                expect(response.path).to.eq('test.html');
            });
        });
        describe('methods', function() {
            let headMock;

            beforeEach(function() {

                headMock = mock(
                    $Responses.BaseResponse.prototype,
                    'head',
                    () => true
                );
                response = new $Responses.AssetResponse();
            });
            it('head', function() {
                expect(response.head()).to.eq(response);
                assert(headMock.called);
            });
            describe('write', function() {
                let assetCacheGetMock,
                    assetCachePutMock,
                    $$templateLoaderMock;

                beforeEach(function() {
                    mock($CacheFactory.prototype, 'constructor', () => false);
                    assetCacheGetMock = mock(
                        $CacheFactory.prototype,
                        'get',
                        () => false
                    );
                    assetCachePutMock = mock(
                        $CacheFactory.prototype,
                        'put',
                        () => true
                    );
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
                it('test no asset cache, no asset template', function() {
                    let headMock,
                        unknownWriteSpy = spy();
                    $$templateLoaderMock.returnWith(false);
                    mock(
                        $Responses.UnknownResponse.prototype,
                        'constructor',
                        () => true
                    );
                    headMock = mock(
                        $Responses.UnknownResponse.prototype,
                        'head',
                        () => ({ write: unknownWriteSpy })
                    );
                    response.write();
                    assert(headMock.called);
                    assert(unknownWriteSpy.called);
                });
                it('test asset from $$templateLoader, no caching', function() {
                    response.write();
                    expect(assetCachePutMock).to.not.have.been.called;
                    assert(writeSpy.called);
                });
                it('test asset from $$templateLoader, caching is false', function() {
                    config.cacheStaticAssets = false;
                    response.write();
                    expect(assetCachePutMock).to.not.have.been.called;
                    assert(writeSpy.called);
                });
                it('test asset from $$templateLoader, caching', function() {
                    config.cacheStaticAssets = true;
                    response.write();
                    expect(
                        assetCachePutMock.calls[0].args
                    ).to.deep.eq([ 'test.html', 'test' ]);
                    assert(writeSpy.called);
                });
                describe('assetCache', function() {
                    beforeEach(function() {
                        assetCacheGetMock.returnWith('test');
                        $$templateLoaderMock.returnWith(false);
                    });
                    it('test asset from assetCache, no caching', function() {
                        response.write();
                        expect(assetCachePutMock).to.not.have.been.called;
                        assert(writeSpy.called);
                    });
                    it('test asset from assetCache, caching is false', function() {
                        config.cacheStaticAssets = false;
                        response.write();
                        expect(assetCachePutMock).to.not.have.been.called;
                        assert(writeSpy.called);
                    });
                    it('test asset from assetCache, caching', function() {
                        config.cacheStaticAssets = true;
                        response.write();
                        expect(
                            assetCachePutMock.calls[0].args
                        ).to.deep.eq([ 'test.html', 'test' ]);
                        assert(writeSpy.called);
                    });
                });
            });
        });
        describe('$isRoutedAssetResourceResponse', function() {
            let findMock;

            beforeEach(function() {
                config.staticDirs = [ 'test', 'test2' ];
                findMock = mock($FileUtil, 'find', () => true)
            });
            afterEach(function() {
                delete config.staticDirs;
            });
            it('test found asset', function() {
                expect(
                    $Responses.AssetResponse.$isRoutedAssetResourceResponse()
                ).to.be.true;
            });
            it('test did not find asset', function() {
                findMock.returnWith(false);
                expect(
                    $Responses.AssetResponse.$isRoutedAssetResourceResponse()
                ).to.be.false;
            });
        });
    });
    describe('RedirectResponse', function() {
        let BaseResponseMock,
            $injectorMock;

        beforeEach(function() {
            BaseResponseMock = mock(
                $Responses.BaseResponse.prototype,
                'constructor',
                function() {
                    this.otherwise = 'test2';
                }
            );
        });
        describe('constructor', function() {
            it('test with argument path', function() {
                let response = new $Responses.RedirectResponse('test');
                assert(BaseResponseMock.called);
                expect(response.path).to.eq('test');
            });
            it('test without argument path', function() {
                let response = new $Responses.RedirectResponse();
                assert(BaseResponseMock.called);
                expect(response.path).to.eq('test2');
            });
        });
        describe('methods', function() {
            beforeEach(function() {
                response = new $Responses.RedirectResponse('test');

                $response.end = spy();
                $response.setHeader = spy();
                response.response = $response;
            });
            it('head', function() {
                expect(response.head()).to.eq(response);
                expect(response.response.statusCode).to.eq(302);
                expect(
                    $response.setHeader.calls[0].args
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
    describe('UnknownResponse', function() {
        let BaseResponseMock,
            $$templateLoaderMock;

        beforeEach(function() {
            BaseResponseMock = mock(
                $Responses.BaseResponse.prototype,
                'constructor',
                () => true
            );
            $$templateLoaderMock = mock(
                $TemplateCache,
                '$$templateLoader',
                () => 'test'
            );
        });
        it('constructor', function() {
            let response = new $Responses.UnknownResponse();
            assert(BaseResponseMock.called);
            expect($$templateLoaderMock.calls[0].args[0]).to.eq('html/404.html');
        });
        describe('methods', function() {
            beforeEach(function() {
                response = new $Responses.UnknownResponse();
                response.response = $response;
            });
            it('head', function() {
                expect(response.head()).to.eq(response);
                expect(
                    writeHeadSpy.calls[0].args
                ).to.deep.eq([ 404, 'File Not Found', $response.headers ]);
            });
            it('write', function() {
                response.write();
                expect(writeSpy.calls[0].args[0]).to.eq('test');
            });
        });
    });
    describe('ErrorResponse', function() {
        let BaseResponseMock;

        beforeEach(function() {
            BaseResponseMock = mock(
                $Responses.BaseResponse.prototype,
                'constructor',
                () => true
            );
        });
        describe('constructor', function() {
            afterEach(function() {
                delete config.development;
            });
            it('test no error', function() {
                let response = new $Responses.ErrorResponse();
                assert(BaseResponseMock.called);
                expect(response.html).to.eq('<h1>Internal Server Error</h1>');
            });
            it('test error with stack', function() {
                config.development = true;
                let e = new Error('test'),
                    response = new $Responses.ErrorResponse(e);
                assert(BaseResponseMock.called);
                expect(response.html).to.eq(`<h1>${e}</h1><p>${e.stack}</p>`);
            });
            it('test error without stack', function() {
                config.development = true;
                let e = new Error('test'),
                    response = new $Responses.ErrorResponse('test');
                assert(BaseResponseMock.called);
                expect(response.html).to.eq('<h1>test</h1><p>No Traceback</p>');
            });
        });
        describe('methods', function() {
            beforeEach(function() {
                response = new $Responses.ErrorResponse();
                response.response = $response;
            });
            it('head', function() {
                expect(response.head()).to.eq(response);
                expect(
                    writeHeadSpy.calls[0].args
                ).to.deep.eq([ 500, 'Internal Server Error', $response.headers ]);
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
    describe('$CustomResponse', function() {
        let BaseResponseMock;

        beforeEach(function() {
            BaseResponseMock = mock(
                $Responses.BaseResponse.prototype,
                'constructor',
                () => true
            );
        });
        it('constructor', function() {
            let response = new $Responses.$CustomResponse();
            assert(BaseResponseMock.called);
        });
        describe('methods', function() {
            let html;

            beforeEach(function() {
                html = 'test';
                response = new $Responses.$CustomResponse();
                response.response = $response;
            });
            describe('head', function() {
                beforeEach(function() {
                    response.responseHeaders = {};
                });
                it('test without header message', function() {
                    expect(response.head(504, null)).to.eq(response);
                    expect(
                        writeHeadSpy.calls[0].args
                    ).to.deep.eq([ 504, 'Gateway Timeout', {} ]);
                });
                it('test with header message', function() {
                    expect(response.head(200, 'test')).to.eq(response);
                    expect(
                        writeHeadSpy.calls[0].args
                    ).to.deep.eq([ 200, 'test', {} ]);
                });
                it('test with additional response headers', function() {
                    let test = 'test';
                    expect(response.head(504, null, { test })).to.eq(response);
                    expect(
                        writeHeadSpy.calls[0].args
                    ).to.deep.eq([ 504, 'Gateway Timeout', { test } ]);
                });
            });
            it('write', function() {
                response.write(html);
                expect(writeSpy.calls[0].args[0]).to.eq(html);
            });
            it('writeSync', function() {
                response.writeSync(html);
                expect(writeSpy.calls[0].args[0]).to.eq(html);
            });
        });
    });
});