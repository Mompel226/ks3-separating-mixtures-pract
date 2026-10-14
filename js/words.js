/* ============================================================
   words.js — the page's ONE word bank (Separating mixtures, KS3 Year 7, 15 Oct 2026).
   Daniel, 15 Oct 2026: "add the word bank … the word bank should have translations to Chinese and Korean … they're
   year sevens and I have Chinese and Korean students. Make sure that the words are accurate."
   Every word a pupil types on the page is here, among others (one general list, never per question, never numbers).
   ko: the word used in Korean school science; zh: Simplified Chinese, as in mainland school chemistry (the same script as
   Bio English). d: a short meaning in plain English, shown when a key word on the page is pressed.
   ============================================================ */
window.WORDS = [
  { g: 'Mixtures', w: [
    { k: 'mixture',          en: 'mixture',          ko: '혼합물',            zh: '混合物',      d: 'Two or more substances that are not chemically joined together.' },
    { k: 'pure',             en: 'pure substance',   ko: '순물질',            zh: '纯净物',      d: 'A substance with only one kind of particle: one element or one compound.' },
    { k: 'element',          en: 'element',          ko: '원소',              zh: '元素（单质）', d: 'A substance made of only one kind of atom.' },
    { k: 'compound',         en: 'compound',         ko: '화합물',            zh: '化合物',      d: 'A substance made of atoms of different elements chemically joined together.' },
    { k: 'particle',         en: 'particle',         ko: '입자',              zh: '粒子',        d: 'A very small piece of matter, such as an atom or a molecule.' },
    { k: 'solution',         en: 'solution',         ko: '용액',              zh: '溶液',        d: 'A mixture made when a solute dissolves in a solvent. You see only one phase.' },
    { k: 'solute',           en: 'solute',           ko: '용질',              zh: '溶质',        d: 'The substance that dissolves.' },
    { k: 'solvent',          en: 'solvent',          ko: '용매',              zh: '溶剂',        d: 'The liquid that does the dissolving.' },
    { k: 'dissolve',         en: 'dissolve',         ko: '용해되다 (녹다)',    zh: '溶解',        d: 'To spread out as separate particles in a liquid, so you can no longer see the solid.' },
    { k: 'soluble',          en: 'soluble',          ko: '녹는 (가용성)',      zh: '可溶的',      d: 'Able to dissolve in a solvent.' },
    { k: 'insoluble',        en: 'insoluble',        ko: '녹지 않는 (불용성)', zh: '不溶的',      d: 'Not able to dissolve in a solvent.' },
    { k: 'saturated',        en: 'saturated solution', ko: '포화 용액',       zh: '饱和溶液',    d: 'A solution in which no more solute can dissolve at that temperature.' },
    { k: 'phase',            en: 'phase',            ko: '상',                zh: '相',          d: 'One part of a mixture that looks the same all through it.' },
    { k: 'homogeneous',      en: 'homogeneous',      ko: '균일한',            zh: '均一的',      d: 'The same all through: you see only one phase.' },
    { k: 'heterogeneous',    en: 'heterogeneous',    ko: '불균일한',          zh: '不均一的',    d: 'Not the same all through: you see more than one phase.' },
    { k: 'mechanical',       en: 'mechanical mixture', ko: '불균일 혼합물',   zh: '不均一混合物', d: 'A mixture in which you can see more than one phase, such as sand in water.' },
    { k: 'miscible',         en: 'miscible',         ko: '서로 섞이는',       zh: '互溶的',      d: 'Liquids that mix completely, such as ethanol and water.' },
    { k: 'immiscible',       en: 'immiscible',       ko: '서로 섞이지 않는',  zh: '不互溶的',    d: 'Liquids that do not mix and form layers, such as oil and water.' },
    { k: 'alloy',            en: 'alloy',            ko: '합금',              zh: '合金',        d: 'A mixture of a metal with other elements, such as brass (copper and zinc).' },
    { k: 'colloid',          en: 'colloid',          ko: '콜로이드',          zh: '胶体',        d: 'A mixture with very small droplets or bits spread through a liquid. The bits do not settle. Milk is a colloid.' }
  ]},
  { g: 'Methods', w: [
    { k: 'filtration',       en: 'filtration',       ko: '거르기 (여과)',     zh: '过滤',        d: 'Separating an insoluble solid from a liquid with filter paper.' },
    { k: 'evaporation',      en: 'evaporation',      ko: '증발',              zh: '蒸发',        d: 'Heating a solution so the liquid turns into a gas and leaves the dissolved solid.' },
    { k: 'crystallisation',  en: 'crystallisation',  ko: '결정화',            zh: '结晶',        d: 'Making crystals: heat a solution until it is saturated, then let it cool.' },
    { k: 'distillation',     en: 'simple distillation', ko: '단순 증류',      zh: '蒸馏',        d: 'Boiling a solution and cooling the vapour, to collect the pure solvent.' },
    { k: 'fractional',       en: 'fractional distillation', ko: '분별 증류',  zh: '分馏',        d: 'Separating miscible liquids with different boiling points, using a fractionating column.' },
    { k: 'chromatography',   en: 'chromatography',   ko: '크로마토그래피',    zh: '色谱法（层析法）', d: 'Separating the dissolved substances in a mixture, such as the dyes in an ink.' },
    { k: 'decanting',        en: 'decanting',        ko: '기울여 따르기',     zh: '倾析',        d: 'Pouring the top liquid slowly into another container, leaving the solid or the lower liquid behind.' },
    { k: 'funnel-sep',       en: 'separating funnel', ko: '분별 깔때기',      zh: '分液漏斗',    d: 'Glassware with a tap, for separating immiscible liquids.' },
    { k: 'sieve',            en: 'sieve',            ko: '체',                zh: '筛子',        d: 'A mesh that lets small pieces fall through and keeps big pieces.' },
    { k: 'magnet',           en: 'magnet',           ko: '자석',              zh: '磁铁',        d: 'An object that attracts iron, steel, nickel and cobalt.' }
  ]},
  { g: 'Apparatus', w: [
    { k: 'filter-paper',     en: 'filter paper',     ko: '거름종이',          zh: '滤纸',        d: 'Paper with tiny holes. Liquid passes through; bigger solid pieces stay on it.' },
    { k: 'funnel',           en: 'funnel',           ko: '깔때기',            zh: '漏斗',        d: 'A cone of glass or plastic that guides a liquid into a narrow opening.' },
    { k: 'beaker',           en: 'beaker',           ko: '비커',              zh: '烧杯',        d: 'A glass container with straight sides and a lip for pouring.' },
    { k: 'flask',            en: 'round-bottomed flask', ko: '둥근바닥 플라스크', zh: '圆底烧瓶', d: 'A glass flask with a round bottom and a narrow neck, heated evenly in distillation.' },
    { k: 'conical-flask',    en: 'conical flask',    ko: '삼각 플라스크',     zh: '锥形瓶',      d: 'A glass flask shaped like a cone, with a narrow neck.' },
    { k: 'basin',            en: 'evaporating basin', ko: '증발 접시',        zh: '蒸发皿',      d: 'A shallow dish that can be heated, for evaporating a liquid.' },
    { k: 'bunsen',           en: 'Bunsen burner',    ko: '분젠 버너',         zh: '本生灯',      d: 'A gas burner that heats things in the laboratory.' },
    { k: 'glass-rod',        en: 'glass rod',        ko: '유리 막대',         zh: '玻璃棒',      d: 'A thin glass stick, for stirring or for guiding a liquid as you pour.' },
    { k: 'condenser',        en: 'condenser',        ko: '냉각기',            zh: '冷凝管',      d: 'A glass tube cooled by cold water around it. It turns a vapour back into a liquid.' },
    { k: 'thermometer',      en: 'thermometer',      ko: '온도계',            zh: '温度计',      d: 'An instrument that measures temperature.' }
  ]},
  { g: 'Results', w: [
    { k: 'residue',          en: 'residue',          ko: '거르고 남은 것 (잔류물)', zh: '滤渣',   d: 'The solid left on the filter paper.' },
    { k: 'filtrate',         en: 'filtrate',         ko: '거른 액체 (여과액)', zh: '滤液',       d: 'The liquid that passes through the filter paper.' },
    { k: 'crystal',          en: 'crystal',          ko: '결정',              zh: '晶体',        d: 'A solid with flat faces and straight edges, made when particles line up in a regular pattern.' },
    { k: 'distillate',       en: 'distillate',       ko: '증류액',            zh: '馏出液',      d: 'The pure liquid collected after distillation.' },
    { k: 'vapour',           en: 'vapour',           ko: '증기',              zh: '蒸气',        d: 'A substance in its gas state, made from a liquid. Steam is water vapour.' },
    { k: 'chromatogram',     en: 'chromatogram',     ko: '크로마토그램',      zh: '色谱图',      d: 'The pattern of spots on the paper after chromatography.' },
    { k: 'baseline',         en: 'start line',       ko: '출발선 (기준선)',   zh: '起始线',      d: 'The pencil line at the bottom of the paper, where the spots are put.' },
    { k: 'solvent-front',    en: 'solvent front',    ko: '용매 전선',         zh: '溶剂前沿',    d: 'The line the solvent has reached at the top of its path up the paper.' },
    { k: 'stationary',       en: 'stationary phase', ko: '고정상',            zh: '固定相',      d: 'The part that does not move: in paper chromatography, the paper.' },
    { k: 'mobile',           en: 'mobile phase',     ko: '이동상',            zh: '流动相',      d: 'The part that moves: in paper chromatography, the solvent.' },
    { k: 'dye',              en: 'dye',              ko: '염료 (색소)',       zh: '染料',        d: 'A coloured substance. An ink is often a mixture of dyes.' }
  ]},
  { g: 'Properties', w: [
    { k: 'size',             en: 'size',             ko: '크기',              zh: '大小',        d: 'How big the particles or pieces are.' },
    { k: 'solubility',       en: 'solubility',       ko: '용해도',            zh: '溶解度',      d: 'How much of a substance can dissolve in a solvent.' },
    { k: 'volatility',       en: 'volatility',       ko: '휘발성',            zh: '挥发性',      d: 'How easily a substance turns into a gas.' },
    { k: 'boiling-point',    en: 'boiling point',    ko: '끓는점',            zh: '沸点',        d: 'The temperature at which a liquid boils.' },
    { k: 'density',          en: 'density',          ko: '밀도',              zh: '密度',        d: 'How much mass is packed into a volume. A less dense liquid floats on a denser one.' },
    { k: 'magnetism',        en: 'magnetism',        ko: '자성',              zh: '磁性',        d: 'Being attracted by a magnet. Iron, steel, nickel and cobalt are magnetic.' },
    { k: 'affinity',         en: 'affinity',         ko: '친화력',            zh: '亲和力',      d: 'How strongly a substance is attracted to something: to the paper or to the solvent.' }
  ]},
  { g: 'Doing words', w: [
    { k: 'boil',             en: 'boil',             ko: '끓다',              zh: '沸腾',        d: 'To turn into a gas all through the liquid, with bubbles, at the boiling point.' },
    { k: 'evaporate',        en: 'evaporate',        ko: '증발하다',          zh: '蒸发',        d: 'To change from a liquid into a gas. It happens at the surface; heating makes it faster.' },
    { k: 'condense',         en: 'condense',         ko: '액화하다 (응결하다)', zh: '冷凝（液化）', d: 'To change from a gas into a liquid when cooled.' },
    { k: 'heat',             en: 'heat',             ko: '가열하다',          zh: '加热',        d: 'To make something hotter.' },
    { k: 'cool',             en: 'cool',             ko: '식히다 (냉각하다)', zh: '冷却',        d: 'To make something colder, or to become colder.' },
    { k: 'separate',         en: 'separate',         ko: '분리하다',          zh: '分离',        d: 'To take the parts of a mixture away from each other.' },
    { k: 'attract',          en: 'attract',          ko: '끌어당기다',        zh: '吸引',        d: 'To pull something towards itself, as a magnet pulls iron.' },
    { k: 'float',            en: 'float',            ko: '뜨다',              zh: '漂浮',        d: 'To stay on the top of a liquid.' },
    { k: 'settle',           en: 'settle',           ko: '가라앉다',          zh: '沉降',        d: 'To sink slowly to the bottom of a liquid and stay there.' }
  ]}
];
