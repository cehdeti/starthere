'use strict';

const addsrc = require('gulp-add-src');
const argv = require('yargs').argv;
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const lazypipe = require('lazypipe');
const rev = require('gulp-rev');
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

const jsPipeline = lazypipe()
  .pipe(function() {
    return gulpif(argv.production, uglify());
  });

const scssPipeline = lazypipe()
  .pipe(function() {
    return sass().on('error', sass.logError);
  });

const cssPipeline = lazypipe()
  .pipe(function() {
    return concat('screen.css');
  });

gulp.task('build', ['clean'], function() {
  return browserify({entries: './assets/js/app.js', debug: !argv.production})
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(addsrc.append('./assets/scss/app.scss'))
    .pipe(gulpif('*.js', jsPipeline()))
    .pipe(gulpif('*.scss', scssPipeline()))
    .pipe(gulpif('*.css', cssPipeline()))
    .pipe(rev())
    .pipe(gulp.dest('./static'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./static'))
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
  gulp.watch(paths.css + paths.js, ['build']);
});

gulp.task('default', [argv.production ? 'build' : 'watch']);
