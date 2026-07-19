import type { Category, Filter, TimelineEntry } from "@/data/types";

export const categories: Category[] = [
  {
    id: "history",
    title: "Armenian History",
    description:
      "Explore important periods, kingdoms, people, battles and events, from the fortresses of Urartu to the First Republic.",
    href: "/history",
    linkLabel: "View History",
    imageSeed: "category-history",
    image: "/category-history.png",
  },
  {
    id: "writers",
    title: "Armenian Writers",
    description:
      "Learn about the lives and works of Armenia's most influential writers, and how their books shaped the language we read today.",
    href: "/writers",
    linkLabel: "View Writers",
    imageSeed: "category-writers",
    image: "/category-writers.png",
  },
  {
    id: "works",
    title: "Literary Works",
    description:
      "Read summaries, historical context, characters and key ideas from the works that Armenian students meet in every classroom.",
    href: "/works",
    linkLabel: "View Works",
    imageSeed: "category-works",
    image: "/category-works.png",
  },
];

export const timeline: TimelineEntry[] = [
  {
    id: "urartu",
    period: "9th–6th c. BC",
    title: "Kingdom of Urartu",
    description:
      "A powerful state around Lake Van builds the fortress cities — including Erebuni, the ancestor of Yerevan — that mark the beginning of recorded history on the Armenian Highland.",
  },
  {
    id: "artaxiad",
    period: "189 BC – 12 AD",
    title: "Artaxiad Dynasty",
    description:
      "Artashes I founds an independent kingdom; under Tigran the Great it briefly stretches from the Caspian Sea to the Mediterranean.",
  },
  {
    id: "christianity",
    period: "301 AD",
    title: "Adoption of Christianity",
    description:
      "King Trdat III adopts Christianity as the religion of the Armenian state, a decision that reshapes Armenian art, architecture and identity.",
  },
  {
    id: "avarayr",
    period: "451 AD",
    title: "Battle of Avarayr",
    description:
      "Vardan Mamikonian leads Armenian forces against the Sasanian army in defence of religious freedom — a military defeat that secures a political victory.",
  },
  {
    id: "bagratid",
    period: "885–1045 AD",
    title: "Bagratid Armenia",
    description:
      "A restored kingdom flourishes around its capital Ani, the city of a thousand and one churches and one of the largest cities of its age.",
  },
  {
    id: "first-republic",
    period: "1918–1920",
    title: "First Republic of Armenia",
    description:
      "After centuries without statehood, an independent Armenian republic is declared — short-lived, but the direct predecessor of the republic of today.",
  },
];

export const historyPeriods: Filter[] = [
  { id: "all", label: "All topics" },
  { id: "ancient", label: "Ancient Armenia" },
  { id: "kingdoms", label: "Armenian Kingdoms" },
  { id: "medieval", label: "Medieval Armenia" },
  { id: "modern", label: "Modern Armenia" },
  { id: "people", label: "Important People" },
  { id: "battles", label: "Battles and Events" },
];
