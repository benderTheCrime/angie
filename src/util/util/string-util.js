/**
 * @module string-util.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 12/08/2015
 */

/**
 * @desc Util is a silent utility class which is not available via any provider
 * on the app object. The only way to access the methods on this class is to
 * import the module. It holds methods quintessential to string manipulation.
 * @since 0.3.1
 */
class StringUtil {

    static capitalize(str) {
        return this.isString(str) && (str[ 0 ] ? str[ 0 ].toUpperCase() : '') +
            (str.length > 1 ? str.slice(1) : '');
    }

    /**
     * @desc Util helper to replace leading slashes
     * @since 0.2.3
     * @param {string} str [param=''] String to process
     * @returns {string} The str param with stripped leading slashes
     * @example 'test' === $StringUtil.removeTrailingLeadingSlashes('/test'); // true
     */
    static removeLeadingSlashes(str = '') {
        return this.isString(str) && str.replace(/(^(\/))/g, '');
    }

    /**
     * @desc Util helper to replace trailing slashes
     * @since 0.2.3
     * @param {string} str [param=''] String to process
     * @returns {string} The str param with stripped trailing slashes
     * @example 'test' === $StringUtil.removeTrailingLeadingSlashes('test/'); // true
     */
    static removeTrailingSlashes(str = '') {
        return this.isString(str) && str.replace(/((\/)$)/g, '');
    }

    /**
     * @desc Util helper to replace leading and trailing slashes
     * @since 0.2.3
     * @param {string} str [param=''] String to process
     * @returns {string} The str param with stripped trailing and leading slashes
     * @example 'test' === $StringUtil.removeTrailingLeadingSlashes('/test/'); // true
     */
    static removeTrailingLeadingSlashes(str = '') {
        return this.isString(str) && str.replace(/(^(\/)|(\/)$)/g, '');
    }

    /**
     * @desc Util helper to replace dash/slash separation with camelCase
     * @since 0.2.4
     * @param {string} str String to process
     * @returns {string} The str param converted to camelCase
     * @example $StringUtil.toCamel('test-test'); // = 'testTest'
     */
    static toCamel(str) {
        return this.isString(str) && str.toLowerCase().replace(
            /[-_][A-Za-z]/g, m => m.toUpperCase().replace(/[-_]/g, '')
        );
    }

    /**
     * @desc Util helper to replace camelCase with underscore_separation
     * @since 0.2.4
     * @param {string} str String to process
     * @returns {string} The str param converted to underscore_separation
     * @example $StringUtil.toCamel('testTest'); // = 'test_test'
     */
    static toUnderscore(str) {
        return this.isString(str) && this.toFormat(str, '_');
    }

    /**
     * @desc Util helper to replace camelCase with dash-separation
     * @since 0.2.4
     * @param {string} str String to process
     * @returns {string} The str param converted to dash-separation
     * @example $StringUtil.toDash('testTest'); // = 'test-test'
     */
    static toDash(str) {
        return this.isString(str) && this.toFormat(str, '-');
    }

    static toClassCase(str) {
        return this.isString(str) && this.capitalize(this.toCamel(str));
    }

    /**
     * @desc Util helper to perform `toDash` or `toUnderscore` style string
     * serilaization
     * @since 0.2.4
     * @param {string} str String to process
     * @param {string} del Character with which to replace camelCase capitals
     * @returns {string} The str param converted to `del` separation
     * @example $StringUtil.toFormat('testTest', '-'); // = 'test-test'
     * @example $StringUtil.toFormat('testTest', '_'); // = 'test_test'
     */
    static toFormat(str, del) {
        return this.isString(str) && str.replace(/([A-Z]+)/g, `${del}$1`)
            .toLowerCase();
    }

    static isString(str) {
        return typeof str === 'string';
    }
}

export default StringUtil;