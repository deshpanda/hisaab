// Shared, pure formatting/parsing helpers. No DOM, no state — safe to import
// from both the pages and the test suites.

/**
 * Format a number as Indian Rupees with Indian digit grouping (e.g.
 * ₹12,34,567). Whole rupees by default; pass {paise:true} for two decimals.
 */
export function toINR(n, { paise = false } = {}) {
  const v = Number.isFinite(Number(n)) ? Number(n) : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: paise ? 2 : 0,
    maximumFractionDigits: paise ? 2 : 0,
  }).format(v);
}

/** Group a plain number the Indian way (12,34,567) without a currency symbol. */
export function toGrouped(n, digits = 0) {
  const v = Number.isFinite(Number(n)) ? Number(n) : 0;
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v);
}

/**
 * Parse a user-entered amount that may contain ₹, commas or spaces.
 * Returns NaN for blank/invalid input so callers can validate.
 */
export function parseAmount(str) {
  if (typeof str === 'number') return Number.isFinite(str) ? str : NaN;
  if (str == null) return NaN;
  const cleaned = String(str).replace(/[₹,\s]/g, '').trim();
  if (cleaned === '') return NaN;
  const v = Number(cleaned);
  return Number.isFinite(v) ? v : NaN;
}

/** Round to 2 decimals (paise), avoiding binary-float drift. */
export function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

/** Round to the nearest whole rupee (tax is customarily shown in rupees). */
export function roundRupee(n) {
  return Math.round(Number(n) + Number.EPSILON);
}

/** Clamp helper for sanitising inputs. */
export function clamp(n, min, max) {
  const v = Number(n) || 0;
  return Math.min(Math.max(v, min), max);
}
