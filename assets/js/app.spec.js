var app = require('./app.js');

describe('App module', function() {
  var _app;
  beforeEach(function() {
    _app = app();
  });

  describe('App', function() {
    it('should be defined', function() {
      expect(_app).toBeDefined();
    });
    it('should return the correct string', function() {
      expect(_app.greet()).toEqual('ETI rocks');
    });
  });
});
