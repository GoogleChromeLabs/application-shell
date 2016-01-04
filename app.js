'use strict';

/**
 *
 * The structure of this node server is the following:
 * 1.) server-controller starts an express server which defines the static
 *     content, port number and sets up handle bars to use the views and layouts
 * 2.) URLs are then routed by defining a url and calling addEndpoint(). On
 *     requests to a matching url the onRequest() method is called in the
 *     passed in controller (i.e. StaticPageController)
 *
 */

var serverController = require('./server/controllers/server-controller');
var StaticPageController = require(
  './server/controllers/static-page-controller');
var APIController = require('./server/controllers/api-controller');

// APIController serves up the HTML without any HTML body or head
serverController.addEndpoint('/api*', new APIController(
  serverController.getHandleBarsInstance()
));
// The static page controller serves the basic form of the pages
serverController.addEndpoint('/*', new StaticPageController());
serverController.startServer(process.env.PORT);
