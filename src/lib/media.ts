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
   * reader's first visit; and it is a 1.4 MB PNG where the rest of the registry
   * is 110–160 KB WebP, so this slug's card and hero are the heaviest images on
   * the site. Neither file is altered, optimised or renamed here — replacing this
   * entry with a lighter, place-specific WebP is a later piece of work, and it is
   * a one-line change because every consumer already asks `getImageSrc`.
   *
   * `Hero.tsx` still points at `/hero-ararat.png` directly and is untouched.
   */
  "khor-virap": "/images/places/khor-virap.png",
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
   * No file in `public/` depicts this cathedral. The two candidates were both
   * rejected rather than stretched to fit. `hero-ararat.png` is the Khor Virap
   * hill under Ararat — a different building thirty kilometres away, and reusing
   * it here would caption one monastery with another. `history/adoption-of-
   * christianity.webp` is the baptism scene: a generic Armenian church sits in
   * its background, but the focal subject is the two figures, and the church is
   * not Etchmiadzin. Registering either would put a false claim under a picture,
   * which is the failure `ARTWORK_PROVENANCE` exists to prevent.
   *
   * So the slug is declared here and `ArticleLayout` renders the generated
   * placeholder with `imagePlaceholderCaption`, exactly as Khor Virap's did
   * before its artwork landed. `isGeneratedArtwork` stays false, so nothing is
   * captioned AI-generated without cause, and `validate:content` prints the debt
   * on every run.
   */
  "etchmiadzin-cathedral",
];

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
