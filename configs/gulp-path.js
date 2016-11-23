module.exports = {
    build           : {
        prod        : {
            css     : 'public/prod/sass/',
            js      : 'public/prod/js/secondform/',
            html    : 'public/prod/',
            img     : 'public/prod/img/secondform/',
            fonts   : 'public/prod/fonts/'
        },
        dev         : {
            style   : 'public/dev/sass/',
            js      : 'public/dev/js/',
            img     : 'public/dev/img/',
            fonts   : 'public/dev/fonts/',
            html    : 'public/dev/'
        }
    },
    src             : {
        style       : 'resources/assets/sass/main.scss',
        js          : 'resources/assets/js/main.js',
        img         : 'resources/assets/img/**/*',
        fonts       : 'resources/assets/fonts/**/*',
        html        : 'resources/assets/*.html'
    },
    watch           : {
        style       : 'resources/assets/sass/**/*',
        js          : 'resources/assets/js/**/*',
        img         : 'resources/assets/img/**/*',
        fonts       : 'resources/assets/fonts/**/*',
        templates   : 'resources/assets/templates/**/*',
        html        : 'resources/assets/*.html'
    },
    clean: {
        style       : 'public/dev/sass/**/*',
        js          : 'public/dev/js/**/*'
    }
};