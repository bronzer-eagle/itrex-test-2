const webpack               = require('webpack'),
      path                  = require('path'),
      CopyWebpackPlugin     = require('copy-webpack-plugin'),
      publicPath            = path.join(process.cwd(), '/public');

module.exports              = {
    entry                   : path.join(process.cwd(), `/resources/index.js`),
    output                  : {
        path                : publicPath,
        filename            : 'index.js'
    },
    module                  : {
        loaders             : [
            {
                test        : /.json$/,
                loaders     : ['json']
            },
            {
                test        : /\.(css|scss)$/,
                loaders     : [
                    'style',
                    'css',
                    'sass'
                ]
            },
            {
                test         : /\.js$/,
                exclude      : /node_modules/,
                loader       : 'babel-loader',
                query        : {
                    presets  : ['es2015']
                }
            },
            {
                test         : /.html$/,
                loaders      : ['html']
            }
        ]
    },
    resolveLoader            : { root: path.join(process.cwd(), 'node_modules') },
    plugins                  : [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new CopyWebpackPlugin([
                {
                    from: path.join(process.cwd(), 'resources/libs'),
                    to  : path.join(process.cwd(), 'public/libs')
                }
        ])
    ],
    devtool                  : 'cheap-module-eval-source-map'
};
