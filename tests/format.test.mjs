import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toINR, toINRCompact, parseAmount } from '../lib/format.js';

test('toINR groups the Indian way', () => {
  assert.equal(toINR(1234567), '₹12,34,567');
});

test('toINRCompact: crore, lakh and small values', () => {
  assert.equal(toINRCompact(12345678), '₹1.23 Cr');
  assert.equal(toINRCompact(450000), '₹4.50 L');
  assert.equal(toINRCompact(45000), '₹45,000');
  assert.equal(toINRCompact(-12345678), '−₹1.23 Cr');
});

test('parseAmount strips ₹, commas and spaces', () => {
  assert.equal(parseAmount('₹12,34,567'), 1234567);
  assert.equal(parseAmount(' 50 000 '), 50000);
  assert.ok(Number.isNaN(parseAmount('abc')));
  assert.ok(Number.isNaN(parseAmount('')));
});
