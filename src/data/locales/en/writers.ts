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
      "A poet of conscience and memory whose long poem The Unsilenceable Belfry brought the Armenian Genocide back into public conversation.",
    imageSeed: "paruyr-sevak",
    notableWorks: ["The Unsilenceable Belfry", "Let There Be Light", "Man in the Palm of the Hand"],
  },
  {
    slug: "grigor-narekatsi",
    name: "Grigor Narekatsi",
    lifespan: "about 951–1003",
    period: "Medieval",
    periodId: "medieval",
    role: "Poet and theologian",
    description:
      "The monk of Narek whose Book of Lamentations became the most copied and most read work of classical Armenian literature, and the first medieval writer in this section.",
    imageSeed: "grigor-narekatsi",
    notableWorks: ["Book of Lamentations", "Commentary on the Song of Songs", "Odes and panegyrics"],
  },
  {
    slug: "daniel-varoujan",
    name: "Daniel Varoujan",
    lifespan: "1884–1915",
    period: "20th Century",
    periodId: "20th-century",
    role: "Poet and teacher",
    description:
      "The Western Armenian poet of Pagan Songs and The Song of the Bread, who enlarged what the literary language could do and was killed in 1915 at the age of thirty-one.",
    imageSeed: "daniel-varoujan",
    notableWorks: ["The Song of the Bread", "Pagan Songs", "The Heart of the Race"],
  },
  {
    slug: "nerses-shnorhali",
    name: "Nerses Shnorhali",
    lifespan: "about 1102–1173",
    period: "Medieval",
    periodId: "medieval",
    role: "Poet, hymnographer and Catholicos",
    description:
      "The twelfth-century poet of Cilicia who wrote a verse history of Armenia in a single rhyme, the Lament on Edessa, and hymns still sung today, and who led the Armenian church for the last seven years of his life.",
    imageSeed: "nerses-shnorhali",
    notableWorks: ["Lament on Edessa", "Jesus the Son", "I Confess with Faith"],
  },
  {
    slug: "siamanto",
    name: "Siamanto",
    lifespan: "1878–1915",
    period: "20th Century",
    periodId: "20th-century",
    role: "Poet and editor",
    description:
      "The Western Armenian poet born Atom Yarjanian, who gave Armenian free verse its form and wrote the Adana massacre of 1909 into poetry in the year it happened.",
    imageSeed: "siamanto",
    notableWorks: ["Կարմիր լուրեր բարեկամէս", "Հայորդիներ", "Հոգեվարքի և հույսի ջահեր", "Սուրբ Մեսրոպ"],
  },
  {
    slug: "hakob-paronyan",
    name: "Hakob Paronyan",
    lifespan: "1843–1891",
    period: "19th Century",
    periodId: "19th-century",
    role: "Satirist, playwright and editor",
    description:
      "The Constantinople satirist and playwright, known in English as Hagop Baronian, whose comedies and satirical journals made Ottoman Armenian city life a literary subject.",
    imageSeed: "hakob-paronyan",
    notableWorks: ["Պաղտասար աղբար", "Ազգային ջոջեր", "Մեծապատիվ մուրացկաններ", "Ատամնաբուժն արևելյան"],
  },
  {
    slug: "alexander-shirvanzade",
    name: "Alexander Shirvanzade",
    lifespan: "1858–1935",
    period: "19th Century",
    periodId: "19th-century",
    role: "Novelist and playwright",
    description:
      "The realist of oil-boom Baku, born Alexander Movsisyan, whose novels and plays made money, family and social standing the central subject of Armenian prose.",
    imageSeed: "alexander-shirvanzade",
    notableWorks: ["Նամուս", "Քաոս", "Պատվի համար", "Մորգանի խնամին"],
  },
  {
    slug: "aksel-bakunts",
    name: "Aksel Bakunts",
    lifespan: "1899–1937",
    period: "20th Century",
    periodId: "20th-century",
    role: "Prose writer, short-story writer and agronomist",
    description:
      "The short-story writer of the Armenian south, known in English also as Axel Bakunts, who was chief agronomist of Zangezur before his fiction made its mountains and villages a literary subject.",
    imageSeed: "aksel-bakunts",
    notableWorks: ["Մթնաձոր", "Ալպիական մանուշակ", "Միրհավ", "Կյորես"],
  },
];

export const literaryPeriods: Filter[] = [
  { id: "all", label: "All periods" },
  { id: "medieval", label: "Medieval" },
  // Title case, matching the writer cards these chips filter and the
  // `historyPeriods` list next door ("Ancient Armenia", "Medieval Armenia").
  { id: "19th-century", label: "19th Century" },
  { id: "20th-century", label: "20th Century" },
  { id: "soviet", label: "Soviet Era" },
];
