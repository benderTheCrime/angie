// Test Modules
import { expect } from          'chai';
import simple, { mock } from    'simple-mock';

// System Modules
import $LogProvider from        'angie-log';

// Angie Modules
const TEST_ENV =                global.TEST_ENV || 'src',
    $$ProjectCreationError =    require(`../../../../${TEST_ENV}/services/exceptions/project-creation-error`);

describe('$$ProjectCreationError', function() {
    beforeEach(function() {
        mock($LogProvider, 'error', () => false);
    });
    afterEach(simple.restore);
    it('constructor', function() {
        const ERR = new Error('test');
        expect(() => new $$ProjectCreationError(ERR)).to.throw(ERR);
        expect($LogProvider.error.calls[0].args[0]).to.eq(ERR);
    });
});