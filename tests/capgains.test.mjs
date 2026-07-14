import { test } from 'node:test';
import assert from 'node:assert/strict';
import { equityCapitalGainsTax } from '../lib/capgains.js';

// FY 2026-27 equity (STT-paid) capital gains. See SOURCES.md (capital gains).

test('LTCG just above the 1.25L exemption: 12.5% + 4% cess', () => {
  const r = equityCapitalGainsTax({ ltcg: 175000 });
  assert.equal(r.taxableLtcg, 50000);
  assert.equal(r.ltcgTax, 6250);
  assert.equal(r.totalTax, 6500);
});

test('STCL offsets STCG first, then LTCG; 1.25L exemption applied once', () => {
  const r = equityCapitalGainsTax({ stcg: 50000, stcl: 150000, ltcg: 300000 });
  assert.equal(r.netStcg, 0);
  assert.equal(r.netLtcg, 200000);
  assert.equal(r.taxableLtcg, 75000);
  assert.equal(r.ltcgTax, 9375);
  assert.equal(r.totalTax, 9750);
  assert.equal(r.stclCarryForward, 0);
});

test('LTCL offsets only LTCG, never STCG', () => {
  const r = equityCapitalGainsTax({ stcg: 200000, ltcg: 100000, ltcl: 250000 });
  assert.equal(r.netLtcg, 0);
  assert.equal(r.ltclCarryForward, 150000); // leftover LT loss carries forward
  assert.equal(r.netStcg, 200000);          // short-term gain untouched
  assert.equal(r.stcgTax, 40000);           // 20%
  assert.equal(r.totalTax, 40000 + 1600);   // + 4% cess
});

test('no tax when net LTCG is within the 1.25L exemption', () => {
  assert.equal(equityCapitalGainsTax({ ltcg: 125000 }).totalTax, 0);
});

test('surcharge on 111A/112A gains is capped at 15% even if 37% is passed', () => {
  const r = equityCapitalGainsTax({ ltcg: 10000000, surchargeRate: 0.37 });
  assert.equal(r.surchargeRate, 0.15);
  assert.equal(r.taxableLtcg, 9875000);
  assert.equal(r.ltcgTax, 1234375);
  assert.equal(r.surcharge, 185156); // 15% of base
  const base = 1234375;
  const sc = 185156;
  const cess = Math.round((base + sc) * 0.04);
  assert.equal(r.cess, cess);
  assert.equal(r.totalTax, base + sc + cess);
});
