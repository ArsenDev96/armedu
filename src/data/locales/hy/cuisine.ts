import type { Filter } from "@/data/types";

/**
 * Dish-type filters for the cuisine listing.
 *
 * Five categories, each of which answers a question a reader actually asks —
 * is this bread, a main course, a meat dish, something made for a feast or a
 * commemoration, or something sweet. Ids are shared across the three editions,
 * as with every other filter list; only the labels are translated.
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
];
