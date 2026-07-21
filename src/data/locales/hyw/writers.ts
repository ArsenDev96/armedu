import type { Filter, Writer } from "@/data/types";

export const writers: Writer[] = [
  {
    slug: "hovhannes-tumanyan",
    name: "Յովհաննէս Թումանեան",
    lifespan: "1869–1923",
    period: "19-րդ դար",
    periodId: "19th-century",
    role: "Բանաստեղծ եւ հեքիաթագիր",
    description:
      "Յաճախ կոչուած ամենայն հայոց բանաստեղծ՝ Թումանեան գիւղական կեանքը, ժողովրդական հեքիաթներն ու աւանդավէպերը վերածեց բանաստեղծութեան, որ տակաւին կը կարդացուի ամէն հայ դասարանի մէջ։",
    imageSeed: "hovhannes-tumanyan",
    notableWorks: ["Անուշ", "Թմկաբերդի առումը", "Գիքոր", "Կաթիլ մը մեղր"],
    featured: true,
  },
  {
    slug: "yeghishe-charents",
    name: "Եղիշէ Չարենց",
    lifespan: "1897–1937",
    period: "20-րդ դար",
    periodId: "20th-century",
    role: "Բանաստեղծ եւ արդիապաշտ",
    description:
      "Քսաներորդ դարու հայ բանաստեղծութեան որոշիչ ձայնը, որ արդիապաշտ փորձարկումը միացուց հայրենիքին հանդէպ իր բուռն կապին։",
    imageSeed: "yeghishe-charents",
    notableWorks: ["Գիրք ճամբու", "Դանթէական առասպել", "Ես իմ անուշ Հայաստանի արեւահամ բառն եմ սիրում"],
  },
  {
    slug: "paruyr-sevak",
    name: "Պարոյր Սեւակ",
    lifespan: "1924–1971",
    period: "Խորհրդային շրջան",
    periodId: "soviet",
    role: "Բանաստեղծ եւ բանասէր",
    description:
      "Խղճի եւ յիշողութեան բանաստեղծ մը, որուն «Անլռելի զանգակատուն» պոէմը 1915-ի դէպքերը վերստին բերաւ հանրային խօսակցութեան մէջ։",
    imageSeed: "paruyr-sevak",
    notableWorks: ["Անլռելի զանգակատուն", "Եղիցի լոյս", "Մարդը ափի մէջ"],
  },
];

export const literaryPeriods: Filter[] = [
  { id: "all", label: "Բոլոր շրջանները" },
  { id: "medieval", label: "Միջնադար" },
  { id: "19th-century", label: "19-րդ դար" },
  { id: "20th-century", label: "20-րդ դար" },
  { id: "soviet", label: "Խորհրդային շրջան" },
  { id: "contemporary", label: "Ժամանակակից" },
];
