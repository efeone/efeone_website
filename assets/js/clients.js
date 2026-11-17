/* Clients: rotate the commercial logos one page at a time (6x3 desktop, 3x4 tablet, 2x5 mobile).
   Auto-rotates every 5 s, pauses on hover/focus, and is static when the visitor
   prefers reduced motion. Without JS every logo stays visible. */
// (function () {
//   var grid = document.querySelector('.cl-grid[data-paged]');
//   if (!grid) return;

//   var tiles = Array.prototype.slice.call(grid.children);
//   var wrap = grid.parentNode;
//   var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//   var INTERVAL = 5000, FADE = 300;
//   var page = 0, pages = 1, size = tiles.length, timer = null, userPaused = reduce, hovering = false;

//   tiles.forEach(function (li) { li.firstElementChild.loading = 'eager'; });   /* avoid pop-in on page change */

//   var ctrl = document.createElement('div');
//   ctrl.className = 'cl-ctrl';
//   ctrl.innerHTML = '<div class="cl-dots"></div>';
//   grid.insertAdjacentElement('afterend', ctrl);
//   var dots = ctrl.querySelector('.cl-dots');

//   function apply() {
//     tiles.forEach(function (li, i) { li.hidden = Math.floor(i / size) !== page; });
//     Array.prototype.forEach.call(dots.children, function (d, i) {
//       d.setAttribute('aria-current', i === page ? 'true' : 'false');
//     });
//   }

//   function go(p, animate) {
//     page = (p + pages) % pages;
//     if (!animate || reduce) { apply(); return; }
//     grid.classList.add('is-fading');
//     setTimeout(function () { apply(); grid.classList.remove('is-fading'); }, FADE);
//   }

//   function layout() {
//     var cs = getComputedStyle(grid);
//     var cols = cs.gridTemplateColumns.split(' ').length;
//     var rows = parseInt(cs.getPropertyValue('--cl-rows'), 10) || 3;
//     size = cols * rows;
//     pages = Math.ceil(tiles.length / size);
//     if (page >= pages) page = 0;
//     dots.innerHTML = '';
//     for (var i = 0; i < pages; i++) {
//       var b = document.createElement('button');
//       b.className = 'cl-dot'; b.type = 'button';
//       b.setAttribute('data-page', i);
//       b.setAttribute('aria-label', 'Logos page ' + (i + 1) + ' of ' + pages);
//       dots.appendChild(b);
//     }
//     ctrl.hidden = pages < 2;
//     apply();
//     restart();
//   }

//   function restart() {
//     clearInterval(timer);
//     if (pages > 1 && !userPaused && !hovering && !document.hidden) {
//       timer = setInterval(function () { go(page + 1, true); }, INTERVAL);
//     }
//   }

//   ctrl.addEventListener('click', function (e) {
//     var b = e.target.closest('button'); if (!b || !b.dataset.page) return;
//     go(+b.dataset.page, true);
//     restart();
//   });

//   wrap.addEventListener('mouseenter', function () { hovering = true; restart(); });
//   wrap.addEventListener('mouseleave', function () { hovering = false; restart(); });
//   wrap.addEventListener('focusin', function () { hovering = true; restart(); });
//   wrap.addEventListener('focusout', function () { hovering = false; restart(); });
//   document.addEventListener('visibilitychange', restart);

//   var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 150); });

//   layout();
// })();

/* Clients: logos come from Frappe File records attached to Customers.
   Customer groups come from the Customer list. If anything fails, the static logos stay. */
/* Clients: logos from the Frappe Customer API (same headers as enquiry.js).
   - Uses Customer.image; if empty, uses the file attached to that Customer.
   - If the API fails or no logo loads, the static logos in the HTML stay. */
