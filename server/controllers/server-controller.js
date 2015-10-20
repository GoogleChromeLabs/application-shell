var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

function ServerController() {
  var expressApp = express();
  var expressServer = this.setUpServer(expressApp);

  this.getExpressApp = function() {
    return expressApp;
  };

  this.getExpressServer = function() {
    return expressServer;
  };
}

ServerController.prototype.setUpServer = function(app) {
  app.set('views', path.join(__dirname, '/../views'));
  app.engine('handlebars', exphbs({
    defaultLayout: 'default',
    layoutsDir: path.join(__dirname, '/../layouts')
  }));
  app.set('view engine', 'handlebars');

  // Should be set POST login auth
  app.use('/manifest.json',
    express.static(path.join(__dirname + '/../../dist/manifest.json')));
  app.use('/favicon.ico',
    express.static(path.join(__dirname + '/../../dist/favicon.ico')));
  app.use('/sw.js',
    express.static(path.join(__dirname + '/../../dist/scripts/sw.js')));
  app.use('/styles',
    express.static(path.join(__dirname + '/../../dist/styles')));
  app.use('/images',
    express.static(path.join(__dirname + '/../../dist/images')));
  app.use('/scripts',
    express.static(path.join(__dirname + '/../../dist/scripts')));
  app.use('/third_party',
    express.static(path.join(__dirname + '/../../dist/third_party')));

  console.log('Starting server on 3123');
  return app.listen('3123');
};

ServerController.prototype.addEndpoint = function(endpoint, controller) {
  this.getExpressApp().get(endpoint, function(req, res) {
    controller.onRequest(req, res);
  });
};

module.exports = new ServerController();
