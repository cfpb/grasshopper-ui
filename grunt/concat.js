module.exports = {
    options: {
        separator: ';',
    },
    dev: {
        options: {
            sourceMap: true
        },
        src: ['js/vendor/*.js', 'js/*.js'], // order matters?
        dest: 'dist/js/grasshopper.js'
    },
    build: {
        src: ['js/vendor/*.js', 'js/*.js'], // order matters?
        dest: 'dist/js/grasshopper.js'
    }
}