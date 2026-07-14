// Shared progressive enhancement. Fills the FY/AY labels and the footer year
// from the single config, so the annual update never needs to touch markup.
import { FY, AY } from '../lib/config.js';

for (const el of document.querySelectorAll('[data-fy]')) el.textContent = FY;
for (const el of document.querySelectorAll('[data-ay]')) el.textContent = AY;
const year = new Date().getFullYear();
for (const el of document.querySelectorAll('[data-year]')) el.textContent = String(year);
