/*
    ./webpack.config.js
*/
const path = require('path'),
      nodeExternals = require('webpack-node-externals'),
      HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    entry: [
        './client/index.js'
    ],
    output: {
        publicPath: '/static/'
    },
    target: 'node',
    externals: [nodeExternals({
        whitelist: [
            /.*(shallow-equals).*/,
            /.*(deep-equals).*/,
            /.*(react-day-picker).*/
        ]
    })],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'null-loader'
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: 'null-loader'
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "null-loader"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "null-loader",
                exclude: /static/
            },
            {
                test: /\.(json|png|ico|xml|svg)$/,
                loader: "null-loader",
                options: {
                    name: '[name].[ext]'
                }
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', 'less'],
        alias: {
            COMPONENTS: path.resolve('./client/components'),
            UI:         path.resolve('./client/components/ui'),
            SCRIPTS:    path.resolve('./client/components/scripts'),
            PAGES:      path.resolve('./client/components/pages'),
            ROOT:       path.resolve('./client/components/root'),
            ACTIONS:    path.resolve('./client/components/actions.js'),
            T_UI:       path.resolve('./test/client/uitests'),
            T_UNIT:    path.resolve('./test/client/unittests')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html',
            filename: 'index.html',
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        })
    ]
}
