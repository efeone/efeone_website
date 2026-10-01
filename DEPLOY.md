# Deploying efeone.com

The site is plain HTML, CSS and JavaScript. Deployment is copying this folder to
the web root — there is nothing to build, install or compile.

Pages are flat `.html` files with relative links, so opening `index.html`
directly gives you the whole site — styling and navigation included. To see it
as a visitor will:

```bash
python3 -m http.server 8000     # preview at http://localhost:8000
```

It also means the site works unchanged in a subdirectory rather than at a
domain root.

---

## 1. Rotate the leaked API token — before anything else

The previous site shipped a Frappe API token in public JavaScript:

```
assets/js/main_index.js    assets/js/team.js       assets/js/blog.js
assets/js/alumni.js        assets/js/application.js
```

Each contained `Authorization: token ffceb203fabe2fc:773041385edd49a` for
`https://jalebi.efeone.com`. Anyone who viewed source could read Project,
Customer, Employee and Job Opening records, and anything else that key is scoped
to.

Those files have been removed from this branch, **but that does not undo the
exposure.** The token was publicly readable for as long as the old site was up
and may sit in caches, archives and scrapers.

**Do this:**

1. Revoke that API key and secret in the Frappe user it belongs to.
2. Check which user owns it and what permissions that user has. If it is a System
   Manager or Administrator key, treat it as a full compromise and review the
   audit log for unexpected reads.
3. If you issue a replacement, keep it server side. Nothing in this site needs an
   API key, and no page should ever carry one again.

---

## 2. Dynamic content is now static

The old site fetched team members, alumni, job openings and the homepage counters
from the ERP in the browser. That is what required the token, and it also meant
none of that content was crawlable.

Those pages are now ordinary HTML that you edit:

| Page | How to update |
| --- | --- |
| `team.html` | Replace the empty state with one `<figure class="person">` block per person |
| `alumni.html` | Same markup as the team page |
| `careers.html` | Replace the empty state with one `<article class="job">` block per opening |
| Homepage counters | Add a `<section class="band band--ground stat-band">` to `index.html` |

The markup for each is in `assets/css/site.css` under *people*, *jobs* and
*stats*. A person block looks like this:

```html
<figure class="person">
  <div class="person__photo">
    <img src="assets/img/team/firstname-lastname.jpg" alt="Firstname Lastname"
         loading="lazy" width="320" height="320">
  </div>
  <figcaption>
    <p class="person__name">Firstname Lastname</p>
    <p class="person__role">Role</p>
  </figcaption>
</figure>
```

Wrap the set in `<div class="people"> … </div>`.

`team.html` and `alumni.html` sit at the root, so their asset paths have no
`../`. A page inside `services/` or `blog/` needs one.

`team.html` and `alumni.html` currently carry `<meta name="robots" content="noindex, follow">`
because an empty page is worse in the index than no page. **Remove that meta tag
from both once they have people on them**, and add them to `sitemap.xml`.

If you would rather these stayed automatic, the Node generator that produced this
site — including a build-time fetch that kept the token off the client — is in
this branch's history at commit `4833195`. It can be restored without discarding
any of the current HTML.

---

## 3. Choose the canonical host

Everything is built for **`https://efeone.com`** — no `www`. The audit found both
hosts resolving separately and HTTP not redirecting, which splits ranking signals
across up to four versions of every page.

To switch to `www` instead, find and replace `https://efeone.com` across all
`.html` files plus `sitemap.xml` and `robots.txt`, and invert the redirect rules
below. Do not run both.

---

## 4. Server configuration

`.htaccess` ships with the Apache rules: HTTP to HTTPS, `www` to non-`www`,
trailing slashes, redirects from the old page URLs, caching and security headers.

If the host is not Apache the `.htaccess` is inert and you need the equivalent.

### Nginx

```nginx
server {
  listen 80;
  server_name efeone.com www.efeone.com;
  return 301 https://efeone.com$request_uri;
}

server {
  listen 443 ssl http2;
  server_name www.efeone.com;
  return 301 https://efeone.com$request_uri;
}

server {
  listen 443 ssl http2;
  server_name efeone.com;
  root /var/www/efeone.com;

  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy strict-origin-when-cross-origin always;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

  location / {
    try_files $uri $uri/index.html $uri/ =404;
  }

  location /assets/ {
    expires 7d;
    add_header Cache-Control "public";
  }

  # The previous site's URLs are the same paths here, so they need no redirect.

  error_page 404 /404.html;
}
```

### Netlify or Cloudflare Pages

No build command, publish directory `/`. Add a 301 from `www.efeone.com/*` to
`https://efeone.com/:splat` and keep "Always Use HTTPS" on. For Netlify, add a
`_redirects` file carrying the five legacy URLs above.

---

## 5. The enquiry form

`contact.html` posts JSON to `/api/enquiry`. That endpoint does not exist
yet — until it does the form shows its failure message and points the visitor at
`info@efeone.com`, so nothing is silently lost.

Three ways to finish it:

1. **A Frappe webhook** that creates a Lead or Issue from the posted JSON. This
   puts enquiries where the sales team already works. Give it its own
   server-side credentials; never put a key back into the page.
2. **A host form service** — Netlify Forms, or a Cloudflare Worker. Change the
   `action` attribute on the `<form>` in `contact.html`.
3. **A small serverless function** that emails `info@efeone.com`.

Add a spam control (a honeypot field or a captcha) before announcing the URL.

---

## 6. Analytics and Search Console

Neither was connected on the old site, so there is no historic baseline. Set both
up before launch so the rebuild has a before and after.

- **Search Console:** verify the `https://efeone.com` property and submit
  `https://efeone.com/sitemap.xml`.
- **GA4:** paste the tag into the `<head>` of every page — it is the one change
  that genuinely has to touch all 32 files. Then configure conversions for
  enquiry submissions, `mailto:` clicks and `tel:` clicks. `assets/js/site.js`
  already has a success branch in the form handler to hook into.

The tag is deliberately not included. Adding an analytics script before the
measurement ID and cookie notice are agreed is how consent problems start.

---

## 7. Cutting over

1. Rotate the token (step 1). Independent of launch; do not let it wait.
2. Fill in `team.html`, `alumni.html` and `careers.html`, and drop the
   `noindex` tags.
3. Preview locally and click through the navigation, the service pages and the
   contact form.
4. Run the duplicate check from the README — both commands should print nothing.
5. Check it at a phone width before signing off.
6. Copy this folder to the web root, excluding `.git`, `README.md` and
   `DEPLOY.md`.
7. Confirm `https://efeone.com/sitemap.xml` and `/robots.txt` load, and that
   `http://efeone.com` and `https://www.efeone.com` both 301 to the canonical
   host.
8. Submit the sitemap, then watch Search Console coverage for two weeks.

---

## The blog posts on `jalebi.efeone.com`

There are already published articles on the Frappe site. They rank for that
subdomain, which is why the blog looked empty to the auditor — efeone.com gets
none of their value.

Move them: create `blog/<slug>.html` for each by copying an existing
article, then 301 the old `jalebi.efeone.com/<route>` to
`https://efeone.com/blog/<slug>.html`. The redirect is what transfers the accumulated
authority. Copying the text without it creates two competing copies and helps
nobody.

Seven to eight more articles takes the blog to the ten the audit recommended.
