const   gulp                = require("gulp"),
        gutil               = require("gulp-util"),

        webpack             = require("webpack"),
        WebpackDevServer    = require("webpack-dev-server"),
        webpackConfig       = require('./config/gulp-webpack'),
        browsersync         = require('browser-sync');

gulp.task("watch", done => {
    webpack(webpackConfig).watch(200, (err, stats) => {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors  : true,
            chunks  : false,
            hash    : false,
            version : false
        }));
        if (done) {
            done();
            done = null;
        } else {
            browsersync.reload();
        }
        console.log('Webpack is working...')
    });
});

gulp.task("build", done => {
    webpack(webpackConfig).watch((err, stats) => {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors  : true,
            chunks  : false,
            hash    : false,
            version : false
        }));
        if (done) {
            done();
            done = null;
        } else {
            browsersync.reload();
        }
        console.log('Webpack is building...')
    });
});

