# Deploy & first-time setup (manual steps)

Status: repo **created and pushed** ✅ (`deshpanda/hisaab`, identity
`Samyak Deshpande <samyakd.2001@gmail.com>` via the `github.com-personal`
SSH alias). Remaining manual steps below.

## 1. ~~Create the repo~~ — done
## 2. ~~Push~~ — done (`git push -u origin main`)

## 3. Enable GitHub Pages

Repo → **Settings → Pages** → *Build and deployment* → Source:
**Deploy from a branch** → Branch **`main`**, folder **`/ (root)`** → **Save**.

In ~1 minute the site is live at **https://deshpanda.github.io/hisaab/**
(the `.nojekyll` file makes Pages serve the files as-is). Open it and click
through all three calculators.

## 4. Google Search Console (do this to get indexed)

1. https://search.google.com/search-console → **Add property** →
   **URL prefix** → `https://deshpanda.github.io/hisaab/`.
2. Verify with the **HTML file** method: download the `google…….html` file
   Google gives you, drop it in the repo root, `git push`, then click Verify.
   (DNS verification isn’t possible — you don’t own `github.io`.)
3. **Sitemaps** → submit `sitemap.xml`.
4. Use **URL Inspection** → *Request indexing* on the three calculator URLs.
5. **Record the first-indexed date in `STATE.md`** — the kill-review date is
   that date + 6 months (< 500 organic visitors/month ⇒ archive).

Expect little to nothing for ~6 months; discovery is the slow part.

## 5. AdSense — later, not now

Apply **only after ~20 pages are live and you have real organic traffic**
(your rule). AdSense also needs a privacy policy page and enough original
content, so revisit this after several more calculators ship.

## Open verification item (correctness)

Before leaning on the **50% HRA slab for Bengaluru / Hyderabad / Pune /
Ahmedabad**, confirm the FY 2026-27 metro list against the official gazette
(Income-tax Rules, 2026) or a CA. At build time this was widely reported but
not confirmable against the primary source, so the HRA page makes the user
choose the slab and flags these four. Once confirmed, you can optionally add a
city dropdown that presets the rate. See `SOURCES.md` (HRA section).
