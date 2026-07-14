import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emi, outstandingAfter, compareRentVsBuy } from '../lib/rentbuy.js';

// EMI anchors are the figures shown by bank/major-portal calculators
// (see SOURCES.md §7).

test('EMI: 50L at 8.5% for 20 years => 43,391', () => {
  assert.equal(Math.round(emi(5000000, 8.5, 240)), 43391);
});

test('EMI: 1cr at 9% for 20 years => 89,973', () => {
  assert.equal(Math.round(emi(10000000, 9, 240)), 89973);
});

test('EMI: zero-rate loan is straight division', () => {
  assert.equal(emi(2400000, 0, 240), 10000);
});

test('outstanding balance matches a month-by-month amortisation loop', () => {
  const P = 5000000, rate = 8.5, n = 240, k = 60;
  const E = emi(P, rate, n);
  const r = rate / 1200;
  let bal = P;
  for (let m = 0; m < k; m++) bal = bal * (1 + r) - E;
  const closed = outstandingAfter(P, rate, n, k);
  assert.ok(Math.abs(closed - bal) < 1, `${closed} vs ${bal}`);
});

test('outstanding is zero at (or past) full tenure', () => {
  assert.ok(outstandingAfter(5000000, 8.5, 240, 240) < 1);
  assert.equal(outstandingAfter(5000000, 8.5, 240, 999), outstandingAfter(5000000, 8.5, 240, 240));
});

test('rent-vs-buy: zero-rate hand-verifiable integration case', () => {
  // All rates zero => every component is hand-computable:
  // price 1cr, down 20L, upfront 5% (5L), loan 80L @0% for 240m (EMI 33,333.33),
  // horizon 24m, rent 20k flat, own-cost 1k flat, invest 0%, appreciation 0%.
  const r = compareRentVsBuy({
    price: 10000000, downPayment: 2000000, upfrontCostsPct: 5,
    loanRatePct: 0, tenureYears: 20, horizonYears: 2,
    ownCostMonthly: 1000, rentMonthly: 20000, rentGrowthPct: 0,
    securityDeposit: 0, investReturnPct: 0, appreciationPct: 0,
  });
  // Buyer: equity = 1cr − (80L − 24×33,333.33) = 28,00,000; no investments.
  assert.equal(r.buyer.netWorth, 2800000);
  // Renter: invests 25L at t0 + (34,333.33 − 20,000) × 24 = 3,44,000 => 28,44,000.
  assert.equal(r.renter.netWorth, 2844000);
  assert.equal(r.buyMinusRent, -44000);
  assert.equal(r.renter.totalRentPaid, 480000);
  assert.equal(r.buyer.totalEmiPaid, 800000);
  assert.equal(r.buyer.interestPaid, 0);
});

test('rent-vs-buy: rent escalates annually, not monthly', () => {
  const r = compareRentVsBuy({
    price: 10000000, downPayment: 2000000, upfrontCostsPct: 0,
    loanRatePct: 0, tenureYears: 20, horizonYears: 2,
    ownCostMonthly: 0, rentMonthly: 20000, rentGrowthPct: 5,
    securityDeposit: 0, investReturnPct: 0, appreciationPct: 0,
  });
  // Year 1: 12×20,000 = 2,40,000; year 2: 12×21,000 = 2,52,000.
  assert.equal(r.renter.totalRentPaid, 492000);
});

test('rent-vs-buy: deposit is returned to the renter at the horizon', () => {
  const base = {
    price: 10000000, downPayment: 2000000, upfrontCostsPct: 5,
    loanRatePct: 0, tenureYears: 20, horizonYears: 2,
    ownCostMonthly: 1000, rentMonthly: 20000, rentGrowthPct: 0,
    securityDeposit: 0, investReturnPct: 0, appreciationPct: 0,
  };
  const noDep = compareRentVsBuy(base);
  const withDep = compareRentVsBuy({ ...base, securityDeposit: 200000 });
  // With 0% returns the deposit is exactly neutral: less invested, returned at end.
  assert.equal(withDep.renter.netWorth, noDep.renter.netWorth);
});

test('rent-vs-buy: appreciation raises buyer net worth by price×((1+a)^H − 1)', () => {
  const base = {
    price: 10000000, downPayment: 2000000, upfrontCostsPct: 5,
    loanRatePct: 0, tenureYears: 20, horizonYears: 2,
    ownCostMonthly: 1000, rentMonthly: 20000, rentGrowthPct: 0,
    securityDeposit: 0, investReturnPct: 0, appreciationPct: 0,
  };
  const flat = compareRentVsBuy(base);
  const up = compareRentVsBuy({ ...base, appreciationPct: 5 });
  const expectedGain = Math.round(10000000 * (Math.pow(1.05, 2) - 1)); // 10,25,000
  assert.equal(up.buyer.netWorth - flat.buyer.netWorth, expectedGain);
});
