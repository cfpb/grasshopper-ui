module.exports = function(grunt) {
    // load grunt config
    require('load-grunt-config')(grunt);
    grunt.registerTask('default', ['browser-sync', 'watch']);
};