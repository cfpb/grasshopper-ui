module.exports = {
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'dist/css/main.css': 'scss/grasshopper.scss'
            }
        }
    }
}