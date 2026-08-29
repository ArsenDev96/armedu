import type { ArticleSummary } from "@/data/types";

/**
 * Registry of the artwork shipped in `public/images/`, keyed by content slug.
 *
 * Slugs are shared across every edition (they are Latin by design), so one
 * registry serves all three locales — only the alt text and caption, which come
 * from the locale's `UiDictionary`, differ per edition.
 *
 * Kept here rather than in the content files for two reasons: the same slug is
 * rendered as an article, a writer card and a search hit, and repeating the path
 * in three locale bundles is three chances to typo it. `validate:content`
 * asserts that every entry below exists on disk and matches a real slug.
 *
 * Two filenames deliberately differ from their slug — `first-republic-armenia`
 * and `mesrop-mashtots` — which is exactly why this is an explicit map and not a
 * `/images/${category}/${slug}.webp` convention.
 *
 * The cuisine artwork arrived with one file misspelled (`lavalsh.webp`). It was
 * renamed rather than mapped: the other five match their slug exactly, so the
 * two exceptions above stay the only ones, and a typo recorded here would read
 * as a deliberate difference the next time someone edits this file.
 *
 * The extensions are not a convention either. Everything here is WebP except the
 * places artwork, which is PNG — another reason the paths are written out in
 * full rather than derived from the slug.
 */
