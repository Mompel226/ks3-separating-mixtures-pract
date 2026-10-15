/* ============================================================
   ks3-glossary.js — the ONE list of KS3 science words: each word once, with Korean, Chinese and ONE definition at Key
   Stage 3 level (Daniel, 15 Oct 2026: "create a kind of a document that contains all of those definitions. So if I need
   to provide those definitions in a later lab … it uses that as reference, and we are not recreating multiple
   definitions of the same words over and over again").
   - Where Daniel's Year 7 lessons already define a word, his words are used (src: 'Y7 L2'; his slides
     KS3/KS3 Lessons/Y7/2.Chemistry/L2.Atoms-Compounds/1.Atoms_elements_compounds.pptx), corrected only where a slide is
     not accurate (particle: an element is a substance, not a particle).
   - Particles follow the model the pupils draw (memory particle-model-in-diagrams).
   - A word of another entry inside a definition becomes a link to that entry (the page and tools/ks3-glossary.mjs share
     the rule in forms() below); link: false keeps a word with two meanings from linking ("separate" particles).
   NEVER edit a page's copy (js/glossary.js): edit this file, then run node tools/practicals-sync.mjs (it copies it into
   every KS3 practical) and node tools/ks3-glossary.mjs (it checks the list and writes KS3-GLOSSARY.md, the readable copy).
   ko: the word used in Korean school science; zh: Simplified Chinese as in mainland school chemistry.
   ============================================================ */
