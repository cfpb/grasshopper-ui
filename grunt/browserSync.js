module.exports = {
    dev: {
        bsFiles: {
            src : ['dist/index.html', 'dist/css/*.css', 'dist/js/*.js']
        },
        options: {
            watchTask: true,
            server: './dist',
            open: false
        }
    }
}