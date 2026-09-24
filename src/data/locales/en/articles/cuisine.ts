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
      "The thin flatbread baked on the wall of a clay tonir. UNESCO listed it in 2014 for how Armenians make, share and use it, and listed it again in 2016 for five other countries.",
    metaDescription:
      "Lavash, the thin Armenian flatbread baked in a clay tonir: how it is made, its role at weddings and everyday meals, and its two UNESCO listings.",
    summary:
      "Lavash is a thin unleavened flatbread made of wheat flour, water and salt. It bakes in under a minute on the inner wall of a tonir, the clay oven sunk into the floor of a traditional house. Fresh lavash is soft enough to tear by hand, and people use it to wrap cheese, herbs and grilled meat. Dried and stacked, it keeps for up to six months and softens again with a sprinkle of water, so a household could bake once and eat lavash all winter. Beyond the meal, the UNESCO file describes lavash being laid on the shoulders of a bride and groom as a wish for prosperity. UNESCO listed the Armenian tradition in 2014 and a separate multinational tradition under the same name in 2016. Each listing records a living practice, and neither grants ownership.",
    intro:
      "Lavash is a thin, soft flatbread of flour, water and salt, baked in seconds on the hot wall of a tonir, the clay oven sunk into the ground. It is the everyday bread of Armenian homes, and it also has a ritual life of its own. People lay it on the shoulders of a bride and groom, dry it in sheets for the winter, and use it as a plate, a wrapper and a spoon. UNESCO added the Armenian practice to its Representative List of the Intangible Cultural Heritage of Humanity in 2014. In 2016 it added a separate, multinational flatbread tradition under the same name.",
    author: "Armat Editorial Team",
    updated: "2026-07-31",
    keyFacts: [
      { label: "Kind of dish", value: "Thin unleavened flatbread" },
      { label: "Ingredients", value: "Wheat flour, water, salt" },
      { label: "Traditional oven", value: "Tonir, a clay oven set into the ground" },
      { label: "Baking time", value: "Under a minute" },
      { label: "Keeps for", value: "Up to six months when dried" },
      { label: "UNESCO", value: "Representative List, 2014, no. 00985" },
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What lavash is",
        paragraphs: [
          "Lavash is an unleavened flatbread made from just three ingredients: wheat flour, water and salt. What sets it apart is the shaping and the oven. Bakers knead the dough and divide it into balls. They roll each ball out, then stretch it until it is thin enough to see light through. The sheet goes over an oval cushion, and the baker slaps it onto the inner wall of a tonir. It bakes in well under a minute and comes out still soft.",
          "This bread behaves very differently from a loaf. Fresh, it is soft and bendy, and you tear it instead of cutting it. Dried, it stacks flat and keeps for months. Sprinkle it with water and leave it under a cloth, and it turns soft again. That is how a household could bake once and eat lavash all winter.",
          "The word covers a whole family of breads. Sheets vary in length, thickness and colour from village to village and from baker to baker. Across the wider region, people use the same name for breads that an Armenian baker might not recognise as her own.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "The UNESCO nomination file describes lavash-making as work that holds a household together. Women do the baking, and girls learn by helping. Men build the ovens and make the cushions the dough is stretched on, and they pass those skills on too. Baking days have to be a team effort: once the tonir is lit, the work is fast, hot and nonstop.",
          "The bread also has meanings that have nothing to do with eating. The best known is a wedding custom described in the same file: lavash is laid on the newlyweds' shoulders as a wish for prosperity and children. The Smithsonian Folklife Festival's 2018 Armenia programme called the tonir itself one of the most sacred places in a traditional house. It is a sunken hearth at the centre of the home, and in some villages it can stand in for a church when a marriage is blessed.",
          "In the diaspora, where few homes have a tonir, people buy lavash instead of baking it, and the rituals have survived better than the baking skills. Several dishes in this section show the same pattern: the customs travel more easily than the know-how.",
        ],
      },
      {
        id: "history",
        heading: "History: what the sources say",
        paragraphs: [
          "The tonir is the oldest part of the story that can be checked. Sunken clay ovens like it have long been a feature of houses across the Armenian highland and the wider region. The bread and the oven go together: a flat sheet slapped onto a hot vertical wall is exactly what a tonir can bake.",
          "Written accounts of lavash as a named tradition are recent, not ancient, and they come from official bodies. In 2014, on Armenia's nomination, UNESCO added \"Lavash, the preparation, meaning and appearance of traditional bread as an expression of culture in Armenia\" to the Representative List. In 2016 UNESCO added \"Flatbread making and sharing culture: Lavash, Katyrma, Jupka, Yufka\", a joint nomination from Azerbaijan, Iran, Kazakhstan, Kyrgyzstan and Turkey.",
          "The two listings are best read together, because people often quote one or the other to prove opposite things. Neither makes anyone the owner of a bread. Each records a living practice in particular communities. The name appears twice because the bread is made so widely, and that is no contradiction.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "The dough is flour, water and salt, worked until smooth and then left to rest. Bakers roll out each piece, then stretch it over the backs of their hands or on a board. The sheet ends up very thin and much wider than it was after rolling. The baker lays it on an oval cushion and uses the cushion to press it firmly against the tonir wall.",
          "The oven does the rest. A tonir holds a strong, dry heat, and the bread blisters and sets in seconds. The baker judges it by eye and lifts it off with a hooked tool. Sheets meant for later are stacked and dried, then softened with water when needed.",
          "A common Armenian version uses no yeast at all, and many bakers add nothing beyond the three ingredients. Richer and yeasted versions exist, and gas-fired and metal ovens are now common. The bread they make is still clearly lavash, and nobody treats it as second-rate.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "Lavash is not a festival bread. It belongs to ordinary days, and that is exactly where its status comes from: it is always on the table, and it is the first thing a guest is offered. The closest it has to an event of its own is autumn baking, when families make large batches and dry them for the winter.",
          "Its role in ceremonies grows out of that everyday presence. At a wedding it stands for the household the couple are joining. At the table it stands for hospitality. Many families make a point of never putting bread down carelessly or throwing it away, and they show lavash the same respect.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "Within Armenia the differences are mostly in size and handling. Some villages make sheets a metre long, others shorter and thicker ones. The dough may be a little softer or firmer, depending on the local flour.",
          "Across the wider region, breads called lavash range from the very thin Armenian sheet to thicker, chewier breads that are folded instead of rolled. In Armenian communities of the Middle East, commercial bakeries have made the bread much more uniform.",
          "In some regions bakers use the same tonir for other breads on the same day. Lavash goes in first, because it needs the fiercest heat.",
        ],
      },
    ],
    importantDates: [
      {
        year: "2014",
        event:
          "UNESCO adds Armenia's lavash tradition to the Representative List of the Intangible Cultural Heritage of Humanity, no. 00985.",
      },
      {
        year: "2016",
        event:
          "UNESCO lists a separate flatbread tradition under the same name, nominated by Azerbaijan, Iran, Kazakhstan, Kyrgyzstan and Turkey.",
      },
      {
        year: "2018",
        event:
          "Bakers demonstrate lavash in Washington at the Smithsonian Folklife Festival's Armenia programme.",
      },
    ],
    significance: {
      heading: "Why lavash matters",
      paragraphs: [
        "More than any other dish on this site, lavash shows how a food can also be a technology and a way of organising a household. The bread depends on the tonir, and the tonir depends on the family that builds it, heats it and works around it. That is why the heritage listing describes a practice, not a product.",
        "Lavash is also a useful reminder that a dish need not belong to one people. The same organisation has listed the same bread name twice, for communities in six countries. That takes nothing away from the Armenian tradition. It puts it in its proper place: one well-documented practice within a food culture the whole region shares.",
      ],
    },
    interestingFacts: [
      "Bakers stretch the dough over an oval cushion and slap it onto the oven wall, where it bakes in less than a minute.",
      "Dried lavash keeps for up to six months and turns soft again with a sprinkle of water.",
      "The UNESCO file describes the wedding custom of laying lavash on the shoulders of the bride and groom as a wish for prosperity.",
      "The same bread name has two separate UNESCO listings: Armenia's in 2014 and a five-country one in 2016.",
      "The nomination file describes the baking as women's work, while men build the ovens and make the cushions. Both pass their skills on to apprentices.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: ["Wheat flour", "Water", "Salt"],
      preparation:
        "Bakers knead, divide and roll the dough, then stretch it very thin. They spread it over an oval cushion and press it against the hot wall of a tonir, where it bakes in seconds and comes off still soft.",
      occasions: ["Everyday meals", "Weddings", "Autumn baking for the winter store"],
      regions: [
        "Throughout the Republic of Armenia",
        "Armenian communities of the Middle East",
        "Diaspora households, where it is usually bought, not baked",
      ],
      serving:
        "Torn by hand and wrapped around cheese, herbs and grilled meat, or laid under other dishes to soak up their juices. Dried sheets are stacked and softened with water.",
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
      "Vine leaves and hollowed vegetables filled with rice, herbs and often meat. The dish is made across the whole region, which is exactly why this section does not name a single owner for it.",
    metaDescription:
      "Dolma, or tolma: rice, onion and herbs in vine leaves or hollowed vegetables. The meatless pasuts form, where it is made, and the 2017 UNESCO listing.",
    summary:
      "Dolma, called tolma in Armenian, is a way of cooking more than a single dish. Rice, onion and plenty of herbs, with or without minced lamb or beef, are wrapped in vine or cabbage leaves or stuffed into hollowed peppers, aubergines, tomatoes or quinces. The parcels are packed tightly into a pot, weighted down and cooked slowly. The name comes from a Turkic verb meaning to be filled. The meatless version, pasuts tolma, uses beans, chickpeas, lentils and grains, is served cold, and is eaten during fasts. In Armenian homes tolma is food for gatherings, and rolling several hundred leaves is a job people share. The method is old and is used across the Caucasus, Anatolia, Iran and the eastern Mediterranean under related names. UNESCO's 2017 listing was nominated by Azerbaijan, and it records a practice, not an origin.",
    intro:
      "Dolma, called tolma in Armenian, is a filling of rice, onion, herbs and often minced meat, wrapped in leaves or stuffed into hollowed vegetables and cooked slowly. People make it throughout the Caucasus, Anatolia, Iran and the eastern Mediterranean, under names that all come from the same verb. In Armenian homes it is a dish for gatherings, not a quick weekday meal, and there is a meatless version for fasting. In 2017 UNESCO added a dolma tradition to its Representative List. Azerbaijan made that nomination. This article says so openly, because how people read such a listing is part of this dish's story.",
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
          "Dolma is a technique more than a fixed dish: you fill one food with another and cook it gently until both are done. In practice there are two main families. Leaf dolma is rolled into small cylinders, usually in vine leaves, or in cabbage in the colder months. Vegetable dolma uses peppers, aubergines, tomatoes, courgettes or quinces, hollowed out and topped with a lid.",
          "The usual filling is short-grain rice with onion and lots of herbs, with or without minced lamb or beef. Cooks pack the pot tightly, weigh it down, and add only a little liquid, so the parcels steam instead of boiling apart.",
          "Tolma, the Armenian form of the name, is the same word. A popular story traces it to an Armenian word for vine leaf. UNESCO's file gives the simpler derivation, from a Turkic verb meaning to be filled, and this article follows that explanation.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "Making tolma is usually a shared job. Rolling several hundred leaves takes several pairs of hands around a kitchen table. In many families this is where cooking skills actually pass from one generation to the next. Nobody gives a lesson; you learn by sitting next to someone who rolls faster than you.",
          "Tolma is also a dish for showing off. A tightly packed pot of small, even parcels is a sign of care and skill, so tolma is a favourite centrepiece when guests are coming. The Smithsonian Folklife Festival's 2018 Armenia programme listed it among the staples of an Armenian feast, alongside bread and grilled meat.",
          "The meatless version, pasuts tolma, gives the dish a second role in the church calendar. Made with beans, chickpeas, lentils and grains and served cold, it is eaten during fasts. It is one of the few festive-looking dishes a fast allows.",
        ],
      },
      {
        id: "history",
        heading: "History: what the sources say",
        paragraphs: [
          "Stuffed vegetables and stuffed leaves have a long written history in the region, but most of the surviving records are Ottoman and Arabic, not Armenian. Priscilla Mary Işın's history of Ottoman cuisine follows this family of dishes through palace kitchen documents and other archives. Records like these show what was cooked and when. They cannot tell us who cooked it first.",
          "That is as far as the history can go. The technique is old and widespread across the region. The Armenian tolma tradition in particular is documented in modern cookbooks and ethnographic studies, not in medieval sources.",
          "In 2017 UNESCO added \"Dolma making and sharing tradition, a marker of cultural identity\" to the Representative List. Azerbaijan made the nomination, and the file describes the practice in that country. A listing like this records a living tradition in the community that nominated it. It does not rule on where a dish began, and it does not exclude the same practice anywhere else.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "Cooks use fresh vine leaves in early summer and leaves preserved in brine for the rest of the year, rinsing the brined ones first. The filling goes in raw: rice, finely chopped onion, herbs, salt and pepper, plus meat in the meat versions. A small spoonful goes on each leaf, which is folded in at the sides and rolled up.",
          "The parcels go into a heavy pot in close rows, often on a layer of leaves or sliced vegetables that protects the bottom. A plate on top holds them down, and they cook slowly in a little water, stock or tomato until the rice is done.",
          "Many families finish leaf tolma with lemon or with matsun, and vegetable tolma with a tomato-based sauce. Both are common, and neither is the one right way.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "Tolma belongs to long, unhurried meals: family gatherings, holidays, and the meals after church services and memorials. The time it takes to make is part of its meaning. It tells everyone that the day was planned for.",
          "Pasuts tolma is linked to fasting and served cold, which also makes it practical for a table that has to stay out for hours.",
          "In recent years Armenia has held tolma festivals, where cooks set out many regional versions side by side. These are a modern, deliberate way of promoting the dish, not an inherited custom, and this article describes them that way.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "The biggest divide is between meat and meatless tolma. Beyond that, the balance of rice to meat, the mix of herbs and how sour the finish is all vary by region and by family.",
          "In some regions cooks wrap the filling in leaves other than vine. Cabbage is the most common, but quince, beet or sour cherry leaves are used where they grow, and each changes the flavour of the finished dish.",
          "Armenian communities of the Middle East tend to make smaller, tighter rolls with a stronger lemon finish. Households in the Republic of Armenia often serve larger parcels with matsun. Both are normal practice, and it would be wrong to call either one the authentic version.",
        ],
      },
    ],
    importantDates: [
      {
        year: "2017",
        event:
          "UNESCO adds \"Dolma making and sharing tradition, a marker of cultural identity\" to the Representative List, no. 01188, on Azerbaijan's nomination.",
      },
      {
        year: "2018",
        event:
          "The Smithsonian Folklife Festival's Armenia programme presents tolma among the staples of an Armenian feast.",
      },
    ],
    significance: {
      heading: "Why dolma matters",
      paragraphs: [
        "Of all the dishes in this section, tolma is the one where people most often ask \"whose is it?\", and where that question gets the least useful answers. Communities across a huge area make it, under related names and in the same way. The written history records the technique, not an inventor.",
        "What can be said with confidence is what the dish does in Armenian life. Making it brings people together around a table. Serving it marks an occasion as important. In its meatless form it follows the church's fasting calendar. Those are the claims this article makes, and none of them needs the dish to be only Armenian to be true.",
      ],
    },
    interestingFacts: [
      "The name is a verbal noun. UNESCO's file traces it to a Turkic word meaning stuffed, and Armenian uses the same word as tolma.",
      "Pasuts tolma contains no meat at all, only beans, chickpeas, lentils and grains, and is eaten cold during fasts.",
      "Vine leaves are seasonal, so outside early summer most tolma is made with leaves preserved in brine.",
      "A plate placed on top of the parcels during cooking keeps them from unrolling in the pot.",
      "The 2017 UNESCO listing was nominated by Azerbaijan. The same dish is made in Armenia and across the region, and the listing records a practice, not an origin.",
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
        "A raw filling of rice, onion and herbs, with or without minced meat, is rolled up in leaves or stuffed into hollowed vegetables. The parcels are packed tightly into a pot, weighted down and cooked slowly in a little liquid.",
      occasions: ["Family gatherings and feast tables", "Fasting periods, in the pasuts form", "Commemorative meals"],
      regions: [
        "Throughout the Republic of Armenia",
        "Armenian communities of the Middle East",
        "The wider region, under related names",
      ],
      serving:
        "Served warm from the pot with matsun or lemon, or cold in the meatless version, usually with lavash on the table.",
    },
    relatedSlugs: ["ghapama", "lavash", "khorovats"],
  },

  {
    slug: "khorovats",
    href: "/cuisine/khorovats",
    category: "cuisine",
    categoryLabel: "Armenian Cuisine",
    title: "Khorovats",
    seoTitle: "Khorovats: Armenian Grilled Meat and the Gathering",
    dishType: "Meat dishes",
    dishTypeId: "meat",
    imageSeed: "khorovats",
    keywords: ["khorovats", "Խորոված", "Armenian barbecue", "khorovats salad", "madagh", "մատաղ"],
    excerpt:
      "Meat grilled over open embers, and the gathering built around it: who lights the fire, who tends it, and how it differs from the communal meal of a madagh.",
    metaDescription:
      "Khorovats is Armenian meat grilled over embers. What the word means, how the fire is handled, the salad served beside it, and how it differs from madagh.",
    summary:
      "Khorovats is meat cooked over an open fire. The word is a form of the Armenian verb meaning to roast or grill, so it names a method, not a recipe. Large pieces of pork, lamb, beef or chicken are salted and left with onion and herbs, then threaded onto long flat skewers and cooked over embers instead of flame. Seasoning stays light. Aubergine, sweet pepper and tomato grill alongside, then are peeled and chopped into a dish of their own, usually called khorovats salad. The meat is often slid straight off the skewer onto lavash. The gathering matters as much as the food: a fire lit outdoors and an afternoon spent around it. Because it needs no tonir, khorovats has held on strongly in the diaspora. It is not madagh, though the two follow a similar pattern.",
    intro:
      "Khorovats is meat cooked over an open fire. The word is a form of the Armenian verb meaning to roast or grill, and it names the method, not a single recipe. In practice it is also an occasion: a fire lit outdoors, one person tending the skewers while everyone else waits, and a table built around whatever comes off. It was one of the dishes the Smithsonian Folklife Festival presented in 2018 as staples of the Armenian feast. It is close to an older communal meat meal called madagh, but it is not the same thing.",
    author: "Armat Editorial Team",
    updated: "2026-07-31",
    keyFacts: [
      { label: "Kind of dish", value: "Meat grilled over open embers" },
      { label: "Name", value: "From the Armenian verb meaning to roast or grill" },
      { label: "Common meats", value: "Pork, lamb, beef or chicken, depending on region and community" },
      { label: "Cooked on", value: "Long skewers over wood or vine embers" },
      { label: "Usually eaten", value: "Outdoors, in company, straight off the skewer" },
      { label: "Not the same as", value: "Madagh, the communal meal from an animal offered and shared" },
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What khorovats is",
        paragraphs: [
          "Khorovats is meat cut into large pieces, threaded onto long flat skewers and cooked over embers, not flame. Beforehand the meat is usually salted and left for some hours with onion, herbs and sometimes wine or sparkling water. The seasoning stays deliberately light, because the fire is the point.",
          "Vegetables go on alongside: aubergine, sweet pepper and tomato. Once blackened, they are often peeled and chopped together into a dish of their own, usually called khorovats salad.",
          "Because the name describes a method, it stretches. The same word covers lamb skewered over vine cuttings in a village and meat cooked on a metal grill on a city balcony.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "Khorovats is the outdoor counterpart to the tonir. Ethnographic studies describe bread-baking at the hearth as women's territory. At a family gathering, by contrast, the fire and the skewers are usually handled by men, and whoever tends them holds a recognised role for the afternoon.",
          "The gathering is more elaborate than the food. A khorovats is an excuse to spend several hours somewhere — a garden, a riverbank, a mountain road — with the cooking spread across the whole afternoon instead of kept to one mealtime. Much of the eating happens standing up, as each batch comes off.",
          "In the diaspora it is one of the most lasting Armenian customs, because it needs no special equipment and no tonir. A grill, skewers and lavash are enough.",
        ],
      },
      {
        id: "history",
        heading: "History: what the sources say",
        paragraphs: [
          "Nobody can put a date on grilling meat over fire, and no serious source tries to. What we can describe is the practice as it is recorded today, and how it relates to older rituals of eating meat together.",
          "The useful scholarship here is on madagh. In her study of the practice among Armenians, the anthropologist Susan Paul Pattie describes madagh as a meal from an animal offered and shared. It is often translated into English as \"sacrifice\", a word she shows to be misleading, and she traces how differently communities understand it. In the Republic of Armenia and in the Middle East, the public slaughter of the animal is still ordinary. In much of the diaspora it is seen as backward, and the meal carries on without it.",
          "Khorovats is not madagh. But the two follow the same pattern: meat cooked in quantity and eaten together outdoors, by a group larger than one household. Today's secular gathering has taken on some of what the older ritual carried.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "The meat is cut into pieces large enough to stay juicy, salted, and left with sliced onion and herbs. Many families add nothing else. Others use wine, sparkling water, or a little pepper and paprika.",
          "The fire is built and left to burn down. The skewers go on only when there is a bed of embers and no flame. Where they can be had, vine cuttings and fruitwood are prized for their smoke.",
          "Cooks turn the skewers by hand and judge them by eye. The meat is often slid straight off onto lavash, which soaks up the juices and is eaten with it.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "Khorovats belongs to holidays, family outings, weekends and any time a group of people has an afternoon together. It is the usual way to celebrate a birthday or a visit home, and it travels more easily than almost any other dish in this section.",
          "It also turns up at gatherings with a religious purpose, such as after a baptism, a commemoration or a pilgrimage. There the line between an ordinary grill and a madagh can blur, and families themselves explain the difference in different ways.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "The most visible difference is the meat. Pork is very common in the Republic of Armenia. Lamb is more usual in Armenian communities of the Middle East, where it also carries echoes of the ritual meal. Beef and chicken are ordinary everywhere.",
          "In some regions the meat is cooked in large pieces on the bone; in others it is cubed. Some cooks grill the vegetables first and keep them warm, while many families do the reverse.",
          "There is also a version cooked in a covered pot with vegetables, away from any fire, and in everyday speech it goes by the same name. The word describes what is done to the meat more than where it is done.",
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
          "Susan Paul Pattie's study of madagh appears in Food, Culture & Society. It shows how differently the communal meat meal is understood in Armenia and in the diaspora.",
      },
    ],
    significance: {
      heading: "Why khorovats matters",
      paragraphs: [
        "Khorovats is the least ceremonious dish in this section, and that makes it one of the most revealing. It has no heritage listing, no fixed recipe and no origin story worth defending. Yet it is the form an Armenian celebration most often takes.",
        "It also shows how a ritual can leave its shape behind after the ritual itself has faded. The communal meat meal of a madagh and an afternoon of grilling in a garden are different things, and it would be a mistake to confuse them. But the garden grill clearly comes from a world in which madagh was ordinary.",
      ],
    },
    interestingFacts: [
      "The word is the past participle of the Armenian verb for roasting, so it names a method, not a recipe.",
      "The vegetables grilled beside the meat are peeled and chopped into a separate dish, usually called khorovats salad.",
      "Skewers go on only after the flame has died down. Cooking over embers instead of fire is the part of the technique cooks argue about least.",
      "Meat is often slid off the skewer straight onto lavash, which is eaten with it.",
      "Madagh, the communal meal from an animal offered and shared, is a different practice. Susan Paul Pattie's study found that its visible slaughter is ordinary in Armenia and the Middle East but widely rejected in the diaspora.",
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
        "The meat is salted and left with onion and herbs for some hours, then threaded onto long skewers and cooked over embers, not flame, turned by hand until done. Vegetables grill beside it.",
      occasions: ["Family gatherings and outings", "Holidays and celebrations", "Meals following commemorations"],
      regions: [
        "Throughout the Republic of Armenia",
        "Armenian communities of the Middle East, more often with lamb",
        "Diaspora gatherings, where it needs no special equipment",
      ],
      serving:
        "Slid off the skewer onto lavash and eaten at once, with raw onion, herbs and the grilled-vegetable salad alongside.",
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
      "Wheat and meat stirred together for hours until they become one. The dish appears in a tenth-century Baghdadi cookbook, and Armenians cook it every September to commemorate the Musa Dagh resistance.",
    metaDescription:
      "Harissa, the Armenian dish of hulled wheat and meat stirred for hours: its record in a tenth-century Baghdadi cookbook and the September commemoration at Musaler.",
    summary:
      "Harissa is hulled wheat, called korkot in Armenian, cooked with chicken or lamb for many hours. It is stirred until the meat breaks down and the wheat bursts, and the result is a single heavy mass instead of a stew. Texture is the test: a well-made harissa pulls away from the spoon. Melted butter goes over the top before serving, with cumin or pepper on the side. Because it feeds a great many people from very little, it belongs to communal and church occasions. It first appears in writing in a tenth-century Baghdadi cookbook, and related versions are made across the Middle East. Its best-known Armenian occasion is far more recent: the September commemoration at Musaler, in Armavir, of the 1915 resistance on Musa Dagh.",
    intro:
      "Harissa is hulled wheat and meat cooked together for many hours and stirred until you can no longer tell one from the other. It is not a delicate dish and was never meant to be. It feeds a great many people from very little, and a large pot can be kept going through the night. The dish is recorded in a tenth-century Baghdadi cookbook, where harīsa appears as pounded wheat cooked with meat. Its best-known Armenian occasion is far more recent: the September commemoration at Musaler, in Armavir, of the 1915 resistance on Musa Dagh.",
    author: "Armat Editorial Team",
    updated: "2026-07-31",
    keyFacts: [
      { label: "Kind of dish", value: "Wheat and meat cooked to a thick porridge" },
      { label: "Ingredients", value: "Hulled wheat (korkot), chicken or lamb, butter, salt" },
      { label: "Method", value: "Long, slow cooking with constant stirring" },
      { label: "Earliest written record", value: "A tenth-century Baghdadi cookbook" },
      { label: "Best-known Armenian occasion", value: "The September commemoration at Musaler" },
      { label: "Served", value: "From a communal pot, with melted butter poured over" },
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What harissa is",
        paragraphs: [
          "Harissa is made from two things: hulled wheat, called korkot in Armenian, and meat, most often chicken and sometimes lamb. They cook together in a large pot with water and salt for a long time. The pot is stirred until the meat has broken down completely and the wheat has burst, so the finished dish is one smooth, heavy mass, not a stew with pieces in it.",
          "Everything depends on the texture. Stir too little and you get wheat soup with meat in it; stir properly and the harissa pulls away from the spoon. Melted butter is poured over at the end, with pepper or cumin offered separately.",
          "It is far more filling than its few ingredients suggest, and that is the point. Harissa is a dish for feeding a crowd: a monastery, a village or a column of refugees.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "For most Armenians today, harissa is a dish of commemoration, and of one commemoration in particular. Every September, at the Musa Dagh memorial in the village of Musaler in Armavir Province, harissa is cooked in large quantities and shared out. The pots are started in the evening and stirred through the night, with music and dancing around the fires. The food is handed out the next day.",
          "The event remembers the 1915 resistance on Musa Dagh. The Armenians of several villages on the mountain refused deportation and held out until French warships took them off. According to the Armenian National Institute, the memorial at Musaler was designed by the architects Rafael Israelian and Ara Harutyunyan and opened in 1976. The Institute also notes that the village below it took the mountain's name in 1972.",
          "Beyond Musaler, harissa is still a communal and church dish, cooked for a parish, a saint's day, or a gathering too large for any one person to cater. The scale is part of its meaning.",
        ],
      },
      {
        id: "history",
        heading: "History: what the sources say",
        paragraphs: [
          "The oldest written evidence is not Armenian. Harīsa, pounded wheat cooked with meat, appears in the tenth-century Baghdadi cookbook of Ibn Sayyār al-Warrāq. Nawal Nasrallah's English translation of it was published in 2007. So the dish has a written history of more than a thousand years. It belongs to a food tradition shared across the Middle East, where versions with closely related names are still made.",
          "Its link to Armenian commemoration came in the twentieth century, through one specific event. Raymond Kévorkian's history of the Armenian Genocide documents the Musa Dagh episode of 1915 in detail. Survivors and their descendants tied that event to this dish: wheat and meat were what they had, and harissa was what could be made from them. That link survives in community memory, not in the archives, and we present it here on that basis.",
          "Armenian food folklore also repeats a legend that credits the dish to Gregory the Illuminator. It is a story told about harissa, not a record of where it came from, and it is worth knowing as folklore, not as history.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "Korkot is wheat that has been hulled and usually parboiled and dried, so it falls apart in long cooking. It is soaked, then simmered with the meat in plenty of water.",
          "The real work is the stirring. As the pot thickens, it has to be worked constantly with a long paddle or spoon, both to stop it catching and to break down the meat. When a community cooks it together, people take turns through the night.",
          "Butter is poured over the top before serving. Many families add nothing else. Some finish it with cumin, and others serve pepper on the side instead of adding it to the pot.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "Most people associate harissa with the September gathering at Musaler. That gathering is a commemoration, not a food festival. The cooking, the all-night vigil over the pots and the sharing of the food are how it is marked.",
          "Elsewhere harissa is cooked for church and community events, and in winter as a family dish, when the same long cooking simply fills an afternoon. Some households make it on the anniversary of a death.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "The main difference is the meat. Chicken is now the usual choice in the Republic of Armenia. Lamb is common in Armenian communities of the eastern Mediterranean and makes a heavier dish.",
          "The wheat varies too. Korkot can be coarser or finer, and some places use barley, which changes how long the cooking takes and how smooth the result is.",
          "Across the Middle East and beyond, cooks make closely related dishes under names descended from the same word, with different grains, meats and finishing fats. They are relatives of this dish, not versions of it, and Armenian harissa is one member of that family.",
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
          "Nawal Nasrallah's English translation of Ibn Sayyār al-Warrāq's tenth-century Baghdadi cookbook is published, making the earliest written harīsa recipes widely available.",
      },
    ],
    significance: {
      heading: "Why harissa matters",
      paragraphs: [
        "No dish in this section shows more clearly how history can change what a dish means. Harissa's written record is a thousand years old and regional. Its emotional weight for Armenians today comes from a single event in 1915 and the commemoration that grew out of it.",
        "It is also a reminder of what a dish of scarcity looks like. Wheat, meat, water, salt and many hours of stirring can feed a very large number of people. That is why harissa turns up wherever a community has had to eat together on little, and why it is still cooked in pots far too big for any one family.",
      ],
    },
    interestingFacts: [
      "Harīsa is recorded in a tenth-century Baghdadi cookbook, centuries before it was attached to any modern national cuisine.",
      "At Musaler the pots are lit in the evening and stirred through the night, with singing and dancing around the fires until the food is given out the next day.",
      "Franz Werfel's novel fixed \"forty days\" of resistance in the public imagination, but historical accounts of the Musa Dagh episode count rather more.",
      "A legend in Armenian food folklore credits the dish to Gregory the Illuminator. It is a story about harissa, not a record of its origin.",
      "Texture is the test: a well-made harissa pulls away from the spoon in one mass instead of behaving like a soup.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: ["Hulled wheat (korkot)", "Chicken or lamb", "Butter", "Salt", "Cumin or pepper, optionally"],
      preparation:
        "Soaked hulled wheat and meat simmer together for many hours, stirred constantly with a long paddle until the meat breaks down and the two become one smooth mass. Melted butter is poured over before serving.",
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
      "A sweet pastry built around khoriz, a crumbly mix of flour, butter and sugar. Nearly every village that bakes it gives it its own shape and pattern.",
    metaDescription:
      "Gata, the Armenian sweet pastry filled with khoriz (flour rubbed into butter and sugar): its many shapes, the patterns on top and its role as a gift.",
    summary:
      "Gata is a sweet baked pastry with a filling that has its own name: khoriz. Khoriz is flour rubbed into butter and sugar until it forms crumbs that melt back into the dough in the oven. The dough is rich with butter and often yoghurt or sour cream. Before baking, the top is glazed with egg and marked, which decorates it and also keeps the surface from doming. Gata comes out dry, not moist, and that is why it keeps and travels well: a whole gata, wrapped, is the usual thing to bring when visiting. Almost everything else varies: it can be a disc the width of a table or a roll that fits in a hand, many families keep their own pattern for the top, and a walnut version made in the south often goes by the name nazook.",
    intro:
      "Gata is a sweet pastry whose filling has a name of its own: khoriz, flour rubbed into butter and sugar until crumbly, which melts back into the dough as it bakes. Past that, almost everything varies. A gata can be a disc the width of a table or a roll that fits in a hand. It can be plain or covered in patterns. It can be a celebration cake, a gift carried on a visit, or something to eat with afternoon coffee. It was among the sweets demonstrated at the Smithsonian Folklife Festival's Armenia programme in 2018.",
    author: "Armat Editorial Team",
    updated: "2026-07-31",
    keyFacts: [
      { label: "Kind of dish", value: "Sweet baked pastry" },
      { label: "Filling", value: "Khoriz: flour worked into butter and sugar" },
      { label: "Dough", value: "Rich with butter, often with yoghurt or sour cream" },
      { label: "Shapes", value: "Large marked discs, small rolls, braided loaves" },
      { label: "Decoration", value: "Patterns scored or pricked into the top before baking" },
      { label: "Usually eaten with", value: "Tea or coffee" },
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What gata is",
        paragraphs: [
          "Gata is made in two parts. The dough is rich with butter, often yoghurt or sour cream and sometimes egg, so it is closer to pastry than to bread. The filling, khoriz, is flour worked into softened butter and sugar until it holds together in crumbs.",
          "There are two ways to put them together. The baker either spreads khoriz over rolled dough and folds it, or wraps a portion of it in dough and flattens the whole thing. The top is brushed with egg and marked, and the pastry bakes until deep gold.",
          "Gata comes out dry, not moist, and that is a strength. It keeps well and travels well, and its two main social roles both depend on that.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "Gata is the standard thing to arrive with. A whole one, wrapped, is an ordinary gift when you visit a household, and cutting it is part of the visit. The same pastry comes out when a household receives guests.",
          "People also tie gata to places, not only to families. For many, the gata they remember is a marked disc sold at a monastery gate or a roadside stall: bought on a journey, eaten in the car, and brought home as a keepsake of where they had been.",
          "The decoration matters more than it looks. Many villages and families keep their own pattern, and when several gatas share a table, the marking is how you tell them apart.",
        ],
      },
      {
        id: "history",
        heading: "History: what the sources say",
        paragraphs: [
          "Gata is well documented in the modern period and thinly before it. Nobody can give it a date of origin, and this article does not make one up.",
          "What was written down is the range of forms. Sonia Uvezian's The Cuisine of Armenia, first published in 1974, was the first wide-ranging English-language account of Armenian cooking. It set down the standard forms of pastries like gata for readers outside the community. Irina Petrosian and David Underwood's Armenian Food: Fact, Fiction & Folklore, published in 2006, went a step further: it separated what is documented about Armenian dishes from what is simply repeated. That matters for a pastry wrapped in as many unsourced stories as gata.",
          "Ethnographic studies of Armenian folk culture, including the material collected in Armenian Folk Arts, Culture, and Identity, treat baking like this as part of household life and the yearly calendar, not as a recipe on its own.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "The dough is made with flour, butter and a soured dairy product, kneaded briefly and left to rest. The khoriz is made separately by rubbing flour into softened butter and sugar. Some cooks toast the flour first, many add vanilla, and in the south walnuts are often mixed in.",
          "Assembly is where the versions part ways. For a thin, wide gata, the baker spreads khoriz over rolled dough, rolls or folds it, and flattens the result. A thick one wraps much more filling into a smaller circle.",
          "The top is brushed with egg and then marked with a fork, a knife or a carved wooden stamp before it goes into a hot oven. The marks are decorative, but they also stop the surface from doming.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "Gata is a celebration pastry that belongs to no single celebration. It turns up at family gatherings, on feast days, on the table for guests, and at the end of ordinary afternoons with coffee.",
          "Many families bake it for particular days in the church calendar, but the custom varies by household and region and follows no single rule. People also often bring it to church as an offering or share it after a service.",
          "It has held on strongly in the diaspora. It needs no special equipment, and it is the kind of thing an older relative teaches by making it while someone watches.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "The best-known versions are large, round and decorated. They are closely linked with the villages around Geghard and Garni, where they are sold to visitors.",
          "Elsewhere gata is thicker and denser, with far more filling. It can also be made as small individual rolls, or as a braided loaf cut into slices.",
          "In some regions walnuts go into the khoriz, and the walnut version made in the south and among Armenians of Iran is often called nazook. Families disagree about whether that is a different pastry or the same one under another name, and there is no need to settle it.",
        ],
      },
    ],
    importantDates: [
      {
        year: "1974",
        event:
          "Sonia Uvezian publishes The Cuisine of Armenia, the first wide-ranging English-language account of Armenian cooking.",
      },
      {
        year: "2006",
        event:
          "Irina Petrosian and David Underwood publish Armenian Food: Fact, Fiction & Folklore, which separates what is documented about Armenian dishes from what is merely repeated.",
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
        "Of the dishes covered here, gata has the least documented history and the clearest role today. It is what an Armenian household gives, receives and offers to guests, and it can do that because it keeps so well.",
        "Its variety teaches something too. There is no single correct gata. The shape, the thickness, the amount of filling and the pattern on top all change from village to village, so calling one household's version the authentic one would describe a family, not a tradition.",
      ],
    },
    interestingFacts: [
      "The filling has its own name, khoriz: flour rubbed into butter and sugar until crumbly.",
      "Many villages and families keep their own pattern for the top, and the marking is how people tell one gata from another.",
      "Sizes run from discs wide enough to fill a table to rolls that fit in one hand.",
      "The scoring does more than decorate: it keeps the surface from doming in the oven.",
      "A walnut-filled version made in the south and among Armenians of Iran is often called nazook. Families disagree about whether it is the same pastry under another name.",
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
        "A rich dough is rolled out and spread or filled with khoriz (flour rubbed into butter and sugar). It is then folded or enclosed, flattened, glazed with egg, marked on top and baked until deep gold.",
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
      "A whole pumpkin filled with rice, dried fruit and nuts and baked until it can be opened at the table. A festive dish whose ingredients firmly date it to the modern era.",
    metaDescription:
      "Ghapama, a whole pumpkin baked with rice, dried fruit and nuts and opened at the table: its festive role, the Goris version, and why it is not ancient.",
    summary:
      "Ghapama is a whole pumpkin, opened at the stem and seeded, then filled with part-cooked rice mixed with dried apricots, raisins, walnuts or almonds, butter, honey and cinnamon. It is closed with its own lid and baked slowly until the flesh is soft. The pumpkin comes to the table whole and is cut along its natural ridges so that it opens outwards, and that moment is a big part of why people make it. It belongs with the sweet dishes at the end of a meal and is linked especially with Christmas and New Year tables. Families saved it for feasts because the nuts and dried fruit were costly. A folk song about ghapama is widely sung at Armenian gatherings. The dish cannot be ancient: every pumpkin of the genus Cucurbita is a plant of the Americas.",
    intro:
      "Ghapama is a whole pumpkin, hollowed out and filled with rice, dried fruit, nuts, butter and honey, then baked until the flesh is soft enough to eat with the filling. It arrives at the table whole and is cut down its ridges so that it opens outwards, which is a big part of why it is made. It is a feast dish, not an everyday one, historically because dried fruit and nuts were expensive. It is also the one dish in this section whose age has a clear limit, because the pumpkin at its heart is not an Old World plant.",
    author: "Armat Editorial Team",
    updated: "2026-07-31",
    keyFacts: [
      { label: "Kind of dish", value: "Whole filled pumpkin, baked" },
      { label: "Filling", value: "Rice, dried apricots, raisins, walnuts or almonds, butter, honey" },
      { label: "Seasoning", value: "Cinnamon, and sometimes other warm spices" },
      { label: "Served", value: "Whole, then cut open at the table" },
      { label: "Place in the meal", value: "Towards the end, among the sweet dishes" },
      { label: "Age", value: "No older than the pumpkin's arrival from the Americas" },
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What ghapama is",
        paragraphs: [
          "The cook cuts a pumpkin open at the stem to make a lid, removes the seeds, and fills it with part-cooked rice mixed with dried fruit, nuts, butter, honey and cinnamon. The lid goes back on, and the pumpkin bakes slowly until the flesh is soft.",
          "It is served whole and opened in front of the people eating it. The Smithsonian Folklife Festival's account of the dish describes the pumpkin being sliced along its natural indentations so that it falls open like the petals of a flower, revealing the filling.",
          "In an Armenian meal it comes towards the end, with the sweet dishes, and not as a main course. Still, the filling is hearty enough that nobody treats it as a light finish.",
        ],
      },
      {
        id: "cultural-role",
        heading: "Its place in Armenian life",
        paragraphs: [
          "Ghapama is made to be seen. It needs a large pumpkin, a long bake and expensive fillings, and it is meant to be revealed at the table, not dished up out of sight in the kitchen. That makes it a natural centrepiece for a celebration.",
          "According to the Smithsonian's account, families reserved it for feasts and festivals precisely because nuts and dried fruit were costly, and it is traditionally associated with Christmas. So its festive status comes from economics as much as from ceremony.",
          "Ghapama is also well known beyond the kitchen, thanks to a folk song about it that is widely sung at Armenian gatherings. The song is familiar enough outside those gatherings that the Smithsonian's account of the dish introduces it by way of the Armenian-American rock band System of a Down.",
        ],
      },
      {
        id: "history",
        heading: "History: what the sources say",
        paragraphs: [
          "Ghapama is the one dish here with a firm outer limit on its age. Every pumpkin and squash of the genus Cucurbita is a plant of the Americas, and none was grown in the Old World before transatlantic contact. Whatever older habits of filling and baking vegetables came before it, ghapama as it exists today is a fairly modern dish.",
          "This needs saying because ghapama is often described as ancient. Its technique, hollowing out a vegetable and filling it, is old and shared with the dolma family. Pairing that technique with a squash from the New World is not.",
          "Like gata's, its written record is modern: cookbooks, ethnographic collections and, more recently, cultural programmes such as the Smithsonian Folklife Festival's Armenia season in 2018. That programme published an account of the dish and of a Goris version made with dried Armenian apricots and foraged cornelian cherries.",
        ],
      },
      {
        id: "ingredients-and-preparation",
        heading: "Ingredients and preparation",
        paragraphs: [
          "The pumpkin has to be sound and roughly round, big enough to hold the filling but not so thick-skinned that it won't cook through. It is opened at the top, seeded and scraped out.",
          "The rice is part-cooked and mixed with dried apricots, raisins, prunes, walnuts or almonds, butter, honey and cinnamon. Many families add more butter than seems reasonable, because that is what keeps the rice from drying out against the shell.",
          "The filled pumpkin is closed with its lid and baked slowly for a long time. It is ready when a skewer slides easily through the flesh, and it rests before it is carried to the table.",
        ],
      },
      {
        id: "occasions",
        heading: "Occasions and traditions",
        paragraphs: [
          "Its ingredients make ghapama a winter dish, and its cost makes it a festive one. It is linked especially with Christmas and New Year tables, and it appears at weddings and other big celebrations that call for a centrepiece.",
          "The cutting is part of the occasion. Because everyone watches the pumpkin being opened, it becomes a small ceremony of its own, and that is usually the moment the song is sung.",
        ],
      },
      {
        id: "variations",
        heading: "Regional variations",
        paragraphs: [
          "The regional version recorded in most detail comes from Goris, in the south. It uses dried Armenian apricots and locally gathered cornelian cherries.",
          "Elsewhere the fruit depends on what a household dries: prunes, raisins, sour plums, apple. The nuts work the same way: walnuts most often, almonds where they are cheaper.",
          "There are meat versions too, where lamb or chicken goes into the rice and the dish moves from the sweet end of the meal to the savoury. In some regions no honey is used at all, and all the sweetness comes from the fruit. All of these are normal, and none is the standard the others must be measured against.",
        ],
      },
    ],
    importantDates: [
      {
        year: "2006",
        event:
          "Irina Petrosian and David Underwood publish Armenian Food: Fact, Fiction & Folklore, one of the few book-length attempts to separate what is documented about Armenian dishes from what is merely repeated.",
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
        "Ghapama shows more clearly than any other dish here that food can be truly traditional without being ancient. Its ingredients date it to after transatlantic contact, yet it is woven into Armenian celebrations, memories and songs.",
        "It is also a dish about abundance, in a cuisine mostly about making a great deal from very little. Harissa feeds a crowd from wheat and one animal. Ghapama exists to look like more than a household can normally afford, and to be opened where everyone can see it.",
      ],
    },
    interestingFacts: [
      "The pumpkin is cut along its natural ridges so that it opens outwards like the petals of a flower when it reaches the table.",
      "Every pumpkin and squash of the genus Cucurbita comes from the Americas, which puts an outer limit on how old the dish can be.",
      "According to the Smithsonian's account, families saved ghapama for feasts because the nuts and dried fruit in it were expensive.",
      "A folk song about ghapama is sung at Armenian gatherings, and the Smithsonian's account of the dish opens by pairing it with the Armenian-American rock band System of a Down.",
      "The version recorded in Goris uses dried Armenian apricots together with foraged cornelian cherries.",
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
        "The pumpkin is opened at the stem and seeded, then filled with part-cooked rice mixed with dried fruit, nuts, butter, honey and cinnamon. It is closed with its own lid and baked slowly until the flesh is soft.",
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
      "A soup with no stock in it. The liquid is matsun thinned with water and cooked with a grain until it thickens, and the whole method is there to stop the fermented milk from curdling.",
    metaDescription:
      "Spas, the Armenian soup made with matsun instead of stock: the grain that goes in, why it curdles when heated, and what its two names tell us.",
    summary:
      "Spas is a soup made from matsun, or fermented milk, thinned with water and cooked with a grain, usually dzavar, then finished with herbs. What sets it apart is a kitchen problem. Matsun is acidic, and acidic milk curdles when heated, so cooks beat in egg or flour to stabilise it, then warm the pot slowly and keep stirring. It is eaten hot in cold weather and cool in warm weather, with bread, and it belongs to everyday home cooking, not to feasts. Its two names come from opposite directions: one from an old word for what is served, the other from the dairy itself. Neither word's age tells us how old the dish is.",
    intro:
      "Spas is the everyday side of Armenian cooking. It is a soup of matsun, or fermented milk, thinned with water and cooked with a grain until it thickens, then finished with herbs. It is served hot or cool, and it is what a family eats on an ordinary evening, not something made for a feast. It also poses a real kitchen problem: heating fermented milk is exactly what makes it curdle. Most of what is special about making spas comes down to solving that.",
    author: "Armat Editorial Team",
    updated: "2026-08-20",
    keyFacts: [
      { label: "Kind of dish", value: "Soup made with fermented milk" },
      { label: "Base", value: "Matsun thinned with water, or tan, which is matsun already diluted" },
      { label: "Grain", value: "Usually dzavar; also rice, wheat berries or barley" },
      { label: "Herbs", value: "Cilantro, mint, parsley or dill, depending on the household and season" },
      {
        label: "The kitchen problem",
        value: "Acidic dairy curdles when heated; a stabiliser and slow warming prevent it",
      },
      { label: "Served", value: "Hot in cold weather, cool in warm weather, with bread" },
    ],
    sections: [
      {
        id: "what-spas-is",
        heading: "What spas is",
        paragraphs: [
          "Spas is built the other way round from most soups. There is no stock in it. The liquid is matsun, Armenian fermented milk, thinned with water until it pours. Everything else, from the grain to the herbs and salt, goes into that.",
          "A grain cooks in it until it softens and the soup thickens a little. Dzavar, which is hulled and cracked wheat, is the classic choice. Rice is common in modern kitchens, and whole wheat and barley appear too. The herbs go in at or near the end.",
          "The result is white and faintly sour. It is thicker than water but nothing like a purée. You can eat it straight from the pot or let it cool and eat it cold, and with bread it makes a whole meal, not just a starter.",
        ],
      },
      {
        id: "matsun-as-the-base",
        heading: "Matsun as the base",
        paragraphs: [
          "Matsun is milk fermented by bacteria that turn its sugars into lactic acid. That acid helps it keep and gives it its taste. As the next sections explain, it also makes matsun tricky to cook.",
          "In spas, matsun is not a spoonful stirred in at the table. It is the soup itself, and it is nearly always thinned. Some cooks use water. Others use tan, which is matsun already diluted and salted, and usually drunk as it is.",
          "Matsun has a much bigger life than this one soup. People eat it plain or strained, serve it beside grain and meat dishes, and work it into dough, and that story belongs to an article of its own. Here the point is simpler: matsun is the liquid, it is acidic, and the whole method is built around that.",
        ],
      },
      {
        id: "grain-and-herbs",
        heading: "Grain and herbs",
        paragraphs: [
          "Dzavar is wheat hulled and cracked into groats, coarser than semolina and finer than a whole berry. It is the grain most linked with spas. It softens without falling apart, so the soup thickens while each grain stays whole.",
          "Other grains are used too. Rice is widespread today and gives a smoother soup. Whole wheat berries make it chewier, and barley turns up where barley was the local crop. Calling any one of these the correct grain would describe one family's kitchen, not the dish.",
          "The herbs vary even more. Cilantro, mint (often dried), parsley and dill all appear, alone or together. Which ones a cook uses depends on the season, the region and what is growing. The Smithsonian's Armenia programme noted that each region has its own favourite wild plants, and spas is a soup where that shows.",
        ],
      },
      {
        id: "keeping-it-from-curdling",
        heading: "Keeping it from curdling",
        paragraphs: [
          "The most interesting thing about spas is a problem, not an ingredient. Milk copes unusually well with heat. Unlike egg or meat, its proteins do not set when cooked. But Harold McGee, explaining the chemistry, adds the exception that matters here: they do curdle once the milk has turned acidic. Matsun is acidic by definition, so heating it does exactly what heating fresh milk does not.",
          "Left alone, the mixture splits into grains of curd in a thin liquid. You can still eat it, but it is not spas. To prevent this, cooks add a stabiliser: a beaten egg or yolk, some flour, or the starch the grain itself gives off. They also heat the pot slowly and stir the whole time, so no part of it gets hotter than the rest.",
          "One piece of advice always comes with the dish: stir in one direction. It helps to be clear about what that is. Explanations of the chemistry talk about temperature, acidity, stirring and stabilisers, and none of them says the direction of the spoon matters. What the advice does ensure is steady, nonstop stirring, and that does matter. It is kitchen custom rather than a mechanism, and we pass it on here as custom.",
        ],
      },
      {
        id: "two-names",
        heading: "Spas and tanapur",
        paragraphs: [
          "The dish has two names, and they come from opposite directions. Spas is the older and stranger one. The word was borrowed from Middle Iranian, where it meant service. In Classical Armenian its meaning stretched from service, to the vessels and dishes set out for a meal, to the food served in them. The standard dictionary of the classical language, published in Venice in 1836 and 1837, lists soup among its meanings.",
          "Tanapur is plain by comparison. It simply joins tan, the diluted matsun, and apur, soup: the soup made of tan. The same dictionary gives an older meaning of tan that is closer to broth than to a drink, a reminder that these words have shifted over time.",
          "Today the two names usually mean the same dish, and this article uses them that way. Whether they once meant different things, or split along regional lines, is not something the available sources settle. What the age of the words does not establish is the age of the soup. A name can be centuries older than the dish later attached to it, and no written record places this soup in the classical period.",
        ],
      },
      {
        id: "hot-cold-and-the-season",
        heading: "Hot, cold and the season",
        paragraphs: [
          "Spas is often described as a winter soup served hot and a summer soup served cold, and many modern accounts put it that way. It is better seen as a range than a rule. The same soup works at either temperature, and households differ.",
          "The cold version is simpler, since a soup that is never heated cannot curdle. The hot version needs all the stabilising, slow warming and constant stirring, yet people make it anyway. That says a lot about how much they want it in winter.",
          "Either way, it comes with bread. Lavash torn into the bowl is the usual partner, and in the cold version, where the soup is thin and sharp, the bread is what makes it a proper meal.",
        ],
        links: [{ phrase: "Lavash", slug: "lavash" }],
      },
      {
        id: "everyday-cooking",
        heading: "Everyday cooking",
        paragraphs: [
          "Most dishes in this section belong, in one way or another, to an occasion. Harissa is cooked in huge pots for a commemoration, ghapama comes to the table at a feast, and khorovats gathers people around a fire. Spas is not an occasion. It is what gets made on an ordinary evening from whatever is already in the house.",
          "The Smithsonian's Armenia programme of 2018 put it simply: a feast differs from daily meals in its ingredients, its cooking methods and the way it is served. Spas falls firmly on the daily side of that line.",
          "That is also why it is thrifty in a way festive dishes are not. Matsun is made at home from milk that would otherwise spoil, the grain comes from the store cupboard, and the herbs are grown, gathered or dried. It is put together from what a household already has, with no shopping trip needed.",
        ],
        links: [{ phrase: "Harissa", slug: "harissa" }],
      },
      {
        id: "a-wider-family",
        heading: "A wider family",
        paragraphs: [
          "Soups of grain and herbs, and cooking with soured or dried dairy, are not unique to Armenia. In his survey of Iranian cooking for the Encyclopædia Iranica, Bert Fragner describes porridge-like soups of grains, vegetables and herbs, the āsh family, as everyday town food by the fourteenth and fifteenth centuries. He also notes that milk products such as kashk were widely used to flavour them.",
          "The same survey describes making yogurt, dried yogurt and white cheese as practices that spread early and widely across the Iranian plateau and Central Asia. So fermented-milk soups exist across a broad region under many names. They are related by method, not descended from one another.",
          "None of that takes anything away from the Armenian dish. Spas has its own names, its own typical grain, its own herbs and its own place in the day, and those are what this article describes. Which cuisine first made soup from fermented milk is a question no evidence can answer, and not one worth asking.",
        ],
      },
    ],
    importantDates: [
      {
        year: "1836–1837",
        event:
          "The Nor baṛgirkʻ haykazean lezui, the standard dictionary of Classical Armenian, is published in Venice. It lists soup among the meanings of the word spas.",
      },
    ],
    significance: {
      heading: "Why spas matters",
      paragraphs: [
        "Nobody serves spas to mark an occasion, and that is exactly why it belongs here. If a cuisine is described only through its festive food, you see only the exceptions. The ordinary cooking that most people eat most of the time goes unrecorded.",
        "It is also the clearest example in this section of a dish shaped by a technique more than by its ingredients. Everything about how it is made, from the stabiliser to the slow heat and nonstop stirring, exists to solve one problem. Understanding that problem explains the dish better than any recipe could.",
      ],
    },
    interestingFacts: [
      "There is no stock in spas. The liquid is fermented milk thinned with water.",
      "Milk proteins handle heat unusually well and do not set when cooked. But they do curdle once the milk has turned acidic, which is why matsun needs careful handling on the stove.",
      "The word spas was borrowed from Middle Iranian, where it meant service. It passed through the meaning of what is set out for a meal before it came to mean this soup.",
      "Tanapur explains itself: tan, the diluted matsun, plus apur, soup.",
      "The familiar advice to stir in one direction is kitchen custom. Explanations of the chemistry talk about temperature, acidity, stirring and stabilisers, not direction.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Matsun, thinned with water",
        "Dzavar (hulled, cracked wheat)",
        "Egg or flour, as a stabiliser",
        "Onion",
        "Cilantro, mint, parsley or dill",
        "Salt",
      ],
      preparation:
        "Matsun is thinned and beaten smooth with egg or flour to stabilise it, then warmed slowly and stirred constantly so the acidic dairy does not curdle. The grain cooks in it until it softens and the soup thickens, and the herbs go in near the end. It is served hot, or cooled and served cold.",
      occasions: ["Ordinary household meals", "Winter, served hot", "Summer, served cool"],
      regions: [
        "Made throughout Armenia and in the diaspora",
        "The grain follows what grows locally: wheat, or barley where barley was the local crop",
      ],
      serving:
        "In a bowl with bread; hot in cold weather and cool in warm weather, as a meal in itself rather than a starter.",
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
      "A thin round of unleavened dough folded over a filling of chopped greens and cooked on a griddle. It is the bread of Artsakh, and the one dish in this section defined by a hillside rather than a shopping list.",
    metaDescription:
      "Jingalov hats, the herb-filled flatbread of Artsakh and Syunik: the greens that define it, why their number is never fixed, and what we know of its history.",
    summary:
      "Jingalov hats is a flatbread from Artsakh and Syunik. Unleavened dough is rolled thin, piled with a large mix of finely chopped greens, sealed over the filling and cooked on a flat metal plate over a fire. The filling, not the bread, is what defines it, and it follows a pattern rather than a recipe: mild leafy greens for bulk, fragrant herbs for scent, and small amounts of sour and bitter greens for balance. Accounts disagree on how many kinds go in, and that is the point, because the mix follows the season and the hillside. The dish first appears in writing only in the nineteenth century, and since 2023 it has been made mostly far from the land whose plants define it.",
    intro:
      "Jingalov hats is bread used as a wrapper. A round of unleavened dough is rolled until it is almost see-through, and a heap of finely chopped greens is spread over it. The dough is drawn up and sealed, and the parcel is flattened again and cooked on a hot metal plate until it blisters. It belongs to Artsakh and neighbouring Syunik, not to the whole Armenian world, which makes it one of the most strongly regional dishes in this section. Its filling is also why it resists being written down as a recipe: what goes in is whatever the season and the hillside offer.",
    author: "Armat Editorial Team",
    updated: "2026-08-24",
    keyFacts: [
      { label: "Kind of dish", value: "Unleavened flatbread filled with chopped greens" },
      {
        label: "Where from",
        value: "Artsakh (Nagorno-Karabakh) and Syunik, not the Armenian world as a whole",
      },
      {
        label: "The filling",
        value: "Many greens at once: mild leaves for bulk, fragrant herbs, and a little sour and bitter",
      },
      {
        label: "How many greens",
        value: "Accounts range from about ten to twenty-six; the mix follows the season, not a count",
      },
      {
        label: "Cooked on",
        value: "A saj, a metal plate over a fire, in minutes; not against the wall of a tonir",
      },
      { label: "Season", value: "Early spring and autumn, when the wild greens are up" },
    ],
    sections: [
      {
        id: "what-jingalov-hats-is",
        heading: "What jingalov hats is",
        paragraphs: [
          "The dish brings together two opposites. The bread is as plain as bread gets: wheat flour, water and salt, unleavened and rolled thin. The filling is anything but plain. It is a dense mix of many different greens, finely chopped and dressed with oil and salt, in an amount that looks impossible until the dough closes over it.",
          "It is cooked flat and dry. The sealed parcel is pressed out until the greens show dark through the dough. It then goes onto a hot surface and is turned once, so both sides char in spots while the filling steams inside. The whole thing takes minutes.",
          "It is eaten warm, by hand, on its own. It is not a course, a side or a pastry. The dough is a skin thin enough to be just part of each bite, and what you taste is the greens.",
        ],
      },
      {
        id: "a-food-of-artsakh",
        heading: "A food of Artsakh",
        paragraphs: [
          "Jingalov hats belongs to Artsakh and to Syunik. Artsakh is the upland region between Armenia and Azerbaijan that Armenians call by that name and that is more often called Nagorno-Karabakh internationally. Syunik is the Armenian province along its western side. Both names appear in the sources used here, and we keep them separate. They are not interchangeable, and which one a source uses tells you something.",
          "This regional tie needs saying first, because it is unusual in this section. Lavash, dolma, harissa and the rest are made wherever Armenians live. This one is not. It is the dish of one particular upland, for a practical reason, not a sentimental one: the filling depends on what grows there.",
          "The region's Armenians speak their own dialect, and the dish's name comes from it. This article takes no position on the region's status. It does need to describe the dish as coming from a specific place with specific plants, because otherwise the most interesting thing about it disappears.",
        ],
      },
      {
        id: "the-language-of-greens",
        heading: "The language of greens",
        paragraphs: [
          "The filling works as a system, not a list. Cooks in Stepanakert, displaced families in Yerevan and a bakery in California all describe the same structure: a bulk of mild leafy greens, a smaller amount of strongly fragrant herbs, something sour and a touch of bitterness, all balanced against each other.",
          "The mild greens provide the volume: spinach, chard, beet greens, lettuce and their wild cousins. The fragrant herbs are the ones most readers will know, such as cilantro, dill, parsley, mint, green onion and green garlic. Sorrel adds sourness. Dandelion and its relatives add a bitter edge, used sparingly, because a mostly bitter filling is a mistake, not a variation.",
          "Nettle appears in many accounts and deserves a note of its own. It stings when raw and stops stinging once cooked, which is why a plant nobody would eat straight off the stem is perfectly normal inside this bread. Some cooks brighten the mix at the end with lemon, or with the purple powder of dried barberries.",
        ],
      },
      {
        id: "how-many-greens",
        heading: "How many greens",
        paragraphs: [
          "Almost every account of jingalov hats gives a number, and the numbers do not agree. Ara Zada, co-author of a book on Armenian cooking, told RFE/RL in 2024 that the original recipe called for twenty-six herbs and greens, and that around seventeen are usual today. The Smithsonian's account of displaced Artsakh families gives ten to twenty. Other totals circulate, some of them rounder than their sources justify.",
          "This disagreement is not the sources' fault. It comes from the nature of the dish. A mix put together from whatever is growing on a particular slope in a particular week cannot have a fixed count. Even the same cook will not land on the same number twice in one season.",
          "So the fair thing to say is that the filling is about abundance, not arithmetic. Many kinds go in, more than in any other dish in this section. Any specific total describes one recipe or one household, not a rule. When a round number is offered as the authentic count, it is a claim about authenticity, not a measurement.",
        ],
      },
      {
        id: "knowing-what-to-pick",
        heading: "Knowing what to pick",
        paragraphs: [
          "Ruzanna Tsaturian, a researcher at the Institute of Archaeology and Ethnography of Armenia's National Academy of Sciences, says the dish was traditionally made in early spring and autumn, when the wild herbs it needs are growing. The whole tradition works within that limit: the bread is there when the hillside is.",
          "That also hints at where the dish came from. In the countryside of Nagorno-Karabakh, someone who knew which greens to pick could make a meal from flour, water and what they gathered, in seasons when there was little else. Tsaturian describes families turning back to it during the shortages of the war of the 1990s. In that setting, she calls it the forest bread of their ancestors.",
          "The knowledge behind it is precise: which plants, which weeks, which parts, and which ones must be cooked before they can be eaten at all. It lives in households, not in books. This article describes that knowledge. It does not try to convey it: which wild plants are safe to eat is not something to learn from a page about food.",
        ],
      },
      {
        id: "dough-and-enclosure",
        heading: "Dough and enclosure",
        paragraphs: [
          "The dough is the plainest part of the dish: wheat flour, water and salt, unleavened, rested and rolled out very thin. Nothing enriches it, and nothing is meant to.",
          "The sealing is what makes the bread. The greens are spread over the round, the edge is pulled up over them and pinched shut, and the parcel is rolled or pressed flat again. The filling ends up as a thin layer between two thin layers of dough, not stuffed into a pocket. Keeping a very wet filling inside a very thin wrapper while flattening it is the real skill of the dish.",
          "The proportions are the reverse of most filled breads. By volume there is far more filling than dough, and the dough is just a skin. That is why the finished bread looks green through its surface, and why it is a different thing from a pie.",
        ],
      },
      {
        id: "the-griddle-and-the-tonir",
        heading: "The griddle, not the tonir",
        paragraphs: [
          "It is cooked on a saj, a metal plate set over a fire, and it is ready in minutes. Some accounts also allow a tonir, the clay pit oven. The plate is the characteristic method, and the two should not be run together just because both are Armenian and both involve fire.",
          "This matters because of the obvious comparison. Lavash is the other thin Armenian wheat bread, and it is made quite differently. The sheet is slapped against the inner wall of a tonir and peeled off seconds later, as the UNESCO listing of 2014 describes. Lavash is thin bread served as bread. Jingalov hats uses a similar thin sheet of wheat dough to wrap something else.",
          "The comparison is useful, up to a point. Both are unleavened wheat breads rolled thin by hand, and both belong to a wide regional family of such breads. Neither is a version of the other, and the cooking surface shows that most plainly.",
        ],
        links: [{ phrase: "Lavash", slug: "lavash" }],
      },
      {
        id: "what-the-record-can-say",
        heading: "What we know of its history",
        paragraphs: [
          "The written history is short, and it is better to say so than to fill the gap. Tsaturian dates the first written mentions of the dish to about two hundred years ago. An account published when the dish was listed as heritage puts it another way: it first appears in manuscripts of the nineteenth century, when Artsakh folklore was being collected.",
          "Both point to the same period, and it is a moment of recording rather than of invention. Nineteenth-century collectors wrote down what people were already doing, so the dish is surely older than its first mention. But how much older is not something the available evidence establishes. No source consulted here places it in antiquity, and neither does this article. A living regional tradition does not need an ancient origin to be worth describing.",
          "Its recent official life, though, can be dated. In 2013 the authorities in Artsakh added the dish to their register of intangible cultural heritage. In April 2015 the first festival devoted to it was held at Tsaghkashat, in the Askeran district, as part of a heritage-preservation programme. Tsaturian notes that over the twentieth century it had drifted from daily staple towards what she calls entertainment food. So the listing and the festival were recognising something that had already changed.",
        ],
      },
      {
        id: "a-food-away-from-its-place",
        heading: "A food away from its place",
        paragraphs: [
          "In September 2023, after an Azerbaijani military offensive, almost the entire Armenian population of Nagorno-Karabakh, more than a hundred thousand people, left for Armenia. The dish went with them. Stalls and small businesses run by displaced families opened in Yerevan and in towns across the country, and by 2024 RFE/RL was describing jingalov hats as a street food as popular as pizza.",
          "One thing could not make the journey. Writing in the Smithsonian's folklife magazine in February 2025, Aline Keledjian quotes a woman from Stepanakert on exactly this: the same herbs cannot be found in Armenia, because they grow in the mountains of Artsakh. You can carry a recipe in a suitcase, but not a hillside. Moving a dish defined by local plants changes it in a way that moving a dish defined by technique does not.",
          "The tradition carries on in that changed form. Families displaced in the earlier war of 2020 opened restaurants in Yerevan to keep making it. A bakery in Glendale, California, that serves nothing else became in 2023 the first Armenian restaurant in the United States to be listed in the Michelin guide. None of that replaces the place. It is continuity, not recovery, and that is how this article reads it.",
        ],
      },
    ],
    importantDates: [
      {
        year: "2013",
        event:
          "The dish is added to the register of intangible cultural heritage kept by the authorities in Artsakh.",
      },
      {
        year: "2015",
        event:
          "The first festival devoted to jingalov hats is held at Tsaghkashat, in the Askeran district of Artsakh, as part of a heritage-preservation programme.",
      },
      {
        year: "2023",
        event:
          "In September almost the whole Armenian population of Nagorno-Karabakh is displaced to Armenia. From then on the dish is made mainly outside the region whose plants define it.",
      },
    ],
    significance: {
      heading: "Why jingalov hats matters",
      paragraphs: [
        "Jingalov hats is not made everywhere Armenians live, and that is why it is here. Describe a national cuisine only through dishes found everywhere and you edit out its regions, which is where most of the cooking actually happened.",
        "It is also the clearest case in this archive of a dish that cannot be separated from a landscape. The technique can be taught anywhere and the dough made anywhere, but the filling is a set of plants that grow on particular mountains in particular weeks. That makes it an unusually rewarding article to write and, since 2023, an unusually hard one.",
      ],
    },
    interestingFacts: [
      "The filling has no fixed list. Accounts of how many kinds of greens go in range from about ten to twenty-six, because the mix follows what is growing.",
      "Nettle is a normal ingredient. It stings when raw and stops once cooked, which is why a plant nobody would eat straight off the stem belongs inside this bread.",
      "By volume there is more filling than dough, and the wrapper is so thin that the greens show dark green through it before it even goes near the heat.",
      "It is cooked on a metal plate over a fire, not against the wall of a tonir, and that is the clearest difference between it and lavash.",
      "Its first written mentions date from the nineteenth century, when Artsakh folklore was being collected. That dates when it was recorded, not when it began.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Wheat flour, water and salt, for an unleavened dough",
        "Mild leafy greens: spinach, chard, beet greens, lettuce and wild cousins",
        "Fragrant herbs: cilantro, dill, parsley, mint, green onion, green garlic",
        "Sorrel and other sour greens",
        "Nettle and other wild greens, in smaller amounts",
        "Oil and salt",
      ],
      preparation:
        "Unleavened dough is rolled very thin and piled with finely chopped greens dressed with oil and salt. The edge is drawn up and sealed, and the parcel is pressed flat again so the filling forms a thin layer inside. It is cooked dry on a hot metal plate over a fire and turned once, until both sides are marked.",
      occasions: [
        "Everyday eating, in the seasons when the greens are up",
        "Made together, with several people chopping and shaping at once",
        "Festivals devoted to the dish",
      ],
      regions: [
        "Artsakh (Nagorno-Karabakh), where it is the region's best-known dish",
        "Syunik, the neighbouring Armenian province",
        "Since 2023, made mainly in Armenia by displaced families",
      ],
      serving:
        "Eaten warm and by hand, on its own, soon after it comes off the heat rather than kept.",
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
      "An Armenian broth of cattle feet, boiled for most of a night and eaten at first light in the cold months. It arrives unfinished, and nobody eats it alone.",
    metaDescription:
      "Khash is an Armenian broth of long-boiled cattle feet eaten on winter mornings: why it belongs to the cold season, how its table works, and what sources support.",
    summary:
      "Khash is a broth made by boiling cattle feet in plain water for most of a night. It is served scalding and unsalted on winter mornings, and each person finishes their own bowl with garlic, salt and crumbled dried lavash. So the dish is really a whole table, not a single plate. Custom ties it to the cold months and the early hours, and every account agrees on one thing first: nobody eats it alone. The two claims most often repeated about khash in English are that it is ancient and unchanged, and that it cures hangovers. The evidence supports those two least.",
    intro:
      "Khash is what happens when the toughest parts of an animal get enough time. Cattle feet are cleaned, soaked in cold water for many hours, then simmered in nothing but water until the broth grows thick with what the feet release and the meat falls off the bone. That takes most of a night, for something eaten at dawn. The broth reaches the table boiling and unseasoned, and everyone finishes their own bowl with garlic, salt and crumbled dried bread. The food itself is that simple. What surrounds it — the season, the hour, the toasts and the company — is what this article is mostly about.",
    author: "Armat Editorial Team",
    updated: "2026-08-24",
    keyFacts: [
      { label: "Kind of dish", value: "A broth of long-boiled cattle feet, served scalding" },
      {
        label: "Season",
        value:
          "The cold half of the year: by custom, the months whose Armenian names contain the letter ր",
      },
      {
        label: "Time of day",
        value: "Early morning, before the usual breakfast and not alongside it",
      },
      {
        label: "In the pot",
        value: "Feet and water, nothing else. The cook adds no salt, because salt darkens the broth",
      },
      {
        label: "At the table",
        value: "Garlic, salt, dried and fresh lavash, radish, fresh greens and pickles, added by each person",
      },
      { label: "Eaten", value: "In company, the one thing every account of the dish agrees on" },
    ],
    sections: [
      {
        id: "what-khash-is",
        heading: "What khash is",
        paragraphs: [
          "Khash is a broth together with the parts of the animal that made it. In Armenia today those parts are cattle feet, boiled until the liquid is dense with everything that has dissolved out of them. Some accounts add the head and the stomach, and Armenian cooks say that in the past lamb was used more often than beef. Every version picks the same kind of cut: parts that are useless cooked quickly and good cooked slowly.",
          "It is not a soup in the usual English sense, and calling it one is the first thing that misleads a reader. Nothing goes into the pot except the feet and water: no vegetables, no stock, no aromatics, not even salt. Nothing is added to thicken it either. The body of the broth comes from the feet alone, which is why this section files it as a meat dish and not among the soups.",
          "The strangest thing about khash comes last, and the rest of this article follows from it. The bowl arrives at the table unfinished on purpose. It is scalding, plain and unseasoned, and the person about to eat it is the one who completes it.",
        ],
      },
      {
        id: "a-dish-made-by-time",
        heading: "A dish made by time",
        paragraphs: [
          "The long cooking is not tradition for its own sake. The ingredient demands it. Feet and shanks are mostly connective tissue, which is made of collagen, and collagen is tough and does not soften in a short cooking. Kept long enough in water just below a rolling boil, it breaks down into gelatin, which dissolves and thickens the liquid. The parts that resist a quick fire are exactly the ones that give a broth its body, once they are given a night.",
          "The hard work happens before the pot. The feet are cleaned of hair and soaked in cold water, changed again and again, for anywhere from ten to forty-eight hours depending on the source. The sources really do disagree. It depends on the animal, the water and the household, and none of the sources consulted here gives a single correct figure.",
          "One detail matters more than any timing, and it shapes the whole table: the cook does not salt the broth. Sedrak Mamulyan, who heads an Armenian association for the preservation of culinary traditions, gives a plain reason: salt darkens it. The Encyclopaedia Iranica gives the same instruction, for the same reason, in its account of a related Persian dish. That detail will matter again later in this article.",
        ],
      },
      {
        id: "the-months-with-an-r",
        heading: "The months with an R",
        paragraphs: [
          "Khash is cold-weather food, and Armenians traditionally put that as a spelling rule: it is eaten in the months whose names contain the letter ր. In Armenian this works out exactly. September through April all have it, and the four warm months — մայիս, հունիս, հուլիս, օգոստոս — do not.",
          "The usual explanation is practical. Khash is heavy and rich, and people are thought to want that in the cold half of the year. Armenian cooks interviewed by the investigative outlet Hetq add that livestock-keeping was concentrated in the mountain districts, where those months really are cold. Whatever you make of the reasoning, the seasonal custom itself is well recorded.",
          "The rule itself, though, cannot be old, and the reason why is more useful than the rule. It depends entirely on the modern Armenian month names, which were borrowed from Latin and brought the r with them. The older Armenian calendar used quite different names — Նավասարդ, Հոռի, Սահմի, Տրե and the rest. Those names do not split into a cold set and a warm set by any letter. They also drifted through the seasons, because that calendar ran three hundred and sixty-five days a year with no correction added. The saying is a handy way to remember a real custom. It is no evidence of the custom's age, and it is not followed strictly now either: restaurants serve khash outside those months.",
        ],
      },
      {
        id: "the-morning-table",
        heading: "The morning table",
        paragraphs: [
          "Nobody doubts that khash is a morning food. Armenian sources describe it eaten early, in place of breakfast and not alongside it, and often at weekends. Accounts written for visitors describe gatherings starting at eight or nine. Every kind of source consulted for this article agrees on the custom.",
          "Why it is eaten in the morning is another matter, and no source consulted gives a firm answer. The most concrete explanation is practical: a dish that needs most of a night is ready by morning. The writer Benjamin Kemper, describing khash for the Smithsonian's folklife programme, notes that a gathering at nine means the cook has to start overnight. The same logic appears independently in Iran, where the related dish is also eaten in the morning and also cooked overnight.",
          "Other explanations circulate: the dish is too heavy for later in the day, it warms up a cold start, it belongs to the morning after an evening of eating and drinking. Each is plausible, and none is documented as the cause. The custom is certain; its origin is not. Offering a confident reason here would mean making one up.",
        ],
      },
      {
        id: "the-bowl-you-finish-yourself",
        heading: "The bowl you finish yourself",
        paragraphs: [
          "Since the pot cannot be seasoned, the table has to be. Round comes the garlic — crushed, often pounded with salt or loosened with a little hot broth — along with salt, radish, fresh greens and pickles. Each person seasons their own bowl to taste, in whatever amounts they like. Photographs rarely show the key point about khash: it is a table rather than a plate, and each diner does something to the dish, not just with it.",
          "Lavash plays two parts at that table, which makes it more than a side dish. Dried lavash is crumbled into the broth until it thickens almost to a porridge, and soft lavash is used to scoop and wrap. Some accounts also describe a sheet laid over the bowl to keep the heat in. Dried lavash exists at all because the bread keeps for months and softens again with a sprinkle of water, as the UNESCO listing for lavash describes. So a winter dish has bread on hand in a form that works like an ingredient.",
          "The garlic is not modest. One account puts it at up to eight cloves a portion, which should be read as an observation, not a rule. Some things here are widely recorded and some are one-offs. Garlic, salt, lavash, radish, greens and pickles come up again and again, in Armenian-language reporting and in writing from cultural institutions alike. Lemon and vinegar belong to one particular modern recipe. One restaurant table is not a national custom, and marking that difference is what this article is for.",
        ],
        links: [{ phrase: "Lavash", slug: "lavash" }],
      },
      {
        id: "never-eaten-alone",
        heading: "Never eaten alone",
        paragraphs: [
          "Every source consulted for this article agrees on one thing first. Rafik Nahapetyan, surveying the Armenian food system for the Historical-Philological Journal in 2019, states it as a plain ethnographic fact: khash, today as in the past, is almost never enjoyed without guests. One of the chefs Hetq interviewed puts it in everyday words. Nobody gathers for khash to stop being hungry, since a bowl of sorrel soup would do that; people gather to sit down together.",
          "The gathering has a customary shape. Hetq records three toasts in order: a greeting, then one to whoever cooked, then a wish that the khash turns out well. Kemper gives the sequence as the day, the cooks and the guests, and one of the Hetq chefs objects that fixing a number at all misses the point. Some modern accounts describe vodka or fruit spirit as part of these adult gatherings. This article records that only as a documented custom, and it is neither required by the dish nor recommended here. The gathering has also been strongly gendered. It was historically a male occasion, and the ethnographer Ruzanna Tsaturyan has said that women's khash parties, hard to imagine a decade before she spoke, are now unremarkable.",
          "What the table means has changed with the times around it. The cultural scholar Hrach Bayadyan, also speaking to Hetq, describes how khash took on a quiet edge among the Soviet-era intelligentsia. It was an occasion outside the state's calendar of organised public events, a morning spent deliberately not working, and in that sense a mild form of refusal. The city most attached to the dish makes the same point from another angle. Gyumri claims to love khash more than anywhere else in Armenia, and Mamulyan reports that the custom of eating it the morning after a wedding has survived there in particular.",
        ],
        links: [{ phrase: "Gyumri", slug: "gyumri" }],
      },
      {
        id: "what-the-record-can-say",
        heading: "What the record can say",
        paragraphs: [
          "The word itself tells us less than it seems to. Khash is the Armenian verb meaning to boil, used as a noun, and the same root gives khashlama, which is a different dish altogether. So the dish is named after its method. That is a fact about naming, not about age. This article does not try to date the word, because the Armenian dictionaries that could do so properly were not available to consult.",
          "A list of medieval authorities appears in nearly every English-language account: Grigor Magistros in the eleventh century, Mkhitar Heratsi in the twelfth, Yesayi Nchetsi in the thirteenth, with the dish under an older form of its name. Heratsi's medical encyclopedia of 1184 is a real and much-studied work, and secondary writing reports that it describes khash as having healing properties. None of those texts was consulted here. The attributions pass from one popular account to the next with no passage quoted. And even taken at face value, a medieval physician recommending a boiled preparation does not show that today's dish and today's table descend from it. The claim is reported here as a claim, and that is as far as this article can honestly take it.",
          "The ethnographic record points somewhere less expected. Tsaturyan reports that the few historical references that exist describe khash as a wedding food, the same link that survives in Gyumri. Nahapetyan places it among a small group of ritual dishes: Harissa dedicated to the grain harvest, milk soup to plentiful dairy, khash to success with livestock. That grouping is reconstructed from later practice, not from a dated record, and should be read that way. One official fact is also worth noting. Khash is not on Armenia's national inventory of intangible cultural heritage, though lavash, gata, matsun, tolma, winemaking and fruit-spirit distilling all are.",
        ],
        links: [{ phrase: "Harissa", slug: "harissa" }],
      },
      {
        id: "the-story-about-poor-peoples-food",
        heading: "The story about poor people's food",
        paragraphs: [
          "One story about the origin of khash is repeated more than any other. Khash, it says, was the food of the poor. The good cuts went to the wealthy, the feet and offal were thrown out or handed down, and the people who got them made something remarkable out of what nobody else wanted.",
          "Its mirror image circulates too: a king tastes the villagers' dish, likes it and makes it fashionable. When two stories explain the same thing in opposite directions, both are usually just stories. Mamulyan rejects the class account outright, arguing that foods in the past were not clearly tied to one social group. His colleague Grisha Antinyan does not rule it out, but compares it to what people say about the origins of pizza. In effect, he recognises it as a familiar kind of folk tale, not documented history.",
          "What survives a closer look is smaller and duller than the story. A household that has slaughtered an animal uses all of it. That is ordinary practice, needs no explanation in terms of class, and is well recorded as plain economic sense. Nothing consulted for this article establishes khash as documented social history of the poor. And the earliest link the ethnographic record actually offers, a wedding, is hardly an ordinary weekday in a poor household.",
        ],
      },
      {
        id: "a-dish-with-relatives",
        heading: "A dish with relatives",
        paragraphs: [
          "Boiled head-and-trotter dishes are made across a wide region, sometimes under the same word and sometimes not: khashi in Georgia, xaş in Azerbaijan, pacha and kalla-pāča in Iran, kelle paça in Turkey, and relatives further afield in the Balkans and Central Asia. Armenian khash belongs to that family, and describing it does not require deciding who had it first.",
          "Comparing them is more useful than any claim of ownership, because the practices match so closely. The Encyclopaedia Iranica's entry on kalla-pāča describes a sheep's head and trotters cooked over low heat, usually overnight. The dish is kept for the colder days of the year and served in the morning. It is salted only at the end, because salt blackens the meat. It is made in specialist shops with their own guild, not at home, and a nineteenth-century account has it served with vinegar, onion or crushed garlic. Almost every basic feature of the Armenian practice appears there, in a tradition that arrived at it separately.",
          "That overlap is best read as evidence about the food rather than about influence. A dish that takes a night is ready in the morning. A heavy, gelatinous broth suits cold weather. A pot that cannot be salted leaves the seasoning to the table. A dish that is hard to make at home becomes a reason to gather. The most interesting difference is in the names. Persian names the parts, head and trotter; Armenian names the method. Two traditions describe the same dish by different halves of it, and neither this article nor its sources needs to turn that into a competition.",
        ],
      },
      {
        id: "the-hangover-reputation",
        heading: "The hangover reputation",
        paragraphs: [
          "In English, khash usually comes with one claim attached. Headlines call it a hangover cure, and anyone who searches for the dish meets that label before they meet the dish. It is the most repeated thing said about khash outside Armenia.",
          "Where it comes from is no mystery. Khash is eaten in the morning, in company, and Armenian descriptions note that it often follows a festive evening. A food eaten the morning after picks up a reputation as a remedy for the morning after. Once that link exists, food writers repeat it because it makes a good line.",
          "What matters is what kind of claim it is. It is a popular belief and a line of modern food writing: a social association rather than a medical conclusion. Nothing consulted for this article shows any therapeutic effect, and this article makes no claim about one. It is covered here because most English-language pages lead with it, and readers coming from those pages deserve to know the difference.",
        ],
      },
    ],
    importantDates: [
      {
        year: "1184",
        event:
          "Mkhitar Heratsi completes his medical encyclopedia, the work later accounts most often cite when they date khash to the Middle Ages. The text itself was not consulted for this article.",
      },
      {
        year: "2012",
        event:
          "Khash becomes the subject of peer-reviewed anthropology, studied as a male gathering and a national story rather than as a recipe.",
      },
      {
        year: "2019",
        event:
          "Rafik Nahapetyan's survey of the Armenian food system places khash among the ritual dishes tied to livestock-keeping, and notes that it is still almost never eaten without guests.",
      },
    ],
    significance: {
      heading: "Why khash matters",
      paragraphs: [
        "Khash is the second meat dish in this section, and the first that is far more interesting as a custom than as a recipe. The recipe is two lines long and has one ingredient. Everything else worth knowing is the season, the hour, the table and the company. That makes it an unusually good subject for an archive that treats food as culture, not instruction.",
        "It is also the clearest case so far of a dish whose popular history and documented history do not match. The two things said about it most often in English are the two the evidence supports least. Most of this article's work is separating them from what named scholars actually say.",
      ],
    },
    interestingFacts: [
      "The rule that khash belongs to the months with an r works in Armenian only because Armenian borrowed its month names from Latin, r and all. With the older Armenian month names it would not work at all.",
      "The cook never salts the broth, because salt darkens it. In Iran, an entirely separate tradition gives the same instruction for a related dish, for the same reason.",
      "Dried lavash is crumbled into the bowl until the broth thickens. That only works because lavash keeps for months and softens again with water.",
      "The name is simply the verb to boil used as a noun. The same root gives khashlama, a different dish that should not be confused with this one.",
      "Khash is not on Armenia's national inventory of intangible cultural heritage, although lavash, gata, matsun, tolma and fruit-spirit distilling are.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Cattle feet (trotters), the defining part",
        "The head and the stomach, in some accounts and some households",
        "Water, and nothing else in the pot",
        "Garlic, crushed and often pounded with salt, added at the table",
        "Dried and soft lavash, radish, fresh greens and pickles",
        "Salt, which each person adds to their own bowl",
      ],
      preparation:
        "The feet are cleaned and soaked in cold water, changed again and again over many hours. They are then simmered in plain, unsalted water for most of a night, until the collagen breaks down and the broth has body. It is served scalding and unseasoned, and each person finishes it at the table.",
      occasions: [
        "Winter mornings, and weekend mornings in particular",
        "Gatherings of family, friends and neighbours, with customary toasts",
        "In Gyumri, the morning after a wedding",
      ],
      regions: [
        "Throughout Armenia, as a cold-season custom rather than a regional dish",
        "Gyumri and Shirak, where people are most attached to it",
        "Part of a wider regional family of boiled head-and-trotter dishes",
      ],
      serving:
        "Served boiling and unsalted in a deep bowl. Garlic, salt and the accompaniments are passed round so that each person can season and thicken their own portion.",
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
      "Milk set thick by its own bacteria, eaten every day and turned into half the rest of the cooking. This is Armat Cuisine's first article about an ingredient rather than a dish.",
    metaDescription:
      "Matsun, Armenia's fermented milk: how bacteria set it, how a starter passes from batch to batch, what it becomes, and what the sources actually support.",
    summary:
      "Matsun is milk fermented by lactic-acid bacteria until it sets into a thick, sour food eaten with a spoon. People eat it plain and with bread, and much other cooking is built on it: it is thinned into a drink, cooked into soup, drained and salted to keep, or dried into hard sour balls that last for years. A little of each batch starts the next, so traditional matsun carries a local population of microbes rather than a bought culture. Armenian matsun and Georgian matsoni are one food under two names, and microbiologists from both countries have studied them together. The word is native Armenian and old. How far back the food goes in its present form is a separate question the evidence does not settle.",
    intro:
      "Matsun is what milk becomes when the right bacteria are left to work on it. They turn the milk's sugar into acid, the acid unsettles the protein, and the whole pot sets into something thick, sour and spoonable that keeps far longer than milk. That is the whole transformation. Armenian households have kept it going for a very long time by the simplest method there is: saving a spoonful of yesterday's batch to start tomorrow's. This is the first article in this section about a basic food rather than a finished dish. Matsun is eaten on its own, and a great deal of other Armenian cooking is made from it.",
    author: "Armat Editorial Team",
    updated: "2026-08-25",
    keyFacts: [
      { label: "Kind of food", value: "Fermented milk, set thick: a dairy food, not a prepared dish" },
      { label: "Made from", value: "Cow's milk usually; also sheep, goat, buffalo, or mixtures" },
      {
        label: "What sets it",
        value: "Lactic-acid bacteria, mainly Lactobacillus and Streptococcus, with yeasts also present",
      },
      {
        label: "Started by",
        value: "A little of the previous batch, which carries a local population of microbes forward",
      },
      {
        label: "Kept as",
        value: "Fresh; drained and salted as kamats matsun; or dried into chortan, which lasts for years",
      },
      {
        label: "Recognised by",
        value: "Armenia's national inventory of intangible cultural heritage, not a UNESCO list",
      },
    ],
    sections: [
      {
        id: "what-matsun-is",
        heading: "What matsun is",
        paragraphs: [
          "Matsun is milk that has been fermented until it sets. It is white, distinctly sour and thick enough to hold the shape of a spoon. People eat it cold, on its own or with bread, and cook with it in a great many other dishes. Cow's milk is the usual base in Armenia today, but sheep, goat and buffalo milk are all used, as are mixtures of them.",
          "The nearest English word is yogurt, and this article uses it as a comparison, not an equation. Matsun is a fermented milk from the same family, and anyone looking for it under the word yogurt should find it. But the two are not interchangeable names for one standard product. Industrial yogurt is made with a set pair of bacteria at a controlled temperature. Traditional matsun is made with whatever microbes the household's own starter carries, at whatever warmth a cosy corner provides.",
          "That difference is why this is the section's first article about a basic food rather than a prepared dish. Everything else here is something a cook makes and serves. Matsun is something a cook keeps, and then makes other things from.",
        ],
      },
      {
        id: "milk-turned-by-bacteria",
        heading: "Milk turned by bacteria",
        paragraphs: [
          "The chemistry is simple and worth explaining properly. Milk contains a sugar called lactose. Lactic-acid bacteria feed on it and give off lactic acid, and as the acid builds up the milk's pH falls. The main milk protein, casein, normally floats in stable clusters. As the acidity rises, the clusters lose that stability and link into a continuous network that traps the water. Nothing has been added to thicken the milk. It has set, where it stands, into a gel.",
          "The acid does a second job at the same time. It makes the food hostile to most of the organisms that would otherwise spoil milk, so fermented milk keeps for days where fresh milk keeps for hours. In a household without a fridge, that is not a happy side effect. It is the whole point.",
          "Scientists have measured what actually lives in it. A survey published in 2015 in the journal Food Microbiology sequenced the bacteria and fungi in matsun and matsoni from across Armenia and Georgia. The bacteria were dominated by Lactobacillus and Streptococcus species. The survey also found yeasts, among them Kluyveromyces marxianus, Candida famata and Saccharomyces cerevisiae, and these varied sharply from place to place. A traditional fermented milk is a small ecosystem, not a two-strain recipe, and this article makes no claim at all about what that ecosystem does to the person who eats it.",
        ],
      },
      {
        id: "the-starter-and-the-chain",
        heading: "The starter and the chain",
        paragraphs: [
          "The usual way to make matsun is to add a little of the last batch to fresh milk. That is all a starter is: a living population moved from a finished pot into a new one, where it does the same work again. Nothing is bought and nothing is measured out, and the chain can run for as long as someone remembers to save a portion.",
          "The same survey shows that this really happens, and is not just a pleasing story about continuity. It found that both the region and the type of milk shaped the microbial community, and concluded that traditional production passes a distinctive regional population from batch to batch. A bought starter would wipe out that pattern. A starter kept going in home kitchens is what creates it.",
          "Other ways of starting a batch are recorded, and one of them should be attributed rather than generalised. The Slow Food Foundation's description of the practice in Lori records a preparation called meran, made from dried cornelian cherries with wheat and rye, along with a rennet step. That is one account of one local practice, and it is reported here as such. The common mistake with foods like this is to treat a single description of a household process as the timeless national method. What is widely recorded is the starter saved from the last batch; the variations around it differ from place to place.",
        ],
      },
      {
        id: "the-word-and-the-food",
        heading: "The word and the food",
        paragraphs: [
          "Hrachia Acharian's Armenian etymological dictionary lists մածուն under the root մած-, meaning to stick, to cling, to thicken, and, of milk, to curdle. The same root gives the verbs for curdling milk and setting cheese, and the adjective for anything thick and sticky. Acharian classes it as a native Armenian word, from an Indo-European root meaning to knead or to work into a sticky mass, with relatives in Slavic, Greek and Germanic. The English word make belongs to the same family.",
          "He then makes a point this article borrows, because it cuts through a great deal of noise. Beside matsun he sets Persian māsīdan, to curdle, next to māst; Turkish yoğurmak, to knead, next to yoghurt; and French cailler, to curdle, next to lait caillé. Several unrelated languages each named their fermented milk after the verb for what happens to it. That pattern tells us how people name foods. It says nothing about who made one first.",
          "That is the distinction to hold on to. The word is old, and it is Armenian. Acharian records մածուն in the classical texts he cites, which shows the term was in written Armenian. It does not show that the food those texts meant was identical to what a Yerevan shop sells today, and no source consulted for this article closes that gap.",
        ],
      },
      {
        id: "what-the-record-actually-says",
        heading: "What the record actually says",
        paragraphs: [
          "One sentence turns up on nearly every English page about matsun: that it is mentioned in many tales by Armenian writers from the eleventh century onward. It is worth tracing that claim back, because what you find at the end is not what the sentence describes.",
          "The eleventh-century figure is Grigor Magistros, and the work is his treatise on grammar. What he offers there is an etymology, a scholar's note on where the word comes from, which reached modern discussion through a language study published early in the twentieth century. A grammarian explaining a word is real evidence that the word existed and was familiar enough to explain. It is not a tale. It does not describe the food, and it cannot support any claim about how matsun was made or eaten.",
          "So the accurate statement is narrower than the popular one, and more useful. Matsun is named in Armenian writing from the medieval period, and its name is native and older still. The evidence available here goes no further, and this article does not pretend otherwise. Claims that matsun is thousands of years old, or the oldest cultured milk anywhere, are not supported by anything consulted for this page. The most confident versions tend to appear on pages that are selling something.",
        ],
      },
      {
        id: "matsun-and-matsoni",
        heading: "Matsun and matsoni",
        paragraphs: [
          "Armenians call it matsun and Georgians call it matsoni, and the food is the same food. Both names come from the same root, and both traditions set milk with a starter carried forward from the last batch. The products differ the way two households' bread differs, not the way two separate dishes do.",
          "Science has treated it that way. The 2015 survey described above used samples from both countries, its team included Armenian and Georgian researchers, and its title calls matsoni a transnational fermented milk. Its finding, that the microbial community follows region and milk rather than the border, is the most concrete thing anyone can say about the relationship. And it came from people of both traditions working on the question together.",
          "There is also a dispute, and it should be kept apart from the history. In 2012 Georgia registered matsoni as a protected geographical indication, and a disagreement followed over the naming and transit of Armenian matsun. That is a modern argument about trade names and markets. It is not evidence about who fermented milk first, and should not be read as such. This article takes no position on the question of origin, because the sources consulted do not answer it and nothing about the food needs it answered.",
        ],
      },
      {
        id: "an-everyday-food",
        heading: "An everyday food",
        paragraphs: [
          "Matsun is not festival food. The Slow Food Foundation, describing the tradition as it survives especially in the northern province of Lori, calls it part of the daily diet. That phrase says a lot: this is a food that turns up at ordinary meals, again and again, rather than one brought out for an occasion.",
          "It is eaten plain, with or without bread, and served beside salads and soups. In a whole family of dishes it is also a building block, not just a side. The Armenian repertoire includes preparations built on it, and it turns up in fillings and mixtures where its sourness does the seasoning.",
          "That is why it gets an article of its own. A section that described only finished dishes would keep meeting matsun as a line in other dishes' ingredient lists and never explain it. Most Armenian home cooking assumes there is matsun in the house, the way a great deal of cooking elsewhere assumes there is butter.",
        ],
      },
      {
        id: "what-matsun-becomes",
        heading: "What matsun becomes",
        paragraphs: [
          "Thinned with water and salted, it becomes a cold drink, the everyday summer counterpart to the way matsun is eaten in winter. That drink has its own name and deserves its own article one day. It has none here yet, so this article simply notes the connection without pretending to cover it.",
          "Cooked, it becomes soup. Spas is the clearest case in this section: a soup whose body and sourness both come from fermented milk, stabilised so it can be heated without splitting. That article deliberately left the bigger matsun story to be told elsewhere, and this is where it is told. The two are meant to be read together.",
          "Drained and salted, it keeps. The strained form is called kamats matsun and was stored in clay or leather for months. Dried further into hard balls, it becomes chortan, which lasts for years and is brought back with water when needed. A herding household with no cold store could carry the summer's milk into winter this way. That chain of keeping — fresh, drained, dried — is the practical reason fermented milk sits at the centre of the food system and not at its edge.",
        ],
        links: [{ phrase: "Spas is the clearest case", slug: "spas" }],
      },
      {
        id: "households-and-factories",
        heading: "Households and factories",
        paragraphs: [
          "Today matsun is made in both places. In Armenia it is an ordinary supermarket product, made industrially with defined cultures and sold in tubs. It is also still made at home from a starter that came from a previous batch, which came from the batch before that.",
          "The difference between the two is exactly what the microbiology found. An industrial culture is chosen, consistent and reproducible, which is what a product sold at scale needs. A household chain is none of those things, and that is why it carries a regional signature at all. Neither is a corrupted version of the other. They are two ways of making the same food reliably, each aiming at a different kind of reliability.",
          "The tradition has also travelled. In 1929 Sarkis and Rose Colombosian, Armenian immigrants in Andover, Massachusetts, began selling their home-made matsun locally, and their wagon carried the Armenian word. The business grew, and along the way the name on the container was changed to yogurt, the word American shoppers recognised. It became one of the first yogurts sold commercially in the United States. The food crossed an ocean intact, but its name did not survive the trip. It is a neat illustration of why this article does not treat the two words as equivalents.",
        ],
      },
      {
        id: "named-on-a-national-list",
        heading: "Named on a national list",
        paragraphs: [
          "Armenia keeps a national inventory of intangible cultural heritage, and matsun is on it. The entry is the tradition of the preparation and use of matsun, filed under national cuisine. It is a real, dated, official recognition by the state, of the practice rather than the product.",
          "It is worth being precise about what that listing is not. The national inventory is not the UNESCO Representative List; the two are separate systems with separate procedures. Of Armenia's inscriptions on the UNESCO list, the only food is lavash. Matsun does not appear there, and any page that calls it UNESCO heritage has confused a national listing with an international one.",
          "This matters more than pedantry usually does, because claims like this tend to grow as they are repeated. The national listing deserves to be stated plainly and accurately, and it is a stronger fact without the inflation: a state has formally recognised that making and using matsun is part of its living culture. That is a different and more interesting claim than a badge.",
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
          "Georgia registers matsoni as a protected geographical indication, starting a modern dispute over naming, not over history.",
      },
      {
        year: "2015",
        event:
          "A survey in Food Microbiology sequences matsun and matsoni from across Armenia and Georgia, and finds that the microbial community follows region and milk type, not the border.",
      },
    ],
    significance: {
      heading: "Why matsun matters",
      paragraphs: [
        "This is the section's first article about something that is not a dish, and it is the reason the section needed a dairy category rather than somewhere to file an awkward entry. Matsun is a food, an ingredient, a way of preserving milk and the base for a drink, all at once. Describing Armenian cooking without it means describing a great many dishes only on the surface.",
        "It is also an unusually clear case of evidence doing better than assertion. The claims that circulate about matsun concern age and ownership. What can actually be established is a native word with a documented root, a measured microbial community that ignores the border, and a state inventory entry that is often mistaken for the international list it is not. Each of those is more interesting than the claim it replaces.",
      ],
    },
    interestingFacts: [
      "Nothing is added to thicken matsun. The acid the bacteria produce unsettles the milk protein, and the whole pot sets where it stands into a gel.",
      "Acharian sets matsun beside Persian māst, Turkish yoghurt and French lait caillé. Several unrelated languages each named their fermented milk after the verb for curdling, which says something about naming, not about origin.",
      "Sequencing found that the microbes in matsun and matsoni follow region and milk type, not the Armenian-Georgian border, in a study by researchers from both countries.",
      "Dried into hard balls as chortan, matsun keeps for years and is brought back with water. That is how a herding household carried summer milk into winter.",
      "The Armenian-run creamery that introduced yogurt to the United States started out selling matsun under its Armenian name, and changed the word, not the food.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Milk: usually cow's, also sheep, goat, buffalo or mixtures",
        "A little of the previous batch, as the starter",
        "Lactic-acid bacteria, mainly Lactobacillus and Streptococcus, with yeasts present",
        "Salt, for the drained and dried forms made for keeping",
      ],
      preparation:
        "Milk is warmed, a little of the previous batch is stirred in, and the pot is left covered and warm until the bacteria have made it acidic enough for the protein to set. It is then cooled. This article gives no quantities or timings, because it explains what matsun is rather than teaching unsupervised fermentation.",
      occasions: [
        "Everyday meals rather than festivals",
        "Eaten plain or with bread, beside salads and soups",
        "As the base of soups, drinks, fillings and mixtures",
      ],
      regions: [
        "Throughout Armenia, as an ordinary household and commercial product",
        "Lori, where the traditional practice is especially well documented",
        "Shared with Georgia, where the same food is called matsoni",
      ],
      serving:
        "Served cold and plain, thinned and salted as a drink, or cooked into soup. The drained and dried forms are softened with water before use.",
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
      "Beef salted, pressed, air-dried and sealed under a paste of fenugreek and garlic. The first article in this section about keeping meat rather than cooking it.",
    metaDescription:
      "Basturma, Armenia's air-dried cured beef in its fenugreek coat: how curing works, what chaman is, where the names come from, and what history can really show.",
    summary:
      "Basturma is a whole cut of beef preserved with salt, pressure and moving air, then sealed under a thick paste of fenugreek, garlic and pepper called chaman. It is sliced so thin you can almost see through it. Armenians eat it cold as an appetiser, with bread and with eggs, at everyday breakfasts and festive tables alike. Armenian also has an older native word for salted dried meat, apukht, but it names something broader than the modern coated product and should not be read as basturma's birth certificate. Basturma belongs to a wide regional family of cured meats. What history shows about the Armenian share is a documented craft specialism and an unbroken line of makers into the diaspora, not proof of who invented it.",
    intro:
      "Basturma is what happens to beef when you give it salt, weight, air and time instead of heat. A whole muscle is packed in salt until it gives up much of its water, then pressed under weight until it gives up more. It is hung in moving air until it is firm all the way through, and finally coated in a wet paste of ground fenugreek, garlic and red pepper that dries to a dark crust. Nothing is cooked and nothing is smoked. The result is dense, deep red, intensely savoury, and cut so thin that light shines through it. This is the section's first article about preserving food rather than cooking it: about keeping meat in a country with hot summers, cold winters and no refrigeration, and about the particular Armenian answer.",
    author: "Armat Editorial Team",
    updated: "2026-08-26",
    keyFacts: [
      { label: "Kind of food", value: "A whole cut of beef, cured and air-dried — not a sausage and not cooked" },
      { label: "Made from", value: "Lean whole muscle: beef today, though older practice also used sheep" },
      { label: "Preserved by", value: "Salt, pressing and moving air — no heat, no smoke" },
      {
        label: "Coated with",
        value: "Chaman, a wet paste of ground fenugreek with garlic and red pepper",
      },
      { label: "Served", value: "Sliced almost see-through thin and eaten cold as meze, or with eggs and bread" },
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
          "Basturma is a single piece of lean meat preserved whole. That sets it apart from most of what English speakers call cured meat: it is not ground, not stuffed into a casing and not fermented into a sausage. One muscle goes in and one muscle comes out, smaller, darker and much firmer than it started. Today it is made from beef, usually from the loin or the leg, and sold either as a whole dried piece or ready-sliced.",
          "Four things happen to it, and the order matters more than the amounts. First it is salted until much of its water has been drawn out. Then it is pressed under weight, which squeezes out more and flattens the meat into the shape the finished piece keeps. Next it is hung in moving air until it has dried all the way through, not just on the surface. Finally it is coated in chaman, a wet spice paste that dries into a crust and stays on the meat as part of the food.",
          "It helps to sort out early what is fixed and what varies, because regional versions differ and each maker tends to treat the others' differences as mistakes. Salting, drying and a fenugreek-based coating are constant wherever basturma is made. The cut, the exact paste, the drying time and the amount of pressing all vary by producer, household and country. No single version is the authentic one that the others fall short of.",
        ],
      },
      {
        id: "salt-pressure-and-air",
        heading: "Meat kept by salt, pressure and air",
        paragraphs: [
          "The principle is the same one behind every dried food, and it is really about water, not salt. Bacteria, moulds and the meat's own enzymes all need liquid water to work. Food scientists measure not how much water a food contains but how much of it is free for that work, a figure called water activity. As it falls, the organisms that spoil meat and the ones that make people ill shut down one after another. Most spoilage bacteria stop well before a food feels dry to the touch, and the more dangerous ones stop at lower levels still.",
          "Salt and drying attack that water from two sides. Salt on the surface of the meat creates a steep difference in concentration across the cell membranes, and water moves outward to even it out, so the meat sheds liquid before the air has done anything. Pressing squeezes out more of that freed liquid. Then hanging does the slow part: air moving across a large flat surface carries moisture away steadily, so the inside dries before the outside spoils. The flat pressed shape is not for looks. It gives the piece enough surface for its thickness to dry evenly.",
          "This article explains that process; it does not teach it. With whole meat cured without refrigeration, the line between a good result and a dangerous one depends on conditions you cannot judge by eye, so no salt proportions, drying times, temperatures or humidity figures appear anywhere on this page. Traditional curing does not sterilise meat, and the line you sometimes hear — that salt kills everything — is not what the science says. Salt and drying make conditions steadily more hostile to growth, which is a more limited claim, and one that depends on circumstances.",
        ],
      },
      {
        id: "chaman-and-the-coating",
        heading: "Chaman, and what the word covers",
        paragraphs: [
          "The dark red-brown crust is what most people picture when they think of basturma. Its Armenian name is chaman (չաման), written chemen or chaiman in English, and it matches Turkish çemen. The word needs care because it has two meanings. In Armenian it names ground fenugreek itself, and it also names the wet paste made from it. A page headed chaman may be about the spice or about the coating, and it does not always say which.",
          "The paste is led by fenugreek and heavy on garlic, with red pepper (paprika, or something hotter) giving most of the colour. Beyond that, published versions differ. Many include cumin and some do not, and the proportions vary so widely that no single mixture can be called the standard. What stays the same is the dominance of fenugreek. That is why basturma's smell is unmistakable and why it lingers: powerful, faintly bitter, and hard to get off your hands or out of a room.",
          "The coating does more than add flavour. A dense paste seals the surface of the dried muscle and protects it while the piece finishes drying and afterwards. In Armenian kitchen practice, fenugreek in particular is said to keep insects away from food hung in the open air. A thinned version of the same paste, chamanichur, is used as a sauce in its own right, a small sign that Armenian cooks treat chaman as an ingredient and not only as a wrapper.",
        ],
      },
      {
        id: "the-names-basturma-and-pastirma",
        heading: "Basturma, pastirma, and what a name proves",
        paragraphs: [
          "The word came into Armenian from outside. Western Armenian basturma and Eastern Armenian bastoorma are loanwords from Turkish pastırma, a noun formed from the verb bastırmak, to press. The name comes from the weight on the meat, not the spice on it. Turkish spread the word widely: it lies behind Greek pastourmas, Bulgarian and Balkan pastarma, Arabic basterma, and the spellings bastourma, basterma and pasturma that English has never chosen between.",
          "Beneath the Turkish layer lies an older one, and it is truly disputed. The Oxford Encyclopedia of Food and Drink says the Ottomans applied the word to a Byzantine cured beef called paston, and the Oxford Companion to Food describes a Byzantine dried-meat delicacy as a forerunner of modern pastirma. Serious reference works hold that view. But Byzantine scholars do not agree on what the Greek terms meant. Johannes Koder reads paston as salted meat or salted fish and akropaston as salted meat; Andrew Dalby reads paston as salted fish; Gregory Nagy reads akropaston as smoked. Three specialists, three readings of the same words.",
          "Just as important is what none of this proves. A name can travel without the technique, and a technique can travel without its name. Neighbours who trade borrow both, in either order, again and again. Armenians today mostly use a Turkish loanword for this food, but that tells us about language contact in Anatolia, not about who first hung salted beef in the wind. People online argue both ways that the spelling settles ownership, and the argument is just as weak in either direction.",
        ],
      },
      {
        id: "apukht-and-the-older-word",
        heading: "Apukht, the older Armenian word",
        paragraphs: [
          "Armenian has its own word for this kind of food, much older than the loanword. Apukht (ապուխտ) is Classical Armenian. The philologist Vartan Matiossian, following standard etymological scholarship, traces it to Pahlavi apuxt, meaning uncooked (from a-, un-, and puxta, cooked). So it is an Iranian borrowing, not a Turkic one, and it entered Armenian long before Turkish was spoken in Anatolia. It appears in the fifth-century Armenian translation of the Bible, where it means salted and dried meat.",
          "The word spread outward from Armenian, not the other way round. Armenian lent it to Georgian as apukhti and, through the dialect of the Armenians of Poland, to Polish as abucht. Within Armenian it formed compounds, such as khozapukht, literally pig-apukht, for ham. Armenian dictionaries define apukht as flat strips of meat from cattle or sheep, salted, beaten and dried in the open air without cooking, and eaten raw. The apukht of Erzurum is singled out as especially well known. The word is still used in modern Armenian alongside բաստուրմա, often in the same sentence.",
          "This brings us to the most important distinction in the article. In the dictionary, apukht means salted, beaten, air-dried raw meat. It is a category that takes in sheep as readily as cattle, and its definition says nothing at all about a spice crust. Modern basturma is one member of that category, set apart by exactly the thing the definition leaves out. So the fifth-century Bible reference is real and valuable: it shows that Armenians had a word for salted dried meat in late antiquity. It does not establish the fenugreek-coated product, and pages that give the fifth-century date under the heading basturma have quietly swapped a category for one of its members.",
        ],
      },
      {
        id: "what-the-early-evidence-establishes",
        heading: "What early history can and cannot show",
        paragraphs: [
          "One dating claim spreads further than any other: that basturma is first recorded between 95 and 45 BC, under Tigranes the Great, and that the technique was developed to preserve meat traded from Armenia to China and India. Tourism pages and food sites repeat it, but it falls apart when you trace it back. No source is ever named for it. It even gets the reign wrong: Tigranes II ruled from 95 to 55 BC. The trail leads to recipe blogs, not to any text, inscription or scholarly study. There is no first-century-BC record of this food, and the confident date is best seen as a product of repetition.",
          "The second story is about saddles. Horsemen, it goes, packed salted meat under the saddle, where the horse's weight pressed it and the ride dried it, so the food was ready on arrival. It is a good story, and a revealing one. Armenian pages tell it about Armenian traders and horsemen; Turkish pages tell it about Turkic warriors and nomads, with the same details and the same lack of a source. A legend that changes owner depending on who tells it is folklore about the food rather than evidence about it. This article records it as folklore and does not present it as evidence.",
          "Put the three lines of evidence side by side and the answer is plural. There is an old Armenian word for salted dried meat, borrowed from Iranian. There is a Byzantine vocabulary for salted meat or fish whose meaning specialists dispute. And there is an Ottoman Turkish word for pressing that spread across the whole region and is now what almost everyone says. All three are real. But they do not link up into a chain in which one turns into the next and ends at the modern product, and the sources consulted for this article give no grounds for drawing one.",
        ],
      },
      {
        id: "kayseri-and-the-craft",
        heading: "Kayseri: a craft, not an origin",
        paragraphs: [
          "One place is tied to this food more firmly than any other. Kayseri, the Caesarea of Cappadocia, was the recognised centre of pastirma production, and that reputation is old enough to quote. The seventeenth-century Ottoman traveller Evliya Çelebi, in his Seyahatname, describes the town's cumin-flavoured beef pastirma as found nowhere else and sent to Istanbul as a gift. That is a dated observation by a named outside writer, stronger evidence than most of what surrounds this subject.",
          "We also know who made it there. The trade in Kayseri was overwhelmingly in Armenian hands. By the nineteenth century, accounts describe Armenians as effectively dominating its manufacture and sale, while Greeks and Turks in the town made and ate it at home. The historian Philip Mansel notes Armenians selling pastirma in Istanbul from the seventeenth century on. The best-known survivor of that world is a business, not a legend: Krikor Apikoğlu founded a pastirma house in Kayseri in 1910 and moved production to Istanbul in 1920, and the firm went on to become the first nationwide meat company of the Turkish republic.",
          "What this evidence supports is a specialism, and that is the key difference from an origin claim. Armenians were the acknowledged masters of the craft in the town most famous for it, for long enough that a foreign consulate noted it in passing. That is a strong, documented historical fact. It is not the same as inventing the food, and it does not require that anyone did. The better way to put it is that Kayseri became especially famous for basturma, and Armenians became especially famous for making it there.",
        ],
      },
      {
        id: "after-1915-the-craft-travels",
        heading: "A craft carried out of Anatolia",
        paragraphs: [
          "The Armenian population of Kayseri and the surrounding provinces was destroyed or driven out during the genocide of 1915 and the years around it. Among the many things that uprooting moved was this trade. Survivors who reached Aleppo, Beirut, Cairo, Athens and Thessaloniki brought the craft with them, and basturma became a fixture of the Armenian quarters in each city. The people were displaced, but the knowledge was portable, carried by families who had practised it as a business.",
          "That is why basturma is not only a food of the Republic of Armenia. It is a diaspora food in the strict sense: its modern map was drawn by where Armenians ended up. Later migrations carried it further west, to France and the United States, and the shops that opened there clearly descend from the Anatolian trade rather than starting from scratch. The Smithsonian Center for Folklife and Cultural Heritage has documented one of them, a basturma shop in the Little Armenia neighbourhood of Los Angeles. Its owner learned the work from family makers in Armenia and Lebanon, a two-step route that tells the whole history in miniature.",
          "This is the part of the story Armat can tell most precisely and with the least guesswork, because the handing-down is recent, documented and still visible. A cured meat that needs weeks of attention, and a tolerance for the smell of fenugreek in the building, is not something communities keep by accident. Families kept it on purpose, in kitchens and shops, as both a livelihood and a piece of the place they had lost. That continuity says more about what basturma means to Armenians than any claim about the first century BC.",
        ],
      },
      {
        id: "how-basturma-is-eaten",
        heading: "How basturma is eaten",
        paragraphs: [
          "It is cut thin, thin enough to see light through, and eaten cold. That is the default, and it is not just presentation. The meat is dense, salty and strongly spiced, and a thick slice is unpleasant in a way a thin one is not. Sliced like this it goes on a meze table among other cold dishes, gets folded into bread, and fills sandwiches in every diaspora city where it is sold.",
          "The best-known cooked use is with eggs. Slices are warmed in a pan and eggs are broken over them, so the fat and spice from the crust flavour the whole dish. It is a standard Armenian breakfast, and one of the few ways basturma is heated at all. Still, it is one common use, not the definition of the product, a trap English-language pages often fall into.",
          "The bread that goes with it is normally lavash, which this section has already described from the bread's side: a thin, foldable bread does for a strongly flavoured meat exactly what it does for cheese and greens. The contrast with the section's other beef article is worth drawing too, because the two are opposite ways of dealing with the same animal. Khorovats applies fire, quickly, and is eaten the day it is made. Basturma applies salt, weight and air, slowly, and is eaten for months afterwards. One is a way of cooking; the other is a way of keeping.",
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
          "Basturma does not sit neatly on either side of the line between ordinary and special food, and it is a mistake to force it onto one. Descriptions of the Armenian breakfast list cured meats among the regular parts of the meal, alongside lavash, cheeses, eggs and fresh vegetables, which is as everyday as food gets. Armenian-language accounts just as readily call it a fixture of the festive table, among the cold dishes served at the start.",
          "Both can be true because what limits it is cost and keeping, not the occasion. It is an expensive product: a large piece of lean beef loses much of its weight and is then held for weeks before it can be sold. So people buy it in small amounts and slice it thin. A food served sparingly can be an ordinary breakfast in small amounts and a generous gesture in larger ones, without changing what it is.",
          "Its official status in Armenia is still an open question. In March 2025 the deputy minister of economy told a parliamentary committee that discussions were under way to protect Armenian basturma, along with Armenian matsun, as national geographical indications under the law that came into force in 2022. That is a stated intention at an early stage, not a completed registration. It shows the state thinks the product is worth protecting, but says nothing yet about whether protection was granted.",
        ],
      },
      {
        id: "a-regional-food-without-one-owner",
        heading: "A regional food without a single owner",
        paragraphs: [
          "Some form of basturma belongs to Armenian, Turkish, Greek, Arab, Kurdish, Bulgarian, Egyptian and Azerbaijani cooking, and versions of it are made across all of them. The internet's favourite question about it, who invented it, has no answer the evidence can support, and the arguments under that heading are almost always about something other than food. This article does not take a position on it, because doing so would need sources that do not exist.",
          "The questions we can answer are narrower, and better. Armenians have a native word for salted dried meat, recorded in the fifth century and lent on to two other languages. Armenians were the documented specialists in the trade in the town most famous for it. Armenians carried the craft out of Anatolia after 1915 and kept it alive in half a dozen countries, which is why a Los Angeles shop can trace its practice through Lebanon to Armenia. That is a distinctive, well-evidenced Armenian tradition within a shared regional history, and it is substantial without any invention claim.",
          "Two neighbouring foods help mark the edges of this one. Sujuk, the dry spiced sausage that sits beside basturma in every account of an Armenian breakfast, uses a different technique: the meat is ground and cased, not kept whole. It has no article here yet. Pastrami is a linguistic relative, not a descendant. The Turkish word passed into Romanian as pastramă and travelled to New York with Romanian Jewish immigrants in the late nineteenth century, where the food itself was rebuilt around brisket, brine and smoke. Basturma did not become pastrami. The two share an ancestor in a word for pressing, then went their separate ways.",
        ],
      },
    ],
    importantDates: [
      {
        year: "5th century",
        event:
          "Apukht (ապուխտ), from Pahlavi apuxt, uncooked, appears in the Armenian translation of the Bible, meaning salted and dried meat.",
      },
      {
        year: "17th century",
        event:
          "Evliya Çelebi's Seyahatname describes Kayseri's cumin-flavoured beef pastirma as found nowhere else and sent to Istanbul as a gift.",
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
        "This is the section's first article about keeping food rather than making it. Most of the others describe what Armenian cooks do with ingredients on the day. This one describes the problem that comes before all of them: how a household in a land of hot summers and hard winters keeps meat through the months when there is none. Bread, dairy and meat each needed an answer, and this is the answer for meat.",
        "It is also the section's clearest case of popular claims and provable ones pointing in different directions. What circulates is a first-century-BC date and a story about saddles. What can actually be shown is an Iranian-derived word in a fifth-century translation, an Ottoman traveller praising one Cappadocian town's pastirma in the seventeenth century, a family firm founded in 1910, and a shop in Los Angeles whose owner learned the work in Lebanon from people who learned it in Armenia. The documented story is less ancient, and far more interesting.",
      ],
    },
    interestingFacts: [
      "The Armenian word chaman has two meanings: ground fenugreek, and the wet paste made from it. A mention of chaman may mean either the spice or the coating.",
      "Apukht is an Iranian loanword, from Pahlavi apuxt, uncooked. Armenian lent it on to Georgian as apukhti and, through the Armenians of Poland, to Polish as abucht.",
      "The saddle legend is told about Armenian horsemen on Armenian pages and about Turkic warriors on Turkish ones, with the same details and no source on either side.",
      "Three Byzantine scholars give three readings of the Greek terms behind pastirma: salted meat, salted fish, and smoked. That is why no clean origin chain can be drawn from them.",
      "Basturma did not become pastrami. The Turkish word passed into Romanian and reached New York with Romanian Jewish immigrants, where the food was rebuilt around brisket, brine and smoke.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "A lean whole cut of beef, usually from the loin or leg",
        "Plenty of salt, to draw out water",
        "Ground fenugreek, the base of the coating and its dominant aroma",
        "Garlic and red pepper, with cumin in many but not all versions",
      ],
      preparation:
        "A whole muscle is packed in salt until much of its water has been drawn out, pressed under weight to remove more and flatten it, and hung in moving air until it has dried through. It is then coated in chaman, a wet fenugreek paste, and left until the crust sets. This page gives no quantities, timings, temperatures or humidity levels: it explains what basturma is and how curing works, and it is not a method for curing meat at home.",
      occasions: [
        "Everyday breakfasts, as one of the regular cold parts of the meal",
        "Festive tables, among the cold dishes served at the start",
        "Meze tables, sliced thin and served cold",
      ],
      regions: [
        "Throughout Armenia, both bought for the home and made commercially",
        "Kayseri in Cappadocia, the historic centre of the trade, where Armenians were the documented specialists",
        "The Armenian diaspora: Aleppo, Beirut, Cairo, Greece, France and the United States",
      ],
      serving:
        "Cut almost see-through thin and eaten cold, on a meze table or folded into lavash; or warmed in a pan with eggs broken over it for breakfast.",
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
      "Tiny open boats of dough filled with meat, baked until the edges go hard, then drowned in broth and garlic matsun: the Armenian take on a dumpling the whole region makes.",
    metaDescription:
      "Armenian manti: small open dumplings baked crisp and served with broth and garlic matsun. What makes the form distinctive, and what the origin stories rest on.",
    summary:
      "Manti are small meat-filled dumplings, and you can spot the Armenian kind at a glance. They are pinched into open boats instead of being sealed, set upright on a tray, and baked until the exposed dough turns brown and hard; then broth and garlic matsun are poured over them. This form belongs above all to Western Armenian cooking, from Aintab, Marash and Cilicia, and to the diaspora communities descended from them. Manti also exist far beyond Armenians, in a family that runs from Chinese mantou through Central Asia to Turkish mantı. The popular story that Armenians got them from the Mongols in thirteenth-century Cilicia goes back to a single modern book. What history does support is a particular Armenian way with a shared food, and a well-documented account of how it left Anatolia and survived.",
    intro:
      "Almost every dumpling in the world is closed. The dough is folded over the filling and sealed, and whatever happens next, boiling, steaming or frying, happens to a parcel. Armenian manti are the ones left open. Two sides of a small square of dough are pinched up around a little meat, the ends are left standing apart, and what goes into the oven is a tray of tiny open boats, not a pot of sealed ones. Dry heat does what water never could: the raised edges brown and turn brittle while the filling cooks inside. Then hot broth is poured straight over the tray and garlicky matsun goes on top, so the dish arrives hard, soft and cold all at once. This article is about that form: what it is, where it belongs, and how much of the history usually attached to it really holds up.",
    author: "Armat Editorial Team",
    updated: "2026-08-26",
    keyFacts: [
      { label: "Kind of food", value: "Small meat-filled dumplings, served as a main dish" },
      { label: "Characteristic Armenian form", value: "Open boat shapes, baked on a tray until the edges crisp — sini manti" },
      { label: "Filled with", value: "Ground lamb or beef with onion and spices" },
      { label: "Served with", value: "Hot broth poured over the baked tray, and matsun beaten with garlic" },
      { label: "Belongs to", value: "Western Armenian cooking above all: Aintab, Marash, Cilicia and their diaspora" },
      { label: "Also spelled", value: "Mante, monta; մանթի in Armenian" },
    ],
    sections: [
      {
        id: "what-armenian-manti-is",
        heading: "What Armenian manti is",
        paragraphs: [
          "Manti are small dumplings of wheat dough filled with ground meat, made under that name across a huge stretch of Asia. What makes the Armenian ones distinct, and not just a local spelling, is how they are handled: shaped open, cooked in dry heat on a tray, and finished at the table with two liquids poured over them. English usually calls them Armenian dumplings. That is accurate but tells you almost nothing, because everything interesting lies in what is done to them.",
          "They are small. These are not the fist-sized steamed manti of Central Asia, and they do not come six to a plate. A tray holds many dozens, and making them takes hours rather than minutes. The size is not just for show. It creates the balance the dish depends on, a lot of edge for very little filling, and it is why the dish is almost never made for one household on an ordinary evening.",
          "One more name is worth knowing from the start. Sini manti, or tray manti, is the term for the baked form in particular, named after the tray it is arranged on. Sini is a Persian word for a large round tray, and it reached Armenian through the same Ottoman-era contact that supplied much of the Western Armenian kitchen vocabulary. When a recipe says sini manti, it means the baked open version and none of the others, a distinction more useful than it looks.",
        ],
      },
      {
        id: "the-open-baked-form",
        heading: "The open baked form, and the trouble with always",
        paragraphs: [
          "The baked open boat is the typical Armenian form, and the one worth explaining. Squares of thin dough each get a little filling, the two opposite sides are pinched together over it and the two ends are left open, so the finished shape is a canoe with the meat visible along the top. They are packed upright and close together on an oiled tray, often in a pattern, and go into a hot oven until the standing dough has coloured and hardened and the meat has browned in its trough. Nothing about this resembles what most dumpling traditions do.",
          "This is also where English-language sources overreach, and the overreach is worth naming because it is repeated everywhere. The claim in circulation is that Armenian manti is always baked and never boiled or steamed, unlike every other regional variety. That goes further than the evidence allows, and Armenian practice itself contradicts it. Sulu manti (soup manti, from the word for water) is Armenian, and its dumplings are closed, not open, and simmered in broth, not baked. Armenian-language recipe sites in the Republic routinely give manti steamed in a stacked steamer, in the larger Central Asian style.",
          "The accurate version is narrower, and it holds up against the evidence. The baked open form is a characteristic and widely documented Armenian style, strongly linked to Western Armenian cooking, and it is what most people mean when they simply say Armenian manti. It is not a rule every Armenian kitchen follows, and the versions that differ are not mistakes. This article describes a form, not a border.",
        ],
      },
      {
        id: "dough-filling-and-the-crisp-edge",
        heading: "Dough, filling, and why the edge matters",
        paragraphs: [
          "The dough is plain: wheat flour worked with water, usually with egg, rolled very thin and cut into small squares. It is unleavened, and that matters more here than elsewhere, because a risen dough would puff up and soften instead of hardening. The dish needs dough that can dry out and hold a shape, not tender dough, and thinness is what lets it do that in the time the filling takes to cook.",
          "The filling is ground meat with onion and seasoning, and the meat depends more on the household than on any rule. Lamb is usual in the older Western Armenian accounts and remains standard in the Levantine diaspora. Beef is at least as common in American and Armenian kitchens today, and mixtures of the two are normal. Onion is almost always there, and the seasoning runs to salt, pepper, parsley and often a warm spice such as allspice or cumin. Vegetarian versions filled with lentils or chickpeas exist too, made by people who also make the meat kind.",
          "Baking is what gives the dish its identity, and the reason is everyday food science. Dry heat drives water out of the exposed dough and lets its surface get far hotter than boiling point, so the sugars and proteins in it brown and the structure sets hard. A dumpling cooked in water or steam can do neither, because its surface stays wet and stays at the temperature of the water. That is why the open shape and the oven belong together. Leaving the top open exposes as much dough as possible to the dry air, so the dish is truly crisp before anything is poured on it.",
        ],
      },
      {
        id: "broth-and-matsun-at-the-table",
        heading: "Broth and matsun at the table",
        paragraphs: [
          "Having made the dough hard, the cook then wets it again, and the timing of that reversal is the whole trick. Hot broth (meat stock, often given body and colour with tomato) is poured straight over the baked tray shortly before eating, and the crisp edges soak up just enough to soften without collapsing. Some households serve the broth on the side in bowls instead, and some skip it and finish with the dairy alone. Families decide for themselves which way is correct, and they decide with confidence.",
          "The dairy is less optional. Matsun beaten smooth with crushed garlic goes on top, and the mix of hot baked dough, hot broth and cold sour dairy is the whole point of the dish. Matsun is the Armenian fermented milk described in its own article here, and it is worth naming exactly. Recipes written for English-speaking kitchens often call for Greek yogurt or labneh, which are reasonable substitutes but not the same product. The dish belongs to a cuisine that had matsun long before it had manti.",
          "Most Western Armenian versions finish with sumac, sometimes with dried mint or Aleppo pepper, and the choice is not decorative. Sumac is sour and dry, and it does the same job as the matsun from another direction, on a dish that is otherwise rich, salty and soft. This layered, sour-topped style belongs to the eastern Mediterranean, not the Armenian highlands, and its place on the plate is one more clue to where this form of manti comes from.",
        ],
        links: [{ phrase: "Matsun is the Armenian fermented milk", slug: "matsun" }],
      },
      {
        id: "a-dish-made-by-many-hands",
        heading: "A dish made by many hands",
        paragraphs: [
          "Filling and pinching several hundred dumplings the size of a thumb joint is too much for one person in an evening, and the custom that grew up around that fact is well documented. Diaspora accounts describe manti-making as a gathering: the women of a family meet at one house, often at a weekend, work through trays together, and freeze what is not needed right away. The food writer Andrew Janjigian describes exactly this at his Aunt Esther's house, where the frozen trays were kept for Christmas Eve.",
          "As a result, manti sits near the special end of the everyday-to-festive scale without being a ceremonial food. It is served at Christmas and Easter, at family gatherings, and at church and community events, because those occasions justify the work and bring the workers together. It is not liturgical, it carries no ritual role, and it belongs in this section among main dishes, not beside harissa and ghapama.",
          "It is worth being clear about what this does not mean. Communal manti-making is a documented practice in particular families and communities, recorded by the people it belongs to. It is not a description of how all Armenians live, and freezers, food processors and bought dough have changed it a great deal within living memory. It is a real tradition, and like any tradition it has a history, including a recent one.",
        ],
      },
      {
        id: "a-western-armenian-food",
        heading: "A Western Armenian food",
        paragraphs: [
          "Armenian food is not one cuisine, and manti shows this as clearly as any dish. It belongs above all to Western Armenian cooking: the food of the Armenian communities of Ottoman Anatolia and Cilicia and the diaspora descended from them, not the cooking of the eastern highlands that became the Republic of Armenia. Writing for the Smithsonian Folklife Festival, Liana Aghajanian put the general case bluntly: what is eaten in Armenia is very different from what counts as Armenian cuisine outside it, down to the names and pronunciations of the foods. She names manti among the Western Armenian dishes that diaspora restaurants keep.",
          "The term needs to be used precisely, because Western Armenian is a geographical and historical description and not a synonym for abroad. It refers to the Armenians of the western, Ottoman half of the historic Armenian lands; to the cities and provinces of Anatolia and Cilicia where they lived, such as Aintab, Marash, Kilis, Adana, Kharberd and Sebastia; and to their language, which is a separate standard form of Armenian, not an accent. An Armenian family in Moscow or Rostov is not Western Armenian, and its cooking is generally not manti cooking.",
          "You can follow the regional trail in the sources. The Armenian-American cookbooks of the mid-twentieth century came overwhelmingly from Aintab, compiled in Massachusetts by women born in Anatolia. The Hetq archive's account of Aintab cooking lists tray-baked filled foods served with yogurt among the town's signature dishes, including one served after the New Year liturgy. Manti belongs to that world, and it is no accident that so many modern recipe pages for it begin with a grandmother from Aintab or Marash who left for Aleppo.",
        ],
      },
      {
        id: "the-cilician-claim",
        heading: "The Cilician claim and where it comes from",
        paragraphs: [
          "Almost every English page about Armenian manti carries the same historical sentence: that manti reached Cilician Armenia through contact between Armenians and Mongols during their thirteenth-century alliance, and that Turkic peoples then learned it from the Armenians and carried it into Anatolia. It turns up in food-media explainers, diaspora community pages and recipe blogs, usually with no source at all and sometimes credited to an unnamed Armenian researcher.",
          "The claim can be traced. It goes back to Irina Petrosian and David Underwood's Armenian Food: Fact, Fiction and Folklore (2006), a popular history of Armenian cuisine, and spread from there through an encyclopedia entry into general use. Knowing this changes how much weight it can bear. The Armenian-Mongol alliance is real, well documented and interesting in its own right, and it is quite plausible that food travelled along it. But a reasonable inference in a modern popular book is a hypothesis about the thirteenth century, not a record of it. The second half of the claim, that Turkic peoples got manti from Armenians, is bigger still and rests on the same single source.",
          "So this article does not say that manti originated in Cilician Armenia, and it does not say the opposite either. No medieval Armenian text, inscription or cookbook shows when dumplings by this name entered Armenian cooking, and the earliest hard evidence for the word anywhere in Anatolia is Ottoman, not Cilician. Modern Armenian memory strongly links manti with Cilicia, and that link is real and worth recording for what it is: a fact about where the dish flourished and who carried it, not a dated account of how it arrived.",
        ],
      },
      {
        id: "manti-across-a-wider-region",
        heading: "Manti across a wider region",
        paragraphs: [
          "Armenian manti belongs to a family much bigger than Armenia. Dumplings called manti, mantı, mantu or manta are made from Xinjiang and Uzbekistan through Afghanistan and the Caucasus to Anatolia and the Balkans, and Korean mandu and Chinese mantou belong to the same tangle of names. The Turkish mantı best known abroad is Kayseri mantısı: very small, closed, boiled, and served under garlic yogurt with melted butter and pepper poured over. The dumplings of Central Asia are usually much larger and steamed. The Armenian form is the baked open one.",
          "The timeline is thin, and it comes from outside Armenian sources. The earliest well-known written record of a manti-like dish is in Yinshan Zhengyao, the dietary manual compiled in 1330 by Hu Sihui at the Mongol Yuan court, with recipes clearly related to the later Anatolian ones. The earliest Ottoman manti recipe appears in the fifteenth-century cookbook of Muhammed bin Mahmud Şirvani. Between those two points comes the Mongol expansion, which is why so many accounts reach for it. How these dumplings spread west across Eurasia is a real scholarly subject, explored by Aylin Öney Tan in the Oxford Symposium's volume on wrapped and stuffed foods.",
          "The fair summary is that the wider manti family has a long history across many regions that no single people invented, and that the Armenian baked form is one distinct development within it. Both halves of that sentence matter. Drop the first and you get the invention claims that circulate in several languages at once. Drop the second and a specific, well-recorded cooking practice shrinks into a mere borrowing, which it is not.",
        ],
      },
      {
        id: "the-word-and-what-it-proves",
        heading: "The word, and what a word proves",
        paragraphs: [
          "Armenian writes the dish մանթի, and English spells it manti, mante and, in some diaspora communities, especially around Los Angeles and Detroit, monta. These are one pronunciation caught in different spellings, not different foods: a Glendale shop selling monta and a Boston kitchen making manti are making the same thing. Related terms travel with it: mantapour for the broth version, sini manti for the baked one, sulu manti for the soup one.",
          "The etymology of the root is genuinely unsettled. Most etymological references derive manti from Chinese mantou, and Turkish etymological dictionaries also point to a Mongol link. The reverse, that mantou was borrowed into Chinese from a Turkic source, has been argued and questioned. What is not in doubt is that the word is not Armenian in origin and came from the east along with the food.",
          "That fact settles nothing about ownership, and it needs saying because people online argue it both ways. Loanwords are normal in cooking vocabulary across this whole region. Armenian took basturma from Turkish and sini from Persian, and lent its own words to others in turn. So a borrowed name is evidence of contact rather than of who is entitled to the dish. What matters is what a people does with a food after it arrives, and what Armenians did with this one was distinctive enough to earn its own name.",
        ],
      },
      {
        id: "carried-and-kept",
        heading: "Carried out of Anatolia and kept",
        paragraphs: [
          "The most recent part of this history is also the best documented. The Armenian communities of Aintab, Marash and the Cilician towns were destroyed or driven out during the genocide of 1915 and the years around it. Survivors reached Aleppo and Beirut first and later, in further migrations, France, the United States and Canada. Manti went with them. The same trays are set in Aleppo, Beirut, Boston, Los Angeles and Toronto, made from recipes that trace back through one or two named women to a town where no Armenians live today.",
          "This path differs from that of the section's other Anatolian survival. Basturma was carried by families who had made it commercially, and it re-established itself as a trade, with shops and producers. Manti was carried in households, by people who made it for their own families and taught daughters and daughters-in-law to pinch it. It came back as home cooking and only later reached restaurants. Both routes worked. The household route leaves fewer records, which is why the family accounts collected in community publications are the real evidence here, not decoration.",
          "It also means the dish has kept changing while staying recognisable. Diaspora versions differ by country: more tomato in the Levantine broth, more sumac in some kitchens than others, beef where the grandmother used lamb. Some cooks now use bought wrappers. The people making those changes are the tradition, not a break from it, and what stays constant across all of them is the shape and the oven.",
        ],
        links: [{ phrase: "the section's other Anatolian survival", slug: "basturma" }],
      },
      {
        id: "manti-in-armenia-today",
        heading: "Manti in Armenia today",
        paragraphs: [
          "In the Republic of Armenia the picture is different. Manti is known and available, but it is not a standard dish of the highland kitchen the way dolma or khash are. Where it is served in Yerevan, it is overwhelmingly in restaurants that are openly Western Armenian or Middle Eastern Armenian: places founded by families from Beirut and Aleppo, or named after Aintab. Manti has reached Armenia largely by coming back with the diaspora, not by being handed down within the country.",
          "That gives manti an unusual, and useful, place among the dishes in this section. Most of them are foods of the country that also travelled; this is a food of exile that has been travelling back. Armenian-language recipe collections also show how one name covers two different foods in the two halves of Armenian life: the baked open tray in the diaspora, and the larger steamed dumpling of the post-Soviet repertoire in kitchens inside Armenia.",
          "None of this makes it less Armenian, and this article does not think it worth asking whether it counts. A food that a people has made under its own name for centuries, shaped in a way nobody else shapes it, served with its own dairy, and carried through a catastrophe by the households that survived, is that people's food. The evidence supports something more particular than an invention story: a shared regional dumpling that Armenians handled differently from everyone around them, and kept.",
        ],
      },
    ],
    importantDates: [
      {
        year: "1330",
        event:
          "Yinshan Zhengyao, compiled by Hu Sihui at the Mongol Yuan court, records dumpling recipes clearly related to the later Anatolian manti.",
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
          "Irina Petrosian and David Underwood publish the Cilician-Mongol account of manti's arrival, which later spreads across the English-language web without credit.",
      },
    ],
    significance: {
      heading: "Why manti matters",
      paragraphs: [
        "Manti is where this section stops being the cuisine of one country. Almost every other dish here can be described from inside Armenia; this one cannot. Its home is the western half of the historic Armenian world, and its living centre is a diaspora created by force. To write about manti at all is to write about Aintab, Aleppo, Beirut and Glendale, and about a kind of Armenian cooking that outlived its own geography.",
        "It is also the section's clearest case of a shared food made distinctive by how it is treated, not by what goes into it. Nothing in a manti is Armenian in itself: the dough is wheat and water, the filling is minced lamb, and the name came from the east. What is Armenian is the choice to leave the parcel open and put it in the oven, then pour broth and garlic matsun over the result. That small technical difference produces a completely different food. It deserves defending as carefully as any origin claim, and more so, because unlike the origin claims it can actually be shown.",
      ],
    },
    interestingFacts: [
      "Sini manti means tray manti. Sini is a Persian word for a large round tray, so the baked form is named after the thing it is baked on.",
      "The widely repeated claim that Armenian manti is never boiled or steamed is contradicted by Armenian practice: sulu manti is closed and simmered, and Armenian-language recipe sites give steamed versions.",
      "The Cilician-Mongol origin story found on nearly every English page about Armenian manti goes back to a single popular book published in 2006.",
      "In parts of the American diaspora the dish is called monta, and a Glendale shop sells it under that name: the same food, a different vowel.",
      "In Yerevan, manti is mostly found in restaurants founded by Western Armenian families from Beirut and Aleppo: a diaspora food that has been travelling home.",
    ],
    relatedFigures: [],
    cuisine: {
      ingredients: [
        "Thin unleavened wheat dough, usually made with egg",
        "Ground lamb or beef with onion, salt, pepper and parsley",
        "Meat broth, often given colour and body with tomato",
        "Matsun beaten with crushed garlic, and sumac to finish",
      ],
      preparation:
        "Thin dough is cut into small squares, and each gets a little filling and is pinched along two sides so the ends stay open. The boats are packed upright on an oiled tray and baked in dry heat until the standing edges brown and harden and the meat browns inside. Hot broth is poured over the tray shortly before serving. This page gives no quantities, oven temperatures or baking times: it describes what manti is and why the form works, and it is not a recipe.",
      occasions: [
        "Family gatherings, where the shaping is shared out among several people",
        "Christmas and Easter tables, and church and community events",
        "Everyday meals in households that keep trays of shaped manti in the freezer",
      ],
      regions: [
        "Western Armenian Anatolia and Cilicia: Aintab, Marash and the towns around them",
        "The Levantine diaspora, above all Aleppo and Beirut",
        "Armenian communities in the United States, France and Canada",
        "Yerevan, mainly in restaurants founded by Western Armenian families",
      ],
      serving:
        "Baked until the open edges are hard, then flooded with hot broth and topped with garlicky matsun and sumac, so that hot, soft and cold arrive together.",
    },
    relatedSlugs: ["matsun", "basturma"],
  },
];
