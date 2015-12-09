/**
 * @module file-util.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 12/08/2015
 */

// System Modules
import fs from              'fs';

// Angie Modules
import StringUtil from      './string-util';

/**
 * @desc $FileUtil is a silent utility class which is not available via any provider
 * on the app object. The only way to access the methods on this class is to
 * import the module. It holds methods quintessential to file management.
 * @since 0.3.1
 */
class FileUtil {

    /**
     * @desc Util helper to help find files in the specified root
     * @since 0.2.4
     * @param {string} root The root directory in which to find files
     * @param {string} target The desired file name
     * @returns {string} The absolute path to the file
     * @example $FileUtil.find(process.cwd(), 'test');
     */
    static find(root, target) {

        // Handle slashes
        target = StringUtil.removeTrailingLeadingSlashes(target);

        // Pull this out because it is used several times
        const fileDirectoryExists = function fileDirectoryExists(n, t) {
            try {
                return fs.lstatSync(n)[ `is${t}` ]();
            } catch(e) {
                return false;
            }
        };

        let path;
        if (target.indexOf('/') > -1) {

            // We can just search the root for the file
            path = `${root}/${target}`;
        } else {

            // If file has no slash, search in all directories
            const fn = function deepFindFile(root, target) {
                let files = fs.readdirSync(root);
                for (let i = 0; i < files.length; ++i) {
                    let file = files[i],
                        isDir = fileDirectoryExists(file, 'Directory');
                    if (isDir) {

                        // We have a directory and we need to recurse through it
                        fn(`${root}/${file}`, target);
                    } else if (file.indexOf(target) > -1) {
                        path = `${root}/${target}`;
                    }
                    if (path) {
                        break;
                    }
                }
            };

            // Recursively call for all roots
            fn(root, target);
        }

        // Check to see that the path we found is an actual file
        if (
            (path || path === '') &&
            fileDirectoryExists(path, 'File')
        ) {
            return path;
        }
    }
}

export default FileUtil;