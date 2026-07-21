import type { Filter, Writer } from "@/data/types";

export const writers: Writer[] = [
  {
    slug: "hovhannes-tumanyan",
    name: "Hovhannes Tumanyan",
    lifespan: "1869–1923",
    period: "19th Century",
    periodId: "19th-century",
    role: "Poet and storyteller",
    description:
      "Often called the poet of all Armenians, Tumanyan turned village life, folk tales and legends into poetry that is still read in every Armenian classroom.",
    imageSeed: "hovhannes-tumanyan",
    notableWorks: ["Anush", "The Capture of Tmkaberd", "Gikor", "A Drop of Honey"],
    featured: true,
  },
  {
    slug: "yeghishe-charents",
    name: "Yeghishe Charents",
    lifespan: "1897–1937",
    period: "20th Century",
    periodId: "20th-century",
    role: "Poet and modernist",
    description:
      "The defining voice of twentieth-century Armenian poetry, who combined modernist experiment with an intense attachment to his homeland.",
    imageSeed: "yeghishe-charents",
    notableWorks: ["Book of the Road", "Dantesque Legend", "I Love the Sun-Savoured Word of My Sweet Armenia"],
  },
  {
    slug: "raffi",
    name: "Raffi",
    lifespan: "1835–1888",
    period: "19th Century",
    periodId: "19th-century",
    role: "Novelist",
    description:
      "The founder of the Armenian historical novel, whose books shaped how a whole generation understood its own past and future.",
    imageSeed: "raffi",
    notableWorks: ["The Fool", "Samvel", "David Bek", "Sparks"],
  },
  {
    slug: "avetik-isahakyan",
    name: "Avetik Isahakyan",
    lifespan: "1875–1957",
    period: "20th Century",
    periodId: "20th-century",
    role: "Poet",
    description:
      "A lyric poet of exile and longing whose songs entered Armenian popular memory, admired abroad by writers including Alexander Blok.",
    imageSeed: "avetik-isahakyan",
    notableWorks: ["Abu Lala Mahari", "Songs and Wounds", "The Ballad of Sasma Mher"],
  },
  {
    slug: "khachatur-abovyan",
    name: "Khachatur Abovyan",
    lifespan: "1809–1848",
    period: "19th Century",
    periodId: "19th-century",
    role: "Writer and educator",
    description:
      "The father of modern Armenian literature, who wrote the first novel in the spoken language and worked to make schooling accessible.",
    imageSeed: "khachatur-abovyan",
    notableWorks: ["Wounds of Armenia", "Nakhashavigh", "Parables"],
  },
  {
    slug: "paruyr-sevak",
    name: "Paruyr Sevak",
    lifespan: "1924–1971",
    period: "Soviet Era",
    periodId: "soviet",
    role: "Poet and scholar",
    description:
      "A poet of conscience and memory whose long poem The Unsilenceable Belfry brought the events of 1915 back into public conversation.",
    imageSeed: "paruyr-sevak",
    notableWorks: ["The Unsilenceable Belfry", "Let There Be Light", "Man in the Palm of the Hand"],
  },
];

export const literaryPeriods: Filter[] = [
  { id: "all", label: "All periods" },
  { id: "medieval", label: "Medieval" },
  { id: "19th-century", label: "19th century" },
  { id: "20th-century", label: "20th century" },
  { id: "soviet", label: "Soviet era" },
  { id: "contemporary", label: "Contemporary" },
];
