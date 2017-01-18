// Karma configuration
// Generated on Wed Jan 18 2017 13:55:48 GMT-0600 (CST)

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'assets/js'
    ],

    exclude: [
    ],

    preprocessors: {
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity
  })
}
