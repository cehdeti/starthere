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
const imagemin      = require('gulp-imagemin');
const lazypipe      = require('lazypipe');
const newer         = require('gulp-newer');
const plumber       = require('gulp-plumber');
const postcss       = require('gulp-postcss');
const rev           = require('gulp-rev');
const sass          = require('gulp-sass');
const sasslint      = require('gulp-sass-lint');
const Server        = require('karma').Server;
const soften        = require('gulp-soften');
const sourcemaps    = require('gulp-sourcemaps');
const stripCssComments  = require('gulp-strip-css-comments');
const tap           = require('gulp-tap');
const uglify        = require('gulp-uglify');
const using         = require('gulp-using');


/* ----- build ----- */
gulp.task('build', ['clean', 'scripts', 'sass', 'images']);

/* ----- clean ----- */

gulp.task('clean', (cb) => {
  del(['static/**/*']);
  cb();
});

gulp.task('clean:css', () => {
  return del(['static/css']);
});

gulp.task('clean:fonts', () => {
  return del(['static/fonts']);
});

gulp.task('clean:images', () => {
  return del(['static/images']);
});

gulp.task('clean:js', () => {
  return del(['static/js']);
});

/* ----- detab ----- */

const detab = lazypipe()
  .pipe(function() {
      return soften(2);
  });

/* ----- fonts ----- */

gulp.task('fonts', () =>{
  return gulp.src(configs.paths.fonts_src)
      .pipe(newer(configs.paths.fonts_out))
      .pipe(gulp.dest(configs.paths.fonts_out))
      .pipe(browserSync.reload({stream: true}));
});

/* ----- images ----- */

gulp.task('images', () => {
  return gulp.src(configs.paths.images_src)
    .pipe(using(configs.using_opts))
    .pipe(newer(configs.paths.images_out))
    .pipe(gulpif(argv.production, imagemin()))
    .pipe(gulp.dest(configs.paths.images_out))
    .pipe(browserSync.reload({stream: true}));
});

/* ----- lint ----- */

gulp.task('lint', ['lint:js', 'lint:sass']);

gulp.task('lint:js', () => {
  return gulp.src(_.concat(configs.paths.scripts_src))
    .pipe(detab())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

gulp.task('lint:sass', () => {
  return gulp.src(configs.paths.scss_src)
    .pipe(detab())
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

gulp.task('sass', ['lint:sass'], () => {
  gulp.src(configs.paths.scss_src)
    .pipe(changed(configs.paths.css_out))
    .pipe(using(configs.using_opts))
    .pipe(plumber({
      errorHandler: reportErrors
    }))
    .pipe(concat(configs.paths.css_out_filename))
    .pipe(compileSassTask())
    .pipe(gulp.dest(configs.paths.css_out))
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

gulp.task('scripts', ['lint:js'], () => {
    return gulp.src(configs.paths.scripts_src, {read: false})
        .pipe(using(configs.using_opts))
        .pipe(bundleJsTask())
        .pipe(buffer())
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest(configs.paths.scripts_out))
        .pipe(browserSync.stream({match: '**/*.js'}));
});

/* ----- test ----- */

gulp.task('test:js', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
  }, done).start();
});

/* ----- watch ----- */

gulp.task('watch', ['build'], function() {
  browserSync.init({
      snippetOptions: {
        rule: {
          match: /<\/head>/i,
          fn: function (snippet, match) {
            return snippet + match;
          }
        }
      },
      proxy: configs.bs_proxy,
      xip: configs.bs_use_xip
  });

  gulp.watch(configs.paths.scss_watch, ['sass']);
  gulp.watch(configs.paths.images_src, ['images']);
  gulp.watch(configs.paths.scripts_watch_src, ['scripts']);
  gulp.watch(configs.paths.fonts_src, ['fonts']);
  gulp.watch(configs.paths.html_src).on('change', browserSync.reload({stream:true}));
});