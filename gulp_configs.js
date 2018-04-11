module.exports = {
  //Browser-sync configs
  bs_proxy: 'localhost:8000',
  bs_use_xip: false,
  bs_open: false,

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

    fonts_src: ['assets/fonts', '../node_modules/font-awesome/fonts/*'],
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
  }
};
