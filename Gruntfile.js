module.exports = function(grunt) {
    var allFiles = ['**/*.js'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            examples: {
                src: allFiles,
                options: {
                    globals: {
                        ga: true,
                    }
                }
            }
        },

        options: {

            coverageThresholds: {
                statements: 50,
                branches:   50,
                functions:  50,
                lines:      50
            },

            requireConfig: {
                paths: {
                    shapes: 'shapes',
                    items: 'items',
                    tools: 'tools',
                    movers: 'movers'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
};

