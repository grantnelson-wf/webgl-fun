module.exports = function(grunt) {
    var allFiles = ['**/*.js'];

    grunt.registerTask('react', null, function() {
        require('exec-sync')('jsx examples/demo/jsx examples/demo/compiled ');
    });

    require('wf-grunt').init(grunt, {

        watch: {
            react: {
                files: ['examples/demo/jsx/*.js'],
                tasks: ['react']
            }
        },

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
};

