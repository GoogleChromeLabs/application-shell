/**
 * Copyright 2014 Google Inc. All rights reserved.
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

export default function ToasterInstance () {

  if (typeof window.ToasterInstance_ !== 'undefined')
    return Promise.resolve(window.ToasterInstance_);

  window.ToasterInstance_ = new Toaster();

  return Promise.resolve(window.ToasterInstance_);
}

class Toaster {

  constructor () {
    this.view = document.querySelector('.toast-view');
    this.hideTimeout = 0;
    this.hideBound = this.hide.bind(this);
  }

  toast (message) {

    this.view.textContent = message;
    this.view.classList.add('toast-view--visible');

    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(this.hideBound, 3000);
  }

  hide () {
    this.view.classList.remove('toast-view--visible');
  }
}
