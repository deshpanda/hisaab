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

| Item | Value | Sources |
|------|-------|---------|
| Exemption = least of three | (a) actual HRA; (b) 50% metro / 40% non-metro of salary; (c) rent − 10% of salary | ClearTax (HRA), Mondaq (Rules 2026 analysis), TaxGuru |
| "Salary" definition | Basic + DA (retirement-benefit part) + commission as fixed % of turnover; all other allowances excluded | ClearTax, Rules-2026 text as reported |
| Regime | available in OLD regime only; fully taxable in the new regime | ClearTax, Mondaq, TaxGuru |
| Period-wise computation | least-of-three per constant-input period, summed (not annual totals) | ClearTax, established CBDT practice |
| Landlord PAN | required when annual rent > ₹1,00,000 | ClearTax (landlord PAN) |
| Metro list (settled) | Delhi, Mumbai, Kolkata, Chennai = 50% | Rajya Sabha reply 6 Aug 2024 (via TaxGuru), ClearTax |

Key URLs:
- https://cleartax.in/s/hra-house-rent-allowance
- https://www.mondaq.com/india/corporate-tax/1764640/
- https://taxguru.in/income-tax/hra-exemption-8-cities-qualify-50-percent-exemption-practical-guide.html
- https://cleartax.in/s/landlord-pan-card-mandatory-for-hra-exemption

**⚠️ Open flag (FY 2026-27):** the Income-tax Rules 2026 reportedly widen the
50% list to 8 cities (adding Bengaluru, Hyderabad, Pune, Ahmedabad; Rule 279 /
Schedule III) — strong secondary consensus (ClearTax, Mondaq, TaxGuru, Outlook
Money) but NOT verified against the official gazette, and one source (A2Z
Taxcorp) framed it as draft. The page therefore makes 50%/40% an explicit user
choice and flags those four cities. Re-verify on the annual pass.

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

---

## 4. EPF projection

| Item | Value | Sources |
|------|-------|---------|
| Interest rate | **8.25%** declared for FY 2025-26 (CBT 239th meeting 2 Mar 2026, ratified Jun 2026; 3rd year at 8.25%). FY 2026-27 not yet declared → default 8.25%, editable | PIB (CBT), Business Standard, Angel One, ClearTax |
| Crediting convention | monthly accrual (rate/12) on the running balance, credited once at year end; a month's contribution earns from the **following** month (Para 60(2), EPF Scheme 1952) | EPF Scheme text, BusinessToday, Upstox |
| Contribution split | employee 12% of Basic+DA; employer 12% of which EPS = 8.33% of wage capped at ceiling, remainder to EPF | EPFO contribution PDF, ClearTax, Groww |
| Wage ceiling | **₹15,000/month** (re-notified 29 May 2026 under the SS Code; ₹21k/₹25k hikes NOT notified) → EPS ≤ ₹1,250/mo | SCC Online (29 May 2026 notification), ClearTax |
| Below-ceiling EPS | 8.33% of actual wage (₹14,000 → ₹1,166) | ClearTax worked example |
| VPF | same declared rate | ClearTax (VPF), IndiaLends, Paisabazaar |

Key URLs:
- https://www.business-standard.com/finance/personal-finance/govt-ratifies-8-25-epf-interest-rate-for-fy-26-to-be-credited-this-month-126061800441_1.html
- https://cleartax.in/s/epf-interest-rate · https://cleartax.in/s/pf-calculator
- https://groww.in/p/savings-schemes/epf-interest-rate
- https://www.scconline.com/blog/post/2026/06/01/15000-wage-ceiling-epf-coverage-membership-contributions/

**Flags:** ClearTax/Groww's published worked examples contradict their own
prose — their tables give the current month's contribution same-month interest
(and still use the stale 8.15%/12 = 0.679% factor). We follow the statutory
Para 60(2) convention (contribution earns from the next month) at rate/12.
EPS 2026 (from 29 Jun 2026, new members) keeps 8.33%/₹15,000 unchanged.
The EPS share builds a separate pension and is excluded from the EPF corpus.

---

## 5. NPS

| Item | Value | Sources |
|------|-------|---------|
| Normal exit split | lump sum up to **80%**, annuity min **20%** — PFRDA (Exits & Withdrawals) **Amendment Regulations 2025**, notified 15-16 Dec 2025 (was 60/40) | PFRDA press release PDF, Gazette copy, Protean CRA, Upstox |
| Tax-free lump sum | only **60% of corpus** is tax-free (10(12A), carried into the 2025 Act); lump sum beyond 60% taxed at slab — Budget 2026 did NOT align this | 1finance, ClearTax, PFRDA press release |
| Small corpus (normal exit) | ≤ **₹8,00,000** → 100% withdrawal (was ₹5L); middle tier ₹8-12L with SUR options | PFRDA press release, Protean, ClearTax |
| Normal exit trigger | age 60 OR 15 years of subscription, whichever earlier; payout options to age 85 (SLW/SUR) | PFRDA press release, Outlook Money |
| Annuity rates (assumption seed) | single-life ~6.5-7.5%; with return of purchase price ~5.5-6.5% → default 6% | PNB MetLife, 1finance, kustodian |
| Deductions | 80CCD(1B) ₹50k old regime only; employer NPS 14% of Basic+DA deductible in the new regime (80CCD(2)) | NPS Trust, ClearTax, Policybazaar |

Key URLs:
- https://www.pfrda.org.in/documents/33652/86710/Press+Release+-+Key+changes+-+Exit+Regulations+.pdf
- https://www.proteantech.in/articles/nps-withdrawal-rules-2025-changes-december/
- https://cleartax.in/s/nps-national-pension-scheme
- https://npstrust.org.in/benefits-of-nps

