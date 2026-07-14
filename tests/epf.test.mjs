import { test } from 'node:test';
import assert from 'node:assert/strict';
import { epfProjection } from '../lib/epf.js';

// Hand-derived EPFO-convention examples (monthly running balance, interest
// credited at year end; the month's contribution earns from the next month).
// The rate is passed explicitly so these hold regardless of config defaults.

test('EPF year 1: wage 30k, 8.25% => deposit 5,950/mo, interest 2,700, closing 74,100', () => {
  // employee 12% of 30,000 = 3,600; EPS = 8.33% × 15,000 = 1,250 (rounded);
  // employer EPF = 3,600 − 1,250 = 2,350; deposit 5,950.
  // Interest = 5,950 × (8.25%/12) × (0+1+...+11) = 5,950 × 0.006875 × 66 = 2,699.81.
  const r = epfProjection({ basicMonthly: 30000, years: 1, ratePct: 8.25 });
  const y1 = r.yearly[0];
  assert.equal(y1.employeeContribution, 43200);
  assert.equal(y1.employerContribution, 28200);
  assert.equal(y1.interestCredited, 2700);
  assert.equal(y1.closingBalance, 74100);
});

test('EPF year 2 with a 5% raise: closing 1,58,796 (hand-derived)', () => {
  // Year 2: wage 31,500 → employee 3,780, EPS 1,250, employer 2,530, deposit 6,310.
  // Interest = 12 × 74,099.8125 × 0.006875 + 6,310 × 0.006875 × 66 = 8,976.41.
  // Closing = 74,099.8125 + 75,720 + 8,976.41 = 1,58,796.22.
  const r = epfProjection({ basicMonthly: 30000, years: 2, annualIncreasePct: 5, ratePct: 8.25 });
  assert.equal(r.yearly[1].closingBalance, 158796);
});

test('EPS is capped at the 15k ceiling: high wage routes more to employer EPF', () => {
  // wage 100,000: employee 12,000; EPS = 8.33% × 15,000 = 1,250 (not 8,330);
  // employer EPF = 12,000 − 1,250 = 10,750.
  const r = epfProjection({ basicMonthly: 100000, years: 1, ratePct: 8.25 });
  assert.equal(r.yearly[0].employerContribution, 10750 * 12);
});

test('existing balance earns a full year of monthly-accrued interest', () => {
  // Balance 1,00,000, no contributions (basic 0): interest = 1,00,000 × 0.006875 × 12 = 8,250.
  const r = epfProjection({ basicMonthly: 0, years: 1, currentBalance: 100000, ratePct: 8.25 });
  assert.equal(r.corpus, 108250);
});

test('capAtCeiling: both shares computed on ₹15,000 (1,800 employee / 550 employer)', () => {
  // ClearTax convention for employers who cap statutory PF at the ceiling.
  const r = epfProjection({ basicMonthly: 100000, years: 1, ratePct: 8.25, capAtCeiling: true });
  assert.equal(r.yearly[0].employeeContribution, 1800 * 12);
  assert.equal(r.yearly[0].employerContribution, 550 * 12); // 1,800 − 1,250 EPS
});

test('below the ceiling, EPS is 8.33% of the actual wage (ClearTax 14k example)', () => {
  // wage 14,000: employee 1,680; EPS = 8.33% × 14,000 = 1,166; employer EPF = 1,680 − 1,166 = 514.
  const r = epfProjection({ basicMonthly: 14000, years: 1, ratePct: 8.25 });
  assert.equal(r.yearly[0].employeeContribution, 1680 * 12);
  assert.equal(r.yearly[0].employerContribution, 514 * 12);
});

test('employee-only mode (employer excluded)', () => {
  const r = epfProjection({ basicMonthly: 30000, years: 1, ratePct: 8.25, includeEmployer: false });
  assert.equal(r.yearly[0].employerContribution, 0);
  assert.equal(r.yearly[0].employeeContribution, 43200);
});
