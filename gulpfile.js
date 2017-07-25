'use strict';

const configs   = require('./gulp_configs');
const gulp      = require('gulp');

// Errors Handler for tasks
const gutil  = require('gulp-util');
const notify = require('gulp-notify');
const reportErrors = (error) => {
    const lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';
    notify({
        title: 'Task Error: [' + error.plugin + ']',
        message: lineNumber + 'See console.',
        sound: 'Sosumi'
    }).write(error);

    gutil.beep();

    var report = '';
    var chalk = gutil.colors.white.bgRed;

    report += chalk('TASK:') + ' [' + error.plugin + ']\n';
    report += chalk('CULPRIT:') + ' ' + error.message + '\n';
    if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
    if (error.fileName)   { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }
    console.error(report);
    this.emit('end');
};

/* ----- BEGINS GULP TASKS ----- */
//:: Tasks are in alphabetical orders.


const _             = require('lodash');
const argv          = require('yargs').argv;
const autoprefixer  = require('autoprefixer');
const browserSync   = require('browser-sync').create();
const browserify    = require('browserify');
const buffer        = require('vinyl-buffer');
const changed       = require('gulp-changed');
const concat        = require('gulp-concat');
const del           = require('del');
const eslint        = require('gulp-eslint');
const gulpif        = require('gulp-if');
const lazypipe      = require('lazypipe');
const newer         = require('gulp-newer');
const plumber       = require('gulp-plumber');
const postcss       = require('gulp-postcss');
const rename        = require('gulp-rename');
const sass          = require('gulp-sass');
const sasslint      = require('gulp-sass-lint');
const soften        = require('gulp-soften');
const sourcemaps    = require('gulp-sourcemaps');
const stripCssComments  = require('gulp-strip-css-comments');
const tap           = require('gulp-tap');
const uglify        = require('gulp-uglify');
const using         = require('gulp-using');

/* ----- Shared pipes ------ */


/* ----- clean ----- */

gulp.task('clean', function() {
  return del(['static']);
});

gulp.task('clean:css', function() {
  return del(['static/css']);
});

gulp.task('clean:images', function() {
  return del(['static/images']);
});

gulp.task('clean:js', function() {
  return del(['static/js']);
});

/* ----- lint ----- */

gulp.task('lint:js', function() {
  return gulp.src(_.concat(configs.scripts_src))
    .pipe(soften(2))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

gulp.task('lint:sass', function() {
  return gulp.src(configs.scss_src)
    .pipe(soften(2))
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
  ;
});

/* ----- sass ----- */

const compileSassTask = lazypipe()
  .pipe(function() {
    return sourcemaps.init()
  })
  .pipe(function() {
    return sass({
              outputStyle: 'compressed'
          }).on('error', reportErrors)
  })
  .pipe(function() {
    return postcss([ autoprefixer({ browsers: ['last 15 versions', '> 1%'] }) ])
  })
  .pipe(function() {
    return sourcemaps.write('.')
  })
  .pipe(stripCssComments);

gulp.task('sass', function() {
  gulp.src(configs.scss_src)
    .pipe(changed(configs.css_out))
    .pipe(using(configs.using_opts))
    .pipe(plumber({
      errorHandler: reportErrors
    }))
    .pipe(concat(configs.css_filename))
    .pipe(compileSassTask())
    .pipe(gulp.dest(configs.css_out))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

/* ----- scripts ----- */

//You can bundle multiple bundles as long as the files are on the root of js folder.
const bundleJsTask = lazypipe()
  .pipe(function() {
      return tap(function (file) {
        // replace file contents with browserify's bundle stream
        file.contents = browserify(file.path, {debug: true}).bundle().on('error', reportErrors);
      })
  });

gulp.task('scripts', function () {
    return gulp.src(configs.scripts_src, {read: false})
        .pipe(using(configs.using_opts))
        .pipe(bundleJsTask())
        .pipe(buffer())
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest(configs.scripts_out))
        .pipe(browserSync.stream({match: '**/*.js'}));
});