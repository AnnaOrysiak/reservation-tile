const webpackConfig = require("./webpack.config.js");
require('karma-script-launcher');

module.exports = function (config) {
    config.set({
        reporters: ['mocha'],
        browsers: ['ChromeHeadless'],
        frameworks: ['mocha', 'webpack'],
        files: [
            '**/*.+(test).ts',
        ],

        // Module processing
        preprocessors: {
            // Process all *test* modules with webpack 
            '**/*.ts': ['webpack', 'sourcemap'],
        },

        // Paths
        basePath: 'tests',
        coverage: true,
        colors: true,
        port: 9888,
        logLevel: config.LOG_ERROR,
        autoWatch: false,
        singleRun: true,
        concurrency: Infinity,
        // Webpack config
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: 'errors-only',
        },
    });
};
