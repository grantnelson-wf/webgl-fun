module.exports = function(grunt) {
    var allFiles = ['**/*.js', '!bower_components/**/*.js', '!node_modules/**/*.js'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: [
                'items/**/*.js',
                'movers/**/*.js',
                'shaders/**/*.js',
                'shapes/**/*.js',
                'site/**/*.js',
                'tools/**/*.js',
            ],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },

        shell: {
            'build-jsx': {
                command: 'mkdir site; jsx jsx_src site',
                stdout: true,
                failOnError: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('jsx', ['shell:build-jsx']);

    grunt.registerTask('default', ['jsx', 'jshint']);
};

