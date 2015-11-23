'use strict';

var pathConfigs = require('../models/path-config.js');

function StaticPageController() {

}

// This method looks at the request path and renders the appropriate handlebars
// template
StaticPageController.prototype.onRequest = function(req, res) {
  var pathConfig = pathConfigs.getConfig(req.path);
  if (!pathConfig) {
    res.status(404).send();
    return;
  }


  switch (req.path) {
  case '/app-shell':
    // Render with app-shell layout and include no initial content
    pathConfig.layout = 'app-shell';
    res.render('', pathConfig);
    return;
  default:
    // Use default layout
    res.render(pathConfig.data.view, pathConfig);
    return;
  }
};

module.exports = StaticPageController;
