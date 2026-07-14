// Income-tax + in-hand-salary engine. Pure — imported by the /salary/ page
// and the tests. All rates/slabs come from lib/config.js.

import {
  INCOME_TAX, SURCHARGE_BANDS, CESS_RATE, EPF, DEDUCTION_CAPS,
} from './config.js';
import { roundRupee } from './format.js';

const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);
const clampPct = (x, dflt) => {
  const v = Number(x);
  if (!Number.isFinite(v)) return dflt;
  return Math.min(Math.max(v, 0), 100);
};

// Progressive tax over [upperBound, rate] slabs.
function slabTax(income, slabs) {
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of slabs) {
    if (income <= lower) break;
    tax += (Math.min(income, upper) - lower) * rate;
    lower = upper;
  }
  return tax;
}

function slabsFor(regime, age) {
  const r = INCOME_TAX[regime];
  if (regime === 'old') return r.slabsByAge[age] || r.slabsByAge.below60;
  return r.slabs;
}

// Tax after the 87A rebate but before surcharge & cess.
function taxBeforeSurcharge(taxableIncome, regime, age) {
  const r = INCOME_TAX[regime];
  const gross = slabTax(taxableIncome, slabsFor(regime, age));
  const { maxTaxableIncome, maxRebate } = r.rebate87A;

  if (taxableIncome <= maxTaxableIncome) {
    const rebate = Math.min(gross, maxRebate);
    return { tax: gross - rebate, gross, rebate, marginalRelief: 0 };
  }
  // Above the rebate limit. New regime: marginal relief caps tax at the excess.
  if (r.rebateMarginalRelief) {
    const cap = taxableIncome - maxTaxableIncome;
    if (gross > cap) return { tax: cap, gross, rebate: 0, marginalRelief: gross - cap };
  }
  return { tax: gross, gross, rebate: 0, marginalRelief: 0 };
}

// Surcharge on the tax amount, with per-threshold marginal relief.
function surchargeOn(taxableIncome, taxBeforeSc, regime, age) {
  const cap = INCOME_TAX[regime].surchargeCapPct;
  const band = SURCHARGE_BANDS.find((b) => taxableIncome > b.above);
  const rate = Math.min(band.rate, cap);
  if (rate === 0) return { rate: 0, surcharge: 0, marginalRelief: 0 };

  let surcharge = taxBeforeSc * rate;
  const threshold = band.above;
  const taxAtThreshold = taxBeforeSurcharge(threshold, regime, age).tax;
  const lowerBand = SURCHARGE_BANDS.find((b) => threshold > b.above);
  const lowerRate = lowerBand ? Math.min(lowerBand.rate, cap) : 0;
  const totalAtThreshold = taxAtThreshold * (1 + lowerRate);
  const allowed = totalAtThreshold + (taxableIncome - threshold);
  const actual = taxBeforeSc + surcharge;

  let marginalRelief = 0;
  if (actual > allowed) {
    marginalRelief = actual - allowed;
    surcharge = Math.max(0, surcharge - marginalRelief);
  }
  return { rate, surcharge, marginalRelief };
}

/** Full income tax on a given taxable income. Pure, fully broken down. */
export function incomeTax(taxableIncome, { regime = 'new', age = 'below60' } = {}) {
  const rg = regime === 'old' ? 'old' : 'new';
  const ag = ['below60', 's60to80', 'above80'].includes(age) ? age : 'below60';
  const ti = Math.max(0, num(taxableIncome));

  const t = taxBeforeSurcharge(ti, rg, ag);
  const sc = surchargeOn(ti, t.tax, rg, ag);
  const taxAfterRebate = roundRupee(t.tax);
  const surcharge = roundRupee(sc.surcharge);
  const cess = roundRupee((t.tax + sc.surcharge) * CESS_RATE);

  return {
    taxableIncome: ti,
    regime: rg,
    age: ag,
    slabTax: roundRupee(t.gross),
    rebate: roundRupee(t.rebate),
    rebateMarginalRelief: roundRupee(t.marginalRelief),
    taxAfterRebate,
    surchargeRate: sc.rate,
    surcharge,
    surchargeMarginalRelief: roundRupee(sc.marginalRelief),
    cess,
    totalTax: taxAfterRebate + surcharge + cess,
  };
}

/**
 * In-hand salary. Derives taxable income from gross salary and the chosen
 * deductions, then computes tax and take-home pay.
 *
 * @param {object} input
 *   grossAnnual       total taxable salary before deductions (excl. employer PF)
 *   basicPct          Basic as % of gross (for EPF); default 50
 *   regime            'new' (default) | 'old'
 *   age               'below60' | 's60to80' | 'above80'  (old regime bands)
 *   capPfAt15k        cap statutory EPF at the ₹15,000/mo wage ceiling
 *   professionalTax   annual PT (reduces take-home; deductible only in old regime)
 *   deductions        (old regime only) { sec80C, sec80D, hraExempt,
 *                     homeLoanInterest, sec80CCD1B, other }
 */
export function computeInHand(input = {}) {
  const regime = input.regime === 'old' ? 'old' : 'new';
  const age = ['below60', 's60to80', 'above80'].includes(input.age) ? input.age : 'below60';
  const gross = Math.max(0, num(input.grossAnnual));
  const basicPct = clampPct(input.basicPct, 50);
  const basic = (gross * basicPct) / 100;

  const pfBase = input.capPfAt15k
    ? Math.min(basic, EPF.statutoryMonthlyWageCeiling * 12)
    : basic;
  const employeePF = EPF.employeeRate * pfBase;
  const professionalTax = Math.max(0, num(input.professionalTax));

  const cfg = INCOME_TAX[regime];
  let deductions = cfg.standardDeduction;
  const breakdown = { standardDeduction: cfg.standardDeduction };

  if (cfg.allowsChapterVIADeductions) {
    const d = input.deductions || {};
    const parts = {
      sec80C: Math.min(num(d.sec80C), DEDUCTION_CAPS.sec80C),
      sec80D: num(d.sec80D),
      hraExempt: num(d.hraExempt),
      homeLoanInterest: Math.min(num(d.homeLoanInterest), DEDUCTION_CAPS.homeLoanInterest),
      sec80CCD1B: Math.min(num(d.sec80CCD1B), DEDUCTION_CAPS.sec80CCD1B),
      other: num(d.other),
    };
    for (const [k, v] of Object.entries(parts)) {
      deductions += v;
      breakdown[k] = v;
    }
  }
  if (cfg.allowsProfessionalTaxDeduction && professionalTax > 0) {
    deductions += professionalTax;
    breakdown.professionalTax = professionalTax;
  }

  const taxableIncome = Math.max(0, gross - deductions);
  const tax = incomeTax(taxableIncome, { regime, age });
  const inHandAnnual = gross - employeePF - professionalTax - tax.totalTax;

  return {
    regime,
    age,
    gross,
    basic: roundRupee(basic),
    employeePF: roundRupee(employeePF),
    professionalTax: roundRupee(professionalTax),
    deductionBreakdown: breakdown,
    totalDeductions: roundRupee(deductions),
    taxableIncome: roundRupee(taxableIncome),
    tax,
    inHandAnnual: roundRupee(inHandAnnual),
    inHandMonthly: roundRupee(inHandAnnual / 12),
  };
}
