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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['jshint']);
};

