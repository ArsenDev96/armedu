import type { Filter, Writer } from "@/data/types";

export const writers: Writer[] = [
  {
    slug: "hovhannes-tumanyan",
    name: "Հովհաննես Թումանյան",
    lifespan: "1869–1923",
    period: "XIX դար",
    periodId: "19th-century",
    role: "Բանաստեղծ և հեքիաթագիր",
    description:
      "Հաճախ կոչվում է ամենայն հայոց բանաստեղծ. Թումանյանը գյուղական կյանքը, ժողովրդական հեքիաթներն ու ավանդությունները վերածեց պոեզիայի, որը մինչ օրս կարդացվում է հայկական ամեն դասարանում։",
    imageSeed: "hovhannes-tumanyan",
    notableWorks: ["Անուշ", "Թմկաբերդի առումը", "Գիքորը", "Մի կաթիլ մեղր"],
    featured: true,
  },
  {
    slug: "yeghishe-charents",
    name: "Եղիշե Չարենց",
    lifespan: "1897–1937",
    period: "XX դար",
    periodId: "20th-century",
    role: "Բանաստեղծ և մոդեռնիստ",
    description:
      "Քսաներորդ դարի հայ պոեզիայի որոշիչ ձայնը, ով մոդեռնիստական փորձարարությունը զուգորդեց հայրենիքի հանդեպ խորունկ կապվածության հետ։",
    imageSeed: "yeghishe-charents",
    notableWorks: ["Գիրք ճանապարհի", "Դանթեական առասպել", "Ես իմ անուշ Հայաստանի"],
  },
  {
    slug: "raffi",
    name: "Րաֆֆի",
    lifespan: "1835–1888",
    period: "XIX դար",
    periodId: "19th-century",
    role: "Վիպասան",
    description:
      "Հայ պատմավեպի հիմնադիրը, ում գրքերը ձևավորեցին մի ամբողջ սերնդի պատկերացումը սեփական անցյալի և ապագայի մասին։",
    imageSeed: "raffi",
    notableWorks: ["Խենթը", "Սամվել", "Դավիթ Բեկ", "Կայծեր"],
  },
  {
    slug: "avetik-isahakyan",
    name: "Ավետիք Իսահակյան",
    lifespan: "1875–1957",
    period: "XX դար",
    periodId: "20th-century",
    role: "Բանաստեղծ",
    description:
      "Պանդխտության և կարոտի քնարերգու, ում երգերը մտան հայ ժողովրդի հիշողության մեջ և արժանացան արտերկրի գրողների՝ այդ թվում Ալեքսանդր Բլոկի հիացմունքին։",
    imageSeed: "avetik-isahakyan",
    notableWorks: ["Աբու Լալա Մահարի", "Երգեր և վերքեր", "Սասմա Մհեր"],
  },
  {
    slug: "khachatur-abovyan",
    name: "Խաչատուր Աբովյան",
    lifespan: "1809–1848",
    period: "XIX դար",
    periodId: "19th-century",
    role: "Գրող և մանկավարժ",
    description:
      "Նոր հայ գրականության հայրը, ով գրեց առաջին վեպը խոսակցական լեզվով և ջանք չխնայեց կրթությունը բոլորին հասանելի դարձնելու համար։",
    imageSeed: "khachatur-abovyan",
    notableWorks: ["Վերք Հայաստանի", "Նախաշավիղ", "Առակներ"],
  },
  {
    slug: "paruyr-sevak",
    name: "Պարույր Սեւակ",
    lifespan: "1924–1971",
    period: "Խորհրդային շրջան",
    periodId: "soviet",
    role: "Բանաստեղծ և գրականագետ",
    description:
      "Խղճի և հիշողության բանաստեղծ, ում «Անլռելի զանգակատուն» պոեմը 1915 թվականի իրադարձությունները վերադարձրեց հանրային խոսակցության դաշտ։",
    imageSeed: "paruyr-sevak",
    notableWorks: ["Անլռելի զանգակատուն", "Եղիցի լույս", "Մարդը ափի մեջ"],
  },
];

export const literaryPeriods: Filter[] = [
  { id: "all", label: "Բոլոր ժամանակաշրջանները" },
  { id: "medieval", label: "Միջնադար" },
  { id: "19th-century", label: "XIX դար" },
  { id: "20th-century", label: "XX դար" },
  { id: "soviet", label: "Խորհրդային շրջան" },
  { id: "contemporary", label: "Ժամանակակից" },
];
