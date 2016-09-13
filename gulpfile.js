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


var config = {
    supportedBrowsers: { browsers: ['last 2 version', '> 5%', 'Firefox > 1', 'last 10 Opera versions', 'ie >= 8'] },
    server: 'index.js'
};

gulp.task('nodemon', function() {
    nodemon({
        script: config.server,
        ext: 'js',
        ignore: ['public/'],
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
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer(config.supportedBrowsers))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/dist/styles'))
        .pipe(browserSync.stream())
});

gulp.task('compile-js', function(done) {
    gulp.src(['public/src/js/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat("app.js"))  //concatenates all js files into one file
        .pipe(minify({
            ext: {src: '.js', min: '.min.js'},
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/dist/js'))
        .on("end", done);
});

/******
 * ES6
 ******/
// gulp.task("compile-js", function() {
//     return gulp.src([
//             'public/js/**/*.js',
//         ])
//         .pipe(sourcemaps.init())
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(concat("app.js"))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('public/generated'));
// });

/**************
 ** React apps *
 ***************/
// gulp.task('compile-js', function(){
//     browserify('public/index.js')
//     .transform(reactify)
//     .bundle()
//     .on('error', console.error.bind(console))
//     .pipe(source('app.js'))
//     .pipe(gulp.dest(config.paths.dist))
//     .pipe(browserSync.stream())
// })


gulp.task('delete-dist', function () {
    return gulp.src('public/dist/', {read: false})
        .pipe(clean())
});

gulp.task('watch', function(){
    gulp.watch('./public/src/**/*.js', ['compile-js']).on("change", browserSync.reload);
    gulp.watch('./public/src/**/*.scss', ['compile-sass']);
    gulp.watch('./public/src/images/**/*', ['copy-images']);
    gulp.watch('./public/src**/*.html', ['copy-html']).on("change", browserSync.reload);
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
