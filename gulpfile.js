var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var nodemon = require('gulp-nodemon');
var clean = require('gulp-clean');
var browserSync = process.env.PORT ? null : require('browser-sync').create();


var config = {
    supportedBrowsers: { browsers: ['last 2 version', '> 5%', 'Firefox > 20', 'last 2 Opera versions'] },
    server: 'index.js'
};

gulp.task('nodemon', function() {
    nodemon({
        script: config.server,
        ext: 'js',
        ignore: ['/node_modules/**/*', 'public/dist']
    })
});

gulp.task('copy-images', function(){
    gulp.src(['public/src/images/**/*'])
        .pipe(gulp.dest('public/dist/images'))
});

gulp.task('copy-html', function(){
    gulp.src(['public/src/**/*.html'])
        .pipe(gulp.dest('public/dist/'));
});

gulp.task('compile-sass', function() {
     gulp.src('public/src/styles/app.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer(config.supportedBrowsers))
        .pipe(gulp.dest('public/dist/styles'))
});

gulp.task('compile-js', function() {
    gulp.src(['public/src/**/*.js'])
        .pipe(gulp.dest('public/dist'))
});

/**************
 ** React apps *
 ***************/
// gulp.task('compile-js', function(){
//     browserify('public/index.js')
//     .transform(reactify)
//     .bundle()
//     .on('error', console.error.bind(console))
//     .pipe(source('search.js'))
//     .pipe(gulp.dest(config.paths.dist))
//     .pipe(browserSync.stream())
// })


gulp.task('delete-dist', function () {
    return gulp.src('public/dist/', {read: false})
        .pipe(clean())
});

gulp.task('watch', function(){
    gulp.watch('./public/**/*.js', ['compile-js']);
    gulp.watch('./public/**/*.scss', ['compile-sass']);
    gulp.watch('./public/images/**/*', ['copy-images']);
})

gulp.task('build-dist', ['copy-html', 'compile-sass', 'copy-images', 'compile-js']);

gulp.task('serve', ['build-dist', 'nodemon', 'watch'], function(){
        browserSync.init(null, {
        proxy: "http://localhost:4001",
        browser: "google chrome",
        port: 7000,
        online: true
    });
});
