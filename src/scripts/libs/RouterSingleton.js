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
 * distributed under the License is distributed on an "AS IS" p
 BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export default class RouterSingleton {

  static getRouter() {
    if (typeof window.RouterInstance_ !== 'undefined') {
      return window.RouterInstance_;
    }

    window.RouterInstance_ = new Router();

    return window.RouterInstance_;
  }

}

class Router {
  constructor() {
    this.routes = {};
    this.currentPath = null;
    this.defaultActivity = null;

    window.addEventListener('popstate', (e) => {
      this.onPopState(e);
    });
  }

  addRoute(path, activity) {
    if (this.routes[path]) {
      throw 'A handler already exists for this path: ' + path;
    }

    this.routes[path] = activity;
  }

  setDefaultRoute(activity) {
    if (this.defaultActivity) {
      throw 'A default handler already exists';
    }

    this.defaultActivity = activity;
  }

  removeRoute(path) {
    if (!this.routes[path]) {
      return;
    }

    delete this.routes[path];
  }

  requestStateUpdate() {
    requestAnimationFrame(() => {
      this.manageState();
    });
  }

  manageState() {
    var newPath = document.location.pathname;
    var newActivity = this.routes[newPath];
    var currentActivity = this.routes[this.currentPath];

    if (!newActivity && this.defaultActivity) {
      newActivity = this.defaultActivity;
    }

    if (this.currentPath === newPath) {
      if (typeof newActivity.onUpdate === 'function') {
        newActivity.onUpdate();
        return true;
      }

      return false;
    }

    // Remove the old action and update the reference.
    if (currentActivity) {
      // Allow the incoming view to delay the outgoing one
      // so that we don't get too much overlapping animation.
      currentActivity.onFinish();
    }

    if (newActivity) {
      newActivity.onStart(newPath);
      this.currentPath = newPath;
    } else {
      this.currentPath = null;
    }

    return true;
  }

  goToPath(path, title = null) {
    console.log('goToPath() path = ' + path);
    // Only process real changes.
    if (path === window.location.pathname) {
      return;
    }

    history.pushState(undefined, title, path);
    requestAnimationFrame(() => {
      this.manageState();
    });
  }

  onPopState(e) {
    e.preventDefault();
    this.requestStateUpdate();
  }
}
