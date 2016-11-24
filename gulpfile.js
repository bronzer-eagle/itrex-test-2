const   gulp                = require("gulp"),
        gutil               = require("gulp-util"),
        path                = require('path'),

        webpack             = require("webpack"),
        WebpackDevServer    = require("webpack-dev-server"),
        webpackConfig       = require('./configs/gulp-webpack');

let callback = function (err, stats) {
    let gutilConf = {
        colors  : true,
        chunks  : false,
        hash    : false,
        version : false
    };

    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString(gutilConf));
    if (this.done) {
        this.done();
        this.done = null;
    } else {
        browsersync.reload();
    }
};

gulp.task("wp:watch", done => {
    let self            = this;
    self.done           = done;
    webpackConfig.watch = true;

    webpack(webpackConfig, () => {
        callback.apply(self, arguments);
        console.log('Webpack is working...')
    });
});

gulp.task("wp:build", done => {
    let self    = this;
    self.done   = done;
    webpack(webpackConfig).watch((err, stats) => {
        callback.apply(self, arguments);
        console.log('Webpack is building...')
    });
});

gulp.task("wp-serve", function(callback) {
    webpackConfig.watch = true;
    // Start a webpack-dev-server
    let compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {
        publicPath: path.join(process.cwd(), '/public'),
        stats: {
            colors: true
        }
    }).listen(5050, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

        // keep the server alive or continue?
        // callback();
    });
});

gulp.task("webpack", callback => {
    // run webpack
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        if (callback){
            callback();
        }

    });
});

// gulp.task("watch", function() {
//     gulp.watch('./resources/**/*', gulp.series("webpack"));
// });

