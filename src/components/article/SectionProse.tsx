import Link from "next/link";
import type { ReactNode } from "react";
import type { ArticleSection, Locale } from "@/data/types";
import { getAllArticles } from "@/lib/content";
import { localePath } from "@/lib/i18n";

/**
 * Renders one article section's paragraphs, turning its declared contextual
 * links into real anchors.
 *
 * The content model keeps prose as plain strings and declares links out of band
 * (`ArticleSection.links`), so this is where the two meet. Three rules make the
 * result predictable, and `validate:content` enforces the preconditions for all
 * three at build time:
 *
 *   1. **One link per declaration.** Only the first occurrence of a phrase in the
 *      section becomes an anchor. A word that recurs in five paragraphs is linked
 *      once, which is what a reader expects and what keeps the link count honest.
 *   2. **No automatic linking.** Nothing is matched that an editor did not name
 *      for this section. There is no site-wide keyword map, so a phrase can never
 *      acquire a link on a page where the link would be wrong.
 *   3. **No links to nothing.** A slug is resolved against *this* locale's
 *      articles and skipped if absent, so a target that exists only in Armenian
 *      renders as plain text in the other editions rather than as a dead link.
 *      The validator already rejects a slug missing from every edition.
 *
 * Matching is a plain substring search, which is why the validator also requires
 * a minimum phrase length: nothing here can tell a whole word from a word
 * fragment in Armenian, so the safeguard has to be the length of what an editor
 * is allowed to declare.
 */
export function SectionProse({
  locale,
  section,
  selfSlug,
}: {
  locale: Locale;
  section: ArticleSection;
  /** The article being rendered, so it can never link to itself. */
  selfSlug: string;
}) {
  const targets = resolveTargets(locale, section, selfSlug);

  // Consumed as we go: once a phrase has been linked, later paragraphs see the
  // plain string. Rebuilt per render, never shared across sections.
  const pending = new Map(targets);

  return (
    <>
      {section.paragraphs.map((paragraph, index) => (
        <p key={index}>{linkParagraph(paragraph, pending)}</p>
      ))}
    </>
  );
}

/** Phrase → locale-prefixed href, longest phrase first so nesting cannot occur. */
function resolveTargets(
  locale: Locale,
  section: ArticleSection,
  selfSlug: string,
): [string, string][] {
  if (!section.links?.length) return [];

  const articles = getAllArticles(locale);

  return section.links
    .filter((link) => link.slug !== selfSlug)
    .flatMap((link) => {
      const target = articles.find((article) => article.slug === link.slug);
      if (!target) return [];
      return [[link.phrase, localePath(locale, target.href)] as [string, string]];
    })
    .sort((a, b) => b[0].length - a[0].length);
}

/**
 * Splits one paragraph on the first still-pending phrase it contains, links that
 * occurrence, and recurses into the remainder so a paragraph can carry more than
 * one link.
 */
function linkParagraph(text: string, pending: Map<string, string>): ReactNode {
  for (const [phrase, href] of pending) {
    const at = text.indexOf(phrase);
    if (at === -1) continue;

    pending.delete(phrase);

    return (
      <>
        {text.slice(0, at)}
        <Link
          href={href}
          className="text-burgundy underline decoration-burgundy/30 underline-offset-2 transition hover:decoration-burgundy"
        >
          {phrase}
        </Link>
        {linkParagraph(text.slice(at + phrase.length), pending)}
      </>
    );
  }

  return text;
}
