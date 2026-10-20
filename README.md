# Gold Tier Event Hall — goldtiereventhall.com

Single-page marketing site for **Gold Tier Event Hall**, an event venue in Stuart, Florida.
Built with vanilla HTML, CSS and JavaScript — no build step, no dependencies.

## Structure

```
index.html        Entry point (all sections)
css/styles.css    Full stylesheet (design tokens + responsive layout)
js/main.js        Nav, scroll reveals, form validation & submission
favicon.svg       Favicon placeholder
robots.txt        Crawler directives
sitemap.xml       Sitemap
```

## Sections

Hero (with Call Now CTA) → event-type strip → The Venue → Events We Host (services) →
What's Included → How Booking Works → Reviews → Contact (form + details) → Footer.

## Local preview

Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000
```

## Contact form

The contact form POSTs to the LeadrVision endpoint configured in both
`index.html` (`<form action>`) and `js/main.js` (`FORM_ENDPOINT`).

- Works without JavaScript (plain POST → returns with `?submitted=1`, which the page
  detects and confirms).
- With JavaScript it submits via `fetch()` to the same URL and confirms inline.
- Includes `_form`, `_page` and a `_gotcha` honeypot hidden field.

## Notes for the site owner

Public contact details in `index.html`, `js/main.js` and the JSON-LD block use a
reserved, non-routable stand-in phone number — `(772) 555-0137`. Replace every
occurrence with the real business phone number, email and street address before
launch. Search for `555-0137` to find them all.
