var fs = require('fs');
var path = require('path');

var pathConfigs = {
  '/': {
    view: 'index',
    inlineStyles: getFileContents(['/styles/core.css']),
    remoteScripts: ['/scripts/static-page.js']
  },
  '/url-1': {
    view: 'url-1',
    inlineStyles: getFileContents(['/styles/core.css']),
    remoteScripts: ['/scripts/static-page.js']
  },
  '/url-2': {
    view: 'url-2',
    inlineStyles: getFileContents(['/styles/core.css']),
    remoteScripts: ['/scripts/static-page.js']
  },
  '/app-shell': {
    view: '',
    inlineStyles: getFileContents(['/styles/core.css']),
    remoteScripts: ['/scripts/core.js']
  }
};

function getFileContents(files) {
  // Concat inline styles for document <head>
  var flattenedContents = '';
  var pathPrefix = '/../../dist/';
  files.forEach(function(file) {
    flattenedContents += fs.readFileSync(path.resolve(__dirname) +
      pathPrefix + file);
  });

  return flattenedContents;
}

module.exports = {
  getConfig: function(urlPath) {
    // This needed to ensure changes made to the objects dont stick / alter
    // the original object
    return Object.create(pathConfigs[urlPath]);
  }
};
