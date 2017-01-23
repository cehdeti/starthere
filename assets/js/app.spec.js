var App = require('./app.js');

describe('App module', function() {
  var app;
  beforeEach(function() {
    app = App()
  });

  describe('App', function() {
    it('should be defined', function() {
      expect(app).toBeDefined();
    });
    it('should return the correct string', function() {
      expect(app.greet()).toEqual('ETI rocks');
    })
  });
});
