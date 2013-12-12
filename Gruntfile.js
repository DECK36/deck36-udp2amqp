module.exports = function (grunt) {
    "use strict";
    // Project configuration.
    grunt.initConfig({
                         ///////////////////////////////
                         //
                         // Global Config
                         // Store your Package file so you can reference its specific data whenever necessary
                         // Globals banner configuration which is displayed in the js and css files
                         ////////////////////////////////
                         pkg: grunt.file.readJSON('package.json'),

                         header: '/*!\nname: <%= pkg.title %> \n' + 'version: <%= pkg.version %> \n' + 'date: <%= grunt.template.today("yyyy-mm-dd") %>\n' + 'url: <%= pkg.author.homepage %> \n' + 'email: <%= pkg.author.email %> \n' + 'copyright (c) <%= grunt.template.today("yyyy") %>\n' + '*/\n',

                         footer: '/*! -----deck36-----*/',

                         label: {
                             main: 'deck36 iojs backend'
                         },

                         dirs: {
                             main: 'public',
                             lib: 'lib/server',
                             src: 'src',
                             node_modules: 'node_modules',
                             config: 'config'
                         },

                         'git-describe': {
                             options: {
                                 prop: 'meta.revision'
                             },
                             me: {}
                         },

                         ///////////////////////////////
                         //
                         // Mocha and Cucumber tests
                         //
                         ////////////////////////////////
                         mochacli: {
                             options: {
                                 require: ['assert'],
                                 reporter: 'nyan',
                                 bail: true,
                                 recursive: true,
                                 'check-leaks': true,
                                 env: {
                                     NODE_ENV: 'test',
                                     NODE_CONFIG_DIR: 'config'
                                 }
                             },
                             all: ['test/*.js']
                         },

                         cucumberjs: {
                             src: 'features'
                         },

                         ///////////////////////////////
                         //
                         // If something changes to these tasks
                         //
                         ////////////////////////////////
                         watch: {
                             dev: {
                                 files: [
                                     "<%= dirs.lib %>/*.js", "<%= dirs.lib %>/**/*.js", "<%= dirs.src %>/**/*.js", "<%= dirs.src %>/*.js", "<%= dirs.config %>/*.js", "<%= dirs.config %>/../*.js"
                                 ],
                                 tasks: [ 'mochacli' ]
                             },
                             test: {
                                 files: [
                                     "<%= dirs.lib %>/*.js", "<%= dirs.lib %>/**/*.js", "<%= dirs.src %>/**/*.js", "<%= dirs.src %>/*.js", "<%= dirs.config %>/*.js", "<%= dirs.config %>/../*.js", "<%= dirs.lib %>/../test/*.js"
                                 ],
                                 tasks: [ 'mochacli' ]
                             }
                         },

                         ///////////////////////////////
                         //
                         // Let nodemon and watch run in parallel
                         //
                         ////////////////////////////////
                         concurrent: {
                             dev: {
                                 tasks: ['nodemon:dev', 'watch:dev'],
                                 options: {
                                     logConcurrentOutput: true
                                 }
                             },
                             test: {
                                 tasks: ['nodemon:test', 'watch:test', 'mochacli'],
                                 options: {
                                     logConcurrentOutput: true
                                 }
                             },
                             prod: {
                                 tasks: ['nodemon:prod'],
                                 options: {
                                     logConcurrentOutput: true
                                 }
                             }
                         },

                         ///////////////////////////////
                         //
                         // Nodemon config for watching changes in app_test.js
                         //
                         ////////////////////////////////
                         nodemon: {
                             dev: {
                                 options: {
                                     file: 'syslogtoamqp.js',
                                     args: ['dev'],
                                     nodeArgs: ['--debug'],
                                     ignoredFiles: ['README.md', 'node_modules/**'],
                                     watchedExtensions: ['js'],
                                     watchedFolders: ['./', './lib/', 'src/', 'node_modules/deck36*'],
                                     delayTime: 1,
                                     legacyWatch: true,
                                     env: {
                                         NODE_ENV: 'dev',
                                         NODE_CONFIG_DIR: 'config'
                                     }
                                 }
                             },
                             test: {
                                 options: {
                                     file: 'syslogtoamqp.js',
                                     args: ['test'],
                                     delayTime: 1,
                                     legacyWatch: false,
                                     env: {
                                         NODE_ENV: 'test',
                                         NODE_CONFIG_DIR: 'config'
                                     }
                                 }
                             },
                             prod: {
                                 options: {
                                     file: 'syslogtoamqp.js',
                                     args: ['prod'],
                                     delayTime: 1,
                                     legacyWatch: false,
                                     env: {
                                         NODE_ENV: 'prod',
                                         NODE_CONFIG_DIR: 'config'
                                     }
                                 }
                             }
                         }
                     });

    // Load NPM Tasks
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-cucumber');
    grunt.loadNpmTasks('grunt-nodemon');

    // Default Task
    grunt.registerTask('default', 'My "helper" task.', function () {
        grunt.log.writeln('*****************************************************************');
        grunt.log.writeln('frontend special task based on grunt.\n');
        grunt.log.writeln('Available tasks\n');
        grunt.log.writeln('\t =================================================================');
        grunt.log.writeln('\t start-server-dev     = Start server in dev mode');
        grunt.log.writeln('\t start-server-test    = Start server in test mode');
        grunt.log.writeln('\t start-server-prod    = Start server in prod mode');
        grunt.log.writeln('\t test       = runs the unit and functionaltests tests for this project');
        grunt.log.writeln('\t =================================================================');
        grunt.log.writeln('\n --- Usage: grunt  \<task\> ---');
        grunt.log.writeln('\n*****************************************************************');
    });

    grunt.registerTask('start-server-dev', [
        'concurrent:dev'
    ]);

    grunt.registerTask('start-server-test', [
        'concurrent:test'
    ]);

    grunt.registerTask('start-server-prod', [
        'concurrent:prod'
    ]);

    grunt.registerTask('mocha', [
        'mochacli'
    ]);

    grunt.registerTask('test', [
        'start-server-test', 'mocha'
    ]);
};