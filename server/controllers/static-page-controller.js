'use strict';

function StaticPageController() {

}

StaticPageController.prototype.onRequest = function(req, res) {
  switch (req.path) {
  case '/':
    res.render('index', {
      inlineStyles: ['/styles/core.css'],
      remoteStyles: [],
      inlineScripts: [],
      remoteScripts: ['/scripts/static-page.js']
    });
    break;
  case '/url-1':
    res.render('url-1', {
      inlineStyles: ['/styles/core.css'],
      remoteStyles: [],
      inlineScripts: [],
      remoteScripts: ['/scripts/static-page.js']
    });
    break;
  case '/url-2':
    res.render('url-2', {
      inlineStyles: ['/styles/core.css'],
      remoteStyles: [],
      inlineScripts: [],
      remoteScripts: ['/scripts/static-page.js']
    });
    break;
  default:
    res.status(404).send();
    break;
  }
};

module.exports = StaticPageController;
