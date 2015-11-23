var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

function ServerController() {
  var expressApp = express();
  var handleBarsInstance = exphbs.create({
    defaultLayout: 'default',
    layoutsDir: path.join(__dirname, '/../views/layouts'),
    partialsDir: path.join(__dirname, '/../views/partials')
  });
  var expressServer = this.setUpServer(expressApp, handleBarsInstance);

  this.getExpressApp = function() {
    return expressApp;
  };

  this.getExpressServer = function() {
    return expressServer;
  };

  this.getHandleBarsInstance = function() {
    return handleBarsInstance;
  };
}

ServerController.prototype.setUpServer = function(app, handleBarsInstance) {
  // Set up the use of handle bars and set the path for views and layouts
  app.set('views', path.join(__dirname, '/../views'));
  app.engine('handlebars', handleBarsInstance.engine);
  app.set('view engine', 'handlebars');

  // Define static assets path - i.e. styles, scripts etc.
  app.use('/',
    express.static(path.join(__dirname + '/../../dist/')));

  console.log('Starting server on 8080');
  return app.listen('8080');
};

ServerController.prototype.addEndpoint = function(endpoint, controller) {
  // Add the endpoint and call the onRequest method when a request is made
  this.getExpressApp().get(endpoint, function(req, res) {
    controller.onRequest(req, res);
  });
};

module.exports = new ServerController();