**Flags:** the 80% lump-sum vs 60% tax-free mismatch is pending alignment as of
Jul 2026 — the page shows the taxable slice explicitly. Watch on the annual
pass. MSF (up to 100% equity, from Oct 2025) doesn't change exit rules.

---

## 6. Gratuity

| Item | Value | Sources |
|------|-------|---------|
| Covered formula | (15/26) × last drawn Basic+DA × years; part-year counts only **in excess of 6 months** (Sec 4(2) PoG Act 1972 = Sec 53(2) SS Code 2020, in force 21 Nov 2025) | Indian Kanoon (both sections), ClearTax, Bankbazaar |
| Not covered | (15/30) × average of last 10 months' salary × completed years (no round-up) | ClearTax (exemption guide), Bankbazaar |
| Eligibility | 5 years continuous service (waived death/disablement); Madras HC *Mettur Beardsell*: 4y+240d qualifies (persuasive, not SC-settled); fixed-term staff: pro-rata after 1 year since SS Code | ClearTax, CaseMine, Fisher Phillips |
| Tax-exemption cap | **₹20,00,000** lifetime (CBDT S.O. 1213(E), 2019) — NOT raised by Budget 2025/2026; govt employees fully exempt (the ₹25L figure is the CCS payout ceiling, not a tax limit) | ClearTax, Taxmann, Bankbazaar |
| Worked anchors | 15y × ₹30,000 → ₹2,59,615 (ClearTax); 15y × ₹55,000 → ₹4,75,962 (Bankbazaar); 8y × ₹65,000 not-covered → ₹2,60,000 | ClearTax, Bankbazaar |

Key URLs:
- https://indiankanoon.org/doc/727680/ · https://indiankanoon.org/doc/37077486/
- https://cleartax.in/s/gratuity-calculator · https://cleartax.in/s/income-tax-exemption-on-gratuity
- https://www.bankbazaar.com/tax/gratuity.html

**Flags:** exactly-6-months rounding is ambiguous in the wild (Groww rounds up;
the statute says "in excess of six months") — we follow the statute and note
the divergence on the page.

---

## 7. Home-loan EMI & rent-vs-buy

| Item | Value | Sources |
|------|-------|---------|
| EMI formula | P×r×(1+r)ⁿ/((1+r)ⁿ−1), r = annual/12 | HDFC Bank (formula + ₹10L/7.2%/10y → ₹11,714), emicalculator.net |
| Anchors | ₹50L @8.5% 20y → **₹43,391**; ₹1cr @9% 20y → **₹89,973** (both printed by multiple portals) | rinmukt, HomeFirst (2×43,391), Scripbox, Aavas, Navi |
| Outstanding after k months | B = P(1+r)ᵏ − EMI×((1+r)ᵏ−1)/r | Omni Calculator, financeformulas.net |
| Stamp duty + registration (default seed) | stamp ~4-8% by state; registration ~1% → editable default 7% total | ClearTax (stamp duty), 99acres |
| Security deposit custom | Bengaluru up to 10 months (now 2-6); Mumbai 3-6; Delhi 2-3; Chennai ≤3 | LegalEye, Nestriqo, RenterFinder |

The rent-vs-buy net-worth model itself is ours (documented on the page):
symmetric cash outlay, cheaper side invests the difference monthly, buyer ends
with equity + investments, renter with investments + deposit. Tax breaks
(24b/80C/HRA) and selling costs are explicitly out of scope and disclosed.

---

## 8-10. SIP / step-up SIP / goal planner (TVM conventions)

| Item | Value | Sources |
|------|-------|---------|
| SIP FV | annuity-due: FV = P×[((1+i)ⁿ−1)/i]×(1+i), i = annual/12 | Groww, ClearTax, AMFI (all print it); ClearTax ₹8k/14%/7y → ₹11,44,202 reproduces exactly |
| Anchors | 1,000/mo 12% 1y → ₹12,809; 10,000/mo 12% 10y → **₹23,23,391** (Angel One prints the exact trio; Zee Business corroborates) | Angel One MF, Zee Business |
| Lumpsum FV | P(1+r)ᵗ annual compounding; ₹1L @12% 10y → **₹3,10,585** (printed) | ClearTax (₹1L@10%/20y → ₹6,72,750), Groww example, Angel One |
| Step-up convention | instalment +fixed% once every 12 months, monthly annuity-due within the year | Groww, Zerodha, ClearTax, HDFC MF, Nippon |
| Step-up anchors | Zerodha 10k/15y/+10%/12% → **₹86,83,849** (exact); ClearTax 10k/+10%/14%/8y → ₹23,65,932, invested ₹13,72,307 (exact) | Zerodha, ClearTax |
| Required SIP | target ÷ annuity-due factor; Angel One ₹1cr/10y/12% example reproduces exactly | Angel One, SEBI goal calculator, BOI MF |
| Inflation convention | target = today's cost × (1+inflation)^years | MF Online, Dhan |

Key URLs:
- https://groww.in/calculators/sip-calculator · https://cleartax.in/s/sip-calculator
- https://www.mutualfundssahihai.com/en/calculators/sip-calculator
- https://zerodha.com/calculators/step-up-sip-calculator/ · https://cleartax.in/s/step-up-sip-calculator
- https://investor.sebi.gov.in/calculators/goal_sip_calculator.html
- https://homeloans.hdfc.bank.in/home-loan-emi-calculator · https://emicalculator.net/

**Flags:** Groww's article prose converts 12% p.a. geometrically (→ ₹12,766)
while its widget and everyone else use i = r/12 (→ ₹12,809) — we use r/12.
ClearTax's step-up closed-form (monthly g) contradicts its own annually-stepped
example — we compute in yearly blocks. No major calculator uses the
ordinary-annuity convention.
