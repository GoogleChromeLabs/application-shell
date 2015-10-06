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

export default class Controller {

  loadScript (url) {

    return new Promise((resolve, reject) => {
      var script = document.createElement('script');
      script.async = true;
      script.src = url;

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  loadCSS (url) {
    return new Promise((resolve, reject) => {

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'text';
      xhr.onload = function(e) {

        if (this.status == 200) {

          var style = document.createElement('style');
          style.textContent = xhr.response;
          document.head.appendChild(style);
          resolve();

        } else {

          reject();

        }
      }

      xhr.send();

    });
  }

}