const IMAGES: Record<string, string> = {
  // History
  "kingdom-of-urartu": "/images/history/kingdom-of-urartu.webp",
  "tigran-the-great": "/images/history/tigran-the-great.webp",
  "mesrop-mashtots-armenian-alphabet": "/images/history/mesrop-mashtots.webp",
  "adoption-of-christianity": "/images/history/adoption-of-christianity.webp",
  "battle-of-avarayr": "/images/history/battle-of-avarayr.webp",
  "bagratid-armenia": "/images/history/bagratid-armenia.webp",
  "first-republic-of-armenia": "/images/history/first-republic-armenia.webp",

  // Writers
  "hovhannes-tumanyan": "/images/writers/hovhannes-tumanyan.webp",
  "yeghishe-charents": "/images/writers/yeghishe-charents.webp",
  raffi: "/images/writers/raffi.webp",
  "avetik-isahakyan": "/images/writers/avetik-isahakyan.webp",
  "khachatur-abovyan": "/images/writers/khachatur-abovyan.webp",
  "paruyr-sevak": "/images/writers/paruyr-sevak.webp",
  /*
   * §82. Narekatsi, and the first portrait in this section of a subject nobody
   * has ever seen.
   *
   * The §81 commission is not repeated here, because what it asked for is now a
   * fact about a file. What it got: a hooded dark mantle over an oxblood tunic,
   * bare stone, an open codex on wooden boards with hand-cut vellum, rubricated
   * openings and an illuminated initial, a second codex closed on the table and a
   * third on a lectern, an inkpot, and a window onto a lake ringed with snow under
   * an Armenian church on a polygonal drum with a conical cap. It reads as a man
   * at work on a manuscript. That was the whole point.
   *
   * The four things §81 said would make it wrong are all absent: no halo, no
   * frontal blessing pose, no iconographic frame; no Roman Catholic vesture and
   * nothing that imports 2015 into the tenth century; no printed page; and the
   * treatment is painterly rather than a pseudo-photograph. The quill got its own
   * paragraph in the commission and its own check here — what lies on the table is
   * a reed with an obliquely cut nib, not a goose feather, which is also what
   * separates it at a glance from `khachatur-abovyan.webp`, the named near miss,
   * whose subject holds a quill upright over paper.
   *
   * Four reservations, recorded because accepting a file quietly is how a defect
   * becomes a fact:
   *
   *   - **1585x992.** Every other writer portrait is 1586x992. One pixel, no
   *     consequence at any rendered size, but this is the first geometry drift in
   *     the section and the next one should be measured against 1586, not against
   *     this.
   *   - **The pseudo-script is legible-looking.** The sheet pinned to the back
   *     wall carries nine lines that resolve into distinct glyphs under
   *     magnification without spelling anything; the lectern codex does the same,
   *     smaller. Nothing readable appears anywhere — no title, no name, no
   *     Armenian word — so it stays. But it is the most synthetic region in the
   *     file, and if a future portrait puts invented script under better light
   *     than this, that is the point to refuse it.
   *   - **The shelved volumes stand upright, spine out.** Armenian monastic
   *     libraries of this period stored codices flat, in chests and boxes; ranked
   *     vertical spines are a later European library convention. They are
   *     hand-bound leather over board rather than modern books, so this is an
   *     anachronism of practice, not of object.
   *   - **He is bare-headed.** An Armenian monastic would ordinarily be shown in a
   *     veghar or with the hood raised. The loose hair is a liberty.
   *
   * None of these touch what the article argues. The picture says writer before it
   * says saint, and that is the one thing it had to do.
   */
  "grigor-narekatsi": "/images/writers/grigor-narekatsi.webp",

  /*
   * §85. Varoujan — the eighth writer, the first portrait in this archive of a
   * subject who was *photographed*, and the first asset ever refused and
   * corrected rather than accepted or replaced wholesale.
   *
   * **The refusal, kept because deleting it would delete the reason for the
   * caption below.** The first delivery passed every gate this registry has —
   * likeness, dress, hands, setting, crops, thumbnail — and failed the text gate
   * outright. It carried a wall broadside reading `ԼԱ ՊԱՏՐԻԻ` over `LA PATRIE`
   * over three lines of bold pseudo-Armenian over `Constantinople, 1913`, and a
   * desk newspaper mastheaded `MASSIS`. That is fake Armenian, fake French, a
   * fabricated imprint, and the name of a real Constantinople periodical on an
   * invented front page — all four of the things §15 of that step forbids, at
   * display size, in the brightest region of the frame, legible on the article
   * hero without magnification. §82 had already named this exact trigger: it
   * accepted Narekatsi's pseudo-script *only* because nothing there was readable,
   * and said that a future portrait putting invented script under better light
   * was the point to refuse. It was.
   *
   * **The correction.** Rather than regenerate — which would have thrown away a
   * likeness verified against three lifetime photographs to fix two background
   * rectangles — the two text regions were reconstructed in place. A grayscale
   * morphological closing estimates the paper with the ink gone; a mask fires
   * only where the original is markedly darker than that estimate, so real paper
   * texture, tone and lighting survive and only ink pixels are replaced. A
   * pixel diff against the original confirmed exactly two changed clusters,
   * (1248,0)-(1503,287) and (32,640)-(255,767), 4.20 per cent of the frame, with
   * the face, the raised hand, the torso, the window, the desk and the framed
   * photograph all byte-identical. The wall sheet is now blank aged paper with
   * foxing; the newspaper is blank period paper with its engraved plate intact.
   * Nothing was substituted for either title.
   *
   * **The file.** 1586x992 — the house geometry exactly, reached by a uniform
   * 1.00126x resample of the corrected 1584x993 and a two-row trim, so no axis
   * was stretched independently. 153,012 bytes, SHA-256
   * 592a3aeae369b0e82382c4d1835d3033bf181b0311345a8c91501b4377efe05f. Plain
   * `RIFF/WEBP` -> `VP8 `: one lossy keyframe, sync 9D 01 2A, no `VP8X` and so no
   * ICC, alpha, EXIF, XMP or animation, no orientation tag, walk ending exactly
   * at EOF. Verified twice, by a hand-written RIFF walk and by `sharp`. Re-encode
   * fidelity in the face measured 43.1 dB PSNR against the lossless intermediate.
   * The predecessor's hash was 7fa087b7d29b600ba2576b4e4a9c26f19158ed0e86346e58e3b07fe76dd2664b;
   * it is recorded because nothing in the code can tell two files at one path
   * apart, which §61 learned the hard way.
   *
   * **What is in the frame.** The living poet at about thirty, three-quarter to
   * the left with the index finger raised to the cheek — which is the attitude of
   * two of the surviving photographs rather than an invention. Dark side-parted
   * hair, the full moustache, a tall white standing collar, dark cravat,
   * waistcoat with a watch chain, dark jacket. A desk of manuscripts, a fountain
   * pen, an inkwell, bound books, a shelf, framed photographs, and a window onto
   * the Golden Horn with the Galata Tower. Nothing of 1915 is in it: no arrest,
   * no deportation, no violence, no mourning, no candle, no commemoration. He was
   * murdered at thirty-one and this picture shows the man who wrote four books.
   *
   * **Why this entry has its own provenance.** Everything else in `IMAGES` is
   * captioned an imagined likeness, which is exactly right for Narekatsi and
   * false here: photographs of Varoujan survive and the artwork was made from
   * them. `PORTRAIT_PROVENANCE` below exists for that one distinction and holds
   * only this slug.
   *
   * Two things to know rather than rediscover. The book spines carry worn gilt
   * marks that resolve into no word at any rendered size, and the manuscript
   * pages carry unreadable cursive — both were left, as §82 left Narekatsi's.
   * And the newspaper's blank upper page is the correction's one visible
   * compromise: it reads as a faded sheet rather than as print.
   */
  "daniel-varoujan": "/images/writers/daniel-varoujan.webp",

  // Literary works
  anush: "/images/works/anush.webp",
  "david-of-sassoun": "/images/works/david-of-sassoun.webp",
  "wounds-of-armenia": "/images/works/wounds-of-armenia.webp",
  "the-fool": "/images/works/the-fool.webp",

  // Cuisine
  lavash: "/images/cuisine/lavash.webp",
  dolma: "/images/cuisine/dolma.webp",
  khorovats: "/images/cuisine/khorovats.webp",
  harissa: "/images/cuisine/harissa.webp",
  gata: "/images/cuisine/gata.webp",
  ghapama: "/images/cuisine/ghapama.webp",

  /*
   * §69. Spas — the first Cuisine cover this archive has put through the artwork
   * gate, because it is the first Cuisine article that ever shipped without one.
   *
   * 1586×992, 198 KB (203,194 bytes), a single lossy `VP8 ` chunk with no VP8X
   * extension, and therefore no alpha, no ICC profile, no EXIF and no XMP. Verified
   * twice, by a hand-written RIFF chunk walk and by `sharp`, which agree on every
   * field. Registered exactly as delivered: unaltered, uncropped, unoptimised,
   * unrenamed. The geometry is `lavash.webp`'s exactly and is the archive's dominant
   * one; the other five cuisine covers are 1448×1086 or 1536×1024, so this adds no
   * new ratio.
   *
   * **What is in the frame, and it is the dish.** A wide shallow stoneware bowl,
   * unglazed pale grey with a hand-painted band of blue leaf motifs low on the wall,
   * standing on a striped linen cloth on a bare wood table. The bowl holds a white,
   * faintly green-flecked soup, thin enough that the level and the meniscus against
   * the bowl wall are both visible, with plump cooked whole grains suspended through
   * it rather than settled under it, chopped dill worked through, and cut scallion
   * greens. A carved wooden spoon lies on the cloth at the left, a small plate of
   * fresh dill and spring onions sits behind, and a torn wheat loaf lies to the
   * right. Daylight, cool, from the left.
   *
   * **The harissa test, which is the one that mattered.** The §68 note beside this
   * slug's pending entry predicted the failure precisely — a pale grain-and-liquid
   * dish, photographed from above, in a bowl on a rustic table, is what both dishes
   * are — and the file avoids it on every axis the note named. Harissa is opaque,
   * stiff, beige, glossed with butter, threaded with chicken, and lit by an open
   * hearth. This is fluid, white, cool-lit, herbed, and has no fire in it. Held side
   * by side at the 16:9 card width and again at the 160px search thumbnail, the two
   * do not resemble each other at all: the harissa card reads dark amber, this one
   * reads white and green. The distinction survives the smallest crop the site
   * renders, which is the condition §69 set.
   *
   * One thing the file does not carry: the bread beside the bowl is a crusty wheat
   * loaf, not lavash. The article links to `lavash` as what spas is eaten with, so
   * the cover and the prose point at slightly different breads. It is background at
   * every crop and no claim rests on it — recorded as minor debt rather than treated
   * as a subject error.
   */
  spas: "/images/cuisine/spas.webp",

  /*
   * §71. Jingalov hats — and the first cover in this archive whose acceptance
   * turned on a single compositional decision rather than on subject accuracy.
   *
   * 1586×992, 190 KB (194,240 bytes), a single lossy `VP8 ` chunk with no VP8X
   * extension, and therefore no alpha, no ICC profile, no EXIF and no XMP. Verified
   * twice, by a hand-written RIFF chunk walk and by `sharp`, which agree on every
   * field. Registered exactly as delivered: unaltered, uncropped, unoptimised,
   * unrenamed. The geometry is `lavash.webp`'s and `spas.webp`'s exactly.
   *
   * **What is in the frame.** A round flatbread on a wooden board, cut across the
   * middle, with the two halves separated and the upper one pulled back — so both
   * cut faces are open to the camera. Between two very thin sheets of pale dough,
   * blistered gold and scorched in places, sits a thick dense layer of chopped
   * greens. A loose bundle of fresh herbs lies at the left, a sprig of purple-leaved
   * basil below it, a few loose leaves scattered on undyed linen, and the whole
   * thing stands on a weathered plank table in cool daylight.
   *
   * **The commission's one non-negotiable element is present.** The §70 note said
   * it in terms: at least one round torn or folded open so the layer of greens is
   * visible rather than implied, because a whole unbroken flatbread photographed
   * from above is a picture of a different dish. This file does better than the
   * minimum — it cuts the bread and opens both halves, and the exposed filling is
   * the largest saturated shape in the frame.
   *
   * **The lavash test, which is the one that mattered.** Held side by side at the
   * 380px listing card, at the 160px search thumbnail and at the 128px one, the two
   * separate instantly and on two independent axes: this reads cool and pale with a
   * broad dark-green band through the middle; `lavash.webp` reads warm amber, plain,
   * with no green anywhere in the frame. The green survives the smallest crop the
   * site renders, which is the condition §71 set and the reason a closed flatbread
   * would have been refused.
   *
   * The filling is legibly a *mixture* rather than one green: broad serrated leaves,
   * narrow strap-like ones, pale stem and scallion cross-sections, and a range from
   * dark to bright. That matters editorially, because the article refuses a fixed
   * canonical herb count and the picture had to show abundance rather than a
   * countable botanical display.
   *
   * One ambiguity was inspected rather than assumed away. The dough surface carries
   * a pale greenish mottling that could read as a thin layer of cheese under the
   * bread. At 3× it is plainly the filling seen through translucent dough, with
   * flour patches over it — no gloss, no stretch, no separate boundary, and
   * continuous with the green at the cut. There is no cheese, meat or cream in the
   * frame.
   */
  "jingalov-hats": "/images/cuisine/jingalov-hats.webp",

  /*
   * §73. Khash — and the first cover in this section whose hardest job was to
   * avoid two things at once: looking like another dish, and looking like the
   * thing the dish is actually made of.
   *
   * 1585×992, 133 KB (135,762 bytes), a single lossy `VP8 ` chunk with no VP8X
   * extension, and therefore no alpha, no ICC profile, no EXIF and no XMP.
   * Verified twice, by a hand-written RIFF chunk walk and by `sharp`, which agree
   * on every field. Registered exactly as delivered: unaltered, uncropped,
   * unoptimised, unrenamed.
   *
   * **One pixel of geometry drift, recorded rather than corrected.** The
   * commission asked for 1586×992 and the file is 1585×992 — ratio 1.5978 against
   * the archive's 1.5988. That is a third of a percent of one dimension, invisible
   * at every rendered size, and it changes no crop outcome. Resizing to hit the
   * round number would have meant resampling the whole image to fix nothing.
   *
   * **What is in the frame.** A deep speckled stoneware bowl, banded in dark blue,
   * holding clear pale-golden broth with pieces of slow-cooked meat and pale
   * gelatinous trotter meat partly submerged in it. Behind and to the left, a
   * stack of folded lavash on a board; to the front left, a small dish of crushed
   * garlic with a whole bulb and two loose cloves; to the right, radishes, fresh
   * greens, and a squat ceramic cup of tea. A second bowl and a spoon sit at the
   * lower right. Beyond it all, a **frosted window** in cool daylight.
   *
   * **The gate this file had to pass is the broth, and it passes at every size.**
   * The liquid is genuinely transparent — pieces below the surface show through it
   * softened rather than hidden — with an irregular lace of fat droplets on top
   * and a visible meniscus against the ceramic. Nothing about it is creamy,
   * gelatin-solid or gravy-like, which is what separates it from `spas.webp`
   * (white, opaque, green-flecked) and from `harissa.webp` (a pale homogeneous
   * mound with a butter pool). Compared side by side at the 380px card and at
   * 160px and 128px thumbnails, the three separate on two independent axes each:
   * colour and physical state.
   *
   * **The non-graphic requirement is met by an absence.** There is no bone in the
   * frame — no hoof, no split joint, no cross-section, no anatomy of any kind. The
   * parts read as cooked meat and soft collagen in a broth, which is exactly the
   * register the article's prose uses when it describes them briefly and without
   * emphasis. A cover that made the parts unmistakable would have contradicted the
   * article rather than illustrated it.
   *
   * **The winter-morning brief is carried by one element**: the frost on the
   * window. It survives every project crop including the tightest, which is why no
   * `object-position` was needed. Cool light from the left, warm wood, a narrow
   * drift of steam, and a restrained table do the rest.
   *
   * One object was inspected rather than assumed. The ceramic cup at the top right
   * holds a brown liquid and could, in a thumbnail, be read as something else. At
   * 3× it is an opaque hand-painted stoneware tumbler filled nearly to the rim —
   * not glass, not stemware, not a shot glass — and there is no bottle anywhere in
   * the frame. The alcohol audit §14 asked for is clean.
   */
  khash: "/images/cuisine/khash.webp",

  /*
   * §75. Matsun — the first Cuisine cover in this registry whose subject is not a
   * dish but a material, and the only one whose whole job is a texture.
   *
   * 1584×993, 388 KB (397,682 bytes) — the Gyumri geometry rather than the house
   * 1586×992, so this section now has a second size alongside `khash.webp`'s
   * 1585×992. Ratio 1.5952 against the archive's 1.5988: two pixels narrower and
   * one taller than the commission asked for, a 0.2 per cent difference that
   * changes no crop outcome and was recorded rather than resampled away, on the
   * same reasoning as §73. `RIFF/WEBP` with `VP8X` + `ICCP` + `VP8 ` — an extended
   * container carrying a 456-byte sRGB profile, which makes it the **first
   * ICC-bearing file under `/images/cuisine/`**; the other nine are plain
   * `RIFF/VP8`. The `VP8X` flag byte is `0x20`: ICC set, alpha, EXIF, XMP and
   * animation all clear, and a full chunk walk ends exactly at EOF with the RIFF
   * size field agreeing with the file length. One lossy VP8 keyframe, sync
   * `9D 01 2A`, three channels, eight bits, opaque, no orientation tag. SHA-256
   * d8fc17ea6196c0bf74409be41d190e1aad98d5f3638c2b98127ebe8e2fbaec7f. Verified
   * twice, by a hand-written RIFF chunk walk and by `sharp`, which agree on every
   * field. Registered exactly as delivered: unaltered, uncropped, unoptimised,
   * unrenamed.
   *
   * At 388 KB it is **the heaviest file in this section by a wide margin** — nearly
   * double `spas.webp`'s 198 KB, which held the title before it — and it takes the
   * ten Cuisine covers to 1,739,688 bytes (1.66 MB), mean 169.9 KB, median
   * 143.8 KB. That is measured and recorded, not corrected;
   * the standing media-optimisation debt is unchanged.
   *
   * **What is in the frame, and it is the set curd.** A wide hand-thrown stoneware
   * bowl, pale grey with a brushed blue rim band and a painted geometric arcade low
   * on the wall, standing on striped linen on a bare wood table. It holds a plain
   * white mass with no inclusions of any kind, its surface broken into folds and
   * scoop ridges that stand proud of a thin ring of pale whey against the bowl
   * wall. A metal spoon lifts a lump clear of the surface: it sits on the spoon,
   * overhangs it on both sides, slumps softly, and shows flat fracture planes with
   * a torn edge. Behind, a blue-painted ceramic jug and a bright window with
   * foliage; to the right, folded flatbread and a small ceramic cup; to the left, a
   * torn wheat loaf with crumbs on the wood. Daylight from the left.
   *
   * **The spas test, which is the one that mattered, and it is decided by an
   * absence.** The §74 note beside this slug's pending entry named the danger
   * exactly — spas is *made of* matsun, so a substitution would feel almost right —
   * and the two separate on two independent axes at every size the site renders.
   * Inclusions: a numeric sweep of 262,400 pixels of this bowl's interior found
   * **zero** green-biased pixels, against 1.37 per cent for the same measurement on
   * `spas.webp`. Physical state: spas has a flat liquid level with grain suspended
   * through it, this has a broken solid standing above its own whey. Held side by
   * side at the 380px listing card and at the 160px and 128px search thumbnails,
   * spas reads speckled green-and-grain and this reads plain white with a scoop
   * taken out. There is no crop at which it becomes spas without herbs.
   *
   * **Spoonable rather than pourable is carried by three things**, and all three
   * survive the tightest crop: the lifted spoonful with its cut faces, the ragged
   * standing edge of the mass, and the whey ring it stands above. Nothing in the
   * frame pours, sits flat like cream, peaks like whipped dairy, wobbles like
   * gelatin or breaks into cottage-cheese curd.
   *
   * **Exposure, measured rather than judged**, because a white subject is where a
   * cover fails silently: 0.005 per cent of the bowl interior clips at 255 and the
   * 99th percentile of its luminance is 240, so the whites keep their headroom and
   * the surface detail survives (greyscale σ = 40.4 across the dairy). The lit
   * faces measure #eae7e2 and #f5f3f0 — R−B of 5 to 9, natural white rather than
   * blank digital white. The region mean is warmer (R−B 32) because the shadowed
   * folds pick up bounce off the wood and ceramic, which the whole frame shares
   * (R−B 31.6); it is not a cast on the product.
   *
   * Everything the §74 note refused in advance stayed out: no tub, foil lid, label
   * or branded pot; no fruit, honey, granola or parfait layer; no wellness,
   * probiotic or clinical staging; no thermometer, saucepan, measuring cup or
   * ingredient lineup; no grain and no herb. Nothing in the frame is a symbol —
   * no flag, no Ararat, no khachkar, no carpet — and there is no lettering
   * anywhere: the bowl band is a repeating leaf arcade, the jug a blue floral
   * repeat, the spoon finial an embossed leaf, the linen stripe a broken warp, and
   * a contrast-boosted pass over all four corners found no watermark or signature.
   *
   * Two things to know rather than rediscover. The lifted spoonful carries a faint
   * regular diamond cross-hatch on its top face, visible only above about 4× and at
   * no rendered size — an AI texture artifact, recorded and not retouched. And the
   * bread beside the bowl is a crusty wheat loaf as well as flatbread, the same
   * mixed-bread note `spas.webp` carries; it is background at every crop.
   */
  matsun: "/images/cuisine/matsun.webp",

  /*
   * §78. Basturma — the eleventh Cuisine cover, and the one whose whole job is to
   * say *cured* rather than *cooked*.
   *
   * 1586×992, 238 KB (243,844 bytes), ratio 1.5988 — the house geometry exactly,
   * with **zero drift**, which is the first time in four Cuisine registrations
   * that has been true (§73 khash was 1585×992, §75 matsun 1584×993). Plain
   * `RIFF/WEBP` → `VP8 `, one lossy keyframe, sync `9D 01 2A`, three channels,
   * eight bits, opaque. No `VP8X`, so no ICC, alpha, EXIF, XMP or animation
   * chunk, and no orientation tag; the chunk walk ends at byte 243,844, exactly
   * EOF, with the RIFF size field agreeing with the file length. That returns
   * this section to the plain container the other nine use and leaves
   * `matsun.webp` still the only ICC-bearing file under `/images/cuisine/`.
   * SHA-256 e88f33e270f580550e96adc26644fac98e282d94c26502b3d339ff9150890cb5.
   * Verified twice, by a hand-written RIFF chunk walk and by `sharp`, which agree
   * on every field. Registered exactly as delivered: unaltered, uncropped,
   * unoptimised, unrenamed.
   *
   * At 238 KB it is the **second-heaviest** Cuisine asset, past `spas.webp`'s
   * 198 KB and well behind `matsun.webp`'s 388 KB, which stays the outlier. So it
   * joins the heavy tier rather than opening a new one — matsun is still 1.63× it
   * — and takes the eleven covers to 1,983,532 bytes (1.89 MB), mean 176.1 KB,
   * median 146.1 KB. Measured and recorded, not corrected; the standing
   * media-optimisation debt is unchanged.
   *
   * **What is in the frame, and it is unmistakably a cure.** A whole part-sliced
   * loin lies on a dark, heavily grained wooden board under a thick, dry,
   * rust-brown chaman crust that is granular rather than glazed, with loose crumbs
   * of it shed onto the board. Its cut face and five thin slices fanned in front
   * of it show a deep burgundy interior webbed with fine pale connective tissue,
   * every slice ringed by the same crust. Behind: folded lavash, a small bowl of
   * ground red spice, a bowl of whole garlic bulbs, and a brown jug with a dark
   * lattice band. To the right, linen with a woven red stripe and a sprig of
   * thyme. Soft neutral daylight from the right.
   *
   * **The khorovats test, which is the one that mattered, is decided by
   * everything at once.** The §77 pending note named the danger exactly — the
   * section's other beef article is fire and this one is salt and air — and the
   * two never come close. Khorovats is skewers, char, glowing coals in a stone
   * hearth and warm firelight; this is a board, a crust and cool daylight, with no
   * flame, skewer, grill mark or smoke anywhere in it. Held side by side at the
   * 380px card and the 160px and 128px thumbnails, khorovats reads as browned
   * chunks over coals and this reads as dark red slices beside a brown log. There
   * is no size at which they blur.
   *
   * **Not raw** is carried by colour and finish together: the interior is matte
   * burgundy, not bright fresh-steak red, and it is dry — no wet sheen, no blood,
   * no translucency, no pooling on the board. **Not sausage** is carried by
   * geometry: one whole muscle with an oval cross-section and no casing, no tied
   * end, no mince, no uniform cylinder. **Not charcuterie** is carried by absence:
   * no cheese, grapes, olives, nuts, crackers or elaborate pickles, and no wine,
   * glass or bottle of any kind.
   *
   * The whole piece and the slices correspond, which is where an image like this
   * usually fails: same interior colour, same crust thickness, same webbing
   * character, cut faces that plausibly come off the exposed end, and slice
   * thickness consistent between the board and the loin. The five slices are
   * individually distinct rather than cloned — different outlines, different
   * marbling — and each sits with its own contact shadow.
   *
   * Two things to record rather than rediscover. The bowl of ground spice and the
   * bowl of garlic are the **closest this frame comes to the §77 ban on recipe
   * staging**, and they were assessed rather than waved through: both are
   * defocused background props, there is no raw meat, no salt bowl, no scale,
   * thermometer, timer, curing rack or measured lineup, and nothing implies a
   * sequence. They read as flavour context beside a finished product, and the
   * accept is deliberate. And the thyme sprig on the linen is the one decorative
   * herb in the frame; it is secondary at every crop and does not make this a
   * grazing board.
   *
   * Nothing in the frame is a national symbol — no flag, no Ararat, no khachkar,
   * no carpet — and there is no lettering anywhere: the jug band is an abstract
   * diamond lattice, the linen a plain woven stripe, and a contrast-boosted pass
   * over the corners found no watermark or signature.
   */
  basturma: "/images/cuisine/basturma.webp",

  /*
   * §80. Manti, and the first Cuisine cover registered with a recorded
   * reservation rather than a clean pass.
   *
   * The file. 1585 × 992, ratio 1.5978 — one pixel short of the 1586 × 992 house
   * geometry, the same single-pixel drift `khash.webp` carried in §73 and the
   * second time in four registrations that basturma's zero-drift has not been
   * matched. 472,550 bytes (461.5 KB), SHA-256
   * 7a3780ea5eb7f942c9b2c6bf73fd582e65f635a9ccc0ce927141c769d4ad125b. Plain
   * `RIFF/WEBP` → `VP8 ` only: no `VP8X`, so no ICC, alpha, EXIF, XMP or
   * animation chunk and no orientation tag. One lossy keyframe, sync 9D 01 2A.
   * The chunk walk ends at byte 472,550, exactly EOF, with the RIFF size field
   * agreeing with the file length. `matsun.webp` remains the section's only
   * ICC-bearing file.
   *
   * This is now the heaviest file under `/images/cuisine/` at 461.5 KB, ahead of
   * matsun's 388.4 KB, and it moves the section's mean materially. That is
   * recorded rather than acted on: this registry does not optimise, resize or
   * re-encode what it is given, and the media-optimisation debt already carried
   * in PROJECT_STATE.md is where a decision about it belongs.
   *
   * What the picture shows. A round rustic ceramic tray packed with roughly
   * nineteen small dumplings, each one OPEN with its ground-meat filling exposed,
   * the dough gathered and pinched up around the filling and baked to a golden
   * brown at the raised edges, sitting in a shallow pool of broth. A bowl of
   * garlic-white matsun with a spoon sits to the right as a clearly secondary
   * element, with flatbread, linen and a jug behind, in soft daylight from a
   * window.
   *
   * Every forbidden reading in the §79 commission is refused, and these are the
   * ones that would have destroyed the article rather than merely disappointed
   * it. The dumplings are not closed, so this is not ravioli, not pelmeni, not
   * khinkali and not Turkish mantı. The broth is a shallow pool under baked
   * dough rather than a bowl of soup, which is the serving the article actually
   * describes. There is no recipe staging, no raw meat, no ingredient spread, no
   * restaurant-luxury styling, no national symbol and no lettering anywhere.
   *
   * The reservation, recorded because it is real and because burying it would
   * make this note worthless. The article's prose says the shape is a canoe —
   * two opposite sides pinched together, the two ends left open — and §51 asked
   * for boat-shaped dumplings by name. What is in the frame reads closer to a
   * round nest or purse: the dough is gathered all the way around a circular
   * well of filling. Several pieces have an elongated axis, but the dominant
   * reading is round, not boat.
   *
   * The two claims the article is actually built on — OPEN, and BAKED — are both
   * unambiguous here, and no competing dish is suggested. On that basis the file
   * was registered as a deliberate compromise rather than rejected. What must not
   * happen as a consequence is the prose being softened to match the picture: the
   * canoe description is what the sources say, and a `cuisine.spec.ts` test pins
   * it so that a later edit cannot quietly resolve the mismatch in the wrong
   * direction. If a boat-shaped replacement is ever commissioned, it replaces
   * this file and this note goes with it.
   */
  manti: "/images/cuisine/manti.webp",

  /*
   * Places
   *
   * `khor-virap.png` is byte-for-byte the same file as `public/hero-ararat.png`,
   * the homepage hero — same 1355×793 image, same SHA-256, copied into the
   * registry's directory rather than referenced across. That is an editorial
   * decision, recorded here because §17 of PROJECT_STATE.md exists to stop
   * unrecorded claims about artwork: the hero is hereby declared Armat-generated
   * editorial artwork on the same terms as everything else in this map, which is
   * what lets it inherit `ARTWORK_PROVENANCE` below and be captioned
   * AI-generated. The provenance is now stated for both copies, not neither.
   *
   * Two consequences to keep in mind rather than rediscover. The same picture is
   * now the homepage hero *and* one article's cover, so it appears twice on a
   * reader's first visit; and it is a 1.4 MB PNG against a registry whose WebP
   * files run from 85 KB to 481 KB, so this slug's card and hero are the heaviest
   * images on the site by a wide margin. It is also the only entry here that is
   * not 1586×992. Neither file is altered, optimised or renamed here — replacing
   * this entry with a lighter, place-specific WebP is a later piece of work, and
   * it is a one-line change because every consumer already asks `getImageSrc`.
   *
   * `Hero.tsx` still points at `/hero-ararat.png` directly and is untouched.
   *
   * `etchmiadzin-cathedral.webp` is what that later piece of work looks like when
   * it is done properly, and it is the reason the paragraph above is worth
   * keeping: it is a 1586×992 WebP like every other file in this map, it depicts
   * the building its slug names, and it replaced a `PENDING_ARTWORK` entry rather
   * than an approximation. Registering it was a one-line change that reached the
   * article hero, the listing card and featured block, the search thumbnail, the
   * Open Graph and Twitter tags and the sitemap image at once.
   *
   * `erebuni-fortress.webp` did the same for the third place and is 1586×992 too,
   * so the "only entry not 1586×992" note above still refers to Khor Virap alone.
   * Two things about this file are worth knowing rather than rediscovering: at
   * 742 KB it is the heaviest WebP in the registry by a wide margin (the next is
   * 470 KB), and it is the only entry carrying an embedded ICC profile. Neither is
   * a fault and neither was touched — the file is registered exactly as delivered,
   * unaltered, unoptimised and unrenamed, which is the rule this map has followed
   * since §30.
   *
   * `matenadaran.webp` is the fourth place and arrived in the same shape as
   * Erebuni: 1586×992, lossy VP8, an embedded ICC profile, and 701 KB — so the two
   * heaviest files in the registry are now the two most recent, and "the only
   * entry carrying an ICC profile" above should read *the first*. Worth watching
   * if the places section keeps growing, but not a fault and not a reason to touch
   * either file: both are registered exactly as delivered.
   *
   * `lake-sevan.webp` is the fifth place and the first that is not a building. It
   * breaks the run the paragraph above was worried about rather than continuing
   * it: 1586×992 like the other three WebPs, but 176 KB — the *lightest* file
   * under `/images/places/` — and a plain `RIFF/VP8` with no `VP8X`, no ICC
   * profile and no alpha, so the ICC note stays about Erebuni and the Matenadaran
   * alone. Registered exactly as delivered, unaltered and unrenamed, like the rest.
   *
   * What was checked before it was registered, because a lake is the one subject
   * where a plausible picture is the real risk: the frame is open water under
   * treeless highland ridges, the monastery on the far headland is perhaps half a
   * percent of it, and the only human presence is one open fishing boat. There is
   * no beach furniture, no hotel, no dam and no forest rim — the four things that
   * would have made it a generic lake with a Sevan caption. The exposed pale
   * shoreline terrace across the foreground is the drawdown this article is about.
   *
   * `garni-temple.webp` is the sixth place and the first file in this map that is
   * **not 1586×992**, apart from Khor Virap's PNG. It is 1448×1086 — a 4:3 frame
   * rather than the 16:10 every other WebP here uses — and 120 KB, which takes the
   * "lightest file under `/images/places/`" note away from Lake Sevan after one
   * step. Container-wise it matches Etchmiadzin and Lake Sevan: a plain `RIFF/VP8`,
   * no `VP8X`, no ICC profile, no alpha.
   *
   * The aspect ratio is the one thing worth knowing rather than rediscovering,
   * because it changes what the shared crops do. Every slot is a centre crop, so a
   * 4:3 source is the *whole* image in the `aspect-[4/3]` slots (compact card and
   * mobile hero) and loses 136 px top and bottom in the `aspect-[16/9]` ones
   * (listing card and desktop hero) against the 50 px a 1586×992 file loses. It was
   * checked rather than assumed: the pediment apex survives the 16:9 crop, with
   * very little headroom to spare. No crop logic was added and none is needed.
   *
   * What was checked before registering, because a temple is the subject where a
   * plausible picture is the risk: Ionic volute capitals, a plain tympanum, a
   * dentil course and vegetal frieze carrying no lettering or figures, a hexastyle
   * front on a high podium with a single stair, and treeless ridges falling away
   * behind. Nothing in the frame asserts a dedication — no cult image, no altar, no
   * inscription, no date, no solar emblem — which matters more here than anywhere
   * else in this map, because the article's whole argument is that the building's
   * dedication is not established. See §40 of PROJECT_STATE.md for the one colour
   * reservation, which was reported rather than corrected.
   *
   * With this entry `PENDING_ARTWORK` was empty for the fifth time (§32, §34, §36,
   * §38, §40). The list emptying is the normal end state, not a signal that it can
   * go — and §41 is the proof: Geghard was written as the seventh place with no
   * artwork of any kind in the repository, so the list filled again the moment the
   * sixth entry above had settled.
   *
   * `geghard-monastery.webp` is the seventh place and §42, and it takes the list
   * back to empty for the sixth time. It returns to the shape the four WebPs before
   * Garni had: 1586×992, so the "not 1586×992" note above is again about Khor
   * Virap's PNG and Garni alone. Container-wise it is a plain `RIFF/VP8` — one
   * chunk, no `VP8X`, no ICC profile, no alpha — like Etchmiadzin, Lake Sevan and
   * Garni. At 271 KB (277,286 bytes) it sits mid-registry, well under Erebuni and
   * the Matenadaran and well over Garni. Registered exactly as delivered, unaltered,
   * unoptimised and unrenamed, like every entry since §30.
   *
   * What was checked before registering, because at Geghard the plausible picture is
   * a *different building* rather than a mood: the frame is the upper Azat gorge
   * with the complex set directly against the cliff, the katoghike's umbrella dome
   * and its gavit both legible, rock-cut chambers open in the cliff face immediately
   * behind the courtyard, and a rock mass intruding into the enclosure so that the
   * built and the hollowed-out read as one fabric — which is the article's subject
   * and the thing no other file under `public/` showed. It is not Garni (no
   * peristyle, no podium), not Khor Virap or Etchmiadzin (no plain, no cathedral
   * forecourt), not Petra or Cappadocia (basalt-grey masonry and a wooded gorge, no
   * sandstone façade and no tuff cones). Nothing in the frame dates the buildings,
   * so the fourth-century foundation tradition is not asserted over the thirteenth-
   * century complex the prose distinguishes it from; and there is no spear, no
   * relic, no shield, no inscription, no lettering and no depicted event.
   *
   * One thing to know rather than rediscover, recorded here and in §42 of
   * PROJECT_STATE.md rather than corrected: this file is photographic in register —
   * a documentary-looking aerial view, tourists visible in the courtyard — where
   * every other file in this map is a rendered illustration. It inherits
   * `ARTWORK_PROVENANCE` like the rest and is captioned AI-generated, which is the
   * more cautious of the two claims, but it is the first entry where that caption is
   * worth re-confirming against the source rather than assuming. The file was not
   * altered.
   *
   * `dilijan-national-park.webp` is the ninth place and §50, and it takes the list
   * back to empty for the eighth time. It is 1586×992 again, so the "not 1586×992"
   * note above still refers to Khor Virap's PNG and Garni alone. Container-wise it
   * is the plainest file in this map: a single `RIFF/VP8` chunk and nothing else —
   * no `VP8X`, and therefore no ICC profile, no alpha, no EXIF and no XMP — like
   * Etchmiadzin, Lake Sevan, Garni, Geghard and Tatev. sRGB, three channels, eight
   * bits. At 249 KB (255,030 bytes) it is the fourth lightest of the nine, between
   * Etchmiadzin and Tatev. SHA-256
   * 9dc7a49c1855e5a97e67e4414a63c340331640ef1620851fd2a1d156704d3120. Registered
   * exactly as delivered, unaltered, unoptimised and unrenamed, like every entry
   * since §30.
   *
   * What was checked before registering, because at Dilijan the plausible picture is
   * the *wrong forest* rather than a wrong building: the frame is a broadleaf valley
   * seen from a rocky overlook, both walls closed canopy to the ridgeline, a stream
   * on the valley floor, limestone outcrops breaking through the trees on the right
   * bank, and forested ridges receding into humid haze under overcast sky. The
   * foreground branch is unmistakably broadleaf — lobed and serrated leaves, no
   * needles anywhere in the frame — which is the one thing this file had to get
   * right, since the article's own distinguishing fact is that barely one per cent
   * of the park's forest is coniferous. There is no building of any kind, no lake as
   * a subject, no snow peak, no people, no wildlife, no logging and no vehicle; the
   * subject is the forest itself. It is not Lake Sevan (no open water, no treeless
   * ridges), not Tatev or Khor Virap (no plateau, no plain, no monument) and not
   * alpine (rounded mid-mountain relief, no bare rock summits, no conifer belt).
   *
   * Two things to know rather than rediscover, recorded here and in §50 of
   * PROJECT_STATE.md rather than corrected. Like Geghard and Tatev this file is
   * photographic in register where most of this map is rendered illustration; it
   * inherits `ARTWORK_PROVENANCE` and is captioned AI-generated, which remains the
   * more cautious of the two claims. And nothing in the frame identifies Armenia
   * specifically — there is no landmark, and there cannot be one, because the
   * article's subject is a forest rather than a monument. That is a limit of the
   * genre and not a fault in the file: the caption and the article carry the
   * geography, and the alternative would have been putting a building in the frame
   * of an article about there not being one.
   *
   * `gyumri.webp` is the tenth place and §52, and it is the **first urban street
   * artwork in this registry** — every other entry is a monument, a landscape or a
   * building in isolation. That makes its verification different in kind, and what
   * was checked is recorded here rather than reconstructed later.
   *
   * **Container.** 1584×993 — a *third* distinct size, so the "not 1586×992" note
   * above no longer refers to Khor Virap's PNG and Garni alone. The aspect is
   * effectively unchanged (1.595 against 1.599), so nothing about the crops moves;
   * the file is simply two pixels narrower and one taller than the house size.
   * `RIFF/WEBP` with `VP8X` + `ICCP` + `VP8 ` — an extended container carrying a
   * 456-byte sRGB monitor ICC profile, like Erebuni and the Matenadaran and unlike
   * the six plain `RIFF/VP8` files. The `VP8X` flag byte is `0x20`: ICC set, and
   * alpha, EXIF, XMP and animation all clear, so none of those can be present. One
   * lossy VP8 keyframe, sync `9D 01 2A`, three channels, eight bits, sRGB, no
   * orientation. At 530 KB (542,872 bytes) it is the **third heaviest** file here,
   * behind Erebuni and the Matenadaran — a consequence of a dense street scene with
   * fine masonry detail rather than of the file being unoptimised, and it does not
   * change the standing media-optimisation debt. SHA-256
   * 11f593161584a5579094562f3b20faaa59f96bca333853ac7b18ee3bcdfdf72e. Registered
   * exactly as delivered, unaltered, unoptimised and unrenamed, like every entry
   * since §30.
   *
   * **What is in the frame,** because for a city the plausible wrong picture is a
   * *monument* rather than a place: a wet paved square and a street receding to a
   * vanishing point, with a long terrace of two-storey Alexandropol-era façades on
   * the left — dark grey-black tuff with reddish-brown tuff surrounds, pilasters and
   * cornices, hand-carved window and door frames, wrought-iron balconies, all on the
   * street line. On the right a church in black tuff with red-orange geometric
   * inlay. Between them a horse and a traditional phaeton with its driver, street
   * lamps, spruces, pedestrians in winter coats and a few parked cars in the middle
   * distance, under overcast Shirak light. It reads as a **living city**, not a
   * monument portrait: the left half is entirely secular urban fabric and the church
   * is one element among several.
   *
   * It is specifically **not** the Black Fortress, a monastery, a cathedral cover,
   * Erebuni or Yerevan, a generic Russian imperial city or a generic European old
   * town — the black-and-red tuff, the carved surrounds and the low two-storey
   * street line are Gyumri's own register. There is no ruin, no rubble, no
   * earthquake scene, no flag, no Soviet iconography, no invented event, no
   * high-rise and no traffic-dominated composition.
   *
   * **Text audit,** run because this is the first artwork with a street in it. No
   * shopfront sign, banner, plaque, street sign, wall inscription or poster carries
   * lettering, and the church's red-tuff ornament is geometric rather than
   * epigraphic. Two tiny unreadable marks survive and are recorded rather than
   * edited away: a small white pavement notice by the left terrace (~20×30 px in
   * source, resolving at 8× to colour smears with no letterforms) and one car number
   * plate (~20×8 px, a blue tab and a grey smear with no legible characters). The
   * file was not retouched.
   *
   * Two things to know rather than rediscover, recorded here and in §52 of
   * PROJECT_STATE.md rather than corrected. Like Geghard, Tatev and Dilijan this
   * file is photographic in register, and it is **the most photographic entry in the
   * registry** — a documentary street photograph in look, including a legible face
   * on the carriage driver. It inherits `ARTWORK_PROVENANCE` and is captioned
   * AI-generated, which remains the more cautious of the two claims and matters more
   * here than anywhere before it. And the narrow search thumbnail, which is the
   * tightest live crop, trims 52.8 per cent horizontally and keeps the carriage, the
   * square and the church while losing most of the terrace — still recognisably
   * Gyumri, but "carriage and church" rather than "historic street". No
   * `object-position` was added, because the default centre crop is degraded rather
   * than unusable and this registry has no per-image focus mechanism for scenes.
   *
   * `amberd-fortress.webp` is the eleventh place and §58, and it is the first
   * **ruin** in this registry — every other entry is a complete building, a living
   * street or a landscape. That is what its verification was about, and what was
   * checked is recorded here rather than reconstructed later.
   *
   * **Container.** 1586×992, the house size, so the "not 1586×992" note above still
   * refers to Khor Virap's PNG, Garni and Gyumri and gains no fourth member.
   * `RIFF/WEBP` with `VP8X` + `ICCP` + `VP8 ` — an extended container carrying a
   * 456-byte sRGB monitor ICC profile, like Erebuni, the Matenadaran and Gyumri and
   * unlike the six plain `RIFF/VP8` files; it is the fourth ICC-bearing entry, so
   * that note has stopped being remarkable. The `VP8X` flag byte is `0x20`: ICC set,
   * alpha, EXIF, XMP and animation all clear, so none of those can be present, and a
   * full chunk walk ends exactly at EOF with the RIFF size field agreeing with the
   * file length — the container is internally consistent and the extension is not
   * being trusted. One lossy VP8 keyframe, three channels, eight bits, sRGB, opaque,
   * no orientation tag. At 660 KB (675,994 bytes) it is the **third heaviest WebP**
   * here, behind Erebuni and the Matenadaran and ahead of Gyumri — a consequence of
   * a frame that is almost entirely fine masonry and rock texture, and not a reason
   * to touch it; the standing media-optimisation debt is unchanged. SHA-256
   * dbcf7491eeaa45abf698cecc0a19c04c1d9aa1ba9771962ebc14147951d01884. Registered
   * exactly as delivered, unaltered, unoptimised and unrenamed, like every entry
   * since §30.
   *
   * **What is in the frame,** because for a fortress the plausible wrong picture is a
   * *monastery* rather than a mood: a rock spur seen from slightly above, with a
   * cluster of round broken-topped towers in dark coursed masonry at its point, a
   * wall line and a ruined outwork running back along the spine of the spur to the
   * lower left, and a small complete church with a faceted drum and umbrella roof on
   * a terrace to the left, well below the castle and much smaller in the frame. A
   * ravine falls away on the left, a dark columnar-jointed cliff drops on the right,
   * and the two converge below the point — which is the geometry the article's
   * defensive argument rests on, rather than the word "inaccessible" it refuses to
   * use. Behind it a broad snow-patched volcanic massif over treeless tawny highland.
   * The hierarchy is right: **fortress first, church second, mountain third.**
   *
   * It is specifically **not** Tatev or Geghard (no complete monastery, no enclosure
   * of living buildings, no rock-cut chambers), not Garni (no peristyle, no podium),
   * not Erebuni (no excavated foundation grid, no plain, no suburb), not a European
   * castle (no keep, no bailey, no moat, no gatehouse, no crenellation), not an
   * alpine fantasy (the relief is a volcanic shield with rounded ridges, not bare
   * rock spires) and not an archaeological foundation field. There is no roof on the
   * castle, no reconstruction, no siege, no army, no fire, no earthquake scene, no
   * exposed pipeline, no reconstructed bathhouse, no tunnel mouth, no flag, no badge,
   * no figure in period costume and no visible date — so the picture asserts nothing
   * the prose deliberately leaves open.
   *
   * **Text audit.** No signage, plaque, board, banner, flag, vehicle, poster or
   * garment appears in the frame at all, and the church and tower surfaces carry no
   * lettering; a contrast-boosted pass over the whole image found no watermark or
   * signature in any corner. Nothing was retouched, because nothing needed to be.
   *
   * Three things to know rather than rediscover, recorded here and in §58 of
   * PROJECT_STATE.md rather than corrected. The towers read as solid drums — no
   * doorway, window or embrasure is legible anywhere in the wall circuit, which is
   * a stylisation rather than an error but means the frame shows the *mass* of the
   * defences and not how they were used. The background massif is a single broad
   * cone where Aragats has four summits around a breached crater: right in kind,
   * generic in silhouette, and it at least cannot be mistaken for Ararat. And the
   * pale gabled fragment immediately right of the church is a second ruined
   * structure whose relationship to the church is not architecturally legible; it
   * reads as an annex, and at every live crop it is a detail rather than a subject.
   *
   * The narrow search thumbnail is the tightest live crop, and it was measured in
   * the browser rather than assumed: the rendered box is 160×200 CSS px, an 0.801
   * ratio, so the shared centre crop takes 794×992 out of the file and trims **49.9
   * per cent horizontally**. It drops the church entirely while keeping the towers,
   * the spur, the path and the massif — degraded rather than unusable, and degraded
   * in the right direction, since the fortress is the subject and the church is not.
   * (Below `sm` that column is hidden outright, so there is no narrower case.) The
   * church survives every other crop: the compact card and mobile hero at 4:3
   * (measured 1.336; 16.6 per cent trimmed each side), the tablet hero at 3:2 (6.2
   * per cent), and the listing card, desktop hero and map selected card at 16:9
   * (measured 1.778 and 1.780; 10.1 per cent vertically). No `object-position` was
   * added, on the same reasoning as Gyumri.
   */
  /*
   * §60. **SUPERSEDED — describes the rejected first asset, kept as history.** The
   * file at this path was replaced in §61; everything below described a different
   * image with a different hash, and none of it applies to what ships now. It is
   * retained rather than deleted because the path is unchanged, which means nothing
   * in the repository would otherwise record that the cover was ever wrong. Read
   * §61 below for the asset actually registered.
   *
   * §60. `places/jermuk.webp` — registered by explicit decision against this
   * file's own commission, which is why this note is longer than the picture
   * warrants.
   *
   * **Container.** A valid RIFF/WEBP: `VP8X` (10 bytes, flags 0x20) + `ICCP` (456)
   * + `VP8 ` (842,522), the walk ending exactly at EOF with no trailing bytes.
   * Lossy VP8, no alpha (`isOpaque`), an sRGB display profile present, and no
   * EXIF, no XMP and no orientation tag. 1586×992, which matches the section's
   * dominant geometry exactly and adds no new dimension drift — the Gyumri
   * 1584×993 and Garni 1448×1086 outliers are still the only two. At 823 KB
   * (843,024 bytes) it is the **heaviest WebP in the registry**, ahead of Erebuni's
   * 742 KB, which is what a frame of moving water and rock texture costs; the
   * standing media-optimisation debt is unchanged and the file was not touched.
   * SHA-256 92b2a0516dd73f626aba6be08439b4f53ccd24cc341a9d283295964d2ce0e7f1. A
   * hand-written RIFF chunk walk and `sharp` were run independently and agree on
   * every field. Registered exactly as delivered, unaltered, unoptimised and
   * unrenamed, like every entry since §30.
   *
   * **What is in the frame.** The Jermuk waterfall, seen from the streambed below
   * and looking up: a fan-shaped cascade spreading over a rounded travertine dome
   * in the middle distance, a boulder in front of it, sheeting water across bare
   * rock filling the whole foreground, columnar-jointed gorge walls rising on both
   * sides with green scrub and a treeline along the top, and blue sky with light
   * cloud between them. The one man-made thing anywhere in it is a line of rough
   * stone blocks along the right bank forming a path. It is a competent and
   * genuinely Jermuk-specific picture — the fan over the tufa dome is that
   * waterfall's actual form and not a generic cascade.
   *
   * **And it is the wrong subject, recorded here rather than argued away.** The
   * commission below asked for a town: the settlement larger in the frame than any
   * single building, the gorge legible as something the town stands on both sides
   * of, mid-century public architecture in parkland, and — in as many words — *no
   * waterfall as the subject*. This file has no built fabric at all. The article it
   * covers spends forty paragraphs on how a highland spring landscape became a town
   * of 3,936 people, gives the waterfall part of one section out of twelve, and
   * will not say how tall it is because the three published heights (68, 70, 72 m)
   * have no measurement behind them. So the cover and the article disagree about
   * what Jermuk is, on the listing card, the hero, the search hit, the map card and
   * every shared link. This was raised, the mismatch was explained, and
   * registration was chosen deliberately; it is carried in §60 of PROJECT_STATE.md
   * as the archive's first knowingly off-subject cover, and it reverses by moving
   * one line back to `PENDING_ARTWORK` whenever a town image exists.
   *
   * A second-order consequence worth naming: `settlement` now holds two covers, and
   * one of them is a landscape with no settlement in it. The filter pill that
   * §51 introduced to make a kind of place legible is, for this pair, no longer
   * doing that.
   *
   * It is at least specifically **not** a borrowed neighbour, which is the failure
   * the five refusals below guard against. It is not Dilijan (no closed broadleaf
   * forest, no valley floor), not Lake Sevan (no open water, no shoreline), not
   * Gyumri (no street, no frontages), not Tatev or Geghard (no complex, no
   * masonry, no medieval anything), not an alpine or ski resort (no snow, no peak,
   * no chalet), and it carries no bottle, label, brand mark, sanatorium interior,
   * bath, treatment, patient or figure of any kind — so the medical and product
   * audits that the mineral-water subject makes necessary all come back clean. The
   * picture asserts nothing about health, and nothing about a product.
   *
   * **Text audit.** Clean, and trivially so: the frame contains no signage, plaque,
   * board, banner, storefront, poster, vehicle, garment or building surface — no
   * object in it is the kind that carries text. A contrast-boosted pass over all
   * four corners found no watermark or signature. No pseudo-Armenian, Russian or
   * English marks, and none of the tiny unreadable ones that usually need
   * recording. Nothing was retouched, because nothing needed to be.
   *
   * **Crops.** Unusually good, which is the irony of the entry: the composition is
   * centred and vertically deep, so every live surface keeps the whole subject. The
   * compact card and mobile hero at 4:3 take 1323×992 and trim 16.6 per cent
   * horizontally; the tablet hero at 3:2 takes 1488×992 and trims 6.2 per cent; the
   * listing card, desktop hero and map selected card at 16:9 take 1586×892 and trim
   * 10.1 per cent vertically, off sky and foreground water. The narrow search
   * thumbnail — 160×200 CSS px, an 0.801 ratio measured live in §58 — takes 795×992
   * and trims 49.9 per cent horizontally, and is the *strongest* crop of the set,
   * keeping the entire cascade, both gorge walls and the treeline. None of the four
   * degrades, so no `object-position` was added and there is no crop debt here. The
   * file crops well to the wrong subject, which no crop rule can fix.
   */
  /*
   * §61. `places/jermuk.webp` — the replacement, and the first time in this registry
   * that a file has been swapped underneath an unchanged path.
   *
   * That is the fact which makes this note necessary. `IMAGES`, `PENDING_ARTWORK`,
   * `ILLUSTRATED` and `ARTWORK` were already in their final state after §60 and
   * needed no edit at all; every path-based test passed before the swap and passed
   * after it, because the path never moved. **Nothing in the code could tell these
   * two images apart.** The hashes are the only durable record:
   *
   *   rejected  92b2a0516dd73f626aba6be08439b4f53ccd24cc341a9d283295964d2ce0e7f1
   *   accepted  5f5b6df9ec8a01a414abcff64df80c2a33005e2c92db6c19ce9a756d95c8cfb6
   *
   * They are documentation, not runtime input — no application logic reads a hash.
   *
   * **Container.** A valid RIFF/WEBP, and a structurally *simpler* file than the one
   * it replaces: a bare `RIFF/VP8 ` with **no `VP8X` and no `ICCP`**, the single
   * bitstream chunk running 650,828 bytes and the walk ending exactly at EOF. Lossy
   * VP8, no alpha (`isOpaque`, 3 channels), and no EXIF, no XMP and no orientation
   * tag. The dropped ICC profile is the one regression against the old asset: this
   * file carries no embedded colour profile, so it is rendered as untagged sRGB.
   * That matches `lake-sevan.webp`, which has shipped the same way since §38 with no
   * observable difference, so it is recorded here rather than treated as a defect.
   * 1586×992 — the section's dominant geometry again, no new dimension drift. 636 KB
   * (650,848 bytes), which also **hands back the "heaviest file" title**: Erebuni's
   * 742 KB is once more the largest WebP here, and the §60 note claiming that
   * distinction for Jermuk no longer holds. Verified twice, by a hand-written RIFF
   * chunk walk and by `sharp`, which agree on every field. Registered exactly as
   * delivered, unaltered, uncropped, unoptimised and unrenamed.
   *
   * **What is in the frame, and it is the town.** An elevated three-quarter view down
   * the length of Jermuk: the Arpa gorge running from the far distance into the
   * foreground, a road bridge crossing it on tall piers, and the settlement built on
   * both rims — which is the single thing the commission most wanted legible and the
   * thing the rejected file could not show at all. On the near side, a tree-lined
   * avenue with a green boulevard strip runs the depth of the picture past a large
   * mid-century public building in pale stone (long horizontal mass, a tall glazed
   * bay, a corner tower, a monument on a plinth in the forecourt), a **colonnaded
   * rotunda standing in mown parkland** — the mineral-water pavilion type, named in
   * the commission as "colonnades" — and then blocks of two- and three-storey stone
   * apartment housing with hipped roofs, parked cars and side streets. On the far
   * rim, a sanatorium complex of long low blocks with flat roofs, ribbon glazing and
   * terraces stepping along the cliff edge. A single slab tower stands mid-frame.
   * Behind it all, rounded highland ridges, part wooded and part open tawny grass,
   * rising to a mountain skyline under broken cloud.
   *
   * The hierarchy is right and it is the inverse of §60's: **town first, gorge
   * second, landscape third.** No single building dominates — the civic block, the
   * rotunda, the tower and the sanatorium each occupy a small fraction of the frame,
   * which is what stops this being the hotel-portrait failure that a brief correcting
   * a waterfall could easily have produced.
   *
   * **The waterfall is not in it.** White water shows in the gorge where the Arpa
   * runs over rock, which is the river rather than the fall, and at no crop does it
   * become a subject. The old failure is fixed rather than rebalanced.
   *
   * It also reads as **Jermuk and not Gyumri**, which is the distinction the two
   * `settlement` covers now have to carry between them: a dispersed highland town of
   * planned mid-century blocks in parkland astride a gorge, against a dense
   * nineteenth-century street of black-tuff frontages on an open plain. Nothing in
   * this frame is a merchant façade, a historic square or an imperial grid.
   *
   * **Medical and product audit.** Clean. No treatment, bathing, patient, doctor,
   * rehabilitation equipment or clinical space is visible; no bottle, label, brand
   * mark, pack shot or factory. The spa identity is entirely architectural — a
   * pavilion and a sanatorium seen as buildings in a town — which is exactly the
   * register the article's own restraint requires.
   *
   * **Text audit.** No legible lettering anywhere. The viewpoint is high and distant
   * enough that no façade, sign, plaque, banner, shopfront or vehicle plate resolves
   * into characters; a contrast-boosted pass over all four corners found no watermark
   * or signature. Several buildings carry marks at roof and door scale that read as
   * texture rather than text and cannot be resolved as glyphs in any orthography —
   * recorded here as the tiny unreadable marks the audit asks for, and **not
   * retouched**.
   *
   * **Register.** This is photographic rather than illustrative — it reads as a drone
   * photograph, with real lens perspective, cast shadows and atmospheric haze. It is
   * still AI-generated editorial artwork and is captioned as such by
   * `ARTWORK_PROVENANCE`, but it joins Geghard, Tatev, Dilijan and Gyumri on the
   * standing photographic-register debt rather than sitting apart from it.
   *
   * **Crops.** Strong at every live surface, and the 16:9 is the best of them. The
   * compact card and mobile hero at 4:3 take 1323×992 and trim 16.6 per cent
   * horizontally, keeping the civic building, the rotunda, the bridge and the
   * sanatorium; the tablet hero at 3:2 takes 1488×992 and trims 6.2 per cent; the
   * listing card, desktop hero and map selected card at 16:9 take 1586×892 and trim
   * 10.1 per cent vertically off sky and foreground roofs, losing nothing that
   * matters. The narrow search thumbnail — 160×200 CSS px, an 0.801 ratio measured
   * live in §58 — takes 795×992 and trims 49.9 per cent horizontally: it **drops the
   * large civic building on the left edge**, but keeps the avenue, the rotunda, the
   * tower, the bridge, the gorge, the far-rim sanatorium and the housing, so the
   * subject is still unmistakably a town. Degraded in the same direction as Amberd's
   * thumbnail and for the same reason — one landmark lost, the subject intact — and
   * recorded as debt rather than corrected. No `object-position` was added.
   */
  "khor-virap": "/images/places/khor-virap.png",
  "etchmiadzin-cathedral": "/images/places/etchmiadzin-cathedral.webp",
  "erebuni-fortress": "/images/places/erebuni-fortress.webp",
  matenadaran: "/images/places/matenadaran.webp",
  "lake-sevan": "/images/places/lake-sevan.webp",
  "garni-temple": "/images/places/garni-temple.webp",
  "geghard-monastery": "/images/places/geghard-monastery.webp",
  "tatev-monastery": "/images/places/tatev-monastery.webp",
  "dilijan-national-park": "/images/places/dilijan-national-park.webp",
  gyumri: "/images/places/gyumri.webp",
  "amberd-fortress": "/images/places/amberd-fortress.webp",
  jermuk: "/images/places/jermuk.webp",
  /*
   * §66. Haghpat, and the first cover in this registry that had to be checked
   * against a photograph rather than against a description.
   *
   * The file answers the §64 commission closely enough to be recognisable as the
   * place rather than as the type: a free-standing bell tower square below and
   * opening into an arcaded belfry above, standing apart on higher ground; the
   * short heavy polygonal drum of Surb Nshan under an umbrella roof; the broad low
   * gavit joined to it with a lantern on its ridge; a refectory range, smaller
   * chapels and a rubble enclosure around a courtyard of flat grave slabs; dark
   * grey-blue basalt with lichen on stone-tiled roofs; and wooded Lori ridges with
   * cleared pasture behind. Eight distinct volumes, none of them dominant, which is
   * the argument the article makes in prose.
   *
   * What must be recorded rather than admired: **this file is photographic**, and
   * the §64 brief and the commission both asked for the painterly register that
   * `tatev-monastery.webp` and `geghard-monastery.webp` use. It was accepted
   * anyway, because subject accuracy is what a cover is for and this one is exact
   * where the four monastery covers it had to be told apart from are merely
   * plausible. The register split the §62 audit recorded therefore widens here, and
   * Haghpat is now the clearest member of the photographic side.
   *
   * That has one consequence worth stating in this file rather than only in
   * PROJECT_STATE: it is AI-generated and it looks like a documentary photograph of
   * a real monastery, which is a stronger claim than a painting makes to a reader
   * skimming. `ARTWORK_PROVENANCE` and the AI caption are doing more work for this
   * slug than for any other, and neither may be weakened for it.
   */
  "haghpat-monastery": "/images/places/haghpat-monastery.webp",
};

