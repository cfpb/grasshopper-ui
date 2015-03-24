module.exports = {
    dev: {
        files: [
            {
                src: ['img/*'],
                dest: 'dist/'
            },
            {
                src: ['index.html'],
                dest: 'dist/'
            }
        ]
    },
    build: {
        src: 'img/*',
        dest: 'dist/'
    }
}