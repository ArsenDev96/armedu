import type { Article } from "@/data/types";

/**
 * Armenian cuisine — cultural articles about six dishes.
 *
 * Two editorial rules govern this file and its two translations.
 *
 * The first is that these are not recipes. Each article carries a short
 * preparation overview because a reader cannot understand a dish without
 * knowing roughly how it is made, but quantities, timings and steps are
 * deliberately absent: the subject is what the dish means, not how to cook it.
 *
 * The second is about ownership. Most of these dishes are made across a wide
 * region under related names, and several are claimed by more than one national
 * cuisine. Nothing here states that a dish is exclusively Armenian unless a
 * source says exactly that — and for these six, none does. Where a practice
 * varies, the wording says so ("a common Armenian version", "in some regions",
 * "many families"), because naming one family's method as the authentic one is
 * the specific error this section is most likely to make.
 */
export const cuisineArticles: Article[] = [
  {
    slug: "lavash",
    href: "/cuisine/lavash",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Lavash",
    seoTitle: "Lavash: Armenian Flatbread Baked in a Tonir",
    dishType: "Bread",
    dishTypeId: "bread",
    imageSeed: "lavash",
    keywords: ["lavash", "lavash bread", "Լավաշ", "Լաւաշ", "tonir", "թոնիր", "Armenian flatbread"],
    excerpt:
      "The thin flatbread baked against the wall of a clay tonir, inscribed by UNESCO in 2014 for the way it is made, shared and used in Armenian life — and inscribed again in 2016 for five other countries.",
    metaDescription:
      "Lavash, the thin Armenian flatbread baked in a clay tonir: how it is made, its role in weddings and everyday meals, and its two UNESCO inscriptions.",
    summary:
      "Lavash is a thin unleavened flatbread of wheat flour, water and salt, baked in under a minute against the inner wall of a tonir, the clay oven sunk into the floor of a traditional house. Fresh, it is pliable and torn rather than cut, and wraps cheese, herbs and grilled meat; dried and stacked it keeps for up to six months and softens again when sprinkled with water, which is how a household could bake once and eat lavash through a winter. It also carries meanings unrelated to eating: the UNESCO file records lavash being laid on the shoulders of a bride and groom as a wish for prosperity. UNESCO inscribed the Armenian tradition in 2014 and a separate multinational element under the same name in 2016, each recording a living practice rather than ownership.",
    intro:
      "Lavash is a thin, soft flatbread of flour, water and salt, baked in seconds against the hot wall of a tonir, the clay oven sunk into the ground. It is the everyday bread of Armenian households and, at the same time, an object with a ritual life of its own: it is laid on the shoulders of a bride and groom, dried in sheets for the winter, and used as a plate, a wrapper and a utensil. UNESCO inscribed the Armenian practice on its Representative List of the Intangible Cultural Heritage of Humanity in 2014, and inscribed a separate, multinational flatbread element under the same name in 2016.",
    author: "Armat Editorial Team",
    updated: "2026-07-31",
    keyFacts: [
      { label: "Kind of dish", value: "Thin unleavened flatbread" },
      { label: "Ingredients", value: "Wheat flour, water, salt" },
      { label: "Traditional oven", value: "Tonir — a clay oven set into the ground" },
      { label: "Baking time", value: "Under a minute" },
      { label: "Keeps for", value: "Up to six months when dried" },
      { label: "UNESCO", value: "Representative List, 2014, no. 00985" },
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What lavash is",
        paragraphs: [
          "Lavash is an unleavened flatbread made from three ingredients: wheat flour, water and salt. What distinguishes it is not the dough but the shaping and the oven. The dough is kneaded and divided into balls, each ball is rolled and then stretched until it is thin enough to see light through, and the sheet is spread over an oval cushion and slapped against the inner wall of a tonir. It bakes in well under a minute and is lifted out while still soft.",
          "The result is a bread that behaves differently from a loaf. Fresh, it is pliable and is torn rather than cut. Dried, it stacks flat, keeps for months, and returns to softness when sprinkled with water and left under a cloth — which is why a household could bake once and eat lavash through a winter.",
          "The word covers a family of breads rather than a single fixed product. Sheets differ in length, thickness and colour from one village and one baker to the next, and the same name is used across a wide region for breads that an Armenian baker would not necessarily recognise as her own.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "The UNESCO nomination file describes lavash-making as work that binds a household together. Women do the baking, with younger girls learning by assisting; men build the ovens and make the cushions the dough is stretched on, and pass those skills on in turn. Baking days are collaborative by necessity — the work is fast, hot and continuous once the tonir is lit.",
          "The bread also carries meanings that have nothing to do with eating. The best-documented is the wedding practice recorded in the same file, in which lavash is placed on the shoulders of the newlyweds as a wish for prosperity and children. The Smithsonian Folklife Festival's 2018 Armenia programme described the tonir itself as one of the most sacred places in a traditional house — a sunken hearth at the centre of the home, and in some villages a substitute for a church in the sanctifying of a marriage.",
          "In diaspora communities where no tonir exists, lavash is bought rather than baked, and the ritual uses survive better than the craft. This is a common pattern in the section: the meaning travels more easily than the method.",
        ],
      },
      {
        id: "history",
        heading: "Documented background",
        paragraphs: [
          "The tonir is the oldest verifiable element of the story. Sunken clay ovens of this kind are a long-established feature of houses across the Armenian highland and the wider region, and the bread is inseparable from the oven that shapes it — a flatbread slapped onto a vertical wall is what that oven can produce.",
          "The written record of lavash as a named tradition is recent and institutional rather than ancient. In 2014 UNESCO inscribed \"Lavash, the preparation, meaning and appearance of traditional bread as an expression of culture in Armenia\" on the Representative List, on Armenia's nomination. In 2016 the same body inscribed \"Flatbread making and sharing culture: Lavash, Katyrma, Jupka, Yufka\", submitted jointly by Azerbaijan, Iran, Kazakhstan, Kyrgyzstan and Turkey.",
          "The two inscriptions are worth reading together, because they are often quoted separately to prove opposite things. Neither awards ownership of a bread. What each records is a living practice within particular communities, and the fact that the same name appears twice is a statement about how widely the bread is made, not a contradiction.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "The dough is flour, water and salt, worked until smooth and rested. Portions are rolled out and then stretched — over the backs of the hands, or on a board — until the sheet is very thin and considerably wider than the rolling stage left it. It is transferred to an oval cushion, and the cushion is used to press the sheet firmly against the tonir wall.",
          "The oven does the rest. A tonir holds a strong, dry heat, and the bread blisters and sets in seconds; a baker judges it by sight and lifts it off with a hooked tool. Sheets to be kept are stacked and dried, and revived later with water.",
          "A common Armenian version uses no yeast at all, and many bakers add nothing beyond the three ingredients. Enriched and leavened variants exist, and gas-fired or metal ovens are now widespread; the bread they produce is recognisably lavash, and is not treated as a lesser thing.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "Lavash is not a festival bread. It belongs to ordinary days, which is precisely what gives it standing: it is the thing always on the table, and the thing a guest is first offered. Autumn baking, when sheets are prepared in quantity and dried for the winter, is the closest it comes to an event of its own.",
          "Its ceremonial appearances are borrowed from that ordinariness. At a wedding it stands for the household the couple are joining; at a table it stands for hospitality. Many families keep the habit of not putting bread down carelessly or throwing it away, and the same respect is extended to lavash specifically.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "Within Armenia the differences are mostly of size and handling: sheets a metre long in some villages, shorter and thicker elsewhere, and doughs slightly softer or firmer according to the flour available.",
          "Across the wider region, breads called lavash range from the very thin Armenian sheet to thicker, chewier breads that are folded rather than rolled. In Armenian communities of the Middle East, commercial bakeries have standardised the product considerably.",
          "In some regions the same tonir is used for other breads on the same day, and lavash is the first thing baked because it needs the fiercest heat.",
        ],
      },
    ],
    importantDates: [
      {
        year: "2014",
        event:
          "UNESCO inscribes Armenia's lavash tradition on the Representative List of the Intangible Cultural Heritage of Humanity, no. 00985.",
      },
      {
        year: "2016",
        event:
          "A separate flatbread element under the same name is inscribed on the nomination of Azerbaijan, Iran, Kazakhstan, Kyrgyzstan and Turkey.",
      },
      {
        year: "2018",
        event:
          "Lavash baking is demonstrated in Washington as part of the Smithsonian Folklife Festival's Armenia programme.",
      },
    ],
    significance: {
      heading: "Why lavash matters",
      paragraphs: [
        "Lavash is the clearest case in this section of a food that is also a technology and a social arrangement. The bread cannot be separated from the tonir, and the tonir cannot be separated from the household that builds, heats and works around it — which is why the heritage listing describes a practice rather than a product.",
        "It is also a useful corrective to the idea that a dish belongs to one people. The same bread name is inscribed twice by the same organisation, for communities in six states. That does not diminish the Armenian tradition; it locates it accurately, as one strongly documented practice within a shared regional foodway.",
      ],
    },
    interestingFacts: [
      "The dough is stretched over an oval cushion and slapped onto the wall of the oven; the sheet bakes in less than a minute.",
      "Dried lavash keeps for up to six months and is brought back to softness with a sprinkle of water.",
      "The UNESCO file records the wedding practice of laying lavash on the shoulders of the bride and groom as a wish for prosperity.",
      "The same bread name carries two separate UNESCO inscriptions: Armenia's in 2014, and a five-country one in 2016.",
      "In the nomination file the baking is described as women's work, while men build the ovens and make the cushions — and both pass the skill on to apprentices.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: ["Wheat flour", "Water", "Salt"],
      preparation:
        "The dough is kneaded, divided and rolled, then stretched until very thin, spread over an oval cushion and pressed against the hot wall of a tonir, where it bakes in seconds and is lifted off while still soft.",
      occasions: ["Everyday meals", "Weddings", "Autumn baking for the winter store"],
      regions: [
        "Throughout the Republic of Armenia",
        "Armenian communities of the Middle East",
        "Diaspora households, usually bought rather than baked",
      ],
      serving:
        "Torn by hand and used to wrap cheese, herbs and grilled meat, or laid under other dishes to take up their juices; dried sheets are stacked and revived with water.",
    },
    relatedSlugs: ["khorovats", "dolma", "harissa"],
  },

  {
    slug: "dolma",
    href: "/cuisine/dolma",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Dolma",
    seoTitle: "Dolma (Tolma): What It Is and Where It Is Made",
    dishType: "Main dishes",
    dishTypeId: "main",
    imageSeed: "dolma",
    keywords: ["dolma", "tolma", "Տոլմա", "pasuts tolma", "stuffed vine leaves", "Armenian dolma"],
    excerpt:
      "Vine leaves and hollowed vegetables filled with rice, herbs and often meat — a dish made across the whole region, and one of the clearest examples of why this section does not assign dishes to a single owner.",
    metaDescription:
      "Dolma, or tolma: rice, onion and herbs in vine leaves or hollowed vegetables. The meatless pasuts form, its regional spread, and the 2017 UNESCO listing.",
    summary:
      "Dolma — tolma in Armenian usage — is defined by a method rather than a recipe: rice, onion and a large quantity of herbs, with or without minced lamb or beef, wrapped in vine or cabbage leaves or packed into hollowed peppers, aubergines, tomatoes or quinces, then packed tightly into a pot, weighted and cooked slowly. The name comes from a Turkic verb meaning to be filled. The meatless version, pasuts tolma, uses beans, chickpeas, lentils and grains, is served cold, and belongs to fasting periods. In Armenian households it is a dish for gatherings, and rolling several hundred leaves is shared work. The method is old and practised across the Caucasus, Anatolia, Iran and the eastern Mediterranean under related names; UNESCO's 2017 inscription was submitted by Azerbaijan and records a practice, not an origin.",
    intro:
      "Dolma — tolma in Armenian usage — is a filling of rice, onion, herbs and often minced meat, wrapped in leaves or packed into hollowed vegetables and cooked slowly. It is made throughout the Caucasus, Anatolia, Iran and the eastern Mediterranean, under names that all derive from the same verb. In Armenian households it is a dish for gatherings rather than for a quick weekday meal, and it exists in a meatless form eaten during fasting. In 2017 UNESCO inscribed a dolma tradition on its Representative List; that nomination was submitted by Azerbaijan, and the fact is stated here rather than left out, because how such an inscription is read is part of the story of this dish.",
    author: "Armat Editorial Team",
    updated: "2026-07-31",
    keyFacts: [
      { label: "Kind of dish", value: "Filled leaves and vegetables" },
      { label: "Common filling", value: "Rice, onion, herbs, minced meat" },
      { label: "Meatless version", value: "Pasuts tolma, filled with beans, grains and lentils" },
      { label: "Wrappers", value: "Vine leaves, cabbage; peppers, aubergines, tomatoes, quinces" },
      { label: "Name", value: "From a Turkic verb meaning to be filled or stuffed" },
      { label: "UNESCO", value: "Representative List, 2017, no. 01188, on Azerbaijan's nomination" },
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What dolma is",
        paragraphs: [
          "Dolma is defined by a method rather than by a recipe: something edible is filled with something else and cooked gently until both are done. In practice that means two broad families. Leaf dolma — vine leaves most often, cabbage in colder seasons — is rolled into small cylinders. Vegetable dolma uses peppers, aubergines, tomatoes, courgettes or quinces, hollowed and capped.",
          "The standard filling is short-grain rice with onion and a large quantity of herbs, with or without minced lamb or beef. The pot is packed tightly, weighted, and cooked with a modest amount of liquid so that the parcels steam rather than boil apart.",
          "The Armenian form of the name, tolma, is the same word. Folk etymologies deriving it from an Armenian root for vine leaf circulate widely; UNESCO's file records the straightforward derivation from a Turkic verb meaning to be filled, and that is the explanation this article follows.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "Tolma is labour that is normally shared. Rolling several hundred leaves is a task for several pairs of hands at a kitchen table, and in many families it is the point at which a household's cooking knowledge is actually transmitted — not by instruction, but by sitting alongside someone who rolls faster.",
          "It is also a dish of display. A tightly packed pot of even, small parcels is understood as evidence of care and skill, and tolma is accordingly a common centrepiece when guests are expected. The Smithsonian Folklife Festival's 2018 Armenia programme listed it among the staples of an Armenian feast, alongside bread and grilled meat.",
          "The meatless version, pasuts tolma, gives the dish a second life in the church calendar. Made with beans, chickpeas, lentils and grains and served cold, it belongs to fasting periods, and is one of the few festive-looking dishes that a fast permits.",
        ],
      },
      {
        id: "history",
        heading: "Documented background",
        paragraphs: [
          "Stuffed-vegetable and stuffed-leaf dishes have a long written history in the region, and the surviving records are mostly Ottoman and Arabic rather than Armenian. Priscilla Mary Işın's history of Ottoman cuisine traces the dish family through palace kitchen documents and other archival material — the kind of evidence that shows what was cooked and when, without telling us who cooked it first.",
          "That is the honest limit of the historical claim. The technique is old and regionally widespread; the specific Armenian repertoire of tolma is documented in modern cookbooks and ethnography rather than in medieval sources.",
          "In 2017 UNESCO inscribed \"Dolma making and sharing tradition, a marker of cultural identity\" on the Representative List. The nomination came from Azerbaijan, and the file describes the practice within that country. An inscription of this kind records a living tradition in the community that nominated it; it does not adjudicate origin, and it does not exclude the equivalent practice elsewhere.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "Vine leaves are used fresh in early summer and preserved in brine for the rest of the year; brined leaves are rinsed before use. The filling is mixed raw — rice, finely chopped onion, herbs, salt and pepper, with meat if it is a meat version — and a small spoonful is placed on each leaf, which is folded at the sides and rolled.",
          "The parcels are laid in a heavy pot in close rows, often over a layer of leaves or sliced vegetable to protect the bottom, weighted with a plate, and cooked slowly with a little water, stock or tomato until the rice is done.",
          "Many families finish leaf tolma with lemon or with matsun, and vegetable tolma with a tomato-based liquid; both practices are usual, and neither is the correct one.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "Tolma belongs to occasions where people sit for a long time: family gatherings, holidays, and the meals that follow church services and commemorations. Its preparation time is part of the point — the dish signals that the day was planned for.",
          "Pasuts tolma is tied to fasting periods, and is served cold, which also makes it practical for a table that has to stand for hours.",
          "In Armenia, festivals devoted to tolma have been held in recent years, with cooks presenting many regional versions side by side. They are a modern, deliberate act of promotion rather than an inherited custom, and are described that way here.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "The clearest internal division is between meat and meatless. Beyond that, proportions of rice to meat, the herb mixture, and the sourness of the finish differ by region and by family.",
          "In some regions cooks wrap the filling in leaves other than the vine's — cabbage most commonly, but also quince, beet or sour cherry leaves where those are to hand, each of which changes the flavour of the finished dish.",
          "Armenian communities of the Middle East tend towards smaller, tighter rolls and a more pronounced lemon finish; households in the Republic of Armenia often serve larger parcels with matsun. Both are ordinary practice, and describing either as the authentic one would be wrong.",
        ],
      },
    ],
    importantDates: [
      {
        year: "2017",
        event:
          "UNESCO inscribes \"Dolma making and sharing tradition, a marker of cultural identity\" on the Representative List, no. 01188, on Azerbaijan's nomination.",
      },
      {
        year: "2018",
        event:
          "Tolma is presented among the staples of an Armenian feast at the Smithsonian Folklife Festival's Armenia programme.",
      },
    ],
    significance: {
      heading: "Why dolma matters",
      paragraphs: [
        "Tolma is the dish in this section where the question of ownership is most often asked and least usefully answered. It is made, under related names and by the same method, by communities across a very large area, and the written history documents the technique rather than an inventor.",
        "What can be said with confidence is what the dish does in Armenian life: it gathers people around a table to make it, it marks an occasion as important, and in its meatless form it carries a religious calendar. Those are the claims this article makes, and they do not require the dish to be exclusively Armenian in order to hold.",
      ],
    },
    interestingFacts: [
      "The name is a verbal noun: UNESCO's file derives it from a Turkic word meaning stuffed, and Armenian uses the same word in the form tolma.",
      "Pasuts tolma contains no meat at all — beans, chickpeas, lentils and grains — and is eaten cold during fasting periods.",
      "Vine leaves are seasonal, so most tolma outside early summer is made with leaves preserved in brine.",
      "The parcels are weighted with a plate during cooking, which is what keeps them from unrolling in the pot.",
      "The 2017 UNESCO inscription was submitted by Azerbaijan; the same dish is made in Armenia and across the region, and the listing records a practice rather than an origin.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Vine or cabbage leaves, or vegetables for hollowing",
        "Short-grain rice",
        "Onion and herbs",
        "Minced lamb or beef, in the meat versions",
        "Beans, chickpeas and grains, in pasuts tolma",
      ],
      preparation:
        "A raw filling of rice, onion and herbs, with or without minced meat, is spooned onto leaves and rolled, or packed into hollowed vegetables; the parcels are packed tightly into a pot, weighted and cooked slowly in a little liquid.",
      occasions: ["Family gatherings and feast tables", "Fasting periods, in the pasuts form", "Commemorative meals"],
      regions: [
        "Throughout the Republic of Armenia",
        "Armenian communities of the Middle East",
        "The wider region, under related names",
      ],
      serving:
        "Served warm from the pot with matsun or lemon, or cold in the meatless version; lavash is usually on the table with it.",
    },
    relatedSlugs: ["ghapama", "lavash", "khorovats"],
  },

  {
    slug: "khorovats",
    href: "/cuisine/khorovats",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Khorovats",
    seoTitle: "Khorovats: Armenian Grilled Meat and Its Occasion",
    dishType: "Meat dishes",
    dishTypeId: "meat",
    imageSeed: "khorovats",
    keywords: ["khorovats", "Խորոված", "Armenian barbecue", "khorovats salad", "madagh", "մատաղ"],
    excerpt:
      "Meat grilled over open embers, and the social occasion built around it: who lights the fire, who tends it, and how it differs from the communal meal of a madagh.",
    metaDescription:
      "Khorovats, Armenian meat grilled over embers: what the word means, how the fire is handled, the vegetable salad beside it, and how it differs from madagh.",
    summary:
      "Khorovats is meat cooked over an open fire; the word is a form of the Armenian verb meaning to roast or grill, so it names a method rather than a recipe. Large pieces of pork, lamb, beef or chicken are salted and left with onion and herbs, threaded onto long flat skewers and cooked over embers rather than flame, the seasoning kept deliberately restrained. Aubergine, sweet pepper and tomato grill alongside and are then peeled and chopped into a dish of their own, usually called khorovats salad; the meat is often slid straight off the skewer onto lavash. The occasion matters as much as the food — a fire lit outdoors and an afternoon spent around it — and it survives strongly in the diaspora because it needs no tonir. It is not madagh, though the two share a shape.",
    intro:
      "Khorovats is meat cooked over an open fire — the word is a form of the Armenian verb meaning to roast or grill, and it names the method rather than a single recipe. In practice it is also an occasion: a fire lit outdoors, one person tending the skewers while everyone else waits, and a table assembled around whatever comes off. It is among the dishes the Smithsonian Folklife Festival presented in 2018 as a staple of the Armenian feast, and it sits close to, but is not the same as, the older communal meat meal called madagh.",
    author: "Armat Editorial Team",
    updated: "2026-07-31",
    keyFacts: [
      { label: "Kind of dish", value: "Meat grilled over open embers" },
      { label: "Name", value: "From the Armenian verb meaning to roast or grill" },
      { label: "Common meats", value: "Pork, lamb, beef, chicken, according to region and community" },
      { label: "Cooked on", value: "Long skewers over wood or vine embers" },
      { label: "Usually eaten", value: "Outdoors, in company, straight off the skewer" },
      { label: "Not the same as", value: "Madagh, the communal meal from an animal offered and shared" },
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What khorovats is",
        paragraphs: [
          "Khorovats is meat cut into large pieces, threaded onto long flat skewers and cooked over embers rather than flame. The meat is usually salted and left with onion, herbs and sometimes wine or sparkling water for some hours beforehand; the seasoning is deliberately restrained, because the point of the dish is the fire.",
          "Vegetables go on alongside — aubergine, sweet pepper, tomato — and are often peeled once blackened and chopped together into a dish of its own, commonly called khorovats salad.",
          "Because the name is a method, it stretches: the same word covers a skewer of lamb over vine cuttings in a village and a portion cooked on a metal grill on a city balcony.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "Khorovats is the outdoor counterpart to the tonir. Where the ethnographic literature describes bread-baking at the hearth as women's ground, the fire and the skewers at a family gathering are conventionally handled by men, and the person tending them holds a recognised position for the afternoon.",
          "The occasion is more elaborate than the food. A khorovats is an excuse to be somewhere — a garden, a riverbank, a mountain road — for several hours, with the cooking spread across the whole of it rather than confined to a mealtime. Much of the eating happens standing up, as each batch comes off.",
          "In the diaspora it is one of the most durable Armenian practices, because it needs no special equipment and no tonir. A grill, skewers and lavash are enough.",
        ],
      },
      {
        id: "history",
        heading: "Documented background",
        paragraphs: [
          "Grilling meat over fire is not a tradition that can be dated, and no serious source tries. What can be described is the practice as it is documented now, and its relationship to older ritual forms of eating meat together.",
          "The relevant scholarship here is on madagh. In her study of the practice among Armenians, the anthropologist Susan Paul Pattie describes madagh as a meal from an animal offered and shared — often glossed in English as \"sacrifice\", a translation she shows to be misleading — and traces how differently it is understood across communities. In the Republic of Armenia and in the Middle East the public slaughter of the animal remains ordinary; in much of the diaspora it is treated as backward, and the meal survives without it.",
          "Khorovats is not madagh. But the two share a shape — meat cooked in quantity and eaten together, in the open, by a group larger than a household — and the modern secular gathering has absorbed some of what the older ritual carried.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "Meat is cut into pieces large enough to stay juicy, salted, and left with sliced onion and herbs. Many families add nothing else; others use wine, sparkling water, or a little pepper and paprika.",
          "The fire is built and allowed to burn down; the skewers go on only once there is a bed of embers and no flame. Vine cuttings and fruitwood are prized where they are available, for the smoke.",
          "Skewers are turned by hand and judged by eye. When the meat comes off it is frequently slid straight onto lavash, which takes up the juices and is eaten with it.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "Khorovats belongs to holidays, family outings, weekends and any occasion where a group of people has an afternoon. It is the default form of celebration for a birthday or a visit home, and it is portable in a way that few other dishes here are.",
          "It also appears at gatherings with a religious frame — after a baptism, a commemoration or a pilgrimage — where the boundary between an ordinary grill and a madagh can be indistinct, and where families themselves describe the difference in different ways.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "The most visible difference is the meat. In the Republic of Armenia pork is very common; lamb is more usual in Armenian communities of the Middle East, where it also carries the associations of the ritual meal. Beef and chicken are ordinary everywhere.",
          "In some regions the meat is cooked in large pieces on the bone; in others it is cubed. Some cooks grill the vegetables first and hold them warm; many families do the reverse.",
          "There is also a version cooked in a covered pot with vegetables rather than over a fire, and it takes the same name in ordinary speech — a reminder that the word describes what is being done to the meat more than where it is being done.",
        ],
      },
    ],
    importantDates: [
      {
        year: "2018",
        event:
          "Khorovats is cooked in Washington as one of the staples of the Armenian feast, in the Smithsonian Folklife Festival's Armenia programme.",
      },
      {
        year: "2022",
        event:
          "Susan Paul Pattie's study of madagh appears in Food, Culture & Society, setting out how differently the communal meat meal is understood in Armenia and in the diaspora.",
      },
    ],
    significance: {
      heading: "Why khorovats matters",
      paragraphs: [
        "Khorovats is the least ceremonious dish in this section and, for that reason, one of the most revealing. It has no heritage inscription, no fixed recipe and no origin story worth defending, and it is nonetheless the form an Armenian celebration most often takes.",
        "It also shows how a ritual practice can leave its shape behind after the ritual itself has thinned out. The communal meat meal of a madagh and an afternoon of grilling in a garden are different things, and confusing them would be an error — but the second is recognisably descended from a world in which the first was ordinary.",
      ],
    },
    interestingFacts: [
      "The word is the past participle of the Armenian verb for roasting: it names a method, not a recipe.",
      "The grilled vegetables cooked beside the meat are peeled and chopped into a separate dish, usually called khorovats salad.",
      "Skewers go on only after the flame has died down; cooking over embers rather than fire is the part of the technique cooks argue about least.",
      "Meat is often slid off the skewer directly onto lavash, which is then eaten with it.",
      "Madagh, the communal meal from an animal offered and shared, is a different practice — and Susan Paul Pattie's study found the visible slaughter it involves is ordinary in Armenia and the Middle East but widely rejected in the diaspora.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Pork, lamb, beef or chicken in large pieces",
        "Onion, salt and herbs",
        "Aubergine, sweet pepper and tomato for the accompanying grill",
        "Lavash, to take the meat off the skewer",
      ],
      preparation:
        "Meat is salted and left with onion and herbs for some hours, threaded onto long skewers and cooked over embers rather than flame, turned by hand until done; vegetables are grilled beside it.",
      occasions: ["Family gatherings and outings", "Holidays and celebrations", "Meals following commemorations"],
      regions: [
        "Throughout the Republic of Armenia",
        "Armenian communities of the Middle East, more often with lamb",
        "Diaspora gatherings, where it needs no special equipment",
      ],
      serving:
        "Slid off the skewer onto lavash and eaten immediately, with raw onion, herbs and the grilled-vegetable salad alongside.",
    },
    relatedSlugs: ["harissa", "lavash", "dolma"],
  },

  {
    slug: "harissa",
    href: "/cuisine/harissa",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Harissa",
    seoTitle: "Armenian Harissa: Wheat, Meat and Musaler",
    dishType: "Ceremonial dishes",
    dishTypeId: "ceremonial",
    imageSeed: "harissa",
    keywords: ["harissa", "harisa", "Հարիսա", "korkot", "կորկոտ", "Musa Dagh", "Musaler", "Մուսա Լեռ"],
    excerpt:
      "Wheat and meat stirred together for hours until they become one substance — a dish recorded in a tenth-century Baghdadi cookbook, and the food around which the Musa Dagh resistance is commemorated every September.",
    metaDescription:
      "Harissa, the Armenian dish of hulled wheat and meat stirred for hours: its tenth-century Baghdadi record and the September commemoration at Musaler.",
    summary:
      "Harissa is hulled wheat — korkot in Armenian — cooked with chicken or lamb for many hours and stirred until the meat has broken down and the wheat has burst, so that the dish becomes a single heavy mass rather than a stew. The consistency is the test of it: properly made, it pulls away from the spoon. Melted butter is poured over before serving, with cumin or pepper offered separately. It feeds a great many people from very little, which is why it belongs to communal and church occasions. Its written history reaches back to a tenth-century Baghdadi cookbook, and related versions are made across the Middle East. Its best-known Armenian occasion is far more recent: the September commemoration at Musaler, in Armavir, of the 1915 resistance on Musa Dagh.",
    intro:
      "Harissa is hulled wheat and meat cooked together for many hours and stirred until neither can be told from the other. It is not a delicate dish and was never meant to be: it feeds a great many people from very little, and it can be kept going in a large pot through a night. Its written history reaches back to a tenth-century Baghdadi cookbook, where harīsa appears as a pounded wheat-and-meat dish. Its best-known Armenian occasion is far more recent — the September commemoration at Musaler, in Armavir, of the 1915 resistance on Musa Dagh.",
    author: "Armat Editorial Team",
    updated: "2026-07-31",
    keyFacts: [
      { label: "Kind of dish", value: "Wheat and meat cooked to a thick porridge" },
      { label: "Ingredients", value: "Hulled wheat (korkot), chicken or lamb, butter, salt" },
      { label: "Method", value: "Long, slow cooking with continuous stirring" },
      { label: "Earliest written record", value: "A tenth-century Baghdadi cookbook" },
      { label: "Best-known Armenian occasion", value: "The September commemoration at Musaler" },
      { label: "Served", value: "From a communal pot, with melted butter poured over" },
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What harissa is",
        paragraphs: [
          "Harissa is made from two things: hulled wheat, known in Armenian as korkot, and meat — most often chicken, sometimes lamb. They are cooked together in a large pot with water and salt for a long time, and stirred until the meat has broken down completely and the wheat has burst, so that the finished dish is a single smooth, heavy mass rather than a stew with pieces in it.",
          "The consistency is the dish. A harissa that has not been stirred enough is a wheat soup with meat in it; one that has been stirred properly pulls away from the spoon. Melted butter is poured over at the end, and pepper or cumin offered separately.",
          "It is filling out of proportion to what goes into it, and that is not incidental. Harissa is a dish for feeding a crowd, a monastery, a village or a column of refugees.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "For most Armenians today harissa is a dish of commemoration, and specifically of one commemoration. Every September, at the Musa Dagh memorial in the village of Musaler in Armavir Province, harissa is cooked in quantity and distributed. The pots are set going in the evening and stirred through the night, with music and dancing around the fires, and the food is handed out the following day.",
          "What is being remembered is the 1915 resistance on Musa Dagh, when the Armenians of several villages on the mountain refused deportation, held out, and were eventually taken off by French warships. The Armenian National Institute's record of the memorial at Musaler credits it to the architects Rafael Israelian and Ara Harutyunyan, gives its opening as 1976, and notes that the village below it took the mountain's name in 1972.",
          "Beyond that, harissa remains a communal and church dish: cooked for a parish, for a saint's day, for a gathering too large for anyone to cater individually. The scale is part of what it means.",
        ],
      },
      {
        id: "history",
        heading: "Documented background",
        paragraphs: [
          "The oldest evidence is textual and not Armenian. Harīsa — pounded wheat cooked with meat — is recorded in the tenth-century Baghdadi cookbook of Ibn Sayyār al-Warrāq, translated into English by Nawal Nasrallah and published in 2007. The dish therefore has a written history of more than a thousand years, and belongs to a shared culinary tradition across the Middle East, where versions under closely related names are still made.",
          "Its attachment to Armenian commemoration is a twentieth-century development, and a specific one. The Musa Dagh episode of 1915 is documented in detail in Raymond Kévorkian's history of the Armenian Genocide. The link that survivors and their descendants drew between that event and this dish — that wheat and meat were what they had, and that harissa was what could be made from it — is preserved as community memory rather than as an archival record, and is presented here on that footing.",
          "A legend repeated in Armenian food folklore attaches the dish instead to Gregory the Illuminator. It is a story told about harissa, not a record of where it came from, and it is worth knowing as folklore rather than as history.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "Korkot is wheat that has been hulled and usually parboiled and dried, so it collapses under long cooking. It is soaked, then simmered with the meat and plenty of water.",
          "The work is in the stirring. As the pot thickens it must be worked constantly with a long paddle or spoon, both to prevent catching and to break the meat down; in a communal cooking, people take this in turns through the night.",
          "Butter is poured over the surface before serving. Many families add nothing else at all; some finish with cumin, and others serve pepper on the side rather than in the pot.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "The September gathering at Musaler is the occasion most people associate with harissa, and it is a commemoration rather than a food festival: the cooking, the all-night vigil at the pots and the distribution are its form.",
          "Elsewhere it is cooked for church and community events, and in winter as a family dish, where the same long cooking is simply spread over an afternoon. In some households it is made on the anniversary of a death.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "The main variable is the meat. Chicken is now the most usual in the Republic of Armenia; lamb is common in Armenian communities of the eastern Mediterranean, and gives a heavier dish.",
          "Wheat varies too — coarser or finer korkot, and in some places barley — which changes how long the cooking takes and how smooth the result is.",
          "Closely related dishes are made across the Middle East and beyond under names descended from the same word, with different grains, different meats and different finishing fats. They are relatives of this dish rather than versions of it, and Armenian harissa is one member of that family.",
        ],
      },
    ],
    importantDates: [
      {
        year: "1915",
        event:
          "The Armenians of the Musa Dagh villages refuse deportation, hold out on the mountain, and are taken off by French warships.",
      },
      {
        year: "2007",
        event:
          "Nawal Nasrallah's English translation of Ibn Sayyār al-Warrāq's tenth-century Baghdadi cookbook is published, making the earliest written harīsa recipes generally available.",
      },
    ],
    significance: {
      heading: "Why harissa matters",
      paragraphs: [
        "Harissa is the clearest example in this section of a dish whose meaning has been rewritten by history. Its written record is a thousand years old and regional; its emotional weight for Armenians today comes from a single event in 1915 and from the commemoration that grew out of it.",
        "It is also a reminder of what a dish of scarcity is. Wheat, meat, water, salt and many hours of stirring will feed a very large number of people, which is why it appears wherever a community has had to eat together with little — and why it is still cooked in a pot too big for one family to have any use for.",
      ],
    },
    interestingFacts: [
      "Harīsa is recorded in a tenth-century Baghdadi cookbook, centuries before it was attached to any modern national cuisine.",
      "At Musaler the pots are lit in the evening and stirred through the night, with singing and dancing around the fires until the food is given out the next day.",
      "Franz Werfel's novel fixed \"forty days\" of resistance in the public imagination; historical accounts of the Musa Dagh episode count rather more.",
      "A legend repeated in Armenian food folklore attributes the dish to Gregory the Illuminator — a story about harissa rather than a record of its origin.",
      "The dish's texture is the test of it: properly made, it pulls away from the spoon in one mass rather than behaving like a soup.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: ["Hulled wheat (korkot)", "Chicken or lamb", "Butter", "Salt", "Cumin or pepper, optionally"],
      preparation:
        "Soaked hulled wheat and meat are simmered together for many hours and stirred continuously with a long paddle until the meat breaks down and the two become a single smooth mass; melted butter is poured over before serving.",
      occasions: [
        "The September commemoration at Musaler",
        "Church and community gatherings",
        "Winter family meals and death anniversaries",
      ],
      regions: [
        "Musaler and Armavir Province",
        "Armenian communities of the eastern Mediterranean, more often with lamb",
        "Diaspora commemorations",
      ],
      serving:
        "Ladled from a communal pot into shallow bowls, with melted butter poured over and cumin or pepper offered separately.",
    },
    relatedSlugs: ["khorovats", "lavash", "ghapama"],
  },

  {
    slug: "gata",
    href: "/cuisine/gata",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Gata",
    seoTitle: "Gata: The Armenian Pastry Filled with Khoriz",
    dishType: "Desserts",
    dishTypeId: "dessert",
    imageSeed: "gata",
    keywords: ["gata", "kata", "Գաթա", "khoriz", "խորիզ", "nazook", "Armenian sweet bread"],
    excerpt:
      "A sweet pastry built around khoriz — flour worked into butter and sugar — made in a different shape and marked with a different pattern in nearly every village that bakes it.",
    metaDescription:
      "Gata, the Armenian sweet pastry built around khoriz — flour rubbed into butter and sugar: its shapes, its scored patterns and its role as a gift.",
    summary:
      "Gata is a sweet baked pastry whose filling has a name of its own: khoriz, flour rubbed into softened butter with sugar until it holds together in crumbs, which melts back into the dough in the oven. The dough is enriched with butter and often yoghurt or sour cream, and the top is glazed with egg and marked before baking — decoration that also keeps the surface from doming. The result is dry rather than moist, and that is what lets it keep and travel: a whole gata, wrapped, is the standard thing to bring when visiting. Almost everything else varies. Sizes run from discs the width of a table to rolls that fit in a hand, many families keep their own pattern for the top, and a walnut version made in the south is often called nazook instead.",
    intro:
      "Gata is a sweet pastry with a filling of its own name: khoriz, flour rubbed into butter and sugar until it is crumbly, which melts back into the dough as it bakes. Beyond that description almost everything varies. Gata can be a disc the width of a table or a roll that fits in a hand; it can be plain or heavily patterned; it can be a celebration cake, a gift carried on a visit, or the thing eaten with afternoon coffee. It was among the sweets demonstrated at the Smithsonian Folklife Festival's Armenia programme in 2018.",
    author: "Armat Editorial Team",
    updated: "2026-07-31",
    keyFacts: [
      { label: "Kind of dish", value: "Sweet baked pastry" },
      { label: "Filling", value: "Khoriz — flour worked into butter and sugar" },
      { label: "Dough", value: "Enriched with butter and often yoghurt or sour cream" },
      { label: "Shapes", value: "Large marked discs, small rolls, braided loaves" },
      { label: "Decoration", value: "Patterns scored or pricked into the top before baking" },
      { label: "Usually eaten with", value: "Tea or coffee" },
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What gata is",
        paragraphs: [
          "Gata is made in two parts. The dough is enriched — butter, and in many recipes yoghurt or sour cream, sometimes egg — and is closer to a pastry than to a bread dough. The filling, khoriz, is flour worked into softened butter with sugar until it holds together in crumbs.",
          "The two are combined either by spreading khoriz over rolled dough and folding it, or by enclosing a quantity of it and flattening the whole. The top is brushed with egg and marked, and the pastry is baked until deep gold.",
          "The result is dry rather than moist, which is not a flaw. Gata keeps and travels, and both of its main social uses depend on that.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "Gata is the standard thing to arrive with. A whole one, wrapped, is an ordinary gift when visiting a household, and cutting it is part of the visit; the same pastry appears on the table when guests are received.",
          "It is also strongly associated with places rather than only with families. Marked discs sold at monastery gates and roadside stalls are, for many people, the form gata takes in memory — bought on a journey, eaten in a car, brought home as a token of where you had been.",
          "The decoration matters more than it looks. Many villages and families keep a pattern, and the marking is how a particular gata is recognised on a table with several.",
        ],
      },
      {
        id: "history",
        heading: "Documented background",
        paragraphs: [
          "Gata belongs to the part of Armenian cooking that is documented well in the modern period and thinly before it. There is no dated origin to give, and this article does not manufacture one.",
          "What is recorded is the repertoire. Sonia Uvezian's The Cuisine of Armenia, first published in 1974, was the first wide-ranging English-language account of Armenian cooking and set down the standard forms of pastries like this one for readers outside the community. Irina Petrosian and David Underwood's Armenian Food: Fact, Fiction & Folklore, published in 2006, took the further step of separating what is documented about Armenian dishes from what is merely repeated about them — a distinction that matters for a pastry surrounded by as much unsourced story as gata.",
          "Ethnographic work on Armenian folk culture, including the material collected in Armenian Folk Arts, Culture, and Identity, places baking of this kind within the household and calendar practices it belongs to rather than treating it as a recipe in isolation.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "The dough is made with flour, butter and a souring dairy element, worked briefly and rested. The khoriz is made separately by rubbing flour into softened butter with sugar; some cooks toast the flour first, and many add vanilla, and in the south walnuts are commonly worked in.",
          "The assembly is where the versions separate. A thin, wide gata is made by spreading khoriz over rolled dough, rolling or folding it, and flattening the result; a thick one encloses a much larger quantity of filling in a smaller circle.",
          "The top is egg-washed and then marked — with a fork, a knife, or a carved wooden stamp — before going into a hot oven. The marking is decorative, but it also stops the surface from doming.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "Gata is a celebration pastry without belonging to any one celebration. It appears at family gatherings, on feast days, at the table for guests, and at the end of ordinary afternoons with coffee.",
          "Many families bake it for particular days in the church calendar, and the practice differs between households and regions rather than following a single rule. It is also common as an offering brought to a church or shared after a service.",
          "In the diaspora it survives strongly, partly because it needs no special equipment and partly because it is the kind of thing an older relative teaches by making it in front of someone.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "The best-known versions are large, round and decorated, and are closely associated with the villages around Geghard and Garni, where they are sold to visitors.",
          "Elsewhere gata is thicker and denser, with a much heavier proportion of filling, or is made as small individual rolls, or as a braided loaf sliced across.",
          "In some regions walnuts are worked into the khoriz, and the version made that way in the south and among Armenians of Iran is often called nazook instead. Whether that is a different pastry or the same one under another name is a question families answer differently, and there is no need to settle it.",
        ],
      },
    ],
    importantDates: [
      {
        year: "1974",
        event:
          "Sonia Uvezian's The Cuisine of Armenia is published, the first wide-ranging English-language account of Armenian cooking.",
      },
      {
        year: "2006",
        event:
          "Irina Petrosian and David Underwood publish Armenian Food: Fact, Fiction & Folklore, separating what is documented about Armenian dishes from what is repeated about them.",
      },
      {
        year: "2018",
        event:
          "Gata is among the sweets demonstrated in the Armenia programme of the Smithsonian Folklife Festival.",
      },
    ],
    significance: {
      heading: "Why gata matters",
      paragraphs: [
        "Gata is the dish in this section with the least documented history and the clearest present-day function. It is what an Armenian household gives, receives and offers, and its keeping quality is what makes that possible.",
        "Its variety is also instructive. There is no single correct gata — the shape, the thickness, the proportion of filling and the pattern on top all change from village to village — and a section that presented one household's version as the authentic one would be describing a family rather than a tradition.",
      ],
    },
    interestingFacts: [
      "The filling has its own name, khoriz: flour rubbed into butter and sugar until crumbly.",
      "Many villages and families keep their own pattern for the top, and the marking is how a particular gata is identified.",
      "Sizes run from discs wide enough to fill a table to rolls that fit in one hand.",
      "The scoring is not only decorative — it keeps the surface from doming in the oven.",
      "A walnut-filled version made in the south and among Armenians of Iran is often called nazook; whether it is the same pastry under another name is answered differently by different families.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Flour",
        "Butter",
        "Sugar",
        "Yoghurt or sour cream",
        "Egg, for the dough and the glaze",
        "Walnuts, in some regional versions",
      ],
      preparation:
        "An enriched dough is rolled out and spread or filled with khoriz — flour rubbed into butter and sugar — then folded or enclosed, flattened, glazed with egg, marked on top and baked until deep gold.",
      occasions: ["Family visits and gifts", "Church feast days", "Everyday tea and coffee"],
      regions: [
        "Villages around Geghard and Garni, for the large decorated discs",
        "Southern Armenia and Armenian communities of Iran, for the walnut versions",
        "Diaspora households and bakeries",
      ],
      serving:
        "Cut into wedges or slices and served with tea or coffee; a whole gata, wrapped, is a usual gift when visiting.",
    },
    relatedSlugs: ["ghapama", "lavash", "dolma"],
  },

  {
    slug: "ghapama",
    href: "/cuisine/ghapama",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Ghapama",
    seoTitle: "Ghapama: Armenian Stuffed Pumpkin, Baked Whole",
    dishType: "Ceremonial dishes",
    dishTypeId: "ceremonial",
    imageSeed: "ghapama",
    keywords: ["ghapama", "khapama", "Ղափամա", "stuffed pumpkin", "Goris", "Armenian festive dish"],
    excerpt:
      "A whole pumpkin filled with rice, dried fruit and nuts and baked until it can be opened at the table — a festive dish whose ingredients place it firmly in the modern era.",
    metaDescription:
      "Ghapama, a whole pumpkin baked with rice, dried fruit and nuts and opened at the table: its festive place, the Goris version, and why it is not ancient.",
    summary:
      "Ghapama is a whole pumpkin, opened at the stem and seeded, filled with part-cooked rice mixed with dried apricots, raisins, walnuts or almonds, butter, honey and cinnamon, then closed with its own lid and baked slowly until the flesh gives. It is carried to the table whole and cut along its natural ridges so that it opens outwards, which is a large part of why it is made. It belongs with the sweet dishes at the end of a meal and is associated in particular with Christmas and New Year tables; families reserved it for feasts because the nuts and dried fruit were costly. A folk song about ghapama is widely sung at Armenian gatherings. It cannot be ancient: every pumpkin of the genus Cucurbita is a plant of the Americas.",
    intro:
      "Ghapama is a whole pumpkin, hollowed and filled with rice, dried fruit, nuts, butter and honey, and baked until the flesh is soft enough to eat with the filling. It is brought to the table whole and cut down its ridges so that it opens outwards, which is a large part of why it is made. It is a dish for feasts rather than for weekdays — historically because dried fruit and nuts were expensive — and it is the one dish in this section whose age can be bounded, because the pumpkin it is built around is not an Old World plant.",
    author: "Armat Editorial Team",
    updated: "2026-07-31",
    keyFacts: [
      { label: "Kind of dish", value: "Whole filled pumpkin, baked" },
      { label: "Filling", value: "Rice, dried apricots, raisins, walnuts or almonds, butter, honey" },
      { label: "Seasoning", value: "Cinnamon, and sometimes other warm spices" },
      { label: "Served", value: "Whole, then cut open at the table" },
      { label: "Place in the meal", value: "Towards the end, among the sweet dishes" },
      { label: "Age", value: "Cannot predate the arrival of the pumpkin from the Americas" },
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What ghapama is",
        paragraphs: [
          "A pumpkin is cut open at the stem to make a lid, seeded, and filled with rice that has been partly cooked and mixed with dried fruit, nuts, butter, honey and cinnamon. The lid goes back on and the whole thing is baked slowly until the flesh gives.",
          "It is served whole and opened in front of the people eating it. The Smithsonian Folklife Festival's account of the dish describes the pumpkin being sliced along its natural indentations so that it falls open like the petals of a flower, revealing the filling.",
          "In the order of an Armenian meal it belongs with the sweet dishes, towards the end, rather than as a main course — although the filling is substantial enough that it is not treated as a light finish.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "Ghapama is a dish of display. It requires a large pumpkin, a long bake and expensive fillings, and it is designed to be revealed rather than served out of sight in the kitchen. That makes it a natural centrepiece for a table set for a celebration.",
          "The Smithsonian's account notes that families reserved it for feasts and festivals precisely because nuts and dried fruit were costly, and that it is traditionally associated with Christmas. Its festive character is therefore economic in origin as much as ceremonial.",
          "It is also unusually well known outside kitchens, because of a folk song about ghapama that is widely sung at Armenian gatherings — familiar enough beyond them that the Smithsonian's account of the dish introduces it by way of the Armenian-American rock band System of a Down.",
        ],
      },
      {
        id: "history",
        heading: "Documented background",
        paragraphs: [
          "Ghapama is the one dish here that can be given an outer limit. Every pumpkin and squash of the genus Cucurbita is a plant of the Americas, and none was grown in the Old World before transatlantic contact. Whatever traditions of filling and baking vegetables preceded it, the dish as it now exists is therefore a comparatively modern one.",
          "That is worth stating plainly, because ghapama is often described as ancient. The technique it uses — hollowing a vegetable and filling it — is old and is shared with the dolma family; the specific combination of that technique with a New World squash is not.",
          "Its documentation, like gata's, is modern: cookbooks, ethnographic collection and, more recently, institutional programmes such as the Smithsonian Folklife Festival's Armenia season in 2018, which published an account of the dish and of a Goris version made with dried Armenian apricots and foraged cornelian cherries.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "The pumpkin has to be sound, roughly spherical and large enough to hold the filling without being so thick-skinned that it will not cook through. It is opened at the top, seeded and scraped.",
          "Rice is partly cooked and mixed with dried apricots, raisins, prunes, walnuts or almonds, butter, honey and cinnamon. Many families add more butter than seems reasonable; that is what keeps the rice from drying against the shell.",
          "The filled pumpkin is closed with its lid and baked slowly for a long time. It is done when a skewer passes easily through the flesh, and it is left to settle before being carried to the table.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "Ghapama is a winter dish by ingredient and a festive one by cost. It is associated in particular with Christmas and New Year tables, and appears at weddings and other large celebrations where a centrepiece is wanted.",
          "The cutting is part of the occasion. Because the dish is opened in front of everyone, it functions as a small ceremony of its own, and the song about it is commonly sung at exactly that point.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "The most-documented regional version is that of Goris, in the south, which uses dried Armenian apricots and cornelian cherries gathered locally.",
          "Elsewhere the fruit follows what a household dries: prunes, raisins, sour plums, apple. The nuts follow the same logic — walnuts most often, almonds where they are cheaper.",
          "Meat versions exist, in which the rice is mixed with lamb or chicken and the dish moves from the sweet end of the meal to the savoury. In some regions no honey is used at all and the sweetness comes only from the fruit. All of these are ordinary; none is the standard against which the others should be measured.",
        ],
      },
    ],
    importantDates: [
      {
        year: "2006",
        event:
          "Irina Petrosian and David Underwood publish Armenian Food: Fact, Fiction & Folklore, one of the few book-length attempts to separate what is documented about Armenian dishes from what is repeated about them.",
      },
      {
        year: "2018",
        event:
          "The Smithsonian Folklife Festival's Armenia programme publishes an account of ghapama, including the Goris version with dried apricots and cornelian cherries.",
      },
    ],
    significance: {
      heading: "Why ghapama matters",
      paragraphs: [
        "Ghapama is the clearest demonstration in this section that a dish can be genuinely traditional without being ancient. Its ingredients place it after transatlantic contact, and it is nonetheless embedded in Armenian celebration, memory and song.",
        "It is also a dish about abundance in a cuisine that is largely about making a great deal from very little. Harissa feeds a crowd from wheat and one animal; ghapama exists to look like more than a household can normally afford, and to be opened where everyone can see it.",
      ],
    },
    interestingFacts: [
      "The pumpkin is cut along its natural ridges so that it opens outwards like the petals of a flower when it reaches the table.",
      "Every pumpkin and squash of the genus Cucurbita comes from the Americas, which puts an outer limit on how old the dish can be.",
      "The Smithsonian's account records that families reserved ghapama for feasts because the nuts and dried fruit in it were expensive.",
      "A folk song about ghapama is sung at Armenian gatherings, and the Smithsonian's account of the dish opens by pairing it with the Armenian-American rock band System of a Down.",
      "The version documented from Goris uses dried Armenian apricots together with foraged cornelian cherries.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "A whole pumpkin",
        "Rice",
        "Dried apricots, raisins and prunes",
        "Walnuts or almonds",
        "Butter and honey",
        "Cinnamon",
      ],
      preparation:
        "The pumpkin is opened at the stem and seeded, filled with part-cooked rice mixed with dried fruit, nuts, butter, honey and cinnamon, closed with its own lid and baked slowly until the flesh is soft.",
      occasions: ["Christmas and New Year tables", "Weddings and large celebrations", "Winter feasts"],
      regions: [
        "Goris and southern Armenia, for the apricot and cornelian cherry version",
        "Throughout the Republic of Armenia",
        "Diaspora celebrations",
      ],
      serving:
        "Carried to the table whole and cut open along its ridges in front of the guests; served towards the end of the meal, with the filling spooned out together with the flesh.",
    },
    relatedSlugs: ["gata", "dolma", "harissa"],
  },
  {
    slug: "spas",
    href: "/cuisine/spas",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Spas",
    seoTitle: "Spas: The Armenian Soup Made from Matsun",
    dishType: "Main dishes",
    dishTypeId: "main",
    imageSeed: "spas",
    keywords: [
      "spas",
      "Սպաս",
      "tanapur",
      "Թանապուր",
      "matsun",
      "մածուն",
      "dzavar",
      "ձավար",
      "Armenian yogurt soup",
    ],
    excerpt:
      "A soup with no stock in it: the liquid is matsun thinned with water, cooked with a grain until it thickens — and the whole method exists to stop the fermented milk from curdling.",
    metaDescription:
      "Spas, the Armenian soup whose body is matsun rather than stock: the grain in it, why it curdles when heated, and what its two names actually record.",
    summary:
      "Spas is a soup whose liquid body is matsun — fermented milk — thinned with water and cooked with a grain, usually dzavar, then finished with herbs. Its defining feature is a technical problem: matsun is acidic, and acidic milk coagulates when it is heated, so a stabiliser of egg or flour is beaten in and the pot is warmed slowly and stirred throughout. It is eaten hot in cold weather and cool in warm weather, with bread, and it belongs to ordinary household cooking rather than to any feast. Its two names arrive from opposite directions — one from an old word for what is served, the other naming the dairy itself — and the age of neither word establishes the age of the dish.",
    intro:
      "Spas is the everyday side of Armenian cooking. It is a soup made from matsun, fermented milk, let down with water and cooked with a grain until it thickens, then finished with herbs; it is served hot or cool, and it is the kind of thing a household eats on an ordinary evening rather than the kind of thing made for a feast. It also sets a real technical problem, because heating fermented milk is exactly what makes it curdle, and most of what is distinctive about preparing spas is the answer to that.",
    author: "Armat Editorial Team",
    updated: "2026-08-20",
    keyFacts: [
      { label: "Kind of dish", value: "Soup built on fermented milk" },
      { label: "Base", value: "Matsun, thinned with water — or tan, which is matsun already diluted" },
      { label: "Grain", value: "Dzavar most characteristically; also rice, wheat berries or barley" },
      { label: "Herbs", value: "Cilantro, mint, parsley or dill, varying by household and season" },
      {
        label: "The technical problem",
        value: "Acidic dairy coagulates when heated; a stabiliser and slow warming prevent it",
      },
      { label: "Served", value: "Hot in cold weather, cool in warm weather, with bread" },
    ],
    sections: [
      {
        id: "what-spas-is",
        heading: "What spas is",
        paragraphs: [
          "Spas is built the other way round from most soups. There is no stock in it. The liquid body of the dish is matsun, Armenian fermented milk, let down with water until it pours, and everything else — the grain, the herbs, the salt — goes into that.",
          "A grain is cooked in it until it softens and the soup thickens a little. Dzavar, hulled and cracked wheat, is the characteristic choice; rice is common in modern kitchens, and whole wheat and barley appear as well. The herbs go in at or near the end.",
          "The result is white, faintly sour, and thicker than water without being anything like a purée. It can be eaten straight from the pot or cooled and eaten cold, and with bread it is a meal rather than a first course before something else.",
        ],
      },
      {
        id: "matsun-as-the-base",
        heading: "Matsun as the base",
        paragraphs: [
          "Matsun is milk fermented by bacteria that turn its sugars into lactic acid. That acidity is what keeps it, what gives it its taste, and — as the next sections describe — what makes it awkward on a stove.",
          "In spas it is not a spoonful stirred in at the table but the body of the dish, and it is nearly always thinned. Some cooks let it down with water; others use tan, which is matsun already diluted and salted, and which is normally drunk as it is.",
          "Matsun has a much wider life than this one soup. It is eaten plain and strained, set beside grain and meat dishes, and worked into dough, and that wider life belongs to an article of its own. What matters here is narrower: it is the liquid, it is acidic, and the method is organised around that fact.",
        ],
      },
      {
        id: "grain-and-herbs",
        heading: "Grain and herbs",
        paragraphs: [
          "Dzavar is wheat hulled and cracked into groats — coarser than semolina, finer than a whole berry — and it is the grain most associated with spas. It softens without dissolving, so the soup thickens while the grain stays distinct in it.",
          "It is not the only one used. Rice is widespread in contemporary cooking and gives a smoother result; whole wheat berries make a chewier soup; barley turns up where barley was the field crop. Presenting any one of these as the correct grain would be describing a household rather than a dish.",
          "The herbs vary more still. Cilantro, mint — often dried — parsley and dill all appear, singly and together, and which of them a cook reaches for depends on the season, the region and what is growing. The Smithsonian's Armenia programme recorded that each region has its own favoured wild plants, and this is a soup in which that shows.",
        ],
      },
      {
        id: "keeping-it-from-curdling",
        heading: "Keeping it from curdling",
        paragraphs: [
          "The interesting thing about spas is a problem rather than an ingredient. Milk is unusually tolerant of heat: unlike egg or meat, its proteins do not set when they are cooked. Harold McGee's account of the chemistry adds the exception that matters here — they do coagulate once the milk has turned acidic. Matsun is acidic by definition, so heating it does precisely what heating milk does not.",
          "Left to itself the mixture separates into grains of curd in a thin liquid. It is still edible; it is not spas. What cooks do about it is to add a stabiliser — an egg or a yolk beaten in, or flour, or the starch the grain itself releases — and to bring the pot up slowly, stirring throughout, so that no part of it races ahead of the rest.",
          "One piece of advice travels with the recipe: stir in one direction. It is worth being exact about its standing. The accounts that explain the chemistry deal in temperature, acidity, agitation and added stabilisers, and none of them makes the direction of the spoon a variable. What the instruction reliably produces is steady, continuous stirring, which does matter. It is kitchen custom rather than a mechanism, and it is repeated here as custom.",
        ],
      },
      {
        id: "two-names",
        heading: "Spas and tanapur",
        paragraphs: [
          "The dish answers to two names, and they arrive from opposite directions. Spas is the older and the stranger of the two. The word is a borrowing from Middle Iranian, where it meant service, and in Classical Armenian its range ran from service, through the vessels and dishes set out for a meal, to what was served in them. The standard dictionary of the classical language, published in Venice in 1836 and 1837, lists soup among its senses.",
          "Tanapur is transparent beside it: tan, the diluted matsun, and apur, soup — the soup made of tan. The same dictionary records an older sense of tan itself that is closer to broth than to a drink, which is a reminder that this vocabulary has moved.",
          "In current usage the two names generally mean the same dish, and this article uses them so. Whether they once meant different things, or divided along regional lines, is not something the available sources settle. What the age of the words does not establish is the age of the soup: a name can be centuries older than the particular thing later attached to it, and no documentary record places this dish in the classical period.",
        ],
      },
      {
        id: "hot-cold-and-the-season",
        heading: "Hot, cold and the season",
        paragraphs: [
          "Spas is commonly described as a winter soup served hot and a summer soup served cold, and in many contemporary accounts that is how the choice is put. It is better read as a range than as a rule: the same preparation works at either temperature, and households differ.",
          "The cold version is the simpler of the two, since a soup that is never heated cannot curdle. That the hot version demands the whole business of stabilising, slow warming and constant stirring, and is made anyway, is a fair measure of how much it is wanted in winter.",
          "Either way it is eaten with bread. Lavash torn into the bowl is the usual accompaniment, and in the cold version, where the soup is thin and sharp, it is what makes the meal substantial.",
        ],
        links: [{ phrase: "Lavash", slug: "lavash" }],
      },
      {
        id: "everyday-cooking",
        heading: "Everyday cooking",
        paragraphs: [
          "Every other dish in this section is, one way or another, an occasion. Harissa is cooked in great pots for a commemoration; ghapama comes to the table at a feast; khorovats gathers people around a fire. Spas is not an occasion. It is what is made on an ordinary evening out of what is already in the house.",
          "The Smithsonian's Armenia programme of 2018 put the distinction plainly: the menu of a feast differs from daily meals in its ingredients, its techniques and the etiquette of serving it. Spas sits on the daily side of that line, and it is the first article in this section that does.",
          "That is also why it is economical in a way the festive dishes are not. Matsun is made at home from milk that would otherwise spoil, the grain is a store-cupboard staple, and the herbs are grown, gathered or dried. It is assembled from what a household already keeps rather than shopped for.",
        ],
        links: [{ phrase: "Harissa", slug: "harissa" }],
      },
      {
        id: "a-wider-family",
        heading: "A wider family",
        paragraphs: [
          "Soups of grain and herbs, and the use of soured or dried dairy in cooking, are not particular to Armenia. Bert Fragner's survey of Iranian cookery for the Encyclopædia Iranica describes porridge-like soups of cereals, vegetables and herbs — the āsh family — as ordinary town food by the fourteenth and fifteenth centuries, and notes the wider use of milk products such as kashk in flavouring them.",
          "The same survey treats the making of yogurt, dried yogurt and white cheese as practices that spread widely and early across the Iranian plateau and Central Asia. Fermented-dairy soups accordingly exist across a broad region under many names, related to one another by method rather than descended one from another.",
          "None of that diminishes the Armenian dish. Spas has its own names, its own characteristic grain, its own herbs and its own place in the day, and those are what this article describes. Which cuisine first made a soup out of fermented milk is not a question the evidence can answer, and not one worth asking.",
        ],
      },
    ],
    importantDates: [
      {
        year: "1836–1837",
        event:
          "The Nor baṛgirkʻ haykazean lezui, the standard dictionary of Classical Armenian, is published in Venice; soup is among the senses it lists for the word spas.",
      },
    ],
    significance: {
      heading: "Why spas matters",
      paragraphs: [
        "Spas is the first dish in this section that nobody puts on a table in order to mark anything, and that is exactly its value here. A cuisine described only through its festive food is a cuisine described through its exceptions, and the ordinary cooking that most people eat most of the time goes unrecorded.",
        "It is also the clearest case in this section of a dish organised around a technique rather than an ingredient list. The whole shape of the preparation — the stabiliser, the slow heat, the unbroken stirring — exists to solve one problem, and understanding that problem explains the dish more completely than any recipe would.",
      ],
    },
    interestingFacts: [
      "There is no stock in spas: the liquid body of the soup is fermented milk let down with water.",
      "Milk proteins are unusually heat-tolerant and do not set when cooked — but they do coagulate once the milk has turned acidic, which is why matsun has to be handled carefully on a stove.",
      "The word spas is a Middle Iranian borrowing meaning service, and passed through the sense of what is set out for a meal before it came to mean this soup.",
      "Tanapur is a transparent compound: tan, the diluted matsun, plus apur, soup.",
      "The familiar instruction to stir in one direction is kitchen custom; the accounts that explain the chemistry deal in temperature, acidity, agitation and stabilisers, not direction.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Matsun, thinned with water",
        "Dzavar — hulled, cracked wheat",
        "Egg or flour, as a stabiliser",
        "Onion",
        "Cilantro, mint, parsley or dill",
        "Salt",
      ],
      preparation:
        "Matsun is thinned and beaten smooth with a stabilising egg or flour, then warmed slowly and stirred throughout so the acidic dairy does not coagulate; the grain is cooked in it until it softens and the soup thickens, and the herbs go in near the end. It is served hot, or cooled and served cold.",
      occasions: ["Ordinary household meals", "Winter, served hot", "Summer, served cool"],
      regions: [
        "Made throughout Armenia and in the diaspora",
        "The grain follows what is grown locally — wheat, and barley where barley was the field crop",
      ],
      serving:
        "In a bowl with bread; hot in cold weather and cool in warm, as a meal in itself rather than a course before one.",
    },
    relatedSlugs: ["harissa", "lavash"],
  },
  {
    slug: "jingalov-hats",
    href: "/cuisine/jingalov-hats",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Jingalov Hats",
    seoTitle: "Jingalov Hats: Artsakh's Herb-Filled Bread",
    dishType: "Bread",
    dishTypeId: "bread",
    imageSeed: "jingalov-hats",
    keywords: [
      "jingalov hats",
      "zhingyalov hats",
      "zhengyalov hats",
      "ժենգյալով հաց",
      "Artsakh",
      "Nagorno-Karabakh",
      "Syunik",
      "Armenian herb bread",
      "herb-filled flatbread",
      "saj",
    ],
    excerpt:
      "A thin round of unleavened dough closed over a filling of chopped greens and cooked on a griddle: the bread of Artsakh, and the one dish in this section whose defining ingredient is a hillside rather than a shopping list.",
    metaDescription:
      "Jingalov hats, the herb-filled flatbread of Artsakh and Syunik: the greens that define it, why the number of them is never fixed, and what the record can say.",
    summary:
      "Jingalov hats is a flatbread of Artsakh and Syunik: unleavened dough rolled thin, heaped with a large mixture of finely chopped greens, closed over the filling and cooked on a flat metal plate over a fire. What defines it is the filling rather than the bread, and the filling is a working system rather than a recipe — mild leaf greens for bulk, aromatic ones for scent, sour and bitter ones in small amounts for balance. Accounts of how many kinds go in disagree, and the disagreement is the point, because the mixture follows the season and the hillside. It enters the written record only in the nineteenth century, and since 2023 it has been made mostly away from the place whose plants define it.",
    intro:
      "Jingalov hats is bread used as a container. A round of unleavened dough is rolled until it is nearly transparent, a large quantity of finely chopped greens is spread over it, the dough is drawn up and sealed, and the parcel is flattened again and cooked on a hot metal plate until it blisters. It belongs to Artsakh and to neighbouring Syunik rather than to the Armenian world as a whole, which makes it the first strongly regional dish in this section, and its filling is the reason it resists being written down as a recipe: what goes into it is what the season and the hillside are offering.",
    author: "Armat Editorial Team",
    updated: "2026-08-24",
    keyFacts: [
      { label: "Kind of dish", value: "Unleavened flatbread filled with chopped greens" },
      {
        label: "Where from",
        value: "Artsakh — Nagorno-Karabakh — and Syunik, rather than the Armenian world as a whole",
      },
      {
        label: "The filling",
        value: "Many greens at once: mild leaves for bulk, aromatics, and small amounts of sour and bitter",
      },
      {
        label: "How many greens",
        value: "Accounts range from about ten to twenty-six; the mixture follows the season, not a count",
      },
      {
        label: "Cooked on",
        value: "A saj — a metal plate over a fire — in minutes, rather than against the wall of a tonir",
      },
      { label: "Season", value: "Early spring and autumn, when the wild greens are up" },
    ],
    sections: [
      {
        id: "what-jingalov-hats-is",
        heading: "What jingalov hats is",
        paragraphs: [
          "The dish is one object made of two opposite things. The bread is as plain as bread gets: wheat flour, water and salt, unleavened, rolled thin. The filling is the opposite of plain — a dense mixture of many different greens, chopped fine and dressed with oil and salt, in a quantity that looks impossible until the dough closes over it.",
          "It is cooked flat and dry. The sealed parcel is pressed out until the greens show dark through the dough, then laid on a hot surface and turned once, so that both faces scorch in places while the filling steams inside. The whole thing takes minutes.",
          "It is eaten warm, in the hand, on its own. It is not a course, not an accompaniment and not a pastry: the dough is a skin thin enough to be part of the mouthful rather than the substance of it, and what a person tastes is the greens.",
        ],
      },
      {
        id: "a-food-of-artsakh",
        heading: "A food of Artsakh",
        paragraphs: [
          "Jingalov hats belongs to Artsakh — the upland region between Armenia and Azerbaijan that Armenians call Artsakh and that international usage more often calls Nagorno-Karabakh — and to Syunik, the Armenian province along its western side. Both names appear in the sources used here, and they are kept apart rather than merged: they are not interchangeable, and which one a given source reaches for is itself information.",
          "The regional attachment is the first thing to state, because it is unusual in this section. Lavash, dolma, harissa and the rest are made wherever Armenians are. This one is not. It is the dish of a particular upland, and the reason is agricultural rather than sentimental: the filling depends on what grows there.",
          "The region's Armenians speak their own dialect, and the name of the dish belongs to it. Nothing in this article requires a position on the region's status. What it does require is that the dish be described as coming from a specific place with a specific flora, because otherwise the most interesting thing about it disappears.",
        ],
      },
      {
        id: "the-language-of-greens",
        heading: "The language of greens",
        paragraphs: [
          "The filling is a system rather than a list. Descriptions of it — from cooks in Stepanakert, from displaced households in Yerevan, from a bakery in California — set out the same architecture: a bulk of mild leaf greens, a smaller quantity of strongly aromatic herbs, a sour element, and a little bitterness, balanced against each other.",
          "The mild greens do the work of volume: spinach, chard, beet greens, lettuce and their wild equivalents. The aromatics are the ones most readers will know — cilantro, dill, parsley, mint, green onion, green garlic. Sorrel supplies acidity. Dandelion and its relatives supply a bitter edge, and they go in sparingly, because a filling that is mostly bitter is a mistake rather than a variant.",
          "Nettle turns up in many accounts and deserves a note of its own: it stings raw and stops stinging once it is cooked, which is why a plant nobody would eat from the hand is ordinary inside this bread. Some cooks sharpen the mixture at the end with lemon, or with the purple powder of dried barberries.",
        ],
      },
      {
        id: "how-many-greens",
        heading: "How many greens",
        paragraphs: [
          "Almost every account of jingalov hats reaches for a number, and the numbers do not agree. Ara Zada, co-author of a book on Armenian cooking, told RFE/RL in 2024 that the original recipe called for twenty-six herbs and greens and that around seventeen are usual today. The Smithsonian's account of displaced Artsakh families gives ten to twenty. Other totals circulate, some of them rounder than the sources that carry them.",
          "The disagreement is not a failure of the sources. It follows from what the dish is. A mixture assembled from what is growing, in a particular week, on a particular slope, cannot have a fixed count — and the same cook will not arrive at the same number twice in one season.",
          "So the honest statement is about abundance rather than arithmetic. Many kinds go in, more than into any other dish in this section, and a specific total should be read as a description of one recipe or one household rather than as a rule. Where a round number is offered as the authentic count, it is a claim about authenticity and not a measurement.",
        ],
      },
      {
        id: "knowing-what-to-pick",
        heading: "Knowing what to pick",
        paragraphs: [
          "Ruzanna Tsaturian, a researcher at the Institute of Archaeology and Ethnography of Armenia's National Academy of Sciences, has described the dish as traditionally made in early spring and in autumn, when the necessary wild herbs grow. That is the constraint the whole tradition sits inside: the bread is available when the hillside is.",
          "It also indicates where the dish came from. In the countryside of Nagorno-Karabakh, someone who knew which greens to pick could make a meal out of flour, water and what could be gathered, in seasons when there was little else. Tsaturian describes households returning to it during the shortages of the war of the 1990s, and calls it in that context the forest bread of their ancestors.",
          "The knowledge involved is specific — which plants, which weeks, which parts of them, and which ones must be cooked before they can be eaten at all — and it is held in households rather than written down. This article describes that knowledge. It does not try to convey it: which wild plants are safe to eat is not something to learn from a page about food.",
        ],
      },
      {
        id: "dough-and-enclosure",
        heading: "Dough and enclosure",
        paragraphs: [
          "The dough is the plainest element of the dish: wheat flour, water and salt, unleavened, rested and rolled out until it is very thin. Nothing enriches it, and nothing is meant to.",
          "The enclosure is what makes the object. The greens are spread over the round, the edge is drawn up over them and pinched shut, and the sealed parcel is rolled or pressed flat again — so that the filling ends up as a thin layer between two thin layers of dough rather than sitting in a pocket. Getting a very wet filling to stay inside a very thin wrapper through that flattening is the actual skill of the dish.",
          "The proportions run the opposite way from most filled breads. There is far more filling than dough by volume, and the dough is present as a skin. That is why the finished bread reads green through its surface, and why it is a different kind of thing from a pie.",
        ],
      },
      {
        id: "the-griddle-and-the-tonir",
        heading: "The griddle, not the tonir",
        paragraphs: [
          "It is cooked on a saj, a metal plate set over a fire, and it is done in minutes. Some accounts allow a tonir, the clay pit oven, as an alternative. The plate is the characteristic method, and the two should not be run together simply because both are Armenian and both involve fire.",
          "The distinction matters because of the obvious comparison. Lavash is the other thin Armenian wheat bread, and it is made in a quite different way: the sheet is slapped against the inner wall of a tonir and lifted off seconds later, which is how the UNESCO inscription of 2014 describes it. Lavash is thin bread presented as bread. Jingalov hats uses a similarly thin sheet of wheat dough as a wrapper for something else.",
          "The comparison is worth making and worth limiting. Both are unleavened wheat breads rolled thin by hand, and both belong to a wide regional family of such breads. Neither is a version of the other, and the cooking surface is the plainest evidence of that.",
        ],
        links: [{ phrase: "Lavash", slug: "lavash" }],
      },
      {
        id: "what-the-record-can-say",
        heading: "What the record can say",
        paragraphs: [
          "The written record is short, and saying so is more useful than filling it in. Tsaturian places the first textual mentions of the dish at around two hundred years ago. An account published when it was listed as heritage puts the same thing differently: it was first mentioned in written manuscripts of the nineteenth century, at the period when Artsakh folklore was being collected.",
          "Both statements point at the same moment, and it is a moment of recording rather than of invention. Nineteenth-century collectors wrote down what people were already doing, so the dish is certainly older than its first mention — but how much older is not something the available evidence establishes. No source consulted here places it in antiquity, and neither does this article. A living regional tradition does not need an ancient origin to be worth describing.",
          "What can be dated is its recent institutional life. In 2013 the authorities in Artsakh added the dish to their register of intangible cultural heritage, and in April 2015 the first festival devoted to it was held at Tsaghkashat, in the Askeran district, as part of a heritage-preservation programme. Tsaturian observes that across the twentieth century it had drifted towards being, in her phrase, entertainment food rather than a daily staple — so the listing and the festival were recognising something that had already changed.",
        ],
      },
      {
        id: "a-food-away-from-its-place",
        heading: "A food away from its place",
        paragraphs: [
          "In September 2023, following an Azerbaijani military offensive, almost the entire Armenian population of Nagorno-Karabakh — more than a hundred thousand people — left for Armenia. The dish went with them. Stalls and small businesses run by displaced families appeared in Yerevan and in towns across the country, and by 2024 RFE/RL was describing jingalov hats as a street food of pizza-like popularity.",
          "One thing did not travel. Writing in the Smithsonian's folklife magazine in February 2025, Aline Keledjian quotes a woman from Stepanakert on exactly the problem: the same herbs cannot be found in Armenia, because they grow in the mountains of Artsakh. A recipe can be carried in a suitcase; a hillside cannot. A dish defined by a local flora is altered by being moved in a way that a dish defined by a technique is not.",
          "The tradition continues in that altered form. Families displaced in the earlier war of 2020 opened restaurants in Yerevan to keep making it, and a bakery in Glendale, California that serves nothing else became in 2023 the first Armenian restaurant in the United States to be listed in the Michelin guide. None of that replaces the place. Describing it as continuity rather than as recovery is the accurate reading, and it is the reading this article takes.",
        ],
      },
    ],
    importantDates: [
      {
        year: "2013",
        event:
          "The dish is entered on the register of intangible cultural heritage maintained by the authorities in Artsakh.",
      },
      {
        year: "2015",
        event:
          "The first festival devoted to jingalov hats is held at Tsaghkashat, in the Askeran district of Artsakh, under a heritage-preservation programme.",
      },
      {
        year: "2023",
        event:
          "Almost the whole Armenian population of Nagorno-Karabakh is displaced to Armenia in September; the dish is afterwards made mainly outside the region whose plants define it.",
      },
    ],
    significance: {
      heading: "Why jingalov hats matters",
      paragraphs: [
        "This is the first article in the section about a dish that is not made everywhere Armenians live, and that is the point of adding it. A national cuisine described only through its pan-national dishes is a cuisine with its regions edited out, and the regions are where most of the cooking actually happened.",
        "It is also the clearest case in this archive of a dish inseparable from a landscape. The technique can be taught anywhere and the dough can be made anywhere; the filling is a set of plants that grow on particular mountains in particular weeks. That is what makes it an unusually good article to write and, since 2023, an unusually difficult one.",
      ],
    },
    interestingFacts: [
      "The filling has no fixed list: accounts of how many kinds of green belong in it range from about ten to twenty-six, because the mixture follows what is growing.",
      "Nettle is an ordinary ingredient. It stings raw and stops stinging once cooked, which is why a plant nobody would eat from the hand belongs inside this bread.",
      "There is more filling than dough by volume, and the wrapper is thin enough that the greens read dark green through it before it goes near the heat.",
      "It is cooked on a metal plate over a fire rather than against the wall of a tonir, which is the plainest thing separating it from lavash.",
      "Its first written mentions belong to the nineteenth century, when Artsakh folklore was being collected — a date of recording rather than of invention.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Wheat flour, water and salt — unleavened dough",
        "Mild leaf greens: spinach, chard, beet greens, lettuce and wild equivalents",
        "Aromatics: cilantro, dill, parsley, mint, green onion, green garlic",
        "Sorrel and other sour greens",
        "Nettle and other wild greens, in smaller quantities",
        "Oil and salt",
      ],
      preparation:
        "Unleavened dough is rolled very thin and heaped with a large quantity of finely chopped greens dressed with oil and salt; the edge is drawn up, sealed, and the parcel pressed flat again so the filling lies in a thin layer inside. It is cooked dry on a hot metal plate over a fire and turned once, until both faces are marked.",
      occasions: [
        "Everyday eating, in the seasons when the greens are up",
        "Made communally, with several people chopping and shaping at once",
        "Festivals devoted to the dish",
      ],
      regions: [
        "Artsakh — Nagorno-Karabakh — where it is the best-known dish of the region",
        "Syunik, the neighbouring Armenian province",
        "Since 2023, made mainly in Armenia, by displaced households",
      ],
      serving:
        "Eaten warm and in the hand, on its own, soon after it comes off the heat rather than kept.",
    },
    relatedSlugs: ["lavash"],
  },
];
