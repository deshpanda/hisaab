import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gratuityAmount } from '../lib/gratuity.js';

// Payment of Gratuity Act formulae (see SOURCES.md).

test('covered: 50k salary, 10y 7m => 11 years counted => 3,17,308', () => {
  const r = gratuityAmount({ salaryMonthly: 50000, yearsCompleted: 10, extraMonths: 7 });
  assert.equal(r.yearsCounted, 11);
  assert.equal(r.amount, 317308); // 50,000 × 15/26 × 11
});

test('covered: 10y 4m does NOT round up => 10 years => 2,88,462', () => {
  const r = gratuityAmount({ salaryMonthly: 50000, yearsCompleted: 10, extraMonths: 4 });
  assert.equal(r.yearsCounted, 10);
  assert.equal(r.amount, 288462);
});

test('covered: exactly 6 extra months does not round up (must EXCEED six)', () => {
  const r = gratuityAmount({ salaryMonthly: 50000, yearsCompleted: 10, extraMonths: 6 });
  assert.equal(r.yearsCounted, 10);
});

test('not covered: 15/30 of average salary × completed years, no round-up', () => {
  const r = gratuityAmount({ salaryMonthly: 50000, yearsCompleted: 10, extraMonths: 7, covered: false });
  assert.equal(r.yearsCounted, 10);
  assert.equal(r.amount, 250000); // 50,000 × 15/30 × 10
});

test('eligibility flag: under 5 years of service', () => {
  assert.equal(gratuityAmount({ salaryMonthly: 50000, yearsCompleted: 4, extraMonths: 7 }).eligible, false);
  assert.equal(gratuityAmount({ salaryMonthly: 50000, yearsCompleted: 5, extraMonths: 0 }).eligible, true);
});

test('amount above the ₹20L exemption cap is surfaced', () => {
  // 2,00,000 × 15/26 × 20 = 23,07,692 → 3,07,692 over the cap
  const r = gratuityAmount({ salaryMonthly: 200000, yearsCompleted: 20, extraMonths: 0 });
  assert.equal(r.amount, 2307692);
  assert.equal(r.amountOverCap, 307692);
});