(function () {
  'use strict';
  const G = [
    { g: 'Particles and substances', w: [
      { k: 'matter',          en: 'matter',          ko: '물질',              zh: '物质',        src: 'Y7 L2', d: 'Anything that has mass and takes up space.' },
      { k: 'substance',       en: 'substance',       ko: '물질',              zh: '物质',        src: 'Y7 L2', d: 'One kind of matter with its own properties, such as water, salt or oxygen.' },
      { k: 'particle',        en: 'particle',        ko: '입자',              zh: '粒子',        src: 'Y7 L2', d: 'A very small piece of matter, such as an atom, a molecule or an ion. Every substance is made of particles.' },
      { k: 'atom',            en: 'atom',            ko: '원자',              zh: '原子',        src: 'Y7 L2', d: 'The smallest particle of an element. Atoms are the building blocks of all matter.' },
      { k: 'element',         en: 'element',         ko: '원소',              zh: '元素（单质）', src: 'Y7 L2', d: 'A pure substance made of only one type of atom. It cannot be broken down into simpler substances. Each element has a chemical symbol, such as O for oxygen.' },
      { k: 'chemical-symbol', en: 'chemical symbol', ko: '원소 기호',         zh: '元素符号',    src: 'Y7 L2', d: 'One or two letters that stand for an element, such as O for oxygen or Na for sodium.' },
      { k: 'bond',            en: 'bond',            ko: '결합',              zh: '化学键',      src: 'Y7 L2', d: 'A force that holds atoms or ions together.' },
      { k: 'molecule',        en: 'molecule',        ko: '분자',              zh: '分子',        src: 'Y7 L2', d: 'A particle made of two or more atoms joined by bonds, such as water (H₂O) or oxygen (O₂).' },
      { k: 'compound',        en: 'compound',        ko: '화합물',            zh: '化合物',      src: 'Y7 L2', d: 'A substance made of two or more different elements chemically joined together, always in the same ratio, such as water (H₂O) or salt (NaCl).' },
      { k: 'ion',             en: 'ion',             ko: '이온',              zh: '离子',        src: 'Y7 L2', d: 'A particle with an electric charge, + or −. Salt is made of sodium ions (+) and chloride ions (−).' },
      { k: 'lattice',         en: 'lattice',         ko: '격자 (결정 격자)',  zh: '晶格',        src: 'Y7 L2', d: 'Particles held in a regular pattern that repeats, as in a crystal of salt.' },
      { k: 'state',           en: 'state of matter', ko: '물질의 상태',       zh: '物质的状态',  also: ['states of matter', 'state'], d: 'The form a substance is in: solid, liquid or gas.' },
      { k: 'solid',           en: 'solid',           ko: '고체',              zh: '固体',        d: 'A state of matter. Its particles are held close together in a regular pattern: they vibrate but stay in place.' },
      { k: 'liquid',          en: 'liquid',          ko: '액체',              zh: '液体',        d: 'A state of matter. Its particles touch and slide past each other, so it flows and takes the shape of its container.' },
      { k: 'gas',             en: 'gas',             ko: '기체',              zh: '气体',        d: 'A state of matter. Its particles are far apart and move fast in all directions; the pull between them is very weak.' },
      { k: 'hydrogen-bond',   en: 'hydrogen bond',   ko: '수소 결합',         zh: '氢键',        d: 'A weak pull between molecules, such as between a hydrogen atom of one water molecule and the oxygen atom of the next. It is much weaker than the bonds inside a molecule. In liquid water it keeps the molecules close while they slide past each other.' }
    ]},
    { g: 'Mixtures', w: [
      { k: 'mixture',         en: 'mixture',         ko: '혼합물',            zh: '混合物',      d: 'Two or more substances that are not chemically joined together. Each keeps its own properties, so you can separate them by physical methods.' },
      { k: 'pure',            en: 'pure substance',  ko: '순물질',            zh: '纯净物',      d: 'Only one substance, with nothing mixed in: one element or one compound.' },
      { k: 'solution',        en: 'solution',        ko: '용액',              zh: '溶液',        d: 'A mixture made when a solute dissolves in a solvent. It looks the same all through: one phase.' },
      { k: 'solute',          en: 'solute',          ko: '용질',              zh: '溶质',        d: 'The substance that dissolves in a solvent.' },
      { k: 'solvent',         en: 'solvent',         ko: '용매',              zh: '溶剂',        d: 'The liquid that a solute dissolves in.' },
      { k: 'dissolve',        en: 'dissolve',        ko: '용해되다 (녹다)',    zh: '溶解',        d: 'To break up into separate particles that spread out between the particles of a solvent, so you can no longer see the solid.' },
      { k: 'soluble',         en: 'soluble',         ko: '녹는 (가용성)',      zh: '可溶的',      d: 'Able to dissolve in a solvent.' },
      { k: 'insoluble',       en: 'insoluble',       ko: '녹지 않는 (불용성)', zh: '不溶的',      d: 'Not able to dissolve in a solvent.' },
      { k: 'saturated',       en: 'saturated solution', ko: '포화 용액',      zh: '饱和溶液',    also: ['saturated'], d: 'A solution in which no more solute can dissolve at that temperature.' },
      { k: 'phase',           en: 'phase',           ko: '상',                zh: '相',          d: 'One part of a mixture that looks the same all through, such as the sand or the water in muddy water.' },
      { k: 'homogeneous',     en: 'homogeneous',     ko: '균일한',            zh: '均一的',      d: 'The same all through: you see only one phase.' },
      { k: 'heterogeneous',   en: 'heterogeneous',   ko: '불균일한',          zh: '不均一的',    d: 'Not the same all through: you see more than one phase.' },
      { k: 'mechanical',      en: 'mechanical mixture', ko: '불균일 혼합물',  zh: '不均一混合物', d: 'A mixture in which you can see more than one phase, such as sand in water.' },
      { k: 'miscible',        en: 'miscible',        ko: '서로 섞이는',       zh: '互溶的',      d: 'Able to mix completely and make one liquid, such as ethanol and water.' },
      { k: 'immiscible',      en: 'immiscible',      ko: '서로 섞이지 않는',  zh: '不互溶的',    d: 'Not able to mix: the liquids form layers, such as oil and water.' },
      { k: 'alloy',           en: 'alloy',           ko: '합금',              zh: '合金',        d: 'A mixture of a metal with other elements, such as brass (copper and zinc). It looks the same all through.' },
      { k: 'colloid',         en: 'colloid',         ko: '콜로이드',          zh: '胶体',        d: 'A mixture with very small droplets or solid pieces spread through a liquid. They do not sink or rise. Milk is a colloid.' },
      { k: 'droplet',         en: 'droplet',         ko: '작은 방울',         zh: '小液滴',      d: 'A very small drop of a liquid.' },
      { k: 'fat',             en: 'fat',             ko: '지방',              zh: '脂肪',        d: 'An oily substance in food, such as butter or olive oil. Milk has tiny droplets of fat.' },
      { k: 'protein',         en: 'protein',         ko: '단백질',            zh: '蛋白质',      d: 'A substance in food that the body uses to grow and repair itself. Egg white, meat and milk contain protein.' },
      { k: 'tyndall',         en: 'Tyndall effect',  ko: '틴들 현상',         zh: '丁达尔效应',  d: 'A beam of light shows as it passes through a colloid, because its tiny droplets or pieces scatter the light.' }
    ]},
    { g: 'Separation methods', w: [
      { k: 'filtration',      en: 'filtration',      ko: '거르기 (여과)',     zh: '过滤',        d: 'Separating an insoluble solid from a liquid with filter paper. The solid stays on the paper; the liquid passes through.' },
      { k: 'evaporation',     en: 'evaporation',     ko: '증발',              zh: '蒸发',        d: 'Heating a solution so the solvent turns into a gas and leaves; the dissolved solid stays behind.' },
      { k: 'crystallisation', en: 'crystallisation', ko: '결정화',            zh: '结晶',        d: 'Making crystals of a dissolved solid: heat the solution until it is saturated, then leave it to cool.' },
      { k: 'distillation',    en: 'simple distillation', ko: '단순 증류',     zh: '蒸馏',        also: ['distillation'], d: 'Boiling a solution and cooling the vapour in a condenser, to collect the pure solvent.' },
      { k: 'fractional',      en: 'fractional distillation', ko: '분별 증류', zh: '分馏',        d: 'Separating miscible liquids with different boiling points. A fractionating column above the flask lets the liquid with the lowest boiling point reach the condenser first.' },
      { k: 'chromatography',  en: 'chromatography',  ko: '크로마토그래피',    zh: '色谱法（层析法）', d: 'Separating the dissolved substances in a mixture, such as the dyes in an ink, as a solvent moves up paper.' },
      { k: 'decanting',       en: 'decanting',       ko: '기울여 따르기',     zh: '倾析',        d: 'Pouring the top liquid slowly into another container, leaving the solid or the lower liquid behind.' },
      { k: 'funnel-sep',      en: 'separating funnel', ko: '분별 깔때기',     zh: '分液漏斗',    d: 'Glassware with a tap at the bottom, for separating immiscible liquids.' },
      { k: 'sieve',           en: 'sieve',           ko: '체',                zh: '筛子',        d: 'A mesh that lets small pieces fall through and keeps big pieces.' },
      { k: 'magnet',          en: 'magnet',          ko: '자석',              zh: '磁铁',        d: 'An object that attracts iron, steel, nickel and cobalt.' }
    ]},
    { g: 'Apparatus', w: [
      { k: 'filter-paper',    en: 'filter paper',    ko: '거름종이',          zh: '滤纸',        d: 'Paper with tiny holes. A liquid passes through; bigger solid pieces stay on it.' },
      { k: 'funnel',          en: 'funnel',          ko: '깔때기',            zh: '漏斗',        d: 'A cone of glass or plastic that guides a liquid into a narrow opening.' },
      { k: 'beaker',          en: 'beaker',          ko: '비커',              zh: '烧杯',        d: 'A glass container with straight sides and a lip for pouring.' },
      { k: 'flask',           en: 'round-bottomed flask', ko: '둥근바닥 플라스크', zh: '圆底烧瓶', d: 'A glass flask with a round bottom and a narrow neck, heated evenly in distillation.' },
      { k: 'conical-flask',   en: 'conical flask',   ko: '삼각 플라스크',     zh: '锥形瓶',      d: 'A glass flask shaped like a cone, with a narrow neck.' },
      { k: 'basin',           en: 'evaporating basin', ko: '증발 접시',       zh: '蒸发皿',      d: 'A shallow dish that can be heated, for evaporating a liquid.' },
      { k: 'bunsen',          en: 'Bunsen burner',   ko: '분젠 버너',         zh: '本生灯',      d: 'A gas burner that heats things in the laboratory.' },
      { k: 'glass-rod',       en: 'glass rod',       ko: '유리 막대',         zh: '玻璃棒',      d: 'A thin glass stick, for stirring or for guiding a liquid as you pour.' },
      { k: 'condenser',       en: 'condenser',       ko: '냉각기',            zh: '冷凝管',      d: 'A glass tube cooled by cold water around it. It turns a vapour back into a liquid.' },
      { k: 'thermometer',     en: 'thermometer',     ko: '온도계',            zh: '温度计',      d: 'An instrument that measures temperature.' }
    ]},
    { g: 'Results', w: [
      { k: 'residue',         en: 'residue',         ko: '거르고 남은 것 (잔류물)', zh: '滤渣',   d: 'The solid left on the filter paper.' },
      { k: 'filtrate',        en: 'filtrate',        ko: '거른 액체 (여과액)', zh: '滤液',       d: 'The liquid that passes through the filter paper.' },
      { k: 'crystal',         en: 'crystal',         ko: '결정',              zh: '晶体',        d: 'A solid with flat faces and straight edges. Its particles are held in a lattice.' },
      { k: 'distillate',      en: 'distillate',      ko: '증류액',            zh: '馏出液',      d: 'The pure liquid collected after distillation.' },
      { k: 'vapour',          en: 'vapour',          ko: '증기',              zh: '蒸气',        d: 'The gas of a substance that is usually a liquid at room temperature. Steam is water vapour.' },
      { k: 'chromatogram',    en: 'chromatogram',    ko: '크로마토그램',      zh: '色谱图',      d: 'The pattern of spots on the paper after chromatography.' },
      { k: 'baseline',        en: 'start line',      ko: '출발선 (기준선)',   zh: '起始线',      d: 'The pencil line near the bottom of the paper, where the spots are put.' },
      { k: 'solvent-front',   en: 'solvent front',   ko: '용매 전선',         zh: '溶剂前沿',    d: 'The line the solvent has reached at the top of its path up the paper.' },
      { k: 'stationary',      en: 'stationary phase', ko: '고정상',           zh: '固定相',      d: 'The part that does not move: in paper chromatography, the paper.' },
      { k: 'mobile',          en: 'mobile phase',    ko: '이동상',            zh: '流动相',      d: 'The part that moves: in paper chromatography, the solvent.' },
      { k: 'rf',              en: 'Rf value',        ko: 'Rf 값',             zh: '比移值（Rf值）', d: 'Distance moved by a dye ÷ distance moved by the solvent, both from the start line. It has no unit.' },
      { k: 'dye',             en: 'dye',             ko: '염료 (색소)',       zh: '染料',        d: 'A coloured substance. An ink is often a mixture of dyes.' }
    ]},
    { g: 'Properties', w: [
      { k: 'size',            en: 'size',            ko: '크기',              zh: '大小',        d: 'How big the particles or pieces are.' },
      { k: 'solubility',      en: 'solubility',      ko: '용해도',            zh: '溶解度',      d: 'How much of a substance can dissolve in a certain amount of a solvent.' },
      { k: 'volatility',      en: 'volatility',      ko: '휘발성',            zh: '挥发性',      d: 'How easily a substance turns into a gas.' },
      { k: 'boiling-point',   en: 'boiling point',   ko: '끓는점',            zh: '沸点',        d: 'The temperature at which a liquid boils.' },
      { k: 'density',         en: 'density',         ko: '밀도',              zh: '密度',        d: 'How much mass there is in a certain volume. A less dense liquid floats on a denser one.' },
      { k: 'magnetism',       en: 'magnetism',       ko: '자성',              zh: '磁性',        d: 'Being attracted by a magnet. Iron, steel, nickel and cobalt are magnetic.' },
      { k: 'affinity',        en: 'affinity',        ko: '친화력',            zh: '亲和力',      d: 'How strongly a substance is attracted to something: to the paper or to the solvent.' }
    ]},
    { g: 'Doing words', w: [
      { k: 'boil',            en: 'boil',            ko: '끓다',              zh: '沸腾',        d: 'To turn into a gas all through the liquid, with bubbles, at the boiling point.' },
      { k: 'evaporate',       en: 'evaporate',       ko: '증발하다',          zh: '蒸发',        d: 'To change from a liquid into a gas. It happens at the surface; heating makes it faster.' },
      { k: 'condense',        en: 'condense',        ko: '액화하다 (응결하다)', zh: '冷凝（液化）', d: 'To change from a gas into a liquid when cooled.' },
      { k: 'heat',            en: 'heat',            ko: '가열하다',          zh: '加热',        d: 'To make something hotter.' },
      { k: 'cool',            en: 'cool',            ko: '식히다 (냉각하다)', zh: '冷却',        d: 'To make something colder, or to become colder.' },
      { k: 'separate',        en: 'separate',        ko: '분리하다',          zh: '分离',        link: false, d: 'To take the parts of a mixture away from each other.' },
      { k: 'attract',         en: 'attract',         ko: '끌어당기다',        zh: '吸引',        d: 'To pull something towards itself, as a magnet pulls iron.' },
      { k: 'float',           en: 'float',           ko: '뜨다',              zh: '漂浮',        d: 'To stay on the top of a liquid.' },
      { k: 'settle',          en: 'settle',          ko: '가라앉다',          zh: '沉降',        d: 'To sink slowly to the bottom of a liquid and stay there.' }
    ]}
  ];
  const BY = {};
  G.forEach(g => g.w.forEach(w => { w.g = g.g; BY[w.k] = w; }));
  /* the forms of a word that link to it inside a definition: the word, its plural, and for a doing word its other forms
     (a phrase changes only its last word: "boiling points", "chemical symbols"), and any other form it lists in also */
  function forms(w) {
    const parts = w.en.split(' '), last = parts.pop(), head = parts.length ? parts.join(' ') + ' ' : '';
    const ends = new Set([last, last + 's', last + 'es', last.replace(/y$/, 'ies'), last + 'd', last + 'ed', last.replace(/e$/, '') + 'ing', last + 'ing', last.replace(/e$/, '') + 'ed']);
    return Array.from(ends).map(e => head + e).concat(w.also || []).sort((a, b) => b.length - a.length);
  }
  /* a definition cut into words and links: [text, key or null], each key at most once; longest names first */
  function links(d, has, self) {
    const cands = [];
    Object.keys(BY).forEach(k => { const w = BY[k]; if (k === self || w.link === false || (has && !has(k))) return; forms(w).forEach(f => cands.push([f, k])); });
    cands.sort((a, b) => b[0].length - a[0].length);
    const out = [], used = new Set();
    let rest = d;
    for (;;) {
      let best = null;
      for (const [f, k] of cands) {
        if (used.has(k)) continue;
        const m = new RegExp('(^|[^A-Za-z])(' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![A-Za-z])', 'i').exec(rest);
        if (m && (!best || m.index + m[1].length < best.at || (m.index + m[1].length === best.at && m[2].length > best.len))) best = { at: m.index + m[1].length, len: m[2].length, k };
      }
      if (!best) { if (rest) out.push([rest, null]); return out; }
      if (best.at) out.push([rest.slice(0, best.at), null]);
      out.push([rest.substr(best.at, best.len), best.k]); used.add(best.k);
      rest = rest.slice(best.at + best.len);
    }
  }
  const api = { groups: G, by: BY, forms, links };
  if (typeof window !== 'undefined') window.KS3_GLOSSARY = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
