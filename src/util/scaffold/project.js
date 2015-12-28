/**
 * @module project.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/16/2015
 */

// System Modules
import { argv } from                    'yargs';

// Do not alias this as the commands mirror the global `confirm` and `prompt`
import { default as promptly } from     'promptly';
import fs from                          'fs';
import util from                        'util';
import {
    bold,
    green,
    red,
    cyan
} from                                  'chalk';
import $LogProvider from                'angie-log';

// Angie Modules
import { $StringUtil } from             '../util';
import $$ProjectCreationError from
    '../../services/exceptions/project-creation-error';

/**
 * @desc $$createProject is the function called when the CLI attempts to create
 * a project from the command line. This scaffolds the main folder in the
 * specified directory or no folder and then folders for commonly used providers
 * and the Angie config file (AngieFile.json).
 *
 * The CLI function to create a project will ask the user a series of questions.
 * The result of these questions will be passed to the AngieFile.json:
 *     - By default the `development` option is set to true
 *     - By default, the `databases` object has one sqlite3 database, but this
 * database is not instantiated
 *     - User will be prompted for caching of static assets
 *     - User will be prompted for default script file attachment
 *
 * This function will gracefully exit the process if successful and exit with
 * errors if unsuccessful.
 * @since 0.0.1
 * @todo If any more CLI arguments are required, you must abstract confirm/prompt
 * as functions
 * @param {object} args A list of arugments passed from the CLI parser
 * @param {string} args.name The name of the project being created. This must
 * consist of letters, dashes, & underscores
 * @param {string} args.dir [param=process.cwd()] The directory in which the
 * inner files of the project are created. CWD if no directory is specified.
 * @access private
 */
function $$createProject({ name, dir }) {

    // Parse the passed arguments object
    name = argv.name || argv.n || name;
    dir = $StringUtil.removeTrailingLeadingSlashes(argv.dir || dir);

    // if (!dir) {
    //     dir = process.cwd();
    // }

    // The process must exit if there is no passed name, or the name passed is
    // in an incorrect format
    if (!name) {
        throw new $$ProjectCreationError('No project name specified');
    } else if (
        /[0-9$%\^&*\)\(\<\>\\\/\.\,\`\?\+\!\~#@=\}\{\|\]\[\'\"\:\;]+/i.test(
            name
        )
    ) {

        // Being super specific about which characters are OK and which are not
        throw new $$ProjectCreationError(
            'Invalid project name: must be all letters, dashes, & underscores'
        );
    }

    // Make sure that we're creating the project in the right spot
    let mkDir = dir === '.' ? '' : dir,
        mkDirFiles = mkDir ? `${mkDir}/` : '',
        mkSub = `${mkDirFiles}src`.replace(/\/{2}/g, '/'),

        // cacheStaticAssets
        staticCache = false,

        // Default JS to be loaded with all HTML files
        defaultAppJavaScriptFilename;
    try {

        // We cannot create a dir if the argument is empty
        if (mkDir) {
            fs.mkdirSync(mkDir);
        }
        fs.mkdirSync(mkSub);

        // Create provider folders
        [
            'constants',
            'configs',
            'services',
            'factories',
            'controllers',
            'directives',
            'models'
        ].forEach(function(v) {
            fs.mkdirSync(`${mkSub}/${v}`);
            fs.writeFileSync(`${mkSub}/${v}/.keep`, 'Keep this directory');
        });

        // Create static folders
        [
            'proto',
            'test',
            'test/src',
            'static',
            'templates'
        ].forEach(function(v) {
            fs.mkdirSync(`${mkDirFiles}${v}`);
            if (v !== 'test') {
                fs.writeFileSync(
                    `${mkDirFiles}${v}/.keep`, 'Keep this directory'
                );
            }
        });
    } catch (e) {
        throw new $$ProjectCreationError(e);
    }

    // Wrap the prompts in a Promise
    return new Promise(function(resolve, reject) {
        promptly.confirm(
            'Do you want Angie to cache static assets? :',
            function(e, v) {
                if (e) {
                    reject(e);
                }
                resolve(v);
            }
        );
    }).then(function(v) {
        staticCache = !!v;
    }).then(function() {

        // Ask what the default JS filename should be
        return new Promise(function(resolve) {
            return promptly.prompt(
                'What would you like to call the "default" ' +
                'loaded script file (default is application.js)? :',
                {
                    default: 'application.js',
                    validator: function(v) {
                        if (v && v.indexOf('.js') === -1) {
                            throw new Error(
                                bold(red('Input must be a valid ".js" file.'))
                            );
                        }
                        return v.replace(/\/|\\/g, '');
                    }
                },
                function(e, v) {
                    resolve(v);
                }
            );
        });
    }).then(function(v) {
        defaultAppJavaScriptFilename = v;
    }).then(function() {

        // Read our AngieFile template and reproduce in the target directory
        let template = fs.readFileSync(
            `${__dirname}/../../templates/json/AngieFile.template.json`,
            'utf8'
        );
        template = util.format(
            template,
            name,
            name,
            staticCache,
            defaultAppJavaScriptFilename
        );
        fs.writeFileSync(
            `${mkDirFiles}AngieFile.json`,
            template,
            'utf8'
        );
        fs.writeFileSync(
            `${mkDirFiles}static/${defaultAppJavaScriptFilename}`,
            ''
        );

        $LogProvider.info('Project successfully created');
        console.log(bold(`
            You're well on your way to creating a robust, fullstack
            application! At this point, I recommend that you do the
            following:\n
            ${green('1.')}  Following the instructions to install the
            ORM (and Protocol Buffers).\n
            ${green('2.')}  Visit the quickstart documentation in the
            "md" folder of this application.\n
            ${green('3.')}  Look at some of the extensions you can use
            in tandem with your Angie application.\n
            ${green('4.')}  Use the ${cyan('AngieFile.json')}
            documentation to customize your application settings.
        `));
        process.exit(0);
    });
}

export default $$createProject;