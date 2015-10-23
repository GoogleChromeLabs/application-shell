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
import NavDrawerView from './../view/NavDrawerView';
import AppModel from '../model/AppModel';
// import toasterInstance from '../libs/Toaster';
import routerInstance from '../libs/Router';
import pubSubInstance from '../libs/PubSub';

export default class AppController extends Controller {

  constructor() {
    super();

    this.newappshellingButton =
      document.querySelector('.js-new-appshelling-btn');
    this.sideNavToggleButton = document.querySelector('.js-toggle-menu');

    this.appModel = null;
    this.navDrawer = new NavDrawerView();

    this.sideNavToggleButton.addEventListener('click', () => {
      this.navDrawer.toggle();
    });

    AppModel.get(1)
      .then (appModel => {
        routerInstance()
          .then(router => {
            router.add('_root',
              (data) => this.show(data),
              () => this.hide());
          });

        console.log(appModel);

        this.appModel = appModel;

        if (appModel === undefined) {
          this.appModel = new AppModel();
          this.appModel.put();
        }

        if (this.appModel.firstRun) {
          // Show welcome screen
        }

        // Wait for the first frame because sometimes
        // window.onload fires too quickly.
        requestAnimationFrame(() => {
          function showWaitAnimation(e) {
            e.target.classList.add('pending');
          }

          this.newappshellingButton.addEventListener('click',
            showWaitAnimation);
        });
      });
  }

  show() {
    // this.sideNavToggleButton.tabIndex = 1;
    // this.newappshellingButton.tabIndex = 2;
  }

  hide() {
    // this.sideNavToggleButton.tabIndex = -1;
    // this.newappshellingButton.tabIndex = -1;

    pubSubInstance().then(ps => {
      ps.pub('list-covered');
    });
  }
}
