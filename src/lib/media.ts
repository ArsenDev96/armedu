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
