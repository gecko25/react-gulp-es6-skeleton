var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var browserSync = process.env.PORT ? null : require('browser-sync').create();

//React & ES6 libraries
var browserify = require('browserify');  // Bundles components
var source = require('vinyl-source-stream'); //uses conventional text streams with gulp
var babelify = require('babelify')

var config = {
    supportedBrowsers: { browsers: ['last 2 version', '> 5%', 'Firefox > 1', 'last 10 Opera versions', 'ie >= 8'] },
    server: 'index.js'
};

gulp.task('nodemon', function() {
    nodemon({
        script: config.server,
        ext: 'js',
        ignore: ['/node_modules/**/*', 'public/dist']
    })
});

gulp.task('copy-assets', function(){
    gulp.src(['public/src/**/*', '!public/src/components/**/*'])
        .pipe(gulp.dest('public/dist/'))
});


gulp.task('compile-sass', function() {
     gulp.src('public/src/styles/app.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer(config.supportedBrowsers))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/dist/styles'))
        .pipe(browserSync.stream())
});

gulp.task('compile-components', function(done){
    console.log('transforming jsx into js..')
    console.log('transforming es5 into es6..')
    browserify('public/src/components/app.js', {debug: true})
        .transform(babelify, {presets: ["es2015", "react"]})
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('public/dist/components/'));

    console.log('minifying js..')
    gulp.src(['public/dist/components/bundle.js'])
        .pipe(minify({
            ext: {src: '.js', min: '.min.js'},
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/dist/components'))
        .on("end", done);
});

gulp.task('delete-dist', function () {
    return gulp.src('public/dist/', {read: false})
        .pipe(clean())
});

gulp.task('watch', function(){
    gulp.watch('./public/src/components/*.js', ['compile-components']);
    gulp.watch('./public/dist/components/bundle.js').on("change", browserSync.reload);
    gulp.watch('./public/src/**/*.scss', ['compile-sass']);
    gulp.watch('./public/src/images/**/*', ['copy-assets']);
    gulp.watch('./public/src**/*.html', ['copy-assets']).on("change", browserSync.reload);
})


gulp.task('build-dist', ['copy-assets', 'compile-sass', 'compile-components']);

gulp.task('serve', ['build-dist', 'nodemon', 'watch'], function(){
        browserSync.init(null, {
        proxy: "http://localhost:5001",
        browser: "google chrome",
        port: 7000,
        online: true
    });
});
