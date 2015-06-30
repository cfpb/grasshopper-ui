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
    'docker': [
        'clean',
        'copy:dev',
        'sass:dev',
        'browserify:dev',
        'watch'
    ],
    'build': [
        'clean',
        'copy:build',
        'htmlmin:build',
        'sass:build',
        'browserify:dev'
    ]
};