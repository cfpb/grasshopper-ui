module.exports = {
    dev: {
        options: {
            sourceMap: true
        },
        files: {
            'dist/css/grasshopper.css': 'scss/grasshopper.scss'
        }
    },
    build: {
        options: {
            outputStyle: 'compressed'
        },
        files: {
            'dist/css/grasshopper.css': 'scss/grasshopper.scss'
        }
    }
}