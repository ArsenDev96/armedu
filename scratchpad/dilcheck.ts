/**
 * Throwaway field-shape probe for one slug, used while writing the ninth Place.
 *
 * `scratchpad/check.ts` compares editions against each other; this prints the
 * things a single edition has to satisfy on its own — the validator's length
 * budgets for `seoTitle`, `metaDescription` and `summary`, and the numeral
 * multiset per field group so the two Armenian editions can be written against
 * an explicit list rather than by rereading the English prose.
 */
import { SUPPORTED_LOCALES, type Locale } from "../src/data/types";
import { getLocaleBundle } from "../src/data";

const slug = process.argv[2] ?? "dilijan-national-park";
const nums = (t: string) => (t.match(/\d{2,}/g) ?? []).sort();

for (const locale of SUPPORTED_LOCALES as readonly Locale[]) {
  const a = getLocaleBundle(locale).articles.find((x) => x.slug === slug);
  if (!a) {
    console.log(`\n### ${locale}: not written yet`);
    continue;
  }
  console.log(`\n### ${locale}`);
  console.log("  seoTitle        ", a.seoTitle?.length, "(budget <= 52)", JSON.stringify(a.seoTitle));
  console.log("  metaDescription ", a.metaDescription?.length, "(budget 70-165)");
  console.log("  summary words   ", a.summary?.trim().split(/\s+/).length, "(budget 40-140)");
  console.log("  excerpt         ", a.excerpt.length);
  console.log("  sections        ", a.sections.length, "paras:", a.sections.map((s) => s.paragraphs.length).join(","));
  console.log("  ids             ", a.sections.map((s) => s.id).join(","));
  console.log("  keyFacts/dates/facts/figures", a.keyFacts.length, a.importantDates.length, a.interestingFacts.length, a.relatedFigures.length);
  console.log("  N intro         ", nums(a.intro).join(" "));
  console.log("  N summary       ", nums(a.summary ?? "").join(" "));
  console.log("  N seoTitle      ", nums(a.seoTitle ?? "").join(" "));
  console.log("  N metaDescr     ", nums(a.metaDescription ?? "").join(" "));
  console.log("  N keyFacts      ", a.keyFacts.flatMap((f) => nums(f.value)).sort().join(" "));
  console.log("  N importantDates", a.importantDates.flatMap((d) => nums(`${d.year} ${d.event}`)).sort().join(" "));
  console.log("  N sections      ", a.sections.flatMap((s) => s.paragraphs.flatMap(nums)).sort().join(" "));
  console.log("  N interesting   ", a.interestingFacts.flatMap(nums).sort().join(" "));
  console.log("  N relatedFigures", a.relatedFigures.flatMap((f) => nums(f.lifespan)).sort().join(" "));
}
