import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sipFutureValue, lumpsumFutureValue, stepUpSipFutureValue,
  requiredSip, requiredLumpsum, inflateTarget,
} from '../lib/tvm.js';

// Expected figures are the canonical worked examples published by the major
// Indian calculators (annuity-due convention) — see SOURCES.md §8-10.

test('SIP: 1,000/mo at 12% for 12 months => 12,809 (canonical anchor)', () => {
  const r = sipFutureValue(1000, 12, 12);
  assert.equal(r.futureValue, 12809);
  assert.equal(r.invested, 12000);
  assert.equal(r.gains, 809);
});

test('SIP: 10,000/mo at 12% for 10 years => 23,23,391 total value', () => {
  const r = sipFutureValue(10000, 12, 120);
  assert.equal(r.futureValue, 2323391);
  assert.equal(r.invested, 1200000);
  assert.equal(r.gains, 1123391);
});

test('SIP: zero rate degrades to plain sum', () => {
  assert.equal(sipFutureValue(5000, 0, 24).futureValue, 120000);
});

test('lumpsum: 1,00,000 at 12% for 10 years => 3,10,585', () => {
  const r = lumpsumFutureValue(100000, 12, 10);
  assert.equal(r.futureValue, 310585);
  assert.equal(r.gains, 210585);
});

test('step-up SIP: hand-derived 2-year case (1,000/mo, 12%, +10%/yr) => 28,524', () => {
  // Closed-form check: 1000×AD(12)×1.01^12 + 1100×AD(12), AD(12)=12.809428
  const r = stepUpSipFutureValue(1000, 12, 2, 10);
  assert.equal(r.futureValue, 28524);
  assert.equal(r.invested, 12000 + 13200);
  assert.equal(r.yearly.length, 2);
  assert.equal(r.yearly[1].monthlyInstalment, 1100);
});

test('step-up SIP: Zerodha published example (10k/mo, 15y, +10%/yr, 12%) => 86,83,849', () => {
  const r = stepUpSipFutureValue(10000, 12, 15, 10);
  assert.equal(r.futureValue, 8683849);
});

test('step-up SIP: ClearTax published example (10k, +10%/yr, 14%, 8y) => 23,65,932 invested 13,72,307', () => {
  const r = stepUpSipFutureValue(10000, 14, 8, 10);
  assert.equal(r.invested, 1372307);
  assert.ok(Math.abs(r.futureValue - 2365932) <= 2, String(r.futureValue));
});

test('step-up SIP with 0% step equals plain SIP', () => {
  const a = stepUpSipFutureValue(7500, 11, 15, 0).futureValue;
  const b = sipFutureValue(7500, 11, 180).futureValue;
  assert.ok(Math.abs(a - b) <= 1, `${a} vs ${b}`);
});

test('step-up SIP matches independent closed-form segment sum (10y case)', () => {
  // FV = Σ_y P×(1+s)^(y−1) × AD(12) × ((1+i)^12)^(Y−y) — independent derivation
  const P = 10000, ratePct = 12, Y = 10, s = 0.10, i = 0.01;
  const AD = ((Math.pow(1 + i, 12) - 1) / i) * (1 + i);
  const c = Math.pow(1 + i, 12);
  let fv = 0;
  for (let y = 1; y <= Y; y++) fv += P * Math.pow(1 + s, y - 1) * AD * Math.pow(c, Y - y);
  const r = stepUpSipFutureValue(P, ratePct, Y, 10);
  assert.ok(Math.abs(r.futureValue - fv) < 1, `${r.futureValue} vs ${fv}`);
});

test('requiredSip inverts sipFutureValue', () => {
  const p = requiredSip(1000000, 12, 10);
  assert.ok(Math.abs(p - 4304.06) < 0.1, String(p));
  // round-trip: investing the exact figure reaches the target
  const back = sipFutureValue(p, 12, 120).futureValue;
  assert.ok(Math.abs(back - 1000000) <= 1);
});

test('requiredLumpsum inverts lumpsumFutureValue', () => {
  const p = requiredLumpsum(310585, 12, 10);
  assert.ok(Math.abs(p - 100000) < 0.5, String(p));
});

test('inflateTarget: 50L today at 6% for 15 years => ~1.198 crore', () => {
  const t = inflateTarget(5000000, 6, 15);
  assert.ok(Math.abs(t - 11982791) < 3, String(t)); // 5e6 × 1.06^15
});
