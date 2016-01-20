'use strict';

class PageOptions {
  constructor(template, pageTitle) {
    this._template = (!template) ? '' : template;
    this._title = pageTitle;
    this._inlineStylesheets = [];
    this._remoteStylesheets = [];
    this._inlineScripts = [];
    this._remoteScripts = [];
    this._layout = null;
  }

  get template() {
    return this._template;
  }

  get handlebarsConfig() {
    var handlebarsConfig = {
      title: this._title,
      inlineStylesheets: this._inlineStylesheets,
      remoteStylesheets: this._remoteStylesheets,
      inlineScripts: this._inlineScripts,
      remoteScripts: this._remoteScripts
    };
    if (this._layout !== null) {
      handlebarsConfig.layout = this._layout;
    }
    return handlebarsConfig;
  }

  get apiConfig() {
    return {
      title: this._title,
      inlineStylesheets: this._inlineStylesheets,
      remoteStylesheets: this._remoteStylesheets,
      inlineScripts: this._inlineScripts,
      remoteScripts: this._remoteScripts
    };
  }

  addInlineStylesheet(stylesheet) {
    this._inlineStylesheets.push(stylesheet);
  }

  addInlineStylesheets(stylesheets) {
    this._inlineStylesheets = this._inlineStylesheets.concat(stylesheets);
  }

  addRemoteStylesheet(stylesheet) {
    this._remoteStylesheets.push(stylesheet);
  }

  addRemoteStylesheets(stylesheets) {
    this._remoteStylesheets = this._remoteStylesheets.concat(stylesheets);
  }

  addInlineScript(script) {
    this._inlineScripts.push(script);
  }

  addInlineScripts(scripts) {
    this._inlineScripts = this._inlineScripts.concat(scripts);
  }

  addRemoteScript(script) {
    this._remoteScripts.push(script);
  }

  addRemoteScripts(scripts) {
    this._remoteScripts = this._remoteScripts.concat(scripts);
  }

  setLayout(layout) {
    this._layout = layout;
  }
}

module.exports = PageOptions;
