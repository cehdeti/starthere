'use strict';

var _ = require('lodash');
var addsrc = require('gulp-add-src');
var argv = require('yargs').argv;
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var lazypipe = require('lazypipe');
var rev = require('gulp-rev');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var sasslint = require('gulp-sass-lint');
var detab = require('gulp-soften');
var Server = require('karma').Server;

var paths = {
  scss: ['./assets/scss/**/*.scss'],
  js: ['./assets/js/**/*.js'],
  gulpfile: ['./gulpfile.js'],
  styleguide: ['./assets/styleguide'],
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

var jsPipeline = lazypipe()
  .pipe(function() {
    return gulpif(argv.production, uglify());
  });

var scssPipeline = lazypipe()
  .pipe(function() {
    return sass().on('error', sass.logError);
  });

var cssPipeline = lazypipe()
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
  return gulp.src(_.concat(paths.js, paths.gulpfile))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

gulp.task('lint:sass', function() {
  return gulp.src(paths.scss)
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
  ;
});

gulp.task('detab:js', function() {
  gulp.src(_.concat(paths.js, paths.gulpfile))
    .pipe(detab(2))
    .pipe(gulp.dest('assets'));
});

gulp.task('detab:sass', function() {
  gulp.src(paths.scss)
    .pipe(detab(2))
    .pipe(gulp.dest('assets'));
});

gulp.task('test:js', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
  }, done).start();
});

gulp.task('detab', ['detab:js', 'detab:sass']);

gulp.task('lint', ['lint:js', 'lint:sass']);

gulp.task('watch', ['build'], function() {
  gulp.watch(_.flatten(_.values(paths)), ['build']);
});

gulp.task('default', [argv.production ? 'build' : 'watch']);


gulp.task('styleguide', function() {
  return gulp.src(paths.styleguide + '/docs/assets/scss/docs.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename(function(path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(paths.styleguide+'/docs/assets/css/'))
    .pipe(browserSync.stream());
});

gulp.task('styleguide:watch', ['styleguide'], function() {
  browserSync.init({
    server: paths.styleguide + '/_gh_pages/',
    port: '9002',
  });

  gulp.watch([paths.scss, paths.styleguide + '/docs/assets/scss/**/*.scss'], ['styleguide']);
  gulp.watch([paths.styleguide + '/_gh_pages/**/*.html']).on('change', browserSync.reload);
});
