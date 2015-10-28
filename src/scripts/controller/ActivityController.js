export default class ActivityController {
  constructor() {
    this.loader = document.querySelector('.js-global-loader');
    this.mainContainer = document.querySelector('.js-global-main');
  }

  onUpdate() {
    console.log('onUpdate: ', this.path);
  }

  onStart(path) {
    console.log('onStart: ', path);

    // Show loading dialog while we get content
    this.loader.classList.remove('is-hidden');

    this.updateNavDrawer(path);

    fetch('/partials' + path)
      .then((response) => {
        if (response.status === 404) {
          this.show404();
          return null;
        }

        return response.text();
      })
      .then((responseText) => {
        if (responseText !== null) {
          this.mainContainer.innerHTML = responseText;
        }

        // Hide loading dialog
        this.loader.classList.add('is-hidden');
      })
      .catch((error) => {
        this.showError('There was a problem loading this page');
      });
  }

  onFinish() {
    console.log('onFinish: ', this.path);
  }

  show404() {
    var headingElement = document.createElement('h1');
    headingElement.textContent = '404.';
    this.mainContainer.appendChild(headingElement);

    var paragraphElement = document.createElement('p');
    paragraphElement.textContent = 'Oops - looks like this ' +
      'page isn\'t valid.';
    this.mainContainer.appendChild(paragraphElement);
  }

  showError(msg) {
    var headingElement = document.createElement('h1');
    headingElement.textContent = 'Ooopps.';
    this.mainContainer.appendChild(headingElement);

    var paragraphElement = document.createElement('p');
    paragraphElement.textContent = 'There was a problem displaying this page ' +
      ', sorry about that.';
    this.mainContainer.appendChild(paragraphElement);
  }

  updateNavDrawer(path) {
    var nodeList = document.querySelectorAll('.side-nav__body a');
    [].forEach.call(nodeList, function(el) {
      // Reset active states
      el.classList.remove('active');
      // We could compare against path, but easier to compare
      // against the current document href
      if (el.href === document.location.href) {
        el.classList.add('active');
      }
    });
  }
}
