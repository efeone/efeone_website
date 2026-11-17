(function () {
  // Site root, worked out from this script's own location (assets/js/layout.js).
  // Keeps links correct on the home page, in /services/, in /industries/,
  // and under the GitHub Pages sub-path. Works with or without `defer`.
  var self = document.currentScript || document.querySelector('script[src*="layout.js"]');
  var B = new URL('../../', self.src).href;

  var header = `
<header class="site-header">
  <div class="shell site-header__inner">
    <a class="logo" href="${B}index.html" aria-label="efeone home">
      <img class="logo__img" src="${B}assets/img/efeone-logo.jpeg" alt="" width="730" height="168">
    </a>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <a href="${B}services.html">Services</a>
      <a href="${B}industries.html">Industries</a>
      <div class="nav-dd">
        <button class="nav-dd__trigger" type="button" aria-haspopup="true" aria-expanded="false">
          Products
          <svg class="nav-dd__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <ul class="nav-dd__menu">
          <li><span>OneHealth</span></li>
          <li><span>AUMMS</span></li>
          <li><span>eSellerSuite</span></li>
          <li><span>OneCompliance</span></li>
          <li><span>Facility Management</span></li>
        </ul>
      </div>
      <a href="${B}blog.html">Blog</a>
      <a href="${B}about.html">About</a>
      <a class="btn btn--primary site-nav__cta" href="${B}contact.html">Talk to us</a>
    </nav>
    <button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
      <span class="nav-toggle__bar"></span><span class="nav-toggle__bar"></span><span class="nav-toggle__bar"></span>
    </button>
  </div>
</header>`;

  // Replace the placeholder if it exists; otherwise add at the top of <body>.
  function run() {
    var el = document.getElementById('site-header');
    if (el) el.outerHTML = header;
    else document.body.insertAdjacentHTML('afterbegin', header);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();