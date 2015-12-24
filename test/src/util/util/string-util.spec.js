// Test Modules
import { expect } from              'chai';
import simple, { mock } from        'simple-mock';

// Angie Modules
const TEST_ENV =                    global.TEST_ENV || 'src',
    StringUtil =                    require(`../../../../${TEST_ENV}/util/util/string-util`);

describe('StringUtil', function() {
    describe('removeLeadingSlashes', function() {
        it('test called without any arguments', function() {
            expect(StringUtil.removeLeadingSlashes()).to.eq('');
        });
        it('test leading slash', function() {
            expect(StringUtil.removeLeadingSlashes('/test')).to.eq('test');
        });
        it('test many leading slashes', function() {
            expect(StringUtil.removeLeadingSlashes('//test')).to.eq('/test');
        });
        it('test intra-string slashes', function() {
            expect(StringUtil.removeLeadingSlashes('t/e/s/t')).to.eq('t/e/s/t');
        });
    });
    describe('removeTrailingSlashes', function() {
        it('test called without any arguments', function() {
            expect(StringUtil.removeTrailingSlashes()).to.eq('');
        });
        it('test trailing slash', function() {
            expect(StringUtil.removeTrailingSlashes('test/')).to.eq('test');
        });
        it('test many trailing slashes', function() {
            expect(StringUtil.removeTrailingSlashes('test//')).to.eq('test/');
        });
        it('test intra-string slashes', function() {
            expect(StringUtil.removeTrailingSlashes('t/e/s/t')).to.eq('t/e/s/t');
        });
    });
    describe('removeTrailingLeadingSlashes', function() {
        it('test called without any arguments', function() {
            expect(StringUtil.removeTrailingLeadingSlashes()).to.eq('');
        });
        it('test leading slash', function() {
            expect(
                StringUtil.removeTrailingLeadingSlashes('/test')
            ).to.eq('test');
        });
        it('test many leading slashes', function() {
            expect(
                StringUtil.removeTrailingLeadingSlashes('//test')
            ).to.eq('/test');
        });
        it('test trailing slash', function() {
            expect(
                StringUtil.removeTrailingLeadingSlashes('test/')
            ).to.eq('test');
        });
        it('test many trailing slashes', function() {
            expect(
                StringUtil.removeTrailingLeadingSlashes('test//')
            ).to.eq('test/');
        });
        it('test leading & trailing slashes', function() {
            expect(
                StringUtil.removeTrailingLeadingSlashes('/test/')
            ).to.eq('test');
        });
        it('test intra-string slashes', function() {
            expect(
                StringUtil.removeTrailingLeadingSlashes('t/e/s/t')
            ).to.eq('t/e/s/t');
        });
    });
    describe('toCamel', function() {
        it('test a non-camel string', function() {
            expect(StringUtil.toCamel('test-test')).to.eq('testTest');
            expect(StringUtil.toCamel('test_test')).to.eq('testTest');
        });
        it('test an uppercase string', function() {
            expect(StringUtil.toCamel('TEST-TEST')).to.eq('testTest');
        });
        it('test no special chars', function() {
            expect(StringUtil.toCamel('testtest')).to.eq('testtest');
        });
    });
    describe('toUnderscore, toDash', function() {
        beforeEach(function() {
            mock(StringUtil, 'toFormat', function() {});
        });
        afterEach(simple.restore);
        it('test toUnderscore calls to format', function() {
            StringUtil.toUnderscore('test');
            expect(StringUtil.toFormat).to.have.been.called;
        });
        it('test toDash calls to format', function() {
            StringUtil.toDash('test');
            expect(StringUtil.toFormat).to.have.been.called;
        });
    });
    describe('toFormat', function() {
        it(
            'test toFormat properly formats camelCase to underscore_separation',
            function() {
                expect(StringUtil.toFormat('testTest', '_')).to.eq('test_test');
            }
        );
        it(
            'test toFormat properly formats camelCase to dash-separation',
            function() {
                expect(StringUtil.toFormat('testTest', '-')).to.eq('test-test');
            }
        );
    });
});