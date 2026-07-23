Continue the Western Armenian (hyw) translation work in d:\armedu. Read section 15 of
PROJECT_STATE.md first — it has the full checklist and the current state.

Context: 2 of 8 declared-unavailable hyw articles are done (kingdom-of-urartu,
bagratid-armenia). The repo is green — typecheck, validate:content and build all pass.
Content is at 70 entries.

Translate the remaining 6, one at a time, from the Eastern Armenian (hy) versions:
- history: first-republic-of-armenia
- writers: raffi, avetik-isahakyan, khachatur-abovyan
- works: wounds-of-armenia, the-fool

For each article:
1. Add the Article to src/data/locales/hyw/articles/<category>.ts. Keep the canonical
   slug/href/imageSeed. Add a `keywords` array using WESTERN transliterations
   (Dikran, Mesrob Mashdots, Sasna Dzerer, Barouyr Sevag) alongside the dominant
   Eastern spelling where a reader would plausibly type either.
2. Writers and works ALSO need a matching entry in src/data/locales/hyw/writers.ts
   (Writer) or hyw/works.ts (LiteraryWork). The article alone is not enough —
   buildSearchIndex joins them by slug. This is not yet done for any of the 4 remaining.
3. Remove the slug from DECLARED_UNAVAILABLE in scripts/validate-content.ts.
4. Check relatedSlugs — the validator rejects links to articles not published in this
   locale. IMPORTANT: bagratid-armenia's third relatedSlug is temporarily
   "tigran-the-great"; once first-republic-of-armenia is translated, restore it to
   "first-republic-of-armenia" to match the hy edition.
5. Run: npm run validate:content && npm run typecheck && npm run build

Write real Western Armenian, not a find-and-replace of the Eastern text. Classical
orthography (-ութիւն, -ուած, spelled-out եւ), Western verb morphology (կը գտնուի,
ցոյց կու տայ, կ՚արտասանուի), Western vocabulary (մատենադարան, կոթիք, սելճուքեան,
ԵՈՒՆԵՍՔՕ) and Western proper nouns (Յովհաննէս, Պաղտատ, Սուրբ Սոփիա, Բագրատունեաց).
The easternOrthographyMarker guard only catches և and ություն — it will not catch bad
Western Armenian, so do not rely on it.

These translations are unreviewed machine output. Keep the native-speaker-review warning
in PROJECT_STATE.md §15 accurate, and update the done/remaining lists as you go.

Do not commit unless I ask.
