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
