# Personal Dashboard

Personal hub for small subprojects (file transfer, shop list, …), built as an
offline-first PWA and published on GitHub Pages.

**Status and next steps live in [ROADMAP.md](ROADMAP.md) — read it first.**

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check + production build (run before committing)
```

## Deploy

Pushing to `main` builds and deploys to GitHub Pages via
`.github/workflows/deploy.yml` (Pages source must be set to "GitHub Actions").
