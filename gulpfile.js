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
const argv          = require('yargs').argv;
const browserSync   = require('browser-sync').create();
const browserify    = require('browserify');
const buffer        = require('vinyl-buffer');
const changed       = require('gulp-changed');
const del           = require('del');
const gulpif        = require('gulp-if');
const lazypipe      = require('lazypipe');
const newer         = require('gulp-newer');
const rename        = require('gulp-rename');
const sourcemaps    = require('gulp-sourcemaps');
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

/* ----- scripts ----- */
var uglifyJsTask = lazypipe()
  .pipe(function() {
      return sourcemaps.init({loadMaps: true})
  })
  .pipe(uglify)
  .pipe(function() {
      return sourcemaps.write('.')
  });

var jsCompileTask = lazypipe()
        .pipe(function() {
            return tap(function (file) {
              // replace file contents with browserify's bundle stream
              file.contents = browserify(file.path, {debug: true}).bundle().on('error', reportErrors);
            })
        });

gulp.task('scripts', function () {
    return gulp.src(configs.scripts_src, {read: false})
        .pipe(changed(configs.scripts_out))
        .pipe(using(configs.using_opts))
        .pipe(changed(configs.scripts_out))
        .pipe(jsCompileTask())
        .pipe(gulpif(argv.production, uglifyJsTask()))
        .pipe(gulp.dest(configs.scripts_out))
        .pipe(browserSync.stream({match: '**/*.js'}));
});