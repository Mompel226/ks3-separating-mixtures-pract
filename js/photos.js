/* ============================================================
   photos.js — a real photograph for each bench (15 Oct 2026, Daniel: "provide a toggle to see real images of all of this
   setups/apparatus, students need to know what they look like in real life"). Shown by the 📷 Real photo switch above
   the bench, keyed by the scene's id. Every picture is from Wikimedia Commons, approved by Daniel on 15 Oct 2026:
   public domain, CC0 or CC BY, and one CC BY-SA (filtration: no CC BY photo of gravity filtration exists). The files are
   resized copies in img/photos/; img/photos/CREDITS.json records each source.
   ============================================================ */
window.PHOTOS = {
  filter: { src: 'img/photos/filtration.jpg', alt: 'A glass funnel with pleated filter paper, held in a ring on a stand above a round flask standing on a cork ring.',
    caption: 'Filtration in a real lab: filter paper in a funnel, held over a flask.', credit: 'David Rouzek', licence: 'CC BY-SA 4.0',
    href: 'https://commons.wikimedia.org/wiki/File:Filtra%C4%8Dn%C3%AD_aparatura.jpg' },
  evap: { src: 'img/photos/evaporating-basins.jpg', alt: 'Two white porcelain evaporating basins, each with a small lip for pouring.',
    caption: 'Evaporating basins: white porcelain dishes that can be heated.', credit: 'Lysippos', licence: 'CC0',
    href: 'https://commons.wikimedia.org/wiki/File:Abdampfschalen,_porzellan_innen_glasiert.jpg' },
  cryst: { src: 'img/photos/copper-sulfate-crystals.jpg', alt: 'Large, clear, bright blue crystals of copper sulfate with flat faces and straight edges.',
    caption: 'Copper sulfate crystals grown from a solution.', credit: 'Дарья Могилевцева', licence: 'CC BY 4.0',
    href: 'https://commons.wikimedia.org/wiki/File:%D0%A1opper_sulfate_crystals_IMG_6330%D0%BE%D0%B1%D1%80_01.jpg' },
  simple: { src: 'img/photos/distillation.jpg', alt: 'A distillation set-up on a lab bench: a round flask sits in a blue electric heater; a glass tube leads from its neck into a long, sloping condenser held by a clamp on a stand; two rubber tubes carry cold water to and from the condenser; the distilled liquid drips into a beaker at the far end.',
    caption: 'Distillation in a real lab: the heater boils the liquid in the flask, the condenser cools the vapour, and the pure liquid drips into the beaker.', credit: 'Arlen (derivative work: Mario Link)', licence: 'CC BY 2.0',
    href: 'https://commons.wikimedia.org/wiki/File:Distillation_2-3.jpg' },
  frac: { src: 'img/photos/fractional-distillation.jpg', alt: 'Fractional distillation apparatus on a lab bench: a heated flask, a tall glass column above it, a thermometer and a condenser.',
    caption: 'Fractional distillation: the tall glass column sits between the flask and the condenser.', credit: 'Chemie-Verbände Baden-Württemberg', licence: 'CC BY 2.0',
    href: 'https://commons.wikimedia.org/wiki/File:Fraktionierte_Destillation_-_Laboratory_Fractional_distillation_apparatus.jpg' },
  chrom: { src: 'img/photos/chromatogram.jpg', alt: 'A sheet of chromatography paper hangs from a wooden stick into a beaker with a little water at the bottom. Four inks, spotted on a pencil line, have spread up the paper as smeared streaks of blue, pink, purple and orange.',
    caption: 'Real chromatograms: the dyes spread up the paper as smeared streaks, not neat spots.', credit: 'Pbak4622', licence: 'CC BY 4.0',
    href: 'https://commons.wikimedia.org/wiki/File:Paper_Chromatography_1.jpg' },
  decant: { src: 'img/photos/decanting-1850s.jpg', alt: 'An old engraving: two hands pour liquid from a beaker down a glass rod into another beaker, leaving the solid behind.',
    caption: 'Decanting along a glass rod, drawn in a chemistry book of the 1850s. The method is the same today.', credit: 'F. Mohr and T. Redwood, Practical Pharmacy', licence: 'public domain',
    href: 'https://commons.wikimedia.org/wiki/File:Decantation_with_a_Guiding-Rod.png' },
  funnel: { src: 'img/photos/separating-funnel.jpg', alt: 'A hand holds a separating funnel with two liquid layers, a darker yellow band on top of a paler liquid, above a blue tap.',
    caption: 'A separating funnel holding two liquids that do not mix: you can see the boundary between the two layers.', credit: 'Wikimedia Commons', licence: 'public domain',
    href: 'https://commons.wikimedia.org/wiki/File:Separatory_funnel.jpg' },
  magnet: { src: 'img/photos/scrap-magnet.jpg', alt: 'An electromagnet hangs from an overhead crane above huge piles of scrap steel at a steel works.',
    caption: 'An electromagnet on a crane lifts scrap steel at a steel works (USA, 1942).', credit: 'Alfred T. Palmer', licence: 'public domain',
    href: 'https://commons.wikimedia.org/wiki/File:Allegheny_Ludlum_Steel_Corp_Scrap_Piles.jpg' },
  sieve: { src: 'img/photos/sieving-soil.jpg', alt: 'A wire-mesh sieve leaning over a white tub: fine compost has fallen through the mesh into the tub; lumps stay on top.',
    caption: 'Sieving compost: the fine soil falls through the mesh; the big lumps stay on top.', credit: 'SuSanA Secretariat', licence: 'CC BY 2.0',
    href: 'https://commons.wikimedia.org/wiki/File:Sieving_the_compost_with_a_coarse_sieve_(8915941421).jpg' }
};
