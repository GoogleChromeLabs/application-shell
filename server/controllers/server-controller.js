'use strict';

var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var fs = require('fs');
/**
 * Server controller takes care of starting and
 * configuring an Express server to handle
 * network requests
 */
class ServerController {
  constructor() {
    let templatePath = path.join(__dirname, '..', '..', 'templates');
    let assetBuildPath = path.join(__dirname, '..', '..', 'build');

    this._handlerbarsInstance = exphbs.create({
      defaultLayout: 'default',
      layoutsDir: path.join(templatePath, 'layouts'),
      partialsDir: path.join(templatePath, 'partials'),
      helpers: {
        inlineFile: function(filePath) {
          try {
            let actualFilePath = path.join(assetBuildPath, filePath);
            return fs.readFileSync(actualFilePath);
          } catch (err) {
            console.log('Unknown file inline request.', filePath);
          }
          return '';
        }
      }
    });

    this._expressApp = express();
    // Set up the use of handle bars and set the path for views and layouts
    this._expressApp.set('views', path.join(templatePath, 'views'));
    this._expressApp.engine('handlebars', this._handlerbarsInstance.engine);
    this._expressApp.set('view engine', 'handlebars');

    // Define static assets path - i.e. styles, scripts etc.
    this._expressApp.use('/',
      express.static(path.join(assetBuildPath)));

    this._expressServer = null;
  }

  startServer(port) {
    // As a failsafe use port 0 if the input isn't defined
    // this will result in a random port being assigned
    // See : https://nodejs.org/api/http.html for details
    if (typeof port === 'undefined' ||
      port === null ||
      isNaN(parseInt(port, 10))
    ) {
      port = 0;
    }

    this._expressServer = this._expressApp.listen(port, () => {
      var serverPort = this._expressServer.address().port;
      console.log('Server running on port ' + serverPort);
    });
  }

  addUIEndpoint(route, pageOpts) {
    this._expressApp.get(route, (req, res) => {
      res.render(pageOpts.template, pageOpts.handlebarsConfig);
    });

    this._expressApp.get('/api/partials' + route, (req, res) => {
      let templatePath = path.join(
        __dirname,
        '..', '..',
        'templates', 'views',
        pageOpts.template + '.handlebars'
      );
      this._handlerbarsInstance.render(
        templatePath,
        pageOpts.handlebarsConfig
      )
      .then(function(renderedTemplate) {
        var apiConfig = pageOpts.apiConfig;
        apiConfig.html = renderedTemplate;
        res.json(apiConfig);
      })
      .catch(function(err) {
        console.log('Partial API Error: ' + err);
        res.status(500).send();
      });
    });
  }
}

module.exports = new ServerController();
