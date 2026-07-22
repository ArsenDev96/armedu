import type { Filter, LiteraryWork } from "@/data/types";

export const works: LiteraryWork[] = [
  {
    slug: "anush",
    title: "Անուշ",
    author: "Յովհաննէս Թումանեան",
    publicationPeriod: "1890-ականներ",
    genre: "Պատմողական պոէմ",
    genreId: "poetry",
    summary:
      "Հովիւ մը եւ գիւղացի աղջիկ մը իրարու կը սիրահարին, եւ պատուոյ հին օրէնք մը խաղի պահ մը կը վերածէ ողբերգութեան։ Թումանեանի ամէնէն ծանօթ պոէմը, որ յետագային դարձաւ Հայաստանի ազգային օփերան։",
    imageSeed: "anush",
  },
  {
    slug: "david-of-sassoun",
    title: "Սասնայ ծռեր",
    author: "Անանուն, բանաւոր աւանդութիւն",
    publicationPeriod: "Միջնադարեան դիւցազնավէպ, առաջին անգամ գրի առնուած՝ 1873-ին",
    genre: "Դիւցազնավէպ",
    genreId: "epic",
    summary:
      "Հայոց ազգային դիւցազնավէպը, որ կը պատմէ սասունցի դիւցազուններու չորս սերունդներուն մասին՝ որոնք կը պաշտպանեն իրենց լեռնային հայրենիքը. հազար տարի զրուցասացներու բերնով փոխանցուած՝ նախքան գրի առնուիլը։",
    imageSeed: "david-of-sassoun",
  },
];

export const workGenres: Filter[] = [
  { id: "all", label: "Բոլոր երկերը" },
  { id: "poetry", label: "Բանաստեղծութիւն" },
  { id: "novel", label: "Վէպեր" },
  { id: "epic", label: "Դիւցազնավէպեր" },
];