/**
 * Slugs whose artwork is commissioned but not yet delivered.
 *
 * This list exists to end one specific state: a slug silently rendering the
 * generated placeholder, with nothing in the repo saying whether that is a
 * decision or an oversight. When an article is written ahead of its picture,
 * name it here with the reason; when the file lands, add it to `IMAGES` and drop
 * it from this list. Nothing else changes, because every consumer already asks
 * `getImageSrc`.
 *
 * Anything in `IMAGES` inherits `ARTWORK_PROVENANCE` below: an AI-generated
 * editorial illustration, captioned as one. A real, credited photograph is
 * declared on the article itself as `image: { src, alt, credit }`, which
 * overrides both the file here and the AI caption.
 */
export const PENDING_ARTWORK: readonly string[] = [
  /*
   * §85. Emptied for the tenth time, and the only one of the ten that took two
   * deliveries of the same slug to do it.
   *
   * §84 put `daniel-varoujan` here because Writer #8 was written ahead of his
   * portrait. The commission it was carrying is not repeated, because what it
   * asked for is now a fact about a file and sits beside the registry entry
   * above. Two things from it are worth keeping as standing rules rather than
   * as history:
   *
   * The first is that §84 refused to answer the provenance question and handed
   * it to the registration pass. That pass answered it: `PORTRAIT_PROVENANCE`
   * below now separates a face nobody has seen from a face drawn from surviving
   * photographs, because captioning the second one "an imagined likeness" would
   * have been false. Any future subject on this list who was photographed needs
   * that field set, and the default is deliberately the cautious one.
   *
   * The second is that the first delivery for this slug was **rejected** — for
   * readable generated lettering, not for likeness — and corrected rather than
   * regenerated. That is the first refusal in this registry's history, and the
   * detail is kept in the §85 note above rather than here so it stays attached
   * to the file it describes.
   */

  /*
   * §82. Emptied for the ninth time, and the first time by a Writer rather than a
   * Place or a dish.
   *
   * §81 put `grigor-narekatsi` here because the seventh biography was written
   * ahead of its portrait, and the archive should say that out loud rather than
   * let a placeholder stand in silence. §82 verified the file and registered it,
   * so the entry is gone and the commission it was carrying now sits beside the
   * registry entry above, where it can be read against the thing it produced.
   *
   * Seven writers, seven portraits, no placeholder in the section. Archive-wide
   * this list is empty again — which is worth saying precisely because it keeps
   * not lasting: nine times now it has emptied, and eight of those times it
   * filled again the next time an article landed ahead of its picture. That is
   * the normal working order here, not a failure of it.
   */

  /*
   * §80. Emptied for the eighth time, and the eighth time it has filled. §79 put
   * `manti` here because Cuisine #12 was written ahead of its picture; §80
   * registered the file and took it back out.
   *
   * The §79 commission is kept in the note beside the registry entry above rather
   * than repeated here, because what it asked for is now a fact about a file. Two
   * things from it are worth carrying forward as standing warnings. The first is
   * that this section's covers now include three filled-dough-or-leaf subjects —
   * `dolma.webp`, `jingalov-hats.webp` and `manti.webp` — any two of which would
   * pass a careless glance at thumbnail size, and only a test keeps them apart.
   * The second is that `manti.webp` was accepted with a recorded reservation
   * about its shape, which means it is the one cover in this section a
   * replacement is already contemplated for.
   */

  /*
   * §78. Emptied again, and this is the seventh time it has filled and the seventh
   * time it has been emptied. §77 put `basturma` here because the article was
   * written ahead of its picture; §78 registered the file and took it back out.
   *
   * The §77 commission is kept in the note beside the registry entry above rather
   * than repeated here, because what it asked for is now a fact about a file
   * rather than a request. Two things from it are worth carrying forward as
   * standing warnings, since both are one careless substitution away and neither
   * is protected by anything except a test: this section's meat covers are now
   * three, and `khorovats.webp` is fire where `basturma.webp` is salt and air.
   * A cover swap between those two would read as plausible to anyone not looking
   * closely, and it would undo the distinction the Basturma article is built on.
   */
  /*
   * Empty, for the sixth time. Emptied after each of the six times it has filled:
   * §31→§32 (Etchmiadzin), §33→§34 (Erebuni), §35→§36 (Matenadaran), §37→§38 (Lake
   * Sevan), §39→§40 (Garni), §41→§42 (Geghard).
   *
   * The list staying here while empty is the point, not an oversight — it has now
   * refilled six times, once per place written ahead of its picture, and the
   * rejected-substitute reasoning below is what each of those steps was for.
   *
   * Three are worth recording as they leave, because the shortcut rejected in each
   * is the kind that gets taken twice.
   *
   * For the Matenadaran, the only asset anywhere near the subject was
   * `history/mesrop-mashtots.webp` — a portrait of Mashtots at a writing desk in a
   * medieval monastic setting. The institute carries his name, which is exactly
   * what made that image the wrong one: it would have captioned a fifth-century
   * scene as a twentieth-century basalt building on a Yerevan avenue, and the
   * confusion between those two ages is the single thing that article was written
   * to prevent. The picture that landed is the building.
   *
   * For Lake Sevan the tempting substitute was not a wrong monument but a *mood*:
   * any blue-water-and-mountains illustration would have passed a glance. The
   * three actually considered and rejected were `history/bagratid-armenia.webp`
   * (Ani, a walled city above a river gorge, no lake in it at all),
   * `history/kingdom-of-urartu.webp` (Lake Van country — a different lake, and the
   * one that article's own prose is at pains to distinguish) and `hero-ararat.png`
   * (a mountain over a plain). The picture that landed is the lake, and the
   * `places.spec.ts` test naming those three files by name is what keeps any of
   * them from being pressed into service later.
   *
   * For Garni the trap was narrower and sharper than either: a picture with
   * columns in it. `history/tigran-the-great.webp` has classical pilasters on a
   * palace terrace behind a royal portrait and would have passed a glance as
   * "Armenian antiquity with columns", while captioning a first-century-BC king's
   * capital as a peripteral building on a gorge rim two centuries later.
   * `history/adoption-of-christianity.webp` is a baptism before a medieval domed
   * church — the right kingdom five centuries too late, and a building of exactly
   * the kind Garni is not. `erebuni-fortress.webp` was excluded on principle rather
   * than resemblance: it is the other `historical` place, and lending one
   * archaeological site's cover to another is the substitution this list exists to
   * prevent. All three are named in a `places.spec.ts` test for the same reason the
   * Lake Sevan three are.
   *
   * §41. Geghard is the seventh Place and the sixth time this list has filled.
   *
   * Every one of the thirty-six files under `public/` was opened rather than read
   * off its filename, and none of them shows the thing this article is about:
   * chambers hollowed out of a cliff, a gavit built against the living rock,
   * khachkars cut into the rock face, the walls of the upper Azat gorge closing
   * around a courtyard. There is no near miss to record here — unlike the four
   * cases above, nothing in the repository is even tempting.
   *
   * What has to be recorded instead is which substitutions were available and
   * refused, because at Geghard the wrong picture is unusually easy to justify.
   * `garni-temple.webp` is eight kilometres down the same valley and shares this
   * article's geography section, and it is a pre-Christian classical peristyle
   * roughly twelve centuries older than the monastery — the exact conflation the
   * Garni article's own prose was written to prevent. `khor-virap.png` and
   * `etchmiadzin-cathedral.webp` are the other two entries under the `monastery`
   * filter, which is precisely what disqualifies them: lending one monastery's
   * cover to another is the substitution this list exists to stop, and
   * `khor-virap.png` is in any case still byte-identical to `hero-ararat.png`.
   * `history/adoption-of-christianity.webp` is a free-standing domed church in a
   * valley — the generic-monastery trap, and a fourth-century narrative scene
   * standing in for a thirteenth-century monument.
   * `history/bagratid-armenia.webp` offers a river gorge, which is the Lake Sevan
   * mood substitution in another landscape: a gorge is not Geghard.
   *
   * All five are named in a `places.spec.ts` test, on the same principle as the
   * Lake Sevan three and the Garni three — and those tests are kept across the
   * registration in §42, because the failure they guard against (the cover being
   * repointed at a plausible neighbour later) outlives the file landing.
   */

  /*
   * §47→§48 (Tatev). Emptied for the seventh time.
   *
   * The rejection notes §47 wrote are worth keeping now that the file has landed,
   * because the commission was answered on every point they raised. The four
   * substitutes refused there — Geghard and Etchmiadzin as the other monasteries,
   * Khor Virap for its Ararat plain, `history/bagratid-armenia.webp` for its
   * gorge-without-a-monastery — were refused because none of them carried the
   * plateau, the enclosure and the gorge together. `tatev-monastery.webp` carries
   * all three in one frame, which is why it is registered and none of them ever
   * was.
   *
   * §47 also flagged the part most likely to be got wrong: the Gavazan is a
   * slender free-standing column with a khachkar on top, south of the church, not
   * a khachkar on a plinth and not attached to a wall. The delivered image places
   * a small free-standing pillar in the courtyard south-east of the church, which
   * reads correctly and carries no motion, instrument or seismograph imagery of
   * any kind — the failure that section of the article exists to avoid.
   */

  /*
   * §49→§50 (Dilijan National Park). Emptied for the eighth time.
   *
   * Dilijan is the ninth Place and the eighth time this list has filled. It was
   * also the first entry where the search came up not merely short but empty of
   * near misses in the usual direction, and the reason is the article's own
   * subject: nothing under `public/` showed closed broadleaf mountain forest,
   * because nothing else in this archive is set in it.
   *
   * All thirty-six files were opened rather than read off their filenames. The
   * landscape they share is the one this article exists to contrast with — dry
   * ground, bare ridges, open sky. `works/anush.webp` is a treeless ochre
   * hillside above a village, which is very nearly the photographic negative of
   * Dilijan; `history/bagratid-armenia.webp` is Ani on a steppe plateau above a
   * bare gorge; `writers/hovhannes-tumanyan.webp` is a portrait with a dry plain
   * behind it, and its subject being a Lori man is not evidence about a picture.
   *
   * Four substitutions were available and are recorded as refused, because each
   * would have been easy to justify.
   *
   * `places/lake-sevan.webp` is the other `nature` article and would sit under
   * the same filter pill. It is open water under treeless highland ridges — the
   * exact landscape the Dilijan article spends a whole section distinguishing
   * itself from — and lending it here would illustrate the contrast with a
   * picture of the wrong side of it. This is the Lake Sevan *mood* substitution
   * from §37 running in reverse, and it is the sharpest one on the list.
   *
   * `places/geghard-monastery.webp` is the only file in the registry with real
   * trees in the frame, which is precisely what makes it dangerous. They are
   * scrub and scattered stands on a Kotayk gorge wall, not closed forest, and the
   * subject of the frame is a rock-cut monastery in a different province. A
   * wooded slope is not a forest, and a monastery on a wooded slope is not a
   * national park.
   *
   * `places/tatev-monastery.webp` offers a plateau above a gorge in Syunik, and
   * `khor-virap.png` — still byte-identical to `hero-ararat.png` — offers a
   * mountain over an irrigated plain. Both are the Armenia of the photographs,
   * which is the thing this article is about *not* being.
   *
   * All four are named in a `places.spec.ts` test, on the same principle as the
   * Lake Sevan three, the Garni three and the Geghard five.
   *
   * What a commission would need to carry, recorded then so it would not be
   * reconstructed later: closed broadleaf forest — beech, hornbeam and oak, not
   * conifers — running up both sides of a valley to a ridge, in leaf, with no
   * monastery, no lake as the subject, no snow peak on the horizon and no
   * classical or medieval building anywhere in the frame. The park's own
   * distinguishing fact is that almost none of its forest is coniferous, so a
   * pine-and-fir picture would have stated the opposite of the article beneath it.
   *
   * §50. The delivered file answers that commission on every point, which is why it
   * is registered and none of the four substitutes ever was: broadleaf canopy on
   * both valley walls with no needle-leaf tree anywhere in the frame, a valley and
   * ridgeline that stay legible at every crop, and not one building in it. The four
   * refusals above are kept rather than deleted, on the same principle as the Lake
   * Sevan three, the Garni three and the Geghard five: the failure they guard
   * against is the cover being repointed at a plausible neighbour later, and that
   * outlives the file landing.
   */

  /*
   * §51. Gyumri — the tenth Place, the first `settlement`, and the ninth time this
   * list has filled.
   *
   * Every file under `public/` was opened rather than read off its filename, and
   * none of them shows what this article is about: a nineteenth-century city of
   * dark tuff on a grid, one- and two-storey stone frontages on the street line,
   * carved surrounds and forged iron. Armat has no urban imagery of any kind
   * except the medieval one named below.
   *
   * Five substitutions were available and each is recorded as refused, because
   * each could be argued for and three of them look right at a glance.
   *
   * `history/bagratid-armenia.webp` is the sharpest and the one a search would
   * return first. It is a *city* — a dense stone townscape with domed churches
   * seen from above — and it is Ani: a walled medieval capital on a steppe plateau
   * above a gorge, abandoned since the eighteenth century, in the country west of
   * the present border. Gyumri is an inhabited nineteenth-century imperial grid on
   * an open plain. Using Ani here would illustrate "old Armenian stone city" and
   * caption a ruin as a living one, which is the precise conflation this article's
   * early-history section exists to prevent.
   *
   * `writers/avetik-isahakyan.webp` is the biographical trap. Isahakyan was born
   * in Alexandropol, this article names him, and the file is in the repository —
   * but it is an interior portrait of a man at a writing desk, with no city in it
   * at all, and lending a writer's portrait to a settlement article would put a
   * face where a place belongs.
   *
   * `places/khor-virap.png` (still byte-identical to `hero-ararat.png`) and
   * `places/tatev-monastery.webp` are the Armenia of the photographs — a mountain
   * over a plain, a monastery on a plateau — and they are what this article is
   * least about. `places/erebuni-fortress.webp` is excluded on principle rather
   * than resemblance: an excavated citadel is the archaeological register, and
   * borrowing a site's cover for a city is the substitution this list exists to
   * stop.
   *
   * Also refused in advance, and worth writing down because they are what a brief
   * would drift towards: the Black Fortress alone, which is a Russian military
   * work and not the city and which the article deliberately keeps in its own
   * paragraph; anything showing the 1988 earthquake or its damage, which would
   * make a disaster image the identity of a living place; and a generic Caucasian
   * street, which would say nothing.
   *
   * What a commission would have to carry, recorded now so it is not reconstructed
   * later: a street or small square in the historic core, one- and two-storey
   * load-bearing stone frontages set to the street line, dark grey to black tuff
   * with red tuff present rather than absent, carved window and door surrounds,
   * forged iron grilles and balcony railings, an open high plain implied beyond
   * the roofline, no snow peak, no dome as the subject, no ruin and no rubble.
   *
   * §51→§52. Emptied for the ninth time. The refusals above are kept rather than
   * deleted, on the same principle as the Lake Sevan three, the Garni three, the
   * Geghard five and the Dilijan four: the failure they guard against is the cover
   * being repointed at a plausible neighbour later, and that outlives the file
   * landing. `bagratid-armenia.webp` in particular is still the only other stone
   * city in this repository and is still Ani.
   *
   * The delivered file answers the commission on every point, which is why it is
   * registered and none of the five substitutes ever was: a street and a square
   * rather than one building, two-storey load-bearing frontages on the street line,
   * dark tuff with red tuff present rather than absent, carved surrounds and forged
   * iron, no snow peak, no dome as the subject, no ruin and no rubble. The two
   * findings it did raise — the photographic register and the narrow-thumbnail crop
   * — are recorded against its `IMAGES` entry above, not fixed by editing the asset.
   */

  /*
   * §57. Amberd Fortress — the eleventh Place, the third `historical` site, and the
   * tenth time this list has filled.
   *
   * Every one of the forty files under `public/` was opened rather than read off its
   * filename, and none of them shows what this article is about: a ruined stone
   * castle on a rock spur with a gorge on either side, a broken wall circuit with the
   * stumps of its towers, a bathhouse shell, and one small domed church standing
   * whole beside all of it, high on the flank of a volcano.
   *
   * Five substitutions were available and each is recorded as refused, because two of
   * them are the closest near misses this list has ever had to turn down.
   *
   * `places/tatev-monastery.webp` is the sharpest by a distance, and it would pass
   * more than a glance. It is a walled enclosure on a promontory above a gorge, in
   * grey stone, seen from the air — which is a fair description of Amberd's *setting*
   * and of nothing else in the frame. What is inside those walls is a complete
   * thirteenth-century monastery in Syunik with a conical-domed church at its centre
   * and no ruin anywhere; Amberd is a secular fortress in Aragatsotn whose castle is
   * a roofless shell. Using it here would illustrate "Armenian complex on a spur" and
   * caption a living monastery as a ruined stronghold, which is the exact conflation
   * this article's own significance section exists to prevent — that the Armenian
   * Middle Ages survive above ground almost only as churches.
   *
   * `history/bagratid-armenia.webp` is the second, and it is the one a search for
   * "Armenian fortress above a gorge" would return first. It is Ani: a walled
   * medieval *city* on a steppe plateau above a river gorge, with domed churches
   * inside the circuit and a gate tower in the foreground. It is the right kingdom
   * and the right century — Amberd's Pahlavuni section is about the court at Ani —
   * and it is a capital rather than a highland stronghold. It is also already the
   * refused substitute of record for Gyumri (§51), which is the point: one picture
   * cannot be the stand-in for a city, a settlement article and a fortress.
   *
   * `places/erebuni-fortress.webp` is excluded on principle rather than resemblance,
   * on the rule this list has followed since §39: it is the other `historical` place,
   * and lending one site's cover to another under the same filter pill is the
   * substitution this list exists to stop. On resemblance it fails anyway — an
   * excavated Urartian citadel at foundation level, beside a modern suburb on a dry
   * plain, some eighteen centuries older than anything Amberd's article is about.
   *
   * `places/geghard-monastery.webp` offers a stone complex in a gorge and
   * `places/garni-temple.webp` a monument on a promontory with mountains falling away
   * behind it. Both are Kotayk, both are the wrong building type, and Garni is a
   * classical peristyle roughly a millennium older than the castle here.
   *
   * Also refused in advance, because they are what a brief would drift towards: the
   * Vahramashen church alone, which is the photogenic building and which this article
   * spends a section arguing is a component and not the subject; a European castle
   * with a keep, a moat or a gatehouse, which the prose explicitly says Amberd is not;
   * a snow-covered summit of Aragats, which would make a mountain article of a
   * fortress one; and anything showing visitors, signage or the car park, since the
   * coordinate note in `geo.ts` spent a paragraph excluding exactly that ground.
   *
   * What a commission would have to carry, recorded now so it is not reconstructed
   * later: a triangular rock spur with a gorge falling away on both sides and the two
   * converging below the point; a roofless three-storey block of dark mortared basalt
   * at the tip of it; broken wall stretches and the stumps of semicircular towers
   * across the landward neck; a small twelve-sided drum with an umbrella roof on a
   * complete church set apart from the castle, smaller in the frame than the castle
   * is; treeless volcanic slopes rising behind, no forest and no snow peak as the
   * subject; no roof on the castle, no reconstruction, no flags, no figures in
   * period costume, no siege, and no lettering anywhere.
   *
   * §57→§58. Emptied for the tenth time. The refusals above are kept rather than
   * deleted, on the same principle as the Lake Sevan three, the Garni three, the
   * Geghard five, the Dilijan four and the Gyumri five: the failure they guard
   * against is the cover being repointed at a plausible neighbour later, and that
   * outlives the file landing. `tatev-monastery.webp` in particular is still a
   * walled complex on a promontory above a gorge and still a complete monastery,
   * and `bagratid-armenia.webp` is now the refused substitute of record for two
   * articles rather than one.
   *
   * The delivered file answers the commission on every point, which is why it is
   * registered and none of the five substitutes ever was: a spur with a gorge on
   * both sides converging below the point, a roofless castle of dark coursed
   * masonry at the tip, broken wall and tower stumps across the landward neck, one
   * small domed church set apart and smaller in the frame than the castle, treeless
   * volcanic slopes behind, and no roof, no reconstruction, no figures and no
   * lettering. The three observations it did raise — the towers reading as solid
   * drums, the single-cone massif, and the pale fragment beside the church — are
   * recorded against its `IMAGES` entry above and in §58, not fixed by editing the
   * asset.
   */

  /*
   * §59. Jermuk — the twelfth Place, the second `settlement`, and the eleventh time
   * this list has filled.
   *
   * Every one of the forty-one files under `public/` was opened rather than read off
   * its filename, and none of them shows what this article is about: a small
   * twentieth-century town on a treeless highland plateau, split by a river gorge,
   * whose principal buildings are mid-century public architecture standing in
   * parkland above the cut. Armat has one urban image and it is the wrong city; it
   * has two gorges and neither has a town in it.
   *
   * Five substitutions were available and each is recorded as refused.
   *
   * `places/gyumri.webp` is the refusal on principle and the sharpest one, because
   * after this step the two files would sit under the same filter pill. It is the
   * only urban image in the registry — a wet street of two-storey nineteenth-century
   * tuff frontages with a phaeton and a church — and it is a Russian imperial city
   * of a hundred thousand people on an open plain in the north-west. Jermuk is a
   * Soviet resort of a few thousand on a plateau in the south-east. Lending one
   * settlement's cover to the other is exactly the substitution this list exists to
   * stop, and the fact that both are `settlement` is the reason it would look
   * defensible.
   *
   * `places/dilijan-national-park.webp` is the closest *conceptual* near miss and
   * the one an argument could be built for: Dilijan is the other Armenian town whose
   * history is a mineral-water spa, and this archive's own Dilijan article says so
   * in as many words. The file, though, is closed broadleaf forest on both walls of
   * a valley with a stream on its floor and not one building anywhere in the frame —
   * Tavush, wooded, at half Jermuk's altitude, and deliberately a picture of there
   * being no settlement in it. A resemblance between two articles is not a
   * resemblance between two pictures.
   *
   * `places/lake-sevan.webp` is the mood substitution in its usual form: highland
   * water under a big sky. It is open water, a pale drawdown shoreline and a lone
   * tree, in a different basin, and a lake is not a spring.
   *
   * `places/tatev-monastery.webp` and `places/geghard-monastery.webp` are the two
   * gorges. Tatev is the one a search would return first — a complex on a promontory
   * above a deep gorge in southern Armenia, which is the "both are in the south"
   * trap named in this step's own brief — and both are complete medieval monasteries,
   * which is the wrong subject in the wrong millennium.
   *
   * Also refused in advance, because they are what a brief would drift towards: the
   * waterfall alone, which is the photogenic thing here and is a feature of the gorge
   * rather than the town; a bottle, a label or any brand mark, which would illustrate
   * a product where a settlement belongs and would collapse the distinction the
   * article spends a section making; a sanatorium interior, a bath, a treatment or
   * anyone drinking the water, which would put a medical claim in the frame of an
   * article that carefully makes none; and a generic snow-peak-and-meadow landscape,
   * which would say nothing.
   *
   * What a commission would have to carry, recorded now so it is not reconstructed
   * later: a small highland town seen so that the gorge dividing it is legible;
   * mid-century public buildings in stone — long horizontal masses, colonnades, broad
   * stairs — set among planted parkland on the shelf above the cut; treeless volcanic
   * slopes and rounded ridges behind, no closed forest and no snow peak as the
   * subject; the settlement larger in the frame than any single building; no
   * waterfall as the subject, no water bottle, no brand, no figures in treatment, no
   * medical imagery and no lettering anywhere.
   *
   * §59→§60. Emptied for the eleventh time — and the only one of the eleven where
   * the delivered file does not answer the commission above.
   *
   * What landed is the waterfall alone: the first item on this entry's own
   * refused-in-advance list, chosen by a generator for the reason that list
   * predicted, which is that the cascade is the photogenic thing here and is what
   * the word "Jermuk" returns. It carries no town, no building and no built fabric
   * of any kind, so of the commission's six requirements it meets one — treeless
   * volcanic ground is at least partly visible above the gorge walls — and misses
   * the rest.
   *
   * It was registered anyway, as a deliberate editorial decision taken with the
   * mismatch stated, not as an oversight and not because the picture was mistaken
   * for the brief. The full reasoning sits against its `IMAGES` entry above and in
   * §60 of PROJECT_STATE.md, and the commission is deliberately left standing
   * rather than struck out: it is still the description of the picture this article
   * should have, and the entry reverses by moving one line back into this list.
   *
   * The five refusals above are kept for the usual reason — the failure they guard
   * against is the cover being repointed at a plausible neighbour later, and that
   * outlives the file landing. They are, if anything, more load-bearing now: with
   * an off-subject cover in place, `dilijan-national-park.webp` is exactly the kind
   * of substitution that would later look like an improvement.
   *
   * §61. **Resolved.** The off-subject file was replaced at the same path by one that
   * answers this commission on every point — the settlement on both rims of the
   * gorge, the mid-century public architecture in parkland, the colonnaded pavilion,
   * the treeless-to-scrubby highland ridges behind, the town larger in the frame than
   * any single building, and no waterfall as the subject. The paragraph above stands
   * as the record of what was registered in the interval; it is history now rather
   * than a live caveat, and the artwork debt §60 opened is closed.
   *
   * The commission text is still kept, unstruck, for the same reason the refusals
   * are: it is the description this slug was measured against twice, and it is what a
   * third attempt would be measured against if this file were ever replaced again.
   */

  /*
   * §64. Haghpat Monastery — Place #13, the twelfth time this list has filled, and
   * the first article in the archive about anywhere in Lori.
   *
   * All forty-one files under `public/` were opened rather than read off their
   * filenames, and none of them shows what this article is about: a walled monastic
   * complex of many separate volumes standing on a broad terrace above a deep river
   * gorge in the wooded north, with a domed tenth-century church at its centre, a
   * free-standing three-storey bell tower on the highest ground beside it, and a
   * village against its walls.
   *
   * The registry now holds four monasteries, and every one of them was considered
   * and refused. That is the point of writing this down: after §64 the `monastery`
   * pill contains five articles, and the temptation to treat their covers as
   * interchangeable will only grow.
   *
   * `places/tatev-monastery.webp` is the sharpest refusal by a wide margin, and it
   * is the same file that Amberd had to turn down in §57 for a different reason. It
   * shows a walled grey-stone complex on a promontory above a gorge, seen from the
   * air, with a conical-domed church at its centre — which is a fair description of
   * Haghpat's *shape* and of the wrong monastery. Tatev is in Syunik, on a bare
   * plateau above the Vorotan, and its silhouette is dominated by one tall drum;
   * Haghpat is in Lori, in wooded country, and its whole argument is that no single
   * volume dominates. Two monasteries that answer to the same one-line description
   * are exactly what an exact-ownership test exists to keep apart.
   *
   * `places/geghard-monastery.webp` is the second, and it is dangerous because both
   * sites sit in a gorge and both are World Heritage. Geghard's frame is a cliff
   * face with rock-cut chambers driven into it and a small built church below —
   * architecture that is subtracted from the mountain rather than raised on a
   * terrace. Nothing at Haghpat is rock-cut.
   *
   * `places/khor-virap.png` is the mood substitution: a monastery on a hill under a
   * mountain, warm light, the most reproduced image in the country. It is a single
   * walled enclosure with one church, on the flat Ararat plain, with Ararat filling
   * the horizon — no gorge, no north, no group of buildings.
   *
   * `places/etchmiadzin-cathedral.webp` is a working cathedral on level ground in a
   * town on the Ararat plain, and the wrong institution as well as the wrong place.
   *
   * Also refused in advance, because they are where a brief would drift. **Sanahin
   * is the one that must never be used**: it is four kilometres away, it shares this
   * monastery's World Heritage inscription, it is photographed from similar angles,
   * and a picture of it filed under Haghpat would be wrong in a way almost no reader
   * could catch — which is precisely why it is named here. Then: a generic Armenian
   * monastery with no identifying feature; a single church portrait, which would lose
   * the whole point of a complex built over three centuries; a Debed Canyon landscape
   * with the monastery small or absent; and any khachkar photographed as the subject.
   *
   * What a commission would have to carry, recorded now so it is not reconstructed
   * later: a walled monastic complex of several distinct volumes on a green terrace
   * high above a river gorge; a compact domed church with a many-sided drum and
   * triangular wall niches as the centre of the group; a free-standing three-storey
   * bell tower, square below and eight-sided above, on the highest ground; lower
   * halls and a refectory ranged around and between them so the group reads as
   * accumulated rather than composed; wooded ridges of the northern highlands
   * behind, not treeless volcanic slope and not a snow peak; the complex larger in
   * the frame than any single building in it; and no rock-cut chambers, no second
   * monastery on the far side of the gorge, no figures, and no lettering anywhere.
   *
   * §66. **Resolved.** The file that arrived answers this description item by item —
   * the free-standing bell tower on higher ground, the short heavy drum, the broad
   * gavit, the ranged lower halls, the rubble enclosure, the wooded Lori ridges, and
   * eight volumes with no single one dominant. Sanahin is absent: the only other
   * buildings in the frame are village houses with pitched roofs on the far
   * hillside, checked at magnification because that was the substitution no reader
   * could have caught. There is no lettering anywhere, and the carved surfaces stay
   * texture rather than resolving into writing.
   *
   * It missed the register. The commission asked for the painterly treatment the
   * other monastery covers use and what landed is photographic; it was registered
   * anyway, for the reason given beside its entry in `IMAGES` above. This list is
   * empty for the thirteenth time, and every Place in the archive now has a cover.
   */

  /*
   * §68. Spas — Cuisine #7, and the first entry on this list from outside Places.
   *
   * All six existing cuisine files were opened rather than read off their names, and
   * none of them is this dish — but the nearest one is nearer than expected, which is
   * why it is described here in detail rather than merely listed.
   *
   * `harissa.webp` is a pale cream-coloured grain dish in a clay bowl, with torn
   * lavash lying beside it and a lit hearth behind. Almost every element of that
   * sentence is also true of a plausible spas photograph, and the colour is not the
   * separator a first glance assumes: harissa is not meat-coloured. What actually
   * separates them is consistency and finish. Harissa is opaque and stiff enough to
   * hold the mark of a spoon, glossed with melted butter and threaded with shredded
   * chicken; spas is thin, white, sour, and its grain is suspended in liquid rather
   * than bound into a mass, with fresh green herbs on top that harissa has none of.
   * A borrowed harissa cover would not look absurd here, and that is exactly the kind
   * of substitution that survives review.
   *
   * `dolma`, `khorovats`, `lavash`, `gata` and `ghapama` are plainly other dishes.
   * Nothing outside `public/images/cuisine/` was considered: a Place cover under a
   * soup would be a category error before it was a subject one.
   *
   * What a commission would have to carry, written down now so it is not
   * reconstructed later: a bowl of white, faintly sour soup, thin enough to pour and
   * only slightly thickened, with cracked wheat visible suspended in it rather than
   * settled at the bottom; fresh green herbs strewn on top and not arranged; a plain
   * bowl on a plain surface. Bread may appear but must not be staged the way the
   * harissa cover stages it, and no hearth, fire or tonir may appear at all —
   * borrowing that setting is precisely how this file would end up looking like the
   * one next to it. Domestic and unstaged — this is the
   * one article in the section about ordinary weekday food, and the picture has to
   * say so. Explicitly refused in advance: restaurant styling, a swirl of cream, a
   * mint-sprig garnish placed for a photograph, the pale-and-wholesome lighting of
   * health-food photography, any tonir or hearth staging borrowed from `lavash`, and
   * lettering of any kind.
   *
   * §69 **Resolved.** The file that landed carries the commission: white fluid soup,
   * grain suspended rather than settled, herbs strewn rather than arranged, a plain
   * bowl on a plain table, no hearth and no lettering. It is registered above, with
   * the harissa comparison recorded there. Two things the commission did not ask for
   * arrived anyway and were kept: a side plate of raw dill and scallions, and a loaf
   * of wheat bread rather than lavash. Neither is staged as a recipe step.
   *
   * The list is empty again, and for the first time that sentence covers the whole
   * archive rather than only Places: every article in every section now has a cover.
   */

  /*
   * §70. Jingalov hats — Cuisine #8, and the second entry on this list from outside
   * Places. It arrives one step after the list was emptied, which is the normal
   * rhythm of this archive rather than a regression.
   *
   * All seven cuisine files were opened rather than read off their names. None of
   * them is this dish, and the refusals divide into two kinds.
   *
   * The near miss is `lavash.webp`: folded pale sheets of thin wheat bread on
   * linen, with the mouth of a tonir open in the background, a clay jug, ears of
   * wheat and a bowl of flour. Jingalov hats is also a thin sheet of wheat bread,
   * and a careless substitution would be defensible at a glance. It is refused
   * twice over. The whole subject of the new article is what is *inside* the bread,
   * and that cover shows bread with nothing in it; and the oven in the background
   * is the one method the new article exists partly to distinguish itself from.
   *
   * `spas.webp` is the second refusal and a subtler one: it is white, herbed and photographed cool, so it
   * shares this dish's palette without sharing anything else about it. A green-
   * flecked white bowl is not a green-filled bread. `dolma`, `khorovats`, `harissa`,
   * `gata` and `ghapama` are plainly other dishes.
   *
   * What a commission would have to carry, written down now so it is not
   * reconstructed later. One or two rounds of thin flatbread, cooked and blistered,
   * with dark scorch marks where the metal touched — and the filling legible: dense
   * chopped greens showing dark through the wrapper, and at least one round torn or
   * folded open so the layer of greens inside is visible rather than implied. That
   * torn round is the single non-negotiable element. A whole unbroken flatbread
   * photographed from above is a picture of a different dish.
   *
   * The setting should be domestic and regional: a plain board or cloth, daylight,
   * maybe a bowl of uncut greens beside it. Explicitly refused in advance: a tonir
   * or any oven-wall staging, which belongs to lavash and is the exact wrong method
   * for this bread; laminated or buttery pastry of any kind; a wedge cut from a pie;
   * anything that reads as a spinach turnover or a griddled cheese wrap; restaurant
   * plating, garnish arranged for a photograph, and the pale wholesome lighting of
   * health-food photography. No lettering, no flag, no landscape backdrop standing
   * in for the region — the greens are the regional content, and they are enough.
   *
   * Preferred geometry 1586×992, the archive's dominant one.
   *
   * §71 **Resolved.** The file that landed carries the commission, including the one
   * element it called non-negotiable: the bread is cut and both halves opened, so
   * the greens are visible rather than implied. It is registered above, with the
   * lavash comparison recorded there. Everything refused in advance stayed out —
   * no tonir or oven-wall staging, no laminated pastry, no cheese, no restaurant
   * plating, no arranged garnish, no lettering and no flag. The one thing the
   * commission did not ask for and got anyway is a bundle of raw herbs beside the
   * board, which reads as a table object rather than as a recipe step.
   *
   * The list is empty again, and for the second time that sentence covers the whole
   * archive rather than only Places: every article in every section has a cover.
   *
   * §72 reopened it, in the same place and for the same reason as §68 and §70: a
   * Cuisine article shipped ahead of its picture.
   */
  /*
   * §72. Khash, Cuisine #9, written ahead of its picture. Nothing in the archive
   * may be borrowed for it: `harissa.webp` is the wrong dish in a similar bowl,
   * `khorovats.webp` is the section's other meat cover, and `spas.webp` is a pale
   * broth photographed from above, which is the single most dangerous
   * substitution here because at card size it would pass.
   *
   * **The subject is the bowl.** A deep bowl of clear, hot, pale broth on a
   * winter morning table, steam visible, with the things that finish it beside
   * it: crushed garlic in a small dish, dried lavash for crumbling, salt, radish,
   * fresh greens. The article's whole argument is that the dish arrives
   * unfinished and the table completes it, so the accompaniments are not garnish
   * — they are half the subject, and a cover showing only a bowl would illustrate
   * a different article.
   *
   * **What must not be in the frame.** No graphic close-up of feet, hooves, head
   * or tripe: the article deliberately keeps the description of the parts brief
   * and unsensational, and a cover that does the opposite would contradict it.
   * No restaurant advertising — no branded plate, no menu card, no styled
   * hero-shot lighting. No bottle staged as the point of the picture; the alcohol
   * custom occupies two sentences of the article and must not occupy the cover.
   * No hangover joke, in any form. No recipe staging: no pot on a stove, no
   * ingredients laid out in a row, no step sequence, no measuring anything.
   *
   * **Atmosphere over drama.** Cold early light, a plain table, an ordinary
   * domestic or small-restaurant setting. Company may be implied — a second bowl,
   * a second pair of hands — but the frame belongs to the food, and a picture of
   * people at a party would be a picture of a party.
   *
   * Preferred geometry 1586×992, the archive's dominant one. Photographic
   * register, matching all eight existing Cuisine covers.
   *
   * §73 **Resolved.** The delivered file carries the commission, including the two
   * parts of it that were hardest to satisfy together: the bowl and the things
   * that finish it share the subject — lavash, crushed garlic, radish, greens are
   * all present and all secondary — and the animal parts stay non-graphic, with no
   * bone in the frame at all. Everything refused in advance stayed out: no hoof or
   * head close-up, no restaurant branding, no bottle or shot glass, no hangover
   * or wellness framing, no ingredient lineup, no measuring, no lettering, no flag
   * and no Ararat. The one element the commission did not ask for and got anyway
   * is the frosted window, which turned out to be the single best winter cue in
   * the file. It is registered above.
   *
   * The list is empty again, and for the third time that sentence covers the whole
   * archive rather than only Places: every article in every section has a cover.
   *
   * §74 reopened it a fourth time, in the same place and for the same reason.
   */
  /*
   * §74. Matsun, Cuisine #10, written ahead of its picture — and the first
   * pending entry in this section for something that is not a dish.
   *
   * **Nothing may be borrowed, and `spas.webp` is the specific danger.** Spas is
   * made of matsun, so the two are genuinely related and a substitution would
   * feel almost right — which is exactly why it must not happen. Spas is a fluid
   * soup with grain and green herbs suspended in it. Matsun is a set, plain,
   * white mass with no inclusions at all. A cover that showed anything floating
   * in it would be illustrating the wrong article.
   *
   * **The subject is the set curd itself.** A plain ceramic bowl of thick white
   * fermented milk, its surface showing the characteristic broken, slightly
   * uneven set of something that gelled in place rather than being stirred
   * smooth — ideally with a spoon-mark or a cut edge holding its shape, because
   * that texture is the whole visual argument for what fermentation did. Cool
   * even daylight, an ordinary table, bread nearby if anything at all is.
   *
   * **What must not be in the frame.** No commercial yogurt packaging of any
   * kind: no printed tub, no foil lid, no label, no branded pot. No fruit, no
   * honey drizzle, no granola, no berry garnish — that is a Western breakfast
   * product and this is not one. No wellness or probiotic styling: no supplement
   * imagery, no clinical white staging, no measuring. No recipe staging, no
   * ingredient lineup, no thermometer. No herbs or grain floating in it, for the
   * reason above.
   *
   * Preferred geometry 1586×992. Photographic register, matching all nine
   * existing Cuisine covers.
   *
   * §75 **Resolved.** The file that landed carries the commission on its one hard
   * point: the set curd itself is the subject, with a spoon lifting a lump that
   * holds its shape and a thin ring of whey around a mass that stands above it.
   * Nothing floats in it — a numeric sweep of the bowl interior found zero
   * green-biased pixels — so the spas substitution this note existed to prevent is
   * refused by the picture as well as by the registry. Everything refused in
   * advance stayed out: no tub, lid, label or branded pot, no fruit, honey or
   * granola, no wellness or clinical staging, no thermometer or ingredient lineup,
   * no grain and no herb. It is registered above, with the spas comparison and the
   * exposure measurements recorded there. The geometry came in at 1584×993 rather
   * than the 1586×992 asked for, which is recorded rather than corrected.
   *
   * The list is empty again, and for the fourth time that sentence covers the whole
   * archive rather than only Places: every article in every section has a cover.
   */
];

