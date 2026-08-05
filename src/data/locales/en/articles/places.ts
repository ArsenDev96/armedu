import type { Article } from "@/data/types";

/**
 * Places — cultural articles about sites in the Republic of Armenia.
 *
 * The section follows the same two editorial rules as the rest of the archive,
 * plus one of its own.
 *
 * These are not travel listings. A place article explains what a site is, when
 * it was built, what happened there and why it is remembered — the same job the
 * history articles do for an event. Opening hours, ticket prices, transport
 * instructions and where to eat are deliberately absent: they change without
 * notice, this archive is a set of files with no refresh mechanism, and a page
 * that quietly publishes last year's price is worse than one that never offered
 * it.
 *
 * The rule specific to this section is about tradition. Much of what a visitor
 * is told at an Armenian monastery is narrative handed down rather than event
 * recorded at the time, and the two are not the same kind of claim. Where a
 * story is tradition, the wording says so — and says which text it comes from,
 * so a reader can see the distance between the event and the account of it.
 */
export const placeArticles: Article[] = [
  {
    slug: "khor-virap",
    href: "/places/khor-virap",
    category: "places",
    categoryLabel: "Places",
    title: "Khor Virap",
    seoTitle: "Khor Virap: The Monastery Below Mount Ararat",
    placeTypeId: "monastery",
    featured: true,
    imageSeed: "khor-virap",
    keywords: [
      "Khor Virap",
      "Խոր Վիրապ",
      "Gregory the Illuminator",
      "Artashat",
      "Ararat plain",
      "Armenian monastery",
    ],
    excerpt:
      "A working monastery on a low hill above the Ararat plain, built over the pit where tradition holds Gregory the Illuminator was imprisoned — and standing on the site of Artashat, an ancient Armenian capital.",
    metaDescription:
      "Khor Virap monastery on the Ararat plain: the pit linked with Gregory the Illuminator, the ancient capital of Artashat beneath it, and what to know before seeing it.",
    summary:
      "Khor Virap is a monastery in Ararat Province, on a low hill rising out of the Ararat plain in the south-west of the Republic of Armenia. Its name means \"deep pit\", and the site is known for the underground chamber beneath its smaller chapel, which Armenian tradition identifies as the place where Gregory the Illuminator was held prisoner before the Armenian king accepted Christianity. That tradition comes from Agathangelos, a narrative written well over a century after the events it describes. The hill also stands on the site of Artashat, a royal capital founded in the second century BC. The buildings a visitor sees are much later than either story: the principal church, Surb Astvatsatsin, is a seventeenth-century building.",
    intro:
      "Khor Virap is a monastery on a low hill above the Ararat plain, about thirty kilometres south of Yerevan in Ararat Province. Its name means \"deep pit\", and it is built over an underground chamber that Armenian tradition identifies as the prison of Gregory the Illuminator. The hill it stands on was once part of Artashat, a royal capital founded in the second century BC, and the view south from its walls is dominated by Mount Ararat. Almost everything that draws people here is therefore older than the buildings themselves — which is the first thing worth understanding about the place.",
    author: "Armat Editorial Team",
    updated: "2026-08-05",
    keyFacts: [
      { label: "Kind of place", value: "Working monastery of the Armenian Apostolic Church" },
      { label: "Where", value: "Ararat Province, on the Ararat plain, south of Yerevan" },
      { label: "Name", value: "Khor Virap — \"deep pit\" in Armenian" },
      { label: "Stands on", value: "The site of Artashat, a royal capital of ancient Armenia" },
      { label: "Principal church", value: "Surb Astvatsatsin (Holy Mother of God), seventeenth century" },
      { label: "Associated with", value: "Gregory the Illuminator, by tradition" },
    ],
    sections: [
      {
        id: "where-it-is",
        heading: "Where Khor Virap is",
        paragraphs: [
          "Khor Virap sits on an isolated hill at the southern edge of the Ararat plain, in Ararat Province of the Republic of Armenia. The plain here is flat, low and heavily farmed, so the hill is visible from a long way off and the monastery on top of it reads as the only vertical thing in the landscape.",
          "The hill is not a natural curiosity but an archaeological one. It formed part of Artashat, the capital founded by Artashes I in the second century BC and used by the Armenian kings for several hundred years afterwards. Robert Hewsen's historical atlas places the city here, spread over a group of hills beside the Araks river, and the monastery occupies one of them.",
          "That layering is the simplest way to hold the site in mind. A royal capital, then a tradition attached to one of its hills, then a monastery built to mark the tradition, then the working church that stands there now — four things in one place, separated by centuries.",
        ],
      },
      {
        id: "gregory-and-the-pit",
        heading: "Gregory the Illuminator and the pit",
        paragraphs: [
          "The chamber that gives the site its name is a pit cut into the rock, reached today by a ladder through a narrow opening in the floor of the small chapel of Surb Gevorg. Armenian tradition holds that Gregory the Illuminator was imprisoned in it for years on the order of King Trdat III, and released when the king turned to him.",
          "The account comes from Agathangelos, the fifth-century History of the Armenians, in R. W. Thomson's translation and commentary. Agathangelos is the source of nearly everything told about Gregory, and it is important to be clear about what kind of source it is: a narrative composed well over a century after the events, shaped to explain how Armenia became Christian rather than to record what happened day by day.",
          "So the pit is a place where a tradition is kept, not a documented cell with a documented prisoner. That distinction does not make the site less interesting. It is precisely because the story was told, retold and eventually built over that there is a monastery here at all.",
        ],
      },
      {
        id: "the-conversion",
        heading: "The site and Armenia's conversion",
        paragraphs: [
          "Khor Virap is bound to one of the largest events in Armenian history. The adoption of Christianity as the religion of the Armenian kingdom, traditionally dated to 301, is the moment the whole tradition around this hill points towards: Gregory's release, the king's baptism and the establishment of a Christian church in Armenia belong to the same narrative.",
          "The date itself is not settled. Nina Garsoïan's studies on the formation of Christian Armenia set out the arguments for a date closer to 314, and the archive's own article on the conversion follows that discussion rather than treating 301 as fixed. A visitor told a single confident year at the site is being given the traditional date, not the scholarly consensus.",
          "What is not in dispute is the consequence. Whatever year it happened, the Armenian kingdom took the step early — earlier than Rome — and the church that followed shaped Armenian law, learning and writing for centuries afterwards.",
        ],
        links: [
          { phrase: "adoption of Christianity as the religion of the Armenian kingdom", slug: "adoption-of-christianity" },
        ],
      },
      {
        id: "the-monastery",
        heading: "The monastery above the pit",
        paragraphs: [
          "Nothing a visitor sees is ancient. The tradition is old; the buildings are not. A chapel was raised over the pit in the early medieval period, and the enclosure has been rebuilt more than once since.",
          "The church that dominates the site today is Surb Astvatsatsin, the Holy Mother of God, built in the seventeenth century. It is a compact domed church of the kind Christina Maranci's survey of Armenian art describes for the period: solid, plainly built, with its ornament concentrated at the drum and the doorway rather than spread across the walls.",
          "Beside it, and much smaller, is the chapel of Surb Gevorg, which covers the pit itself. The whole group is enclosed by a fortified wall, which is what gives Khor Virap its silhouette from the plain and why photographs of it look more like a small fortress than a church.",
          "It remains a working monastery of the Armenian Apostolic Church, in regular use for services, baptisms and pilgrimage. It is not a ruin and is not presented as one.",
        ],
      },
      {
        id: "the-mountain",
        heading: "The mountain in the view",
        paragraphs: [
          "Khor Virap is photographed more than almost any site in Armenia, and usually for what stands behind it rather than what stands on it. Mount Ararat rises directly to the south, and from this hill the mountain fills the horizon with very little in between.",
          "Two plain geographic facts explain the view. The Ararat plain is flat and low, so nothing interrupts the sightline; and Ararat is close, which is why it appears at a scale it does not reach from most of the country. The mountain itself lies across the border, in present-day Turkey.",
          "The mountain has a long place in Armenian culture, art and self-description, and a visitor will meet it constantly — in painting, on labels, in the name of half the businesses in Yerevan. That is worth knowing in advance, because the view from Khor Virap is where most people meet it first.",
        ],
      },
      {
        id: "before-you-see-it",
        heading: "What to understand before seeing it",
        paragraphs: [
          "Three things make the site legible. The first is that its fame rests on a tradition rather than on what survives: there is no ruin of a prison to see, and the pit is a small rock chamber whose meaning is entirely in the story attached to it.",
          "The second is the layering. The hill was a royal capital long before it was a monastery, and the archaeology of Artashat is a separate subject from the church on top of it. Reading the site as one continuous Christian place from the beginning gets its history backwards.",
          "The third is that this is an active church rather than a museum. Services are held, candles are lit, and people come to be baptised. Visitors are welcome, and the ordinary courtesies of a place of worship apply.",
        ],
      },
    ],
    importantDates: [
      {
        year: "c. 176 BC",
        event:
          "Artashes I founds Artashat as a royal capital on the group of hills beside the Araks, one of which later carries the monastery.",
      },
      {
        year: "301",
        event:
          "The traditional date for the Armenian kingdom's adoption of Christianity, the event the tradition of the pit leads to. A number of historians argue for a date closer to 314.",
      },
      {
        year: "Seventeenth century",
        event: "The present church of Surb Astvatsatsin is built inside the monastery's walls.",
      },
    ],
    significance: {
      heading: "Why Khor Virap matters",
      paragraphs: [
        "Khor Virap is the clearest example in Armenia of a place whose importance is carried by a story rather than by its remains. The pit is small and plain, the buildings are seventeenth-century, and the royal capital beneath the hill is largely underground. What draws people is the conversion narrative — and the monastery exists because that narrative was believed and marked.",
        "It is also a useful corrective to the idea that a heritage site is an old building. The Armenian kingdom's turn to Christianity had consequences that ran through law, learning and eventually the alphabet itself, and this hill is where that turn is remembered. The stones are recent; what is being remembered is not.",
      ],
    },
    interestingFacts: [
      "The name is literally descriptive: khor means deep and virap means pit.",
      "The pit is entered by a ladder through a narrow opening in the floor of the chapel of Surb Gevorg.",
      "The hill was part of Artashat, a royal capital founded in the second century BC — the site was significant for roughly five hundred years before any Christian tradition attached to it.",
      "Almost everything visible today postdates the tradition by more than a millennium; the principal church is a seventeenth-century building.",
      "Mount Ararat, which dominates the view south from the walls, lies across the border in present-day Turkey.",
    ],
    relatedFigures: [
      {
        name: "Gregory the Illuminator",
        lifespan: "c. 257 – c. 331",
        description:
          "The figure Armenian tradition credits with converting King Trdat III and founding the Armenian church. Agathangelos places his imprisonment at this site; the dates given for his life are traditional rather than documented.",
      },
      {
        name: "Trdat III",
        lifespan: "reigned c. 287–330",
        description:
          "The Armenian king who, in the same narrative, first imprisoned Gregory and later accepted baptism from him, making Christianity the religion of the kingdom.",
      },
    ],
    relatedSlugs: ["adoption-of-christianity", "tigran-the-great"],
  },
];
