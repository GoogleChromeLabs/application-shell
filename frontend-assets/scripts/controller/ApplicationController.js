/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Controller from './Controller';
import RouterSingleton from '../libs/RouterSingleton';
import NavDrawerView from './../view/NavDrawerView';

export default class ApplicationController extends Controller {

  constructor() {
    super();

    this.prepareGlobalViews();
    this.consumeLocalLinks();

    if (!this._mainContainer.classList.contains('is-initialised')) {
      this.loadNewPage(window.location.pathname);
    }
  }

  /**
   * These are views that will remain throughout all
   * of the web app (i.e. nav drawer and toast popup)
   */
  prepareGlobalViews() {
    this._mainContainer = document.querySelector('.js-global-main');
    this._navdrawer = new NavDrawerView();

    let sideNavToggleButton = document.querySelector('.js-toggle-menu');
    sideNavToggleButton.addEventListener('click', () => {
      this._navdrawer.toggle();
    });
  }

  /**
   * This will look for anchor elements that
   * link to pages on the current origin and
   * intercept them
   */
  consumeLocalLinks() {
    let allLinks = document.querySelectorAll('a');
    for (let i = 0; i < allLinks.length; i++) {
      let linkItem = allLinks[i];
      if (!linkItem.href) {
        continue;
      }

      let linkUrl = new URL(linkItem.href);
      if (linkUrl.origin === window.location.origin) {
        linkItem.addEventListener('click', event => {
          event.preventDefault();

          if (this._navdrawer) {
            this._navdrawer.close();
          }

          this.loadNewPage(new URL(linkItem.href).pathname);
        });
      }
    }
  }

  loadNewPage(pathName) {
    console.log('Load new path');
    var responseObject = null;

    // show loading dialog
    if (this._loader) {
      this._loader.classList.remove('is-hidden');
    }

    fetch('/api/partials' + pathName)
    .then((response) => {
      if (response.status === 404) {
        this.show404();
        return null;
      }

      return response.json();
    })
    .then((response) => {
      if (response === null) {
        throw new Error('Unexpected response from Server.');
      }

      responseObject = response;

      // Hide loading dialog
      if (this._loader) {
        this._loader.classList.add('is-hidden');
      }

      return this.loadStylesheets(responseObject.inlineStylesheets);
    })
    .then(() => {
      return this.loadScripts(responseObject.inlineScripts);
    })
    .then(() => {
      // These are treated as remote so can load asynchronously
      // while the application controller continues work.
      this.loadStylesheets(responseObject.remoteStylesheets);
      this.loadScripts(responseObject.remoteScripts);
    })
    .then(() => {
      this._mainContainer.innerHTML = responseObject.html;
    })
    .then(() => {
      // Change Route?
      var router = RouterSingleton.getRouter();
      router.goToPath(pathName, responseObject.title);
    })
    .catch((error) => {
      console.error(error);
      // TODO Show an error message to the user
    });
    /** var router = RouterSingleton.getRouter();
    router.addRoute('/', new PageController());
    router.addRoute('/url-1', new PageController());
    router.addRoute('/url-2', new PageController());
    router.setDefaultRoute(new PageController());
    router.requestStateUpdate(); **/
  }

  loadScripts(scripts) {
    return Promise.all(
      scripts.map(script => {
        return this.loadScript(script);
      })
    );
  }

  loadScript(url) {
    return new Promise((resolve, reject) => {
      var script = document.createElement('script');
      script.async = true;
      script.src = url;

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  loadStylesheets(stylesheets) {
    return Promise.all(
      stylesheets.map(stylesheet => {
        return this.loadStylesheet(stylesheet);
      })
    );
  }

  loadStylesheet(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'text';
      xhr.onload = function(e) {
        if (this.status === 200) {
          var style = document.createElement('style');
          style.textContent = xhr.response;
          document.head.appendChild(style);
          resolve();
        } else {
          reject();
        }
      };
      xhr.send();
    });
  }
}
