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

import ToasterSingleton from '../libs/ToasterSingleton';

export default class Controller {

  constructor(registerServiceWorker = true) {
    if (registerServiceWorker) {
      this.registerServiceWorker();
    }
  }

  registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      // Service worker is not supported on this platform
      return;
    }

    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    }).then((registration) => {
      console.log('Service worker is registered.');

      var isUpdate = false;

      // If this fires we should check if there's a new Service Worker
      // waiting to be activated. If so, ask the user to force refresh.
      if (registration.active) {
        isUpdate = true;
      }

      registration.onupdatefound = function(updateEvent) {
        console.log('A new Service Worker version has been found...');

        // If an update is found the spec says that there is a new Service
        // Worker installing, so we should wait for that to complete then
        // show a notification to the user.
        registration.installing.onstatechange = function(event) {
          if (this.state === 'installed') {
            if (isUpdate) {
              ToasterSingleton.getToaster().toast(
                  'App updated. Restart for the new version.');
            } else {
              ToasterSingleton.getToaster().toast(
                  'App ready for offline use.');
            }
          }
        };
      };
    })
    .catch((err) => {
      console.log('Unable to register service worker.', err);
    });
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

  loadCSS(url) {
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
