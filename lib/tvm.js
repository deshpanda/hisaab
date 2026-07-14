// Time-value-of-money engines: SIP, lumpsum, step-up SIP and goal planning.
// Pure — imported by the pages and the tests. Conventions match the major
// Indian calculators (see SOURCES.md):
//   - SIP future value uses the annuity-due formula (instalment invested at
//     the start of each month):  FV = P × [((1+i)^n − 1)/i] × (1+i),  i = r/12
//   - Lumpsum compounds the expected CAGR annually: FV = P × (1+r)^t
//   - Step-up SIP raises the monthly instalment by a fixed % every 12 months.

import { roundRupee } from './format.js';

const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);

/** Annuity-due SIP factor for i (monthly rate) over n months. */
function sipFactor(i, n) {
  if (n <= 0) return 0;
  return i === 0 ? n : ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
}

/** SIP future value. monthly instalment, annual rate %, tenure in months. */
export function sipFutureValue(monthly, annualRatePct, months) {
  const P = Math.max(0, num(monthly));
  const n = Math.max(0, Math.round(num(months)));
  const i = num(annualRatePct) / 1200;
  const fv = P * sipFactor(i, n);
  const invested = P * n;
  return {
    futureValue: roundRupee(fv),
    invested: roundRupee(invested),
    gains: roundRupee(fv - invested),
  };
}

/** Lumpsum future value. principal, annual CAGR %, tenure in years. */
export function lumpsumFutureValue(principal, annualRatePct, years) {
  const P = Math.max(0, num(principal));
  const r = num(annualRatePct) / 100;
  const t = Math.max(0, num(years));
  const fv = P * Math.pow(1 + r, t);
  return {
    futureValue: roundRupee(fv),
    invested: roundRupee(P),
    gains: roundRupee(fv - P),
  };
}

/**
 * Step-up SIP: instalment grows stepUpPct% once every 12 months.
 * Simulated month-by-month with the same annuity-due convention (instalment
 * at month start, then the month's growth). Returns a year-wise trail for
 * the "show the math" table.
 */
export function stepUpSipFutureValue(monthly, annualRatePct, years, stepUpPct) {
  const i = num(annualRatePct) / 1200;
  const s = num(stepUpPct) / 100;
  const y = Math.max(0, Math.round(num(years)));
  let instalment = Math.max(0, num(monthly));
  let balance = 0;
  let invested = 0;
  const yearly = [];
  for (let yr = 1; yr <= y; yr++) {
    for (let m = 0; m < 12; m++) {
      balance = (balance + instalment) * (1 + i);
      invested += instalment;
    }
    yearly.push({
      year: yr,
      monthlyInstalment: roundRupee(instalment),
      investedSoFar: roundRupee(invested),
      valueAtYearEnd: roundRupee(balance),
    });
    instalment *= 1 + s;
  }
  return {
    futureValue: roundRupee(balance),
    invested: roundRupee(invested),
    gains: roundRupee(balance - invested),
    yearly,
  };
}

/** Monthly SIP needed to reach targetFV in `years` at annual rate %. Exact (unrounded). */
export function requiredSip(targetFV, annualRatePct, years) {
  const FV = Math.max(0, num(targetFV));
  const n = Math.max(1, Math.round(num(years) * 12));
  const i = num(annualRatePct) / 1200;
  return FV / sipFactor(i, n);
}

/** One-time investment needed today to reach targetFV in `years`. Exact. */
export function requiredLumpsum(targetFV, annualRatePct, years) {
  const FV = Math.max(0, num(targetFV));
  const r = num(annualRatePct) / 100;
  const t = Math.max(0, num(years));
  return FV / Math.pow(1 + r, t);
}

/** Today's cost inflated to the goal date: cost × (1+inflation)^years. Exact. */
export function inflateTarget(todayCost, inflationPct, years) {
  const c = Math.max(0, num(todayCost));
  return c * Math.pow(1 + num(inflationPct) / 100, Math.max(0, num(years)));
}
