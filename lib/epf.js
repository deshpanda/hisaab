// EPF corpus projection. Pure.
//
// Conventions (EPFO practice — see SOURCES.md):
//   - Employee contributes employeePct (12%) of Basic+DA.
//   - Employer contributes 12%, of which EPS (pension) takes 8.33% of the wage
//     CAPPED at the statutory ceiling; the remainder goes to the EPF account.
//   - Interest accrues monthly (rate/12) on the running balance but is
//     CREDITED once at year end (no intra-year compounding). The month's own
//     contribution starts earning from the following month.
//   - Salary grows once a year by annualIncreasePct.

import { EPF, EPS, EPF_INTEREST } from './config.js';
import { roundRupee } from './format.js';

const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);

/**
 * @param {object} p
 *   basicMonthly       current Basic+DA per month
 *   years              years to project
 *   annualIncreasePct  yearly raise applied to Basic+DA (default 0)
 *   currentBalance     existing EPF balance (default 0)
 *   ratePct            EPF interest % p.a. (default: latest declared, from config)
 *   employeePct        employee contribution % (default 12; raise for VPF)
 *   includeEmployer    include the employer's EPF share (default true)
 *   capAtCeiling       employer contributes only on the ₹15,000 statutory wage
 *                      (some employers do; caps both shares — default false)
 */
export function epfProjection(p = {}) {
  const years = Math.max(0, Math.round(num(p.years)));
  const annualIncrease = num(p.annualIncreasePct) / 100;
  const ratePct = p.ratePct === undefined ? EPF_INTEREST.ratePct : num(p.ratePct);
  const i = ratePct / 1200;
  const employeePct = p.employeePct === undefined ? EPF.employeeRate * 100 : num(p.employeePct);
  const includeEmployer = p.includeEmployer !== false;
  const capAtCeiling = p.capAtCeiling === true;

  let wage = Math.max(0, num(p.basicMonthly));
  let balance = Math.max(0, num(p.currentBalance));
  let totalEmployee = 0;
  let totalEmployer = 0;
  let totalInterest = 0;
  const yearly = [];

  for (let y = 1; y <= years; y++) {
    const contribWage = capAtCeiling ? Math.min(wage, EPS.wageCeilingMonthly) : wage;
    const employee = Math.round((contribWage * employeePct) / 100);
    const eps = Math.round(Math.min(contribWage, EPS.wageCeilingMonthly) * EPS.rate);
    const employer = includeEmployer
      ? Math.max(0, Math.round(contribWage * 0.12) - eps)
      : 0;
    const deposit = employee + employer;

    let interest = 0;
    for (let m = 0; m < 12; m++) {
      interest += balance * i; // this month's contribution earns from next month
      balance += deposit;
    }
    balance += interest; // credited at year end

    totalEmployee += employee * 12;
    totalEmployer += employer * 12;
    totalInterest += interest;
    yearly.push({
      year: y,
      wageMonthly: roundRupee(wage),
      employeeContribution: employee * 12,
      employerContribution: employer * 12,
      interestCredited: roundRupee(interest),
      closingBalance: roundRupee(balance),
    });

    wage *= 1 + annualIncrease;
  }

  return {
    ratePct,
    corpus: roundRupee(balance),
    totalEmployee: roundRupee(totalEmployee),
    totalEmployer: roundRupee(totalEmployer),
    totalInterest: roundRupee(totalInterest),
    yearly,
  };
}
