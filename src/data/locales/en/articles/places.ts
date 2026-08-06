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
  {
    slug: "etchmiadzin-cathedral",
    href: "/places/etchmiadzin-cathedral",
    category: "places",
    categoryLabel: "Places",
    title: "Etchmiadzin Cathedral",
    seoTitle: "Etchmiadzin Cathedral and the Mother See",
    placeTypeId: "monastery",
    featured: false,
    imageSeed: "etchmiadzin-cathedral",
    keywords: [
      "Etchmiadzin Cathedral",
      "Էջմիածին",
      "Mother See of Holy Etchmiadzin",
      "Vagharshapat",
      "Catholicos of All Armenians",
      "Armenian Apostolic Church",
    ],
    excerpt:
      "The principal church of the Mother See of Holy Etchmiadzin and the seat of the Catholicos of All Armenians — a place whose tradition reaches back to Armenia's conversion, and whose standing fabric mostly does not.",
    metaDescription:
      "Etchmiadzin Cathedral in Vagharshapat: the Mother See of the Armenian Apostolic Church, what the building keeps from each century, and where tradition ends.",
    summary:
      "Etchmiadzin Cathedral is the principal church of the Mother See of Holy Etchmiadzin, in Vagharshapat in Armavir Province, and the seat of the Catholicos of All Armenians. Armenian tradition, following Agathangelos, holds that Gregory the Illuminator founded it early in the fourth century, in the years around the kingdom's adoption of Christianity — traditionally dated to 301 — and that the name records a vision of the Only Begotten descending to mark the spot. Very little of that first building stands. The cruciform, four-piered church a visitor walks through goes back to a rebuilding of 483, and the stone dome, the belfry and the eastern sacristy are later again. The see itself was elsewhere for centuries and returned here in 1441.",
    intro:
      "Etchmiadzin Cathedral stands in Vagharshapat, in Armavir Province, about twenty kilometres west of Yerevan. It is the principal church of the Mother See of Holy Etchmiadzin, the seat of the Catholicos of All Armenians, and Armenian tradition holds that Gregory the Illuminator founded it early in the fourth century, in the years around the kingdom's adoption of Christianity in 301. The building standing there now is not that church. Its cruciform core belongs to a rebuilding of 483, and the dome above it, the belfry in front of it and the rooms at its eastern end are later still. Separating those layers is the first thing worth doing here.",
    author: "Armat Editorial Team",
    updated: "2026-08-05",
    keyFacts: [
      { label: "Kind of place", value: "Working cathedral and monastic centre of the Armenian Apostolic Church" },
      { label: "Where", value: "Vagharshapat, Armavir Province, west of Yerevan" },
      { label: "Name", value: "Etchmiadzin — where the Only Begotten descended" },
      { label: "Institution", value: "Mother See of Holy Etchmiadzin, seat of the Catholicos of All Armenians" },
      { label: "Present fabric", value: "Cruciform plan of the rebuilding of 483; dome, belfry and sacristy later" },
      { label: "World Heritage", value: "Inscribed 2000, UNESCO list no. 1011" },
    ],
    sections: [
      {
        id: "where-it-is",
        heading: "Where Etchmiadzin Cathedral is",
        paragraphs: [
          "The cathedral stands in the middle of Vagharshapat, a town on the flat, irrigated plain of Armavir Province, west of Yerevan and well within reach of it. Unlike Khor Virap or the mountain monasteries, it is not set apart in a landscape: it sits inside a walled precinct in an ordinary working town, and the approach to it is through streets rather than across country.",
          "Vagharshapat is itself old. Robert Hewsen's historical atlas places it among the royal centres of the Armenian kingdom, and it served as a capital before the church was ever built there — which is part of why a cathedral was founded on this spot and not another. The town has carried both names for a long time, and the cathedral's name is now commonly used for the town as well.",
          "The precinct is a compound rather than a single building. The cathedral is its centre, but the walls also enclose the residence of the Catholicos, a seminary, museums, a library and open ground, and the churches most often visited alongside it stand in other parts of the same town.",
        ],
      },
      {
        id: "the-conversion",
        heading: "The cathedral and Armenia's conversion",
        paragraphs: [
          "The reason this place matters is that it is where the Armenian church was given a physical centre. The adoption of Christianity as the religion of the Armenian kingdom is the event the whole site refers back to, and the foundation of a cathedral here belongs to the same sequence of events as the baptism of the king and the ordination of the first bishop.",
          "The traditional date for that conversion is 301. It is not settled: Nina Garsoïan's studies on the formation of Christian Armenia set out the arguments for a date closer to 314, and this archive's own article on the conversion follows that discussion rather than treating the traditional year as fixed. The date of the cathedral's foundation is looser still, because it depends on the same narrative source and is not independently documented.",
          "What can be said plainly is the order of things. A kingdom converted; a church was organised; and a cathedral was built at Vagharshapat to be its head. Everything else on this site — the see, the seminary, the treasuries — grew out of that decision rather than preceding it.",
        ],
        links: [
          { phrase: "adoption of Christianity as the religion of the Armenian kingdom", slug: "adoption-of-christianity" },
        ],
      },
      {
        id: "the-vision",
        heading: "The vision, and the name",
        paragraphs: [
          "The name is the tradition in a single word. Agathangelos, in R. W. Thomson's translation and commentary, tells that Gregory the Illuminator saw Christ descend and strike the ground with a golden hammer to mark where the cathedral was to be built. Etchmiadzin means the place where the Only Begotten descended, and the church is named for that vision rather than for a saint or a founder.",
          "It is worth being exact about what kind of statement that is. Agathangelos is a fifth-century narrative, composed well over a century after the events it describes and written to explain how Armenia became Christian. The vision is the account the Armenian church gives of its own beginning; it is not a record made at the time, and no other kind of evidence stands behind it.",
          "That is the same distinction the archive draws at Khor Virap, where the pit is a place a tradition is kept rather than a documented cell. The two sites belong to one story and are told from one source, and a visitor who takes either narrative as reportage will misread both.",
        ],
        links: [{ phrase: "Khor Virap", slug: "khor-virap" }],
      },
      {
        id: "what-survives",
        heading: "What survives, and from when",
        paragraphs: [
          "Almost nothing a visitor sees is fourth-century. Excavation has identified remains of an earlier building beneath and within the present fabric, and the original is generally reconstructed as a basilica rather than as the church standing today — but it is remains and reconstruction, not a surviving fourth-century building.",
          "The decisive moment is a rebuilding of 483, carried out under Vahan Mamikonian and reported by the historian Ghazar Parpetsi. This is when the cathedral took a cruciform plan with a dome carried on four free-standing piers, and that plan is the core of the building today. The timing is not incidental: it follows directly on the settlement that ended the long revolt against Sasanian rule, the Treaty of Nvarsak of 484, and it is what a restored church built for itself once it could.",
          "After that the building kept changing, and the parts a photograph shows most clearly are the newest. The present stone dome replaced an earlier one in the seventeenth century. The belfry that fronts the west end was built between 1653 and 1658, and smaller bell turrets were added over the other arms in 1682. A sacristy was added at the eastern end in 1868. Christina Maranci's survey of Armenian art sets these additions in the wider pattern of the period rather than treating them as accidents of one building.",
          "So the honest summary is layered rather than simple: a traditional fourth-century foundation, a fifth-century church that supplies the plan, a seventeenth-century skyline and a nineteenth-century east end, with restoration work continuing into recent decades. The cathedral is old, and it is not old in one piece.",
        ],
        links: [{ phrase: "Treaty of Nvarsak", slug: "battle-of-avarayr" }],
      },
      {
        id: "the-mother-see",
        heading: "The Mother See and the Catholicos",
        paragraphs: [
          "Etchmiadzin is the Mother See of the Armenian Apostolic Church: the seat of the Catholicos of All Armenians and the administrative centre of the church worldwide. That is its main significance today, and it is an institutional fact rather than an architectural one.",
          "The continuity is real but it is not unbroken, and the site is often described as though it were. The see left Vagharshapat in the early medieval centuries and moved with Armenian political power — to Dvin, later into Cilicia — and it was only in 1441 that an assembly of clergy restored the Catholicosate at Etchmiadzin. The Armenian church has had a second catholicosate at Cilicia ever since, with its own jurisdiction.",
          "The office is what makes the compound more than a monument. Ordination, the consecration of bishops and the preparation of holy oil are performed here, and the residence and offices of the Catholicos stand inside the same walls as the cathedral. This is a working headquarters, and the buildings are used as one.",
        ],
      },
      {
        id: "the-complex",
        heading: "The wider complex",
        paragraphs: [
          "Inside the precinct, the cathedral is surrounded by the institutions the see needs. The Gevorgian Seminary, opened in 1874, is the principal theological school of the Armenian church and has trained its clergy since; the site also holds museums, a library and the treasuries in which the church's relics and liturgical objects are kept.",
          "Beyond the walls, three churches in Vagharshapat are normally understood as part of the same heritage: Saint Hripsime, Saint Gayane and Shoghakat, each associated with the martyrdom narrative that Agathangelos attaches to the conversion. They are separate buildings on separate sites, not parts of the cathedral, and the early medieval churches among them are in some respects better preserved than the cathedral itself.",
          "The cathedral, those churches and the archaeological site of Zvartnots were inscribed together on the UNESCO World Heritage list in 2000, under criteria that describe them as showing the development of the Armenian domed church. The inscription covers a group of monuments across the town rather than a single building.",
        ],
      },
      {
        id: "manuscripts-and-learning",
        heading: "Manuscripts, learning and what left the site",
        paragraphs: [
          "A see is also an archive. Etchmiadzin accumulated manuscripts over centuries, and by the modern period its collection was among the largest of Armenian written material anywhere — the product of copying, donation and the steady gathering-in that a central institution makes possible.",
          "That collection is no longer here, and it is worth knowing before visiting. The manuscripts were declared state property in 1929, and in 1939 the Soviet Armenian government transferred them to Yerevan, where they became the founding collection of the Matenadaran. A reader who wants to see what Etchmiadzin preserved goes to Yerevan to see it.",
          "What remains on site is the institutional side of the same work: the seminary, the library and the museums, and the continuing role of the see in publishing, liturgy and the training of clergy. The preservation Etchmiadzin is credited with is real, but much of its most famous product is now held elsewhere.",
        ],
      },
      {
        id: "before-you-see-it",
        heading: "What to understand before seeing it",
        paragraphs: [
          "The first thing is the gap between the tradition and the stones. The site's claim on Armenian history rests on a fourth-century foundation narrated by a fifth-century author; the church a visitor stands in is essentially a fifth-century plan under a seventeenth-century roofline. Both statements are true, and holding them together is the whole skill of reading the place.",
          "The second is that this is a headquarters and not only a monument. The precinct is in daily institutional use, services are held, and parts of it are closed or busy for reasons that have nothing to do with visitors. The ordinary courtesies of a place of worship apply, and so does a certain amount of patience.",
          "The third is that the site is a group rather than a point. The cathedral is the centre, but the churches elsewhere in Vagharshapat and the ruins at Zvartnots belong to the same inscribed heritage and to the same period of Armenian building, and seeing the cathedral alone gives a narrower picture than the place deserves.",
        ],
      },
    ],
    importantDates: [
      {
        year: "Early fourth century",
        event:
          "Armenian tradition places the foundation of the cathedral here by Gregory the Illuminator, in the years around the kingdom's adoption of Christianity — traditionally dated to 301, though a number of historians argue for a date closer to 314.",
      },
      {
        year: "483",
        event:
          "Vahan Mamikonian rebuilds the cathedral from the foundations. The cruciform, domed plan established by that work is the core of the building standing today.",
      },
      {
        year: "1441",
        event:
          "An assembly of clergy restores the Catholicosate at Etchmiadzin after centuries during which the see sat elsewhere.",
      },
      {
        year: "1653–1658",
        event: "The western belfry is built in front of the cathedral, giving the west front the profile it has today.",
      },
      {
        year: "1682",
        event: "Smaller bell turrets are added over the remaining arms of the church.",
      },
      {
        year: "1868",
        event: "A sacristy is added at the eastern end of the cathedral.",
      },
      {
        year: "1874",
        event: "The Gevorgian Seminary opens within the precinct and becomes the principal theological school of the Armenian church.",
      },
      {
        year: "2000",
        event:
          "The cathedral, the other churches of Vagharshapat and the archaeological site of Zvartnots are inscribed together on the UNESCO World Heritage list.",
      },
    ],
    significance: {
      heading: "Why Etchmiadzin Cathedral matters",
      paragraphs: [
        "Etchmiadzin is where the Armenian church became an institution with an address. The conversion gave Armenia a religion; this site gave that religion a head, a hierarchy, a treasury and a school, and those are what carried it through the centuries when there was no Armenian state to carry anything. The cathedral matters less as a building than as the place from which a church was run.",
        "It is also the clearest available lesson in how a heritage site accumulates. Nothing here was built once. A traditional foundation, a fifth-century reconstruction, a seventeenth-century dome and belfry, a nineteenth-century east end and modern restoration are all present in one structure, and the visitor who wants a single date for it will not find one. Reading the layers is more useful than settling on a year.",
      ],
    },
    interestingFacts: [
      "The name is the tradition stated outright: Etchmiadzin means the place where the Only Begotten descended.",
      "The cruciform plan a visitor walks through belongs to the rebuilding of 483, not to the original foundation.",
      "The seat of the Catholicos was away from Etchmiadzin for centuries and was restored here in 1441.",
      "The belfry that dominates the west front is a seventeenth-century addition, roughly thirteen hundred years younger than the traditional foundation.",
      "The manuscripts once kept at Etchmiadzin became the founding collection of the Matenadaran in Yerevan, where they were transferred in 1939.",
    ],
    relatedFigures: [
      {
        name: "Gregory the Illuminator",
        lifespan: "c. 257 – c. 331",
        description:
          "The figure Armenian tradition credits with the conversion of the kingdom and the founding of this cathedral. The vision that gives the site its name is told of him by Agathangelos; the dates given for his life are traditional rather than documented.",
      },
      {
        name: "Trdat III",
        lifespan: "reigned c. 287–330",
        description:
          "The Armenian king whose acceptance of baptism, in the same narrative, made Christianity the religion of the kingdom and created the need for a cathedral at its head.",
      },
      {
        name: "Vahan Mamikonian",
        lifespan: "about 440–510",
        description:
          "Marzpan of Armenia after the settlement that ended the revolt against Sasanian rule. Ghazar Parpetsi credits him with rebuilding the cathedral from its foundations, the work that gave the church its present plan.",
      },
    ],
    relatedSlugs: ["adoption-of-christianity", "khor-virap", "battle-of-avarayr"],
  },
  {
    slug: "erebuni-fortress",
    href: "/places/erebuni-fortress",
    category: "places",
    categoryLabel: "Places",
    title: "Erebuni Fortress",
    seoTitle: "Erebuni Fortress: Urartian Yerevan, 782 BC",
    placeTypeId: "historical",
    featured: false,
    imageSeed: "erebuni-fortress",
    keywords: [
      "Erebuni Fortress",
      "Էրեբունի",
      "Arin Berd",
      "Argishti I",
      "Urartu",
      "Yerevan",
    ],
    excerpt:
      "An Urartian citadel on the hill of Arin Berd in south-eastern Yerevan, built by King Argishti I and named in a cuneiform inscription that the modern city has adopted as its own birth certificate.",
    metaDescription:
      "Erebuni Fortress on Arin Berd in Yerevan: the Urartian citadel of Argishti I, what its foundation inscription records, and what excavation actually found.",
    summary:
      "Erebuni is a fortified Urartian citadel on the hill of Arin Berd, at the south-eastern edge of present-day Yerevan. A cuneiform inscription found on the site records that Argishti I, son of Menua, built the fortress and gave it the name Erebuni. The year normally attached to that act, 782 BC, is not written on the stone: it comes from placing the foundation inside Argishti's reign, which is dated in turn by cross-reference to Assyrian records. Behind its wall the citadel held a palace, two temples and long ranges of storerooms, and it served the kingdom of Urartu as an administrative, military and religious centre on the Ararat plain. What stands today is an excavated site, with the finds in a museum at the foot of the hill.",
    intro:
      "Erebuni is an Urartian fortress on Arin Berd, a hill at the south-eastern edge of Yerevan, and it is the reason the city counts its own age from 782 BC. The fortress was built by Argishti I, a king of Urartu, and a cuneiform inscription cut in his name records both the building and the name given to it. What a visitor walks through now is an excavated and partly restored archaeological site — stone footings, the stubs of mudbrick walls, and a legible plan — while the inscription and the finds are in the museum at the bottom of the hill. Holding those two things apart, the text and the ruin, is the first thing worth doing here.",
    author: "Armat Editorial Team",
    updated: "2026-08-06",
    keyFacts: [
      { label: "Kind of place", value: "Urartian fortress and archaeological site, partly restored" },
      { label: "Where", value: "The hill of Arin Berd, Erebuni district, south-eastern Yerevan" },
      { label: "Built by", value: "Argishti I, son of Menua, king of Urartu" },
      { label: "Conventional date", value: "782 BC, from the foundation inscription and Argishti's reign" },
      { label: "What survives", value: "Citadel wall, palace, two temples and storerooms, largely at foundation level" },
      { label: "At the site", value: "Erebuni Historical and Archaeological Museum-Reserve, opened 1968" },
    ],
    sections: [
      {
        id: "where-it-is",
        heading: "Where Erebuni Fortress is",
        paragraphs: [
          "Erebuni stands on Arin Berd, a low hill at the south-eastern edge of Yerevan, in the city district that takes its name from the fortress. The hill rises on its own out of the flat ground where the Ararat plain meets the built-up city, so the citadel looks out over farmland, suburb and the mountains beyond it in one turn of the head.",
          "The position was chosen for what it controls rather than for what it is. From the top, the plain and the routes crossing it are visible for a long way, and the slopes are steep enough on three sides to do much of the defensive work by themselves. This is the standard Urartian choice of ground, and the same reasoning put fortresses on comparable outcrops across the same plain.",
          "One distinction is worth making before arriving. The Erebuni Historical and Archaeological Museum-Reserve stands at the foot of the hill and holds the inscription and the finds; the fortress is the excavated citadel on top of it. They are two parts of one visit and two different things, and a photograph captioned Erebuni may show either.",
        ],
      },
      {
        id: "argishti-and-the-inscription",
        heading: "Argishti I and the foundation inscription",
        paragraphs: [
          "The fortress belongs to one reign. Argishti I, son of Menua, ruled Urartu in the first half of the eighth century BC and was the king under whom Urartian power reached furthest north, across the Ararat plain. Erebuni is the surviving physical record of that reach.",
          "The record is literal. A basalt block carrying a cuneiform text in the Urartian language states that Argishti, son of Menua, built this fortress by the greatness of the god Khaldi, that he proclaimed it Erebuni for the might of the land of Biainili and to hold the lands of the enemy in awe, and that the ground had been waste before he built on it. The same foundation texts record that the king settled six thousand six hundred warriors here, brought from two conquered lands. Wordings differ slightly between translations, and the standard published edition of the Urartian royal inscriptions is Mirjo Salvini's corpus, which is where the text is cited from rather than from a display label.",
          "What the inscription does not carry is a year. The date 782 BC comes from placing this foundation within Argishti's reign, using his own annals and the synchronisms with Assyrian records that Urartian chronology depends on — a reconstruction accepted across the scholarship and used by the museum-reserve, not a figure read off the stone. Saying that plainly costs nothing and prevents the commonest misreading of the site.",
        ],
      },
      {
        id: "erebuni-and-urartu",
        heading: "Erebuni and the kingdom of Urartu",
        paragraphs: [
          "Erebuni did not grow into a fortress; it was founded as one. The kingdom of Urartu, centred on Tushpa by Lake Van, pushed north under Menua and then Argishti I, and the citadels raised on the Ararat plain in those reigns are what that expansion consisted of. A garrison, a store of grain and a temple were placed on a hill, and the plain around them was administered from it.",
          "The deportation clause in the foundation text belongs to the same logic. A new fortress needed a population, and the population was moved in rather than recruited locally — which tells a reader something exact about how the Urartian state worked, and something it stated about itself without embarrassment.",
          "Erebuni was one of a group. Argishtikhinili was founded further west on the same plain within a few years, and in the following century the main Urartian centre of the region was Teishebaini at Karmir Blur, a few kilometres from here. Reading Erebuni as the single Urartian site of the Ararat plain gets the pattern wrong: it was a node in a system of them, and the system is the point.",
        ],
        links: [
          { phrase: "kingdom of Urartu, centred on Tushpa by Lake Van", slug: "kingdom-of-urartu" },
        ],
      },
      {
        id: "inside-the-citadel",
        heading: "Palace, temple and storeroom",
        paragraphs: [
          "The citadel follows the shape of the hilltop inside a defensive wall of stone footings carrying mudbrick above, with buttresses at intervals and a single principal approach. Everything else sits within that outline, which is why the plan reads so clearly from the air and so poorly from the ground.",
          "Three functions share the enclosure. The royal apartments and a courtyard with a colonnade make up the palace; a temple of Khaldi, the chief god of the Urartian state, stood beside a hall whose walls carried painted decoration in red, blue and white; and a second, tower-like temple of the type Urartian texts call a susi was dedicated to another god. Fragments of the wall paintings were lifted during excavation and conserved, so the colour a visitor sees in place is reconstruction rather than survival.",
          "The fourth function is the least glamorous and the most informative. Long ranges of storerooms held sunken jars for grain, wine and oil, and their capacity is far beyond what the people living on the hill could consume. Storage on that scale is a statement about the state rather than the garrison: the harvest of the plain was gathered here, held here and redistributed from here.",
          "So the fortress was administrative, military and religious at once, and the three were not separable. That combination is the ordinary Urartian pattern rather than a peculiarity of this site, and it is the most useful thing to carry up the hill.",
        ],
      },
      {
        id: "excavations",
        heading: "What excavation found",
        paragraphs: [
          "The hill was known to be ancient long before anyone worked out what it was, and a small dig took place in the late nineteenth century. Systematic excavation began in 1950, when the foundation inscription came to light and the identification became certain, under the archaeologist Konstantine Hovhannisyan; campaigns have continued since, including a joint Franco-Armenian project in recent years whose published work has revised parts of the earlier chronology.",
          "What the digging produced falls into two kinds. There is architecture — walls, floors, doorways, the plan of the whole citadel — surviving mostly at foundation level, and there are portable finds: pottery, bronze objects, weapons and helmets, seal impressions, further inscriptions, and the fragments of wall painting. Material from later periods was found on the same hill, which is how the site's afterlife is known at all.",
          "The line between record and interpretation runs through the naming. That one range of rooms is a palace and another a temple is an archaeological argument built from plan, contents and comparison with better-preserved Urartian citadels, not something the Urartians labelled for us. The foundation inscription is a record; the room names are a reading. Both are good work, and they are not the same kind of statement.",
        ],
      },
      {
        id: "after-urartu",
        heading: "After the kingdom",
        paragraphs: [
          "The Urartian state came to an end in the early sixth century BC, and Erebuni's own importance had already declined before that: in the seventh century the administrative weight of the plain lay with Teishebaini at Karmir Blur. Exactly why is argued over, and the honest position is that the evidence supports a shift of centre better than it supports any single dramatic cause.",
          "The hill was not abandoned when the kingdom fell. Building continued on the citadel in the Achaemenid period, when this region was a satrapy of the Persian empire, and a columned hall of that date was raised over earlier Urartian work — one of the reasons the site matters to specialists well beyond Urartian studies. Later still the settlement of the district moved off the hill, and Erebuni became what it is now: a mound with a plan under it.",
          "That is the point at which the popular version of the story usually overreaches. The continuity between Erebuni and Yerevan is a continuity of place and name across a landscape, not an unbroken town on this hilltop; nobody has lived on Arin Berd for a very long time.",
        ],
      },
      {
        id: "the-name-and-the-city",
        heading: "Erebuni, Yerevan and a birthday",
        paragraphs: [
          "The name written on the stone is Erebuni. The derivation of Yerevan from it is the standard explanation, accepted in Armenian scholarship and resting on a plausible chain of sound change and on the survival of the name in this region; it is a linguistic reconstruction rather than a documented succession of spellings, and scholars have disagreed about what the Urartian word itself meant. A reader is on safe ground with \"the name of the city is generally derived from Erebuni\" and on thinner ground with anything more definite than that.",
          "The modern use of the site is easier to state exactly. Yerevan celebrated its 2750th anniversary in 1968, counting from 782 BC, and the museum-reserve at the foot of the hill was opened for that anniversary; the name Erebuni now belongs to a city district, a museum and an annual civic festival. The city's official age is a decision to count from an inscription — and the inscription, unlike many things a capital's founding myth is built on, is a real object that can be looked at.",
          "Both halves of that are worth keeping. The document is genuine and the date is a scholarly reconstruction; the symbolism is modern and the object it rests on is ancient. Neither statement weakens the other.",
        ],
      },
      {
        id: "before-you-see-it",
        heading: "What to understand before seeing it",
        paragraphs: [
          "The first thing is what survives. This is a site at foundation level, not a standing fortress: the interest is in the plan, the setting and the view, and a visitor expecting walls to walk between will be looking at a metre of stone and a good deal of restoration. Where the reconstruction begins is not always signposted.",
          "The second is that the objects are elsewhere on the same site. The foundation inscription, the painted fragments, the pottery and the bronze are in the museum-reserve at the foot of the hill, and seeing the citadel without it gives half the visit.",
          "The third is the habit this article has been practising throughout: four different kinds of claim are made about Erebuni, and they are not equally firm. The inscription records a builder, a name and a purpose. Archaeology reconstructs a palace, temples and a storage economy. Linguistics derives Yerevan from Erebuni. A modern city keeps a birthday. All four are defensible; only the first is written down by the people who were there.",
        ],
      },
    ],
    importantDates: [
      {
        year: "782 BC",
        event:
          "The conventional date for the foundation of Erebuni by Argishti I. The foundation inscription records the building and the name; the year is a reconstruction from Argishti's reign rather than part of the text.",
      },
      {
        year: "Eighth century BC",
        event:
          "The citadel functions as an administrative, military and religious centre for Urartian control of the Ararat plain.",
      },
      {
        year: "Seventh century BC",
        event:
          "The main Urartian centre of the region is Teishebaini at Karmir Blur, and Erebuni's administrative weight declines.",
      },
      {
        year: "Sixth century BC",
        event:
          "The Urartian kingdom ends, but building continues on the hill: a columned hall of the Achaemenid period is raised over the earlier citadel.",
      },
      {
        year: "1950",
        event:
          "Systematic excavation of Arin Berd begins under Konstantine Hovhannisyan, and the foundation inscription comes to light.",
      },
      {
        year: "1968",
        event:
          "The Erebuni Historical and Archaeological Museum-Reserve opens at the foot of the hill, as Yerevan marks its 2750th anniversary.",
      },
    ],
    significance: {
      heading: "Why Erebuni Fortress matters",
      paragraphs: [
        "Erebuni is where the written history of the Armenian Highlands touches the ground of a modern capital. Most of what is claimed about the deep past of any city is inference; here there is a dated reign, a named king, an object with his words on it and an excavated fortress underneath the words. That combination is rare enough that the site carries a weight out of all proportion to what is standing on it.",
        "It is also the archive's clearest lesson in sorting evidence. A visitor is told several things at once — that the city is nearly three millennia old, that the fortress was a palace and a temple, that Yerevan is Erebuni — and those statements come from a cuneiform text, from archaeological interpretation, from historical linguistics and from a civic anniversary respectively. Separating them is not scepticism about the site. It is the only way to see how much of it is genuinely documented, which turns out to be a great deal.",
      ],
    },
    interestingFacts: [
      "The inscription that gives Yerevan its official age is a fortress-building record, not a city charter: it states who built, what he named it and why.",
      "The date 782 BC is nowhere on the stone. It comes from where the foundation falls within Argishti I's reign, which is itself dated by cross-reference to Assyrian records.",
      "The foundation texts record that six thousand six hundred warriors were settled here from conquered lands — the garrison was moved in, not raised locally.",
      "Yerevan marked its 2750th anniversary in 1968, and the museum-reserve at the foot of the hill was opened for the occasion.",
      "The wall paintings were lifted from the citadel during excavation and conserved; the colour visible on the hill today is reconstruction.",
    ],
    relatedFigures: [
      {
        name: "Argishti I",
        lifespan: "reigned about 786–764 BC",
        description:
          "King of Urartu under whom the kingdom reached furthest north. He founded Erebuni and is named as its builder in the foundation inscription; the dates of his reign are a reconstruction from his annals and Assyrian synchronisms.",
      },
      {
        name: "Menua",
        lifespan: "reigned about 810–786 BC",
        description:
          "Argishti's father, named in the inscription, and the king who began the Urartian push north towards the Ararat plain as well as the canal that still carries water near Van.",
      },
    ],
    relatedSlugs: ["kingdom-of-urartu"],
  },
];
