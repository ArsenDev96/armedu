import { expect, test, type Page } from "@playwright/test";
import { LOCALES, cards, hasArticle, ui } from "./helpers";

/**
 * Structured-data invariants.
 *
 * These lock down what a crawler is told, which is exactly the class of thing no
 * reader ever sees and so no other test would catch. The hreflang guards and the
 * `noindex` on the untranslated page live in `locale.spec.ts`; this file owns the
 * JSON-LD graph and `x-default`.
 *
 * The rule the whole suite defends: a page carries at most one JSON-LD graph, it
 * is valid JSON, and the untranslated page — which is not an article — carries
 * none at all.
 */

type LdNode = { "@type"?: string; [key: string]: unknown };

/** The single JSON-LD graph on a page, or null when there is none. */
async function readGraph(page: Page): Promise<LdNode[] | null> {
  const blocks = page.locator('script[type="application/ld+json"]');
  const count = await blocks.count();

  // At most one block per page — two graphs are two chances to disagree.
  expect(count).toBeLessThanOrEqual(1);
  if (count === 0) return null;

  const raw = await blocks.first().textContent();
  const parsed = JSON.parse(raw ?? "") as { "@graph"?: LdNode[] };
  expect(parsed["@graph"]).toBeDefined();
  return parsed["@graph"] ?? [];
}

/** The `@type`s present in a graph, for order-independent membership checks. */
function types(graph: LdNode[]): string[] {
  return graph.map((node) => node["@type"]).filter((t): t is string => Boolean(t));
}

function node(graph: LdNode[], type: string): LdNode {
  const found = graph.find((n) => n["@type"] === type);
  if (!found) throw new Error(`No "${type}" node in the graph. Saw: ${types(graph).join(", ")}`);
  return found;
}

test("the home page carries a WebSite graph with a search action", async ({ page }) => {
  await page.goto("/hy");

  const graph = await readGraph(page);
  expect(graph).not.toBeNull();
  expect(types(graph!)).toEqual(expect.arrayContaining(["Organization", "WebSite"]));

  // The search box Google may surface must target this edition's search route.
  const website = node(graph!, "WebSite");
  const action = website.potentialAction as { target?: { urlTemplate?: string } };
  expect(action?.target?.urlTemplate).toContain("/hy/search?q=");
});

test("a listing page lists exactly the articles it renders", async ({ page }) => {
  await page.goto("/hy/history");

  const graph = await readGraph(page);
  expect(types(graph!)).toEqual(
    expect.arrayContaining(["CollectionPage", "BreadcrumbList"]),
  );

  // The ItemList count is a claim about the page; it must match the cards a
  // reader can actually click, or the structured data overstates the archive.
  const collection = node(graph!, "CollectionPage");
  const list = collection.mainEntity as { numberOfItems?: number; itemListElement?: unknown[] };
  const visible = await cards(page).count();
  expect(list.numberOfItems).toBe(visible);
  expect(list.itemListElement).toHaveLength(visible);
});

test("an article carries an Article node and a well-formed breadcrumb trail", async ({ page }) => {
  await page.goto("/hy/history/tigran-the-great");

  const graph = await readGraph(page);
  expect(types(graph!)).toEqual(expect.arrayContaining(["Article", "BreadcrumbList"]));

  const crumbs = node(graph!, "BreadcrumbList").itemListElement as {
    position: number;
    name: string;
    item?: string;
  }[];

  // Positions are 1-based and contiguous, and the last crumb is the current
  // page, which Schema.org expects to carry no `item`.
  crumbs.forEach((crumb, index) => expect(crumb.position).toBe(index + 1));
  expect(crumbs.at(-1)?.item).toBeUndefined();
  expect(crumbs.slice(0, -1).every((crumb) => Boolean(crumb.item))).toBe(true);
});

/**
 * The next two tests exercise the untranslated-article page. Since July 2026
 * every canonical article is translated in every edition, so no URL renders
 * that state any more and they self-skip. The machinery they defend
 * (`UnavailableTranslation`, its `noindex`, the withheld alternates) is still
 * live code — when a locale next declares a gap in `DECLARED_UNAVAILABLE`,
 * point `UNTRANSLATED` at it and the tests rearm themselves.
 */
const UNTRANSLATED = { locale: "hyw", category: "history", slug: "kingdom-of-urartu" } as const;
const untranslatedPath = `/${UNTRANSLATED.locale}/${UNTRANSLATED.category}/${UNTRANSLATED.slug}`;
const untranslatedExists = !hasArticle(UNTRANSLATED.locale, UNTRANSLATED.slug);

test("the untranslated page carries no structured data at all", async ({ page }) => {
  test.skip(!untranslatedExists, "every edition is fully translated; no untranslated page exists");

  // It is a real page but not an article; describing it as one is the exact
  // claim its `noindex` denies.
  await page.goto(untranslatedPath);

  await expect(page.getByRole("heading", { name: ui("hyw").unavailable.heading, level: 1 })).toBeVisible();
  expect(await readGraph(page)).toBeNull();
});

test("every indexable edition of a page advertises an x-default", async ({ page }) => {
  for (const locale of LOCALES) {
    await page.goto(`/${locale}`);
    const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
    await expect(xDefault).toHaveCount(1);
    // x-default points at the default edition, never at a redirect or a locale.
    await expect(xDefault).toHaveAttribute("href", /\/hy$/);
  }
});

test("x-default is omitted where the default edition cannot serve the page", async ({ page }) => {
  test.skip(!untranslatedExists, "every edition is fully translated; no untranslated page exists");

  // The untranslated page advertises no alternates of its own — including no
  // x-default that would point a stranded crawler at a `noindex` page.
  await page.goto(untranslatedPath);
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(0);
});
