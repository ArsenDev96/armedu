import type { Category, Filter, TimelineEntry } from "@/data/types";

export const categories: Category[] = [
  {
    id: "history",
    title: "Հայոց պատմութիւն",
    description:
      "Ծանօթացէ՛ք կարեւոր ժամանակաշրջաններուն, թագաւորութիւններուն, դէմքերուն, ճակատամարտերուն եւ դէպքերուն՝ Ուրարտուի բերդերէն մինչեւ Առաջին Հանրապետութիւնը։",
    href: "/history",
    linkLabel: "Տեսնել պատմութիւնը",
    imageSeed: "category-history",
    image: "/category-history.png",
  },
  {
    id: "writers",
    title: "Հայ գրողներ",
    description:
      "Սորվեցէ՛ք Հայաստանի ամէնէն ազդեցիկ գրողներուն կեանքին ու գործերուն մասին եւ տեսէ՛ք, թէ անոնց գիրքերը ինչպէ՛ս կերտեցին այն լեզուն, որով այսօր կը կարդանք։",
    href: "/writers",
    linkLabel: "Տեսնել գրողները",
    imageSeed: "category-writers",
    image: "/category-writers.png",
  },
  {
    id: "works",
    title: "Գրական երկեր",
    description:
      "Կարդացէ՛ք այն երկերուն մասին, որոնց հայ աշակերտները կը հանդիպին ամէն դասարանի մէջ՝ ամփոփումներ, պատմական խորապատկեր, կերպարներ եւ գլխաւոր գաղափարներ։",
    href: "/works",
    linkLabel: "Տեսնել երկերը",
    imageSeed: "category-works",
    image: "/category-works.png",
  },
  {
    id: "cuisine",
    title: "Հայկական խոհանոց",
    description:
      "Ծանօթացէ՛ք հայկական կերակուրներուն իբրեւ պատմութեան, ընտանեկան կեանքի, տօներու եւ սփիւռքի աւանդութիւններու մէկ մասը՝ լաւաշէն ու տոլմայէն մինչեւ հարիսա եւ ղափամա։",
    href: "/cuisine",
    linkLabel: "Տեսնել խոհանոցը",
    imageSeed: "category-cuisine",
    image: "/category-armmeal.webp",
  },
  {
    id: "places",
    title: "Վայրեր",
    description:
      "Հայաստանի վանքերը, բերդերը, թանգարաններն ու բնաշխարհը՝ ներկայացուած իբրեւ պատմութիւն, ոչ թէ իբրեւ ուղեցոյց։ Կը սկսինք Արարատի ստորոտի Խոր Վիրապէն։",
    href: "/places",
    linkLabel: "Տեսնել վայրերը",
    imageSeed: "category-places",
  },
];

export const timeline: TimelineEntry[] = [
  {
    id: "urartu",
    period: "Ք.Ա. 9–6-րդ դարեր",
    title: "Ուրարտուի թագաւորութիւն",
    description:
      "Վանայ լիճին շուրջ հզօր պետութիւն մը կը կառուցէ բերդաքաղաքներ, անոնց կարգին՝ Երեւանի նախահայր Էրեբունին։ Անոնք կը նշեն Հայկական լեռնաշխարհի գրաւոր պատմութեան սկիզբը։",
  },
  {
    id: "artaxiad",
    period: "Ք.Ա. 189 – Ք.Ե. 12",
    title: "Արտաշէսեան արքայատոհմ",
    description:
      "Արտաշէս Ա. կը հիմնէ անկախ թագաւորութիւն մը, որ Տիգրան Մեծի օրով կարճ ժամանակ մը կը տարածուի Կասպից ծովէն մինչեւ Միջերկրական։",
  },
  {
    id: "christianity",
    period: "Ք.Ե. 301",
    title: "Քրիստոնէութեան ընդունում",
    description:
      "Տրդատ Գ. թագաւորը քրիստոնէութիւնը կ՚ընդունի իբրեւ հայոց պետութեան կրօնք, եւ այս որոշումը նոր դիմագիծ կու տայ հայ արուեստին, ճարտարապետութեան ու ինքնութեան։",
  },
  {
    id: "avarayr",
    period: "Ք.Ե. 451",
    title: "Աւարայրի ճակատամարտ",
    description:
      "Վարդան Մամիկոնեան հայ ուժերը կ՚առաջնորդէ Սասանեան բանակին դէմ՝ կրօնական ազատութիւնը պաշտպանելու համար։ Ռազմական պարտութիւն մըն է ասիկա, որ քաղաքական յաղթանակ կ՚ապահովէ։",
  },
  {
    id: "bagratid",
    period: "Ք.Ե. 885–1045",
    title: "Բագրատունեաց Հայաստան",
    description:
      "Վերականգնուած թագաւորութիւնը կը ծաղկի Անի մայրաքաղաքին շուրջ։ «Հազար ու մէկ եկեղեցիներու քաղաքը» իր դարու ամէնէն մեծ քաղաքներէն մէկն է։",
  },
  {
    id: "first-republic",
    period: "1918–1920",
    title: "Հայաստանի Առաջին Հանրապետութիւն",
    description:
      "Դարերու անպետականութենէ ետք կը հռչակուի անկախ հայկական հանրապետութիւն մը։ Կարճատեւ կ՚ըլլայ, բայց այսօրուան հանրապետութեան անմիջական նախորդն է։",
  },
];

/**
 * Chronological eras — one axis of the history listing; `historyTopicTypes` is
 * the other. See the note in the `hy` edition for why `kingdoms`, `people` and
 * `battles` were removed in August 2026.
 */
export const historyPeriods: Filter[] = [
  { id: "all", label: "Բոլոր ժամանակաշրջանները" },
  { id: "ancient", label: "Հին Հայաստան" },
  { id: "marzpanate", label: "Մարզպանական Հայաստան" },
  { id: "medieval", label: "Միջնադարեան Հայաստան" },
  { id: "modern", label: "Արդի Հայաստան" },
];

/**
 * What kind of subject an article has, independent of when it happened.
 *
 * «Ճակատամարտեր», not «ճակատամարտներ»: a compound whose final component is a
 * monosyllabic word («մարտ») keeps the -եր plural.
 */
export const historyTopicTypes: Filter[] = [
  { id: "all", label: "Բոլոր տեսակները" },
  { id: "state", label: "Պետութիւններ եւ թագաւորութիւններ" },
  { id: "person", label: "Պատմական դէմքեր" },
  { id: "event", label: "Դէպքեր" },
  { id: "battle", label: "Ճակատամարտեր" },
];
