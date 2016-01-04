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

  // Set up the use of handle bars and set the path for views and layouts
  expressApp.set('views', path.join(__dirname, '/../views'));
  expressApp.engine('handlebars', handleBarsInstance.engine);
  expressApp.set('view engine', 'handlebars');

  // Define static assets path - i.e. styles, scripts etc.
  expressApp.use('/',
    express.static(path.join(__dirname + '/../../dist/')));

  var expressServer = null;

  this.getExpressApp = function() {
    return expressApp;
  };

  this.setExpressServer = function(server) {
    expressServer = server;
  };

  this.getExpressServer = function() {
    return expressServer;
  };

  this.getHandleBarsInstance = function() {
    return handleBarsInstance;
  };
}

ServerController.prototype.startServer = function(port) {
  // As a failsafe use port 0 if the input isn't defined
  // this will result in a random port being assigned
  // See : https://nodejs.org/api/http.html for details
  if (
    typeof port === 'undefined' ||
    port === null ||
    isNaN(parseInt(port, 10))
  ) {
    port = 0;
  }

  var server = this.getExpressApp().listen(port, () => {
    var serverPort = server.address().port;
    console.log('Server running on port ' + serverPort);
  });
  this.setExpressServer(server);
};

ServerController.prototype.addEndpoint = function(endpoint, controller) {
  // Add the endpoint and call the onRequest method when a request is made
  this.getExpressApp().get(endpoint, function(req, res) {
    controller.onRequest(req, res);
  });
};

module.exports = new ServerController();
