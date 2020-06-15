'use strict';

const configs   = require('./.gulp.config');
const gulp      = require('gulp');

const _             = require('lodash');
const argv          = require('yargs').argv;
const autoprefixer  = require('autoprefixer');
const beeper        = require('beeper');
const browserSync   = require('browser-sync').create();
const browserify    = require('browserify');
const buffer        = require('vinyl-buffer');
const changed       = require('gulp-changed');
const colors        = require('ansi-colors');
const concat        = require('gulp-concat');
const del           = require('del');
const eslint        = require('gulp-eslint');
const gulpif        = require('gulp-if');
const imagemin      = require('gulp-imagemin');
const lazypipe      = require('lazypipe');
const log           = require('fancy-log');
const newer         = require('gulp-newer');
const notify        = require('gulp-notify');
const plumber       = require('gulp-plumber');
const postcss       = require('gulp-postcss');
const sass          = require('gulp-sass');
const sasslint      = require('gulp-stylelint');
const sourcemaps    = require('gulp-sourcemaps');
const stripCssComments  = require('gulp-strip-css-comments');
const tap           = require('gulp-tap');
const uglify        = require('gulp-uglify');
const using         = require('gulp-using');

// Errors Handler for tasks
const reportErrors = (error) => {
  const lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';
  notify({
    title: 'Task Error: [' + error.plugin + ']',
    message: lineNumber + 'See console.',
    sound: 'Sosumi',
  }).write(error);

  beeper();

  var report = '';
  var chalk = colors.white.bgRed;

  report += chalk('TASK:') + ' [' + error.plugin + ']\n';
  report += chalk('CULPRIT:') + ' ' + error.message + '\n';
  if (error.lineNumber) {
    report += chalk('LINE:') + ' ' + error.lineNumber + '\n';
  }
  if (error.fileName) {
    report += chalk('FILE:') + ' ' + error.fileName + '\n';
  }
  log.error(report);
  this.emit('end'); // eslint-disable-line no-invalid-this
};

/* ----- BEGINS GULP TASKS ----- */

/* ----- clean ----- */

gulp.task('clean', (cb) => {
  del(['.assets/**/*']);
  cb();
});

gulp.task('clean:css', () => {
  return del(['.assets/css']);
});

gulp.task('clean:fonts', () => {
  return del(['.assets/fonts']);
});

gulp.task('clean:images', () => {
  return del(['.assets/images']);
});

gulp.task('clean:js', () => {
  return del(['.assets/js']);
});


/* ----- fonts ----- */

gulp.task('fonts', () =>{
  return gulp.src(configs.paths.fonts_vendor.concat(configs.paths.fonts_src))
      .pipe(newer(configs.paths.fonts_dest))
      .pipe(gulp.dest(configs.paths.fonts_dest))
      .pipe(browserSync.reload({stream: true}));
});

/* ----- images ----- */

gulp.task('images', () => {
  return gulp.src(configs.paths.images_src)
      .pipe(using(configs.using_opts))
      .pipe(newer(configs.paths.images_dest))
      .pipe(gulpif(argv.production, imagemin()))
      .pipe(gulp.dest(configs.paths.images_dest))
      .pipe(browserSync.reload({stream: true}));
});


/* ----- lint ----- */

gulp.task('lint:js', () => {
  return gulp.src(_.concat(configs.paths.scripts_watch, [configs.gulpfile]))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  ;
});

gulp.task('lint:sass', () => {
  return gulp.src(configs.paths.scss_src)
      .pipe(sasslint({
        failAfterError: true,
        reporters: [
          {formatter: 'string', console: true},
        ],
      }))
  ;
});

gulp.task('lint', gulp.parallel('lint:js', 'lint:sass'));


/* ----- sass ----- */

const compileSassTask = lazypipe()
    .pipe(() => {
      return sourcemaps.init();
    })
    .pipe(() => {
      return sass({
        includePaths: ['./node_modules/'],
        outputStyle: 'compressed',
      }).on('error', reportErrors);
    })
    .pipe(() => {
      return postcss([
        autoprefixer(),
      ]);
    })
    .pipe(() => {
      return sourcemaps.write('.');
    })
    .pipe(stripCssComments);

gulp.task('sass', gulp.series('lint:sass', () => {
  return gulp.src(configs.paths.scss_vendor.concat(configs.paths.scss_src))
      .pipe(changed(configs.paths.css_dest))
      .pipe(using(configs.using_opts))
      .pipe(plumber({
        errorHandler: reportErrors,
      }))
      .pipe(compileSassTask())
      .pipe(concat(configs.paths.scss_out))
      .pipe(gulp.dest(configs.paths.css_dest))
      .pipe(browserSync.stream({match: '**/*.css'}));
}));


/* ----- scripts ----- */

// You can bundle multiple bundles as long as the files are on the root of js folder.
const bundleJsTask = lazypipe()
    .pipe(() => {
      return tap((file) => {
        // replace file contents with browserify's bundle stream
        file.contents = browserify(file.path, {debug: true}).bundle().on('error', reportErrors);
      });
    });

gulp.task('scripts', gulp.series('lint:js', () => {
  return gulp.src(configs.paths.scripts_src)
      .pipe(using(configs.using_opts))
      .pipe(bundleJsTask())
      .pipe(buffer())
      .pipe(gulpif(argv.production, uglify()))
      .pipe(gulp.dest(configs.paths.scripts_dest))
      .pipe(browserSync.stream({match: '**/*.js'}));
}));

/* ----- build ----- */

gulp.task('build', gulp.series('clean', gulp.parallel('scripts', 'sass', 'images', 'fonts'), (done) => {
  done();
}));


/* ----- watch ----- */

gulp.task('watch', gulp.series(gulp.parallel('scripts', 'sass', 'images', 'fonts'), () => {
  browserSync.init(configs.browsersync);

  gulp.watch(configs.paths.scss_watch, gulp.parallel('sass'));
  gulp.watch(configs.paths.images_watch, gulp.parallel('images'));
  gulp.watch(configs.paths.scripts_watch, gulp.parallel('scripts'));
  gulp.watch(configs.paths.fonts_watch, gulp.parallel('fonts'));
  gulp.watch(configs.paths.html_watch).on('change', browserSync.reload);
}));


gulp.task('default', gulp.series(argv.production ? 'build' : 'watch'));
