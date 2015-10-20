export default class NavDrawerView {

  constructor() {
    this.rootElement = document.querySelector('.js-side-nav');
    this.sideNavContent = this.rootElement.querySelector('.js-side-nav-content');

    var touchStartX;
    var sideNavTransform;

    var onSideNavTouchStart = (e) => {
      touchStartX = e.touches[0].pageX;
    };

    var onSideNavTouchMove = (e) => {
      var newTouchX = e.touches[0].pageX;
      sideNavTransform = Math.min(0, newTouchX - touchStartX);

      if (sideNavTransform < 0) {
        e.preventDefault();
      }

      this.sideNavContent.style.transform =
        'translateX(' + sideNavTransform + 'px)';
    };

    var onSideNavTouchEnd = (e) => {
      if (sideNavTransform < -1) {
        this.closeSideNav();
      }
    };

    this.rootElement.addEventListener('click', () => {
      this.close();
    });

    this.sideNavContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    this.sideNavContent.addEventListener('touchstart', onSideNavTouchStart);
    this.sideNavContent.addEventListener('touchmove', onSideNavTouchMove);
    this.sideNavContent.addEventListener('touchend', onSideNavTouchEnd);
  }

  isOpen() {
    return this.rootElement.classList.contains('side-nav--visible');
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  close() {
    this.rootElement.classList.remove('side-nav--visible');
    this.sideNavContent.classList.add('side-nav__content--animatable');
    this.sideNavContent.style.transform = 'translateX(-102%)';
  }

  open() {
    this.rootElement.classList.add('side-nav--visible');

    var onSideNavTransitionEnd = (e) => {
      // Force the focus, otherwise touch doesn't always work.
      this.sideNavContent.tabIndex = 0;
      this.sideNavContent.focus();
      this.sideNavContent.removeAttribute('tabIndex');

      this.sideNavContent.classList.remove('side-nav__content--animatable');
      this.sideNavContent.removeEventListener('transitionend',
          onSideNavTransitionEnd);
    };

    this.sideNavContent.classList.add('side-nav__content--animatable');
    this.sideNavContent.addEventListener('transitionend',
          onSideNavTransitionEnd);

    requestAnimationFrame( () => {
      this.sideNavContent.style.transform = 'translateX(0px)';
    });
  }

}
