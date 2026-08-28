import type { Filter } from "@/data/types";

/**
 * Dish-type filters for the cuisine listing.
 *
 * Six categories, each of which answers a question a reader actually asks —
 * is this bread, a main course, a meat dish, something made for a feast or a
 * commemoration, something sweet, or a dairy food. Ids are shared across the
 * three editions, as with every other filter list; only the labels are
 * translated.
 *
 * `dairy` is the first id added since the section was built, at §74, and it was
 * added because the alternative was worse. Matsun is a fermented milk product,
 * not a main course, and filing it under `main` to avoid touching this list
 * would have encoded a classification the article itself contradicts. It is
 * scoped narrowly on purpose: dairy foods in their own right — matsun, the
 * cheeses, chortan — and not every dish that happens to contain milk. Spas
 * contains matsun and stays `main`, because spas is a soup.
 *
 * The list is not allowed to grow ahead of the archive. There is no `drink` id
 * waiting for tan, and there should not be one until a drink article exists:
 * `validate:content` fails any filter that matches no article, which is what
 * keeps this honest.
 *
 * Deliberately no filters for region or century. Both would have to assign a
 * single origin to dishes whose origins are shared or unsettled, which is the
 * one claim this section refuses to make.
 */
export const cuisineTypes: Filter[] = [
  { id: "all", label: "Բոլոր ուտեստները" },
  { id: "bread", label: "Հաց" },
  { id: "main", label: "Հիմնական ուտեստներ" },
  { id: "meat", label: "Մսեղեն ուտեստներ" },
  { id: "ceremonial", label: "Ծիսական ուտեստներ" },
  { id: "dessert", label: "Անուշեղեն" },
  { id: "dairy", label: "Կաթնամթերք" },
];