(function () {
  var API = 'https://jalebi.efeone.com';
  var HEADERS = {
    'Accept': 'application/json',
    'Authorization': 'token ffceb203fabe2fc:773041385edd49a'
  };

  var grid   = document.getElementById('clGrid');
  var gridNp = document.getElementById('clGridNp');
  if (!grid) return;

  var backup   = grid.innerHTML;                    /* static logos, used if the API fails */
  var backupNp = gridNp ? gridNp.innerHTML : '';
  var pending  = [];

  function get(path) {
    return fetch(API + path, { headers: HEADERS })
      .then(function (r) { if (!r.ok) throw new Error(path + ' -> HTTP ' + r.status); return r.json(); })
      .then(function (j) { return j.data || []; });
  }

  function fixUrl(u) {
    if (!/^https?:/i.test(u)) u = API + u;           /* relative /files/... paths */
    try { return encodeURI(decodeURI(u)); } catch (e) { return u; }   /* spaces in file names */
  }

  function q(path, fields, filters) {
    return path
      + '?fields=' + encodeURIComponent(JSON.stringify(fields))
      + (filters ? '&filters=' + encodeURIComponent(JSON.stringify(filters)) : '')
      + '&limit_page_length=0';
  }

  var customersReq = get(q('/api/resource/Customer',
    ['name', 'customer_name', 'image', 'disabled', 'customer_group']));

  /* attached files are only a fallback, so a failure here is ignored */
  var filesReq = get(q('/api/resource/File',
    ['file_url', 'attached_to_name'],
    [['attached_to_doctype', '=', 'Customer'], ['is_private', '=', 0]]))
    .catch(function () { return []; });

  Promise.all([customersReq, filesReq])
    .then(function (res) {
      var customers = res[0], files = res[1];

      var fileOf = {};
      files.forEach(function (f) {
        if (!f.file_url || /\.(pdf|docx?|xlsx?|csv|zip)(\?|$)/i.test(f.file_url)) return;   /* images only */
        if (!fileOf[f.attached_to_name]) fileOf[f.attached_to_name] = f.file_url;
      });

      var seen = {}, com = [], np = [];
      customers.forEach(function (c) {
        if (c.disabled) return;
        var g = c.customer_group;
        if (g && g !== 'Commercial' && g !== 'Non Profit') return;     /* skip Individual, Project and Resource */
        var raw = c.image || fileOf[c.name];
        if (!raw) return;
        var url = fixUrl(raw);
        if (seen[url]) return;                                         /* same logo used twice */
        seen[url] = true;
        (g === 'Non Profit' ? np : com).push({ name: c.customer_name || c.name, url: url });
      });
      console.log('Logos found. Commercial:', com.length, 'Non-profit:', np.length);

      var byName = function (a, b) { return a.name.localeCompare(b.name); };
      com.sort(byName); np.sort(byName);

      if (com.length) {
        fill(grid, com);
        setText('clLabel', 'Commercial & institutional \u00B7 ' + com.length + ' organisations');
      }
      if (gridNp && np.length) {
        fill(gridNp, np);
        setText('clLabelNp', 'Non-profit partners \u00B7 ' + np.length + ' organisations');
      }
      setText('clCount', com.length + np.length);
    })
    .catch(function (e) { console.error('Clients load failed, using static logos', e); })
    .then(function () { return Promise.all(pending); })
    .then(function () {
      if (!grid.children.length) {
        console.warn('No API logo loaded, restoring static logos');
        grid.innerHTML = backup;
        if (gridNp) gridNp.innerHTML = backupNp;
      }
      initPager(grid);
    });

  function setText(id, t) { var el = document.getElementById(id); if (el) el.textContent = t; }

  function fill(ul, list) {
    ul.innerHTML = '';
    list.forEach(function (c) {
      pending.push(new Promise(function (done) {
        var li = document.createElement('li');
        li.className = 'cl-tile';
        var img = new Image();
        img.alt = c.name;
        img.width = 440; img.height = 369;
        img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';          /* some hosts block hotlinking */
        img.onload = done;
        img.onerror = function () { console.warn('Logo failed:', c.name, c.url); li.remove(); done(); };
        setTimeout(done, 6000);                       /* do not wait forever for slow images */
        img.src = c.url;
        li.appendChild(img);
        ul.appendChild(li);
      }));
    });
  }

  /* ---------- existing pager, unchanged ---------- */
  function initPager(grid) {
    var tiles = Array.prototype.slice.call(grid.children);
    var wrap = grid.parentNode;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var INTERVAL = 5000, FADE = 300;
    var page = 0, pages = 1, size = tiles.length, timer = null, userPaused = reduce, hovering = false;

    var ctrl = document.createElement('div');
    ctrl.className = 'cl-ctrl';
    ctrl.innerHTML = '<div class="cl-dots"></div>';
    grid.insertAdjacentElement('afterend', ctrl);
    var dots = ctrl.querySelector('.cl-dots');

    function apply() {
      tiles = Array.prototype.slice.call(grid.children);
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
      pages = Math.ceil(grid.children.length / size);
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
      apply(); restart();
    }
    function restart() {
      clearInterval(timer);
      if (pages > 1 && !userPaused && !hovering && !document.hidden) {
        timer = setInterval(function () { go(page + 1, true); }, INTERVAL);
      }
    }
    ctrl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !b.dataset.page) return;
      go(+b.dataset.page, true); restart();
    });
    wrap.addEventListener('mouseenter', function () { hovering = true; restart(); });
    wrap.addEventListener('mouseleave', function () { hovering = false; restart(); });
    wrap.addEventListener('focusin', function () { hovering = true; restart(); });
    wrap.addEventListener('focusout', function () { hovering = false; restart(); });
    document.addEventListener('visibilitychange', restart);
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 150); });
    layout();
  }
})();