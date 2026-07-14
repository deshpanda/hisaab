import { test } from 'node:test';
import assert from 'node:assert/strict';
import { npsProjection } from '../lib/nps.js';
import { sipFutureValue } from '../lib/tvm.js';

// Exit-split rules per the PFRDA Amendment Regulations 2025 (see SOURCES.md):
// min annuity 20%, tax-free lump sum capped at 60% of corpus, small-corpus
// threshold ₹8,00,000.

test('NPS: corpus accumulation equals the SIP engine (30→60, 10k/mo, 10%)', () => {
  const r = npsProjection({ currentAge: 30, monthly: 10000, expectedReturnPct: 10, annuityPct: 40, annuityRatePct: 6 });
  const sip = sipFutureValue(10000, 10, 360);
  assert.equal(r.corpus, sip.futureValue);
  assert.equal(r.years, 30);
});

test('NPS: 1cr corpus, 40% annuity at 6% => 20,000/month pension, 60L tax-free lump sum', () => {
  // Use a degenerate accumulation (0% return) to pin the corpus exactly.
  const r = npsProjection({
    currentAge: 50, retirementAge: 60, monthly: 10000000 / 120,
    expectedReturnPct: 0, annuityPct: 40, annuityRatePct: 6,
  });
  assert.equal(r.corpus, 10000000);
  assert.equal(r.annuityCorpus, 4000000);
  assert.equal(r.monthlyPension, 20000);
  assert.equal(r.lumpsum, 6000000);
  assert.equal(r.taxableLumpsum, 0); // 60% lump sum is exactly the tax-free cap
});

test('NPS: 20% annuity => 80% lump sum, of which the slice above 60% is taxable', () => {
  const r = npsProjection({
    currentAge: 50, retirementAge: 60, monthly: 10000000 / 120,
    expectedReturnPct: 0, annuityPct: 20, annuityRatePct: 6,
  });
  assert.equal(r.lumpsum, 8000000);
  assert.equal(r.taxFreeLumpsum, 6000000);
  assert.equal(r.taxableLumpsum, 2000000);
  assert.equal(r.monthlyPension, 10000); // 20L × 6% / 12
});

test('NPS: annuity share below the statutory minimum is clamped to 20%', () => {
  const r = npsProjection({
    currentAge: 50, retirementAge: 60, monthly: 1000,
    expectedReturnPct: 0, annuityPct: 5, annuityRatePct: 6,
  });
  assert.equal(r.annuityPct, 20);
});

test('NPS: small corpus (≤ 8L) flagged for full withdrawal', () => {
  const small = npsProjection({
    currentAge: 55, retirementAge: 60, monthly: 10000,
    expectedReturnPct: 0, annuityPct: 40, annuityRatePct: 6,
  });
  assert.equal(small.corpus, 600000);
  assert.equal(small.smallCorpusFullWithdrawal, true);
});
