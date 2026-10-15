/* ============================================================
   words.js — this page's word bank: WHICH words of the KS3 glossary it shows, and in which groups (15 Oct 2026).
   The words themselves, their Korean and Chinese, and their ONE definition each live in labs-shared/ks3-glossary.js,
   copied here as js/glossary.js by tools/practicals-sync.mjs (Daniel, 15 Oct 2026: one set of KS3 definitions for every
   lab, "not recreating multiple definitions of the same words"). Never write a definition here: add the word to the
   glossary first. Translations: Korean as in Korean school science; Chinese Simplified, as Bio English; checked by an
   independent reviewer (14 Oct 2026). Tapping a word in the word bank opens its definition; a glossary word inside a
   definition is a link to its own definition (js/core.js, initWordBank).
   ============================================================ */
window.WORD_KEYS = [
  { g: 'Particles and substances', w: ['matter', 'substance', 'particle', 'atom', 'element', 'chemical-symbol', 'bond', 'molecule', 'compound', 'ion', 'lattice', 'state', 'solid', 'liquid', 'gas', 'hydrogen-bond'] },
  { g: 'Mixtures', w: ['mixture', 'pure', 'solution', 'solute', 'solvent', 'dissolve', 'soluble', 'insoluble', 'saturated', 'phase', 'homogeneous', 'heterogeneous', 'mechanical', 'miscible', 'immiscible', 'alloy', 'fat', 'protein', 'droplet', 'tyndall', 'colloid'] },
  { g: 'Separation methods', w: ['filtration', 'evaporation', 'crystallisation', 'distillation', 'fractional', 'chromatography', 'decanting', 'funnel-sep', 'sieve', 'magnet'] },
  { g: 'Apparatus', w: ['filter-paper', 'funnel', 'beaker', 'flask', 'conical-flask', 'basin', 'bunsen', 'glass-rod', 'condenser', 'thermometer'] },
  { g: 'Results', w: ['residue', 'filtrate', 'crystal', 'distillate', 'vapour', 'chromatogram', 'baseline', 'solvent-front', 'stationary', 'mobile', 'rf', 'dye'] },
  { g: 'Properties', w: ['size', 'solubility', 'volatility', 'boiling-point', 'density', 'magnetism', 'affinity'] },
  { g: 'Doing words', w: ['boil', 'evaporate', 'condense', 'heat', 'cool', 'separate', 'attract', 'float', 'settle'] }
];
/* the bank as the page reads it: each group's words, from the glossary */
window.WORDS = window.WORD_KEYS.map(g => ({ g: g.g, w: g.w.map(k => window.KS3_GLOSSARY && window.KS3_GLOSSARY.by[k]).filter(Boolean) }));
