const   gulp                = require('gulp'),
        gutil               = require('gulp-util'),

        path                = require('path'),
        publicPath          = path.join(process.cwd(), '/public'),
        webpack             = require('webpack'),
        WebpackDevServer    = require('webpack-dev-server'),
        webpackConfig       = require('./configs/gulp-webpack');

import  {gutilConf, wpServerConfig} from './configs/gulp-config';

function webpackCallback(callback, err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);

    gutil.log('[webpack]', stats.toString(gutilConf));

    if (callback) {
        callback();
    }

    console.log('Webpack is watching');
}

gulp.task('wp:build', callback => {
    webpack(webpackConfig, webpackCallback.bind(null, callback));
});

gulp.task('wp:watch', callback => {
    webpackConfig.watch = true;

    webpack(webpackConfig, webpackCallback.bind(null, callback));
});

gulp.task('wp:serve', callback => {
    let compiler;

    webpackConfig.watch = true;
    compiler            = webpack(webpackConfig);

    new WebpackDevServer(compiler, wpServerConfig)
        .listen(5050, 'localhost', err => {
            if(err) throw new gutil.PluginError('webpack-dev-server', err);

            gutil.log('[webpack-dev-server]', 'http://localhost:5050');

            callback();
    });
});

gulp.task('html', function () {
   return gulp.src('./resources/index.html')
       .pipe(gulp.dest('./public/'));
});

gulp.task('watch:html', function() {
    gulp.watch('./resources/index.html', gulp.series('html'))
});

gulp.task('serve',
    gulp.parallel('watch:html', 'wp:serve')
);

gulp.task('default',
    gulp.parallel('html', 'wp:build')
);

