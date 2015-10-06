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

export default function RouterInstance () {

  if (typeof window.RouterInstance_ !== 'undefined')
    return Promise.resolve(window.RouterInstance_);

  window.RouterInstance_ = new Router();

  return Promise.resolve(window.RouterInstance_);
}

class Router {

  constructor () {
    this.routes = {};
    this.currentAction = null;
    this.loader = document.querySelector('.loader');

    window.addEventListener('popstate', (e) => {
      this.onPopState(e);
    });

    this.manageState();
  }

  add (path, callbackIn, callbackOut, callbackUpdate) {

    // Assume the first part of the path is the
    // verb we want to action, with the rest of the path
    // being the data to pass to the handler.
    var pathParts = path.split('/');
    var action = pathParts.shift();

    if (this.routes[action])
      throw "A handler already exists for this action: " + action;

    this.routes[action] = {
      in: callbackIn,
      out: callbackOut,
      update: callbackUpdate
    };

    // Check to see if this path is fulfilled.
    requestAnimationFrame(() => {
      if (this.manageState()) {
        document.body.classList.remove('deeplink');
      }
    });
  }

  remove (path) {

    var pathParts = path.split('/');
    var action = pathParts.shift();

    if (!this.routes[action])
      return;

    delete this.routes[action];
  }

  manageState () {

    var path = document.location.pathname.replace(/^\//, '');

    // Assume the first part of the path is the
    // verb we want to action, with the rest of the path
    // being the data to pass to the handler.
    var pathParts = path.split('/');
    var action = pathParts.shift();
    var data = pathParts.join('/');

    // Add a special case for the root.
    if (action === '')
      action = '_root';

    // Remove any deeplink covers.
    if (document.body.classList.contains('app-deeplink'))
      document.body.classList.remove('app-deeplink');

    // Hide the loader.
    this.loader.classList.add('hidden');

    if (this.currentAction === this.routes[action]) {

      if (typeof this.currentAction.update === 'function') {
        this.currentAction.update(data);
        return true;
      }

      return false;
    }

    if (!this.routes[action]) {

      if (this.currentAction)
        this.currentAction.out();

      this.currentAction = null;
      document.body.focus();
      return false;
    }

    // Set the new action going.
    var delay = this.routes[action].in(data) || 0;

    // Remove the old action and update the reference.
    if (this.currentAction) {

      // Allow the incoming view to delay the outgoing one
      // so that we don't get too much overlapping animation.
      if (delay === 0)
        this.currentAction.out();
      else
        setTimeout(this.currentAction.out, delay);
    }

    this.currentAction = this.routes[action];

    return true;
  }

  go (path) {

    // Only process real changes.
    if (path === window.location.pathname)
      return;

    history.pushState(undefined, "", path);
    requestAnimationFrame(() => {
      this.manageState();
    });
  }

  onPopState (e) {
    e.preventDefault();
    requestAnimationFrame(() => {
      this.manageState();
    });
  }
}
