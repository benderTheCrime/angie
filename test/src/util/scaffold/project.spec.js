// Test Modules
import { expect, assert } from          'chai';
import simple, { mock } from            'simple-mock';

// System Modules
import yargs from                       'yargs';
import { default as promptly } from     'promptly';
import fs from                          'fs';
import util from                        'util';
import { bold, green } from             'chalk';
import $LogProvider from                'angie-log';

// Angie Modules
const TEST_ENV =                        global.TEST_ENV || 'src',
    project =                           require(`../../../../${TEST_ENV}/util/scaffold/project`),
    p = process;

describe('$$createProject', function() {
    let noop = () => null;

    beforeEach(function() {
        yargs([]);
        mock(fs, 'mkdirSync', noop);
        mock(fs, 'readFileSync', noop);
        mock(util, 'format', () => 'test');
        mock(fs, 'writeFileSync', noop);
        mock($LogProvider, 'info', noop);
        mock(p, 'exit', noop);
        mock(promptly, 'confirm', function(_, fn) {
            fn(null, true);
        });
        mock(promptly, 'prompt', function(_, obj = {}, fn) {
            fn(null, true);
        });
    });
    afterEach(() => simple.restore());
    it('test $$createProject called without a name', function() {
        expect(project).to.throw(Error);
    });
    it('test $$createProject called with a bad name', function() {
        expect(project.bind(null, {
            name: '111'
        })).to.throw(Error);
        expect(project.bind(null, {
            name: '#][]\\$%'
        })).to.throw(Error);
    });
    it('test $$createProject scaffolding error', function() {
        fs.mkdirSync.callFn(() => { throw new Error() });
        expect(project.bind(null, {
            name: 'test'
        })).to.throw(Error);
    });
    it('test successful project creation with directory', function(cb) {
        project({
            name: 'test',
            dir: 'test/'
        }).then(function() {
            expect(fs.mkdirSync.calls[0].args[0]).to.eq('test');
            expect(fs.mkdirSync.calls[1].args[0]).to.eq('test/src');
            expect(fs.mkdirSync.calls[2].args[0]).to.eq('test/src/constants');
            expect(fs.writeFileSync.calls[0].args).to.deep.eq([
                `test/src/constants/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[3].args[0]).to.eq('test/src/configs');
            expect(fs.writeFileSync.calls[1].args).to.deep.eq([
                `test/src/configs/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[4].args[0]).to.eq('test/src/services');
            expect(fs.writeFileSync.calls[2].args).to.deep.eq([
                `test/src/services/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[5].args[0]).to.eq('test/src/factories');
            expect(fs.writeFileSync.calls[3].args).to.deep.eq([
                `test/src/factories/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[6].args[0]).to.eq('test/src/controllers');
            expect(fs.writeFileSync.calls[4].args).to.deep.eq([
                `test/src/controllers/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[7].args[0]).to.eq('test/src/directives');
            expect(fs.writeFileSync.calls[5].args).to.deep.eq([
                `test/src/directives/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[8].args[0]).to.eq('test/src/models');
            expect(fs.writeFileSync.calls[6].args).to.deep.eq([
                `test/src/models/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[9].args[0]).to.eq('test/proto');
            expect(fs.writeFileSync.calls[7].args).to.deep.eq([
                `test/proto/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[10].args[0]).to.eq('test/test');
            expect(fs.mkdirSync.calls[11].args[0]).to.eq('test/test/src');
            expect(fs.writeFileSync.calls[8].args).to.deep.eq([
                `test/test/src/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[12].args[0]).to.eq('test/static');
            expect(fs.writeFileSync.calls[9].args).to.deep.eq([
                `test/static/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[13].args[0]).to.eq('test/templates');
            expect(fs.writeFileSync.calls[10].args).to.deep.eq([
                `test/templates/.keep`, 'Keep this directory'
            ]);
            expect(promptly.confirm.calls[0].args[0]).to.eq(
                `${bold(green('Do you want Angie to cache static assets?'))} :`
            );
            expect(util.format.calls[0].args.slice(0, 4)).to.deep.eq([
                fs.readFileSync(
                    '../../../../src/templates/json/AngieFile.template.json'
                ),
                'test',
                'test',
                true
            ]);
            expect(fs.writeFileSync.calls[11].args).to.deep.eq([
                'test/AngieFile.json', 'test', 'utf8'
            ]);
            expect(
                $LogProvider.info.calls[0].args[0]
            ).to.eq('Project successfully created');
            expect(p.exit.calls[0].args[0]).to.eq(0);
        }).then(cb);
    });
    it('test successful project creation with -n argument', function(cb) {
        yargs([ '-n', 'test' ]);
        project({
            name: 'test1',
            dir: 'test/'
        }).then(function() {
            expect(fs.mkdirSync.calls[0].args[0]).to.eq('test');
            expect(fs.mkdirSync.calls[1].args[0]).to.eq('test/src');
            expect(fs.mkdirSync.calls[2].args[0]).to.eq('test/src/constants');
            expect(fs.writeFileSync.calls[0].args).to.deep.eq([
                `test/src/constants/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[3].args[0]).to.eq('test/src/configs');
            expect(fs.writeFileSync.calls[1].args).to.deep.eq([
                `test/src/configs/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[4].args[0]).to.eq('test/src/services');
            expect(fs.writeFileSync.calls[2].args).to.deep.eq([
                `test/src/services/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[5].args[0]).to.eq('test/src/factories');
            expect(fs.writeFileSync.calls[3].args).to.deep.eq([
                `test/src/factories/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[6].args[0]).to.eq('test/src/controllers');
            expect(fs.writeFileSync.calls[4].args).to.deep.eq([
                `test/src/controllers/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[7].args[0]).to.eq('test/src/directives');
            expect(fs.writeFileSync.calls[5].args).to.deep.eq([
                `test/src/directives/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[8].args[0]).to.eq('test/src/models');
            expect(fs.writeFileSync.calls[6].args).to.deep.eq([
                `test/src/models/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[9].args[0]).to.eq('test/proto');
            expect(fs.writeFileSync.calls[7].args).to.deep.eq([
                `test/proto/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[10].args[0]).to.eq('test/test');
            expect(fs.mkdirSync.calls[11].args[0]).to.eq('test/test/src');
            expect(fs.writeFileSync.calls[8].args).to.deep.eq([
                `test/test/src/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[12].args[0]).to.eq('test/static');
            expect(fs.writeFileSync.calls[9].args).to.deep.eq([
                `test/static/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[13].args[0]).to.eq('test/templates');
            expect(fs.writeFileSync.calls[10].args).to.deep.eq([
                `test/templates/.keep`, 'Keep this directory'
            ]);
            expect(promptly.confirm.calls[0].args[0]).to.eq(
                `${bold(green('Do you want Angie to cache static assets?'))} :`
            );
            expect(util.format.calls[0].args.slice(0, 4)).to.deep.eq([
                fs.readFileSync(
                    '../../../../src/templates/json/AngieFile.template.json'
                ),
                'test',
                'test',
                true
            ]);
            expect(fs.writeFileSync.calls[11].args).to.deep.eq([
                'test/AngieFile.json', 'test', 'utf8'
            ]);
            expect(
                $LogProvider.info.calls[0].args[0]
            ).to.eq('Project successfully created');
            expect(p.exit.calls[0].args[0]).to.eq(0);
        }).then(cb);
    });
    it('test successful project creation with --name argument', function(cb) {
        yargs([ '--name', 'test' ]);
        project({
            name: 'test1',
            dir: 'test/'
        }).then(function() {
            expect(fs.mkdirSync.calls[0].args[0]).to.eq('test');
            expect(fs.mkdirSync.calls[1].args[0]).to.eq('test/src');
            expect(fs.mkdirSync.calls[2].args[0]).to.eq('test/src/constants');
            expect(fs.writeFileSync.calls[0].args).to.deep.eq([
                `test/src/constants/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[3].args[0]).to.eq('test/src/configs');
            expect(fs.writeFileSync.calls[1].args).to.deep.eq([
                `test/src/configs/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[4].args[0]).to.eq('test/src/services');
            expect(fs.writeFileSync.calls[2].args).to.deep.eq([
                `test/src/services/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[5].args[0]).to.eq('test/src/factories');
            expect(fs.writeFileSync.calls[3].args).to.deep.eq([
                `test/src/factories/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[6].args[0]).to.eq('test/src/controllers');
            expect(fs.writeFileSync.calls[4].args).to.deep.eq([
                `test/src/controllers/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[7].args[0]).to.eq('test/src/directives');
            expect(fs.writeFileSync.calls[5].args).to.deep.eq([
                `test/src/directives/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[8].args[0]).to.eq('test/src/models');
            expect(fs.writeFileSync.calls[6].args).to.deep.eq([
                `test/src/models/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[9].args[0]).to.eq('test/proto');
            expect(fs.writeFileSync.calls[7].args).to.deep.eq([
                `test/proto/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[10].args[0]).to.eq('test/test');
            expect(fs.mkdirSync.calls[11].args[0]).to.eq('test/test/src');
            expect(fs.writeFileSync.calls[8].args).to.deep.eq([
                `test/test/src/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[12].args[0]).to.eq('test/static');
            expect(fs.writeFileSync.calls[9].args).to.deep.eq([
                `test/static/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[13].args[0]).to.eq('test/templates');
            expect(fs.writeFileSync.calls[10].args).to.deep.eq([
                `test/templates/.keep`, 'Keep this directory'
            ]);
            expect(promptly.confirm.calls[0].args[0]).to.eq(
                `${bold(green('Do you want Angie to cache static assets?'))} :`
            );
            expect(util.format.calls[0].args.slice(0, 4)).to.deep.eq([
                fs.readFileSync(
                    '../../../../src/templates/json/AngieFile.template.json'
                ),
                'test',
                'test',
                true
            ]);
            expect(fs.writeFileSync.calls[11].args).to.deep.eq([
                'test/AngieFile.json', 'test', 'utf8'
            ]);
            expect(
                $LogProvider.info.calls[0].args[0]
            ).to.eq('Project successfully created');
            expect(p.exit.calls[0].args[0]).to.eq(0);
        }).then(cb);
    });
    it('test successful project creation with directory false confirm', function(cb) {
        mock(promptly, 'confirm', function(_, fn) {
            fn(false);
        });
        mock(promptly, 'prompt', function(_, obj = {}, fn) {
            fn(null, false);
        });
        project({
            name: 'test',
            dir: 'test/'
        }).then(function() {
            expect(fs.mkdirSync.calls[0].args[0]).to.eq('test');
            expect(fs.mkdirSync.calls[1].args[0]).to.eq('test/src');
            expect(fs.mkdirSync.calls[2].args[0]).to.eq('test/src/constants');
            expect(fs.writeFileSync.calls[0].args).to.deep.eq([
                `test/src/constants/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[3].args[0]).to.eq('test/src/configs');
            expect(fs.writeFileSync.calls[1].args).to.deep.eq([
                `test/src/configs/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[4].args[0]).to.eq('test/src/services');
            expect(fs.writeFileSync.calls[2].args).to.deep.eq([
                `test/src/services/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[5].args[0]).to.eq('test/src/factories');
            expect(fs.writeFileSync.calls[3].args).to.deep.eq([
                `test/src/factories/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[6].args[0]).to.eq('test/src/controllers');
            expect(fs.writeFileSync.calls[4].args).to.deep.eq([
                `test/src/controllers/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[7].args[0]).to.eq('test/src/directives');
            expect(fs.writeFileSync.calls[5].args).to.deep.eq([
                `test/src/directives/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[8].args[0]).to.eq('test/src/models');
            expect(fs.writeFileSync.calls[6].args).to.deep.eq([
                `test/src/models/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[9].args[0]).to.eq('test/proto');
            expect(fs.writeFileSync.calls[7].args).to.deep.eq([
                `test/proto/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[10].args[0]).to.eq('test/test');
            expect(fs.mkdirSync.calls[11].args[0]).to.eq('test/test/src');
            expect(fs.writeFileSync.calls[8].args).to.deep.eq([
                `test/test/src/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[12].args[0]).to.eq('test/static');
            expect(fs.writeFileSync.calls[9].args).to.deep.eq([
                `test/static/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[13].args[0]).to.eq('test/templates');
            expect(fs.writeFileSync.calls[10].args).to.deep.eq([
                `test/templates/.keep`, 'Keep this directory'
            ]);
            expect(promptly.confirm.calls[0].args[0]).to.eq(
                `${bold(green('Do you want Angie to cache static assets?'))} :`
            );
            expect(util.format.calls[0].args.slice(0, 4)).to.deep.eq([
                fs.readFileSync(
                    '../../../../src/templates/json/AngieFile.template.json'
                ),
                'test',
                'test',
                false
            ]);
            expect(fs.writeFileSync.calls[11].args).to.deep.eq([
                'test/AngieFile.json', 'test', 'utf8'
            ]);
            expect(
                $LogProvider.info.calls[0].args[0]
            ).to.eq('Project successfully created');
            expect(p.exit.calls[0].args[0]).to.eq(0);
        }).then(cb);
    });
    it('test successful project creation with "." directory', function(cb) {
        project({
            name: 'test',
            dir: '.'
        }).then(function() {
            expect(fs.mkdirSync.calls[0].args[0]).to.eq('src');
            expect(fs.mkdirSync.calls[1].args[0]).to.eq('src/constants');
            expect(fs.writeFileSync.calls[0].args).to.deep.eq([
                `src/constants/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[2].args[0]).to.eq('src/configs');
            expect(fs.writeFileSync.calls[1].args).to.deep.eq([
                `src/configs/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[3].args[0]).to.eq('src/services');
            expect(fs.writeFileSync.calls[2].args).to.deep.eq([
                `src/services/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[4].args[0]).to.eq('src/factories');
            expect(fs.writeFileSync.calls[3].args).to.deep.eq([
                `src/factories/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[5].args[0]).to.eq('src/controllers');
            expect(fs.writeFileSync.calls[4].args).to.deep.eq([
                `src/controllers/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[6].args[0]).to.eq('src/directives');
            expect(fs.writeFileSync.calls[5].args).to.deep.eq([
                `src/directives/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[7].args[0]).to.eq('src/models');
            expect(fs.writeFileSync.calls[6].args).to.deep.eq([
                `src/models/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[8].args[0]).to.eq('proto');
            expect(fs.writeFileSync.calls[7].args).to.deep.eq([
                `proto/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[9].args[0]).to.eq('test');
            expect(fs.mkdirSync.calls[10].args[0]).to.eq('test/src');
            expect(fs.writeFileSync.calls[8].args).to.deep.eq([
                `test/src/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[11].args[0]).to.eq('static');
            expect(fs.writeFileSync.calls[9].args).to.deep.eq([
                `static/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[12].args[0]).to.eq('templates');
            expect(fs.writeFileSync.calls[10].args).to.deep.eq([
                `templates/.keep`, 'Keep this directory'
            ]);
            expect(promptly.confirm.calls[0].args[0]).to.eq(
                `${bold(green('Do you want Angie to cache static assets?'))} :`
            );
            assert(promptly.prompt.called);
            expect(util.format.calls[0].args.slice(0, 4)).to.deep.eq([
                fs.readFileSync(
                    '../../../../src/templates/json/AngieFile.template.json'
                ),
                'test',
                'test',
                true
            ]);
            expect(fs.writeFileSync.calls[11].args).to.deep.eq([
                'AngieFile.json', 'test', 'utf8'
            ]);
            expect(
                $LogProvider.info.calls[0].args[0]
            ).to.eq('Project successfully created');
            expect(p.exit.calls[0].args[0]).to.eq(0);
        }).then(cb);
    });
    it('test successful project creation with -d', function(cb) {
        yargs([ '-d', 'test' ]);
        project({
            name: 'test',
            dir: 'test/'
        }).then(function() {
            expect(fs.mkdirSync.calls[0].args[0]).to.eq('test');
            expect(fs.mkdirSync.calls[1].args[0]).to.eq('test/src');
            expect(fs.mkdirSync.calls[2].args[0]).to.eq('test/src/constants');
            expect(fs.writeFileSync.calls[0].args).to.deep.eq([
                `test/src/constants/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[3].args[0]).to.eq('test/src/configs');
            expect(fs.writeFileSync.calls[1].args).to.deep.eq([
                `test/src/configs/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[4].args[0]).to.eq('test/src/services');
            expect(fs.writeFileSync.calls[2].args).to.deep.eq([
                `test/src/services/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[5].args[0]).to.eq('test/src/factories');
            expect(fs.writeFileSync.calls[3].args).to.deep.eq([
                `test/src/factories/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[6].args[0]).to.eq('test/src/controllers');
            expect(fs.writeFileSync.calls[4].args).to.deep.eq([
                `test/src/controllers/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[7].args[0]).to.eq('test/src/directives');
            expect(fs.writeFileSync.calls[5].args).to.deep.eq([
                `test/src/directives/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[8].args[0]).to.eq('test/src/models');
            expect(fs.writeFileSync.calls[6].args).to.deep.eq([
                `test/src/models/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[9].args[0]).to.eq('test/proto');
            expect(fs.writeFileSync.calls[7].args).to.deep.eq([
                `test/proto/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[10].args[0]).to.eq('test/test');
            expect(fs.mkdirSync.calls[11].args[0]).to.eq('test/test/src');
            expect(fs.writeFileSync.calls[8].args).to.deep.eq([
                `test/test/src/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[12].args[0]).to.eq('test/static');
            expect(fs.writeFileSync.calls[9].args).to.deep.eq([
                `test/static/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[13].args[0]).to.eq('test/templates');
            expect(fs.writeFileSync.calls[10].args).to.deep.eq([
                `test/templates/.keep`, 'Keep this directory'
            ]);
            expect(promptly.confirm.calls[0].args[0]).to.eq(
                `${bold(green('Do you want Angie to cache static assets?'))} :`
            );
            expect(util.format.calls[0].args.slice(0, 4)).to.deep.eq([
                fs.readFileSync(
                    '../../../../src/templates/json/AngieFile.template.json'
                ),
                'test',
                'test',
                true
            ]);
            expect(fs.writeFileSync.calls[11].args).to.deep.eq([
                'test/AngieFile.json', 'test', 'utf8'
            ]);
            expect(
                $LogProvider.info.calls[0].args[0]
            ).to.eq('Project successfully created');
            expect(p.exit.calls[0].args[0]).to.eq(0);
        }).then(cb);
    });
    it('test successful project creation with --dir', function(cb) {
        yargs([ '--dir', 'test' ]);
        project({
            name: 'test',
            dir: 'test/'
        }).then(function() {
            expect(fs.mkdirSync.calls[0].args[0]).to.eq('test');
            expect(fs.mkdirSync.calls[1].args[0]).to.eq('test/src');
            expect(fs.mkdirSync.calls[2].args[0]).to.eq('test/src/constants');
            expect(fs.writeFileSync.calls[0].args).to.deep.eq([
                `test/src/constants/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[3].args[0]).to.eq('test/src/configs');
            expect(fs.writeFileSync.calls[1].args).to.deep.eq([
                `test/src/configs/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[4].args[0]).to.eq('test/src/services');
            expect(fs.writeFileSync.calls[2].args).to.deep.eq([
                `test/src/services/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[5].args[0]).to.eq('test/src/factories');
            expect(fs.writeFileSync.calls[3].args).to.deep.eq([
                `test/src/factories/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[6].args[0]).to.eq('test/src/controllers');
            expect(fs.writeFileSync.calls[4].args).to.deep.eq([
                `test/src/controllers/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[7].args[0]).to.eq('test/src/directives');
            expect(fs.writeFileSync.calls[5].args).to.deep.eq([
                `test/src/directives/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[8].args[0]).to.eq('test/src/models');
            expect(fs.writeFileSync.calls[6].args).to.deep.eq([
                `test/src/models/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[9].args[0]).to.eq('test/proto');
            expect(fs.writeFileSync.calls[7].args).to.deep.eq([
                `test/proto/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[10].args[0]).to.eq('test/test');
            expect(fs.mkdirSync.calls[11].args[0]).to.eq('test/test/src');
            expect(fs.writeFileSync.calls[8].args).to.deep.eq([
                `test/test/src/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[12].args[0]).to.eq('test/static');
            expect(fs.writeFileSync.calls[9].args).to.deep.eq([
                `test/static/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[13].args[0]).to.eq('test/templates');
            expect(fs.writeFileSync.calls[10].args).to.deep.eq([
                `test/templates/.keep`, 'Keep this directory'
            ]);
            expect(promptly.confirm.calls[0].args[0]).to.eq(
                `${bold(green('Do you want Angie to cache static assets?'))} :`
            );
            expect(util.format.calls[0].args.slice(0, 4)).to.deep.eq([
                fs.readFileSync(
                    '../../../../src/templates/json/AngieFile.template.json'
                ),
                'test',
                'test',
                true
            ]);
            expect(fs.writeFileSync.calls[11].args).to.deep.eq([
                'test/AngieFile.json', 'test', 'utf8'
            ]);
            expect(
                $LogProvider.info.calls[0].args[0]
            ).to.eq('Project successfully created');
            expect(p.exit.calls[0].args[0]).to.eq(0);
        }).then(cb);
    });
    it('test successful project creation with no directory', function(cb) {
        const CWD = p.cwd();

        project({
            name: 'test'
        }).then(function() {
            expect(fs.mkdirSync.calls[0].args[0]).to.eq(`${CWD}/test`);
            expect(fs.mkdirSync.calls[1].args[0]).to.eq(`${CWD}/test/src`);
            expect(fs.mkdirSync.calls[2].args[0]).to.eq(
                `${CWD}/test/src/constants`
            );
            expect(fs.writeFileSync.calls[0].args).to.deep.eq([
                `${CWD}/test/src/constants/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[3].args[0]).to.eq(
                `${CWD}/test/src/configs`
            );
            expect(fs.writeFileSync.calls[1].args).to.deep.eq([
                `${CWD}/test/src/configs/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[4].args[0]).to.eq(
                `${CWD}/test/src/services`
            );
            expect(fs.writeFileSync.calls[2].args).to.deep.eq([
                `${CWD}/test/src/services/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[5].args[0]).to.eq(
                `${CWD}/test/src/factories`
            );
            expect(fs.writeFileSync.calls[3].args).to.deep.eq([
                `${CWD}/test/src/factories/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[6].args[0]).to.eq(
                `${CWD}/test/src/controllers`
            );
            expect(fs.writeFileSync.calls[4].args).to.deep.eq([
                `${CWD}/test/src/controllers/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[7].args[0]).to.eq(
                `${CWD}/test/src/directives`
            );
            expect(fs.writeFileSync.calls[5].args).to.deep.eq([
                `${CWD}/test/src/directives/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[8].args[0]).to.eq(`${CWD}/test/src/models`);
            expect(fs.writeFileSync.calls[6].args).to.deep.eq([
                `${CWD}/test/src/models/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[9].args[0]).to.eq(`${CWD}/test/proto`);
            expect(fs.writeFileSync.calls[7].args).to.deep.eq([
                `${CWD}/test/proto/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[10].args[0]).to.eq(`${CWD}/test/test`);
            expect(fs.mkdirSync.calls[11].args[0]).to.eq(`${CWD}/test/test/src`);
            expect(fs.writeFileSync.calls[8].args).to.deep.eq([
                `${CWD}/test/test/src/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[12].args[0]).to.eq(`${CWD}/test/static`);
            expect(fs.writeFileSync.calls[9].args).to.deep.eq([
                `${CWD}/test/static/.keep`, 'Keep this directory'
            ]);
            expect(fs.mkdirSync.calls[13].args[0]).to.eq(`${CWD}/test/templates`);
            expect(fs.writeFileSync.calls[10].args).to.deep.eq([
                `${CWD}/test/templates/.keep`, 'Keep this directory'
            ]);
            expect(promptly.confirm.calls[0].args[0]).to.eq(
                `${bold(green('Do you want Angie to cache static assets?'))} :`
            );
            assert(promptly.prompt.called);
            expect(util.format.calls[0].args.slice(0, 4)).to.deep.eq([
                fs.readFileSync(
                    '../../../../src/templates/json/AngieFile.template.json'
                ),
                'test',
                'test',
                true
            ]);
            expect(fs.writeFileSync.calls[11].args).to.deep.eq([
                `${CWD}/test/AngieFile.json`, 'test', 'utf8'
            ]);
            expect(
                $LogProvider.info.calls[0].args[0]
            ).to.eq('Project successfully created');
            expect(p.exit.calls[0].args[0]).to.eq(0);
        }).then(cb);
    });
});