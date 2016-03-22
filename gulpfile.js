var gulp = require('gulp');

var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');
var htmlreplace = require('gulp-html-replace');
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');
var wiredep = require('wiredep').stream;

/* --- CSS --- */

gulp.task('css', ['app-css', 'vendor-css'], function () {
    return gulp.src(['./tmp/vendor.css', './tmp/app.css'])
            .pipe(concat('app.css'))
            .pipe(cssmin({'processImport': false}))
            .pipe(gulp.dest('./dist/'));
});

gulp.task('app-css', function () {
    return gulp.src('./src/app.css')
            .pipe(gulp.dest('./tmp/'));
});

gulp.task('vendor-css', function () {
    return gulp.src(mainBowerFiles('**/*.css'))
            .pipe(concat('vendor.css'))
            .pipe(gulp.dest('./tmp/'));
});

/* --- JS --- */

gulp.task('js', ['app-js', 'vendor-js'], function () {
    return gulp.src(['./tmp/vendor.js', './tmp/app.js'])
            .pipe(concat('app.js'))
            .pipe(uglify({mangle: false}))
            .pipe(gulp.dest('./dist/'));
});

gulp.task('app-js', function () {
    return gulp.src('./src/app.js')
            .pipe(gulp.dest('./tmp/'));
});

gulp.task('vendor-js', function () {
    return gulp.src(mainBowerFiles('**/*.js'))
            .pipe(concat('vendor.js'))
            .pipe(gulp.dest('./tmp/'));
});

/* --- STATIC CONTENT --- */

gulp.task('static', ['assets', 'favicon'], function () {
    return true;
});

gulp.task('assets', function () {
    return gulp.src('./src/assets/*.*')
            .pipe(gulp.dest('./dist/assets/'));
});

gulp.task('favicon', function () {
    return gulp.src('./src/favicon.ico')
            .pipe(gulp.dest('./dist/'));
});

/* --- OTHERS --- */

gulp.task('bower', function () {
    return gulp.src('./src/index.html')
            .pipe(wiredep())
            .pipe(gulp.dest('./src/'));
});

gulp.task('index', function () {
    return gulp.src('./src/index.html')
            .pipe(htmlreplace(
                    {
                        css: 'app.css',
                        js: 'app.js'
                    }
            ))
            .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
            .pipe(gulp.dest('./dist/'));
});

/* --- DEFAULT --- */

gulp.task('default', ['index', 'css', 'js', 'static']);