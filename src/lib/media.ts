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
};

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
