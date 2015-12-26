// Test Modules
import { expect } from            'chai';

// Angie Modules
const TEST_ENV = global.TEST_ENV || 'src';
const $Util = require(`../../../${TEST_ENV}/util/util`);

/* eslint-disable no-unused-expressions */
describe('$Util', function() {
    it('noop', function() {
        expect($Util.noop()).to.be.undefined;
    });
});

/* eslint-enable no-unused-expressions */