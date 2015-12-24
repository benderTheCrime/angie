// Test Modules
import { expect } from            'chai';
import simple, { mock } from      'simple-mock';

// Angie Modules
const TEST_ENV =                  global.TEST_ENV || 'src',
    $Util =                       require(`../../../${TEST_ENV}/util/util`);

describe('$Util', function() {
    it('noop', function() {
        expect($Util.noop()).to.be.undefined;
    });
});