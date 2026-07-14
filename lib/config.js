// ============================================================================
// SINGLE SOURCE OF TRUTH for every rate, slab and threshold on the site.
//
// ANNUAL BUDGET-DAY UPDATE: edit THIS FILE ONLY (see the checklist in
// STATE.md). Every number below carries a source; the full ≥2-source
// verification trail lives in SOURCES.md. When you change a number, update
// its SOURCES.md entry and re-run `node --test` until green.
//
// Financial year currently modelled: FY 2026-27 (AY 2027-28).
// Verified July 2026. Budget 2026 made NO changes to any figure below vs
// FY 2025-26 (confirmed against official + independent sources — see
// SOURCES.md). FY 2026-27 is the first year under the new Income-tax Act,
// 2025, which renumbers sections but keeps every rate the same.
// ============================================================================

export const FY = '2026-27';
export const AY = '2027-28';

// Absolute base is used ONLY for canonical tags + sitemap.xml. Everything
// else on the site uses relative paths, so moving to a custom domain later
// means changing just these two lines (and regenerating the sitemap).
export const SITE = {
  origin: 'https://deshpanda.github.io',
  basePath: '/hisaab',
};

// Health & Education cess: 4% on (income tax + surcharge). Both regimes.
export const CESS_RATE = 0.04;

// ---------------------------------------------------------------------------
// INCOME TAX (salaried individuals)
// Slabs are [upperBound, rate]; the final slab uses Infinity.
// ---------------------------------------------------------------------------
export const INCOME_TAX = {
  new: {
    // Default regime. Slab structure set by Budget 2025, unchanged by Budget 2026.
    slabs: [
      [400000, 0],
      [800000, 0.05],
      [1200000, 0.10],
      [1600000, 0.15],
      [2000000, 0.20],
      [2400000, 0.25],
      [Infinity, 0.30],
    ],
    standardDeduction: 75000,
    // Full rebate when taxable income <= 1,200,000; max rebate 60,000.
    rebate87A: { maxTaxableIncome: 1200000, maxRebate: 60000 },
    // Marginal relief just above the rebate limit: tax capped at (income - 12L).
    rebateMarginalRelief: true,
    // Section 115BAC: professional tax (16(iii)) and chapter-VI-A deductions
    // (80C/80D/HRA etc.) are NOT allowed in the new regime.
    allowsProfessionalTaxDeduction: false,
    allowsChapterVIADeductions: false,
    ageBands: false,
    surchargeCapPct: 0.25, // top surcharge capped at 25% in the new regime
  },
  old: {
    // Age-based basic exemption applies only in the old regime.
    slabsByAge: {
      below60: [[250000, 0], [500000, 0.05], [1000000, 0.20], [Infinity, 0.30]],
      s60to80: [[300000, 0], [500000, 0.05], [1000000, 0.20], [Infinity, 0.30]],
      above80: [[500000, 0], [1000000, 0.20], [Infinity, 0.30]],
    },
    standardDeduction: 50000,
    // Old-regime 87A is a hard cliff at 5L taxable (no marginal relief).
    rebate87A: { maxTaxableIncome: 500000, maxRebate: 12500 },
    rebateMarginalRelief: false,
    allowsProfessionalTaxDeduction: true,
    allowsChapterVIADeductions: true,
    ageBands: true,
    surchargeCapPct: 0.37,
  },
};

// Surcharge on income tax (levied on the tax amount, before cess), by total
// income. Applies to both regimes; the new regime caps the top band at 25%
// (see surchargeCapPct). Each threshold carries its own marginal relief.
export const SURCHARGE_BANDS = [
  { above: 50000000, rate: 0.37 }, // > 5 cr
  { above: 20000000, rate: 0.25 }, // 2 cr – 5 cr
  { above: 10000000, rate: 0.15 }, // 1 cr – 2 cr
  { above: 5000000, rate: 0.10 },  // 50 L – 1 cr
  { above: 0, rate: 0 },           // up to 50 L: nil
];

// Chapter-VI-A / salary deduction ceilings (old regime only), for the
// optional deduction inputs on the salary page.
export const DEDUCTION_CAPS = {
  sec80C: 150000,        // 80C (incl. employee EPF, ELSS, LIC, PPF, ...)
  sec80CCD1B: 50000,     // additional NPS
  homeLoanInterest: 200000, // 24(b), self-occupied
};

export const EPF = {
  employeeRate: 0.12,           // of (Basic + DA)
  statutoryMonthlyWageCeiling: 15000, // employers may cap statutory PF at this wage
};

// Professional tax is a STATE levy; the constitution (Art. 276) caps it at
// ₹2,500/yr. We take the user's annual figure; it is deductible only in the
// old regime, but always reduces take-home pay.
export const PROFESSIONAL_TAX = { annualMax: 2500 };

// ---------------------------------------------------------------------------
// HRA exemption — Section 10(13A) / Rule 2A (old regime only)
// ---------------------------------------------------------------------------
export const HRA = {
  metroRate: 0.50,      // 50% of salary if the rented home is in a metro city
  nonMetroRate: 0.40,   // 40% otherwise
  rentSalaryPct: 0.10,  // limb (c): rent paid minus 10% of salary
  landlordPanRentThreshold: 100000, // annual rent above this ⇒ landlord PAN needed
  // The classic four metros are settled law (FY 2025-26 and earlier).
  confirmedMetros: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
  // Reportedly added to the 50% list from FY 2026-27 by the Income-tax Rules,
  // 2026 — but NOT confirmable against the official gazette at build time, and
  // one reputable source still framed it as draft. We therefore do NOT assert
  // these as metro: the page makes the 50%/40% choice explicit and flags these
  // four for the user to confirm. See SOURCES.md.
  pendingMetros: ['Bengaluru', 'Hyderabad', 'Pune', 'Ahmedabad'],
};

// ---------------------------------------------------------------------------
// CAPITAL GAINS — listed equity shares & equity mutual funds (STT-paid)
// Rates set by Finance (No. 2) Act 2024 (from 23 Jul 2024); unchanged by
// Budget 2025 and Budget 2026. All of FY 2026-27 is post-change.
// ---------------------------------------------------------------------------
export const EQUITY_CAPITAL_GAINS = {
  stcg: { holdingMonths: 12, rate: 0.20 }, // Sec 111A: held <= 12 months, 20% flat
  ltcg: {
    holdingMonths: 12,        // long-term when held > 12 months
    rate: 0.125,              // Sec 112A: 12.5% flat, no indexation
    annualExemption: 125000,  // ₹1.25L exemption on AGGREGATE 112A LTCG per year
  },
  surchargeCapPct: 0.15, // surcharge on 111A/112A gains capped at 15%
};
