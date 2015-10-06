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

export default function DialogInstance () {

  if (typeof window.DialogInstance_ !== 'undefined')
    return Promise.resolve(window.DialogInstance_);

  window.DialogInstance_ = new Dialog();

  return Promise.resolve(window.DialogInstance_);
}

class Dialog {

  constructor () {
    this.view = document.querySelector('.js-dialog');
    this.title = this.view.querySelector('.js-title');
    this.message = this.view.querySelector('.js-message');
    this.cancelButton = this.view.querySelector('.js-cancel');
    this.okayButton = this.view.querySelector('.js-okay');
  }

  show (title, message, hideCancel) {

    this.title.textContent = title;
    this.message.textContent = message;
    this.view.classList.add('dialog-view--visible');

    if (hideCancel)
      this.cancelButton.classList.add('hidden');
    else
      this.cancelButton.classList.remove('hidden');

    return new Promise((resolve, reject) => {

      var removeEventListenersAndHide = () => {
        this.cancelButton.removeEventListener('click', onCancel);
        this.okayButton.removeEventListener('click', onOkay);
        this.view.classList.remove('dialog-view--visible');
      }

      var onCancel = (e) => {
        removeEventListenersAndHide();
        reject();
      }

      var onOkay = (e) => {
        removeEventListenersAndHide();
        resolve();
      }

      this.cancelButton.addEventListener('click', onCancel);
      this.okayButton.addEventListener('click', onOkay);

    });
  }

}
