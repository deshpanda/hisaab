// Gratuity under the Payment of Gratuity Act, 1972. Pure.
//
//   Covered by the Act:  (15/26) × last drawn (Basic+DA) × years, where a
//                        final part-year counts as a full year only if it
//                        EXCEEDS six months.
//   Not covered:         (15/30) × average salary of the last 10 months ×
//                        completed years (no round-up).
// Eligibility needs 5 years of continuous service (waived on death/disability).

import { GRATUITY } from './config.js';
import { roundRupee } from './format.js';

const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);

/**
 * @param {object} p
 *   salaryMonthly   last drawn Basic+DA (covered) — or average of the last
 *                   10 months' salary (not covered)
 *   yearsCompleted  completed years of service
 *   extraMonths     additional months beyond the completed years (0-11)
 *   covered         employer covered under the Act (default true)
 */
export function gratuityAmount(p = {}) {
  const salary = Math.max(0, num(p.salaryMonthly));
  const yearsCompleted = Math.max(0, Math.floor(num(p.yearsCompleted)));
  const extraMonths = Math.min(Math.max(0, num(p.extraMonths)), 11);
  const covered = p.covered !== false;

  const serviceYears = yearsCompleted + extraMonths / 12;
  const eligible = serviceYears >= GRATUITY.eligibilityYears;

  let yearsCounted;
  let amount;
  if (covered) {
    yearsCounted = yearsCompleted + (extraMonths > GRATUITY.roundUpMonthsThreshold ? 1 : 0);
    amount = (15 / 26) * salary * yearsCounted;
  } else {
    yearsCounted = yearsCompleted;
    amount = (15 / 30) * salary * yearsCounted;
  }

  const cap = GRATUITY.taxExemptCap;
  return {
    covered,
    eligible,
    yearsCounted,
    amount: roundRupee(amount),
    taxExemptCap: cap,
    // For private-sector employees the exemption is the least of the actual
    // amount received, the formula amount and the cap; here we surface the
    // simple over-cap excess of the computed amount.
    amountOverCap: roundRupee(Math.max(0, amount - cap)),
  };
}
