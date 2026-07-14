// NPS accumulation + exit split. Pure.
// Accumulation follows the same monthly annuity-due convention as a SIP
// (optionally with an annual step-up). At exit, at least the statutory
// minimum share of the corpus buys an annuity; the rest is the lump sum.

import { sipFutureValue, stepUpSipFutureValue } from './tvm.js';
import { NPS_RULES } from './config.js';
import { roundRupee } from './format.js';

const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);

/**
 * @param {object} p
 *   currentAge, retirementAge (default 60)
 *   monthly            monthly contribution
 *   expectedReturnPct  assumed return on the NPS corpus % p.a.
 *   stepUpPct          annual contribution increase % (default 0)
 *   annuityPct         share of corpus used to buy the annuity (clamped to the
 *                      statutory minimum, default = the minimum)
 *   annuityRatePct     assumed annuity rate % p.a.
 */
export function npsProjection(p = {}) {
  const age = Math.max(18, num(p.currentAge));
  const retireAge = p.retirementAge === undefined ? 60 : num(p.retirementAge);
  const years = Math.max(0, Math.round(retireAge - age));
  const stepUp = num(p.stepUpPct);

  const acc = stepUp > 0
    ? stepUpSipFutureValue(p.monthly, p.expectedReturnPct, years, stepUp)
    : sipFutureValue(p.monthly, p.expectedReturnPct, years * 12);

  const minPct = NPS_RULES.minAnnuityPct;
  const annuityPct = Math.min(Math.max(p.annuityPct === undefined ? minPct : num(p.annuityPct), minPct), 100);
  const corpus = acc.futureValue;
  const annuityCorpus = (corpus * annuityPct) / 100;
  const lumpsum = corpus - annuityCorpus;
  const monthlyPension = (annuityCorpus * num(p.annuityRatePct)) / 100 / 12;

  // Only taxFreeCorpusPct (60%) of the corpus is tax-free as lump sum; a lump
  // sum above that (possible since the 80/20 rule of Dec 2025) is taxable.
  const taxFreeLumpsum = Math.min(lumpsum, (corpus * NPS_RULES.taxFreeCorpusPct) / 100);
  const taxableLumpsum = lumpsum - taxFreeLumpsum;

  return {
    years,
    corpus,
    invested: acc.invested,
    gains: acc.gains,
    annuityPct,
    annuityCorpus: roundRupee(annuityCorpus),
    lumpsum: roundRupee(lumpsum),
    taxFreeLumpsum: roundRupee(taxFreeLumpsum),
    taxableLumpsum: roundRupee(taxableLumpsum),
    monthlyPension: roundRupee(monthlyPension),
    smallCorpusFullWithdrawal: corpus <= NPS_RULES.smallCorpusFullWithdrawal,
  };
}
