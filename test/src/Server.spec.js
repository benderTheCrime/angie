// Test Modules
import { assert, expect } from      'chai';
import simple, { mock, spy } from   'simple-mock';

// System Modules
import os from                      'os';
import cluster from                 'cluster';
import http from                    'http';
import https from                   'https';
import yargs from                   'yargs';
import { cyan } from                'chalk';
import $LogProvider from            'angie-log';

// Angie Modules
import app from                     '../../src/Angie';
import * as Server from             '../../src/Server';
import { config } from              '../../src/Config';
import $Request from                '../../src/services/request';
import * as $Responses from         '../../src/services/response';

/* eslint-disable no-unused-expressions */
describe('Server', function() {
    const noop = () => false;
    const then = fn => {
        fn();
        return { then, catch: then };
    };
    const PROM_MOCK = () => ({ then, catch: then });

    describe('$$cluster', function() {
        afterEach(simple.restore);
        describe('test cluster master', function() {
            beforeEach(function() {
                yargs([]);
                cluster.isMaster = true;
                mock($LogProvider, 'info', noop);
                mock($LogProvider, 'warn', noop);
                mock(os, 'cpus', () => [ {} ]);
                mock(cluster, 'fork', noop);
                mock(cluster, 'on', noop);

            });
            afterEach(function() {
                delete config.development;
            });
            it('no development config', function() {
                Server.$$cluster();
                expect($LogProvider.info.calls[ 0 ].args[ 0 ]).to.eq(
                    `Starting ${cyan('cluster')} on 1 core(s)`
                );
                assert(!$LogProvider.warn.called);
                expect(cluster.fork.callCount).to.eq(1);
                expect(
                    cluster.on.calls[ 0 ].args
                ).to.deep.eq([ 'exit', cluster.fork ]);
                expect(cluster.on.callCount).to.eq(1);
            });
            it('development config', function() {
                config.development = true;
                Server.$$cluster();
                expect($LogProvider.info.calls[ 0 ].args[ 0 ]).to.eq(
                    `Starting ${cyan('cluster')} on 1 core(s)`
                );
                assert($LogProvider.warn.called);
                expect(cluster.fork.callCount).to.eq(1);
                expect(
                    cluster.on.calls[ 0 ].args
                ).to.deep.eq([ 'exit', cluster.fork ]);
                expect(cluster.on.callCount).to.eq(1);
            });
            it('no development config, no refork', function() {
                yargs([ 'cluster', '--norefork' ]);
                Server.$$cluster();
                expect($LogProvider.info.calls[ 0 ].args[ 0 ]).to.eq(
                    `Starting ${cyan('cluster')} on 1 core(s)`
                );
                assert(!$LogProvider.warn.called);
                expect(cluster.fork.callCount).to.eq(1);
                assert(!cluster.on.called);
            });
        });
        describe('test fork', function() {
            beforeEach(function() {
                cluster.isMaster = false;
                mock(Server, '$$server', noop);
            });
            xit('test $$server called', function() {
                Server.$$cluster();
                assert(Server.$$server.called);
            });
        });
    });
    describe('$$server', function() {
        let request,
            response,
            listen,
            timeoutMock,
            dataMock,
            routeMock,
            end,
            head,
            writeSync,
            e;

        beforeEach(function() {
            yargs([]);
            e = new Error();
            listen = spy(function() {
                return {
                    catch(fn) {
                        fn(e);
                    }
                };
            });
            end = spy();
            request = {
                url: 'test',
                method: 'GET'
            };
            response = {
                end,
                _header: 'test',
                setHeader: spy()
            };
            mock(app, '$$load', PROM_MOCK);
            mock(http, 'createServer', function(fn) {
                fn(request, response);
                return { listen };
            });
            mock(https, 'createServer', function(fn) {
                fn(request, response);
                return { listen };
            });
            timeoutMock = mock(global, 'setTimeout', () => true);
            mock(global, 'clearTimeout', () => true);
            dataMock = mock($Request.prototype, '$$data', PROM_MOCK);
            routeMock = mock($Request.prototype, '$$route', noop);
            writeSync = spy();
            head = spy(function() {
                return { writeSync };
            });
            mock($Responses, 'ErrorResponse', () => ({ head }));
            mock($Responses, '$CustomResponse', () => ({ head }));
            mock($Responses.default.prototype, 'constructor', function() {
                return { response };
            });
            mock(app, 'service', function() {
                return this;
            });
            mock($LogProvider, 'error', noop);
            mock($LogProvider, 'warn', noop);
            mock($LogProvider, 'info', noop);
        });
        afterEach(simple.restore);
        it('test call with http', function() {
            Server.$$server([ 'server', 1234 ]);
            expect(response.setHeader.callCount).to.eq(2);
            assert(http.createServer.called);
            expect(https.createServer).to.not.have.been.called;
            assert(global.setTimeout.called);
            assert(global.clearTimeout.called);
            assert(dataMock.called);
            assert(routeMock.called);
            expect(
                $LogProvider.error.calls[ 0 ].args
            ).to.deep.eq([ 'GET', 'test', 'test' ]);
            assert(head.called);
            assert(writeSync.called);
            expect(listen.calls[ 0 ].args[ 0 ]).to.eq(1234);
            expect(end.callCount).to.eq(2);
            expect(
                $LogProvider.info.calls[ 0 ].args[ 0 ]
            ).to.eq('Serving on port 1234');
        });
        it('test call with http, X-Frame-Options config set', function(cb) {
            config.setXFrameOptions = 'SAMEORIGIN';
            Server.$$server([ 'server', 1234 ]).then(function() {
                expect(response.setHeader.callCount).to.eq(3);
                assert(http.createServer.called);
                expect(https.createServer).to.not.have.been.called;
                assert(global.setTimeout.called);
                assert(global.clearTimeout.called);
                assert(dataMock.called);
                assert(routeMock.called);
                expect(
                    $LogProvider.error.calls[ 0 ].args
                ).to.deep.eq([ 'GET', 'test', 'test' ]);
                assert(head.called);
                assert(writeSync.called);
                expect(listen.calls[ 0 ].args[ 0 ]).to.eq(1234);
                expect(end.callCount).to.eq(2);
                expect(app.service.calls[ 0 ].args[ 0 ]).to.eq('$server');
                expect(
                    $LogProvider.info.calls[ 0 ].args[ 0 ]
                ).to.eq('Serving on port 1234');
                delete config.setXFrameOptions;
            }).then(cb);
        });
        it('test call with http and argument -p', function() {
            yargs([ '-p', '9999' ]);
            Server.$$server([ 'server', 1234 ]);
            expect(response.setHeader.callCount).to.eq(2);
            assert(http.createServer.called);
            expect(https.createServer).to.not.have.been.called;
            assert(global.setTimeout.called);
            assert(global.clearTimeout.called);
            assert(dataMock.called);
            assert(routeMock.called);
            expect(
                $LogProvider.error.calls[ 0 ].args
            ).to.deep.eq([ 'GET', 'test', 'test' ]);
            assert(head.called);
            assert(writeSync.called);
            expect(listen.calls[ 0 ].args[ 0 ]).to.eq(9999);
            expect(end.callCount).to.eq(2);
            expect(app.service.calls[ 0 ].args[ 0 ]).to.eq('$server');
            expect(
                $LogProvider.info.calls[ 0 ].args[ 0 ]
            ).to.eq('Serving on port 9999');
        });
        it('test call with http and argument --port', function() {
            yargs([ '--port', '9999' ]);
            Server.$$server([ 'server', 1234 ]);
            expect(response.setHeader.callCount).to.eq(2);
            assert(http.createServer.called);
            expect(https.createServer).to.not.have.been.called;
            assert(global.setTimeout.called);
            assert(global.clearTimeout.called);
            assert(dataMock.called);
            assert(routeMock.called);
            expect(
                $LogProvider.error.calls[ 0 ].args
            ).to.deep.eq([ 'GET', 'test', 'test' ]);
            assert(head.called);
            assert(writeSync.called);
            expect(listen.calls[ 0 ].args[ 0 ]).to.eq(9999);
            expect(end.callCount).to.eq(2);
            expect(app.service.calls[ 0 ].args[ 0 ]).to.eq('$server');
            expect(
                $LogProvider.info.calls[ 0 ].args[ 0 ]
            ).to.eq('Serving on port 9999');
        });
        it('test call with https and port 443', function() {
            Server.$$server([ 'server', 443 ]);
            expect(response.setHeader.callCount).to.eq(2);
            expect(http.createServer).to.not.have.been.called;
            assert(https.createServer.called);
            assert(global.setTimeout.called);
            assert(global.clearTimeout.called);
            assert(dataMock.called);
            assert(routeMock.called);
            expect(
                $LogProvider.error.calls[ 0 ].args
            ).to.deep.eq([ 'GET', 'test', 'test' ]);
            assert(head.called);
            assert(writeSync.called);
            expect(
                $LogProvider.error.calls[ 1 ].args
            ).to.deep.eq([ 'GET', 'test', 'test' ]);
            expect(listen.calls[ 0 ].args[ 0 ]).to.eq(443);
            expect(end.callCount).to.eq(2);
            expect(app.service.calls[ 0 ].args[ 0 ]).to.eq('$server');
            expect(
                $LogProvider.info.calls[ 0 ].args[ 0 ]
            ).to.eq('Serving on port 443');
        });
        it('test call with https and --usessl', function(cb) {
            yargs([ '--usessl' ]);
            Server.$$server([ 'server', 1234 ]).then(function() {
                expect(response.setHeader.callCount).to.eq(2);
                expect(http.createServer).to.not.have.been.called;
                assert(https.createServer.called);
                assert(global.setTimeout.called);
                assert(global.clearTimeout.called);
                assert(dataMock.called);
                assert(routeMock.called);
                expect(
                    $LogProvider.error.calls[ 0 ].args
                ).to.deep.eq([ 'GET', 'test', 'test' ]);
                assert(head.called);
                assert(writeSync.called);
                expect(
                    $LogProvider.error.calls[ 1 ].args
                ).to.deep.eq([ 'GET', 'test', 'test' ]);
                expect(listen.calls[ 0 ].args[ 0 ]).to.eq(443);
                expect(end.callCount).to.eq(2);
                expect(app.service.calls[ 0 ].args[ 0 ]).to.eq('$server');
                expect(
                    $LogProvider.info.calls[ 0 ].args[ 0 ]
                ).to.eq('Serving on port 443');
            }).then(cb);
        });
        it('test < 400 level response', function() {
            response.statusCode = 399;
            Server.$$server([ 'server', 1234 ]);
            expect(
                $LogProvider.info.calls[ 0 ].args
            ).to.deep.eq([ 'GET', 'test', 'test' ]);
        });
        it('test < 500 level response', function() {
            response.statusCode = 499;
            Server.$$server([ 'server', 1234 ]);
            expect(
                $LogProvider.warn.calls[ 0 ].args
            ).to.deep.eq([ 'GET', 'test', 'test' ]);
        });
        it('test >= 500 or unknown level response', function() {
            response.statusCode = 500;
            Server.$$server([ 'server', 1234 ]);
            expect(
                $LogProvider.error.calls[ 0 ].args
            ).to.deep.eq([ 'GET', 'test', 'test' ]);
        });
        it('test timeout response', function() {
            timeoutMock.callFn(fn => fn());
            routeMock.returnWith({
                then() {
                    return {
                        catch() {}
                    };
                }
            });
            Server.$$server([ 'server', 1234 ]);
            assert($Responses.$CustomResponse.called);
            expect(head.calls[ 0 ].args).to.deep.eq([ 504, null, {
                'Content-Type': 'text/html'
            } ]);
            expect(
                writeSync.calls[ 0 ].args[ 0 ]
            ).to.eq('<h1>Gateway Timeout</h1>');
            expect(
                $LogProvider.error.calls[ 0 ].args
            ).to.deep.eq([ 'test', 'test' ]);
            assert(end.called);
        });
    });
});

/* eslint-enable no-unused-expressions */