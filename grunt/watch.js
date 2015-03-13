module.exports = {
    scripts: {
        files: 'js/**/*.js',
        tasks: ['concat']
    },
    css: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
    },
    html: {
        files: 'index.html',
        tasks: ['htmlmin']
    }
}