import type { Filter, LiteraryWork } from "@/data/types";

export const works: LiteraryWork[] = [
  {
    slug: "anush",
    title: "Անուշ",
    author: "Հովհաննես Թումանյան",
    publicationPeriod: "1890-ական թթ.",
    genre: "Պոեմ",
    genreId: "poetry",
    summary:
      "Գյուղացի աղջիկը և իր սիրածը սիրահարվում են, բայց պատվի հին օրենքը խաղի մի պահը վերածում է ողբերգության։ Թումանյանի ամենահայտնի պոեմը, որը հետագայում դարձավ Հայաստանի ազգային օպերան։",
    imageSeed: "anush",
  },
  {
    slug: "wounds-of-armenia",
    title: "Վերք Հայաստանի",
    author: "Խաչատուր Աբովյան",
    publicationPeriod: "գրվել է 1841-ին, հրատարակվել՝ 1858-ին",
    genre: "Պատմավեպ",
    genreId: "novel",
    summary:
      "Խոսակցական աշխարհաբարով գրված առաջին վեպը՝ ռուս-պարսկական պատերազմի հորձանուտում հայտնված գյուղի պատմությունը, որը պնդում է, թե պատմությունը կերտում են հասարակ մարդիկ։",
    imageSeed: "wounds-of-armenia",
  },
  {
    slug: "the-fool",
    title: "Խենթը",
    author: "Րաֆֆի",
    publicationPeriod: "1880-ական թթ.",
    genre: "Վեպ",
    genreId: "novel",
    summary:
      "1877–78 թթ. ռուս-թուրքական պատերազմի ֆոնին ծավալվող Րաֆֆու վեպը պատմում է մի երիտասարդի մասին, ում հարևանները խենթ են համարում, մինչդեռ նրա պարզատեսությունը նրան դարձնում է միակ իրապաշտը նրանց մեջ։",
    imageSeed: "the-fool",
  },
  {
    slug: "david-of-sassoun",
    title: "Սասնա ծռեր",
    author: "Անհեղինակ, բանավոր ավանդություն",
    publicationPeriod: "միջնադարյան էպոս, առաջին անգամ գրառվել է 1873-ին",
    genre: "Էպոս",
    genreId: "epic",
    summary:
      "Հայոց ազգային էպոսը՝ սասունցի հերոսների չորս սերունդների մասին, ովքեր պաշտպանում են իրենց լեռնային հայրենիքը. հազար տարի այն փոխանցվել է բանասացների բերանով, մինչև գրի է առնվել։",
    imageSeed: "david-of-sassoun",
  },
];

export const workGenres: Filter[] = [
  { id: "all", label: "Բոլոր երկերը" },
  { id: "poetry", label: "Պոեզիա" },
  { id: "novel", label: "Վեպեր" },
  { id: "epic", label: "Էպոսներ" },
];
