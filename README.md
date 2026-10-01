# efeone.com

The efeone website: plain HTML, CSS and JavaScript. No build step, no
dependencies, no framework. What is in this repository is exactly what gets
served.

Rebuilt in response to the October 2026 SEO and social audits, which found a
6-page site with duplicate titles, no meta descriptions, no H1s, no sitemap and
eight services that were anchor links rather than pages.

## Viewing it locally

Double-click `index.html`. Styling, images and every link between pages work
straight from the filesystem — no server needed.

To check it the way a visitor will see it, serve it:

```bash
python3 -m http.server 8000      # then open http://localhost:8000
```

**One file is deliberately different.** `404.html` uses root-absolute paths
(`/assets/...`, `/services.html`). The server returns it for any missing URL, so
relative paths there would resolve against whatever directory the visitor was in
and a 404 at `/a/b/c/` would load no CSS. Leave that file's paths alone.

## Structure

```
index.html                 home
404.html                   not found
about.html  contact.html  team.html  alumni.html  careers.html
case-studies.html  privacy-policy.html
services.html              hub
services/*.html            8 service pages
industries.html            hub
industries/*.html          6 industry pages
blog.html                  hub
blog/*.html                3 articles
locations.html             hub
locations/*.html           2 location pages
assets/css/site.css        the whole stylesheet
assets/js/site.js          mobile nav and the enquiry form
assets/img/                favicon, touch icon, logo, Open Graph image
sitemap.xml  robots.txt  .htaccess
```

Pages are flat `.html` files and links between them are relative, which is what
lets the site work from the filesystem as well as from a server. Each page has
exactly one URL — `/services/erpnext-implementation.html` — with no redirect in
between, and that is what the canonical tag and the sitemap use.

Three of the filenames (`blog.html`, `team.html`, `careers.html`, `alumni.html`,
`privacy-policy.html`) match the previous site's URLs exactly, so old inbound
links keep working with no redirect at all.

## Colour

The site is dark only — one fixed theme, no switcher. `<meta name="color-scheme"
content="dark">` tells the browser, so native form controls and scrollbars match.

**Colour is referenced through the tokens at the top of `assets/css/site.css`
and nowhere else.** A hex value elsewhere will drift out of step with them. The
same applies in HTML: the logo marks use `fill="currentColor"` so they inherit.

The contrast bands (`.band--ink`, the footer) sit at `#181818` rather than the
page black. At `#0b0b0b` they would vanish into the background and the
alternation between sections would be lost.

Every text and background pair meets WCAG AA (4.5:1). The greys used for card
indexes and dates are the tightest at 5.3:1, so re-check contrast if you darken
them.

## Design

Black and white, no third colour. Space Grotesk for headings, IBM Plex Sans for
body, IBM Plex Mono for labels and numerals, all from Google Fonts. (Quicksand
was dropped when the wordmark became artwork — nothing sets type in it now.) Hierarchy
comes from scale, weight and hairline rules.

Everything visual lives in `assets/css/site.css`, organised by component with
the design tokens as custom properties at the top — one block per theme. Change
a token there and it changes everywhere, in both themes.

Breakpoints are 1080px, 900px (where the navigation collapses to the menu
button), 560px and 380px. Layouts are single-column from 900px down, tables
scroll inside their own container rather than widening the page, and form inputs
are 16px so iOS does not zoom when they are focused.

The logo is the supplied artwork, not a redrawing. The source
(`efeone_logo_new.png`) is black ink on an opaque near-white background, so it
was cut out: the background became transparency and the ink was recoloured to
`--fg`. Dropping the original in unprocessed would have put a white box around
the logo on every dark surface.

| File | What it is | Used by |
| --- | --- | --- |
| `efeone-logo.png` | Full lockup, white ink, transparent, 730×168 | Header and footer |
| `efeone-logo-on-light.png` | Full lockup, black ink on white, 800×242 | JSON-LD `Organization.logo` |
| `og-default.png` | Lockup on page black, 1200×630 | Open Graph and Twitter cards |
| `apple-touch-icon.png` | Mark only on page black, 180×180 | Home-screen icon |
| `favicon.svg` | Mark as vector, measured from the artwork | Browser tab |

The lockup includes the tagline, as drawn. It is 9.3% of the artwork's height,
so the logo is set at 40px in the header and 56px in the footer — below about
30px the tagline stops reading as letters at all. Because alpha follows the
source luminance and the tagline is inked lighter than the wordmark (mean 91
against 29), it stays proportionally dimmer without being handled separately.

The touch icon is the mark alone: at 180px square a full lockup would be a
smear.

Two of these are deliberately on a solid background rather than transparent:
search engines render the `Organization` logo on their own white surface, and a
home-screen icon has no page behind it.

Greyscale-plus-alpha keeps `efeone-logo.png` at 15 KB; it is single-colour
artwork, so storing full RGB would roughly double that for no visible gain.

## Editing

Pages are standalone HTML. Content sits between `<main id="main">` and `</main>`;
everything above and below it is the shared header, breadcrumbs and footer.

**The shared parts are duplicated across all 32 pages.** That is the cost of
having no build step: changing a navigation item or the footer address means the
same edit in every file. Use find-and-replace across the folder, and check the
result before committing:

```bash
grep -rl 'old text' --include='*.html' .
```

### Adding a page

1. Copy the closest existing page — a new service starts from
   `services/erpnext-implementation.html`.
2. Fix the relative paths for the new page's depth. A page at the root uses
   `assets/…` and `services/x.html`; a page one directory down uses
   `../assets/…` and `../services.html`. Every `href` and `src` in the file is
   relative, so check them all.
3. Change, in the `<head>`: `<title>`, the meta description, the canonical URL,
   both `og:` and `twitter:` title/description/url, and the JSON-LD block
   (`@id`, `name`, `url`, the FAQ entries and the breadcrumb trail).
4. Change the `<h1>` and the body copy. One `<h1>` per page, no more.
5. Add a `<url>` entry to `sitemap.xml`.
6. Link to it from its hub page and from any related page, so it is reachable by
   crawling rather than only from the sitemap.

### The checklist every page has to pass

The audit's findings were almost all of this kind, so it is worth being strict.
There is no longer a build to catch these automatically:

- [ ] A `<title>` that appears on no other page, 20–62 characters
- [ ] A meta description that appears on no other page, 70–165 characters
- [ ] Exactly one `<h1>`, matching what the page is about
- [ ] A canonical URL pointing at this page on `https://efeone.com`
- [ ] JSON-LD that parses, with the ids and breadcrumbs updated
- [ ] `alt` on every image
- [ ] A row in `sitemap.xml`
- [ ] At least one link in from another page

To check titles and descriptions are still unique across the site:

```bash
grep -rho '<title>[^<]*' --include='*.html' . | sort | uniq -d
grep -rho 'name="description" content="[^"]*' --include='*.html' . | sort | uniq -d
```

Both should print nothing.

## Structured data

Every page carries `Organization` and `WebSite` in a single JSON-LD graph. Pages
add to it: `ProfessionalService` on home, about, contact and locations; `Service`
and `FAQPage` on service and industry pages; `BlogPosting` on articles;
`BreadcrumbList` everywhere below the top level.

Validate changes at <https://validator.schema.org/> before publishing — a JSON
syntax error silently disables rich results rather than showing an error.

## Before deploying

Read [DEPLOY.md](DEPLOY.md). It opens with rotating the API token the previous
site published in client-side JavaScript, which needs doing whether or not this
rebuild ships.
