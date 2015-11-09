// Test Modules
import { expect } from          'chai';
import simple, { mock } from    'simple-mock';

// System Modules
import chalk from               'chalk';
import $LogProvider from        'angie-log';

// Angie Modules
const TEST_ENV =                global.TEST_ENV || 'src',
    $Exceptions =               require(`../../../../${TEST_ENV}/services/exceptions`);

describe('$$InvalidConfigError', function() {
    beforeEach(function() {
        mock($LogProvider, 'error', () => false);
    });
    it('constructor', function() {
        const msg = 'Invalid application configuration. Check your ' +
            chalk.cyan('AngieFile'),
            e = new $Exceptions.$$InvalidConfigError();
        expect($LogProvider.error.calls[0].args[0]).to.eq(msg);
        expect(e).to.deep.eq(new Error(msg));
    });
});