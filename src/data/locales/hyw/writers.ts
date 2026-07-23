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
    slug: "raffi",
    name: "Րաֆֆի",
    lifespan: "1835–1888",
    period: "19-րդ դար",
    periodId: "19th-century",
    role: "Վիպասան",
    description:
      "Հայ պատմավէպին հիմնադիրը, որուն գիրքերը ձեւաւորեցին ամբողջ սերունդի մը պատկերացումը իր անցեալին ու ապագային մասին։",
    imageSeed: "raffi",
    notableWorks: ["Խենթը", "Սամուէլ", "Դաւիթ Բէկ", "Կայծեր"],
  },
  {
    slug: "avetik-isahakyan",
    name: "Աւետիք Իսահակեան",
    lifespan: "1875–1957",
    period: "20-րդ դար",
    periodId: "20th-century",
    role: "Բանաստեղծ",
    description:
      "Պանդխտութեան եւ կարօտի քնարերգու մը, որուն երգերը մտան հայ ժողովուրդի յիշողութեան մէջ եւ արժանացան արտերկրի գրողներու՝ անոնց կարգին Ալեքսանտր Պլոքի հիացումին։",
    imageSeed: "avetik-isahakyan",
    notableWorks: ["Աբու Լալա Մահարի", "Երգեր ու վէրքեր", "Սասմայ Մհեր"],
  },
  {
    slug: "khachatur-abovyan",
    name: "Խաչատուր Աբովեան",
    lifespan: "1809–1848",
    period: "19-րդ դար",
    periodId: "19th-century",
    role: "Գրող եւ մանկավարժ",
    description:
      "Նոր հայ գրականութեան հայրը, որ գրեց առաջին վէպը խօսակցական լեզուով եւ ջանք չխնայեց կրթութիւնը բոլորին հասանելի դարձնելու համար։",
    imageSeed: "khachatur-abovyan",
    notableWorks: ["Վէրք Հայաստանի", "Նախաշաւիղ", "Առակներ"],
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
