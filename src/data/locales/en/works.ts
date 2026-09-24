import type { Filter, LiteraryWork } from "@/data/types";

export const works: LiteraryWork[] = [
  {
    slug: "anush",
    title: "Anush",
    author: "Hovhannes Tumanyan",
    publicationPeriod: "1890s",
    genre: "Narrative poem",
    genreId: "poetry",
    summary:
      "A young shepherd and a village girl fall in love, and an old code of honour turns a moment of play into tragedy. Tumanyan's best-known poem, later set as Armenia's national opera.",
    imageSeed: "anush",
  },
  {
    slug: "wounds-of-armenia",
    title: "Wounds of Armenia",
    author: "Khachatur Abovyan",
    publicationPeriod: "written 1841, published 1858",
    genre: "Historical novel",
    genreId: "novel",
    summary:
      "The first novel written in modern spoken Armenian, following a village caught up in the Russo-Persian war and arguing that ordinary people make history.",
    imageSeed: "wounds-of-armenia",
  },
  {
    slug: "the-fool",
    title: "The Fool",
    author: "Raffi",
    publicationPeriod: "1880s",
    genre: "Novel",
    genreId: "novel",
    summary:
      "Set during the Russo-Turkish war of 1877–78, Raffi's novel follows a young man dismissed as a fool by his neighbours whose clear sight makes him the only realist among them.",
    imageSeed: "the-fool",
  },
  {
    slug: "david-of-sassoun",
    title: "David of Sassoun",
    author: "Anonymous, oral tradition",
    publicationPeriod: "Medieval epic, first recorded 1873",
    genre: "Epic poem",
    genreId: "epic",
    summary:
      "Armenia's national epic, telling of four generations of heroes from Sassoun who defend their mountain homeland — carried by storytellers for a thousand years before it was written down.",
    imageSeed: "david-of-sassoun",
  },
  {
    slug: "book-of-lamentations",
    title: "Book of Lamentations",
    author: "Grigor Narekatsi",
    publicationPeriod: "completed about 1002",
    genre: "Prayer cycle",
    genreId: "poetry",
    summary:
      "Ninety-five discourses addressed to God, written at the monastery of Narek about 1002. The most copied book in Armenian after the Gospel, known simply as the Narek, and not the biblical Lamentations.",
    imageSeed: "book-of-lamentations",
  },
  {
    slug: "mtnadzor",
    title: "Mtnadzor",
    author: "Aksel Bakunts",
    publicationPeriod: "1927",
    genre: "Short-story collection",
    genreId: "short-stories",
    summary:
      "Eighteen stories of the Zangezur mountains — Bakunts's first book, and the one that made his name as a prose writer. Published at Yerevan in 1927 and translated into English as The Dark Valley.",
    imageSeed: "mtnadzor",
  },
  {
    slug: "baghdasar-aghbar",
    title: "Baghdasar Aghbar",
    author: "Hakob Paronyan",
    publicationPeriod: "written 1886, staged 1895",
    genre: "Comedy",
    genreId: "drama",
    summary:
      "A prosperous Constantinople Armenian catches his wife with her lover and takes his case to the community's own tribunal — which rules that what he saw was only an optical illusion. Paronyan's only play, written in 1886 and first staged, after his death, in 1895.",
    imageSeed: "baghdasar-aghbar",
  },
  {
    slug: "yerkir-nairi",
    title: "Land of Nairi",
    author: "Yeghishe Charents",
    publicationPeriod: "written 1921–1925, published 1926",
    genre: "Modernist novel",
    genreId: "novel",
    summary:
      "A satirical, self-consciously modern \"poem-like novel\" about the last years of Kars, Charents's own birthplace, told by a narrator who insists the city had no heroes. Written 1921–1925 and published in 1926; often called the first modernist Armenian novel.",
    imageSeed: "yerkir-nairi",
  },
];

export const workGenres: Filter[] = [
  { id: "all", label: "All works" },
  { id: "poetry", label: "Poetry" },
  { id: "novel", label: "Novels" },
  { id: "epic", label: "Epics" },
  { id: "short-stories", label: "Short stories" },
  { id: "drama", label: "Drama" },
];
