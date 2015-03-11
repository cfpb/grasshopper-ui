module.exports = {
    target: {
        files: [{
            expand: true,
            cwd: 'dist/css',
            src: ['main.css'],
            dest: 'dist/css',
            ext: '.min.css'
        }]
    }
}