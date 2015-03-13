module.exports = {
    scripts: {
        files: '**/*.js',
        tasks: ['concat']
    },
    css: {
        files: 'scss/*.scss',
        tasks: ['sass']
    },
    html: {
        files: 'index.html',
        tasks: ['htmlmin']
    }
}