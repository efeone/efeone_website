/* efeone — the only client-side script on the site.
   No framework, no analytics calls, and no API credentials. Everything here
   degrades to working HTML if the script fails to load. */

(function () {
  'use strict';

  /* Mobile navigation ----------------------------------------------------- */

  var toggleNav = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setNav(open) {
    if (open) nav.setAttribute('data-open', '');
    else nav.removeAttribute('data-open');
    toggleNav.setAttribute('aria-expanded', String(open));
    toggleNav.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (toggleNav && nav) {
    toggleNav.addEventListener('click', function () {
      setNav(!nav.hasAttribute('data-open'));
    });

    // Close on Escape so keyboard users are not trapped behind the panel.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.hasAttribute('data-open')) {
        setNav(false);
        toggleNav.focus();
      }
    });

    // Close when the viewport grows past the breakpoint, otherwise the panel
    // stays flagged open and reappears on the next resize back down.
    if (window.matchMedia) {
      var wide = window.matchMedia('(min-width: 901px)');
      var onWide = function (event) {
        if (event.matches && nav.hasAttribute('data-open')) setNav(false);
      };
      if (wide.addEventListener) wide.addEventListener('change', onWide);
      else if (wide.addListener) wide.addListener(onWide);
    }
  }

  /* Enquiry form ---------------------------------------------------------- */

  var form = document.querySelector('[data-enquiry-form]');
  if (!form) return;

  var status = form.querySelector('.form__status');
  var submit = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    submit.disabled = true;
    status.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed with status ' + response.status);
        form.reset();
        status.textContent = 'Thank you — we will reply within one working day.';
      })
      .catch(function () {
        status.innerHTML =
          'Something went wrong sending that. Please email ' +
          '<a href="mailto:info@efeone.com">info@efeone.com</a> and we will pick it up from there.';
      })
      .finally(function () {
        submit.disabled = false;
      });
  });
})();
