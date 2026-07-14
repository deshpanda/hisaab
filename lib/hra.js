// HRA exemption engine — Section 10(13A) / Rule 2A. Pure.
// Computes ONE period during which salary, HRA, rent and city stay constant.
// For a mid-year change (raise, move, metro <-> non-metro), call once per
// period and sum the exempt amounts — see hraExemptionMultiPeriod().
//
// "Salary" here = Basic + Dearness Allowance (the part forming retirement
// benefits) + commission as a fixed % of turnover. All other allowances are
// excluded. HRA exemption is available in the OLD regime only.

import { HRA } from './config.js';

const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);

/**
 * @param {object} p
 *   salary       Basic + eligible DA + eligible commission (for the period)
 *   hraReceived  actual HRA received (for the period)
 *   rentPaid     actual rent paid (for the period)
 *   isMetro      true => 50% slab, false => 40% slab
 */
export function hraExemption(p = {}, cfg = HRA) {
  const salary = Math.max(0, num(p.salary));
  const hraReceived = Math.max(0, num(p.hraReceived));
  const rentPaid = Math.max(0, num(p.rentPaid));
  const rate = p.isMetro ? cfg.metroRate : cfg.nonMetroRate;

  const limbActualHra = hraReceived;
  const limbPctOfSalary = rate * salary;
  const limbRentMinus10 = Math.max(0, rentPaid - cfg.rentSalaryPct * salary);

  const exempt = Math.max(0, Math.min(limbActualHra, limbPctOfSalary, limbRentMinus10));
  const taxable = Math.max(0, hraReceived - exempt);

  let binding = 'pctOfSalary';
  if (exempt === limbActualHra) binding = 'actualHra';
  else if (exempt === limbRentMinus10) binding = 'rentMinus10';

  return {
    limbs: {
      actualHra: Math.round(limbActualHra),
      pctOfSalary: Math.round(limbPctOfSalary),
      rentMinus10: Math.round(limbRentMinus10),
    },
    ratePct: rate,
    exempt: Math.round(exempt),
    taxable: Math.round(taxable),
    binding,
  };
}

/** Sum the exemption across several constant-input periods. */
export function hraExemptionMultiPeriod(periods = [], cfg = HRA) {
  const results = periods.map((p) => hraExemption(p, cfg));
  const exempt = results.reduce((s, r) => s + r.exempt, 0);
  const hraReceived = periods.reduce((s, p) => s + Math.max(0, num(p.hraReceived)), 0);
  return { periods: results, exempt, taxable: Math.max(0, hraReceived - exempt) };
}
