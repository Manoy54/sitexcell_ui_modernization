(() => {
  const updateScrolledState = () => {
    const isScrolled = window.scrollY > 8;

    document.body.classList.toggle('sx-page-scrolled', isScrolled);
    document.documentElement.classList.toggle('sx-page-scrolled', isScrolled);
  };

  updateScrolledState();
  window.addEventListener('scroll', updateScrolledState, { passive: true });

  const menuButton = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    const menuLabel = menuButton.querySelector('.sr-only');
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuLabel.textContent = 'Open navigation menu';
      mobileMenu.hidden = true;
    };

    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuLabel.textContent = isOpen ? 'Open navigation menu' : 'Close navigation menu';
      mobileMenu.hidden = isOpen;
    });

    mobileMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileMenu.hidden) {
        closeMenu();
        menuButton.focus();
      }
    });

    const desktopNavigation = window.matchMedia('(min-width: 1024px)');
    desktopNavigation.addEventListener('change', (event) => {
      if (event.matches) closeMenu();
    });
  }

  const form = document.querySelector('[data-prototype-form]');
  const formStatus = document.querySelector('[data-form-status]');

  if (form && formStatus) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      formStatus.hidden = false;
      formStatus.textContent = 'Prototype complete. Your information has not been sent or stored.';
      formStatus.focus();
    });
  }
})();
