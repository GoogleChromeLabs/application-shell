export default class PageController {
  constructor() {
    this.loader = document.querySelector('.js-global-loader');
    this.mainContainer = document.querySelector('.js-global-main');

    this.DEFAULT_TITLE = 'App Shell';
  }

  onUpdate() {
    console.log('onUpdate: ', this.path);
  }

  onStart(path) {
    console.log('onStart: ', path);

    // Show loading dialog while we get content
    this.loader.classList.remove('is-hidden');

    this.updateNavDrawer(path);

    fetch('/api' + path)
      .then((response) => {
        if (response.status === 404) {
          this.show404();
          return null;
        }

        return response.json();
      })
      .then((responseObject) => {
        // Hide loading dialog
        this.loader.classList.add('is-hidden');

        if (responseObject === null) {
          throw new Error('Unexpected response from Server.');
        }

        if (responseObject.title) {
          document.title = responseObject.title;
        } else {
          document.title = this.DEFAULT_TITLE;
        }

        // Add style element to the document head
        var styleElement = document.createElement('style');
        styleElement.textContent = responseObject.partialinlinestyles;
        document.head.appendChild(styleElement);

        // Add content from partial to page
        this.mainContainer.innerHTML = responseObject.partialhtml;

        // TODO: Handle remote scripts

        // TODO: Handle remote styles
      })
      .catch((error) => {
        this.showError('There was a problem loading this page');
      });
  }

  onFinish() {
    console.log('onFinish');
    // Remove any existing styles
    var insertedStyles =
      document.querySelector('.js-partial-styles');
    if (insertedStyles) {
      document.head.removeChild(insertedStyles);
    }

    // Remove the current content
    while (this.mainContainer.firstChild) {
      this.mainContainer.removeChild(this.mainContainer.firstChild);
    }
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
