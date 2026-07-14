import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hraExemption, hraExemptionMultiPeriod } from '../lib/hra.js';

// Section 10(13A) least-of-three. See SOURCES.md (HRA).

test('metro: rent-minus-10% limb binds (Delhi worked example)', () => {
  const r = hraExemption({ salary: 600000, hraReceived: 216000, rentPaid: 240000, isMetro: true });
  assert.deepEqual(r.limbs, { actualHra: 216000, pctOfSalary: 300000, rentMinus10: 180000 });
  assert.equal(r.exempt, 180000);
  assert.equal(r.taxable, 36000);
  assert.equal(r.binding, 'rentMinus10');
});

test('non-metro: actual HRA received limb binds', () => {
  const r = hraExemption({ salary: 300000, hraReceived: 72000, rentPaid: 120000, isMetro: false });
  assert.equal(r.limbs.pctOfSalary, 120000); // 40%, not 50%
  assert.equal(r.exempt, 72000);
  assert.equal(r.binding, 'actualHra');
});

test('no rent paid => no exemption', () => {
  const r = hraExemption({ salary: 600000, hraReceived: 200000, rentPaid: 0, isMetro: true });
  assert.equal(r.exempt, 0);
});

test('period-wise total (mid-year transfer + raise, different limbs bind)', () => {
  const r = hraExemptionMultiPeriod([
    { salary: 300000, hraReceived: 72000, rentPaid: 120000, isMetro: false }, // Apr–Sep, non-metro
    { salary: 360000, hraReceived: 180000, rentPaid: 168000, isMetro: true },  // Oct–Mar, metro
  ]);
  assert.equal(r.exempt, 204000); // 72,000 + 1,32,000
});
