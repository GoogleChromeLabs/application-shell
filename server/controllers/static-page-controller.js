'use strict';

var fs = require('fs');
var path = require('path');

function StaticPageController() {

}

function prepareData(config) {
  // Concat inline styles for document <head>
  var flattenedStyles = '';
  var pathPrefix = '/../../dist/';
  config.inlineStyles.forEach(function(file) {
    flattenedStyles += fs.readFileSync(path.resolve(__dirname) + pathPrefix + file);
  });
  // Replace array with flattened string of content
  config.inlineStyles = flattenedStyles;
  return config;
};

StaticPageController.prototype.onRequest = function(req, res) {
  switch (req.path) {
  case '/':
    res.render('index', prepareData({
      inlineStyles: ['/styles/core.css'],
      remoteStyles: [],
      inlineScripts: [],
      remoteScripts: ['/scripts/static-page.js']
    }));
    break;
  case '/url-1':
    res.render('url-1', prepareData({
      inlineStyles: ['/styles/core.css'],
      remoteStyles: [],
      inlineScripts: [],
      remoteScripts: ['/scripts/static-page.js']
    }));
    break;
  case '/url-2':
    res.render('url-2', prepareData({
      inlineStyles: ['/styles/core.css'],
      remoteStyles: [],
      inlineScripts: [],
      remoteScripts: ['/scripts/static-page.js']
    }));
    break;
  default:
    res.status(404).send();
    break;
  }
};

module.exports = StaticPageController;
