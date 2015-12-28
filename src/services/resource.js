/**
 * @module resource.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/16/2015
 */

// System Modules
import fetch from           'fetch';

class $Resource {
    static get(url) {
        return this.handler(url);
    }
    static post(url, args = {}) {
        args.method = 'POST';
        return this.handler(url, args);
    }
    static put(url, args = {}) {
        args.method = 'PUT';
        return this.handler(url, args);
    }
    static handler(url, args = {}) {

        // Only stringify a payload if it exists
        if (!/undefined|string/.test(typeof args.payload)) {
            args.payload = JSON.stringify(args.payload);
        }

        return new Promise(function(resolve, reject) {
            fetch.fetchUrl(url, args, function(e, meta, data) {
                if (e) {
                    reject(e);
                } else if (meta.status >= 400) {
                    reject(new Error(`Invalid Response Code for url ${url}`));
                }

                if (typeof data === 'string' || data instanceof Buffer) {

                    // We don't want to throw an error if it's an empty response
                    data = data.toString();
                    if (data !== '') {
                        try {
                            data = JSON.parse(data.toString());
                        } catch (e) {}
                    }
                }

                resolve(data);
            });
        });
    }
}

export default $Resource;