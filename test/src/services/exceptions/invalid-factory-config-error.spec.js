// Test Modules
import { expect } from          'chai';
import simple, { mock } from    'simple-mock';

// System Modules
import { cyan } from            'chalk';
import $LogProvider from        'angie-log';

// Angie Modules
const TEST_ENV =                global.TEST_ENV || 'src',
    $Exceptions =               require(`../../../../${TEST_ENV}/services/exceptions`);

describe('$$InvalidFactoryConfigError', function() {
    const MSG_FN = (t, n) => `Invalid configuration for ${t} ${cyan(n)}`;

    beforeEach(function() {
        mock($LogProvider, 'error', () => false);
    });
    afterEach(simple.restore);
    it('constructor', function() {
        const MSG = MSG_FN('factory', 'test');
        expect(
            () => new $Exceptions.$$InvalidFactoryConfigError('test')
        ).to.throw(SyntaxError);
        expect($LogProvider.error.calls[0].args[0]).to.eq(MSG);
    });
});