/**
 * A note on the file that did land for the Matenadaran, kept here because it is
 * the kind of thing that gets forgotten once a slug leaves the list above.
 *
 * `matenadaran.webp` renders the facade in pale grey where the building — and
 * this archive's own prose, three times over — describes dark basalt. Everything
 * else about it is right, so it was registered as delivered rather than altered,
 * and the discrepancy is recorded in §36 of PROJECT_STATE.md. It is still open.
 */

/** Path under `public/` for a slug's artwork, or `undefined` when none ships. */
export function getImageSrc(slug: string): string | undefined {
  return IMAGES[slug];
}

/** The whole registry, for the validation script. */
export function getImageRegistry(): Readonly<Record<string, string>> {
  return IMAGES;
}

/**
 * An article's cover: content-declared photography wins, and the shipped artwork
 * is the fallback. Nothing here falls back across locales — `src` is
 * locale-independent by construction.
 */
export function getArticleImageSrc(article: Pick<ArticleSummary, "slug" | "image">): string | undefined {
  return article.image?.src ?? getImageSrc(article.slug);
}

/**
 * Provenance of the shipped artwork, recorded in one place.
 *
 * Every file in `IMAGES` is AI-generated: an imagined picture, not a photograph
 * and not a scan of a historical work. Nothing in the repo said so before, which
 * is the gap this closes — the caption reads its wording from the locale's UI
 * dictionary, but the *fact* lives here, beside the files it describes, and is
 * locale-independent for the same reason the paths are.
 *
 * The failure it guards against is specific and real: a student taking the
 * portrait on Թումանյան's page for a photograph of him, when photographs of him
 * exist. So the caption says "AI-generated" outright rather than only "not a
 * photograph".
 *
 * One provenance covers the whole registry today. A real, credited image still
 * wins per article — set `image: { src, alt, credit }` on that `Article` and both
 * the file here and this AI provenance give way to the credit line.
 */
