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
import AppModel from '../model/AppModel';
import PubSubInstance from '../libs/PubSub';
import ToasterInstance from '../libs/Toaster';
import DialogInstance from '../libs/Dialog';
import RouterInstance from '../libs/Router';

export default class AppController extends Controller {

  constructor () {

    super();

    this.appModel = null;
    this.sideNavToggleButton = document.querySelector('.js-toggle-menu');
    this.sideNav = document.querySelector('.js-side-nav');
    this.sideNavContent = this.sideNav.querySelector('.js-side-nav-content');
    this.loadScript('/scripts/list.js')
    this.newappshellingButton = document.querySelector('.js-new-appshelling-btn');

    AppModel.get(1).then (appModel => {

      RouterInstance().then(router => {
        router.add('_root',
            (data) => this.show(data),
            () => this.hide());
      });

      this.appModel = appModel;

      if (appModel === undefined) {
        this.appModel = new AppModel();
        this.appModel.put();
      }

      if (this.appModel.firstRun) {
        // Show welcome screen
      }

      var touchStartX;
      var sideNavTransform;
      var onSideNavTouchStart = (e) => {
        touchStartX = e.touches[0].pageX;
      }

      var onSideNavTouchMove = (e) => {

        var newTouchX = e.touches[0].pageX;
        sideNavTransform = Math.min(0, newTouchX - touchStartX);

        if (sideNavTransform < 0)
          e.preventDefault();

        this.sideNavContent.style.transform =
          'translateX(' + sideNavTransform + 'px)';
      }

      var onSideNavTouchEnd = (e) => {

        if (sideNavTransform < -1)
          this.closeSideNav();

      }

      this.sideNav.addEventListener('click', () => {
        this.closeSideNav();
      });
      this.sideNavContent.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      this.sideNavContent.addEventListener('touchstart', onSideNavTouchStart);
      this.sideNavContent.addEventListener('touchmove', onSideNavTouchMove);
      this.sideNavContent.addEventListener('touchend', onSideNavTouchEnd);

      // Wait for the first frame because sometimes
      // window.onload fires too quickly.
      requestAnimationFrame(() => {

        function showWaitAnimation (e) {
          e.target.classList.add('pending');
        }

        this.newappshellingButton.addEventListener('click', showWaitAnimation);

        this.sideNavToggleButton.addEventListener('click', () => {
          this.toggleSideNav();
        });
      });

      if ('serviceWorker' in navigator) {

        navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        }).then(function(registration) {

          var isUpdate = false;

          // If this fires we should check if there's a new Service Worker
          // waiting to be activated. If so, ask the user to force refresh.
          if (registration.active)
            isUpdate = true;

          registration.onupdatefound = function(event) {

            console.log("A new Service Worker version has been found...");

            // If an update is found the spec says that there is a new Service
            // Worker installing, so we should wait for that to complete then
            // show a notification to the user.
            registration.installing.onstatechange = function(event) {

              if (this.state === 'installed') {

                console.log("Service Worker Installed.");

                if (isUpdate) {
                  ToasterInstance().then(toaster => {
                    toaster.toast(
                        'App updated. Restart for the new version.');
                  });
                } else {
                  ToasterInstance().then(toaster => {
                    toaster.toast('App ready for offline use.');
                  });
                }

              } else {
                console.log("New Service Worker state: ", this.state);
              }
            };
          };
        }, function(err) {
          console.log(err);
        });
      }
    });
  }


  show () {
    this.sideNavToggleButton.tabIndex = 1;
    this.newappshellingButton.tabIndex = 2;
  }

  hide () {
    this.sideNavToggleButton.tabIndex = -1;
    this.newappshellingButton.tabIndex = -1;

    PubSubInstance().then(ps => {
      ps.pub('list-covered');
    });
  }

  toggleSideNav () {

    if (this.sideNav.classList.contains('side-nav--visible'))
      this.closeSideNav();
    else
      this.openSideNav();
  }

  openSideNav() {

    this.sideNav.classList.add('side-nav--visible');
    this.sideNavToggleButton.focus();

    var onSideNavTransitionEnd = (e) => {

      // Force the focus, otherwise touch doesn't always work.
      this.sideNavContent.tabIndex = 0;
      this.sideNavContent.focus();
      this.sideNavContent.removeAttribute('tabIndex');

      this.sideNavContent.classList.remove('side-nav__content--animatable');
      this.sideNavContent.removeEventListener('transitionend',
          onSideNavTransitionEnd);
    }

    this.sideNavContent.classList.add('side-nav__content--animatable');
    this.sideNavContent.addEventListener('transitionend',
          onSideNavTransitionEnd);

    requestAnimationFrame( () => {

      this.sideNavContent.style.transform = 'translateX(0px)';

    });
  }

  closeSideNav() {
    this.sideNav.classList.remove('side-nav--visible');
    this.sideNavContent.classList.add('side-nav__content--animatable');
    this.sideNavContent.style.transform = 'translateX(-102%)';
  }


}
