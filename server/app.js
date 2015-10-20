'use strict';

var serverController = require('./controllers/server-controller');
var StaticPageController = require('./controllers/static-page-controller');

serverController.addEndpoint('/*', new StaticPageController());