export const ARTWORK_PROVENANCE = {
  /** How every registry image was produced. */
  source: "ai-generated",
  /** None of it is offered as documentary — no photograph, no historical scan. */
  documentary: false,
} as const;

/**
 * True when an article renders the shared AI-generated artwork rather than a
 * content-declared image. This is what gates the AI caption: a future article
 * carrying a real credited `image` is not generated and must not claim to be.
 */
export function isGeneratedArtwork(article: Pick<ArticleSummary, "slug" | "image">): boolean {
  return !article.image && getImageSrc(article.slug) !== undefined;
}

/**
 * How a generated portrait's face was arrived at.
 *
 * `ARTWORK_PROVENANCE` above says the one thing true of every file here — it is
 * AI-generated and it is not a document. This says the one thing that is *not*
 * uniform across the portraits, and it exists because the difference is a
 * factual claim rather than a shade of wording:
 *
 *   - `imagined` — no contemporary likeness of the subject survives, or none
 *     informed the artwork. The face is invented. Grigor Narekatsi, who died
 *     around 1003, is the case this was written for: nobody has ever seen him.
 *   - `photo-referenced` — photographs of the subject survive and were used as
 *     likeness references. The face is not invented; it is also not a
 *     photograph, and the caption has to say both.
 *
 * Captioning a photo-referenced portrait "an imagined likeness" would be false,
 * and captioning an imagined one "based on surviving photographs" would be worse
 * — so this is a map rather than a category rule, and rendering asks it by slug
 * instead of testing for a name.
 *
 * **The default is `imagined`, deliberately.** It is the more cautious of the
 * two claims: it never asserts a photographic basis that the repository has not
 * recorded. Several of the modern writers here were certainly photographed, and
 * their portraits may well have been made with those photographs in view — but
 * this archive never recorded that, and inferring it now would be inventing
 * provenance rather than reporting it. A slug joins this map when someone
 * establishes the fact, not when it seems likely.
 */
