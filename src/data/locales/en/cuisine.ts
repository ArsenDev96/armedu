import type { Filter } from "@/data/types";

/** Dish-type filters for the cuisine listing. See the `hy` file for the rationale. */
export const cuisineTypes: Filter[] = [
  { id: "all", label: "All dishes" },
  { id: "bread", label: "Bread" },
  { id: "main", label: "Main dishes" },
  { id: "meat", label: "Meat dishes" },
  { id: "ceremonial", label: "Ceremonial dishes" },
  { id: "dessert", label: "Desserts" },
  { id: "dairy", label: "Dairy" },
];
