export default class NavDrawerView {

  constructor() {
    this.rootElement = document.querySelector('.js-side-nav');
    this.sideNavContent = this.rootElement
      .querySelector('.js-side-nav-content');
    this.sideNavBody = this.rootElement.querySelector('.side-nav__body');

    this.rootElement.addEventListener('click', () => {
      this.close();
    });

    this.sideNavContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    this.hasUnprefixedTransform = 'transform' in document.documentElement.style;
    if (this.hasUnprefixedTransform) {
      // Touch slop is a variable that is defined to suggest anything larger
      // than this value was an intended gesture by the user.
      // 8  is a value from Android platform.
      // 3 was added as a factor made up from what felt right.
      var TOUCH_SLOP = 8 * window.devicePixelRatio * 3;

      var touchStartX;
      var sideNavTransform;

      var onSideNavTouchStart = (e) => {
        e.preventDefault();
        touchStartX = e.touches[0].pageX;
      };

      var onSideNavTouchMove = (e) => {
        e.preventDefault();

        var newTouchX = e.touches[0].pageX;
        sideNavTransform = Math.min(0, newTouchX - touchStartX);

        this.sideNavContent.style.transform =
          'translateX(' + sideNavTransform + 'px)';
      };

      var onSideNavTouchEnd = (e) => {
        if (sideNavTransform < -TOUCH_SLOP) {
          this.close();
          return;
        }

        this.open();
      };

      this.sideNavContent.addEventListener('touchstart', onSideNavTouchStart);
      this.sideNavContent.addEventListener('touchmove', onSideNavTouchMove);
      this.sideNavContent.addEventListener('touchend', onSideNavTouchEnd);
    }
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

    if (this.hasUnprefixedTransform) {
      this.sideNavContent.style.transform = 'translateX(-102%)';
    } else {
      this.sideNavContent.classList.remove('side-nav--visible');
    }
  }

  open() {
    this.rootElement.classList.add('side-nav--visible');

    if (this.hasUnprefixedTransform) {
      var onSideNavTransitionEnd = (e) => {
        this.sideNavBody.focus();

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
    } else {
      this.sideNavContent.classList.add('side-nav--visible');
    }
  }

}
