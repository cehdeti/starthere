module.exports = {
  // Browser-sync configs
  browsersync: {
    open: false,
    proxy: 'localhost:8000',
    xip: false,
  },

  // gulp-using - Files logger so easier to debug stuff later
  using_opts: {
    prefix: 'Compiling...',
    path: 'relative',
    color: 'green',
    filesize: true,
  },

  gulpfile: './gulpfile.js',

  /* ------ ASSETS SOURCE ------ */

  paths: {

    root_dest: './.assets',

    fonts_vendor: [
      './node_modules/@fortawesome/fontawesome-free/webfonts/*',
    ],

    fonts_src: ['assets/fonts/*',],
    fonts_watch: ['assets/fonts'],
    fonts_dest: './.assets/fonts',

    html_src: ['web/templates/**/*.html'],
    html_watch: ['web/templates/**/*.html'],

    images_src: ['assets/images/**/*.{png,jpg,gif,svg,ico}'],
    images_watch: ['assets/images/**/*.{png,jpg,gif,svg,ico}'],
    images_dest: './.assets/images',

    // Browserify the root JS only so we don't compile components and vendors
    scripts_src: ['assets/js/[^_]*.js', '!assets/js/*.spec.js'],
    scripts_watch: ['./assets/js/**/*.js'],
    scripts_dest: './.assets',

    scss_src: ['assets/scss/[^_]*.scss'], // Ignore files with _ prefix
    scss_watch: ['./assets/scss/**/*.scss'],
    scss_out: 'app.css',
    css_dest: './.assets',

    // Additional vendor css
    scss_vendor: [
      './node_modules/bootstrap/scss/bootstrap.scss',
      './node_modules/flatpickr/dist/flatpickr.min.css'
    ],

  },
};
