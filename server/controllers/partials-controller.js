'use strict';

var pathConfigs = require('../models/path-config.js');

function PartialsController() {

}

// This method looks at the request path and renders the appropriate handlebars
// template
PartialsController.prototype.onRequest = function(req, res) {
  var urlSections = req.path.split('/');
  urlSections = urlSections.filter(function(sectionString) {
    return sectionString.length > 0;
  });

  var urlPath = null;
  if (urlSections.length === 1) {
    urlPath = '/';
  } else {
    urlPath = '/' + urlSections[1];
  }

  var pathConfig = pathConfigs.getConfig(urlPath);
  if (!pathConfig) {
    res.status(404).send();
    return;
  }

  pathConfig.layout = 'partial';
  res.render(pathConfig.view, pathConfig);
};

module.exports = PartialsController;
