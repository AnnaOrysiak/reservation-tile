const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                    }
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.html$/,
                loader: 'vue-template-loader',
                exclude: /index.html/,
                options: {
                    transformToRequire: {
                        img: 'src'
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
}

if (process.env.NODE_ENV === 'test:unit') {
    module.exports.devtool = '#source-map';
    module.exports.resolve = {
        alias: {
            tests: path.join(__dirname, 'tests'),
        },
    };
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"test:unit"'
            }
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]);
    module.exports.module = {
        rules: [
            {
                test: /\.vue$/, use: {
                    loader: 'vue-loader', options: {
                        esModule: true,
                        hotReload: true,
                        js: [
                            { loader: 'babel-loader', options: { presets: ['es2015'] } }
                        ],
                    }
                }
            },
            {
                test: /\.test.ts$/,
                use: [
                    {
                        loader: 'ts-loader', options: {
                            happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
                            transpileOnly: true,
                        }
                    }
                ]
            },
            { test: /\.(css|less|styl|sass|scss)$/, loader: 'null-loader' },
            {
                test: /\.html$/, use: {
                    loader: 'vue-template-loader', options: {
                        transformToRequire: {
                            // The key should be element name, the value should be attribute name or its array
                            img: 'src',
                            image: 'xlink:href',
                        },
                    }
                },
            }
        ]
    };

}