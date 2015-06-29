var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = {
    options: {
        hostname: 'localhost',
        port: 9001,
        base: 'dist',
        livereload: 35729
    },
    livereload: {
        options: {
            middleware: function (connect, options) {
                if (!Array.isArray(options.base)) {
                    options.base = [options.base];
                }

                // Setup the proxy
                var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

                // Serve static files.
                options.base.forEach(function(base) {
                    middlewares.push(connect.static(base));
                });

                // Make directory browse-able.
                var directory = options.directory || options.base[options.base.length - 1];
                middlewares.push(connect.directory(directory));

                return middlewares;
            }
        }
    },
    proxies: [
        {
            context: '/api',
            host: 'awsdevhmdal05',
            port: 31010,
            rewrite: {
                '^/api/geocoder': ''
            }
        }
    ] 
}