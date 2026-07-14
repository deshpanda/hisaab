// Equity capital-gains tax engine (listed shares & equity mutual funds,
// STT-paid). Pure — imported by both the /capital-gains/ page and the tests.
// Rates/thresholds come from lib/config.js (the single annual-update file).

import { EQUITY_CAPITAL_GAINS as EQ, CESS_RATE } from './config.js';
import { roundRupee } from './format.js';

const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);

/**
 * @param {object} input   amounts for the financial year, in rupees:
 *   stcg, stcl  short-term gain / loss   (loss as a positive number)
 *   ltcg, ltcl  long-term  gain / loss   (loss as a positive number)
 *   surchargeRate  0 | 0.10 | 0.15  (surcharge on 111A/112A gains, capped 15%)
 *
 * Loss set-off follows the tax-optimal, legally-permitted order:
 *   1. LTCL against LTCG only.
 *   2. STCL against STCG first (taxed higher, 20%), then remaining STCL
 *      against LTCG.
 */
export function equityCapitalGainsTax(input = {}, cfg = EQ, cess = CESS_RATE) {
  const stcg = Math.max(0, num(input.stcg));
  const stcl = Math.max(0, num(input.stcl));
  const ltcg = Math.max(0, num(input.ltcg));
  const ltcl = Math.max(0, num(input.ltcl));
  const surchargeRate = Math.min(Math.max(0, num(input.surchargeRate)), cfg.surchargeCapPct);

  const steps = [];

  // 1. LTCL only against LTCG
  const ltclUsed = Math.min(ltcl, ltcg);
  let netLtcg = ltcg - ltclUsed;
  const ltclCarry = ltcl - ltclUsed;
  if (ltcl > 0) {
    steps.push({ label: `Long-term loss set against long-term gain`, amount: -ltclUsed });
  }

  // 2. STCL against STCG first, then against remaining LTCG
  let netStcg = stcg;
  let stclLeft = stcl;
  const stclVsStcg = Math.min(stclLeft, netStcg);
  netStcg -= stclVsStcg;
  stclLeft -= stclVsStcg;
  const stclVsLtcg = Math.min(stclLeft, netLtcg);
  netLtcg -= stclVsLtcg;
  stclLeft -= stclVsLtcg;
  const stclCarry = stclLeft;
  if (stcl > 0) {
    if (stclVsStcg > 0) steps.push({ label: `Short-term loss set against short-term gain`, amount: -stclVsStcg });
    if (stclVsLtcg > 0) steps.push({ label: `Remaining short-term loss set against long-term gain`, amount: -stclVsLtcg });
  }

  // Annual exemption on aggregate 112A long-term gains
  const ltcgExemptionUsed = Math.min(netLtcg, cfg.ltcg.annualExemption);
  const taxableLtcg = Math.max(0, netLtcg - cfg.ltcg.annualExemption);

  const stcgTax = roundRupee(netStcg * cfg.stcg.rate);
  const ltcgTax = roundRupee(taxableLtcg * cfg.ltcg.rate);
  const baseTax = stcgTax + ltcgTax;
  const surcharge = roundRupee(baseTax * surchargeRate);
  const cessAmt = roundRupee((baseTax + surcharge) * cess);
  const totalTax = baseTax + surcharge + cessAmt;

  return {
    netStcg: roundRupee(netStcg),
    netLtcg: roundRupee(netLtcg),
    ltcgExemptionUsed: roundRupee(ltcgExemptionUsed),
    taxableLtcg: roundRupee(taxableLtcg),
    stcgTax,
    ltcgTax,
    baseTax,
    surchargeRate,
    surcharge,
    cess: cessAmt,
    totalTax,
    stclCarryForward: roundRupee(stclCarry),
    ltclCarryForward: roundRupee(ltclCarry),
    rates: {
      stcg: cfg.stcg.rate,
      ltcg: cfg.ltcg.rate,
      annualExemption: cfg.ltcg.annualExemption,
    },
    steps,
  };
}
