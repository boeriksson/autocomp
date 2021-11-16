const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function recursiveIssuer(m, c) {
    const issuer = c.moduleGraph.getIssuer(m)

    if (issuer) {
        return recursiveIssuer(issuer, c)
    }

    const chunks = c.chunkGraph.getModuleChunks(m)

    for (const chunk of chunks) {
        return chunk.name
    }

    return false
}

/**
 * @type {import('webpack').Configuration}
 */
const config = {
    entry: {
        'autocomp': {
            import: './src/autocomp/index.js',
            filename: 'autocomp.js',
            library: { type: 'module' },
            publicPath: '',
        },
        'dev-app': ['babel-polyfill','./src/dev-app/DevApp.jsx'],
    },
    experiments: {
        outputModule: true,
    },
    output: {
        clean: true,
        filename: '[name]_[contenthash].js',
        assetModuleFilename: '[name]_[contenthash][ext]',
    },
    devServer: {
        compress: true,
        port: 8080,
        injectClient: false
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                devAppStyles: {
                    name: 'dev-app-styles',
                    test: (m, c, entry = 'dev-app') =>
                        m.constructor.name === 'CssModule' &&
                        recursiveIssuer(m, c) === entry,
                    chunks: 'all',
                    enforce: true,
                },
                assetRestrictionsStyles: {
                    name: 'autocomp-styles',
                    test: (m, c, entry = 'autocomp') =>
                        m.constructor.name === 'CssModule' &&
                        recursiveIssuer(m, c) === entry,
                    chunks: 'all',
                    enforce: true,
                },
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            ['@babel/plugin-proposal-decorators', {'decoratorsBeforeExport': true}],
                            ['@babel/plugin-proposal-pipeline-operator', {'proposal': 'minimal'}]
                        ]
                    }
                }
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 0,
                            name: './svg/[name][hash:5].[ext]',
                            mimetype: 'image/svg+xml'
                        }
                    }
                ]
            },
            {
                test: /\.woff2?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: './font/[name][hash:5].[ext]',
                            mimetype: 'application/font-woff'
                        }
                    }
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/dev-app/index.html',
            excludeChunks: ['asset-restrictions'],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    }
}

module.exports = config
