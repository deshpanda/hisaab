# Hisaab — project state

Clean, fast, correct India-specific financial calculators. One page per thing
people actually search for. No ad clutter, every formula shown transparently.

- **Live URL:** https://deshpanda.github.io/hisaab/ (GitHub Pages project site)
- **Repo:** deshpanda/hisaab (personal identity only)
- **Started:** 2026-07-14
- **Current financial year targeted:** FY 2026-27 (AY 2027-28)

---

## Hard rules (non-negotiable)

1. **100% static, client-side JS only.** GitHub Pages hosting. No backend, no
   database, no accounts, no cookies beyond what ads eventually need.
2. **Zero capital.** Free tiers only. If a step costs money, redesign it.
   (Custom domain deliberately skipped — it costs money.)
3. **Build-once.** The only planned maintenance is ONE update per year on
   budget day. Every rate/slab/threshold lives in `lib/config.js` so the
   annual update touches exactly one file.
4. **`deshpanda` identity only.** No work account. No AI/tool attribution
   anywhere in the repo, commits, or site.
5. **Never financial advice.** Plain disclaimer on every page. Calculators
   compute; they never recommend.
6. **Correctness discipline.** Every formula gets a test file with worked
   examples cross-checked against ≥2 independent sources BEFORE the page
   ships. A wrong tax calculator is worse than none. Sources are recorded
   next to the numbers in `lib/config.js` and in the scoreboard below.
7. **Kill criterion (decided now, before any outcome is known):** if the site
   has **< 500 organic visitors/month 6 months after Google first indexes
   it**, archive the project and move on. No emotional renewals.
   - First-indexed date: _TBD — record from Search Console once the first
     page is indexed._
   - Kill-review date: _first-indexed date + 6 months._

---

## Architecture decisions (resolved — don't re-litigate)

- **Zero-build vanilla HTML/CSS/JS.** No framework, no bundler, no
  `node_modules` shipped. Nothing to bill or break; works identically in 5
  years. (The existing `deshpanda.github.io` portfolio uses Astro; this hub is
  deliberately a *separate* repo with no build step.)
- **Separate repo**, not nested in the portfolio → clean isolation and a
  trivial archive at the kill criterion.
- **Pure calc engines as ES modules** in `lib/`. Pages import them with
  `<script type="module">`; tests import the *same* modules — the tested code
  is exactly the shipped code.
- **Tests via Node's built-in `node:test`** (`node --test`). Zero dependencies.
- **Relative asset paths** everywhere so the site works both at
  `/hisaab/` and at a future apex domain with no changes. Only canonical tags
  and `sitemap.xml` hold absolute URLs (base defined once in `lib/config.js`).
- **No external fonts / CDNs.** System font stack, inline SVG favicon → fast
  Lighthouse, no network dependency, no privacy leak.

---

## Scoreboard

Status key: 📋 planned · 🔨 building · ✅ shipped · 🗄️ archived

| # | Calculator | URL | Status | Tests | Formula sources verified |
|---|------------|-----|--------|-------|--------------------------|
| 1 | In-hand salary (old vs new regime, FY 2026-27) | `/salary/` | ✅ | ✔ 11 | ✔ SOURCES.md §1 |
| 2 | HRA exemption | `/hra/` | ✅ | ✔ 4 | ✔ SOURCES.md §2 (metro list flagged — verify gazette) |
| 3 | Equity capital-gains (STCG/LTCG, loss offsets) | `/capital-gains/` | ✅ | ✔ 5 | ✔ SOURCES.md §3 |
| 4 | Rent vs buy (Indian metros) | `/rent-vs-buy/` | ✅ | ✔ 9 | ✔ SOURCES.md §7 (EMI anchors; model documented) |
| 5 | EPF projection | `/epf/` | ✅ | ✔ 7 | ✔ SOURCES.md §4 (8.25% FY25-26; Para 60(2) convention) |
| 6 | NPS projection | `/nps/` | ✅ | ✔ 5 | ✔ SOURCES.md §5 (Dec-2025 PFRDA exit rules) |
| 7 | Gratuity | `/gratuity/` | ✅ | ✔ 6 | ✔ SOURCES.md §6 (cap ₹20L; >6-months rounding) |
| 8 | SIP vs lumpsum | `/sip-vs-lumpsum/` | ✅ | ✔ 12* | ✔ SOURCES.md §8-10 (anchors reproduce in print) |
| 9 | Step-up SIP | `/step-up-sip/` | ✅ | ✔ 12* | ✔ SOURCES.md §8-10 (Zerodha/ClearTax exact) |
| 10 | Goal planner | `/goal-planner/` | ✅ | ✔ 12* | ✔ SOURCES.md §8-10 (Angel One/SEBI convention) |

\* rows 8-10 share the `tvm` suite (12 tests). Full suite: 62 tests, all green.
All 10 planned calculators are live — next sessions grow content pages
(guides/FAQs per calculator) toward the ~20-page AdSense bar.

Target for AdSense application: ~20 pages live + real organic traffic.

---

## Annual update checklist (budget day, once a year)

1. Read the new Finance Act / Budget speech; note every changed rate, slab,
   threshold, rebate, surcharge, exemption limit. Also check: the EPF rate
   declaration (CBT, ~Feb-Mar), PFRDA exit-rule changes, the gratuity
   exemption cap, and the HRA metro-list gazette status (open flag).
2. Edit **`lib/config.js` only.** Update the `FY` label and every affected
   number. Each number has a source comment — update the sources too.
3. Run `node --test`. Fix worked-example expectations against the new rules
   (cross-check ≥2 sources) until green.
4. Update the FY label shown on each page (it reads from config).
5. Commit as `deshpanda`, no AI attribution. Push. Done for the year.

---

## Monetization (deferred, no upkeep)

- AdSense only *after* ~20 pages and demonstrated organic traffic.
- Nothing that needs a server or ongoing maintenance.

---

## Manual steps (owner: Samyak) — see `DEPLOY.md`

Tracked in `DEPLOY.md`: create the GitHub repo under `deshpanda`, push,
enable Pages, verify Search Console, submit sitemap, (later) apply to AdSense.
