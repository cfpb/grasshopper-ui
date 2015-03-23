module.exports = {
    'default': [
        'clean',
        'copy:dev',
        'sass:dev',
        'concat:dev',
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