module.exports = {
  //Browser-sync configs
  bs_proxy: 'localhost:8000',
  bs_use_xip: false,

  //gulp-using - Files logger so easier to debug stuff later
  using_opts: {
    prefix: 'Compiling...',
    path: 'relative',
    color: 'green',
    filesize: true
  },

  gulpfile: './gulpfile.js',

  /* ------ ASSETS SOURCE ------ */

  //fonts_src: ['./node_modules/font-awesome/fonts/**/*'],
  fonts_out: 'static/fonts',

  html_src: ['web/templates/**/*.html'],

  images_src: ['assets/images/**/*'],
  images_out: 'static/images',

  // Browserify the root JS only so we don't compile components and vendors
  scripts_src: ['assets/js/[^_]*.js', '!assets/js/*.spec.js'],
  scripts_watch_src: ['assets/js/**/*.js'],
  scripts_out: './static/js',

  scss_src: ['assets/scss/[^_]*.scss'], //Ignore files with _ prefix
  scss_watch_src: ['assets/scss/**/*.scss'],
  css_out: 'static/css',
  css_out_filename: 'screen.css',

  /* ------ STYLGUIDE -----
    Note: You might wonder there are two output paths for css. That because `build-css` task outputs to `docs/assets/css` instead of `docs/_build/assets/css/`. That because the `styleguide/_build` folder is not version control and it shouldn't be. All of the output would get copied and built by the `jekyll-build` task which how jekyll works anyways. It's not me. That's why we have two different output paths for css for the config files.
   */

  styleguide_src: ['assets/styleguide/'],
  styleguide_css_src: 'assets/styleguide/docs/assets/scss/docs.scss',
  styleguide_css_out: './assets/styleguide/docs/assets/css', //jekyll-build
  styleguide_scss_out: './assets/styleguide/_build/assets/css', //build-css task
  styleguide_html_src: ['assets/styleguide/docs/**/*.{md,html,json,css,min.js}'],
  styleguide_js_src: 'assets/styleguide/docs/assets/js/src/eti.js',
  styleguide_js_out: './assets/styleguide/docs/assets/js/',
  styleguide_watch_css_glob: ['./assets/scss/app.scss', 'assets/styleguide/docs/assets/scss/**/*.scss'],
  styleguide_watch_html: ['assets/styleguide/docs/**/*.{md,html,json}'],
  styleguide_watch_js: ['assets/styleguide/docs/assets/js/src/eti.js'],
};
