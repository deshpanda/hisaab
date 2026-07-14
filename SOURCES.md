# Formula & rate sources

Every number in `lib/config.js` is cross-checked against **≥2 independent
sources** before the corresponding page ships (hard rule 6). This file is the
audit trail. Re-verify it on every annual update.

**Verified for FY 2026-27 (AY 2027-28) — July 2026.**
Budget 2026 (1 Feb 2026) made no change to any figure below; FY 2026-27 is the
first year under the new Income-tax Act, 2025, which renumbers sections but
keeps the rates identical.

---

## 1. In-hand salary / income tax

| Item | Value (FY 2026-27) | Sources |
|------|--------------------|---------|
| New-regime slabs | 0 ≤4L · 5% 4–8L · 10% 8–12L · 15% 12–16L · 20% 16–20L · 25% 20–24L · 30% >24L | incometax.gov.in (return-applicable), ClearTax, BusinessToday (1 Feb 2026), Pocketful |
| Old-regime slabs (<60) | 0 ≤2.5L · 5% 2.5–5L · 20% 5–10L · 30% >10L | ClearTax, Pocketful, Axis Max Life |
| Old-regime basic exemption 60–80 / 80+ | ₹3,00,000 / ₹5,00,000 | Pocketful, Axis Max Life |
| Standard deduction (new / old) | ₹75,000 / ₹50,000 | Upstox, ClearTax, Pocketful |
| 87A rebate — new | full rebate if taxable ≤ ₹12,00,000; max ₹60,000 (⇒ ~₹12.75L gross salary tax-free) | incometax.gov.in, ClearTax (87A), Upstox, Tax2win |
| 87A rebate — old | full rebate if taxable ≤ ₹5,00,000; max ₹12,500 (hard cliff, no marginal relief) | incometax.gov.in, ClearTax, Tax2win |
| Marginal relief (new, above 12L) | tax = min(slab tax, income − 12,00,000); breakeven ₹12,70,588 | Upstox (₹12.10L→₹10k), ClearTax (₹12.15L→₹15k) |
| Surcharge | 10% >50L · 15% >1cr · 25% >2cr · 37% >5cr (old); capped **25%** in new regime; own marginal relief per band | ClearTax, Pocketful, Axis Max Life |
| Health & Education cess | 4% on (tax + surcharge), both regimes | ClearTax, Pocketful, Axis Max Life |
| Employee EPF | 12% of Basic + DA; employer may cap statutory PF at ₹15,000/mo wage | EPFO official PDF, SalaryBox, Indmoney |
| Professional tax | state levy, ≤ ₹2,500/yr; deductible under 16(iii) **only in old regime** (disallowed by 115BAC) | ClearTax (115BAC), Tax2win (115BAC), BankBazaar |

Key URLs:
- https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1
- https://cleartax.in/s/income-tax-slabs · https://cleartax.in/s/income-tax-rebate-us-87a
- https://upstox.com/news/personal-finance/tax/what-are-standard-deduction-and-marginal-relief-for-salaried-employees-after-budget-2026/article-188744/
- https://www.epfindia.gov.in/site_docs/PDFs/MiscPDFs/ContributionRate.pdf
- https://tax2win.in/guide/section-115bac-of-income-tax-act

**Flags:** one ClearTax summary quoted the new-regime marginal-relief breakeven
as "~₹13.33L" — inconsistent with its own worked example; the correct figure
is **₹12,70,588** (60,000 = 0.85 × excess). We use ₹12,70,588.

---

## 2. HRA exemption

_Pending verification — page not shipped until filled and tests pass._

---

## 3. Equity capital gains (listed shares & equity MF, STT-paid)

| Item | Value (FY 2026-27) | Sources |
|------|--------------------|---------|
| STCG (Sec 111A) | held ≤ 12 months → **20%** flat (post 23 Jul 2024) | incometax.gov.in (capital-gain), ClearTax, Zerodha Varsity |
| LTCG (Sec 112A) | held > 12 months → **12.5%** flat, **no indexation** | incometax.gov.in, ClearTax, Zerodha Varsity, TaxGuru |
| LTCG annual exemption | **₹1,25,000** on aggregate 112A LTCG per year (once, not per scrip) | incometax.gov.in, ClearTax |
| Loss set-off | STCL → STCG **and** LTCG; LTCL → **only** LTCG | incometax.gov.in (set-off/carry-forward), ClearTax |
| Loss carry-forward | 8 assessment years; only if return filed by the 139(1) due date | incometax.gov.in, ClearTax |
| Surcharge cap on 111A/112A gains | **15%** | Ministry of Finance, LegalClarity |
| Cess | 4% | (as above) |

Key URLs:
- https://www.incometaxindia.gov.in/w/capital-gain
- https://www.incometaxindia.gov.in/w/set-off-and-carry-forward-of-losses-under-the-income-tax-law
- https://cleartax.in/s/short-term-capital-gain-on-shares · https://cleartax.in/s/ltcg-sale-stocks
- https://zerodha.com/varsity/chapter/taxation-for-investors/

**Flags:** the new Income-tax Act, 2025 renumbers 111A/112A into new clauses
(~196–203 range) but the substance is unchanged. 87A rebate does NOT apply to
these special-rate gains. A resident whose other income is below the basic
exemption may set the shortfall against these gains before applying the rate
(edge case — surfaced as a note on the page, not auto-computed in v1).
