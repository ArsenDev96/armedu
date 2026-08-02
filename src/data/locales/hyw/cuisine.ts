import type { Filter } from "@/data/types";

/** Dish-type filters for the cuisine listing. See the `hy` file for the rationale. */
export const cuisineTypes: Filter[] = [
  { id: "all", label: "Բոլոր կերակուրները" },
  { id: "bread", label: "Հաց" },
  { id: "main", label: "Հիմնական կերակուրներ" },
  { id: "meat", label: "Մսեղէն կերակուրներ" },
  { id: "ceremonial", label: "Ծիսական կերակուրներ" },
  { id: "dessert", label: "Անուշեղէն" },
];
