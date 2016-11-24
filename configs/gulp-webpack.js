const webpack               = require('webpack');
const path                  = require('path');

const HtmlWebpackPlugin     = require('html-webpack-plugin');

module.exports = {
    entry: path.join(process.cwd(), `/resources/index`),
    output: {
        path: path.join(process.cwd(), `/public`),
        filename: 'index'
    },
    module: {
        loaders: [
            {
                test: /.json$/,
                loaders: [
                    'json'
                ]
            },
            {
                test: /\.(css|scss)$/,
                loaders: [
                    'style',
                    'css',
                    'sass'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015"]
                }
            },
            {
                test: /.html$/,
                loaders: [
                    'html'
                ]
            }
        ]
    },
    resolveLoader: { root: path.join(process.cwd(), "node_modules") },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    watch: true,
    devtool: 'cheap-module-eval-source-map'
};
