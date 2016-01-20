'use strict';

var PageOptions = require('./server/models/page-options');
var serverController = require('./server/controllers/server-controller');

var indexPageOptions = new PageOptions('index', 'Index Title');
indexPageOptions.addInlineStylesheet('/styles/core.css');
indexPageOptions.addRemoteStylesheet(
  'https://fonts.googleapis.com/css?family=Roboto:' +
  '400,300,700,500,400italic');
serverController.addUIEndpoint('/', indexPageOptions);

var url1Options = new PageOptions('url-1', 'URL 1 Title');
url1Options.addInlineStylesheet('/styles/core.css');
url1Options.addRemoteStylesheet(
  'https://fonts.googleapis.com/css?family=Roboto:' +
  '400,300,700,500,400italic');
serverController.addUIEndpoint('/url-1', url1Options);

var url2Options = new PageOptions('url-2', 'URL 2 Title');
url2Options.addInlineStylesheet('/styles/core.css');
url2Options.addRemoteStylesheet(
  'https://fonts.googleapis.com/css?family=Roboto:' +
  '400,300,700,500,400italic');
serverController.addUIEndpoint('/url-2', url2Options);

var appShellOptions = new PageOptions(null, 'App Shell Title Title');
appShellOptions.addInlineStylesheet('/styles/core.css');
appShellOptions.addRemoteStylesheet(
  'https://fonts.googleapis.com/css?family=Roboto:' +
  '400,300,700,500,400italic');
appShellOptions.setLayout('app-shell');
serverController.addUIEndpoint('/app-shell', appShellOptions);

serverController.startServer(process.env.PORT);
