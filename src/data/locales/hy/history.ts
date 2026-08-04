import type { Category, Filter, TimelineEntry } from "@/data/types";

export const categories: Category[] = [
  {
    id: "history",
    title: "Հայոց պատմություն",
    description:
      "Ուսումնասիրեք կարևոր ժամանակաշրջանները, թագավորությունները, դեմքերը, ճակատամարտերն ու իրադարձությունները՝ Ուրարտուի ամրոցներից մինչև Առաջին Հանրապետություն։",
    href: "/history",
    linkLabel: "Դիտել պատմությունը",
    imageSeed: "category-history",
    image: "/category-history.png",
  },
  {
    id: "writers",
    title: "Հայ գրողներ",
    description:
      "Ծանոթացեք Հայաստանի ամենաազդեցիկ գրողների կյանքին ու ստեղծագործություններին և տեսեք, թե ինչպես նրանց գրքերը ձևավորեցին այն լեզուն, որով կարդում ենք այսօր։",
    href: "/writers",
    linkLabel: "Դիտել գրողներին",
    imageSeed: "category-writers",
    image: "/category-writers.png",
  },
  {
    id: "works",
    title: "Գրական երկեր",
    description:
      "Կարդացեք ամփոփումներ, պատմական համատեքստ, կերպարների բնութագրեր և հիմնական գաղափարներ այն երկերից, որոնց հայ աշակերտը հանդիպում է ամեն դասարանում։",
    href: "/works",
    linkLabel: "Դիտել երկերը",
    imageSeed: "category-works",
    image: "/category-works.png",
  },
  {
    id: "cuisine",
    title: "Հայկական խոհանոց",
    description:
      "Ծանոթացեք հայկական ուտեստներին որպես պատմության, ընտանեկան կյանքի, տոների և սփյուռքի ավանդույթների մաս՝ լավաշից ու տոլմայից մինչև հարիսա և ղափամա։",
    href: "/cuisine",
    linkLabel: "Դիտել խոհանոցը",
    imageSeed: "category-cuisine",
    // The banner file is named for the meal it shows rather than for the
    // section id, unlike the other three. Left as delivered: renaming it to
    // match would break the link back to the artwork the illustrator supplied.
    image: "/category-armmeal.webp",
  },
];

export const timeline: TimelineEntry[] = [
  {
    id: "urartu",
    period: "մ.թ.ա. IX–VI դարեր",
    title: "Ուրարտուի թագավորություն",
    description:
      "Վանա լճի շուրջ ձևավորված հզոր պետությունը կառուցում է ամրոց-քաղաքներ՝ դրանց թվում Էրեբունին՝ Երևանի նախնին, որոնք նշանավորում են Հայկական լեռնաշխարհի գրավոր պատմության սկիզբը։",
  },
  {
    id: "artaxiad",
    period: "մ.թ.ա. 189 – մ.թ. 12 թթ.",
    title: "Արտաշեսյան հարստություն",
    description:
      "Արտաշես Ա-ն հիմնում է անկախ թագավորություն, որը Տիգրան Մեծի օրոք կարճ ժամանակով ձգվում է Կասպից ծովից մինչև Միջերկրական։",
  },
  {
    id: "christianity",
    period: "301 թ.",
    title: "Քրիստոնեության ընդունում",
    description:
      "Տրդատ Գ արքան քրիստոնեությունն ընդունում է որպես հայոց պետական կրոն՝ որոշում, որը վերափոխեց հայ արվեստը, ճարտարապետությունն ու ինքնությունը։",
  },
  {
    id: "avarayr",
    period: "451 թ.",
    title: "Ավարայրի ճակատամարտ",
    description:
      "Վարդան Մամիկոնյանը հայկական ուժերն առաջնորդում է Սասանյան բանակի դեմ՝ ի պաշտպանություն հավատի ազատության. ռազմական պարտություն, որը դարձավ քաղաքական հաղթանակ։",
  },
  {
    id: "bagratid",
    period: "885–1045 թթ.",
    title: "Բագրատունյաց Հայաստան",
    description:
      "Վերականգնված թագավորությունը ծաղկում է իր մայրաքաղաք Անիի շուրջ՝ հազար ու մի եկեղեցիների քաղաքի, որն իր ժամանակի խոշորագույն քաղաքներից էր։",
  },
  {
    id: "first-republic",
    period: "1918–1920",
    title: "Հայաստանի Առաջին Հանրապետություն",
    description:
      "Դարեր շարունակ պետականությունից զուրկ մնալուց հետո հռչակվում է անկախ հայկական հանրապետություն՝ կարճատև, բայց այսօրվա հանրապետության անմիջական նախորդը։",
  },
];

/**
 * Chronological eras. This list is one axis of the history listing; the kind of
 * subject an article has is the other, in `historyTopicTypes`.
 *
 * `kingdoms`, `people` and `battles` were removed in August 2026. The first
 * named no era («Հայկական թագավորություններ» spans Urartu to the Bagratids), and
 * the other two named content types rather than periods — which is why «Կարևոր
 * դեմքեր» matched no history article at all and always returned an empty
 * listing, and why the Battle of Avarayr, filed under `battles`, could not be
 * found under any century.
 */
export const historyPeriods: Filter[] = [
  { id: "all", label: "Բոլոր ժամանակաշրջանները" },
  { id: "ancient", label: "Հին Հայաստան" },
  { id: "marzpanate", label: "Մարզպանական Հայաստան" },
  { id: "medieval", label: "Միջնադարյան Հայաստան" },
  { id: "modern", label: "Նոր ժամանակների Հայաստան" },
];

/**
 * What kind of subject an article has, independent of when it happened.
 *
 * Every id here is carried by at least one article — `validate:content` fails
 * the build otherwise, which is the rule that would have caught the old
 * «Կարևոր դեմքեր» pill.
 */
export const historyTopicTypes: Filter[] = [
  { id: "all", label: "Բոլոր տեսակները" },
  { id: "state", label: "Պետություններ և թագավորություններ" },
  { id: "person", label: "Պատմական դեմքեր" },
  { id: "event", label: "Իրադարձություններ" },
  { id: "battle", label: "Ճակատամարտեր" },
];
