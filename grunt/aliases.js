module.exports = {
    'default': [
        'clean',
        'copy:dev',
        'sass:dev',
        'browserify:dev',
        'browserSync',
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