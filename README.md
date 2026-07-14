# Hisaab

Clean, fast, correct India-specific financial calculators — one page per thing
people actually search for (in-hand salary, HRA, capital gains, and more).
No ad clutter, mobile-first, and every formula is shown transparently via a
**Show the math** toggle.

**Live:** https://deshpanda.github.io/hisaab/

> Nothing here is financial advice. The calculators compute; they never
> recommend. See the disclaimer on every page.

## Principles

- **100% static.** Plain HTML/CSS/JS, no build step, no framework, no
  dependencies shipped. Works unchanged for years.
- **One config file for rates.** Every tax rate, slab and threshold lives in
  [`lib/config.js`](lib/config.js) — the annual budget-day update touches only
  that file.
- **Correctness first.** Each calc engine is a pure ES module in `lib/`, is
  imported by both the site and the tests, and ships only after its worked
  examples pass and are cross-checked against ≥2 independent sources
  (recorded in [`SOURCES.md`](SOURCES.md)).

## Layout

```
lib/            pure calc engines + the single rates config (imported by pages AND tests)
assets/         shared stylesheet, small progressive-enhancement JS, favicon
salary/ hra/ capital-gains/   one folder per calculator → clean URLs (/salary/ etc.)
tests/          node:test worked-example suites
index.html      the hub homepage
sitemap.xml robots.txt        SEO
STATE.md        rules, scoreboard, kill criterion, annual-update checklist
SOURCES.md      per-calculator formula sources (the ≥2-source verification trail)
DEPLOY.md       one-time manual setup (create repo, enable Pages, Search Console)
```

## Tests

No dependencies — uses Node's built-in test runner (Node ≥ 18):

```sh
node --test
```

## Deploying / annual update

- First-time setup (create the GitHub repo, enable Pages, verify Search
  Console): see [`DEPLOY.md`](DEPLOY.md).
- The once-a-year budget update: see the checklist in [`STATE.md`](STATE.md).

## License

[MIT](LICENSE) © Samyak Deshpande
