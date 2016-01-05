// Test Modules
import { assert, expect } from      'chai';
import simple, { mock, spy } from   'simple-mock';

// System Modules
import $Injector from               'angie-injector';

// Angie Modules
import * as $TemplateCache from     '../../../../src/factories/template-cache';
import BaseResponse from
    '../../../../src/services/responses/base-response';

/* eslint-disable max-nested-callbacks */
describe('BaseResponse', function() {
    let $request,
        $response,
        scoping,
        $injectorMock,
        header,
        write,
        response;

    beforeEach(function() {
        header = spy();
        write = spy();
        $request = {
            headers: {
                accept: 'text/html,'
            },
            path: 'test.html'
        };
        $response = {
            test: 'test',
            $responseContent: '',
            header,
            write
        };
        scoping = { $request, $response, $scope: {} };
    });
    beforeEach(function() {
        $injectorMock = mock($Injector, 'get', () => [ $request, $response ]);
    });
    afterEach(simple.restore);
    describe('constructor', function() {
        it('test content type from request.headers.accept', function() {
            response = new BaseResponse(scoping);
            expect(
                response.response.$headers[ 'Content-Type' ]
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
            response = new BaseResponse(scoping);
            expect(response.path).to.eq('test.html');
            expect(response.route).to.eq('test');
            expect(response.otherwise).to.eq('test');
            expect(
                response.response.$headers[ 'Content-Type' ]
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
            response = new BaseResponse(scoping);
            expect(
                response.response.$headers[ 'Content-Type' ]
            ).to.eq('text/html');
        });
        it('test content type no headers use request.path', function() {
            $injectorMock.returnWith([
                {
                    path: 'test.html'
                },
                $response
            ]);
            response = new BaseResponse(scoping);
            expect(
                response.response.$headers[ 'Content-Type' ]
            ).to.eq('text/html');
        });
    });
    describe('methods', function() {
        let header,
            write;

        beforeEach(function() {
            response = new BaseResponse(scoping);
            response.response = {
                header: header = spy(),
                write: write = spy(),
                $headers: {
                    test: 'test'
                }
            };
        });
        it('head', function() {
            expect(response.head()).to.eq(response);
            expect(response.response.statusCode).to.eq(200);
            expect(header.callCount === 1);
            expect(header.calls[ 0 ].args).to.deep.eq([ 'test', 'test' ]);
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
                        $TemplateCache.$$templateLoader.calls[ 0 ].args[ 0 ]
                    ).to.eq('html/index.html');
                    expect(write.calls[ 0 ].args[ 0 ]).to.eq('test');
                }
            );
        });
    });
});

/* eslint-enable max-nested-callbacks */