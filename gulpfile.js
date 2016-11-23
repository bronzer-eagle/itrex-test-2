const   gulp        = require('gulp'),
        del         = require('del'),
        watch       = require('gulp-watch'),
        uglify      = require('gulp-uglify'),
        sass        = require('gulp-sass'),
        sourcemaps  = require('gulp-sourcemaps'),
        browserify  = require('gulp-browserify'),
        stringify   = require('stringify'),
        imagemin    = require('gulp-imagemin'),
        pngquant    = require('imagemin-pngquant'),
        concat      = require('gulp-concat'),
        es6         = require('gulp-es6-transpiler');
        //path object
        path        = require('./configs/gulp-path');

gulp.task('sass:dev', function () {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.dev.style));
});

gulp.task('js:dev', function () {
    return gulp.src(path.src.js)
        .pipe(browserify({
            insertGlobals: true,
            transform: stringify(['.html']),
            debug: true
        }))
        .pipe(es6())
        .pipe(gulp.dest(path.build.dev.js));
});

gulp.task('imgmin:dev', function () {
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.build.dev.img));
});

gulp.task('html:dev', function () {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.dev.html));
});

gulp.task('fonts', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.dev.fonts));
});

gulp.task('clean', function () {
    return del([path.clean.style, path.clean.js]);
});

gulp.task('build:dev',
    gulp.series('clean',
        gulp.parallel(
            'sass:dev',
            'js:dev',
            'imgmin:dev',
            'fonts',
            'html:dev'
        )));

//production

gulp.task('sass:prod', function () {
    return gulp.src(path.src.style)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.prod.style));
});

gulp.task('js:prod', function () {
    return gulp.src(path.src.js)
        .pipe(browserify({
            insertGlobals: true,
            transform: stringify(['.html']),
            debug: true
        }))
        .pipe(es6())
        .pipe(gulp.dest(path.build.prod.js));
});

gulp.task('imgmin:prod', function () {
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.build.prod.img));
});

gulp.task('html:prod', function () {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.prod.html));
});

gulp.task('fonts', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.prod.fonts));
});

gulp.task('clean', function () {
    return del([path.clean.style, path.clean.js]);
});

gulp.task('build:prod',
    gulp.series('clean',
        gulp.parallel(
            'sass:prod',
            'js:prod',
            'imgmin:prod',
            'fonts',
            'html:prod'
        )));


//

gulp.task('watch', function () {
    watch(path.watch.style,     gulp.series('sass:dev'));
    watch(path.watch.js,        gulp.series('js:dev'));
    watch(path.watch.templates, gulp.series('js:dev'));
    watch(path.watch.img,       gulp.series('imgmin:dev'));
    watch(path.watch.fonts,     gulp.series('fonts'));
    watch(path.watch.html,      gulp.series('html:dev'));
});

gulp.task('dev_watch',  gulp.series('build:dev', 'watch'));
gulp.task('dev',        gulp.series('build:dev'));