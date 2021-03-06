const Hapi = require('hapi');
const fs = require('fs');
const Webpack = require('webpack');
const inert = require('inert');

const env = process.env.NODE_ENV;
const isProduction = (env === 'production');

const server = new Hapi.Server();
server.connection({ port: 3000 });

// TODO: clean up this file!

const log = () => {
    console.log(`\n\nServer running in ${env} mode at: ${server.info.protocol}://localhost:${server.info.port}\n`);
};

if (isProduction === false) {
    const WebpackPlugin = require('hapi-webpack-plugin');
    const compiler = new Webpack(require('../webpack.config.js'));

    compiler.plugin('done', (stats) => {
        setTimeout(() => {
            log();
        }, 0);

        const pkg = require('../package.json');
        const notifier = require('node-notifier');
        const time = ((stats.endTime - stats.startTime) / 1000).toFixed(2);

        notifier.notify({
            title: pkg.name,
            message: `WebPack is done!\n${stats.compilation.errors.length} errors in ${time}s`,
            timeout: 1, // Takes precedence over wait if both are defined.
        });
    });

    const assets = {
        // webpack-dev-middleware options
        // See https://github.com/webpack/webpack-dev-middleware
    };

    const hot = {
        // webpack-hot-middleware options
        // See https://github.com/glenjamin/webpack-hot-middleware
    };

    server.register({
        register: WebpackPlugin,
        options: {compiler, assets, hot}
    }, error => {
        if (error) {
            return console.error(error);
        }

    });
}

server.register(inert);

server.route({
    method: 'GET',
    path: '/assets/{file*}',
    handler: function (request, reply) {
        reply.file(__dirname + `/public/${request.path}`);
    }
});

server.route({
    method: 'GET',
    path: '/{route*}',
    handler: function (request, reply) {
        fs.readFile(__dirname + '/public/index.html', 'utf8', (err, data) => {
            if (err) throw err;

            let html = data.replace('{title}', 'Test Title');
            html = html.replace('{content}', '<div>Test</div>');
            html = html.replace('{state}',  JSON.stringify({}));

            return reply(html);
        });
    }
});


server.start(() => {
    isProduction && log();
});
