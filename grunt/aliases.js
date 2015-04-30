module.exports = {
    'default': [
        'clean',
        'copy:dev',
        'sass:dev',
        'browserify:dev',
        'configureProxies:livereload',
        'connect:livereload',
        'watch'
    ],
    'build': [
        'clean',
        'copy:build',
        'htmlmin:build',
        'sass:build',
        'uglify:build'
    ]
};