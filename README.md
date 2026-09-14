# ADURE — A wider perspective

A complete, ten-chapter editorial homepage concept using the supplied brand identity, approved font names and company-profile imagery. Built on the existing static stack with native CSS and JavaScript; no framework, animation library or build step.

## View locally

Serve `dist` over HTTP (ES modules require a server):

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Then visit <http://127.0.0.1:4173/>. Do not open the HTML with a `file:` URL.

## Editing

- `dist/content.js`: journeys, management, figures, demonstration collections, budget options, portfolio, transition stages and approved client logos.
- `dist/index.html`: chapter copy, semantic page structure, navigation and enquiry form.
- `dist/styles.css`: brand tokens, composition, responsive layouts and motion preferences.
- `dist/app.js`: interactive indexes, filtering, portfolio browsing and enquiry drafts.
- `dist/intro.js`: the skippable opening starts with the compact text alone, squeezes the supplied video between the phrases, holds that completed lockup for 800ms, then expands it smoothly before the staggered hero reveal. Transform-only shutters reveal the player in its permanent hero position; it is never reparented or restarted. Reduced motion, deep links and history returns bypass the opening; refreshing the homepage replays it.
- `dist/hero-video.js`: muted, inline, looping playback with a pause/play control. Reduced motion starts paused; playback also pauses outside the hero or in a hidden tab. A poster frame from the video remains available when playback is blocked.
- `dist/assets`: supplied-image WebP derivatives, the user-supplied banner video and its poster, vector logo and self-hosted Fira Sans / Source Sans Pro.
- `content-approvals.json`: private source conflicts and launch approvals; not part of the public output.
- `CONCEPT.md`: creative handoff, reference translation, source decisions and verification.

The asset preparation script uses the local source-extraction folder beside this project. It is optional; all runtime assets are already included.

For local review, use **Replay intro** at the bottom right to start the opening when ready. This control only appears on localhost, not on hosted domains.

## Checks and boundaries

Run `node scripts/check-content.mjs` for local content/asset checks. The browser QA record is in `CONCEPT.md`.

Search uses labelled demonstration data, not live availability. Enquiry controls prepare an email draft, with a copy fallback; they do not submit to a backend. No visitor data is stored. The previous wireframe remains in Git history. Publishing this replacement is a separate action; the existing published site is unchanged.
