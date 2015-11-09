/**
 * @module cookie.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 10/29/2015
 */

// System Modules
import cookie from          'cookie';
import $Injector from       'angie-injector';

// TODO lookup getters and setters on classes
class $CookieFactory {
    constructor(request) {

        let cookies;

        if (request.headers && request.headers.hasOwnProperty('cookie')) {
            cookies = cookie.parse(request.headers.cookie);
        }

        this.$$cookies = cookies;
    }
    get (key) {
        if (this.$$cookies.hasOwnProperty(key)) {
            return this.$$cookies[ key ].value;
        }
    }
    set (key, value, expiry = +new Date()) {
        let cookieStr = '';

        this.$$cookies[ key ] = { value, expiry };

        for (let key in this.$$cookies) {
            let value = this.$$cookies[ key ].value,
                expiry = this.$$cookies[ key ].expiry;
            cookieStr += `${key}=${value};expires=${expiry.toUTCString()},`;
        }

        $Injector.get('$response').setHeader('Set-Cookie', cookieStr);
        return true;
    }
    fetch($request) {
        return this.$$cookies;
    }
}

export default $CookieFactory;