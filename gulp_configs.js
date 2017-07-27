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

  paths: {

    root_dest: './static',

    fonts_src: ['assets/fonts'],
    fonts_watch: ['assets/fonts'],
    fonts_dest: './static',

    html_src: ['web/templates/**/*.html'],
    html_watch: ['web/templates/**/*.html'],

    images_src: ['assets/images/**/*.{png,jpg,gif,svg}'],
    images_watch: ['assets/images/**/*.{png,jpg,gif,svg}'],
    images_dest: './static',

    // Browserify the root JS only so we don't compile components and vendors
    scripts_src: ['assets/js/[^_]*.js', '!assets/js/*.spec.js'],
    scripts_watch_src: ['./assets/js/**/*.js'],
    scripts_dest: './static',

    scss_src: ['assets/scss/[^_]*.scss'], //Ignore files with _ prefix
    scss_watch: ['./assets/scss/**/*.scss'],
    css_dest: './static'
  },

  /* ------ STYLGUIDE -----
    Note: You might wonder there are two output paths for css. That because `build-css` task outputs to `docs/assets/css` instead of `docs/_build/assets/css/`. That because the `styleguide/_build` folder is not version control and it shouldn't be. All of the output would get copied and built by the `jekyll-build` task which how jekyll works anyways. It's not me. That's why we have two different output paths for css for the config files.
   */
  styleguide: {
    src: ['assets/styleguide/'],
    root_dest: './assets/styleguide/_gh_pages',

    css_src: 'assets/styleguide/docs/assets/scss/docs.scss',
    css_dest: './assets/styleguide/docs/assets/css', //jekyll-build
    css_watch: ['./assets/scss/app.scss', 'assets/styleguide/docs/assets/scss/*.scss'],
    scss_dest: './assets/styleguide/_gh_pages/assets/css', //jekyll-build-css task

    html_src: ['assets/styleguide/docs/**/*.{md,html,json,css,min.js}'],
    html_watch: ['assets/styleguide/docs/**/*.{md,html,json}'],

    js_src: 'assets/styleguide/docs/assets/js/src/eti.js',
    js_dest: './assets/styleguide/docs/assets/js/',
    js_watch: ['assets/styleguide/docs/assets/js/src/eti.js']
  }
};