export type PortraitProvenance = "imagined" | "photo-referenced";

const PORTRAIT_PROVENANCE: Record<string, PortraitProvenance> = {
  /*
   * §85. Three surviving lifetime photographs were consulted for this one — the
   * 1913 Constantinople studio portrait, the standing portrait against a
   * pilaster, and the photograph filed under his birth surname — and the
   * delivered artwork agrees with all three on hair, moustache, face length,
   * nose, age and pose. That is a matter of record, so the caption may say it.
   */
  "daniel-varoujan": "photo-referenced",
};

/** A portrait's likeness basis. Unlisted slugs are `imagined` — see above. */
export function getPortraitProvenance(slug: string): PortraitProvenance {
  return PORTRAIT_PROVENANCE[slug] ?? "imagined";
}

/**
 * `sizes` hints per slot, so the browser never downloads a 1600px file for a
 * 128px search thumbnail. Wrong values here cost bandwidth, not correctness.
 */
export const IMAGE_SIZES = {
  /** Article hero, full content width. */
  hero: "(min-width: 1280px) 1152px, 100vw",
  /** Listing card, three to a row on desktop. */
  card: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  /** Homepage compact card, six to a row. */
  compact: "(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw",
  /** Featured block, half the page. */
  featured: "(min-width: 768px) 50vw, 100vw",
  /** Search result thumbnail. */
  thumb: "(min-width: 1024px) 160px, 128px",
  /** Work card's fixed-width side panel. */
  side: "(min-width: 640px) 208px, 100vw",
} as const;

/**
 * Focal point for the narrow portrait crops.
 *
 * The writer artwork is landscape: the figure sits left of centre with headroom
 * above. Centring a 4:3 or taller crop on it cuts the face in half, so these
 * slots bias the crop up and to the left.
 */
export const PORTRAIT_FOCUS = "object-[38%_28%]";
