// Test Modules
import { expect } from          'chai';
import simple, { mock } from    'simple-mock';

// System Modules
import chalk from               'chalk';
import $LogProvider from        'angie-log';

// Angie Modules
const TEST_ENV =                global.TEST_ENV || 'src',
    $$InvalidConfigError =      require(`../../../../${TEST_ENV}/services/exceptions/invalid-config-error`);

describe('$$InvalidConfigError', function() {
    beforeEach(function() {
        mock($LogProvider, 'error', () => false);
    });
    afterEach(simple.restore);
    it('constructor', function() {
        const MSG = 'Invalid application configuration. Check your ' +
            chalk.cyan('AngieFile');
        expect(() => new $$InvalidConfigError()).to.throw(Error);
        expect($LogProvider.error.calls[0].args[0]).to.eq(MSG);
    });
});