# Daekwang desktop proof breakout QA

## Reference defects

- Home: the baked quality/material row was clipped by the footer.
- Facilities: the baked facility-strength row appeared twice and collided with the footer.
- Quality: the full-page raster source made text and tables soft at desktop sizes.

## Implemented authority

- Home keeps the approved upper raster and renders the quality/material row and footer as real DOM.
- Facilities keeps the approved upper raster and renders exactly one facility-strength row and footer as real DOM.
- Quality is a desktop DOM page with browser-rendered type, process steps, inspection table, real product photographs, and footer.
- Mobile remains on the existing independent mobile shell.

## Visual verification

- 1440 home: proof row bottom equals footer top; no clipping or overlap.
- 1440 facilities: one strength row with four actions; no duplicate row; footer starts after the row.
- 1440 and 1920 quality: DOM authority, 46px hero title, no legacy exact-screen image, no horizontal overflow.
- 390 home/facilities/quality: mobile shell preserved, bottom navigation clear, broken images 0, horizontal overflow 0.
- Facility CTA: one unique action opens one modal; close leaves dialog 0 and backdrop 0.
- Browser console warnings/errors: 0.

## Evidence

See `evidence/desktop-proof-breakout-v3-local/`.

final result: passed
