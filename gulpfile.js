'use strict';

const addsrc = require('gulp-add-src');
const argv = require('yargs').argv;
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const sasslint = require('gulp-sass-lint');

const paths = {
  css: ['./assets/scss/**/*.scss'],
  js: ['./assets/js/**/*.js']
};

gulp.task('clean', function() {
  return del(['static']);
});

gulp.task('clean:css', function() {
  return del(['static/css']);
});

gulp.task('clean:js', function() {
  return del(['static/js']);
});

gulp.task('css', ['clean:css'], function() {
  return gulp.src(['./assets/scss/app.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('screen.css'))
    .pipe(gulp.dest('./static/css'))
  ;
});

gulp.task('js', ['clean:js'], function() {
  return browserify({entries: './assets/js/app.js', debug: !argv.production})
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('build/js'))
  ;
});

gulp.task('lint:js', function() {
  return gulp.src(paths.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

gulp.task('lint:sass', function() {
  return gulp.src(paths.css)
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
  ;
});

gulp.task('lint', ['lint:js', 'lint:sass']);

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('build', ['css', 'js']);
gulp.task('default', [argv.production ? 'build' : 'watch']);
