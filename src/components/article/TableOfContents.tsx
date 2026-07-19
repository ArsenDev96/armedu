import type { ArticleSection } from "@/data/types";

export function TableOfContents({
  sections,
  extra = [],
}: {
  sections: ArticleSection[];
  extra?: { id: string; heading: string }[];
}) {
  const items = [...sections.map((s) => ({ id: s.id, heading: s.heading })), ...extra];

  return (
    <nav aria-labelledby="toc-heading" className="rounded-2xl border border-line bg-surface p-5">
      <h2 id="toc-heading" className="font-sans text-xs font-semibold tracking-[0.16em] text-ink-3 uppercase">
        Table of contents
      </h2>
      <ol className="mt-4 space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block leading-snug text-ink-2 transition hover:text-burgundy"
            >
              {item.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
