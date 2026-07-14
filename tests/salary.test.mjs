import { test } from 'node:test';
import assert from 'node:assert/strict';
import { incomeTax, computeInHand } from '../lib/salary.js';

// All expected figures are FY 2026-27, cross-checked against the sources in
// SOURCES.md (income tax section).

test('new regime: full 87A rebate up to 12L taxable => zero tax', () => {
  assert.equal(incomeTax(1200000, { regime: 'new' }).totalTax, 0);
  assert.equal(incomeTax(700000, { regime: 'new' }).totalTax, 0);
});

test('new regime: marginal relief just above 12L (Upstox / ClearTax examples)', () => {
  const a = incomeTax(1210000, { regime: 'new' });
  assert.equal(a.taxAfterRebate, 10000); // capped at income - 12L
  assert.equal(a.totalTax, 10400);       // + 4% cess

  const b = incomeTax(1215000, { regime: 'new' });
  assert.equal(b.taxAfterRebate, 15000);
  assert.equal(b.totalTax, 15600);
});

test('new regime: at 24L taxable, tax is 3,00,000 + 4% cess', () => {
  const r = incomeTax(2400000, { regime: 'new' });
  assert.equal(r.slabTax, 300000);
  assert.equal(r.totalTax, 312000);
});

test('new regime: above the ~12.7L breakeven, normal slab tax applies', () => {
  const r = incomeTax(1300000, { regime: 'new' });
  assert.equal(r.rebateMarginalRelief, 0);
  assert.equal(r.taxAfterRebate, 75000);
  assert.equal(r.totalTax, 78000);
});

test('old regime: 10L taxable => 1,12,500 + cess = 1,17,000', () => {
  const r = incomeTax(1000000, { regime: 'old', age: 'below60' });
  assert.equal(r.taxAfterRebate, 112500);
  assert.equal(r.totalTax, 117000);
});

test('old regime: 87A is a hard cliff at 5L (no marginal relief)', () => {
  assert.equal(incomeTax(500000, { regime: 'old' }).totalTax, 0);
  const r = incomeTax(510000, { regime: 'old' });
  assert.equal(r.taxAfterRebate, 14500);
  assert.equal(r.totalTax, 15080);
});

test('old regime: senior (60-80) gets a 3L basic exemption', () => {
  assert.equal(incomeTax(500000, { regime: 'old', age: 's60to80' }).totalTax, 0);
});

test('new regime: surcharge marginal relief just above 50L', () => {
  const r = incomeTax(5010000, { regime: 'new' });
  assert.equal(r.taxAfterRebate, 1083000);
  assert.equal(r.surcharge, 7000); // 10% band (1,08,300) pulled down by marginal relief
  assert.equal(r.cess, 43600);
  assert.equal(r.totalTax, 1133600);
});

test('computeInHand: 15L gross, new regime, basic 50%', () => {
  const r = computeInHand({
    grossAnnual: 1500000, basicPct: 50, regime: 'new', professionalTax: 2400,
  });
  assert.equal(r.employeePF, 90000);      // 12% of 7.5L basic
  assert.equal(r.taxableIncome, 1425000); // only the 75k standard deduction
  assert.equal(r.tax.totalTax, 97500);
  // PT reduces take-home but is NOT deductible in the new regime
  assert.equal(r.inHandAnnual, 1500000 - 90000 - 2400 - 97500);
});

test('computeInHand: professional tax deductible only in the old regime', () => {
  const r = computeInHand({
    grossAnnual: 1000000, basicPct: 50, regime: 'old',
    professionalTax: 2500, deductions: { sec80C: 150000 },
  });
  // taxable = 10L - 50k std - 1.5L(80C) - 2.5k PT
  assert.equal(r.taxableIncome, 797500);
});

test('80C is capped at 1.5L', () => {
  const r = computeInHand({
    grossAnnual: 2000000, regime: 'old', deductions: { sec80C: 500000 },
  });
  assert.equal(r.deductionBreakdown.sec80C, 150000);
});
