/* Clients: rotate the commercial logos one page at a time (6x3 desktop, 3x4 tablet, 2x5 mobile).
   Auto-rotates every 5 s, pauses on hover/focus or with the pause button, and is
   static when the visitor prefers reduced motion. Without JS every logo stays visible. */
(function () {
  var grid = document.querySelector('.cl-grid[data-paged]');
  if (!grid) return;

  var tiles = Array.prototype.slice.call(grid.children);
  var wrap = grid.parentNode;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INTERVAL = 5000, FADE = 300;
  var page = 0, pages = 1, size = tiles.length, timer = null, userPaused = reduce, hovering = false;

  tiles.forEach(function (li) { li.firstElementChild.loading = 'eager'; });   /* avoid pop-in on page change */

  var ICON = {
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>'
  };
  var ctrl = document.createElement('div');
  ctrl.className = 'cl-ctrl';
  ctrl.innerHTML =
    '<button class="cl-ctrl__btn" type="button" data-act="prev" aria-label="Previous logos">' + ICON.prev + '</button>' +
    '<div class="cl-dots"></div>' +
    '<button class="cl-ctrl__btn" type="button" data-act="next" aria-label="Next logos">' + ICON.next + '</button>' +
    '<button class="cl-ctrl__btn" type="button" data-act="toggle"></button>';
  grid.insertAdjacentElement('afterend', ctrl);
  var dots = ctrl.querySelector('.cl-dots');
  var toggle = ctrl.querySelector('[data-act="toggle"]');

  function paintToggle() {
    toggle.innerHTML = userPaused ? ICON.play : ICON.pause;
    toggle.setAttribute('aria-label', userPaused ? 'Start rotating logos' : 'Pause rotating logos');
  }

  function apply() {
    tiles.forEach(function (li, i) { li.hidden = Math.floor(i / size) !== page; });
    Array.prototype.forEach.call(dots.children, function (d, i) {
      d.setAttribute('aria-current', i === page ? 'true' : 'false');
    });
  }

  function go(p, animate) {
    page = (p + pages) % pages;
    if (!animate || reduce) { apply(); return; }
    grid.classList.add('is-fading');
    setTimeout(function () { apply(); grid.classList.remove('is-fading'); }, FADE);
  }

  function layout() {
    var cs = getComputedStyle(grid);
    var cols = cs.gridTemplateColumns.split(' ').length;
    var rows = parseInt(cs.getPropertyValue('--cl-rows'), 10) || 3;
    size = cols * rows;
    pages = Math.ceil(tiles.length / size);
    if (page >= pages) page = 0;
    dots.innerHTML = '';
    for (var i = 0; i < pages; i++) {
      var b = document.createElement('button');
      b.className = 'cl-dot'; b.type = 'button';
      b.setAttribute('data-page', i);
      b.setAttribute('aria-label', 'Logos page ' + (i + 1) + ' of ' + pages);
      dots.appendChild(b);
    }
    ctrl.hidden = pages < 2;
    apply();
    restart();
  }

  function restart() {
    clearInterval(timer);
    if (pages > 1 && !userPaused && !hovering && !document.hidden) {
      timer = setInterval(function () { go(page + 1, true); }, INTERVAL);
    }
  }

  ctrl.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.act === 'prev') go(page - 1, true);
    else if (b.dataset.act === 'next') go(page + 1, true);
    else if (b.dataset.act === 'toggle') { userPaused = !userPaused; paintToggle(); }
    else if (b.dataset.page) go(+b.dataset.page, true);
    restart();
  });

  wrap.addEventListener('mouseenter', function () { hovering = true; restart(); });
  wrap.addEventListener('mouseleave', function () { hovering = false; restart(); });
  wrap.addEventListener('focusin', function () { hovering = true; restart(); });
  wrap.addEventListener('focusout', function () { hovering = false; restart(); });
  document.addEventListener('visibilitychange', restart);

  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 150); });

  paintToggle();
  layout();
})();