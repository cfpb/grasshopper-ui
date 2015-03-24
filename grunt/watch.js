module.exports = {
    scripts: {
        files: 'js/**/*.js',
        tasks: ['concat:dev']
    },
    css: {
        files: 'scss/**/*.scss',
        tasks: ['sass:dev']
    },
    html: {
        files: 'index.html',
        tasks: ['copy:dev']
    }
}