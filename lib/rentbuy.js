// Home-loan EMI and the rent-vs-buy comparison engine. Pure.
//
// The comparison is a symmetric net-worth model — it COMPUTES which path ends
// with more wealth under the user's assumptions; it never recommends:
//   - Both people have the same cash available: at t0, max(down payment +
//     upfront costs, security deposit); each month, max(owner outflow, rent).
//   - Whoever pays less invests the difference at the expected return
//     (monthly compounding, end-of-month contributions).
//   - At the horizon: buyer's net worth = home value − loan outstanding +
//     buyer's investments; renter's = investments + deposit back.

import { roundRupee } from './format.js';

const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);

/** Standard reducing-balance EMI. Exact (unrounded). */
export function emi(principal, annualRatePct, months) {
  const P = Math.max(0, num(principal));
  const n = Math.max(1, Math.round(num(months)));
  const r = num(annualRatePct) / 1200;
  if (P === 0) return 0;
  if (r === 0) return P / n;
  const f = Math.pow(1 + r, n);
  return (P * r * f) / (f - 1);
}

/** Loan outstanding after k paid months (closed form). Exact. */
export function outstandingAfter(principal, annualRatePct, months, paidMonths) {
  const P = Math.max(0, num(principal));
  const n = Math.max(1, Math.round(num(months)));
  const k = Math.min(Math.max(0, Math.round(num(paidMonths))), n);
  const r = num(annualRatePct) / 1200;
  if (P === 0) return 0;
  if (r === 0) return P * (1 - k / n);
  const E = emi(P, annualRatePct, n);
  const fk = Math.pow(1 + r, k);
  return Math.max(0, P * fk - (E * (fk - 1)) / r);
}

/**
 * @param {object} p
 *   price              property price
 *   downPayment        upfront equity (₹)
 *   upfrontCostsPct    stamp duty + registration etc., % of price (not recovered on sale)
 *   loanRatePct        home-loan interest % p.a.
 *   tenureYears        loan tenure
 *   horizonYears       comparison horizon
 *   ownCostMonthly     maintenance + property tax + repairs, ₹/month (grows like rent)
 *   rentMonthly        starting rent ₹/month
 *   rentGrowthPct      annual rent (and ownership-cost) escalation %
 *   securityDeposit    refundable deposit paid by the renter (₹)
 *   investReturnPct    expected return % p.a. on invested savings
 *   appreciationPct    property appreciation % p.a.
 */
export function compareRentVsBuy(p = {}) {
  const price = Math.max(0, num(p.price));
  const down = Math.min(Math.max(0, num(p.downPayment)), price);
  const upfront = (price * Math.max(0, num(p.upfrontCostsPct))) / 100;
  const loan = price - down;
  const tenureM = Math.max(1, Math.round(num(p.tenureYears) * 12));
  const H = Math.max(1, Math.round(num(p.horizonYears) * 12));
  const E = emi(loan, p.loanRatePct, tenureM);
  const iInv = num(p.investReturnPct) / 1200;
  const g = num(p.rentGrowthPct) / 100;
  const rent0 = Math.max(0, num(p.rentMonthly));
  const own0 = Math.max(0, num(p.ownCostMonthly));
  const deposit = Math.max(0, num(p.securityDeposit));

  const buyerT0 = down + upfront;
  const cash0 = Math.max(buyerT0, deposit);
  let buyCorpus = cash0 - buyerT0;
  let rentCorpus = cash0 - deposit;

  let totalRent = 0;
  let totalEmiPaid = 0;
  let totalOwnCost = 0;
  for (let m = 1; m <= H; m++) {
    const esc = Math.pow(1 + g, Math.ceil(m / 12) - 1);
    const rent = rent0 * esc;
    const emiThisMonth = m <= tenureM ? E : 0;
    const own = emiThisMonth + own0 * esc;
    const pay = Math.max(rent, own);
    buyCorpus = buyCorpus * (1 + iInv) + (pay - own);
    rentCorpus = rentCorpus * (1 + iInv) + (pay - rent);
    totalRent += rent;
    totalEmiPaid += emiThisMonth;
    totalOwnCost += own0 * esc;
  }

  const homeValue = price * Math.pow(1 + num(p.appreciationPct) / 100, H / 12);
  const loanOutstanding = outstandingAfter(loan, p.loanRatePct, tenureM, Math.min(H, tenureM));
  const principalRepaid = loan - loanOutstanding;
  const interestPaid = totalEmiPaid - principalRepaid;

  const buyerNetWorth = homeValue - loanOutstanding + buyCorpus;
  const renterNetWorth = rentCorpus + deposit;

  return {
    emi: roundRupee(E),
    loan: roundRupee(loan),
    upfrontCosts: roundRupee(upfront),
    buyer: {
      netWorth: roundRupee(buyerNetWorth),
      homeValue: roundRupee(homeValue),
      loanOutstanding: roundRupee(loanOutstanding),
      investments: roundRupee(buyCorpus),
      totalEmiPaid: roundRupee(totalEmiPaid),
      interestPaid: roundRupee(interestPaid),
      totalOwnCost: roundRupee(totalOwnCost),
      initialOutgo: roundRupee(buyerT0),
    },
    renter: {
      netWorth: roundRupee(renterNetWorth),
      investments: roundRupee(rentCorpus),
      totalRentPaid: roundRupee(totalRent),
      deposit: roundRupee(deposit),
    },
    // positive => buying ends wealthier; negative => renting does
    buyMinusRent: roundRupee(buyerNetWorth - renterNetWorth),
  };
}
