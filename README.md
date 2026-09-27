# Bluepetal Website

A minimalist, mobile-first catalogue website for Bluepetal, a small
home-run studio making hand-painted fashion artwork (clutches, sarees,
stoles, and more). Plain HTML/CSS/JS — no build step, no framework.

## Running locally

The Google Sheet fetch and ES module scripts require an http(s) origin, so
opening the HTML files directly (`file://`) won't fully work. Serve the
folder with any static server, for example:

```bash
npx serve .
```

or

```bash
python -m http.server 8000
```

If neither Node.js nor Python is installed, there's a zero-dependency
PowerShell server included at [tools/serve.ps1](tools/serve.ps1) (Windows,
uses only the built-in .NET `HttpListener`):

```powershell
powershell -File tools\serve.ps1
```

Then open `http://localhost:PORT/index.html` (default port `5500` for the
PowerShell server, `8000` for Python).

## Product catalogue data

Product listings are maintained in a Google Sheet and loaded by the site at
runtime — no code changes needed to add or remove products. See
[docs/MAINTAINER-GUIDE.md](docs/MAINTAINER-GUIDE.md) for the non-technical,
step-by-step guide, and set your Sheet's ID in
[js/config.js](js/config.js) (`SHEET_ID`).

Until a real Sheet is configured, or if it's ever unreachable, the site
falls back to the bundled sample data in
[data/products.sample.json](data/products.sample.json).

## Theming

All colors, fonts, and spacing are defined as CSS custom properties in
[css/variables.css](css/variables.css). The palette is matched to the real
logo at [images/logo.webp](images/logo.webp) (a teal, hand-painted-elegance
theme). To swap in a different logo later, replace that file (same filename,
or update the `<img src>` in each page's header/footer) and adjust the
palette in `variables.css` to match.

## Deployment (GitHub Pages)

This repo deploys via GitHub Pages directly from the `main` branch:

1. Push to `main`.
2. In the GitHub repo, go to **Settings → Pages** and confirm the source is
   set to the `main` branch, root folder.
3. The `CNAME` file at the repo root points the site at `bluepetals.co.in`.
   At GoDaddy, set these DNS records for the domain:
   - `A` records on `@` → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `CNAME` record: `www` → `kulakshay.github.io.`
4. Once GitHub verifies the domain (DNS can take up to 24-48h to
   propagate), enable **Enforce HTTPS** in the Pages settings.

## Project structure

```
index.html, about.html, catalogue.html, contact.html, 404.html   Pages
css/                CSS custom properties, base styles, components
js/                 Native ES modules — config, Sheet loading, rendering, nav, search, lightbox
data/               Local fallback/sample product data
images/             Logo, hero, and placeholder product photos
docs/               Maintainer guide for non-technical catalogue updates
```
