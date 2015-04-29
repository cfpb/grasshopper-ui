module.exports = {
    'default': [
        'clean',
        'copy:dev',
        'sass:dev',
        'browserify:dev',
        'connect',
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