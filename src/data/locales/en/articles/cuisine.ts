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
  {
    slug: "khash",
    href: "/cuisine/khash",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Khash",
    seoTitle: "What Is Khash? Armenia's Winter Morning Meal",
    dishType: "Meat dishes",
    dishTypeId: "meat",
    imageSeed: "khash",
    keywords: [
      "khash",
      "Armenian khash",
      "խաշ",
      "khash soup",
      "Armenian winter food",
      "winter morning meal",
      "cattle feet broth",
      "garlic and lavash",
      "Gyumri",
      "khashlama",
    ],
    excerpt:
      "A broth of cattle feet boiled through most of a night and eaten at first light in the cold months: the Armenian dish that arrives unfinished, and that nobody eats alone.",
    metaDescription:
      "Khash, the Armenian broth of long-boiled cattle feet eaten on winter mornings: why it is cold-season food, how its table works, and what the record supports.",
    summary:
      "Khash is a broth made by boiling cattle feet in plain water for most of a night, then served scalding and unsalted on winter mornings. Each person finishes their own bowl with garlic, salt and crumbled dried lavash, which is why the dish is a table rather than a plate. Custom attaches it to the cold months and to the early hours, and every account of it agrees on one thing before it agrees on anything else: it is not eaten alone. The two claims repeated most often about khash in English, that it is ancient and unchanged and that it cures hangovers, are the two the evidence supports least.",
    intro:
      "Khash is what happens when the toughest parts of an animal are given enough time. Cattle feet are cleaned, soaked in cold water for many hours, and then simmered in nothing but water until the broth is thick with what has come out of them and the meat falls off the bone. That is most of a night's work for something eaten at dawn. It reaches the table boiling and unseasoned, and each person at the table finishes their own bowl with garlic, salt and crumbled dried bread. The food is that simple. The season, the hour, the toasts and the company are the practice built around it, and the practice is what this article is mainly about.",
    author: "Armat Editorial Team",
    updated: "2026-08-24",
    keyFacts: [
      { label: "Kind of dish", value: "A broth of long-boiled cattle feet, served scalding" },
      {
        label: "Season",
        value:
          "The cold half of the year — customarily the months whose Armenian names carry the letter ր",
      },
      {
        label: "Time of day",
        value: "Early morning, before ordinary breakfast rather than alongside it",
      },
      {
        label: "In the pot",
        value: "Feet and water, and nothing else; the cook adds no salt, because salt darkens the broth",
      },
      {
        label: "At the table",
        value: "Garlic, salt, dried and fresh lavash, radish, fresh greens and pickles, added by each person",
      },
      { label: "Eaten", value: "In company — the one thing every account of the dish agrees on" },
    ],
    sections: [
      {
        id: "what-khash-is",
        heading: "What khash is",
        paragraphs: [
          "Khash is a broth and the parts of the animal that made it. In present-day Armenia those parts are the feet of cattle, boiled until the liquid is dense with what has dissolved out of them. Some accounts include the head and the stomach as well, and Armenian cooks describe older practice as using lamb more often than beef. What every version has in common is the choice of the parts that are useless quickly and good slowly.",
          "It is not a soup in the sense the English word suggests, and calling it one is the first thing that misleads a reader. Nothing goes into the pot except the feet and water: no vegetables, no stock, no aromatics, not even salt. The body of the finished broth is not the result of anything added to thicken it, which is why the dish sits in this section as a meat dish rather than among the soups.",
          "The last thing to say about it is the strangest, and everything later in this article follows from it. What arrives at the table is deliberately unfinished. It is scalding, it is plain, and it is not yet seasoned, and the person who is going to eat it is the person who completes it.",
        ],
      },
      {
        id: "a-dish-made-by-time",
        heading: "A dish made by time",
        paragraphs: [
          "The length of the cooking is not tradition for its own sake; it is what the ingredient requires. Feet and shanks are mostly connective tissue, and connective tissue is collagen, which is tough and does not soften in a short cooking. Held long enough in water below a rolling boil, collagen breaks down into gelatin, which dissolves and thickens the liquid. The parts that resist a quick fire are exactly the parts that give a broth its body when they are given a night.",
          "The laborious half comes before the pot. The feet are cleaned of hair and soaked in cold water that is changed repeatedly, for a stretch of hours that the sources put anywhere from ten to forty-eight. The disagreement there is real rather than apparent: it depends on the animal, on the water and on the household, and no source consulted here presents a single correct figure.",
          "One detail of technique matters more than any timing, and it shapes the whole table. The cook does not salt the broth. Sedrak Mamulyan, who heads an Armenian association for the preservation of culinary traditions, gives the reason plainly: salt darkens it. The same instruction, for the same reason, appears in the Encyclopaedia Iranica's account of a related Persian dish, which is a piece of evidence worth holding onto for a later section.",
        ],
      },
      {
        id: "the-months-with-an-r",
        heading: "The months with an R",
        paragraphs: [
          "Khash is cold-weather food, and the customary way of saying so is a rule about spelling: it is eaten in the months whose names contain the letter ր. In Armenian that works out exactly. September through April all carry it, and the four months of the warm half of the year — մայիս, հունիս, հուլիս, օգոստոս — do not.",
          "The explanation usually offered is straightforwardly practical. Khash is heavy and rich, and the cold half of the year is when a body is thought to want that; Armenian cooks interviewed by the investigative outlet Hetq add that livestock-keeping was concentrated in the mountain districts, where those particular months are genuinely cold. Whether or not one accepts the reasoning, the seasonal practice it describes is well attested.",
          "The rule itself, though, cannot be old, and noticing why is more useful than repeating it. It depends entirely on the modern Armenian month names, which are borrowings of the Latin ones and brought the r along with them. The older Armenian calendar used quite different names — Նավասարդ, Հոռի, Սահմի, Տրե and the rest — which do not sort into a cold set and a warm set by any letter at all, and which drifted through the seasons anyway, because that calendar ran three hundred and sixty-five days with nothing added to correct it. The saying is a good mnemonic for a real practice. It is not evidence of the practice's age, and it is not followed strictly now either: restaurants serve khash outside those months.",
        ],
      },
      {
        id: "the-morning-table",
        heading: "The morning table",
        paragraphs: [
          "That khash is a morning food is not in doubt. Armenian sources describe it eaten early, in place of breakfast rather than alongside it, and often on a weekend; visitor-facing accounts describe gatherings beginning at eight or nine. The custom is consistent across every kind of source consulted for this article.",
          "The reason for it is another matter, and it is worth saying plainly that no source consulted establishes one. The most concrete explanation is simply mechanical: a dish that needs most of a night is ready in the morning, and the writer Benjamin Kemper, describing khash for the Smithsonian's folklife programme, notes that a gathering at nine obliges the cook to have started overnight. The same logic surfaces independently in Iran, where the related dish is likewise a morning food and likewise cooked overnight.",
          "Other explanations circulate — that the dish is too heavy for later in the day, that it warms a cold start, that it belongs to the morning after an evening of eating and drinking. Each is plausible and none is documented as the cause. The honest position is that the custom is certain and its origin is not, and an article that supplied a confident reason here would be inventing one.",
        ],
      },
      {
        id: "the-bowl-you-finish-yourself",
        heading: "The bowl you finish yourself",
        paragraphs: [
          "Because the pot cannot be seasoned, the table must be. What comes round is garlic — crushed, often worked with salt or slaked with a little of the hot broth — along with salt itself, radish, fresh greens and pickles. Each person seasons their own bowl to their own taste, and the quantities are theirs to decide. This is the structural fact about khash that photographs never quite convey: the dish is a table rather than a plate, and eating it is something each person does to it rather than merely with it.",
          "Lavash does two jobs at that table, which is why it belongs here rather than in a list of side dishes. Dried lavash is crumbled into the broth until the liquid thickens towards a porridge, and soft lavash is used to scoop and to wrap; some accounts also describe a sheet laid over the bowl to hold the heat in. The dried form exists at all because lavash keeps for months and is brought back with a sprinkle of water, the property the UNESCO record of the bread describes — which is precisely why a winter dish has bread available to it in a form that behaves like an ingredient.",
          "The garlic is not modest. One account puts it at up to eight cloves a portion, which should be read as an observation rather than a rule. It is worth separating the widely attested from the singular here: garlic, salt, lavash, radish, greens and pickles recur across Armenian-language reporting and institutional writing alike, whereas lemon and vinegar belong to a particular modern recipe. One restaurant table is not a national custom, and the difference between the two is the kind of thing this article exists to mark.",
        ],
        links: [{ phrase: "Lavash", slug: "lavash" }],
      },
      {
        id: "never-eaten-alone",
        heading: "Never eaten alone",
        paragraphs: [
          "Every source consulted for this article agrees on one thing before it agrees on anything else. Rafik Nahapetyan, surveying the Armenian food system for the Historical-Philological Journal in 2019, states it as a plain ethnographic fact: khash, in our own day as before, is almost never enjoyed without guests. One of the chefs interviewed by Hetq puts the same point in ordinary words — nobody gathers for khash in order to stop being hungry, since a bowl of sorrel soup would do that; they gather in order to sit down together.",
          "The gathering has customary shape. Hetq records three toasts in order — a greeting, then one to whoever cooked it, then a wish that the khash be a good one — while Kemper records the sequence as the day, the cooks and the guests, and one of the Hetq chefs objects that fixing a number at all misses the point. Some modern accounts describe vodka or fruit spirit as part of these adult gatherings; this article records that as documented custom and nothing more, and it is neither required by the dish nor recommended here. The gathering has also been strongly gendered: it was historically a male occasion, and the ethnographer Ruzanna Tsaturyan has described women's khash parties as something that would have been hard to imagine a decade before she spoke and is now unremarkable.",
          "What the table has meant has changed with what surrounded it. The cultural scholar Hrach Bayadyan, also speaking to Hetq, describes khash acquiring a quiet edge among the Soviet-era intelligentsia: an occasion outside the state's calendar of organised public ones, a morning spent deliberately not working, and in that sense a mild form of refusal. The city most attached to the dish makes the same point from another direction. Gyumri claims to like khash more than anywhere else in Armenia, and Mamulyan reports that the custom of eating it on the morning after a wedding has survived there in particular.",
        ],
        links: [{ phrase: "Gyumri", slug: "gyumri" }],
      },
      {
        id: "what-the-record-can-say",
        heading: "What the record can say",
        paragraphs: [
          "The word says less than it appears to. Khash is the Armenian verb meaning to boil, pressed into service as a noun, and the same root produces khashlama, which is a different dish altogether. That tells us the thing is named after its method, which is a fact about naming rather than about age. This article does not attempt to date the word, because the Armenian lexicographic works that could do so properly were not available to consult.",
          "A list of medieval authorities travels through nearly every English-language account: Grigor Magistros in the eleventh century, Mkhitar Heratsi in the twelfth, Yesayi Nchetsi in the thirteenth, with the dish under an older form of the name. Heratsi's medical encyclopedia of 1184 is a real and much-studied work, and secondary writing reports that it describes khash as having healing properties. None of those texts was consulted here, the attributions pass from one popular account to the next without a passage attached, and — even taken at face value — a medieval physician recommending a boiled preparation is not evidence that today's dish and today's table descend from it. The claim is reported here as a claim, which is the most this article can honestly do with it.",
          "What the ethnographic record does offer points somewhere less expected. Tsaturyan reports that the few historical references that exist characterise khash as a wedding food, which is the same association that survives in Gyumri. Nahapetyan places it among a small group of ritual dishes — Harissa dedicated to the grain harvest, milk soup to the abundance of dairy, khash to the success of livestock-keeping — though that is a reconstruction argued from later practice rather than a dated attestation, and it should be read as one. And there is a plain institutional fact worth stating: khash does not appear on Armenia's national inventory of intangible cultural heritage, though lavash, gata, matsun, tolma, winemaking and fruit-spirit distilling all do.",
        ],
        links: [{ phrase: "Harissa", slug: "harissa" }],
      },
      {
        id: "the-story-about-poor-peoples-food",
        heading: "The story about poor people's food",
        paragraphs: [
          "One account of khash's origin is repeated more than any other. It holds that khash was the food of the poor: that the good cuts went to the wealthy, that the feet and the offal were thrown out or handed down, and that the people who received them made something remarkable out of what nobody else wanted.",
          "It is worth noticing that its mirror image circulates alongside it — a king tastes the villagers' dish, likes it, and makes it fashionable — and that two stories explaining the same thing in opposite directions are usually both stories. Mamulyan rejects the class account outright, arguing that foods in the past did not carry a marked belonging to one social group. His colleague Grisha Antinyan does not rule it out, but compares it to what people say about the origins of pizza, which amounts to recognising the shape of a folk narrative rather than a documented history.",
          "Something does survive the audit, and it is smaller and duller than the story. Using the whole animal is ordinary practice in a household that has slaughtered one, and it requires no explanation in terms of class at all. That much is economic practicality, and it is well attested. Khash as documented social history of the poor is not established by anything consulted for this article, and the earliest association the ethnographic record actually offers — a wedding — is not an ordinary weekday in a poor household.",
        ],
      },
      {
        id: "a-dish-with-relatives",
        heading: "A dish with relatives",
        paragraphs: [
          "Boiled head-and-trotter dishes are made across a wide region, under names that are sometimes the same word and sometimes not: khashi in Georgia, xaş in Azerbaijan, pacha and kalla-pāča in Iran, kelle paça in Turkey, and relatives further afield in the Balkans and Central Asia. Armenian khash belongs to that family, and describing it does not require deciding who had it first.",
          "The comparison is more useful than any ownership claim, because of how closely the practices match. The Encyclopaedia Iranica's entry on kalla-pāča describes a sheep's head and trotters cooked over low heat, usually overnight; reserved for the colder days of the year; served in the morning; salted only at the end, because salt blackens the meat; prepared in specialist shops with their own guild rather than at home; and, in a nineteenth-century account, served with vinegar, onion or crushed garlic. Almost every structural feature of the Armenian practice appears there, in a tradition that arrived at it separately.",
          "That convergence is best read as evidence about the food rather than about influence. A preparation that takes a night is ready in the morning; a heavy gelatinous broth suits cold weather; a pot that cannot be salted forces the table to season itself; a dish that is hard to make at home becomes a reason to gather. The most interesting difference is in the naming. Persian names the parts — head and trotter — and Armenian names the method. Two traditions describing the same dish by different halves of it, and neither this article nor its sources needs to turn that into a competition.",
        ],
      },
      {
        id: "the-hangover-reputation",
        heading: "The hangover reputation",
        paragraphs: [
          "In English, khash usually arrives attached to a single claim. Headlines call it a hangover cure, and a reader who searches for the dish will meet that description before they meet the dish. It is the most widely repeated thing said about khash outside Armenia.",
          "Where it comes from is not mysterious. Khash is eaten in the morning, in company, and Armenian descriptions note that it often follows a festive evening the night before. A food eaten the morning after acquires the reputation of a remedy for the morning after, and once the association exists, food writing repeats it because it makes a good line.",
          "What matters is what kind of claim it is. It is a popular belief and a piece of modern food writing — a social association rather than a medical conclusion. Nothing consulted for this article establishes a therapeutic effect, and this article makes no claim about one. It is set out here because it is what most English-language pages lead with, and a reader arriving from them is owed the distinction.",
        ],
      },
    ],
    importantDates: [
      {
        year: "1184",
        event:
          "Mkhitar Heratsi completes his medical encyclopedia, the work later accounts most often name when they date khash to the Middle Ages; the text itself was not consulted for this article.",
      },
      {
        year: "2012",
        event:
          "Khash becomes the subject of peer-reviewed anthropology, analysed as a male gathering and a national narrative rather than as a recipe.",
      },
      {
        year: "2019",
        event:
          "Rafik Nahapetyan's survey of the Armenian food system places khash among the ritual dishes tied to livestock-keeping, and records that it is still almost never eaten without guests.",
      },
    ],
    significance: {
      heading: "Why khash matters",
      paragraphs: [
        "Khash is the second meat dish in this section and the first that is far more interesting as a practice than as a preparation. The recipe is two lines long and contains one ingredient. Everything else worth knowing about it is the season, the hour, the table and the company — which makes it an unusually good subject for an archive that treats food as culture rather than as instruction.",
        "It is also the clearest case so far of a dish whose popular history and documented history do not match. The two things said about it most often in English are the two the evidence supports least, and telling them apart from what named scholars actually say is most of the work this article does.",
      ],
    },
    interestingFacts: [
      "The rule that khash belongs to the months with an r in them works in Armenian only because Armenian borrowed its month names from Latin and the r came with them; with the older Armenian month names it would not work at all.",
      "The cook never salts the broth, because salt darkens it — and the same instruction, for the same reason, is given in Iran for a related dish by an entirely separate tradition.",
      "Dried lavash is crumbled into the bowl until the broth thickens, a use for bread that depends on lavash keeping for months and reviving with water.",
      "The word is the verb to boil doing duty as a noun; the same root gives khashlama, which is a different dish and should not be confused with this one.",
      "Khash is absent from Armenia's national inventory of intangible cultural heritage, although lavash, gata, matsun, tolma and fruit-spirit distilling are all on it.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Cattle feet — trotters — as the characteristic part",
        "The head and the stomach in some accounts and some households",
        "Water, and nothing else in the pot",
        "Garlic, crushed and often worked with salt, added at the table",
        "Dried and soft lavash, radish, fresh greens and pickles",
        "Salt, which each person adds to their own bowl",
      ],
      preparation:
        "The feet are cleaned and soaked in cold water that is changed repeatedly over many hours, then simmered in plain unsalted water for most of a night, until the collagen has broken down and the broth has body. It is served scalding and unseasoned, and finished by each person at the table.",
      occasions: [
        "Winter mornings, and weekend mornings in particular",
        "Gatherings of family, friends and neighbours, with customary toasts",
        "In Gyumri, the morning after a wedding",
      ],
      regions: [
        "Throughout Armenia, as a cold-season practice rather than a regional dish",
        "Gyumri and Shirak, where the attachment to it is strongest",
        "Part of a wider regional family of boiled head-and-trotter dishes",
      ],
      serving:
        "Served boiling and unsalted in a deep bowl, with garlic, salt and the accompaniments passed round so that each person seasons and thickens their own portion.",
    },
    relatedSlugs: ["lavash", "harissa"],
  },
  {
    slug: "matsun",
    href: "/cuisine/matsun",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Matsun",
    seoTitle: "What Is Matsun? Armenia's Fermented Milk",
    dishType: "Dairy",
    dishTypeId: "dairy",
    imageSeed: "matsun",
    keywords: [
      "matsun",
      "matzoon",
      "մածուն",
      "Armenian matsun",
      "Armenian yogurt",
      "fermented milk",
      "matsoni",
      "chortan",
      "kamats matsun",
      "starter culture",
    ],
    excerpt:
      "Milk set thick by its own bacteria, eaten every day and turned into half the rest of the cooking: the first Armat Cuisine article about an ingredient rather than a dish.",
    metaDescription:
      "Matsun, the Armenian fermented milk: how bacteria set it, how a starter carries from batch to batch, what it becomes, and what the record actually supports.",
    summary:
      "Matsun is milk fermented by lactic-acid bacteria until it sets into a thick, sour, spoonable food. It is eaten plain and with bread, and it is also the base the cooking is built on: thinned into a drink, cooked into soup, drained and salted for keeping, or dried into hard sour balls that last years. A portion of one batch starts the next, which is why traditional matsun carries a local microbial population rather than a bought culture. The Armenian and Georgian traditions are one food under two names, and microbiologists from both countries have studied them together. The word is native Armenian and old; how far back the food in its present form goes is a separate question the evidence does not settle.",
    intro:
      "Matsun is what milk becomes when the right bacteria are allowed to work on it. They turn its sugar into acid, the acid destabilises the protein, and the whole vessel sets into something thick, sour and spoonable that keeps far longer than the milk did. That is the entire transformation, and Armenian households have been running it continuously for a very long time by the simplest possible method: keeping back a spoonful of yesterday's to start tomorrow's. This is the first article in this section about a foundational food rather than a finished dish. Matsun is eaten on its own, and it is also the thing a great deal of other Armenian cooking is made out of.",
    author: "Armat Editorial Team",
    updated: "2026-08-25",
    keyFacts: [
      { label: "Kind of food", value: "Fermented milk, set thick — a dairy food rather than a prepared dish" },
      { label: "Made from", value: "Cow's milk usually; also sheep, goat, buffalo, or mixtures" },
      {
        label: "What sets it",
        value: "Lactic-acid bacteria — Lactobacillus and Streptococcus dominate, with yeasts also present",
      },
      {
        label: "Started by",
        value: "A portion of the previous batch, which carries a local microbial population forward",
      },
      {
        label: "Kept as",
        value: "Fresh; drained and salted as kamats matsun; or dried into chortan, which lasts years",
      },
      {
        label: "Recognised by",
        value: "Armenia's national inventory of intangible cultural heritage — not a UNESCO list",
      },
    ],
    sections: [
      {
        id: "what-matsun-is",
        heading: "What matsun is",
        paragraphs: [
          "Matsun is milk that has been fermented until it sets. The result is thick enough to hold the shape of a spoon, distinctly sour, and white; it is eaten cold, on its own or with bread, and it is used as an ingredient in a great many other things. Cow's milk is the usual base in Armenia today, but sheep, goat and buffalo milk are all used, and so are mixtures of them.",
          "The English word that comes nearest is yogurt, and this article uses the comparison rather than the equation. Matsun is a fermented milk in the same family, and readers looking for it under the word yogurt should find it — but the two are not interchangeable terms for one standardised product. Industrial yogurt is made with a defined pair of bacteria at a controlled temperature; traditional matsun is made with whatever population the household's own starter carries, at whatever temperature a warm corner provides.",
          "That difference is why this is the first article in the section about a foundational food rather than a prepared dish. Everything else here is something a cook makes and serves. Matsun is something a cook keeps, and then makes other things out of.",
        ],
      },
      {
        id: "milk-turned-by-bacteria",
        heading: "Milk turned by bacteria",
        paragraphs: [
          "The chemistry is straightforward and worth stating properly rather than waving at. Milk contains lactose, a sugar. Lactic-acid bacteria consume it and excrete lactic acid, and as the acid accumulates the liquid's pH falls. Milk protein — casein, which normally floats in stable clusters — loses that stability as the acidity rises, and the clusters link into a continuous network that traps the water. The milk has not thickened because anything was added to it. It has set, in place, into a gel.",
          "The acid does a second job at the same time. It makes the food inhospitable to most of the organisms that would otherwise spoil milk, which is why a fermented milk keeps for days where fresh milk keeps for hours. In a household without refrigeration that is not a pleasant side effect; it is the point.",
          "What is actually living in it has been measured. A survey published in 2015 in the journal Food Microbiology sequenced bacterial and fungal communities in matsun and matsoni from across Armenia and Georgia, and found the bacteria dominated by Lactobacillus and Streptococcus species. It also found yeasts — among them Kluyveromyces marxianus, Candida famata and Saccharomyces cerevisiae — varying sharply from place to place. A traditional fermented milk is a small ecosystem rather than a two-strain recipe, and this article makes no claim at all about what that ecosystem does to a person who eats it.",
        ],
      },
      {
        id: "the-starter-and-the-chain",
        heading: "The starter and the chain",
        paragraphs: [
          "The ordinary way to make matsun is to add a little of the last batch to fresh milk. That is all a starter is: a living population, moved from a finished vessel into a new one, where it does the same thing again. Nothing is bought and nothing is measured out, and the chain can run for as long as somebody remembers to hold a portion back.",
          "The same survey supplies the evidence that this really is what happens, rather than a pleasing story about continuity. It found that both the production region and the milk type shaped the microbial community, and concluded that traditional production preserves the transfer of a distinctive regional population from batch to batch. A starter that had been bought would erase that pattern; a starter carried forward in kitchens is what produces it.",
          "Other starting methods are documented, and one should be attributed rather than generalised. The Slow Food Foundation's description of the practice in Lori records a preparation called meran, made from dried cornelian cherries with wheat and rye, along with a rennet step. That is a specific account of a specific local practice, and it is reported here as one. Taking any single description of a household process as the timeless national method is the standard error with foods like this one, and the honest position is that the back-slopped starter is the widely attested constant and the elaborations around it vary.",
        ],
      },
      {
        id: "the-word-and-the-food",
        heading: "The word and the food",
        paragraphs: [
          "Hrachia Acharian's Armenian etymological dictionary treats մածուն under the root մած-, whose sense is to stick, to cling, to thicken — and, of milk, to curdle. The same root gives the verbs for curdling milk and setting cheese, and the adjective for anything viscous. Acharian classes it as a native Armenian word, from an Indo-European root meaning to knead or to work into a sticky mass, with relatives across Slavic, Greek and Germanic; the English word make belongs to the same family.",
          "He then makes an observation this article borrows, because it settles a question that otherwise attracts a great deal of noise. Beside matsun he sets Persian māsīdan, to curdle, alongside māst; Turkish yoğurmak, to knead, alongside yoghurt; and French cailler, to curdle, alongside lait caillé. Several unrelated languages independently named their fermented milk after the verb for what happens to it. The pattern is a fact about how people name foods, not evidence about who made one first.",
          "That is the distinction to hold on to. The word is old and it is Armenian. Acharian records մածուն in the classical texts he cites, which establishes the term in written Armenian. What it does not establish is that the food behind the word in those texts was identical to what a shop in Yerevan sells now, and no source consulted for this article closes that gap.",
        ],
      },
      {
        id: "what-the-record-actually-says",
        heading: "What the record actually says",
        paragraphs: [
          "One sentence travels through nearly every English page about matsun: that it is mentioned in many tales by Armenian writers from the eleventh century onward. It is worth following that back, because what is at the end of it is not what the sentence describes.",
          "The eleventh-century figure involved is Grigor Magistros, and the work is his treatise on grammar. What he supplies there is an etymology — a scholar's note about where the word comes from — reported into modern discussion through a philological study published early in the twentieth century. A grammarian explaining a word is genuine evidence that the word existed and was familiar enough to explain. It is not a tale, it is not a description of the food, and it will not support a claim about how matsun was made or eaten.",
          "So the accurate statement is narrower than the popular one and more useful. Matsun is named in Armenian writing from the medieval period, and its name is native and older still. Beyond that the evidence available here does not reach, and this article does not pretend otherwise. Statements that matsun is thousands of years old, or the oldest cultured milk anywhere, are not supported by anything consulted for this page, and the confident ones tend to appear on pages that are selling something.",
        ],
      },
      {
        id: "matsun-and-matsoni",
        heading: "Matsun and matsoni",
        paragraphs: [
          "Armenians call it matsun and Georgians call it matsoni, and the food is the same food. Both names come from the same root, both traditions set milk with a carried-forward starter, and the products differ in the way that two households' bread differs rather than in the way that two dishes differ.",
          "Science has treated it that way. The 2015 survey described above was carried out on samples from both countries by a team including Armenian and Georgian researchers, and its title calls matsoni a transnational fermented milk. Its finding — that the microbial community tracks region and milk rather than border — is the most concrete thing anyone can say about the relationship, and it was arrived at by people from both traditions working on the question together.",
          "There is also a dispute, and it belongs in a different paragraph from the history. Georgia registered matsoni as a protected geographical indication in 2012, and a disagreement over the naming and transit of Armenian matsun followed. That is a modern argument about trade names and markets. It is not evidence about who fermented milk first, it should not be read as any, and this article takes no position on the question of origin because the sources consulted do not answer it and nothing about the food requires it answered.",
        ],
      },
      {
        id: "an-everyday-food",
        heading: "An everyday food",
        paragraphs: [
          "Matsun is not festival food. The Slow Food Foundation, describing the tradition as it survives particularly in the northern province of Lori, calls it part of the daily diet, and that phrase does more work than it looks like it does: this is a food that appears at ordinary meals, repeatedly, rather than being brought out for an occasion.",
          "It is eaten plain, with or without bread, and it goes beside salads and soups. It is also a component rather than an accompaniment in a whole family of dishes — the Armenian repertoire includes preparations built on it, and it turns up in fillings and in mixtures where its sourness is doing the seasoning.",
          "That is the argument for giving it an article of its own. A section that described only finished dishes would keep meeting matsun as a line in other people's ingredient lists and never explain it. Most of Armenian home cooking assumes it is in the house, in the way that a great deal of cooking elsewhere assumes there is butter.",
        ],
      },
      {
        id: "what-matsun-becomes",
        heading: "What matsun becomes",
        paragraphs: [
          "Thinned with water and salted, it becomes a cold drink — the everyday summer counterpart to the way it is eaten in winter. That drink has its own name and deserves its own article eventually; it does not have one here yet, and this article stops at describing the relationship rather than pretending to cover it.",
          "Cooked, it becomes soup. Spas is the clearest case in this section: a soup whose body and sourness are both supplied by fermented milk, stabilised so that it can be heated without splitting. That article deliberately left the larger matsun story to be told somewhere else, and this is the somewhere else. Reading the two together is the point of having both.",
          "Drained and salted, it keeps. The strained form is known as kamats matsun and was stored in clay or in leather for months. Dried further, into hard balls, it becomes chortan, which lasts years and is reconstituted with water when it is wanted. A pastoral household with no cold store could carry the summer's milk into the winter in that form, and the preservation chain — fresh, drained, dried — is the practical reason a fermented milk sits at the centre of the food system rather than at the edge of it.",
        ],
        links: [{ phrase: "Spas is the clearest case", slug: "spas" }],
      },
      {
        id: "households-and-factories",
        heading: "Households and factories",
        paragraphs: [
          "Matsun is made in both places now. It is an ordinary supermarket product in Armenia, made industrially with defined cultures and sold in tubs, and it is also still made at home from a starter that came from a previous batch, which came from the batch before that.",
          "The difference between the two is exactly the difference the microbiology found. An industrial culture is chosen, consistent and reproducible, which is what a product sold at scale requires. A household chain is none of those things, and that is why it carries a regional signature at all. Neither is a corruption of the other; they are two answers to the question of how to make the same food reliably, and they optimise for different kinds of reliability.",
          "The tradition has also travelled. In 1929 Sarkis and Rose Colombosian, Armenian immigrants in Andover, Massachusetts, began selling their household matsun locally, and the wagon carried the Armenian word. The business grew, and along the way the name on the container was changed to yogurt, because that was the word an American market recognised. It became one of the first commercially sold yogurts in the United States. The food crossed an ocean intact and the word did not survive the trip, which is as neat an illustration as this article could ask for of why it declines to treat the two words as equivalents.",
        ],
      },
      {
        id: "named-on-a-national-list",
        heading: "Named on a national list",
        paragraphs: [
          "Armenia keeps a national inventory of intangible cultural heritage, and matsun is on it: the entry is the tradition of the preparation and use of matsun, filed under national cuisine. That is a real, dated, institutional recognition by the state of the practice rather than of the product.",
          "It is worth being precise about what that is not. The national inventory is not the UNESCO Representative List, and the two are separate instruments with separate procedures. Of Armenia's inscriptions on the UNESCO list, the only food is lavash. Matsun does not appear there, and any page that says it is UNESCO heritage has collapsed a national listing into an international one.",
          "The distinction matters more than pedantry usually does, because this is precisely the kind of claim that gets upgraded as it is repeated. A national inventory entry is worth stating plainly and worth stating accurately, and it is a stronger fact when it is not inflated: a state has formally recognised that making and using matsun is part of its living culture, which is a different and more interesting claim than a badge.",
        ],
      },
    ],
    importantDates: [
      {
        year: "1929",
        event:
          "Sarkis and Rose Colombosian begin selling matsun in Andover, Massachusetts; the name on the container is later changed to yogurt for the American market.",
      },
      {
        year: "2012",
        event:
          "Georgia registers matsoni as a protected geographical indication, the beginning of a modern dispute over naming rather than over history.",
      },
      {
        year: "2015",
        event:
          "A survey in Food Microbiology sequences matsun and matsoni across Armenia and Georgia, and finds the microbial community tracking region and milk type rather than border.",
      },
    ],
    significance: {
      heading: "Why matsun matters",
      paragraphs: [
        "This is the first article in the section about something that is not a dish, and it is the reason the section needed a dairy category rather than a place to file an awkward entry. Matsun is a food, an ingredient, a preservation method and a drink base at once, and describing Armenian cooking without it means describing a great many dishes by their surfaces.",
        "It is also an unusually clean case of evidence doing better than assertion. The claims that circulate about matsun are about antiquity and ownership; the things that can actually be established are a native word with a documented root, a measured microbial community that ignores the border, and a state inventory entry that is not the international one it is often mistaken for. Each of those is more interesting than the claim it replaces.",
      ],
    },
    interestingFacts: [
      "Nothing is added to thicken matsun: the acid the bacteria produce destabilises the milk protein, and the whole vessel sets in place into a gel.",
      "Acharian sets matsun beside Persian māst, Turkish yoghurt and French lait caillé — several unrelated languages each named their fermented milk after the verb for curdling, which is a fact about naming rather than about origin.",
      "Sequencing found the microbial community of matsun and matsoni tracking region and milk type rather than the Armenian-Georgian border, in a study written by researchers from both countries.",
      "Dried into hard balls as chortan, matsun keeps for years and is brought back with water — which is how a pastoral household carried summer milk into winter.",
      "The Armenian-run creamery that introduced yogurt to the United States began by selling matsun under its Armenian name, and changed the word rather than the food.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Milk — cow's usually, also sheep, goat, buffalo or mixtures",
        "A portion of the previous batch, as the starter",
        "Lactic-acid bacteria, chiefly Lactobacillus and Streptococcus, with yeasts present",
        "Salt, for the drained and dried keeping forms",
      ],
      preparation:
        "Milk is warmed, a little of the previous batch is stirred in, and the vessel is left covered and warm until the bacteria have acidified it enough for the protein to coagulate and the whole to set. It is then cooled. No quantities or timings are given here: this article explains what matsun is rather than teaching unsupervised fermentation.",
      occasions: [
        "Everyday meals rather than festivals",
        "Eaten plain or with bread, beside salads and soups",
        "As the base of soups, drinks, fillings and mixtures",
      ],
      regions: [
        "Throughout Armenia, as an ordinary household and commercial product",
        "Lori, where the traditional practice is particularly documented",
        "Shared with Georgia, where the same food is called matsoni",
      ],
      serving:
        "Served cold and plain, or thinned and salted as a drink, or cooked into soup; the drained and dried keeping forms are reconstituted before use.",
    },
    relatedSlugs: ["spas"],
  },
  {
    slug: "basturma",
    href: "/cuisine/basturma",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Basturma",
    seoTitle: "What Is Basturma? Armenia's Air-Dried Cured Beef",
    dishType: "Meat dishes",
    dishTypeId: "meat",
    imageSeed: "basturma",
    keywords: [
      "basturma",
      "Armenian basturma",
      "բաստուրմա",
      "ապուխտ",
      "apukht",
      "basterma",
      "bastourma",
      "pastirma",
      "Armenian cured meat",
      "cured beef",
      "chaman",
      "fenugreek",
    ],
    excerpt:
      "Beef salted, pressed, air-dried and sealed under a paste of fenugreek and garlic: the first article in this section about preserving meat rather than cooking it.",
    metaDescription:
      "Basturma, the Armenian air-dried cured beef under its fenugreek coating: how curing works, what chaman is, where the names come from, and what the record supports.",
    summary:
      "Basturma is a whole cut of beef preserved by salt, pressure and moving air, then sealed under a thick paste of fenugreek, garlic and pepper called chaman and sliced almost transparently thin. It is eaten as a cold appetiser, with bread, and with eggs, and it belongs to both ordinary breakfasts and festive tables. Armenians also have an older native word for salted dried meat, apukht, which is not the same thing as the modern coated product and should not be read as its birth certificate. The food belongs to a wide regional family of cured meats; what the record supports about the Armenian share of it is a documented craft specialism and an unbroken diaspora transmission, not an invention claim.",
    intro:
      "Basturma is what happens to beef when it is given salt, weight, air and time instead of heat. A whole muscle is packed in salt until it gives up much of its water, pressed under weight until it gives up more, hung in moving air until it is firm all the way through, and then coated in a wet paste of ground fenugreek, garlic and red pepper that dries to a dark crust around it. Nothing is cooked and nothing is smoked. What comes out is dense, deep red, intensely savoury, and cut so thin that the light comes through it. This is the first article in this section about preservation rather than cooking — about the problem of keeping meat in a country with hot summers and cold winters and no refrigeration, and about the particular Armenian answer to it.",
    author: "Armat Editorial Team",
    updated: "2026-08-26",
    keyFacts: [
      { label: "Kind of food", value: "A whole cut of beef, cured and air-dried — not a sausage and not cooked" },
      { label: "Made from", value: "Lean whole muscle, beef in the modern product; older practice also used sheep" },
      { label: "Preserved by", value: "Salt, pressing and moving air — no heat, no smoke" },
      {
        label: "Coated with",
        value: "Chaman, a wet paste built on ground fenugreek with garlic and red pepper",
      },
      { label: "Served", value: "Sliced almost transparently thin, cold, as meze — and with eggs and bread" },
      {
        label: "Also called",
        value: "Apukht (ապուխտ), the older native Armenian word for salted dried meat",
      },
    ],
    sections: [
      {
        id: "what-basturma-is",
        heading: "What basturma is",
        paragraphs: [
          "Basturma is a single piece of lean meat that has been preserved whole. That distinguishes it immediately from most of what English speakers file under cured meat: it is not ground, not stuffed into a casing, not fermented into a sausage. One muscle goes in and one muscle comes out, smaller, darker and much firmer than it started. The modern product is beef, usually cut from the loin or the leg, and it is sold either as a whole dried piece or ready-sliced.",
          "Four things happen to it, and the order matters more than the quantities. It is salted until a large part of its water has been drawn out. It is pressed under weight, which forces out more and compacts the meat into the flattened shape the finished piece keeps. It is hung in moving air until it has dried through rather than only at the surface. And it is coated in chaman, a wet spice paste that dries into a crust and stays on the meat as part of the food.",
          "Which of those is essential and which varies is worth separating at the start, because regional versions are not identical and the differences are usually presented as errors by whoever does it differently. The salting, the drying and the fenugreek-based coating are constant wherever this food is made. The cut, the exact composition of the paste, the length of drying and the degree of pressing all vary by producer, household and country, and no single version is the authentic one against which the others fail.",
        ],
      },
      {
        id: "salt-pressure-and-air",
        heading: "Meat kept by salt, pressure and air",
        paragraphs: [
          "The principle is the same one behind every dried food, and it is about water rather than about salt as such. Bacteria, moulds and the meat's own enzymes all need liquid water to work. Food scientists measure not how much water a food contains but how much of it is available for that work — water activity — and the useful fact is that the organisms which spoil meat and the ones which make people ill are progressively shut down as it falls. Most spoilage bacteria stop well before a food is dry to the touch; the more dangerous ones stop lower still.",
          "Salt and drying attack the same variable from two directions. Salt on the surface of the meat creates a steep concentration difference across the cell membranes, and water moves outward to equalise it, so the meat sheds liquid before any air has done anything. Pressing removes more of that freed liquid mechanically. Then the hanging does the slow part: air moving across a large flat surface carries moisture away steadily enough that the inside dries before the outside spoils. The pressed shape is not decorative — it is what gives the piece enough surface for its thickness to dry evenly.",
          "This article explains that process; it does not teach it. Curing whole meat without refrigeration is exactly the kind of preparation where the difference between a good result and a dangerous one lies in conditions that cannot be judged by eye, and no salt proportions, drying times, temperatures or humidity figures appear anywhere on this page. Traditional curing does not sterilise meat, and the sentence sometimes offered — that salt kills everything — is not what the science says. What salt and drying do is make conditions progressively hostile to growth, which is a different and more conditional claim.",
        ],
      },
      {
        id: "chaman-and-the-coating",
        heading: "Chaman, and what the word covers",
        paragraphs: [
          "The dark red-brown crust is the thing most people picture when they picture basturma, and its Armenian name is chaman (չաման), which appears in English as chemen or chaiman and corresponds to Turkish çemen. The word needs handling carefully, because it does two jobs. In Armenian usage it names the ground fenugreek itself, and it also names the wet paste built on it — a page headed chaman may be about the spice or about the coating, and the two senses are not always signalled.",
          "The paste is fenugreek-led and garlic-heavy, with red pepper — paprika, or something hotter — supplying most of the colour. Beyond that, published compositions differ: cumin appears in many accounts and not in others, and the proportions vary widely enough that no single mixture can be presented as the standard one. What is consistent is the dominance of fenugreek, which is why the smell of basturma is unmistakable and why it carries: the aroma is powerful, faintly bitter, and it stays on the hands and in a room.",
          "The coating is not only flavour. Sealing a dried muscle under a dense paste protects the surface while the piece finishes drying and afterwards, and fenugreek in particular is described in Armenian kitchen practice as discouraging insects from a food hung in open air. The thinned form of the same paste, chamanichur, is used as a sauce in its own right, which is a small piece of evidence that Armenian cooking treats chaman as an ingredient rather than only as a wrapper.",
        ],
      },
      {
        id: "the-names-basturma-and-pastirma",
        heading: "Basturma, pastirma, and what a name proves",
        paragraphs: [
          "The word arrives in Armenian from outside it. Western Armenian basturma and Eastern Armenian bastoorma are loanwords from Turkish pastırma, which is a verbal noun of the verb bastırmak, to press — a name taken from the weight on the meat rather than from the spice on it. Turkish transmitted it widely: the same word underlies Greek pastourmas, Bulgarian and Balkan pastarma, Arabic basterma and the spellings bastourma, basterma and pasturma that English has never settled between.",
          "There is an older layer beneath the Turkish one, and it is genuinely disputed. The Oxford Encyclopedia of Food and Drink records that the Ottomans applied the word to a Byzantine cured beef called paston, and the Oxford Companion to Food describes a Byzantine dried-meat delicacy as a forerunner of modern pastirma. That much is a real position held in real reference works. But the Byzantinists do not agree on what the Greek terms meant: Johannes Koder reads paston as salted meat or salted fish and akropaston as salted meat, Andrew Dalby reads paston as salted fish, and Gregory Nagy reads akropaston as smoked. Three specialists, three readings of the same words.",
          "The important thing is what none of this establishes. A name can travel without the technique it names, and a technique can travel without its name; peoples who trade with each other borrow both, in either order, and repeatedly. That Armenians today mostly use a Turkish loanword for this food is a fact about language contact in Anatolia, not evidence about who first hung salted beef in the wind. The argument that spelling settles ownership is made in both directions online and is worth no more in either.",
        ],
      },
      {
        id: "apukht-and-the-older-word",
        heading: "Apukht, the older Armenian word",
        paragraphs: [
          "Armenian has its own word for this kind of food and it is much older than the loanword. Apukht (ապուխտ) is Classical Armenian, and the philologist Vartan Matiossian, following the standard etymological scholarship, derives it from Pahlavi apuxt, meaning uncooked — from a-, un-, and puxta, cooked. It is an Iranian borrowing, not a Turkic one, and it entered Armenian long before Turkish was spoken in Anatolia. It appears in the fifth-century Armenian translation of the Bible, where it means salted and dried meat.",
          "The word was productive and it travelled outward rather than inward. Armenian lent it to Georgian as apukhti and, through the dialect of the Armenians of Poland, to Polish as abucht. Inside Armenian it formed compounds — khozapukht, literally pig-apukht, for ham. Armenian dictionaries define apukht as flat strips of meat from cattle or sheep, salted, beaten and dried in open air without cooking, and eaten raw; the apukht of Erzurum is singled out as particularly well known. In modern Armenian the word is still current and is used alongside բաստուրմա, often in the same sentence.",
          "Now the distinction this article most needs to make. The dictionary sense of apukht is salted, beaten, air-dried raw meat — a category, taking in sheep as readily as cattle, with no spice crust in the definition at all. Modern basturma is one member of that category, distinguished precisely by the thing the definition does not mention. So the fifth-century attestation is real and worth having, and it establishes that Armenians had a word for salted dried meat in late antiquity. It does not establish the fenugreek-coated product, and pages that report the fifth-century date under the heading basturma have quietly swapped a category for one of its members.",
        ],
      },
      {
        id: "what-the-early-evidence-establishes",
        heading: "What the early evidence can and cannot establish",
        paragraphs: [
          "One dating claim travels further than any other: that basturma is first recorded between 95 and 45 BC, under Tigranes the Great, and that the technique was developed to preserve meat traded from Armenia to China and India. It is repeated across tourism pages and food sites, and it does not survive being followed back. No source is ever named for it. The reign it invokes is misstated — Tigranes II ruled from 95 to 55 BC — and the trail leads to recipe blogs rather than to any text, inscription or scholarly study. There is no first-century-BC record of this food, and the confident date should be treated as an artefact of repetition.",
          "The second story is about saddles: horsemen who packed salted meat under the saddle, where the horse's weight pressed it and the ride dried it, arriving with the food made. It is a good story and it has an instructive property — it is told about Armenian traders and horsemen on Armenian pages and about Turkic warriors and nomads on Turkish ones, with the same details and the same absence of a source. A legend that changes owner according to who is telling it is folklore about the food rather than evidence about it, and this article records it as the first while declining to present it as the second.",
          "Set the three lines of evidence beside each other and the honest result is plural. There is an old Iranian-derived Armenian word for salted dried meat; there is a Byzantine vocabulary for salted meat or fish whose meaning specialists dispute; and there is an Ottoman Turkish word for pressing that spread across the whole region and is now what almost everyone says. Those are three real things. They do not line up into a chain in which one becomes the next and arrives at the modern product, and the sources consulted for this article do not support drawing one.",
        ],
      },
      {
        id: "kayseri-and-the-craft",
        heading: "Kayseri, and a craft rather than an origin",
        paragraphs: [
          "One place is attached to this food more firmly than any other. Kayseri — Caesarea in Cappadocia — was the recognised centre of pastirma production, and the recognition is old enough to be quoted rather than merely asserted. The seventeenth-century Ottoman traveller Evliya Çelebi, in his Seyahatname, records the town's cumin-flavoured beef pastirma as something found nowhere else and sent as a gift to Istanbul. That is a dated external observation from a named writer, which is a better class of evidence than most of what surrounds this subject.",
          "Who was making it there is also documented. The trade in Kayseri was overwhelmingly in Armenian hands, to the point where accounts describe an effective Armenian dominance of its manufacture and sale by the nineteenth century, while Greeks and Turks in the town made and ate it domestically; the historian Philip Mansel notes Armenians selling pastirma in Istanbul from the seventeenth century onward. The best-known survival of that world is a business rather than a legend: Krikor Apikoğlu founded a pastirma house in Kayseri in 1910 and moved production to Istanbul in 1920, and the firm went on to become the first nationwide meat company of the Turkish republic.",
          "What that evidence supports is a specialism, and the difference from an origin claim is the whole point. Being the acknowledged masters of a craft in the town most famous for it, over a long enough period for a foreign consulate to note it in passing, is a strong and documentable historical fact. It is not the same as having invented the food, it does not require that anyone did, and the phrasing to prefer is that Kayseri became particularly renowned for basturma and that Armenians were particularly renowned for making it there.",
        ],
      },
      {
        id: "after-1915-the-craft-travels",
        heading: "A craft carried out of Anatolia",
        paragraphs: [
          "The Armenian population of Kayseri and the surrounding provinces was destroyed or driven out during the genocide of 1915 and the years around it. Among the many things that displacement moved was this trade: survivors who reached Aleppo, Beirut, Cairo, Athens and Thessaloniki brought the craft with them, and basturma became a fixture of Armenian quarters in each of those cities. The people were displaced; the knowledge was portable, and it was carried by families who had practised it commercially.",
          "That is why basturma is not only a food of the Republic of Armenia. It is a diaspora food in the strict sense — one whose modern geography was set by where Armenians ended up. Later migrations extended the same line westward, to France and to the United States, and the shops that resulted are recognisably descended from the Anatolian trade rather than independently invented. The Smithsonian Center for Folklife and Cultural Heritage has documented one of them, a basturma shop in the Little Armenia neighbourhood of Los Angeles, whose proprietor learned the work from family makers in Armenia and Lebanon — a two-step route that is itself the history in miniature.",
          "This is the part of the subject where Armat can be most precise and least speculative, because the transmission is recent, documented and still visible. A cured meat that requires weeks of attention and a tolerance for the smell of fenugreek in the building is not a thing communities keep by accident. It was kept deliberately, in kitchens and shops, by people for whom it was both a livelihood and a piece of the place they had lost, and that continuity is better evidence of what basturma means to Armenians than any claim about the first century BC.",
        ],
      },
      {
        id: "how-basturma-is-eaten",
        heading: "How basturma is eaten",
        paragraphs: [
          "It is cut thin — thin enough to be translucent — and eaten cold. That is the default and it is not a garnish convention: the meat is dense, salty and strongly spiced, and a thick slice is unpleasant in a way a thin one is not. Sliced this way it goes on a meze table among other cold dishes, it is folded into bread, and it is the filling of a sandwich in every diaspora city where it is sold.",
          "The best-known cooked use is with eggs. Slices are warmed in a pan and eggs are broken over them, and the fat and spice from the crust flavour the whole dish; it is a standard Armenian breakfast and one of the few preparations in which basturma is heated at all. It is worth naming this as one common use rather than as the definition of the product, which is a trap the English-language pages fall into regularly.",
          "The bread it is eaten with is normally lavash, which is the pairing this section has already described from the other side: a thin, foldable bread does for a strongly flavoured meat exactly what it does for cheese and greens. And the contrast with the section's other beef article is worth stating, because the two are opposite solutions to the same animal. Khorovats applies fire, quickly, and is eaten the day it is made; basturma applies salt, weight and air, slowly, and is eaten for months afterwards. One is a method of cooking and the other is a method of keeping.",
        ],
        links: [
          { phrase: "normally lavash", slug: "lavash" },
          { phrase: "Khorovats applies fire", slug: "khorovats" },
        ],
      },
      {
        id: "everyday-and-festive",
        heading: "Everyday food and holiday food at once",
        paragraphs: [
          "Basturma does not sit cleanly on either side of the ordinary-versus-special line, and forcing it onto one is a mistake. Armenian breakfast descriptions place cured meats among the standing components of the meal, alongside lavash, cheeses, eggs and fresh vegetables, which is as everyday as food gets. Armenian-language accounts equally describe it as a fixture of the festive table, where it appears among the cold dishes at the start.",
          "Both can be true because the constraint is cost and keeping rather than occasion. This is an expensive product — a large piece of lean beef reduced substantially in weight, then held for weeks before it can be sold — and it is bought in small quantities and cut thin. A food that is sliced sparingly can be an ordinary breakfast in small amounts and a generous gesture in larger ones without changing what it is.",
          "Its official standing in Armenia today is a live question rather than a settled one. In March 2025 the deputy minister of economy told a parliamentary committee that discussions were under way to protect Armenian basturma, alongside Armenian matsun, as national geographical indications under the law that came into force in 2022. That is a stated intention at an early stage, not a completed registration, and the distinction is worth keeping: it says the state considers the product worth protecting, and nothing yet about whether protection was granted.",
        ],
      },
      {
        id: "a-regional-food-without-one-owner",
        heading: "A regional food without a single owner",
        paragraphs: [
          "Basturma in some form belongs to Armenian, Turkish, Greek, Arab, Kurdish, Bulgarian, Egyptian and Azerbaijani cooking, and versions of it are made across all of them. The internet's preferred question about it — who invented it — has no answer that the evidence will carry, and the arguments conducted under that heading are almost always about something other than food. This article does not take a position on it, because taking one would require sources that do not exist.",
          "The questions that can be answered are narrower and better. Armenians have a native word for salted dried meat attested in the fifth century and lent onward to two other languages. Armenians were the documented specialists in the trade in the town most renowned for it. Armenians carried the craft out of Anatolia after 1915 and kept it in half a dozen countries, which is why a Los Angeles shop can trace its practice through Lebanon to Armenia. That is a distinctive and well-evidenced Armenian tradition inside a shared regional history, and it does not need an invention claim to be substantial.",
          "Two neighbouring foods are worth naming to close the boundaries of this one. Sujuk, the dry spiced sausage that sits beside basturma in every account of an Armenian breakfast, is a different technique — meat ground and cased rather than kept whole — and it has no article here yet. And pastrami is a linguistic relative rather than a descendant: the Turkish word passed into Romanian as pastramă and travelled to New York with Romanian Jewish immigrants in the late nineteenth century, where the food itself was rebuilt around brisket, brine and smoke. Basturma did not become pastrami. The two share an ancestor in a word for pressing, and then went separate ways.",
        ],
      },
    ],
    importantDates: [
      {
        year: "5th century",
        event:
          "Apukht (ապուխտ), from Pahlavi apuxt meaning uncooked, appears in the Armenian translation of the Bible in the sense of salted and dried meat.",
      },
      {
        year: "17th century",
        event:
          "Evliya Çelebi's Seyahatname records Kayseri's cumin-flavoured beef pastirma as found nowhere else and sent as a gift to Istanbul.",
      },
      {
        year: "1910",
        event:
          "Krikor Apikoğlu founds a pastirma house in Kayseri; production moves to Istanbul in 1920 and the firm becomes a national meat company.",
      },
      {
        year: "2025",
        event:
          "Armenia's deputy minister of economy tells a parliamentary committee that geographical-indication protection for Armenian basturma and Armenian matsun is under discussion.",
      },
    ],
    significance: {
      heading: "Why basturma matters",
      paragraphs: [
        "This is the first article in the section about keeping food rather than making it. The other ten describe what Armenian cooks do with ingredients on the day; this one describes the problem that comes before all of them, which is how a household in a country of hot summers and hard winters holds meat through the months when there is none. Bread, dairy and meat each had an answer, and this is the meat one.",
        "It is also the clearest case in the section of a subject where the popular claims and the demonstrable ones point in different directions. What circulates is a first-century-BC date and a story about saddles. What can actually be shown is an Iranian-derived word in a fifth-century translation, an Ottoman traveller praising one Cappadocian town's pastirma in the seventeenth century, a family firm founded in 1910, and a shop in Los Angeles whose owner learned the work in Lebanon from people who learned it in Armenia. The documented version is less ancient and considerably more interesting.",
      ],
    },
    interestingFacts: [
      "Armenian chaman does double duty: the word names ground fenugreek and also the wet paste built on it, so a reference to chaman may mean the spice or the coating.",
      "Apukht is an Iranian loanword — from Pahlavi apuxt, uncooked — and Armenian lent it onward to Georgian as apukhti and, through the Armenians of Poland, to Polish as abucht.",
      "The saddle legend is told about Armenian horsemen on Armenian pages and about Turkic warriors on Turkish ones, with the same details and no source on either side.",
      "Three Byzantinists give three readings of the Greek terms behind pastirma: salted meat, salted fish, and smoked — which is why no clean origin chain can be drawn from them.",
      "Basturma did not become pastrami. The Turkish word passed into Romanian and reached New York with Romanian Jewish immigrants, where the food was rebuilt around brisket, brine and smoke.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "A lean whole cut of beef, usually from the loin or leg",
        "Salt, in quantity, for drawing out water",
        "Fenugreek, ground — the base of the coating and its dominant aroma",
        "Garlic and red pepper, with cumin in many but not all versions",
      ],
      preparation:
        "A whole muscle is packed in salt until much of its water has been drawn out, pressed under weight to remove more and to flatten it, and hung in moving air until it has dried through. It is then coated in chaman, a wet fenugreek paste, and left until the crust has set. No quantities, timings, temperatures or humidities are given here: this article explains what basturma is and how curing works, and it is not a method for curing meat at home.",
      occasions: [
        "Everyday breakfasts, among the standing cold components of the meal",
        "Festive tables, among the cold dishes served at the start",
        "Meze tables, sliced thin and served cold",
      ],
      regions: [
        "Throughout Armenia, as both a household purchase and a commercial product",
        "Kayseri in Cappadocia, the historic centre of the trade, where Armenians were the documented specialists",
        "The Armenian diaspora — Aleppo, Beirut, Cairo, Greece, France and the United States",
      ],
      serving:
        "Cut almost transparently thin and eaten cold, on a meze table or folded into lavash; warmed in a pan with eggs broken over it for breakfast.",
    },
    relatedSlugs: ["lavash", "khorovats"],
  },
  {
    slug: "manti",
    href: "/cuisine/manti",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Manti",
    seoTitle: "What Is Armenian Manti? The Baked Open Dumpling",
    dishType: "Main dishes",
    dishTypeId: "main",
    imageSeed: "manti",
    keywords: [
      "manti",
      "Armenian manti",
      "մանթի",
      "sini manti",
      "Armenian dumplings",
      "Armenian baked dumplings",
      "mante",
      "monta",
      "sulu manti",
      "Western Armenian food",
      "manti and matsun",
      "boat-shaped dumplings",
    ],
    excerpt:
      "Tiny open boats of dough with meat in them, baked until the edges go hard, then drowned in broth and garlic matsun: the Armenian form of a dumpling the whole region makes.",
    metaDescription:
      "Armenian manti, the small open dumplings baked crisp and served with broth and garlic matsun: what makes the form distinctive and what the origin stories rest on.",
    summary:
      "Manti are small meat-filled dumplings, and the Armenian form is recognisable at a glance: pinched into open boats rather than sealed, arranged upright on a tray, and baked until the exposed dough goes brown and hard before broth and garlic matsun are poured over them. That form belongs above all to Western Armenian cooking — to Aintab, Marash and Cilicia, and to the diaspora communities that descend from them. Manti also exist far beyond Armenians, in a family running from Chinese mantou through Central Asia to Turkish mantı, and the popular story that Armenians received them from the Mongols in thirteenth-century Cilicia traces to a single modern book. What the record supports is a particular Armenian treatment of a shared food, and a well-documented account of how it left Anatolia and was kept.",
    intro:
      "Almost every dumpling in the world is closed. The dough is folded over the filling and sealed, and whatever happens next — boiling, steaming, frying — happens to a parcel. Armenian manti are the ones left open. Two sides of a small square of dough are pinched up around a little meat, the ends are left standing apart, and what goes into the oven is a tray of tiny open boats rather than a pot of sealed ones. Dry heat does to them what water never could: the raised edges brown and go brittle while the filling cooks down inside. Then hot broth is poured straight over the tray and garlic-whipped matsun goes on top, and the dish arrives as three textures at once — hard, soft and cold. This article is about that form: what it is, where it belongs, and how much of the history usually attached to it will actually bear weight.",
    author: "Armat Editorial Team",
    updated: "2026-08-26",
    keyFacts: [
      { label: "Kind of food", value: "Small meat-filled dumplings, served as a main dish" },
      { label: "Characteristic Armenian form", value: "Open boat shapes, baked on a tray until the edges crisp — sini manti" },
      { label: "Filled with", value: "Ground lamb or beef with onion and spices" },
      { label: "Served with", value: "Hot broth poured over the baked tray, and matsun beaten with garlic" },
      { label: "Belongs to", value: "Western Armenian cooking above all — Aintab, Marash, Cilicia and their diaspora" },
      { label: "Also spelled", value: "Mante, monta; մանթի in Armenian" },
    ],
    sections: [
      {
        id: "what-armenian-manti-is",
        heading: "What Armenian manti is",
        paragraphs: [
          "Manti are small dumplings of wheat dough filled with ground meat, and they are made under that name across a very wide stretch of Asia. What makes the Armenian ones a recognisable thing rather than a local spelling is the handling: they are shaped open, cooked in dry heat on a tray, and finished at the table with two wet things poured over them. English has settled on Armenian dumplings as the gloss, which is accurate and tells you almost nothing, because the interest is entirely in what is done to them.",
          "The form is small. These are not the fist-sized steamed manti of Central Asia and they are not a plate of six; a tray holds many dozens, and the making of them is measured in hours rather than minutes. The size is not a flourish. It is what produces the ratio the dish depends on — a great deal of edge for very little filling — and it is the reason the dish is almost never made for one household on an ordinary evening.",
          "A second name is worth having at the start. Sini manti, tray manti, is the term used for the baked form specifically, from the tray it is arranged on; sini is a Persian word for a large round tray that reached Armenian through the same Ottoman-era contact that supplied a good deal of Western Armenian kitchen vocabulary. When a recipe says sini manti it is signalling the baked open version rather than any of the others, and that distinction is more useful than it looks.",
        ],
      },
      {
        id: "the-open-baked-form",
        heading: "The open baked form, and the word always",
        paragraphs: [
          "The baked open boat is the characteristic Armenian form and the one worth explaining. Squares of thin dough are given a little filling, the two opposite sides are pinched together over it and the two ends are left open, so the finished shape is a canoe with the meat visible along the top. They are packed upright and close together on an oiled tray, often in a pattern, and put into a hot oven until the standing dough has coloured and hardened and the meat has browned in its trough. Nothing about that sequence resembles what most dumpling traditions do.",
          "It is also the point where the English-language sources overreach, and the overreach is worth naming because it is repeated everywhere. The claim in circulation is that Armenian manti is always baked and never boiled or steamed, unlike every other regional variety. That is a stronger statement than the evidence carries, and Armenian practice itself contradicts it. Sulu manti — soup manti, from the word for water — is Armenian, and its dumplings are closed rather than open and simmered in broth rather than baked. Armenian-language recipe sites in the Republic routinely give manti steamed in a stacked steamer, in the larger Central Asian manner.",
          "The honest formulation is narrower and survives contact with the evidence: the baked open form is a characteristic and widely documented Armenian style, strongly associated with Western Armenian cooking, and it is what most people mean when they say Armenian manti without qualification. It is not a rule that every Armenian kitchen follows, and the versions that depart from it are not mistakes. This article describes a form, not a border.",
        ],
      },
      {
        id: "dough-filling-and-the-crisp-edge",
        heading: "Dough, filling, and why the edge matters",
        paragraphs: [
          "The dough is plain: wheat flour worked with water, usually with egg, rolled very thin and cut into small squares. It is unleavened, which matters more here than it would elsewhere, because a risen dough would puff and soften rather than harden. What the recipe wants from it is not tenderness but the capacity to dry out and hold a shape, and thinness is what makes that possible in the time the filling takes to cook.",
          "The filling is ground meat with onion and seasoning, and the meat varies by household more than by rule. Lamb is usual in the older Western Armenian accounts and remains standard in the Levantine diaspora; beef is at least as common in American and Armenian kitchens today, and mixtures of the two are ordinary. Onion is near-universal, and the seasoning runs to salt, pepper, parsley and often a warming spice such as allspice or cumin. Vegetarian versions filled with lentils or chickpeas exist and are made by people who make the meat kind too.",
          "The baking is where the identity of the dish is made, and the reason is a piece of ordinary food science. Dry heat drives water off the exposed dough and lets its surface rise well past the temperature of boiling, so the sugars and proteins in it brown and the structure sets hard; a dumpling cooked in water or steam cannot do either, because its surface stays wet and stays at the temperature of the water. That is why the open shape and the oven belong together. Leaving the top open exposes the maximum amount of dough to the dry air, and the result is a food that is genuinely crisp before anything is poured on it.",
        ],
      },
      {
        id: "broth-and-matsun-at-the-table",
        heading: "Broth and matsun at the table",
        paragraphs: [
          "Having made the dough hard, the cook then wets it again, and the timing of that reversal is the whole trick. Hot broth — meat stock, in many versions given body and colour with tomato — is poured directly over the baked tray shortly before it is eaten, and the crisped edges take up just enough of it to soften without collapsing. Some households serve the broth alongside in bowls instead, and some skip it entirely and finish with the dairy alone. Which of these is correct is a question that families answer for themselves and answer confidently.",
          "The dairy is not optional in the same way. Matsun beaten smooth with crushed garlic goes over the top, and the combination of hot baked dough, hot broth and cold sour dairy is what the dish is for. Matsun is the Armenian fermented milk described in its own article here, and naming it precisely is worth the trouble: recipes written for English-speaking kitchens routinely call for Greek yogurt or labneh, which are reasonable substitutes and are not the same product. The dish belongs to a cuisine that had matsun in it long before it had manti.",
          "Sumac finishes it in most Western Armenian versions, sometimes with dried mint or Aleppo pepper, and the choice is not decorative. Sumac is sour and dry, and it is doing the same job as the matsun from another direction on a dish that is otherwise rich, salty and soft. This is the layered, sour-topped style of the eastern Mediterranean rather than of the Armenian highland, and its presence on the plate is one more piece of evidence about where this form of manti comes from.",
        ],
        links: [{ phrase: "Matsun is the Armenian fermented milk", slug: "matsun" }],
      },
      {
        id: "a-dish-made-by-many-hands",
        heading: "A dish made by many hands",
        paragraphs: [
          "Filling and pinching several hundred dumplings the size of a thumb-joint is not an evening's work for one person, and the practice that grew up around that fact is documented rather than merely asserted. Diaspora accounts describe the making of manti as a gathering: the women of a family meeting at one house, often at a weekend, working through trays of them together and freezing what was not needed immediately. The food writer Andrew Janjigian describes exactly that arrangement at his Aunt Esther's house, with the frozen trays kept for Christmas Eve.",
          "The consequence is that manti tends to appear at the far end of the ordinary-to-special scale without being a ceremonial food. It is served at Christmas and Easter, at family gatherings and at church and community events, because those are the occasions that justify the labour and gather the labourers. It is not liturgical, it carries no ritual role, and it belongs in this section among main dishes rather than beside harissa and ghapama.",
          "It is worth saying what this does not amount to. Communal manti-making is a documented practice in particular families and communities, recorded by the people it belongs to; it is not a description of how all Armenians live, and freezers, food processors and bought dough have changed it substantially within living memory. A dish made by many hands is a real tradition and also a tradition with a history, including a recent one.",
        ],
      },
      {
        id: "a-western-armenian-food",
        heading: "A Western Armenian food",
        paragraphs: [
          "Armenian food is not one cuisine, and manti is among the clearest illustrations of that. The dish belongs above all to Western Armenian cooking — the food of the Armenian communities of Ottoman Anatolia and Cilicia, and of the diaspora that descends from them — rather than to the cooking of the eastern highlands that became the Republic of Armenia. Writing for the Smithsonian Folklife Festival, Liana Aghajanian put the general case bluntly: what is eaten in Armenia is very different from what constitutes Armenian cuisine outside it, down to the names and pronunciations of the foods, and she names manti among the Western Armenian dishes that diaspora restaurants keep.",
          "Precision about the term matters here, because Western Armenian is a geographical and historical description and not a synonym for abroad. It refers to the Armenians of the western, Ottoman half of the historic Armenian lands and to the cities and provinces of Anatolia and Cilicia where they lived — Aintab, Marash, Kilis, Adana, Kharberd, Sebastia — and to their language, which is a distinct standard of Armenian rather than an accent. An Armenian family in Moscow or Rostov is not Western Armenian, and its cooking is generally not manti cooking.",
          "The regional trail is visible in the sources. The Armenian-American cookbook tradition of the mid-twentieth century was overwhelmingly an Aintab tradition, compiled in Massachusetts by women born in Anatolia; the Hetq archive's account of Aintab cooking records tray-baked and yogurt-served filled foods among the town's characteristic dishes, including one served after the New Year liturgy. Manti sits inside that world, and it is not an accident that the modern recipe pages carrying it so often begin with a grandmother from Aintab or Marash who left for Aleppo.",
        ],
      },
      {
        id: "the-cilician-claim",
        heading: "The Cilician claim and where it comes from",
        paragraphs: [
          "One historical sentence accompanies almost every English page about Armenian manti: that manti reached Cilician Armenia through contact between Armenians and Mongols during their thirteenth-century alliance, and that Turkic peoples then learned it from the Armenians and carried it into Anatolia. It appears on food-media explainers, on diaspora community pages and on recipe blogs, usually with no source at all and occasionally attributed to an unnamed Armenian researcher.",
          "It can be traced. The claim goes back to Irina Petrosian and David Underwood's Armenian Food: Fact, Fiction and Folklore of 2006, a popular history of Armenian cuisine, and it circulated from there through an encyclopedia entry into general use. Knowing that changes how much weight it can carry. The Armenian-Mongol alliance is real, well documented and interesting in its own right, and it is entirely plausible that food moved along it. But a plausible inference published in a modern popular book is a hypothesis about the thirteenth century, not a record of it, and the second half — that Turkic peoples got manti from Armenians — is a larger claim still and rests on the same single foundation.",
          "So this article does not say that manti originated in Cilician Armenia, and it does not say the opposite either. There is no medieval Armenian text, inscription or cookbook establishing when dumplings under this name entered Armenian cooking, and the earliest hard evidence for the word anywhere in Anatolia is Ottoman rather than Cilician. The strong association between manti and Cilicia in modern Armenian memory is real and worth recording as what it is: a fact about where the dish flourished and who carried it, not a dated account of how it arrived.",
        ],
      },
      {
        id: "manti-across-a-wider-region",
        heading: "Manti across a wider region",
        paragraphs: [
          "Armenian manti sits inside a family that is much larger than Armenia. Dumplings called manti, mantı, mantu or manta are made from Xinjiang and Uzbekistan through Afghanistan and the Caucasus to Anatolia and the Balkans, and Korean mandu and Chinese mantou belong to the same tangle of names. The Turkish mantı best known outside Turkey is Kayseri mantısı — very small, closed, boiled, and served under garlic yogurt with melted butter and pepper poured over. The dumplings of Central Asia are usually much larger and steamed. The Armenian form is the baked open one.",
          "The chronology available is thin and comes from outside Armenian sources. The earliest well-known written record of a manti-like dish is in Yinshan Zhengyao, the dietary manual compiled in 1330 by Hu Sihui at the Mongol Yuan court, which contains recipes plainly related to the later Anatolian ones; the earliest Ottoman manti recipe appears in the fifteenth-century cookbook of Muhammed bin Mahmud Şirvani. Between those two points sits the Mongol expansion, which is why so many accounts reach for it — the westward spread of these dumplings across Eurasia is a genuine scholarly subject, treated by Aylin Öney Tan in the Oxford Symposium's volume on wrapped and stuffed foods.",
          "The honest summary is that the wider manti family has a long transregional history that no single people invented, and that the Armenian baked form is one distinct development within it. Both halves of that sentence are needed. Dropping the first produces the invention claims that circulate in several languages at once; dropping the second reduces a specific and well-attested culinary practice to a borrowing, which is not what it is.",
        ],
      },
      {
        id: "the-word-and-what-it-proves",
        heading: "The word, and what a word proves",
        paragraphs: [
          "Armenian writes the dish մանթի, and English transcribes it as manti, mante and — in some diaspora communities, notably around Los Angeles and Detroit — monta. The variants are pronunciation caught in different spellings rather than different foods; a Glendale shop selling monta and a Boston kitchen making manti are making the same thing. Related terms travel with it: mantapour for the broth version, sini manti for the baked one, sulu manti for the soup one.",
          "The etymology of the root is genuinely unsettled. Most etymological references derive manti from Chinese mantou, and Turkish etymological dictionaries also point toward a Mongol link; the reverse direction, mantou as a borrowing into Chinese from a Turkic source, has been argued and questioned. What is not in doubt is that the word is not Armenian in origin and arrived from the east along with the food.",
          "That fact settles nothing about ownership, and it is worth saying plainly because the argument is made in both directions online. Loanwords are the normal condition of cooking vocabulary across this whole region — Armenian took basturma from Turkish, sini from Persian, and lent its own words outward in turn — and a borrowed name is evidence of contact rather than of who is entitled to the dish. What a people does with a food after it arrives is the thing worth describing, and in this case what Armenians did with it was distinctive enough to have its own name.",
        ],
      },
      {
        id: "carried-and-kept",
        heading: "Carried out of Anatolia and kept",
        paragraphs: [
          "The best-documented part of this subject is the most recent. The Armenian communities of Aintab, Marash and the Cilician towns were destroyed or driven out during the genocide of 1915 and the years around it, and their survivors reached Aleppo and Beirut first and then, in later migrations, France, the United States and Canada. Manti went with them. The same trays are set in Aleppo, Beirut, Boston, Los Angeles and Toronto, made from recipes that trace back through one or two named women to a town that no longer has Armenians in it.",
          "This is a different kind of transmission from the one described in the section's other Anatolian survival. Basturma was carried by families who had made it commercially, and it re-established itself as a trade with shops and producers. Manti was carried in households, by people who made it for their own families and taught daughters and daughters-in-law to pinch it, and it re-established itself as a domestic practice that only later acquired restaurants. Both routes worked; the household one leaves fewer records, which is why the family accounts collected in community publications are the evidence here rather than an ornament on it.",
          "It also means the dish has been changing continuously while remaining recognisable. Diaspora versions differ by country — more tomato in the Levantine broth, more sumac in some kitchens than others, beef where the grandmother used lamb — and some cooks now build them from bought wrappers. The people making those adjustments are the tradition, not a departure from it, and the constant across all of them is the shape and the oven.",
        ],
        links: [{ phrase: "the section's other Anatolian survival", slug: "basturma" }],
      },
      {
        id: "manti-in-armenia-today",
        heading: "Manti in Armenia today",
        paragraphs: [
          "In the Republic of Armenia the picture is different and specific. Manti is available and known, but it is not a standard dish of the Armenian highland kitchen in the way dolma or khash are, and where it is served in Yerevan it is served overwhelmingly by restaurants that are explicitly Western Armenian or Middle Eastern Armenian — houses founded by families from Beirut and Aleppo, or named for Aintab. The dish has arrived in Armenia in large part by returning with the diaspora rather than by descending within it.",
          "That gives manti an unusual position among the twelve dishes in this section, and a useful one. Most of them are foods of the country that also travelled; this is a food of the exile that has been travelling back. It is also, alongside the word manti in Armenian-language recipe collections, an illustration of how the same name covers two different foods in the two halves of Armenian life — the baked open tray in the diaspora, and the larger steamed dumpling of the post-Soviet repertoire in kitchens inside Armenia.",
          "None of this makes it less Armenian, and the question of whether it counts is not one this article thinks is worth asking. A food that a people has made under its own name for centuries, shaped in a way nobody else shapes it, served with its own dairy and carried through a catastrophe by the households that survived it, is that people's food. What the record supports is not an invention story but something more particular: a shared regional dumpling that Armenians handled differently from everyone around them, and kept.",
        ],
      },
    ],
    importantDates: [
      {
        year: "1330",
        event:
          "Yinshan Zhengyao, compiled by Hu Sihui at the Mongol Yuan court, records dumpling recipes plainly related to the later Anatolian manti.",
      },
      {
        year: "15th century",
        event:
          "The earliest known Ottoman manti recipe appears in the cookbook of Muhammed bin Mahmud Şirvani.",
      },
      {
        year: "1915",
        event:
          "The Armenian communities of Aintab, Marash and Cilicia are destroyed or expelled; survivors carry manti to Aleppo, Beirut and, later, the Americas and Europe.",
      },
      {
        year: "2006",
        event:
          "Irina Petrosian and David Underwood publish the Cilician-Mongol account of manti's arrival that later circulates, unattributed, across the English-language web.",
      },
    ],
    significance: {
      heading: "Why manti matters",
      paragraphs: [
        "Manti is where this section stops being a cuisine of one country. Ten of the dishes here can be described from inside Armenia; this one cannot, because its home is the western half of the historic Armenian world and its living centre is a diaspora that was made by force. To write about manti at all is to write about Aintab and Aleppo and Beirut and Glendale, and about a form of Armenian cooking that survived its own geography.",
        "It is also the section's clearest case of a shared food made distinctive by treatment rather than by ingredients. Nothing in a manti is Armenian in itself: the dough is wheat and water, the filling is minced lamb, the name came from the east. What is Armenian is the decision to leave the parcel open and put it in an oven, and then to pour broth and garlic matsun over what came out. That is a small technical difference that produces a completely different food, and it is worth defending as carefully as any origin claim — more carefully, because unlike the origin claims it can actually be shown.",
      ],
    },
    interestingFacts: [
      "Sini manti means tray manti; sini is a Persian word for a large round tray, and it names the baked form after the thing it is baked on.",
      "The widely repeated claim that Armenian manti is never boiled or steamed is contradicted by Armenian practice: sulu manti is closed and simmered, and Armenian-language recipe sites give steamed versions.",
      "The Cilician-Mongol origin story that appears on nearly every English page about Armenian manti traces to a single popular book published in 2006.",
      "In parts of the American diaspora the dish is called monta, and a Glendale shop sells it under that name — the same food, a different vowel.",
      "In Yerevan manti is mostly found in restaurants founded by Western Armenian families from Beirut and Aleppo: a diaspora food that has been travelling home.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Thin unleavened wheat dough, usually made with egg",
        "Ground lamb or beef with onion, salt, pepper and parsley",
        "Meat broth, in many versions coloured and given body with tomato",
        "Matsun beaten with crushed garlic, and sumac to finish",
      ],
      preparation:
        "Thin dough is cut into small squares, each given a little filling, and pinched along two sides so the ends stay open. The boats are packed upright on an oiled tray and baked in dry heat until the standing edges brown and harden and the meat browns inside. Hot broth is poured over the tray shortly before serving. No quantities, oven temperatures or baking times appear here: this article describes what manti is and why the form works, and it is not a recipe.",
      occasions: [
        "Family gatherings, where the shaping is shared out among several people",
        "Christmas and Easter tables, and church and community events",
        "Everyday meals in households that keep trays of shaped manti in the freezer",
      ],
      regions: [
        "Western Armenian Anatolia and Cilicia — Aintab, Marash and the towns around them",
        "The Levantine diaspora, above all Aleppo and Beirut",
        "Armenian communities in the United States, France and Canada",
        "Yerevan, chiefly in restaurants founded by Western Armenian families",
      ],
      serving:
        "Baked until the open edges are hard, then flooded with hot broth and topped with garlic-beaten matsun and sumac, so that hot, soft and cold arrive together.",
    },
    relatedSlugs: ["matsun", "basturma"],
  },
];
