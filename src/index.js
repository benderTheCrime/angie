/**
 * @module index.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/16/2015
 */

// We need to require this before anything else
import './Config';

// System Modules
import { argv } from                'yargs';
import { exec } from                'child_process';
import { gray, bold } from          'chalk';
import $LogProvider from            'angie-log';

// Angie Modules
import $$createProject from         './util/scaffold/project';
import {
    $$watch,
    $$cluster,
    $$server
} from                              './Server';
import $$CommandLineError from      './services/exceptions/command-line-error';

if (argv.help || argv.h) {
    help();
} else {

    // Route the CLI request to a specific command
    switch ((argv._[ 0 ] || '').toLowerCase()) {
    case 'help':
        help();
        break;
    case 'server':
        $$server(argv._);
        break;
    case 's':
        $$server(argv._);
        break;
    case 'watch':
        $$watch(argv._);
        break;
    case 'cluster':
        $$cluster();
        break;
    case 'create':
        handleCreationTask();
        break;
    case 'createproject':
        $$createProject({ name: argv._[ 1 ], dir: argv._[ 2 ] });
        break;
    case 'c':
        handleCreationTask();
        break;
    case 'run':
        handleRunTask();
        break;
    case 'r':
        handleRunTask();
        break;
    case 'test':
        runTests();
        break;
    case 'shell':
        $$watch(argv._);
        break;
    default:
        help();
    }
}

function runTests() {
    exec(`cd ${__dirname} && gulp`, function(e, std, err) {
        $LogProvider.info(std);
        if (err) {
            $LogProvider.error(err);
        }
        if (e) {
            throw new Error(e);
        }
    });
}

function handleCreationTask() {
    if (argv._.includes('createProject')) {
        $$createProject({ name: argv._[ 1 ], dir: argv._[ 2 ] });
    } else if (argv._.includes('project')) {
        $$createProject({ name: argv._[ 2 ], dir: argv._[ 3 ] });
    } else if (
        argv._.includes('model') ||
        argv._.includes('migration') ||
        argv._.includes('key')
    ) {
        require('./Angie');
        require('angie-orm');
    } else {
        throw new $$CommandLineError(1);
    }
}

function handleRunTask() {
    if (argv._.includes('migrations') || argv._.includes('migration')) {
        require('./Angie');
        require('angie-orm');
    } else {
        throw new $$CommandLineError(2);
    }
}

function help() {
    const GRAY = (...args) => console.log(gray.apply(null, args));
    const BOLD = (...args) => console.log(bold.apply(null, args));

    console.log('\r');
    BOLD('Angie');
    console.log('A Module-Based NodeJS Web Application Framework in ES6');
    console.log('\r');
    BOLD('Version:');
    console.log(global.ANGIE_VERSION);
    console.log('\r');
    BOLD('Commands:');

    console.log('angie server [-p=<port>] [--port=<port>] [--usessl]');
    GRAY(String.raw`
        Start the Angie Webserver (shortcut with s). Default port
        is 3000. "usessl" forces the port to 443.
    `);

    console.log(
        'angie watch [-p=<port>] [--port=<port>] [-d] [--devmode] [--usessl]'
    );
    GRAY(String.raw`
        Starts the Angie Webserver as a watched process and watches the
        project directory. If started in "devmode," watch will target
        the Angie module "src" directory
    `);

    console.log(
        'angie cluster [-p=<port>] [--port=<port>] [--usessl] [--norefork]'
    );
    GRAY(String.raw`
        Start the Angie Webserver as a cluster of forked webserver processes.
        Unless "--norefork" option is passed, forks will respawn on exit
    `);

    console.log('angie create <component> <?name> [-n=<name>] [--name=<name>]');
    console.log('angie c <component> <?name> [-n=<name>] [--name=<name>]');
    GRAY(String.raw`
        Create a new Angie component in the current or component directory with
        the specified name. Currently, the possibilities include the following:
            - project
            - model [-d=<database name>] [--database=<database name]
            - key [-d=<database name>] [--database=<database name>]
                [-m=<model name>] [--model=<model name>]
    `);

    console.log(
        'angie project [-n=<name>] [--name=<name>] [--dir=<directory>]'
    );
    console.log(
        'angie createproject [-n=<name>] [--name=<name>] [--dir=<directory>]'
    );
    GRAY(String.raw`
        Create a new Angie project with the specified name in the
        current directory.
    `);

    console.log('angie run <component> <?name> [-n=<name>] [--name=<name>]');
    console.log('angie r <component> <?name> [-n=<name>] [--name=<name>]');
    GRAY(String.raw`
        Runs an Angie component in the current or component directory with
        the specified name. Currently, the possibilities include the following:
            - migrations
            - migration [-n=<name>] [--name=<name>]
    `);

    console.log('angie test');
    GRAY('Runs the Angie test suite and prints the results in the console');
    console.log('\r');

    process.exit(0);
}