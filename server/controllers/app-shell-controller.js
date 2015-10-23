'use strict';

var fs = require('fs');
var path = require('path');

function AppShellController() {

}

function prepareData(config) {
  // Concat inline styles for document <head>
  var flattenedStyles = '';
  var pathPrefix = '/../../dist/';
  config.inlineStyles.forEach(function(file) {
    flattenedStyles += fs.readFileSync(path.resolve(__dirname) +
      pathPrefix + file);
  });

  // Replace array with flattened string of content
  config.inlineStyles = flattenedStyles;
  return config;
}

// This method looks at the request path and renders the appropriate handlebars
// template
AppShellController.prototype.onRequest = function(req, res) {
  switch (req.path) {
  case '/app-shell':
    res.render('index', prepareData({
      layout: 'app-shell',
      inlineStyles: ['/styles/core.css'],
      remoteStyles: [],
      inlineScripts: [],
      remoteScripts: ['/scripts/core.js']
    }));
    break;
  default:
    res.status(404).send();
    break;
  }
};

module.exports = AppShellController;
