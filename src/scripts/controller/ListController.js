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

export default class ListController extends Controller {

  constructor() {
    super();

    this.ctaView = document.querySelector('.js-cta');
    this.view = document.querySelector('.js-list-view');

    Promise.all([
      this.loadCSS('/styles/list.css')
    ])
    .then( () => {
      this.getContentAndPopulate();
    });
  }

  getContentAndPopulate() {
    console.log('Get content and populate');
    this.ctaView.classList.add('empty-set-cta--visible');
  }
}
