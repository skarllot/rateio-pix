# Repository guidelines

## Project structure

Rateio Pix is a static browser application deployed from the repository root
to GitHub Pages. It has no backend and no production build step.

- `index.html` defines the page structure and loads scripts in dependency order.
- `app.js` manages UI state, local storage, rate calculations, and QR rendering.
- `pix.js` generates and validates Pix BR Code payloads.
- `styles.css` contains all application and print styles.
- `sw.js` provides offline caching.
- `pix.test.js` contains the Node test suite for Pix payload generation.
- `.github/workflows/pages.yml` explicitly copies every deployed asset to `_site`.

## Development rules

- Keep the application usable as plain static files; do not introduce a backend
  or a required production build step without an explicit request.
- Preserve the script order in `index.html`: third-party QR support, `pix.js`,
  then `app.js`.
- Keep production browser dependencies local so the application works with the
  restricted network policy and offline after the first visit.
- When adding or renaming a runtime asset, update both
  `.github/workflows/pages.yml` and `APP_ASSETS` in `sw.js`.
- Bump `CACHE_NAME` in `sw.js` whenever cached assets or their behavior change.
- Do not manually reformat or modify vendored minified files. Record their
  licenses in `THIRD_PARTY_NOTICES.md`.
- Preserve the local-storage schema unless migration behavior is included.
- Keep user-provided text in DOM-safe APIs such as `textContent`; avoid adding
  unescaped values to `innerHTML`.

## Pix behavior

- Treat the generated BR Code payload and CRC as compatibility-sensitive output.
- Maintain byte-based EMV field lengths for UTF-8 values.
- Normalize and validate Pix keys before payload generation.
- Add or update an exact-payload test whenever Pix serialization changes.

## Verification

Run these checks before committing:

```sh
npm test
node --check app.js
node --check pix.js
node --check sw.js
```

Also run `node --check` for any added JavaScript file and
`git diff --check` for the complete change.

## Git and pull requests

- Use Conventional Commits for commit messages and pull request titles.
- Keep dependency, deployment, and functional changes narrowly scoped.
- Describe browser or deployment verification that could not be performed.
