const   gulp                = require("gulp"),
        gutil               = require("gulp-util"),
        path                = require('path'),

        webpack             = require("webpack"),
        WebpackDevServer    = require("webpack-dev-server"),
        webpackConfig       = require('./configs/gulp-webpack');

let     publicPath          = path.join(process.cwd(), '/public'),
        gutilConf           = {
            colors          : true,
            chunks          : false,
            hash            : false,
            version         : false
        },
        wpServerConfig      = {
            contentBase     : publicPath,
            output          : {
                publicPath  : publicPath
            },
            stats           : {
                colors      : true
            },
            hot             : true
        };

function webpackCallback(callback, err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);

    gutil.log("[webpack]", stats.toString(gutilConf));

    if (callback) {
        callback();
    }

    console.log('Webpack is watching');
}

gulp.task("wp:build", callback => {
    webpack(webpackConfig, webpackCallback.bind(null, callback));
});

gulp.task("wp:watch", callback => {
    webpackConfig.watch = true;

    webpack(webpackConfig, webpackCallback.bind(null, callback));
});

gulp.task("wp:serve", function(callback) {
    let compiler;

    webpackConfig.watch = true;
    compiler            = webpack(webpackConfig);

    new WebpackDevServer(compiler, wpServerConfig)
        .listen(5050, "localhost", function(err) {
            if(err) throw new gutil.PluginError("webpack-dev-server", err);

            gutil.log("[webpack-dev-server]", "http://localhost:8080");

            callback();
    });
});





// gulp.task("watch", function() {
//     gulp.watch('./resources/**/*', gulp.series("webpack"));
// });

