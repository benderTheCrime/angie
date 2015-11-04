/**
 * @module cookie.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 10/29/2015
 */

// System Modules
import cookie from          'cookie';
import $Injector from       'angie-injector';

// TODO lookup getters and setters on classes
class $$CookieFactory {
    get (key) {
        let $request,
            cookies;
        try {
            $request = $Injector.get('$request');
        } catch(e) {
            $request = {};
        }

        cookies = this.fetch($request);
        if (cookies.hasOwnProperty(key)) {

            console.log(this.$$cookies[ key ]);
            return cookies[ key ].value;
        }
    }
    set (key, value, expiry) {
        let cookieStr = '',
            expiryStr,
            $request,
            cookies;
        try {
            $request = $Injector.get('$request');
        } catch(e) {
            $request = {};
        }

        for (let key in cookies) {
            let value = cookies[ key ];
            cookieStr += `${key}=${value},`;
        }

        if (expiry && expiry instanceof Date) {
            expiryStr = `expires=${expirty.toUTCString()}`;
        }

        cookieStr +=`${key}=${value};${expiryStr},`;

        // TODO no response
        console.log('RESPONSE', typeof $Injector.get('$response'));

        // Cannot really use getters and setters here
        $Injector.get('$response').header('Set-Cookie', cookieStr);
        return true;
    }
    fetch($request) {
        if (
            $request.headers &&
            $request.headers.hasOwnProperty('cookie')
        ) {
            return cookie.parse($request.headers.cookie);
        }
        return {};
    }
}

const $Cookie = new $$CookieFactory();
export default $Cookie;