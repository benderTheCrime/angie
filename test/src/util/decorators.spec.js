// Test Modules
// import { expect } from           'chai';
import { mock } from                'simple-mock';

// Angie Modules
const TEST_ENV = global.TEST_ENV || 'src';
const decorators = require(`../../../${TEST_ENV}/util/decorators`);

describe('decorators', function() {
    beforeEach(function() {
        if (typeof global.app === 'undefined') {
            global.app = {};
        }
    });
    describe('Controller', function() {
        beforeEach(function() {
            if (typeof global.app.Controllers === 'undefined') {
                global.app.Controllers = {};
            }
            mock(decorators, 'Controller', () => false);
        });
    });
    describe('directive', function() {
        beforeEach(function() {
            if (typeof global.app.directives === 'undefined') {
                global.app.directives = {};
            }
            mock(decorators, 'directive', () => false);
        });
    });
});