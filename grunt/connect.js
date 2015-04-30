var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = {
    server: {
        options: {
            hostname: 'localhost',
            port: 9001,
            base: 'dist',
            middleware: function (connect, options) {
                var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                return [
                    // Include the proxy first
                    proxy,
                    // Serve static files.
                    connect.static(options.base[0]),
                    // Make empty directories browsable.
                    connect.directory(options.base[0])
                ];
            }
        }
    },
    proxies: [
        {
            context: '/addresses',
            host: 'awsdevhmdal05',
            port: 31010
        }
    ] 
}