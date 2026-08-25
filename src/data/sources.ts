import type { Source } from "@/data/types";

/**
 * The bibliography, keyed by article slug.
 *
 * Deliberately NOT stored per locale. A citation is language-neutral — a reader
 * of any edition who follows it arrives at the same physical book — and holding
 * three copies of it is what allowed the first version of this file to rot: the
 * same work appeared under two publishers, and one publisher under two titles
 * for the same work, without anything catching it.
 *
 * Rules enforced by `validate:content`:
 *   - every article slug must appear here with at least one source
 *   - every source must carry an identifier (ISBN, DOI, stable URL, or an
 *     archival reference), because an invented work cannot supply one
 *
 * Everything below was checked against publisher catalogues, WorldCat and the
 * issuing institutions in July 2026. Where the earlier bibliography cited a work
 * that does not exist, it has been removed and replaced with a real study of the
 * same subject rather than quietly dropped.
 */
const SOURCES: Record<string, Source[]> = {
  /* ---------------------------------------------------------------- history */

  "kingdom-of-urartu": [
    {
      author: "Paul E. Zimansky",
      title: "Ancient Ararat: A Handbook of Urartian Studies",
      publisher: "Caravan Books, Delmar NY",
      year: "1998",
      identifier: { kind: "isbn", value: "9780882060910" },
    },
    {
      author: "Boris B. Piotrovsky",
      title: "The Ancient Civilization of Urartu",
      publisher: "Cowles, New York",
      year: "1969",
      identifier: { kind: "url", value: "https://search.worldcat.org/title/22421" },
      note: "Piotrovsky directed the Karmir Blur excavations from 1939 to 1971.",
    },
    {
      author: "Mirjo Salvini",
      title: "Corpus dei testi urartei",
      publisher: "CNR, Istituto di Studi sulle Civiltà dell'Egeo e del Vicino Oriente, Rome",
      year: "2008–",
      identifier: { kind: "isbn", value: "9788878900257" },
      note: "The standard edition of the Urartian royal inscriptions.",
    },
  ],

  "tigran-the-great": [
    {
      author: "Richard G. Hovannisian (ed.)",
      title:
        "The Armenian People from Ancient to Modern Times, Volume I: The Dynastic Periods, from Antiquity to the Fourteenth Century",
      publisher: "Palgrave Macmillan",
      year: "2004",
      identifier: { kind: "isbn", value: "9781403966360" },
      note: "First published by St. Martin's Press, New York, 1997. The two volumes are cited here in the Palgrave reissue, whose ISBNs are unambiguously per-volume.",
    },
    {
      author: "Robert H. Hewsen",
      title: "Armenia: A Historical Atlas",
      publisher: "University of Chicago Press",
      year: "2001",
      identifier: { kind: "isbn", value: "9780226332284" },
    },
    {
      author: "Plutarch, trans. Bernadotte Perrin",
      title: "Lives, Volume II: Themistocles and Camillus, Aristides and Cato Major, Cimon and Lucullus",
      publisher: "Harvard University Press, Loeb Classical Library 47",
      year: "1914",
      identifier: { kind: "isbn", value: "9780674990531" },
      note: "The Life of Lucullus is the ancient source for the Roman campaigns against Tigran.",
    },
  ],

  "mesrop-mashtots-armenian-alphabet": [
    {
      author: "Abraham Terian (trans.)",
      title:
        "The Life of Mashtots' by His Disciple Koriwn: Translated from the Classical Armenian with Introduction and Commentary",
      publisher: "Oxford University Press",
      year: "2022",
      identifier: { kind: "isbn", value: "9780192847416" },
      note: "Koriun was Mashtots's own pupil; this is the earliest account of the invention of the alphabet.",
    },
    {
      author: "A. J. Hacikyan, G. Basmajian, E. S. Franchuk and N. Ouzounian (eds.)",
      title: "The Heritage of Armenian Literature, Volume I: From the Oral Tradition to the Golden Age",
      publisher: "Wayne State University Press",
      year: "2000",
      identifier: { kind: "isbn", value: "9780814328156" },
    },
    {
      author: "Maria Polinsky (ed.)",
      title: "The Oxford Handbook of Languages of the Caucasus",
      publisher: "Oxford University Press",
      year: "2020",
      identifier: { kind: "isbn", value: "9780190690694" },
    },
  ],

  "adoption-of-christianity": [
    {
      author: "Agathangelos, trans. and comm. R. W. Thomson",
      title: "History of the Armenians",
      publisher: "State University of New York Press, Albany",
      year: "1976",
      identifier: { kind: "isbn", value: "9780873953238" },
      note: "The fifth-century narrative of the conversion, written well over a century after the events.",
    },
    {
      author: "Nina G. Garsoïan",
      title: "Studies on the Formation of Christian Armenia",
      publisher: "Variorum / Ashgate",
      year: "2010",
      identifier: { kind: "isbn", value: "9781409403661" },
      note: "Includes the arguments for dating the conversion to c. 314 rather than 301.",
    },
    {
      title: "Cathedral and Churches of Echmiatsin and the Archaeological Site of Zvartnots",
      publisher: "UNESCO World Heritage List, no. 1011",
      year: "inscribed 2000",
      identifier: { kind: "url", value: "https://whc.unesco.org/en/list/1011/" },
    },
  ],

  "battle-of-avarayr": [
    {
      author: "Eḷishē, trans. and comm. Robert W. Thomson",
      title: "History of Vardan and the Armenian War",
      publisher: "Harvard University Press, Harvard Armenian Texts and Studies 5",
      year: "1982",
      identifier: { kind: "isbn", value: "9780674403352" },
      note: "The principal source for the battle, and a partisan one — Thomson's introduction sets out why.",
    },
    {
      author: "Nina G. Garsoïan",
      title: "Armenia between Byzantium and the Sasanians",
      publisher: "Variorum Reprints, London",
      year: "1985",
      identifier: { kind: "isbn", value: "9780860781660" },
    },
    {
      author: "Eberhard W. Sauer (ed.)",
      title: "Sasanian Persia: Between Rome and the Steppes of Eurasia",
      publisher: "Edinburgh University Press",
      year: "2017",
      identifier: { kind: "isbn", value: "9781474401012" },
    },
  ],

  "bagratid-armenia": [
    {
      author: "Sirarpie Der Nersessian",
      title: "Armenia and the Byzantine Empire: A Brief Study of Armenian Art and Civilization",
      publisher: "Harvard University Press",
      year: "1945",
      identifier: { kind: "url", value: "https://search.worldcat.org/title/1462144" },
    },
    {
      author: "Christina Maranci",
      title: "Medieval Armenian Architecture: Constructions of Race and Nation",
      publisher: "Peeters, Louvain, Hebrew University Armenian Studies 2",
      year: "2001",
      identifier: { kind: "isbn", value: "9789042909397" },
    },
    {
      title: "Archaeological Site of Ani",
      publisher: "UNESCO World Heritage List, no. 1518",
      year: "inscribed 2016",
      identifier: { kind: "url", value: "https://whc.unesco.org/en/list/1518/" },
    },
  ],

  "first-republic-of-armenia": [
    {
      author: "Richard G. Hovannisian",
      title: "The Republic of Armenia, Volume I: The First Year, 1918–1919",
      publisher: "University of California Press",
      year: "1971",
      identifier: { kind: "isbn", value: "9780520019843" },
      note: "The first of four volumes; the series runs to 1921 and remains the standard account.",
    },
    {
      author: "James L. Barton",
      title: "Story of Near East Relief (1915–1930): An Interpretation",
      publisher: "Macmillan, New York",
      year: "1930",
      identifier: { kind: "url", value: "https://search.worldcat.org/title/1163786" },
    },
    {
      title: "Peace Conference: British Delegation, Correspondence and Papers",
      publisher: "The National Archives, Kew",
      year: "1919–1920",
      identifier: { kind: "archive", value: "TNA FO 608" },
      note: "An archival record group, not a publication; consult by series and piece reference.",
    },
  ],

  /* ---------------------------------------------------------------- writers */

  "hovhannes-tumanyan": [
    {
      author: "A. J. Hacikyan, G. Basmajian, E. S. Franchuk and N. Ouzounian (eds.)",
      title: "The Heritage of Armenian Literature, Volume III: From the Eighteenth Century to Modern Times",
      publisher: "Wayne State University Press",
      year: "2005",
      identifier: { kind: "isbn", value: "9780814332214" },
    },
    {
      title: "Hovhannes Tumanyan Museum, Yerevan",
      publisher: "Museum of Hovhannes Tumanyan",
      identifier: { kind: "url", value: "https://tumanyan.am/eng/" },
      note: "Holds the manuscripts and the documented chronology of the poet's life and works.",
    },
  ],

  "yeghishe-charents": [
    {
      author: "A. J. Hacikyan, G. Basmajian, E. S. Franchuk and N. Ouzounian (eds.)",
      title: "The Heritage of Armenian Literature, Volume III: From the Eighteenth Century to Modern Times",
      publisher: "Wayne State University Press",
      year: "2005",
      identifier: { kind: "isbn", value: "9780814332214" },
    },
    {
      author: "Marc Nichanian",
      title: "Writers of Disaster: Armenian Literature in the Twentieth Century",
      publisher: "Gomidas Institute, Princeton and London",
      year: "2002",
      identifier: { kind: "isbn", value: "9781903656099" },
    },
  ],

  raffi: [
    {
      author: "A. J. Hacikyan, G. Basmajian, E. S. Franchuk and N. Ouzounian (eds.)",
      title: "The Heritage of Armenian Literature, Volume III: From the Eighteenth Century to Modern Times",
      publisher: "Wayne State University Press",
      year: "2005",
      identifier: { kind: "isbn", value: "9780814332214" },
    },
    {
      author: "Razmik Panossian",
      title: "The Armenians: From Kings and Priests to Merchants and Commissars",
      publisher: "Columbia University Press",
      year: "2006",
      identifier: { kind: "isbn", value: "9780231139267" },
      note: "Sets Raffi's novels in the nineteenth-century national movement they helped create.",
    },
  ],

  "avetik-isahakyan": [
    {
      author: "A. J. Hacikyan, G. Basmajian, E. S. Franchuk and N. Ouzounian (eds.)",
      title: "The Heritage of Armenian Literature, Volume III: From the Eighteenth Century to Modern Times",
      publisher: "Wayne State University Press",
      year: "2005",
      identifier: { kind: "isbn", value: "9780814332214" },
    },
    {
      author: "Diana Der Hovanessian and Marzbed Margossian (eds.)",
      title: "Anthology of Armenian Poetry",
      publisher: "Columbia University Press",
      year: "1978",
      identifier: { kind: "isbn", value: "9780231045643" },
    },
  ],

  "khachatur-abovyan": [
    {
      author: "A. J. Hacikyan, G. Basmajian, E. S. Franchuk and N. Ouzounian (eds.)",
      title: "The Heritage of Armenian Literature, Volume III: From the Eighteenth Century to Modern Times",
      publisher: "Wayne State University Press",
      year: "2005",
      identifier: { kind: "isbn", value: "9780814332214" },
    },
    {
      author: "Friedrich Parrot, trans. W. D. Cooley",
      title: "Journey to Ararat",
      publisher: "Longman, Brown, Green, and Longmans, London",
      year: "1845",
      identifier: { kind: "url", value: "https://archive.org/details/journeytoararat00parrgoog" },
      note: "Parrot's own account of the 1829 ascent, on which Abovyan was his interpreter and companion.",
    },
  ],

  "paruyr-sevak": [
    {
      author: "A. J. Hacikyan, G. Basmajian, E. S. Franchuk and N. Ouzounian (eds.)",
      title: "The Heritage of Armenian Literature, Volume III: From the Eighteenth Century to Modern Times",
      publisher: "Wayne State University Press",
      year: "2005",
      identifier: { kind: "isbn", value: "9780814332214" },
    },
    {
      author: "Marc Nichanian",
      title: "Writers of Disaster: Armenian Literature in the Twentieth Century",
      publisher: "Gomidas Institute, Princeton and London",
      year: "2002",
      identifier: { kind: "isbn", value: "9781903656099" },
    },
  ],

  /* ------------------------------------------------------------------ works */

  anush: [
    {
      author: "A. J. Hacikyan, G. Basmajian, E. S. Franchuk and N. Ouzounian (eds.)",
      title: "The Heritage of Armenian Literature, Volume III: From the Eighteenth Century to Modern Times",
      publisher: "Wayne State University Press",
      year: "2005",
      identifier: { kind: "isbn", value: "9780814332214" },
    },
    {
      title: "Hovhannes Tumanyan Museum, Yerevan",
      publisher: "Museum of Hovhannes Tumanyan",
      identifier: { kind: "url", value: "https://tumanyan.am/eng/" },
      note: "Holds the manuscripts, and documents the 1890 first version of Anush, the 1892 printing and the 1901–1902 revision.",
    },
  ],

  "wounds-of-armenia": [
    {
      author: "A. J. Hacikyan, G. Basmajian, E. S. Franchuk and N. Ouzounian (eds.)",
      title: "The Heritage of Armenian Literature, Volume III: From the Eighteenth Century to Modern Times",
      publisher: "Wayne State University Press",
      year: "2005",
      identifier: { kind: "isbn", value: "9780814332214" },
    },
    {
      author: "Razmik Panossian",
      title: "The Armenians: From Kings and Priests to Merchants and Commissars",
      publisher: "Columbia University Press",
      year: "2006",
      identifier: { kind: "isbn", value: "9780231139267" },
      note: "On Abovyan's turn to the vernacular and the making of a modern literary language.",
    },
  ],

  "the-fool": [
    {
      author: "A. J. Hacikyan, G. Basmajian, E. S. Franchuk and N. Ouzounian (eds.)",
      title: "The Heritage of Armenian Literature, Volume III: From the Eighteenth Century to Modern Times",
      publisher: "Wayne State University Press",
      year: "2005",
      identifier: { kind: "isbn", value: "9780814332214" },
    },
    {
      author: "Richard G. Hovannisian (ed.)",
      title:
        "The Armenian People from Ancient to Modern Times, Volume II: Foreign Dominion to Statehood, the Fifteenth Century to the Twentieth Century",
      publisher: "Palgrave Macmillan",
      year: "2004",
      identifier: { kind: "isbn", value: "9781403964229" },
      note: "First published by St. Martin's Press, New York, 1997. For the Russo-Turkish war of 1877–78 and the Berlin reform clause the novel turns on.",
    },
  ],

  "david-of-sassoun": [
    {
      author: "Leon Z. Surmelian (trans.)",
      title: "Daredevils of Sassoun: The Armenian National Epic",
      publisher: "Alan Swallow, Denver",
      year: "1964",
      identifier: { kind: "url", value: "https://search.worldcat.org/title/1329146" },
      note: "The standard English translation, made from the 1939 consolidated text.",
    },
    {
      author: "M. Abeghyan and K. Melik-Ohanjanyan (eds.)",
      title: "Սասնա ծռեր (Sasna Tsrer)",
      publisher: "Academy of Sciences of the Armenian SSR, Yerevan",
      year: "1936–1951",
      identifier: { kind: "url", value: "https://search.worldcat.org/title/22213348" },
      note: "The critical edition of the recorded variants, in three parts.",
    },
    {
      title: "Performance of the Armenian epic of Daredevils of Sassoun",
      publisher: "UNESCO Representative List of the Intangible Cultural Heritage of Humanity, no. 00743",
      year: "inscribed 2012",
      identifier: { kind: "url", value: "https://ich.unesco.org/en/RL/00743" },
    },
  ],

  /* ---------------------------------------------------------------- cuisine */

  /*
   * The cuisine bibliography is weighted towards cultural-heritage bodies and
   * academic publishers rather than cookbooks, because the claims these
   * articles make are cultural and historical rather than culinary. Two
   * cookbooks appear (Uvezian, Petrosian & Underwood) and both are cited only
   * for preparation practice and for the folklore attached to a dish, never for
   * a date or an origin.
   *
   * Where a dish is shared across the region the citation says so on the
   * record: dolma's UNESCO file was submitted by Azerbaijan, and lavash carries
   * two inscriptions naming seven states between them. Citing only the Armenian
   * one would let the bibliography imply an exclusivity the articles are
   * careful not to claim.
   */

  lavash: [
    {
      title:
        "Lavash, the preparation, meaning and appearance of traditional bread as an expression of culture in Armenia",
      publisher:
        "UNESCO Representative List of the Intangible Cultural Heritage of Humanity, no. 00985",
      year: "inscribed 2014",
      identifier: { kind: "url", value: "https://ich.unesco.org/en/RL/00985" },
      note: "Submitted by Armenia. The nomination file is the source for the tonir method, the six-month keeping and the wedding practice.",
    },
    {
      title: "Flatbread making and sharing culture: Lavash, Katyrma, Jupka, Yufka",
      publisher:
        "UNESCO Representative List of the Intangible Cultural Heritage of Humanity, no. 01181",
      year: "inscribed 2016",
      identifier: { kind: "url", value: "https://ich.unesco.org/en/RL/01181" },
      note: "A separate, multinational inscription submitted by Azerbaijan, Iran, Kazakhstan, Kyrgyzstan and Turkey — cited here because the same bread name is inscribed twice, for different communities.",
    },
    {
      author: "Levon Abrahamian and Nancy Sweezy (eds.)",
      title: "Armenian Folk Arts, Culture, and Identity",
      publisher: "Indiana University Press, Bloomington",
      year: "2001",
      identifier: { kind: "isbn", value: "9780253337047" },
      note: "Hripsime Pikichian's chapter on festival and feast is the ethnographic source used across this section.",
    },
    {
      title: "Armenia: Creating Home — The Hearth",
      publisher: "Smithsonian Folklife Festival, Center for Folklife and Cultural Heritage",
      year: "2018",
      identifier: { kind: "url", value: "https://festival.si.edu/2018/armenia/feasting/hearth" },
      note: "The 2018 Festival programme's description of the tonir, its dimensions and its place in the house.",
    },
  ],

  dolma: [
    {
      title: "Dolma making and sharing tradition, a marker of cultural identity",
      publisher:
        "UNESCO Representative List of the Intangible Cultural Heritage of Humanity, no. 01188",
      year: "inscribed 2017",
      identifier: { kind: "url", value: "https://ich.unesco.org/en/RL/01188" },
      note: "Submitted by Azerbaijan, not by Armenia. Cited for the dish's regional spread and for the Turkic etymology it records.",
    },
    {
      author: "Priscilla Mary Işın",
      title: "Bountiful Empire: A History of Ottoman Cuisine",
      publisher: "Reaktion Books, London",
      year: "2018",
      identifier: { kind: "isbn", value: "9781780239040" },
      note: "Documents stuffed-vegetable dishes in Ottoman kitchen records, the context in which the shared regional forms are first written down.",
    },
    {
      author: "Alan Davidson, ed. Tom Jaine",
      title: "The Oxford Companion to Food",
      publisher: "Oxford University Press, 3rd edition",
      year: "2014",
      identifier: { kind: "isbn", value: "9780199677337" },
    },
    {
      author: "Irina Petrosian and David Underwood",
      title: "Armenian Food: Fact, Fiction & Folklore",
      publisher: "Yerkir Publishing",
      year: "2006",
      identifier: { kind: "isbn", value: "9781411698659" },
      note: "Cited for Armenian preparation practice and for the folklore attached to particular dishes, not for dates or origins.",
    },
  ],

  khorovats: [
    {
      title: "Armenia: Creating Home — Foodways",
      publisher: "Smithsonian Folklife Festival, Center for Folklife and Cultural Heritage",
      year: "2018",
      identifier: { kind: "url", value: "https://festival.si.edu/2018/armenia/feasting/foodways" },
    },
    {
      author: "Susan Paul Pattie",
      title: "This is not a sacrifice: interpretations of the Madagh among Armenians",
      publisher: "Food, Culture & Society, vol. 25 no. 5, pp. 783–794",
      year: "2022",
      identifier: { kind: "doi", value: "10.1080/15528014.2021.2000126" },
      note: "The anthropological account of madagh, the communal meat meal, and of how differently it is understood in Armenia and in the diaspora.",
    },
    {
      author: "Levon Abrahamian and Nancy Sweezy (eds.)",
      title: "Armenian Folk Arts, Culture, and Identity",
      publisher: "Indiana University Press, Bloomington",
      year: "2001",
      identifier: { kind: "isbn", value: "9780253337047" },
    },
    {
      author: "Irina Petrosian and David Underwood",
      title: "Armenian Food: Fact, Fiction & Folklore",
      publisher: "Yerkir Publishing",
      year: "2006",
      identifier: { kind: "isbn", value: "9781411698659" },
    },
  ],

  harissa: [
    {
      author: "Nawal Nasrallah (trans.)",
      title:
        "Annals of the Caliphs' Kitchens: Ibn Sayyār al-Warrāq's Tenth-Century Baghdadi Cookbook",
      publisher: "Brill, Leiden",
      year: "2007",
      identifier: { kind: "isbn", value: "9789004158672" },
      note: "The earliest written record of harīsa as a pounded wheat-and-meat dish, in a tenth-century Baghdadi collection.",
    },
    {
      author: "Raymond Kévorkian",
      title: "The Armenian Genocide: A Complete History",
      publisher: "I.B. Tauris, London",
      year: "2011",
      identifier: { kind: "isbn", value: "9781848855618" },
      note: "The scholarly account of the 1915 Musa Dagh resistance, to which the September commemoration is attached.",
    },
    {
      title: "Musa Dagh Memorial, Musaler, Armavir Province",
      publisher: "Armenian National Institute, Washington DC",
      identifier: {
        kind: "url",
        value:
          "https://www.armenian-genocide.org/Memorial.198/current_category.52/memorials_detail.html",
      },
      note: "The institutional record of the memorial at which the commemoration is held.",
    },
    {
      author: "Irina Petrosian and David Underwood",
      title: "Armenian Food: Fact, Fiction & Folklore",
      publisher: "Yerkir Publishing",
      year: "2006",
      identifier: { kind: "isbn", value: "9781411698659" },
    },
  ],

  gata: [
    {
      title: "Armenia: Creating Home — Foodways",
      publisher: "Smithsonian Folklife Festival, Center for Folklife and Cultural Heritage",
      year: "2018",
      identifier: { kind: "url", value: "https://festival.si.edu/2018/armenia/feasting/foodways" },
    },
    {
      author: "Sonia Uvezian",
      title: "The Cuisine of Armenia",
      publisher: "Siamanto Press",
      identifier: { kind: "isbn", value: "9780970971678" },
      note: "Cited for preparation practice. First published by Harper & Row, New York, in 1974.",
    },
    {
      author: "Irina Petrosian and David Underwood",
      title: "Armenian Food: Fact, Fiction & Folklore",
      publisher: "Yerkir Publishing",
      year: "2006",
      identifier: { kind: "isbn", value: "9781411698659" },
    },
    {
      author: "Levon Abrahamian and Nancy Sweezy (eds.)",
      title: "Armenian Folk Arts, Culture, and Identity",
      publisher: "Indiana University Press, Bloomington",
      year: "2001",
      identifier: { kind: "isbn", value: "9780253337047" },
    },
  ],

  ghapama: [
    {
      author: "Kathy Phung",
      title: "Armenian Recipe: Ghapama, Stuffed Pumpkin",
      publisher: "Smithsonian Folklife Festival, Center for Folklife and Cultural Heritage",
      year: "2018",
      identifier: {
        kind: "url",
        value: "https://festival.si.edu/blog/armenian-recipe-ghapama-stuffed-pumpkin",
      },
      note: "Written for the Festival's Armenia programme; the source for the dish's festive rather than everyday place, and for the Goris version.",
    },
    {
      author: "Alan Davidson, ed. Tom Jaine",
      title: "The Oxford Companion to Food",
      publisher: "Oxford University Press, 3rd edition",
      year: "2014",
      identifier: { kind: "isbn", value: "9780199677337" },
      note: "Cited for the botany: every Cucurbita squash, the pumpkin included, is a New World plant, which dates the dish in its present form.",
    },
    {
      author: "Sonia Uvezian",
      title: "The Cuisine of Armenia",
      publisher: "Siamanto Press",
      identifier: { kind: "isbn", value: "9780970971678" },
    },
    {
      author: "Irina Petrosian and David Underwood",
      title: "Armenian Food: Fact, Fiction & Folklore",
      publisher: "Yerkir Publishing",
      year: "2006",
      identifier: { kind: "isbn", value: "9781411698659" },
    },
  ],

  /*
   * §68. Spas — and the first Cuisine bibliography assembled against a rule about
   * what *not* to reuse.
   *
   * Irina Petrosian and David Underwood's `Armenian Food: Fact, Fiction & Folklore`
   * is cited by five of the six existing Cuisine articles, and the §67 audit
   * recorded that concentration as the section's one source weakness. It is
   * deliberately **not** cited here. That is not a judgement on the book, which is
   * a sensible choice for a section at folklore risk; it is that the two questions
   * this article actually turns on are answered better elsewhere. Why fermented
   * milk coagulates on a stove is food chemistry, and McGee is authoritative on it.
   * Where the word `spas` came from is Armenian lexicography, and the classical
   * dictionary is the primary record rather than a secondary report of it. Reusing a
   * general popular-press survey for either would have been reaching for the
   * familiar shelf.
   *
   * The Oxford Companion to Food was considered and left out for the opposite
   * reason: it is already in this registry and would have been easy to add, but no
   * claim in the article rests on it. A bibliography that lists what was consulted
   * rather than what is load-bearing teaches a reader nothing about which sentence
   * to check.
   */
  spas: [
    {
      author: "G. Awetikʻean, X. Siwrmēlean and M. Awgerean",
      title: "Nor baṛgirkʻ haykazean lezui (New Dictionary of the Armenian Language)",
      publisher: "Mkhitarist Congregation, San Lazzaro, Venice",
      year: "1836–1837",
      identifier: { kind: "archive", value: "NorBagirkHaykazeanLezui1836" },
      note: "The standard dictionary of Classical Armenian, compiled from the classical corpus. Cited for the sense-range of the word spas — service, the vessels set out for a meal, and soup — and for the older sense of tan closer to broth than to a drink. It records what the words meant, not when the dish was first made, and the article is careful to keep those apart.",
    },
    {
      author: "Harold McGee",
      title: "On Food and Cooking: The Science and Lore of the Kitchen",
      publisher: "Scribner, revised and updated edition",
      year: "2004",
      identifier: { kind: "isbn", value: "9780684800011" },
      note: "The source for the whole of the curdling section: milk proteins are unusually heat-tolerant and do not set when cooked, but they do coagulate once the milk has turned acidic. That exception is the entire technical problem of heating matsun, and it is also what licenses the article to describe stirring direction as custom rather than mechanism.",
    },
    {
      author: "Bert G. Fragner",
      title: "ĀŠPAZĪ",
      publisher: "Encyclopædia Iranica",
      year: "1987",
      identifier: { kind: "url", value: "https://www.iranicaonline.org/articles/spazi-cookery/" },
      note: "Cited for the regional context and for nothing else: porridge-like soups of cereals, vegetables and herbs as ordinary town food by the fourteenth and fifteenth centuries, the use of milk products such as kashk in flavouring them, and the wide early spread of yogurt-making. Deliberately a source from outside Armenian scholarship, so that the shared-family point is not made by an interested party.",
    },
    {
      title: "Armenia: Creating Home — Foodways",
      publisher: "Smithsonian Folklife Festival, Center for Folklife and Cultural Heritage",
      year: "2018",
      identifier: { kind: "url", value: "https://festival.si.edu/2018/armenia/feasting/foodways" },
      note: "Two claims rest on it: that the menu of a feast differs from daily meals in ingredients, techniques and serving etiquette — the distinction the article is built on — and that each region has its own favoured wild plants, which is why the herbs are described as varying rather than fixed.",
    },
    {
      author: "Sonia Uvezian",
      title: "The Cuisine of Armenia",
      publisher: "Siamanto Press",
      identifier: { kind: "isbn", value: "9780970971678" },
      note: "The standard English-language account of the Armenian repertoire, cited here for the ordinary range of the dish — the grains and herbs that recur — rather than for any historical claim.",
    },
  ],

  /*
   * §70. Jingalov hats — the section's first bibliography for a dish whose
   * subject is a place, and the first that had to weigh a source's provenance
   * rather than only its quality.
   *
   * Two decisions are recorded here because neither is visible from the list.
   *
   * **Petrosian and Underwood is again not cited, and this time for a different
   * reason than §68's.** There the objection was concentration — five of six
   * existing Cuisine articles rest on it. Here the objection is fit: a general
   * survey of Armenian food and folklore is not where the load-bearing claims of
   * this article live. What this article rests on is one named ethnographer's
   * statements about a specific regional dish, one cultural institution's
   * reporting on a displaced community, and one dated heritage listing. A popular
   * survey adds nothing to any of those, and adding it would take the book to six
   * of eight for no gain.
   *
   * **A genuinely relevant scholarly work was found and deliberately not cited.**
   * V. A. Petrov's `Etnobotanika Nagornogo Karabakha` (Baku, 1940) reports a field
   * expedition of 1934–1937 that recorded about a hundred plant species used in
   * the economy and daily life of Nagorno-Karabakh, indexed under their Russian,
   * Latin, Azerbaijani and Armenian names. It is exactly the kind of source the
   * greens sections would want. It is absent because it could not be consulted —
   * the monograph is not available in any full text reachable from here, and the
   * only descriptions of its contents are catalogue records. Citing a work from a
   * catalogue entry is how a bibliography acquires a source nobody has read, and
   * that is the failure this archive was audited for. Recorded here so the next
   * person to work on Artsakh food knows the source exists and what it would
   * support.
   *
   * On the journalism below: RFE/RL is not carrying the ethnographic claims on its
   * own authority. It names Ruzanna Tsaturian of the Institute of Archaeology and
   * Ethnography, and the article attributes those claims to her by name rather than
   * stating them flatly, which is the correct handling of expertise that reaches
   * print through a reporter.
   */
  "jingalov-hats": [
    {
      author: "Amos Chapple",
      title: "Jingalov Hats: The Flatbread Creating A Lifeline For Armenia's Karabakh Refugees",
      publisher: "RFE/RL",
      year: "5 March 2024",
      identifier: {
        kind: "url",
        value: "https://www.rferl.org/a/jingalov-hats-traditional-karabakh-food-armenia-refugees/32848698.html",
      },
      note: "The single richest source here, and the one that carries the ethnography. It quotes Ruzanna Tsaturian of the Institute of Archaeology and Ethnography of Armenia's National Academy of Sciences on the first textual mentions being about two hundred years old, on the early-spring and autumn seasonality, on the twentieth-century drift towards entertainment food, on the return to it during the shortages of the 1990s, and for the phrase forest bread. It separately reports Ara Zada's figures of twenty-six greens in the original recipe and around seventeen today, the named greens including nettle, and the street-stall economy that grew after 2020 and 2023.",
    },
    {
      author: "Aline Keledjian",
      title:
        "\"Who Are We?\" Maintaining Artsakhtsi Identity After Forced Displacement from Nagorno-Karabakh",
      publisher: "Smithsonian Center for Folklife and Cultural Heritage",
      year: "17 February 2025",
      identifier: {
        kind: "url",
        value: "https://folklife.si.edu/magazine/artsakhtsi-identity-nagorno-karabakh",
      },
      note: "The source for the displacement context and for the article's central observation, which came from it rather than being imposed on it: a woman from Stepanakert saying the same herbs cannot be found in Armenia because they grow in the mountains of Artsakh. Also the source for the ten-to-twenty range, for the unleavened dough rolled flat, and for the continuation of the dish by displaced households in Yerevan. Chosen over general news reporting of the same events because it is a cultural-heritage institution writing about cultural continuity, which is the only aspect of 2023 this article discusses.",
    },
    {
      title: "Zhengyalov Hats Festival in Tsaghkashat on April 29",
      publisher: "Hetq",
      year: "April 2015",
      identifier: { kind: "url", value: "https://hetq.am/en/article/59884" },
      note: "Two dated institutional facts rest on this and nothing else does: that the authorities in Artsakh entered the dish on their register of intangible cultural heritage in 2013, and that the first festival devoted to it was held at Tsaghkashat in the Askeran district in April 2015 under a heritage-preservation programme. It also states independently of Tsaturian that the first mention is in written manuscripts of the nineteenth century, when Artsakh folklore was being collected — two sources converging on the same century is what licenses the article to state it.",
    },
    {
      title:
        "Lavash, the preparation, meaning and appearance of traditional bread as an expression of culture in Armenia",
      publisher:
        "UNESCO Representative List of the Intangible Cultural Heritage of Humanity, no. 00985",
      year: "inscribed 2014",
      identifier: { kind: "url", value: "https://ich.unesco.org/en/RL/00985" },
      note: "Reused from the lavash bibliography, deliberately, for one claim: that lavash is baked by slapping the sheet against the inner wall of a tonir. That is the contrast the griddle section turns on, and it should come from the same record the lavash article uses rather than from a paraphrase of it.",
    },
    {
      title: "Armenia: Creating Home — Foodways",
      publisher: "Smithsonian Folklife Festival, Center for Folklife and Cultural Heritage",
      year: "2018",
      identifier: { kind: "url", value: "https://festival.si.edu/2018/armenia/feasting/foodways" },
      note: "Reused from the spas bibliography for the same claim it supports there: each region has its own favoured wild plants. In spas that explains why the herbs vary; here it is the general statement of which this dish is the strongest single instance.",
    },
  ],

  /*
   * §72. Khash — the first Cuisine bibliography assembled after a live search
   * pass, and the first where the search results were treated as a list of
   * questions rather than as a list of sources.
   *
   * That distinction did most of the work. Almost every page ranking for this
   * dish repeats the same four claims: an eleventh-to-twelfth-century origin, a
   * poor-man's-food class history, a rule about months containing the letter r,
   * and a hangover cure. Each became a research question. Three of the four
   * survive in some form and none of them survives in the form the search
   * results state it, which is the whole reason this article exists.
   *
   * **What the load-bearing claims rest on.** Named scholars, in every case.
   * Nahapetyan for the ritual grouping and for the observation that khash is
   * still not eaten without guests; Tsaturyan, through the Smithsonian, for the
   * absence of evidence that today's ritual predates the Soviet period and for
   * the wedding association; Bayadyan, through Hetq, for the Soviet-era reading;
   * Mamulyan and Antinyan, also through Hetq, for the technique, the toasts and
   * for their disagreement about the class story. Where expertise reaches print
   * through a reporter, the article attributes it to the person by name rather
   * than stating it flatly — the handling settled at §70.
   *
   * **Three refusals, recorded because none of them is visible from the list.**
   *
   * 1. **Mkhitar Heratsi's `Relief of Fevers` is discussed and not cited.** The
   *    claim that it describes khash is in nearly every popular account, and the
   *    work is real, printed since the nineteenth century and translated into
   *    German. But no edition of it was reachable from here, and the attribution
   *    travels from one popular page to the next without a passage attached. The
   *    article therefore reports the claim as a claim and says so in the prose.
   *    Citing the text would assert that it had been read.
   *
   * 2. **No etymological dictionary is cited, and the etymology is short as a
   *    result.** Ačaṙyan's `Հայերեն արմատական բառարան` is the work that would
   *    settle when the noun `խաշ` separates from the verb `խաշել`, and it is
   *    exactly the source §27 of the specification asks for. Nayiri, the archive
   *    that holds it, refused the connection here — the same failure recorded at
   *    §70. Martirosyan's Brill dictionary could not be checked for the entry
   *    either. So the article states the relation between the noun and the verb,
   *    which is uncontroversial and attested in the Armenian sources below, and
   *    explicitly declines to date the word. A dated etymology assembled from
   *    Wiktionary's citation of a dictionary nobody here opened would be the
   *    catalogue-entry failure under a different name.
   *
   * 3. **Petrosian and Underwood is again not cited, for the third consecutive
   *    Cuisine article.** It stands at five of eight and the specification asks
   *    that it not become six of nine by default. It would add nothing here: the
   *    one thing it is quoted for online — that khash is an Armenian institution
   *    with songs written about it — is colour rather than evidence, and Hetq
   *    records the existence of a khash song independently. Every historical,
   *    ethnographic and linguistic claim in this article is carried by a named
   *    scholar or an institutional record.
   *
   * **One entry is scoped rather than refused.** Fertaly's article is the only
   * peer-reviewed study devoted to khash that could be identified, and its
   * bibliographic record is fully verified through Crossref. The full text is
   * paywalled and was not read. It is therefore cited for what its published
   * abstract and title establish — that khash has been analysed as a male
   * gathering and a national narrative — and nothing in the prose is attributed
   * to it beyond that. The distinction from the Petrov refusal at §70 is that
   * there the only description of the work was a catalogue record; here there is
   * a published abstract. It is a narrower claim, and it is marked as one.
   */
  khash: [
    {
      author: "Ռաֆիկ Նահապետյան",
      title: "Հայոց ավանդական ուտեստի էթնոմշակութային բնութագրության շուրջ",
      publisher: "Պատմա-բանասիրական հանդես, Երևան",
      year: "2019",
      identifier: {
        kind: "url",
        value: "https://artsakhlib.am/wp-content/uploads/2020/05/Ռաֆիկ-Նահապետյան-–-Հայոց-ավանդական-ուտեստի-էթնոմշակութային.pdf",
      },
      note: "The strongest source here and the one that answers the question the popular accounts cannot: why khash is never eaten alone. Nahapetyan, an ethnographer at Yerevan State University, groups khash with harissa, milk soup and matagh as ritual dishes dedicated to the powers over farming and livestock — harissa to grain, khash to the success of animal husbandry — and observes that khash and matagh are, in his words, still almost never enjoyed without guests. He also lists khash and khashlama separately among the respected meat dishes, which is the scholarly warrant for keeping the two apart. Read directly, pages 175–199; the ritual passage is on page 191. His antiquity statement is a reconstruction argued from later practice rather than a dated attestation, and the article marks it as one.",
    },
    {
      author: "Kaitlin Fertaly",
      title:
        "Khash, history and Armenian national identity: reconsidering post-socialist gender, food practices and the domestic",
      publisher: "Identities: Global Studies in Culture and Power, 19(1), 81–102",
      year: "2012",
      identifier: { kind: "doi", value: "10.1080/1070289X.2012.672835" },
      note: "The only peer-reviewed study devoted to khash that could be identified. Cited for one thing only, which its published abstract carries: that khash is analysed in the scholarship as a male gathering and as a vehicle for national narratives of resourcefulness, rather than as a recipe. The full text is behind a paywall and was not consulted; the bibliographic record was verified through Crossref. Nothing in the article's prose is attributed to it beyond the scope of that abstract.",
    },
    {
      title: "Խաշ. պատրաստվում է հեթանոսության ժամանակներից",
      publisher: "Հետք",
      year: "22 November 2010",
      identifier: { kind: "url", value: "https://hetq.am/hy/article/48744" },
      note: "The richest single source for practice, and unusual in that it prints a disagreement rather than a consensus. It carries: the letter-ր rule with the reason offered for it; that the cook adds no salt because it darkens the broth; the three toasts in order and one chef's objection that fixing a number misses the point; the Gyumri attachment and the custom of khash on the morning after a wedding; and the alcohol custom. It is also the source for the article's class-history section, because it records Sedrak Mamulyan rejecting the poor-man's-food account outright and Grisha Antinyan comparing it to the story told about pizza. Hrach Bayadyan, a scholar of culture, supplies the Soviet-era reading and — against Mamulyan's claim of unchanged pagan-era continuity — the argument that the rites around the dish change even where the dish does not.",
    },
    {
      author: "Benjamin Kemper",
      title: "How to Cure a Hangover in Armenia? With Cow-Foot Soup",
      publisher: "Smithsonian Center for Folklife and Cultural Heritage",
      year: "21 March 2018",
      identifier: {
        kind: "url",
        value: "https://festival.si.edu/blog/how-to-cure-a-hangover-in-armenia-cow-foot-soup-khash",
      },
      note: "Quotes Ruzanna Tsaturyan of the Institute of Archaeology and Ethnography of Armenia's National Academy of Sciences on the two claims the article leans on hardest: that no evidence has been found for today's khash ritual being widespread before the Soviet period, and that the few historical references that exist characterise khash as wedding food. Also the source for the gendered history and its recent change, for the two kinds of lavash at the table, for the garlic quantity, and for the observation that a nine o'clock gathering obliges the cook to start overnight. Chosen over the same author's magazine piece because this is the institution's own folklife programme.",
    },
    {
      author: "Etrat Elahi",
      title: "KALLA-PĀČA",
      publisher: "Encyclopaedia Iranica",
      year: "15 December 2010",
      identifier: { kind: "doi", value: "10.1163/2330-4804_EIRO_COM_611" },
      note: "The regional comparison rests entirely on this, and it is a scholarly reference work rather than a food page, which is why the comparison could be made at all. It supplies: head and trotters cooked over low heat, usually overnight; reserved for the colder days of the year; served in the morning; salted only at the end because salt blackens the meat; made in specialist shops with their own guild rather than at home; and served with vinegar, onion or crushed garlic in a nineteenth-century account. The salt detail arriving independently here and in Hetq is what let the article treat the shared features as consequences of the food rather than as borrowing in either direction.",
    },
    {
      title: "Intangible Cultural Heritage",
      publisher:
        "Ministry of Education, Science, Culture and Sport of the Republic of Armenia",
      year: "consulted 2026",
      identifier: { kind: "url", value: "https://escs.am/en/static/intangible-cultural-heritage" },
      note: "Carries one claim, and it is a claim about an absence: khash does not appear on Armenia's national inventory of intangible cultural heritage, although lavash, gata, matsun, tolma, winemaking and fruit-spirit distilling do. Checked twice and in two languages, against the ministry's own page and against the published enumeration of the inventory, because an absence stated from a single reading of a single list is not a checked fact.",
    },
    {
      title:
        "Lavash, the preparation, meaning and appearance of traditional bread as an expression of culture in Armenia",
      publisher:
        "UNESCO Representative List of the Intangible Cultural Heritage of Humanity, no. 00985",
      year: "inscribed 2014",
      identifier: { kind: "url", value: "https://ich.unesco.org/en/RL/00985" },
      note: "Reused from the lavash bibliography for one claim, as at §70: that lavash is dried, keeps for months and is brought back with water. That property is why dried lavash can be crumbled into a bowl of khash as though it were an ingredient, which is the link between the two articles and the reason the relation is authored rather than filled in.",
    },
  ],

  /*
   * §74. Matsun — and the first Cuisine bibliography in which the strongest
   * source is a dictionary this archive had twice recorded as unreachable.
   *
   * **The Ačaṙyan debt is closed.** §70 and §72 both had to shorten an etymology
   * section because `Հայերեն արմատական բառարան` could not be consulted: nayiri,
   * the archive that hosts it, refused the connection on both occasions, and both
   * steps recorded the gap rather than reconstructing the word history from
   * secondary discussion. The dictionary turns out to be on the Internet Archive,
   * scanned and OCR'd, and volume three carries `մած-`. It was read directly for
   * this article, and it is the source of the etymology section — including the
   * observation the section turns on, which is Ačaṙyan's own and not this
   * archive's: that Persian, Turkish and French each named their fermented milk
   * after the verb for curdling, exactly as Armenian did. That is a scholar of
   * the language pre-emptively dismantling the ownership argument, and it is
   * worth more than any amount of editorial even-handedness.
   *
   * **Two refusals and one scoping decision.**
   *
   * 1. **Grigor Magistros is discussed and not cited.** Every popular page says
   *    matsun is mentioned by Armenian writers from the eleventh century. What is
   *    actually at the end of that chain is Magistros's grammatical treatise
   *    giving an *etymology* of the word, reported through a philological study of
   *    1915 that could not be consulted here. The article therefore reports the
   *    claim at one remove and says so in the prose, and no entry below pretends
   *    the underlying works were read. Note that Magistros was the same name
   *    recycled through the khash claim at §72 — a grammarian is being used as a
   *    culinary witness twice over, in two different food literatures.
   *
   * 2. **No commercial dairy source is cited at all.** The SERP for this topic is
   *    unusually contaminated with product pages, and several of them carry
   *    origin, antiquity and health claims. They are useful only for establishing
   *    that matsun is a normal retail product today, which is not a fact that
   *    needs a citation. None appears here.
   *
   * 3. **Slow Food is cited and scoped.** It is a food-heritage organisation, not
   *    a scholarly one, and its entry opens with the claim that matsun "is
   *    mentioned in many tales by Armenian writers since the 11th century" — the
   *    sentence the article exists partly to take apart. It is cited for what it
   *    is good for: a specific description of a specific regional practice in
   *    Lori, the meran starter, and the two keeping forms. It carries no
   *    chronology and no origin claim in this article, and the prose attributes
   *    its process description to it by name rather than stating it flatly.
   *
   * **Petrosian and Underwood is again not cited** — the fourth consecutive
   * Cuisine article. It stays at five of ten rather than becoming six of ten. It
   * would add nothing: the etymology is Ačaṙyan's, the microbiology is
   * peer-reviewed, the heritage status is the ministry's own, and the regional
   * practice is Slow Food's. A general survey of Armenian food and folklore has no
   * load to carry here.
   *
   * **No health claim rests on anything below, because the article makes none.**
   * The microbiology entry is cited for what lives in matsun and for how the
   * community varies by region. It is not cited, and must not later be used, for
   * any statement about what eating it does to a person.
   */
  matsun: [
    {
      author: "Հրաչյա Աճառյան",
      title: "Հայերեն արմատական բառարան, հատոր Գ",
      publisher: "Երևանի համալսարանի հրատարակչություն",
      year: "1926–1935; reprinted 1971–1979",
      identifier: { kind: "url", value: "https://archive.org/details/Hrarm3" },
      note: "Read directly, in the Internet Archive's scan, after two earlier steps recorded this work as unreachable. The entry for the root մած- gives the sense — to stick, to cling, to thicken, and of milk to curdle — classes մածուն as a native Armenian word from an Indo-European root meaning to knead or work into a sticky mass, lists the Slavic, Greek and Germanic cognates, and records the classical texts in which մածուն is attested. It is also the source of the article's central linguistic observation: Ačaṙyan himself sets Persian māsīdan/māst, Turkish yoğurmak/yoghurt and French cailler/lait caillé beside the Armenian pair, showing the naming pattern to be a widespread independent parallel rather than evidence of priority.",
    },
    {
      author:
        "Nicholas A. Bokulich, Lia Amiranashvili, Karine Chitchyan, Narine Ghazanchyan, Karen Darbinyan, Nino Gagelidze et al.",
      title: "Microbial biogeography of the transnational fermented milk matsoni",
      publisher: "Food Microbiology, 50, 12–19",
      year: "2015",
      identifier: { kind: "doi", value: "10.1016/j.fm.2015.01.018" },
      note: "The scientific spine of the article, and the reason its regional section could be written as evidence rather than as diplomacy. Marker-gene sequencing of matsun and matsoni from across Armenia and Georgia: bacteria dominated by Lactobacillus and Streptococcus, yeasts including Kluyveromyces marxianus, Candida famata and Saccharomyces cerevisiae varying sharply by place, and both production region and milk type shaping the community. Its conclusion — that traditional production preserves the transfer of a distinctive regional population from batch to batch — is what turns the back-slopped starter from a nice story into a measured finding. Its title calls the food transnational and its author list contains researchers from both countries, which is the strongest available answer to the ownership question and was not manufactured by this archive.",
    },
    {
      title: "Intangible Cultural Heritage",
      publisher: "Ministry of Education, Science, Culture and Sport of the Republic of Armenia",
      year: "consulted 2026",
      identifier: { kind: "url", value: "https://escs.am/en/static/intangible-cultural-heritage" },
      note: "Reused from the khash bibliography, where it carried an absence; here it carries a presence. Matsun appears on Armenia's national inventory of intangible cultural heritage as Մածունի պատրաստման ու կիրառման ավանդույթը — the tradition of the preparation and use of matsun — filed under national cuisine. Checked in both languages against the ministry's page and the published enumeration of the inventory, because the article's whole heritage section turns on this being a national listing and not an international one.",
    },
    {
      title:
        "Lavash, the preparation, meaning and appearance of traditional bread as an expression of culture in Armenia",
      publisher:
        "UNESCO Representative List of the Intangible Cultural Heritage of Humanity, no. 00985",
      year: "inscribed 2014",
      identifier: { kind: "url", value: "https://ich.unesco.org/en/RL/00985" },
      note: "Cited for the negative claim rather than the positive one, which is unusual and deliberate: lavash is the only Armenian food on the UNESCO Representative List, and matsun is not on it. The article's heritage section distinguishes the national inventory from the international list, and the cleanest way to make that concrete is to name the one food that is on both kinds of list and observe that matsun is on only one.",
    },
    {
      title: "Matsun",
      publisher: "Slow Food Foundation for Biodiversity, Ark of Taste",
      year: "consulted 2026",
      identifier: {
        kind: "url",
        value: "https://www.fondazioneslowfood.com/en/ark-of-taste-slow-food/matsun/",
      },
      note: "Scoped, as the comment above sets out. Cited for the association with Lori, for matsun as part of the daily diet, for the meran starter of dried cornelian cherries with wheat and rye, and for the two keeping forms — kamats matsun, drained and stored in clay, and the dried balls that keep for years. Explicitly NOT cited for its opening chronology, which repeats the eleventh-century claim the article takes apart. A heritage organisation describing a living regional practice is doing what it is good at; the same page dating the food is not.",
    },
    {
      title: "Colombo Yogurt: A Massachusetts Success Story",
      publisher: "Massachusetts Historical Society, Object of the Month",
      year: "June 2004",
      identifier: {
        kind: "url",
        value:
          "https://www.masshist.org/object-of-the-month/objects/colombo-yogurt-a-massachusetts-success-story-2004-06-01",
      },
      note: "The source for the 1929 date and for the detail the article ends on: that Sarkis and Rose Colombosian sold their household matsun in Andover under the Armenian word, and that the name on the container later became yogurt because that was the word the American market knew. Chosen over the several diaspora and tourism retellings of the same story because it is a historical society writing from an object in its own collection. The food crossing intact while the word did not is the article's argument about terminology, made as an event rather than as an assertion.",
    },
  ],

  /* ----------------------------------------------------------------- places */

  /*
   * A place article makes two different kinds of claim, and they need different
   * kinds of source. What the site *is* — where it stands, when it was built,
   * what survives — is architectural and geographic. What is *remembered* there
   * is a narrative tradition, and the narrative is later than the events it
   * describes. The first two entries below are the same Agathangelos and
   * Garsoïan already cited by `adoption-of-christianity`, deliberately: Khor
   * Virap's tradition and that article's subject rest on the same two texts, and
   * citing a different pair for the same claim would imply a second, independent
   * body of evidence that does not exist.
   */

  "khor-virap": [
    {
      author: "Agathangelos, trans. and comm. R. W. Thomson",
      title: "History of the Armenians",
      publisher: "State University of New York Press, Albany",
      year: "1976",
      identifier: { kind: "isbn", value: "9780873953238" },
      note: "The fifth-century narrative in which Gregory is imprisoned in the pit at Artashat. It is the source of the tradition attached to this site, and it was written well over a century after the events it describes.",
    },
    {
      author: "Nina G. Garsoïan",
      title: "Studies on the Formation of Christian Armenia",
      publisher: "Variorum / Ashgate",
      year: "2010",
      identifier: { kind: "isbn", value: "9781409403661" },
      note: "Cited for the critical treatment of the conversion narrative and its dating, which is what keeps the tradition at this site described as tradition.",
    },
    {
      author: "Robert H. Hewsen",
      title: "Armenia: A Historical Atlas",
      publisher: "University of Chicago Press",
      year: "2001",
      identifier: { kind: "isbn", value: "9780226332284" },
      note: "The standard historical geography of the Armenian lands; cited here for the position of Artashat on the Ararat plain and for the setting of the site.",
    },
    {
      author: "Christina Maranci",
      title: "The Art of Armenia: An Introduction",
      publisher: "Oxford University Press",
      year: "2018",
      identifier: { kind: "isbn", value: "9780190269005" },
      note: "A survey of Armenian architecture and its periods; cited for the building history of the monastery rather than for the tradition.",
    },
  ],

  /*
   * Etchmiadzin needs a third kind of source that Khor Virap did not. Beyond the
   * tradition and the fabric, this site is a working institution with a present
   * tense — a see, a seminary, a treasury — and the body that runs it publishes
   * its own account of itself. That account is cited here for what the Mother See
   * currently *is* and not for anything historical: an institution is a reliable
   * source on its own organisation and an interested one on its own antiquity.
   * The dating and the tradition are carried by Agathangelos, Garsoïan, Maranci
   * and Hovannisian below, exactly as they are for Khor Virap.
   */
  "etchmiadzin-cathedral": [
    {
      author: "Agathangelos, trans. and comm. R. W. Thomson",
      title: "History of the Armenians",
      publisher: "State University of New York Press, Albany",
      year: "1976",
      identifier: { kind: "isbn", value: "9780873953238" },
      note: "The fifth-century narrative containing the vision of the Only Begotten that gives the cathedral its name. It is the source of the foundation tradition and was written well over a century after the events it describes.",
    },
    {
      author: "Nina G. Garsoïan",
      title: "Studies on the Formation of Christian Armenia",
      publisher: "Variorum / Ashgate",
      year: "2010",
      identifier: { kind: "isbn", value: "9781409403661" },
      note: "Cited for the critical treatment of the conversion narrative and its dating, which is what keeps the foundation date described here as tradition.",
    },
    {
      author: "Christina Maranci",
      title: "The Art of Armenia: An Introduction",
      publisher: "Oxford University Press",
      year: "2018",
      identifier: { kind: "isbn", value: "9780190269005" },
      note: "Cited for the building history: the cruciform domed plan of the fifth-century rebuilding and the seventeenth-century dome and belfry, set against the wider periods of Armenian architecture.",
    },
    {
      author: "Richard G. Hovannisian (ed.)",
      title:
        "The Armenian People from Ancient to Modern Times, Volume I: The Dynastic Periods, from Antiquity to the Fourteenth Century",
      publisher: "Palgrave Macmillan",
      year: "2004",
      identifier: { kind: "isbn", value: "9781403966360" },
      note: "Cited for the institutional history — the organisation of the church after the conversion and the movement of the catholicosal see away from Vagharshapat and back.",
    },
    {
      author: "Robert H. Hewsen",
      title: "Armenia: A Historical Atlas",
      publisher: "University of Chicago Press",
      year: "2001",
      identifier: { kind: "isbn", value: "9780226332284" },
      note: "The standard historical geography of the Armenian lands; cited here for Vagharshapat's position and its standing as a royal centre before the cathedral was founded.",
    },
    {
      title: "Cathedral and Churches of Echmiatsin and the Archaeological Site of Zvartnots",
      publisher: "UNESCO World Heritage List, no. 1011",
      year: "inscribed 2000",
      identifier: { kind: "url", value: "https://whc.unesco.org/en/list/1011/" },
      note: "The inscription covers the cathedral, the churches of Hripsime, Gayane and Shoghakat, and the ruins of Zvartnots as one property. \"Echmiatsin\" is UNESCO's own spelling in the official property name and is kept here as cited; the archive's prose uses Etchmiadzin throughout.",
    },
    {
      title: "Mother See of Holy Etchmiadzin — official site",
      publisher: "Mother See of Holy Etchmiadzin, Vagharshapat",
      identifier: { kind: "url", value: "https://www.armenianchurch.org/en/mother-see" },
      note: "Cited only for the present-day institution: the office of the Catholicos of All Armenians, the Gevorgian Theological Seminary, and the museums and library inside the precinct.",
    },
  ],

  /*
   * Erebuni is the first place article whose subject predates the written
   * tradition the other two rest on, so the shape of its bibliography is
   * different: there is no narrative source to weigh against the fabric, because
   * the fabric *is* the source. Four of these six are the same works the
   * `kingdom-of-urartu` article cites, reused deliberately rather than replaced
   * with parallel titles — the fortress and the kingdom are supported by one body
   * of evidence, and citing a second set for the same claims would imply
   * independent corroboration that does not exist.
   *
   * The two additions are what this article needs and that one did not. Salvini's
   * corpus is where the foundation inscription is edited, so it carries every
   * statement about what the text actually says; Deschamps reports the recent
   * excavation programme at the site itself, which is what allows the article to
   * separate the record from the interpretation built on it.
   */
  "erebuni-fortress": [
    {
      author: "Mirjo Salvini",
      title: "Corpus dei testi urartei",
      publisher: "CNR, Istituto di Studi sulle Civiltà dell'Egeo e del Vicino Oriente, Rome",
      year: "2008–",
      identifier: { kind: "isbn", value: "9788878900257" },
      note: "The standard edition of the Urartian royal inscriptions, including the Erebuni foundation texts. Cited for what the inscription records — the builder, the name, the purpose and the settling of the garrison — and for the fact that it carries no year.",
    },
    {
      author: "Paul E. Zimansky",
      title: "Ancient Ararat: A Handbook of Urartian Studies",
      publisher: "Caravan Books, Delmar NY",
      year: "1998",
      identifier: { kind: "isbn", value: "9780882060910" },
      note: "Cited for Urartian chronology and for the reconstruction that places the foundation of Erebuni in 782 BC by way of Argishti I's reign and the Assyrian synchronisms it depends on.",
    },
    {
      author: "S. Kroll, C. Gruber, U. Hellwag, M. Roaf and P. Zimansky (eds.)",
      title:
        "Biainili-Urartu: The Proceedings of the Symposium Held in Munich 12–14 October 2007",
      publisher: "Peeters, Leuven — Acta Iranica 51",
      year: "2012",
      identifier: { kind: "isbn", value: "9789042924383" },
      note: "Thirty scholars on the current state of Urartian archaeology; cited for the fortress system of the Ararat plain, the citadel building types — palace, temple, susi tower, storerooms — and the end of the kingdom.",
    },
    {
      author: "Stéphane Deschamps",
      title: "Erebuni in the context of Urartean fortresses in the Ararat plain: Sources and problems",
      publisher: "Quaternary International 395, Elsevier",
      year: "2016",
      identifier: { kind: "doi", value: "10.1016/j.quaint.2015.08.056" },
      note: "Reports the Franco-Armenian excavations at Erebuni from 2008 onwards and reconsiders the chronology of the three Urartian fortresses of the plain — Erebuni, Argishtikhinili and Teishebaini. Cited for the excavation history and for what the site's archaeology does and does not establish.",
    },
    {
      author: "Boris B. Piotrovsky",
      title: "The Ancient Civilization of Urartu",
      publisher: "Cowles, New York",
      year: "1969",
      identifier: { kind: "url", value: "https://search.worldcat.org/title/22421" },
      note: "Piotrovsky directed the Karmir Blur excavations from 1939 to 1971. Cited here for Teishebaini, the neighbouring fortress that carried the administrative weight of the plain in the seventh century BC.",
    },
    {
      title: "Erebuni Historical and Archaeological Museum-Reserve",
      publisher: "Erebuni Historical and Archaeological Museum-Reserve, Yerevan",
      year: "founded 1968",
      identifier: { kind: "url", value: "https://erebuni-museum.mus.am/en/" },
      note: "The institution that holds the foundation inscription and the finds from Arin Berd, and administers the site. Cited for the museum-reserve itself and for the date it uses for the fortress — an institution is a reliable source on its own holdings.",
    },
  ],

  /*
   * The Matenadaran needs its sources sorted by *which* history they support,
   * because the article's whole argument is that three histories are routinely
   * collapsed into one: the manuscript culture, the collection, and the modern
   * institution.
   *
   * The institute's own historical review carries the institutional chronology —
   * the 1920 decree, the 1939 transfer, the building, 1959, 1962, 2011 — because
   * an organisation is the best source on its own administrative record and
   * publishes it in dated form. UNESCO carries the 1997 inscription and the
   * figure attached to it. Mathews/Wieck and Sanjian carry the manuscripts
   * themselves, which no institutional page is a substitute for: illumination and
   * making in the first, colophons as a historical source in the second. Maranci
   * and Terian are already registered here for other articles and are cited again
   * for the same reason the place articles reuse Agathangelos — one body of
   * evidence, not two.
   *
   * Deliberately not used: the tourism pages that dominate a search for this
   * subject. Several give a single confident "founded in" date, and they disagree
   * with each other because each has picked a different one of the events above.
   */
  matenadaran: [
    {
      title: "Historical Review — Mesrop Mashtots Institute of Ancient Manuscripts (Matenadaran)",
      publisher: "Matenadaran, Yerevan",
      identifier: {
        kind: "url",
        value: "https://matenadaran.am/en/matenadaran/research-institute/historical-review/",
      },
      note: "The institute's own account of its history. Cited for the institutional chronology only — the Etchmiadzin library and its catalogues, the evacuation to Moscow, the nationalisation of 1920, the transfer of 1939, Mark Grigoryan's building, the reorganisation of 1959, the naming of 1962 and the research building of 2011.",
    },
    {
      title: "Mashtots Matenadaran ancient manuscripts collection",
      publisher: "UNESCO Memory of the World Register",
      year: "inscribed 1997",
      identifier: {
        kind: "url",
        value: "https://www.unesco.org/en/memory-world/mashtots-matenadaran-ancient-manuscripts-collection",
      },
      note: "The Memory of the World programme registers documentary heritage rather than buildings or sites, which is why this inscription is not comparable to the World Heritage listing cited for Etchmiadzin. Its entry describes a collection of about seventeen thousand manuscripts — the figure quoted in the article beside the institution's own, higher one.",
    },
    {
      author: "Thomas F. Mathews and Roger S. Wieck (eds.)",
      title: "Treasures in Heaven: Armenian Illuminated Manuscripts",
      publisher: "Pierpont Morgan Library / Princeton University Press",
      year: "1994",
      identifier: { kind: "isbn", value: "9780691037516" },
      note: "Catalogue of the 1994 Morgan Library exhibition, and the standard English-language introduction to Armenian manuscript illumination. Cited for the making of the books — scripts, bindings, pigments, canon tables, workshops — rather than for anything about the institution.",
    },
    {
      author: "Avedis K. Sanjian",
      title: "Colophons of Armenian Manuscripts, 1301–1480: A Source for Middle Eastern History",
      publisher: "Harvard University Press, Harvard Armenian Texts and Studies 2",
      year: "1969",
      identifier: { kind: "isbn", value: "9780674142855" },
      note: "The work that established Armenian colophons as a historical source in their own right. Cited for what a hishatakaran records and for the claim that these manuscripts are read by historians who do not read Armenian. Also registered for Geghard. Harvard's digital edition of the same volume carries DOI 10.4159/harvard.9780674432635, checked against Crossref and confirmed as this work; the ISBN above is kept as the identifier because the 1969 print volume is the edition cited.",
    },
    {
      author: "Christina Maranci",
      title: "The Art of Armenia: An Introduction",
      publisher: "Oxford University Press",
      year: "2018",
      identifier: { kind: "isbn", value: "9780190269005" },
      note: "Already registered for the two monastery articles. Cited here for manuscript illumination in the wider development of Armenian art, which is what keeps the illumination section from reading as though the books existed apart from everything else made around them.",
    },
    {
      author: "Abraham Terian (trans.)",
      title:
        "The Life of Mashtots' by His Disciple Koriwn: Translated from the Classical Armenian with Introduction and Commentary",
      publisher: "Oxford University Press",
      year: "2022",
      identifier: { kind: "isbn", value: "9780192847416" },
      note: "Already registered for the alphabet article. Cited here for the fifth-century starting point the institute takes its name from: Mashtots, the schools and the translation work that produced the first Armenian books.",
    },
  ],

  /*
   * Lake Sevan is the first article here whose subject is measured rather than
   * recorded, and the bibliography is sorted by *what kind of claim* each source
   * can carry — because the article's argument is that six different kinds are
   * routinely quoted in one breath.
   *
   * The National Park page is the management body under the Ministry of
   * Environment, and it carries the physical description and the operating
   * figures: elevation, area, volume, the twenty-eight inflowing rivers, the
   * Hrazdan as sole outflow, and the size of the drawdown. An agency is a good
   * source on the water body it administers and a poor one on whether its own
   * policy is working, so it is used for the first and not the second.
   *
   * Ramsar carries the wetland designation and nothing else. Hovanesian and
   * Bronozian carry the engineering history and the state of the restoration
   * argument as it stood in the mid-1990s — a contemporary account of the
   * problem, not a current status report, which is why the article dates it.
   * Barseghyan and colleagues, at the Scientific Center of Zoology and
   * Hydroecology of the Armenian Academy of Sciences, carry everything said about
   * the trout; nothing about fish in this article goes beyond them. Stapanian
   * carries the fact that the shoreline is monitored from orbit because it moves.
   * Hewsen, already registered three times over, carries the lake's position in
   * the highland and its place in historical settlement.
   *
   * Deliberately not used: the travel and resort pages that dominate a search for
   * this subject. Several state a single fixed surface area and a single fixed
   * depth, which is the specific error this article exists to avoid — those
   * numbers are functions of the water level, and the water level has moved by
   * about nineteen metres within living memory.
   */
  "lake-sevan": [
    {
      title: "Lake Sevan — \"Sevan\" National Park SNCO",
      publisher: "Ministry of Environment of the Republic of Armenia, Yerevan",
      identifier: { kind: "url", value: "https://sevan-park.am/en/2019/03/29/lake-sevan/" },
      note: "The management body's own description of the lake it administers. Cited for the physical figures and their framing — surface elevation, present and historical area, volume and depth, the basin, the twenty-eight inflowing rivers, the Hrazdan as the only outflow, the proportion of water lost to evaporation, and the extent of the twentieth-century drawdown.",
    },
    {
      title: "Lake Sevan — Ramsar Site no. 620",
      publisher: "Ramsar Sites Information Service, Convention on Wetlands",
      year: "designated 1993",
      identifier: { kind: "url", value: "https://rsis.ramsar.org/ris/620" },
      note: "Cited only for the designation itself: the lake and its basin were listed as a Wetland of International Importance in June 1993. The Convention registers wetlands for their ecological function, which is a different kind of recognition from the World Heritage listing cited for Etchmiadzin or the Memory of the World inscription cited for the Matenadaran.",
    },
    {
      author: "Rafael Hovanesian and Harry Bronozian",
      title: "Restoration and Management of Lake Sevan in Armenia: Problems and Prospects",
      publisher: "Lake and Reservoir Management 9(1), 178–182, North American Lake Management Society",
      year: "1994",
      identifier: { kind: "doi", value: "10.1080/07438149409354754" },
      note: "A contemporary account of the engineering programme and of what it had by then produced. Cited for the sequence of interventions — the outlet tunnel, the Sevan–Hrazdan cascade, the Arpa–Sevan diversion — and for the state of the restoration argument in the mid-1990s. Dated in the article rather than quoted as current, because a 1994 assessment of a continuing problem is evidence about 1994.",
    },
    {
      author:
        "Nelli Barseghyan, Tigran Vardanyan, Marine Dallakyan, Liana Poghosyan, Satenik Galstyan, Roza Barseghyan and Vardan Asatryan",
      title:
        "Unveiling Priority Actions and Opportunities for the Restoration of Endemic Trout (Salmo ischchan Kessler, 1877) in Lake Sevan",
      publisher: "Hydrobiology 5(2), article 9, MDPI — Scientific Center of Zoology and Hydroecology, National Academy of Sciences of Armenia",
      year: "2026",
      identifier: { kind: "doi", value: "10.3390/hydrobiology5020009" },
      note: "The whole of what this article says about fish rests here: the endemic trout and its historical forms, the loss of spawning grounds as the level fell, the introduced whitefish and crayfish, and the restoration work now attempted. Cited rather than paraphrased loosely because the status of each form is precisely the thing that gets stated too confidently elsewhere.",
    },
    {
      author: "Martin A. Stapanian",
      title: "QuickBird satellite imagery as a tool for restoration and rehabilitation of Lake Sevan, Armenia",
      publisher: "Hydrobiologia 661(1), 81–83, Springer",
      year: "2010",
      identifier: { kind: "doi", value: "10.1007/s10750-010-0513-3" },
      note: "Cited for one claim only, and a telling one: the shoreline of this lake is monitored from orbit because it is not fixed. A coast that has to be re-surveyed as the water rises is a different object from the coastline on an old map.",
    },
    {
      author: "Robert H. Hewsen",
      title: "Armenia: A Historical Atlas",
      publisher: "University of Chicago Press",
      year: "2001",
      identifier: { kind: "isbn", value: "9780226332284" },
      note: "Already registered for three other articles. Cited here for the lake's position within the Armenian Highland and for the historical geography of the basin — the districts around it, and the routes that made a high closed basin worth settling.",
    },
  ],
  "garni-temple": [
    {
      author: "Emanuela Guidoboni, Ruben Haroutiunian and Aleksandr Karakhanian",
      title: "The Garnì (Armenia) large earthquake on 14 June 1679: a new analysis",
      publisher: "Journal of Seismology 7(3), 301–328, Kluwer Academic Publishers",
      year: "2003",
      identifier: { kind: "doi", value: "10.1023/A:1024561622879" },
      note: "The whole of what this article says about the earthquake rests here: the epicentre near the gorge, the collapse of the colonnade, the equivalent magnitude and the epicentral intensity. The paper's title dates the event to 14 June and Armenian tradition to 4 June; the ten-day gap is the Julian-to-Gregorian difference, and both dates are given in the article rather than one being silently preferred.",
    },
    {
      title: "The Archaeological Complex of Garni and the \"Basalt Organ\" Columnar Joint",
      publisher: "UNESCO World Heritage Centre, Tentative Lists, ref. 6808",
      year: "submitted 2025",
      identifier: { kind: "url", value: "https://whc.unesco.org/en/tentativelists/6808/" },
      note: "Cited only for the designation, and for the distinction the article draws: Garni is on Armenia's *tentative* list, not the World Heritage list. Geghard and the Upper Azat Valley, eight kilometres up the same valley, are inscribed — and Garni is not part of that inscription, which is the commonest error made about its status.",
    },
    {
      author: "R. D. Wilkinson",
      title: "A Fresh Look at the Ionic Building at Garni",
      publisher: "Revue des Etudes Armeniennes, New Series 16, 221-244, Paris",
      year: "1982",
      identifier: { kind: "url", value: "https://www.worldcat.org/search?q=Revue+des+Etudes+Armeniennes+16+1982" },
      note: "The tomb hypothesis at its source: a mausoleum of about AD 175 rather than a temple, argued from the funerary architecture of western Asia Minor, nearby graves of that date and sarcophagus fragments. Print-only, with no DOI and no digital edition, which is why the identifier here is a catalogue search rather than a link to the article. Two title forms circulate — Russell cites it as 'The Ionic Building at Garni' — and the longer one is used here. Not consulted directly; its argument is taken from Russell, who cites it approvingly, and from the summaries in the literature.",
    },
    {
      author: "James R. Russell",
      title: "Zoroastrianism in Armenia",
      publisher: "Harvard Iranian Series 5, Department of Near Eastern Languages and Civilizations, Harvard University, and NAASR, Cambridge MA",
      year: "1987",
      identifier: { kind: "isbn", value: "9780674968509" },
      note: "The standard treatment of Armenian pre-Christian religion, and the reason this article will not call the building a temple of Mihr outright. Russell writes that nothing supports that identification except the inscription, that one cannot be certain the inscription refers to the building, and that the only Armenian temple of Mihr known beyond doubt is the shrine at Bagayarich in Derjan. He endorses Wilkinson. Worth knowing that he is not wholly consistent: elsewhere in the same book he refers in passing to a temple built by Trdat I at Garni.",
    },
    {
      author: "Alain Bresson and Elizabeth Fagan",
      title: "The Greek Inscription from Garni (Armenia) and King Tiridates the Great. Part I. Prolegomena",
      publisher: "Vestnik drevnei istorii / Journal of Ancient History 82(3), Russian Academy of Sciences",
      year: "2022",
      identifier: { kind: "doi", value: "10.31857/s032103910017253-1" },
      note: "The recent revision, and the reason the dating section ends where it does: Bresson and Fagan argue that the Tiridates of the inscription is Trdat the Great rather than Trdat I, which would move the text to the early fourth century. Part II (82(4), DOI 10.31857/s032103910023594-6) carries the new critical edition. Cited as a live argument, not as a conclusion — the conventional attribution remains the majority view.",
    },
    {
      author: "Armenuhi Magarditchian",
      title: "Garni: temple romain - baptistere chretien",
      publisher: "Revue des Etudes Armeniennes 37, 173-211, Peeters, Leuven",
      year: "2016-2017",
      identifier: { kind: "doi", value: "10.2143/REA.37.0.3237123" },
      note: "The single claim this supports is the one made about it in the article: that a study has argued, from an early Armenian inscription inside the cella, that the room was used as a baptistery. One study, offered as a hypothesis.",
    },
    {
      author: "Christina Maranci",
      title: "The Art of Armenia: An Introduction",
      publisher: "Oxford University Press, New York",
      year: "2018",
      identifier: { kind: "isbn", value: "9780190269005" },
      note: "Cited for one thing only, and only because it is genuinely there: her survey treats the building at pages 26-27 as of unclear function and raises a funerary reading. A general history of Armenian art declining to call it a temple is a useful measure of how open the question is.",
    },
    {
      author: "Tacitus, trans. John Jackson",
      title: "Annals: Books 4-6, 11-12",
      publisher: "Harvard University Press, Loeb Classical Library 312",
      year: "1937",
      identifier: { kind: "isbn", value: "9780674993457" },
      note: "The earliest secure notice of the place. Tacitus names the stronghold of Gorneas in his account of the Roman-Parthian struggle over Armenia, which is what puts a garrison on this promontory in the first century independently of anything argued about the standing building.",
    },
    {
      author: "Richard G. Hovannisian (ed.)",
      title:
        "The Armenian People from Ancient to Modern Times, Volume I: The Dynastic Periods, from Antiquity to the Fourteenth Century",
      publisher: "Palgrave Macmillan",
      year: "2004",
      identifier: { kind: "isbn", value: "9781403966360" },
      note: "Already registered for several other articles. Cited here for the first-century political frame only — the Arsacid kingdom between Rome and Parthia, the war over the Armenian throne and the settlement that had Trdat I crowned by Nero. Not cited for anything about the building.",
    },
    {
      author: "Robert H. Hewsen",
      title: "Armenia: A Historical Atlas",
      publisher: "University of Chicago Press",
      year: "2001",
      identifier: { kind: "isbn", value: "9780226332284" },
      note: "Already registered for four other articles. Cited here for the historical geography of the Azat valley and for the dating of the round church of Surb Sion beside the temple, which Hewsen places across a range from the seventh to the tenth century rather than at the single early date usually quoted.",
    },
    {
      author: "Jona Lendering",
      title: "Gorneae / Garni — temple, bathhouse and Greek inscription",
      publisher: "Livius.org, Amsterdam",
      identifier: { kind: "url", value: "https://www.livius.org/articles/place/gorneae-garni/" },
      note: "A scholarly reference site rather than a peer-reviewed publication, and cited as such — for the text and translation of the inscription of Trdat I, for the reading of Helios as a royal title rather than a theonym, for the two possible counts of the eleventh regnal year, and for the bath, its hypocaust and the labelled figures of its mosaic. Where it advances the mausoleum reading it is reporting Wilkinson and Russell, and those are cited on their own account above.",
    },
  ],
  "geghard-monastery": [
    {
      author: "Alexandr Sahinian, Armen Manoukian and T. A. Aslanian",
      title: "G(h)eghard",
      publisher: "Documents of Armenian Architecture / Documenti di Architettura Armena 6, Edizioni Ares, Milan",
      year: "1973",
      identifier: { kind: "url", value: "https://archive.org/details/daa-06-geghard-1973" },
      note: "The survey ICOMOS itself worked from, produced by the faculty of architecture of the Politecnico di Milano with the Armenian Academy of Sciences. Its inscription-by-inscription chronology carries most of the dates in this article: the cross-stone of 1164 and the texts of 1177, 1181 and 1200 on the chapel outside the walls, the 1215 south-portal inscription naming Zakare and Ivane with their sons, the chapels of 1225, the 1283 and 1288 inscriptions of the Proshyans, and the 1291 inscription of Mkhitar of Ayrivank. Two cautions, and they are why this article does not simply follow it. It has no bibliography, so it reports rather than argues; and its own chronology contains an entry dating Prince Prosh's work to about 1214, which is impossible and which the same volume contradicts in its 1283 entry. That error is the likeliest origin of the 1215 acquisition date still in print.",
    },
    {
      title: "Monastery of Geghard and the Upper Azat Valley",
      publisher: "UNESCO World Heritage List, no. 960",
      year: "inscribed 2000",
      identifier: { kind: "url", value: "https://whc.unesco.org/en/list/960/" },
      note: "Cited for the designation itself and for criterion (ii) alone: Armenia proposed criteria (i), (ii) and (vi), and only (ii) was adopted, so the two concerning unique artistic achievement and religious significance are rejected nominations rather than UNESCO findings. It is deliberately not used as an authority on chronology or scholarship. Its Statement of Outstanding Universal Value dates Simeon Ayrivanetsi to the thirteenth century when the notices put him around 1400, places the oldest chapel on the western side where its own advisory evaluation places it east, and gives the spear five hundred years at the monastery without a source.",
    },
    {
      title: "Advisory Body Evaluation (ICOMOS), Monastery of Geghard, no. 960",
      publisher: "ICOMOS for the UNESCO World Heritage Committee",
      year: "2000",
      identifier: { kind: "url", value: "https://whc.unesco.org/archive/advisory_body_evaluation/960.pdf" },
      note: "Older and fuller than the Statement of Outstanding Universal Value, and the two disagree often enough that citing only one of them would be misleading. This is the document that carries the architect Galdzak and his campaign of some forty years, the 1288 date for the upper carved chamber, and the claim that the name Geghardavank was first recorded in a document of 1250 — a hardening of Sahinian, who wrote only that the change probably happened then, and no source names the document. Its attribution of the 1200 water-supply inscription to the Proshyans is an error: the inscription names Zakare and Ivane, and the Proshyans were not yet at the site. It does not mention a purchase of the monastery at all.",
    },
    {
      author: "Patrick Donabedian",
      title: "Geghard Monastery",
      publisher: "Grove Art Online, Oxford University Press",
      year: "2003",
      identifier: { kind: "doi", value: "10.1093/gao/9781884446054.article.t031172" },
      note: "The shortest scholarly reference entry devoted to the monument, by a standard authority on medieval Armenian architecture. Cited for the building history as a specialist states it, against the tourism accounts that dominate this subject online. Paywalled and not read directly.",
    },
    {
      author: "Patrick Donabedian",
      title: "Armenia - Georgia - Islam: A Need to Break Taboos in the Study of Medieval Architecture",
      publisher: "in Ferrari and Riccioni (eds), L'arte armena. Storia critica e nuove prospettive, Eurasiatica 16, Edizioni Ca' Foscari, Venice, 63-112",
      year: "2020",
      identifier: { kind: "doi", value: "10.30687/978-88-6969-469-1/005" },
      note: "The reason this article will not call the carving in the burial hall a coat of arms without qualification. Donabedian objects that motifs of this type - an eagle holding a small quadruped, a lion attacking another animal - recur on monuments sponsored by unrelated dynasties, which in his words excludes that they may have a function of dynastic symbols; he follows Eastmond and Blessing in preferring an apotropaic reading. Open access. It is also the source for identifying R. Matevosyan's Haykakan zinanshanner (Yerevan, 2002) as the standard modern statement of the heraldic view.",
    },
    {
      author: "Sirarpie Der Nersessian",
      title: "L'Art armenien",
      publisher: "Arts et Metiers Graphiques, collection Orient et Occident, Paris",
      year: "1977",
      identifier: { kind: "isbn", value: "9782700400274" },
      note: "The work later scholarship cites for reading the relief as the Proshyan family's arms, and worth citing precisely for how it is cited: the identification is passed on as probable and never as established. The identification itself originates with Garegin Hovsepian's Khaghbakeank' kam Prosheank' (Vagharshapat, 1928), which is not registered here because no digitised copy could be consulted and a page reference for it would be invented. English edition: Armenian Art, Thames and Hudson, London, 1978.",
    },
    {
      author: "Marco Carpiceci, Fabio Colonnese, Antonio Schiavo and Rachele Zanone",
      title: "The rupestrian churches in the monastery of Geghard, Armenia",
      publisher: "Hypogea 2023: Proceedings of the Fourth International Congress of Speleology in Artificial Cavities, Genoa, 251-260",
      year: "2023",
      identifier: { kind: "url", value: "https://www.operaipogea.it/wp-content/uploads/1995/05/32-CARPICECI-Marco_Hypo2023_p.251-260_compressed.pdf" },
      note: "A recent laser-survey campaign by a Sapienza University of Rome team, and the fullest published description of the relief: an ox head biting a ring holding two facing lions whose tails end in dragons, with an eagle below holding a lamb. Congress proceedings rather than a refereed journal, and it depends heavily on the 1973 volume - including reproducing its impossible date of about 1214 for Prince Prosh, which is how that error reached print again fifty years on. Cited here for the description and the survey, not for the chronology.",
    },
    {
      author: "Richard G. Hovannisian (ed.)",
      title:
        "The Armenian People from Ancient to Modern Times, Volume I: The Dynastic Periods, from Antiquity to the Fourteenth Century",
      publisher: "Palgrave Macmillan",
      year: "2004",
      identifier: { kind: "isbn", value: "9781403966360" },
      note: "Already registered for several other articles. The chapter that earns it here is Robert Bedrosian's on the Seljuk and Mongol periods, cited for the political frame rather than the buildings: the Zakarid brothers Zakare and Ivane, Avag's submission to the Mongols, and the Khaghbakian house coming to be known as Proshian after Vasak's son Prosh. It is also what corrects the widespread description of Prosh as commander of the Zakarid army - the supreme office was the amirspasalar and no Khaghbakian held it.",
    },
    {
      author: "Avedis K. Sanjian",
      title: "Colophons of Armenian Manuscripts, 1301–1480: A Source for Middle Eastern History",
      publisher: "Harvard University Press, Harvard Armenian Texts and Studies 2",
      year: "1969",
      identifier: { kind: "isbn", value: "9780674142855" },
      note: "The documentary evidence that manuscripts were actually copied at this monastery, as against the assertion that a scriptorium existed. Sanjian indexes Ayrivank at 1444, 1447, 1452, 1459 and 1476, with a scribe named Mateos working there across a dozen of those years. The volume begins at 1301, so it cannot speak to the thirteenth century, and this article does not make it do so. Also registered for the Matenadaran. Harvard's digital edition of the same volume carries DOI 10.4159/harvard.9780674432635, checked against Crossref and confirmed as this work; the ISBN above is kept as the identifier because the 1969 print volume is the edition cited.",
    },
    {
      author: "Robert W. Thomson",
      title: "A Bibliography of Classical Armenian Literature to 1500 AD",
      publisher: "Corpus Christianorum, Brepols, Turnhout",
      year: "1995",
      identifier: { kind: "isbn", value: "9782503504551" },
      note: "The standard bibliography of Armenian literature, and what settles two separate questions here. It identifies Mkhitar Ayrivanetsi's monastery explicitly as Ayrivank, glossed Geghard, which rules out the other monasteries carrying that name. And Simeon Ayrivanetsi does not appear in it at all, which is one of the two reasons this article declines to call him a thirteenth-century historian.",
    },
    {
      author: "Michael E. Stone",
      title: "Armenian Canon Lists III - The Lists of Mechitar of Ayrivank' (c. 1285 C.E.)",
      publisher: "Harvard Theological Review 69(3-4), 289-300",
      year: "1976",
      identifier: { kind: "doi", value: "10.1017/S001781600001748X" },
      note: "Cited for Mkhitar himself and for the disagreement about when he lived, which this article preserves rather than resolves: Stone dates him 1222-1307 and his canon lists to about 1285, where Thomson calls him a fourteenth-century writer whose chronicle runs to 1328.",
    },
    {
      author: "Edda Vardanyan",
      title: "The Zamatun of Horomos and the Zamatun/Gawit' Structures in Armenian Architecture",
      publisher: "in Edda Vardanyan (ed.), Horomos Monastery: Art and History, Monographies 50, ACHCByz, Paris, 207-236",
      year: "2015",
      identifier: { kind: "isbn", value: "9782916716572" },
      note: "Cited for the building type rather than for the site: what a gavit or zhamatun was for, and where it comes from - the earliest is at Horomos and is already called zamatun in an inscription of 1038. This is what lets the article explain Geghard's halls as an Armenian type with no close western parallel rather than as a local invention.",
    },
  ],

  "tatev-monastery": [
    {
      author: "Step'annos Orbelean",
      title: "History of the State of Sisakan",
      publisher: "trans. Robert Bedrosian, Sources of the Armenian Tradition, Long Branch, N.J.",
      year: "2012",
      identifier: { kind: "archive", value: "HistoryOfTheStateOfSisakan" },
      note: "The primary source for almost everything in this article, and the reason Tatev can be dated at all. Orbelean was metropolitan of Syunik in the thirteenth century and transcribed inscriptions he could still read. Supports: the foundation inscription of 895 in the bishop's own first person (ch. 41); the eleven years of construction; the erection of the Gavazan in the name of the Holy Trinity at thirty cubits, with no mention of it moving; the church of St Gregory in 848; the pre-existing church of Sts Nerses and Sahak together with Orbelean's explicit statement that he could find no record of the early bishops (ch. 39); the 500 clergy about 906 and the thousand-strong community in the eleventh century (chs 41, 58); the dome collapse attributed to the Ganja earthquake (ch. 63); and the fall of Baghaberd with more than 10,000 items scattered (ch. 61).",
    },
    {
      author: "Marie-Felicite Brosset",
      title: "Histoire de la Siounie par Stephannos Orbelian",
      publisher: "Academie Imperiale des Sciences, St Petersburg",
      year: "1864",
      identifier: { kind: "archive", value: "HistoireDeLaSiounieParStephannosOrbelian" },
      note: "The French translation, cited where it differs from the English and where its notes carry evidence the text does not. Supports: the computation of 4 Navasard 344 of the Armenian Era as 20 April 895; the reading that the work was finished 'en 11 ans', footnoted 'En 906' - which is the whole basis of the commonly printed 895-906 span, and the reason this article calls 906 arithmetic rather than a documented date; the 1043 inscription on the gavit pillar; Sargis Jalaliants' 1858 report that the column shakes when touched; and Brosset's own note that Hermann Abich examined it and could not explain the mechanism.",
    },
    {
      author: "Arkady Karakhanian and Yelena Abgaryan",
      title:
        "Evidence of historical seismicity and volcanism in the Armenian Highland (from Armenian and other sources)",
      publisher: "Annals of Geophysics 47, no. 2/3, 793-810",
      year: "2004",
      identifier: { kind: "doi", value: "10.4401/ag-3335" },
      note: "The load-bearing modern source for the Gavazan section, and the reason this article does not call the column a seismograph. Supports: the description of the column as rocking on a hinged connection with its stylobate and returning upright; the attribution of the seismic-recording interpretation to Khalpakhchian rather than to any medieval source, and its modal phrasing that the obelisk 'could serve' that purpose; Tovma Metsopetsi's colophon of 29 November 1406 naming the monastery, the bell tower and the Gavazan; and intensity 9 on the MSK-64 scale at Tatev in 1931 with the destruction of its churches. The same paper deletes the supposed 1658 Halidzor earthquake from the catalogues as a landslide.",
    },
    {
      author: "N. N. Ambraseys",
      title: "The 12th century seismic paroxysm in the Middle East: a historical perspective",
      publisher: "Annals of Geophysics 47, no. 2/3, 733-758",
      year: "2004",
      identifier: { kind: "doi", value: "10.4401/ag-3303" },
      note: "Cited only for the date of the earthquake Orbelean blames for the dome collapse: 30 September 1139, with an explicit warning that later writers conflate it with events of 1137 and 1138. This is why the article's timeline gives 1139 where Orbelean's Armenian year converts to 1138.",
    },
    {
      author: "Sergio La Porta",
      title: "Grigor Tat'evats'i et l'Ecole monastique de Tat'ev",
      publisher:
        "in Valentina Calzolari (ed.), Illuminations d'Armenie, Fondation Martin Bodmer, Cologny-Geneve, 210-214",
      year: "2007",
      identifier: { kind: "isbn", value: "9789994142705" },
      note: "The source for the terminological point the article turns on: a specialist writing in an academic context calls the institution a monastic school, not a university. Cited for that designation rather than for any date.",
    },
    {
      author: "Ruth M. Gornandt",
      title:
        "On Knowing and Unknowing God: Reason and Mysticism in the Armenian Theologian Gregory of Tatev",
      publisher: "Journal of Theological Studies 74, no. 1, 306-339",
      year: "2023",
      identifier: { kind: "doi", value: "10.1093/jts/flac133" },
      note: "Supports Tatevatsi's cautious dates, the completion of the Book of Questions in 1397, and the description of the school as one that eventually settled at Tatev - the phrasing that keeps the institution peripatetic rather than founded in one act. Gornandt also reports the frequent comparison of Tatevatsi to Aquinas and sets out its limits, which is why the article states the comparison and its qualification together.",
    },
    {
      author: "Mesrob K. Krikorian",
      title: "Grigor Tat'evac'i: A Great Scholastic Theologian and Nominalist Philosopher",
      publisher:
        "in T. J. Samuelian and M. E. Stone (eds), Medieval Armenian Culture, University of Pennsylvania Armenian Texts and Studies 6, Scholars Press",
      year: "1984",
      identifier: { kind: "isbn", value: "9780891306429" },
      note: "Cited for Tatevatsi's standing as a scholastic theologian and philosopher. No page range is given here because none was verified.",
    },
    {
      author: "H. Melkonyan, A. Harutyunyan and D. Davtyan",
      title: "Excavations at Tatev monastery in 2014-2015",
      publisher: "ARAMAZD: Armenian Journal of Near Eastern Studies 11, no. 1-2, 305-321",
      year: "2017",
      identifier: { kind: "doi", value: "10.32028/ajnes.v11i1-2.887" },
      note: "The archaeological work behind the recent restoration campaigns, and an independent report of Orbelean's account of the earlier church dedicated to Sts Nerses and Sahak.",
    },
    {
      title:
        "The monasteries of Tatev and Tatevi Anapat and the adjacent areas of the Vorotan Valley",
      publisher: "UNESCO World Heritage Centre, Tentative Lists, Armenia",
      year: "submitted 1995",
      identifier: { kind: "url", value: "https://whc.unesco.org/en/tentativelists/14/" },
      note: "The source for the status statement, and for the gorge depth of 850 metres given as Armenia's own figure. Cited precisely because the distinction matters: this is a Tentative List entry submitted on 25 August 1995, not an inscription. Tatev is not a World Heritage Site, and Armenia's three inscribed properties are Haghpat and Sanahin, Echmiatsin and Zvartnots, and Geghard with the Upper Azat Valley. The entry's title, its submission date and its tentative status were confirmed against independent reporting; the site itself refuses automated requests, so the reference number that forms part of this URL was read once and is not repeated as a claim in the article.",
    },
    {
      title: "Longest non-stop double track cable car",
      publisher: "Guinness World Records",
      year: "2010",
      identifier: {
        kind: "url",
        value: "https://www.guinnessworldrecords.com/world-records/longest-non-stop-double-track-cable-car",
      },
      note: "The single citation for the cable car, kept to the one fact the article states: 5,752 metres between Halidzor and the monastery, achieved 16 October 2010. No fares, hours or booking information are recorded here or in the article.",
    },
  ],

  /*
   * Dilijan is the first Place whose bibliography has to do two jobs at once,
   * and the split is deliberate.
   *
   * The first five entries carry claims. The last three carry the *circulating*
   * figures the article examines — 240 square kilometres, 902 vascular plants,
   * about 150 birds, more than 40 mammals — and are cited as the thing being
   * described rather than as authorities for it. A reader who follows them
   * should find exactly the unsourced numbers the article says are there.
   * Removing them because they are not scholarly would leave three paragraphs
   * arguing against sources that had been tidied out of the footnotes.
   *
   * Deliberately not used: the travel and resort pages that dominate a search
   * for this subject. Every one of them reprints the 240 km² figure beside the
   * 1958 date, which is the exact conflation of reserve and park that §10 of
   * this article's brief exists to prevent, and several add a species count with
   * no date attached to it at all.
   */
  "dilijan-national-park": [
    {
      /*
       * Disambiguated in the same way the Lake Sevan entry names the SNCO that
       * administers it, and for a reason that turned out to be mechanical as well
       * as editorial: `ArticleLayout` keys the rendered bibliography by
       * `source.title`, so this entry and the Wikipedia one below — both plainly
       * titled "Dilijan National Park" — collided as React keys the first time
       * this article rendered. Two identically titled citations one above the other
       * are worth avoiding on their own account; the duplicate key is the second
       * reason. The fragility of that key is recorded as debt rather than fixed in
       * a content step.
       */
      title: "Dilijan National Park — \"Dilijan\" National Park SNCO",
      publisher: "NABU Armenia (Naturschutzbund Deutschland), Yerevan",
      identifier: {
        kind: "url",
        value: "https://nabu.am/en/eco-education/protected-areas/national-parks/dilijan-national-park",
      },
      note: "The park administration's own description of itself, republished by the conservation organisation that works with it — which is what it is cited as, since the ministry's own page for the national parks has moved and no longer resolves. It carries the whole of this article's chronology and its area: the reserve of 1958 established by decree P-341 of the Council of Ministers of the Armenian SSR on the ground of the former Dilijan and Kuybishev forest enterprises; the national park established on 21 February 2002 by decree 165 of the Government of the Republic of Armenia; 33,765 hectares with a separate buffer zone of 8,167; the provinces; the Pambak, Areguni, Miapor, Ijevan and Halab ranges; the Aghstev and Getik basins; the elevation range of 1,070 to 2,900 metres; and beech, yew and oak as the protected objects. It is the only source found that states what its area figure measures, which is why the article uses that figure and not the commoner one.",
    },
    {
      title: "State sanctuaries of the Republic of Armenia",
      publisher: "Ministry of Environment of the Republic of Armenia, Yerevan",
      identifier: { kind: "url", value: "https://environment.gov.am/en/sanctuaries" },
      note: "The official register of Armenia's sanctuaries, and the source for the distinction the article draws twice. The Akhnabad yew grove is 25 hectares, was protected on 13 September 1958, lies on the Tsaghkot spur of the Miapor range near Aghavnavank at 1,400 to 1,700 metres, and protects relict European yew — as a sanctuary in its own right, administered by the Dilijan national park organisation rather than included in the park. The same page lists a juniper sparse-forest sanctuary of 1,807 hectares in Gegharkunik under the same administration. Neither area belongs in the park's own.",
    },
    {
      author:
        "Nathalie Morin, Antoine Masse, Christophe Sannier, Martin Siklar, Norman Kiesslich, Hovik Sayadyan, Loic Faucqueur and Michaela Seewald",
      title:
        "Development and Application of Earth Observation Based Machine Learning Methods for Characterizing Forest and Land Cover Change in Dilijan National Park of Armenia between 1991 and 2019",
      publisher: "Remote Sensing 13(15), 2942, MDPI",
      year: "2021",
      identifier: { kind: "doi", value: "10.3390/rs13152942" },
      note: "The strongest source in this bibliography and the whole basis of the conservation section: the first remote-sensing assessment of any specially protected area in Armenia, produced for UNDP Armenia from Landsat and Sentinel-2 series at eight dates. Supports the forest composition (98.85 per cent broadleaved against 1.15 per cent coniferous in 2019), the land-cover breakdown (natural vegetation about 93.7 per cent of the area with more than half of that forest, agriculture 4.62, settlements and primary roads 1.19), the perturbation table quoted in the article (253 hectares of forest lost and 384 degraded in 1991-1995, 363 degraded in 1995-2000, 22 degraded and none lost in 2002-2005, 104 hectares regenerating against 45 lost in 2015-2019), the 1958 reserve as one of Armenia's first three, the start of illegal logging in 1992 with the blockade, the seven communities whose cadastral maps the study used, and the continuing pressure from settlements, agriculture and tourism. Cited also for the authors' own caveat, which the article repeats: degradation was attributed to human causes unless proven natural, and they say plainly that their anthropogenic figure is therefore very likely an overestimate.",
    },
    {
      author: "M. Arzumanyan, A. Ghrmajyan, V. Muradyan, T. Tammaru and M. Arakelyan",
      title: "Molluscs as bioindicators of tourism pressure on ecosystems of Dilijan National Park, Armenia",
      publisher: "Journal of Ecotourism 22(4), 566-577, Taylor and Francis",
      year: "2023",
      identifier: { kind: "doi", value: "10.1080/14724049.2022.2100894" },
      note: "The only measured evidence found for recreation pressure inside this park, and cited for exactly what it measured rather than as a general warning about tourism: terrestrial molluscs on visited plots against control plots, with significantly lower diversity, species richness and abundance where visitor intensity was high, the gap widest in autumn, and all five rare species among the thirty-one detected occurring only in the low-traffic plots. Published online in 2022 and issued in the 2023 volume.",
    },
    {
      author: "Halil Ibrahimi, Astrit Bilalli, Milaim Musliu, Vardan Asatryan and Marine Dallakyan",
      title:
        "Wormaldia dilijanica sp. nov., a new caddisfly species (Trichoptera, Philopotamidae) from the Dilijan National Park in Armenia",
      publisher: "Ecologica Montenegrina 94, 76-83, Institute for Biodiversity and Ecology",
      year: "2026",
      identifier: { kind: "doi", value: "10.37828/em.2026.94.2" },
      note: "Cited for one point, which is the point: a short field survey of a single tributary of the Aghstev inside the park in May 2025 produced a species new to science, and the authors state that Armenia's caddisfly fauna is poorly known and that the country has been largely absent from recent Caucasus work. This is the evidence for the article's refusal to treat the park's circulating species counts as complete.",
    },
    {
      title: "Reintroduction of the Caucasian Red Deer to Armenia",
      publisher: "Caucasus Nature Fund, Tbilisi",
      identifier: {
        kind: "url",
        value: "https://www.caucasus-naturefund.org/reintroduction-of-the-caucasian-red-deer-to-armenia/",
      },
      note: "A project page from one of the programme's funders, cited only for the programme's own facts and not for anything about the park's wider fauna: the red deer locally extinct in Armenia in the 1950s and listed as critically endangered nationally, the reintroduction begun in 2013 by the environment ministry with WWF Armenia, the breeding enclosure of ten hectares of forest near Parz Lake inside the park, three founder animals brought from Iran in April 2018, and the first calf born in June of that year. Later releases into the park itself are reported by the same programme's partners; the article states that they happened without giving a headcount, because the published numbers differ between accounts.",
    },
    {
      title: "Dilijan National Park (relation 7594000)",
      publisher: "OpenStreetMap",
      identifier: { kind: "url", value: "https://www.openstreetmap.org/relation/7594000" },
      note: "The protected-area outline as mapped, tagged boundary=protected_area with protect_class 2 and linked to the same Wikidata item as the encyclopaedia entries below. Cited as a community-maintained representation and explicitly not as the legal boundary — which is the distinction the article makes rather than hides. It is the source for the enclave pattern (the town of Dilijan and the village of Gosh lying inside the outline but outside the protected land, Goshavank a few hundred metres beyond the line while Haghartsin, Jukhtak Vank, Matosavank and Aghavnavank are well within it) and for the point recorded in geo.ts, whose provenance is set out there in full.",
    },
    {
      title: "Dilijan National Park",
      publisher: "Wikipedia, Wikimedia Foundation",
      identifier: { kind: "url", value: "https://en.wikipedia.org/wiki/Dilijan_National_Park" },
      note: "Cited as the widest carrier of the figures this article examines, not as an authority for them. It is where the 240 square kilometres, the 902 vascular plants with 29 in Armenia's Red Book, the roughly 150 bird species, the more than 40 mammal species and the 1,070 to 2,300 metre elevation range reach most readers, and none of them is attributed there to a dated survey. The article's point about the flora count is drawn from the figure's own wording, which includes four species listed in the Red Data Book of the USSR and therefore cannot postdate 1991.",
    },
    {
      title: "Dilijan National Park (Q1984244)",
      publisher: "Wikidata, Wikimedia Foundation",
      identifier: { kind: "url", value: "https://www.wikidata.org/wiki/Q1984244" },
      note: "The structured record behind most general reference surfaces, cited on the same terms as the entry above. It states the area as 240 square kilometres and the elevation as 1,070 to 2,300 metres with neither a boundary nor a date attached, and carries a coordinate at 40.65639, 45.02139 which does fall inside the park but lies some twelve kilometres from its centroid — which is why geo.ts records a computed centroid rather than adopting this point.",
    },
  ],

  /*
   * Gyumri. A deliberately short bibliography for a long article, and the shape of
   * it follows the shape of the evidence: an architectural study for the fabric, a
   * legal instrument for what is protected, two peer-reviewed papers for the
   * earthquake, the national statistical office for the population, UNESCO for the
   * craft, and two standing reference works already registered elsewhere for the
   * imperial and historical-geographical frame.
   *
   * What is deliberately absent is the whole tier of tourism and municipal
   * promotional material this subject generates. It was read — it is where the
   * research questions came from — and it carries no claim in the article. The
   * monument counts of "1,600" and "1,800 monuments" that circulate everywhere are
   * discussed in the prose precisely because they have no such source behind them.
   */
  gyumri: [
    {
      author: "A. Ivanov",
      title: "Armenian City of Gyumri as a Phenomenon of Living Vernacular Urban Environment",
      publisher:
        "The International Archives of the Photogrammetry, Remote Sensing and Spatial Information Sciences, XLIV-M-1-2020, 167–174",
      year: "2020",
      identifier: { kind: "doi", value: "10.5194/isprs-archives-XLIV-M-1-2020-167-2020" },
      note: "Open access, and the article's source for the architecture section: the regular imperial grid filled with one- and two-storey stone vernacular buildings, the black tuff worked by local masons, the characterisation of the result as freedom within the grid, the city as a living rather than a museum core, and the survival of the historic fabric through the earthquakes of 1926 and 1988. Cited for the urban fabric only, not for chronology or statistics.",
    },
    {
      author: "Government of the Republic of Armenia",
      title:
        "Decision N 1270-N approving the State List of Immovable Monuments of History and Culture of Shirak Marz",
      publisher: "Armenian Legal Information System (ARLIS), Yerevan",
      year: "2004",
      identifier: { kind: "url", value: "https://www.arlis.am/hy/acts/105447" },
      note: "The legal instrument behind the article's treatment of monument counts, and the reason it quotes this one rather than the figures in circulation. The list is dated, its boundary is administrative, and the section covering the city of Gyumri runs to roughly a thousand numbered entries. In Armenian. Cited for what is protected and how many entries there are, not for the history of any individual building.",
    },
    {
      author:
        "A. Cisternas, H. Philip, J. C. Bousquet, M. Cara, A. Deschamps, L. Dorbath, C. Dorbath and others",
      title:
        "The Spitak (Armenia) earthquake of 7 December 1988: field observations, seismology and tectonics",
      publisher: "Nature, volume 339, pages 675–679",
      year: "1989",
      identifier: { kind: "doi", value: "10.1038/339675a0" },
      note: "The field and seismological account, published within months of the event by a joint French-Soviet expedition. Cited for the character of the earthquake itself — the reverse faulting, the surface break of the order of thirteen kilometres, the shallow aftershock volume — and not for anything about buildings or casualties.",
    },
    {
      author: "M. K. Yegian, V. G. Ghahraman and G. Gazetas",
      title: "1988 Armenia Earthquake. I: Seismological, Geotechnical, and Structural Overview",
      publisher: "Journal of Geotechnical Engineering, volume 120, issue 1, pages 1–20",
      year: "1994",
      identifier: { kind: "doi", value: "10.1061/(ASCE)0733-9410(1994)120:1(1)" },
      note: "The engineering source for the section on why the damage in the city then called Leninakan was what it was: the failure of multi-storey precast-concrete residential construction at its connections rather than in its members, and the amplification of ground motion by the soft sediment under the city in the period range that mattered to buildings of that height. This is the paper behind the article's contrast between the tall modern blocks and the low-rise stone core; it is not cited for any casualty figure.",
    },
    {
      author: "UNESCO",
      title: "Tradition of blacksmithing in Gyumri",
      publisher:
        "Representative List of the Intangible Cultural Heritage of Humanity, element 01967, inscribed 2023",
      year: "2023",
      identifier: {
        kind: "url",
        value: "https://ich.unesco.org/en/RL/tradition-of-blacksmithing-in-gyumri-01967",
      },
      note: "The primary record of the inscription, and the source for every UNESCO statement in the article: the exact element name, the list, the year, the file number, Armenia as the submitting state, and what was actually inscribed — the making and repair of grilles, gates, doors, candlesticks and chandeliers, transmitted in families and through the city's art academy and craft college. It is cited equally for what it is not: an intangible heritage element is not a World Heritage property, and this file is the evidence for keeping the two apart.",
    },
    {
      author: "Statistical Committee of the Republic of Armenia",
      title: "The Main Results of RA Census 2022",
      publisher: "Armstat, Yerevan",
      year: "2023",
      identifier: { kind: "url", value: "https://www.armstat.am/en/?nid=82&id=2623" },
      note: "The source of every population figure in the article, and of the distinction the article draws between them. The census was enumerated from 13 to 22 October 2022 and reports a permanent (de jure) and a current (de facto) population separately; nationally the two differ by around a quarter of a million. The 112 301 quoted here is the census count for the city, and the 2001 and 2011 figures are the two preceding censuses on the same basis. Armstat's annual inter-census estimates are a different series and give different numbers, which is why the article dates the figure it uses.",
    },
    {
      author: "UNESCO Institute for Lifelong Learning",
      title: "Gyumri — UNESCO Global Network of Learning Cities",
      publisher: "UNESCO Institute for Lifelong Learning, Hamburg",
      identifier: { kind: "url", value: "https://www.uil.unesco.org/en/learning-cities/gyumri" },
      note: "Cited only to establish that this, and not any heritage designation, is the other UNESCO relationship the city has: Gyumri joined the Global Network of Learning Cities in 2016. Recorded because it is the check the article ran rather than assumed — no Armenian city is currently in the UNESCO Creative Cities Network, so the widely repeated framing of Gyumri as a UNESCO city of crafts has no such basis. The membership profile's own population figure is not used here; it agrees with no census.",
    },
    {
      author: "Richard G. Hovannisian (ed.)",
      title:
        "The Armenian People from Ancient to Modern Times, Volume II: Foreign Dominion to Statehood, the Fifteenth Century to the Twentieth Century",
      publisher: "Palgrave Macmillan",
      year: "2004",
      identifier: { kind: "isbn", value: "9781403964229" },
      note: "Already registered for other articles. Cited here for the imperial and early twentieth-century frame the city sits in — the Russian annexation of Eastern Armenia, the migration from Ottoman territory after the war of 1828 to 1829, and the collapse of the first Republic in 1920 — and not for the local chronology of Alexandropol itself.",
    },
    {
      author: "Robert H. Hewsen",
      title: "Armenia: A Historical Atlas",
      publisher: "University of Chicago Press",
      year: "2001",
      identifier: { kind: "isbn", value: "9780226332284" },
      note: "Already registered for five other articles. Cited here for the historical geography of Shirak and the position of the city on the plain, which is the one thing in this article that predates every other source in this list.",
    },
  ],
  "amberd-fortress": [
    {
      author: "Nikolaj M. Tokarskij and Adriano Alpago-Novello",
      title: "Amberd",
      publisher:
        "Documenti di architettura armena / Documents of Armenian Architecture 5, Edizioni Ares, Milan",
      year: "1978",
      identifier: { kind: "url", value: "https://ci.nii.ac.jp/ncid/BA57234763" },
      note: "The site monograph: measured surveys, plans and photographs of the fortress and the church, published in the Italian documentation series on Armenian architecture. Second edition; first published 1972. The record linked here is the CiNii Books catalogue entry, which carries the authors, series, publisher, place, year, edition and extent — the identifier by which this volume can be found, since the series predates ISBNs on these titles. Registered here as the standard architectural documentation of Amberd and as the source behind the plan and fabric descriptions that later accounts, including the reserve's, repeat. It has not been read directly for this article; that is recorded rather than glossed, and no claim in the article rests on it alone.",
    },
    {
      author:
        "Service for the Protection of Historical Environment and Cultural Museum-Reservations, Ministry of Education, Science, Culture and Sport of the Republic of Armenia",
      title: "Amberd Historical and Cultural Reserve",
      publisher: "hushardzan.am, Yerevan",
      identifier: {
        kind: "url",
        value: "https://hushardzan.am/en/preservations/amberd-historical-and-cultural-reserve",
      },
      note: "The administering institution's own record, and the source for most of the physical description in this article: the reserve's establishment by government decision N 541-N of 18 May 2017 and its area of 45.07 hectares; the position north-west of Byurakan on the southern slopes of Aragats at the confluence of the Arkashen and Amberd; the three-storey basalt castle with timber floors; wall heights of 15 to 16 metres and thicknesses of 2 to 3 metres; the bathhouse about 70 metres from the castle with its hypocaust heating; the chapel; the cross-domed church of 1026 with its twelve-faceted drum; the excavation seasons of 1936 to 1940 and 1963 to 1972 and the restoration campaigns of 1949 to 1972, 1970 to 1975 and 2005 to 2007. It is also the source of the two claims this article deliberately holds apart from the rest: that the complex is dated by excavation to the tenth to thirteenth centuries, and that construction began in the seventh century under the Kamsarakans — the first stated as a dating, the second as an attribution. Its excavation note naming Toros Toramanyan for 1936 to 1940 is the discrepancy discussed in the article.",
    },
    {
      author: "Government of the Republic of Armenia",
      title:
        "Decision N 628 approving the State List of Immovable Monuments of History and Culture of Aragatsotn Marz",
      publisher: "Armenian Legal Information System (ARLIS), Yerevan",
      year: "2002",
      identifier: { kind: "url", value: "https://www.arlis.am/hy/acts/36898" },
      note: "The legal instrument behind this article's treatment of the site's dating and of what is protected. Approved 29 May 2002. The Amberd entry, filed under the village of Byurakan, dates the complex to the tenth to fourteenth centuries and enumerates its components: the fortress with two covered passages, the church of Surb Astvatsatsin of 1026, khachkars, a palace, a chapel, a bath, a cemetery, the water system and the walls. In Armenian. Cited for the official dating, the enumeration and the legal status, and not for the history of any individual building. It is also the source for treating the covered passages as documented rather than as folklore.",
    },
    {
      author: "American University of Armenia",
      title: "Amberd Fortress — Armenia Hidden Gems",
      publisher: "AUA Acopian Center, with the Manoogian Simone Foundation, Yerevan",
      identifier: { kind: "url", value: "https://armeniahiddengems.aua.am/monument/amberd-fortress/" },
      note: "A university heritage inventory, cited for one thing only and named because of it: it gives the site's elevation as 2160 metres, against the roughly 2300 metres the reserve and most reference works give. Neither figure states what it measures, which is the point the article makes with the pair. Its own dating of the fortress to the tenth to fourteenth centuries agrees with the state list above.",
    },
    {
      author: "Arpine Asryan",
      title: "Amberd Fortress",
      publisher:
        "Crossing Frontiers: Christians and Muslims and their Art in Eastern Anatolia and the Caucasus, The Courtauld Institute of Art, London",
      identifier: {
        kind: "url",
        value: "https://sites.courtauld.ac.uk/crossingfrontiers/crossing-frontiers/armenia/amberd-fortress/",
      },
      note: "An academic project entry, and the source for the article's phasing of the fortress: the castle built under the Bagratids of Ani in the tenth century on the ruins of a seventh-century castle, rather than surviving from the seventh century itself. Also cited for the irregular plan, the three semicircular towers with chambers inside them, the probable three storeys, and the sequence of Seljuk occupation in the 1070s, recovery in 1196, the Vachutians from 1215, the Mongol capture and the Timurid campaigns of the late fourteenth century. Cited for the built sequence and the political chronology, not for the elevation or the modern administration.",
    },
    {
      author: "Arpine Asryan",
      title: "Amberd Church",
      publisher:
        "Crossing Frontiers, The Courtauld Institute of Art, London — companion entry to the fortress",
      identifier: {
        kind: "url",
        value: "https://sites.courtauld.ac.uk/crossingfrontiers/crossing-frontiers/armenia/amberd-church/",
      },
      note: "The source for everything this article says about the church: the date of 1026 from the inscription inside the tympanum of the north portal; the patron Vahram Pahlavuni, prince of princes and commander at the Bagratid court; the plan as a cross inscribed in a rectangle on a stepped platform with barrel-vaulted arms, a semicircular apse and two-storey corner chambers; the twelve-sided drum with paired engaged columns under an umbrella roof; local basalt and mortar as the material; the ceramic vessels set in the mortar under the roof; and the comparison with Marmashen that is the basis for the shared-architect suggestion. Registered as a separate entry from the fortress above because it is a separate page carrying separate claims, and its title differs accordingly.",
    },
    {
      author: "Europa Nostra and the European Investment Bank Institute",
      title: "Heritage sites in Europe shortlisted for the 7 Most Endangered Programme 2024",
      publisher: "Europa Nostra, The Hague / Brussels",
      year: "2024",
      identifier: {
        kind: "url",
        value:
          "https://www.europanostra.org/europa-nostra-and-eib-institute-announce-heritage-sites-in-europe-shortlisted-for-the-7-most-endangered-programme-2024/",
      },
      note: "Published 30 January 2024. The primary record of the shortlisting: eleven sites from nine countries, of which the Amberd Historical and Cultural Reserve is one, nominated by the Ministry of Education, Science, Culture and Sport of Armenia. It is also the source for the article's description of the site's condition — progressive deterioration of the castle, root damage from vegetation, and a heightened risk of structural collapse from seismic activity — and for the fact that the file itself describes Amberd as seventh-century, which the article notes rather than adopts.",
    },
    {
      author: "Europa Nostra and the European Investment Bank Institute",
      title: "Europe's 7 Most Endangered Heritage Sites 2024",
      publisher: "Europa Nostra, The Hague / Brussels",
      year: "2024",
      identifier: {
        kind: "url",
        value:
          "https://www.europanostra.org/europa-nostra-and-eib-institute-announce-europes-7-most-endangered-heritage-sites-2024/",
      },
      note: "Published 17 April 2024, and cited for an absence, which is why it is a separate entry from the shortlist above. The seven selected from the eleven shortlisted are in France, Greece, Italy (two), Serbia and Türkiye (two); Amberd is not among them. This is the evidence for the article's correction of the widely repeated claim that Amberd is one of Europe's seven most endangered monuments — it was shortlisted and not selected, and the two announcements are the record of both halves.",
    },
    {
      title: "Toros Toramanian (1864-1934)",
      publisher:
        "Fundamental Armenology, All Armenian Foundation for Armenological Studies with the National Academy of Sciences of the Republic of Armenia, Yerevan (ISSN 1829-4618)",
      identifier: {
        kind: "url",
        value: "https://fundamentalarmenology.am/Article/27/895/TOROS-TORAMANIAN-(1864-1934).html",
      },
      note: "Cited for one date and nothing else: Toramanian died in 1934, which is what makes the reserve's attribution of the 1936 to 1940 excavation seasons to him impossible as written. Entered in the journal's Classics of Armenology section, which publishes biographical notices of the founding figures of the field. No author is named on the notice, which is why the field is omitted here rather than guessed at.",
    },
    {
      author: "Armen Kazaryan",
      title:
        "Architecture of Medieval Armenia as a Field of Research for Russian and Italian Scholars: Comparative Analyses of the Historiography",
      publisher: "Arts, volume 12, issue 6, article 238",
      year: "2023",
      identifier: { kind: "doi", value: "10.3390/arts12060238" },
      note: "Open access. Cited narrowly, for the historiographic frame the Amberd monograph belongs to: the Italian academic programmes of the universities of Rome and Venice and of Milan Polytechnic, running from 1966 into the 1980s, whose work on Armenian architecture was architectural and survey-based where the earlier Russian Ani expedition was archaeological. That is what produced the Documents of Armenian Architecture series and its Amberd volume. Not cited for anything about the site itself.",
    },
    {
      author: "Richard G. Hovannisian (ed.)",
      title:
        "The Armenian People from Ancient to Modern Times, Volume I: The Dynastic Periods, from Antiquity to the Fourteenth Century",
      publisher: "Palgrave Macmillan",
      year: "2004",
      identifier: { kind: "isbn", value: "9781403966360" },
      note: "Already registered for other articles. Cited here for the political frame the fortress sits inside and for nothing local to it: the Bagratid kingdom and its noble houses, the Byzantine annexation of Ani in 1045, the Seljuk conquest and the fall of Ani in 1064, and the Zakarid recovery of northern Armenia at the turn of the thirteenth century under Georgian suzerainty. The chronology of Amberd itself is not drawn from it.",
    },
    {
      author: "Robert H. Hewsen",
      title: "Armenia: A Historical Atlas",
      publisher: "University of Chicago Press",
      year: "2001",
      identifier: { kind: "isbn", value: "9780226332284" },
      note: "Already registered for six other articles. Cited here for the historical geography behind the article's first two sections: the district of Aragatsotn and its relation to the Aragats massif, the position of the Ararat plain below it, and the holdings of the Kamsarakan house in Arsharunik and Shirak to the north and west — which is the tenure half of the seventh-century attribution the article declines to state as a fact.",
    },
  ],

  jermuk: [
    {
      author: "Statistical Committee of the Republic of Armenia",
      title:
        "Results of the 2022 Population Census of the Republic of Armenia — Figures of the Marz of Vayots Dzor, Section 1: Distribution of the Population by Administrative-Territorial Division",
      publisher: "Armstat, Yerevan",
      year: "2024",
      identifier: { kind: "url", value: "https://armstat.am/en/?nid=956" },
      note: "The primary source for every population figure in this article, and the only one. Tables 1.1.1 and 1.1.2 of this release were downloaded from the page linked here, extracted and read directly rather than taken from a secondary account, which matters because they are the reason the article can separate four numbers that are routinely quoted as one. For the town of Jermuk they give a permanent (de jure) population of 3936 and a present (de facto) population of 3569 at the census of October 2022, against 5394 and 5146 in 2001 and 4628 and 4346 in 2011. For the Jermuk community — the town plus Kechut, Gndevaz, Karmrashen and Herher — they give 5694 permanent, and for Vayots Dzor marz 47369. The tables state that communities are presented as constituted under the law on administrative-territorial division as amended on 9 June 2022. Cited for the census figures and the settlement/community distinction, and for nothing else.",
    },
    {
      author: "Jermuk Municipality",
      title: "About the community (Համայնքի մասին)",
      publisher: "Ջերմուկի համայնքապետարան, jermuk.am",
      identifier: {
        kind: "url",
        value:
          "https://www.jermuk.am/Pages/CustomPage/?CustomPageID=722b890c-cc0b-4c5d-bdf2-30fbebab4291",
      },
      note: "The administering authority's own account of the settlement, in Armenian, and the source that independently corroborates the resort chronology this article uses: the modern town dated to 1940 and the completion of its first sanatorium, the grant of town status in 1967, all-Union resort status in 1970, and the renaming from Istisu to Jermuk in 1924. Also the source for the community's composition and the distances the article gives — Kechut, Gndevaz, Herher and Karmrashen; roughly fifty kilometres from the provincial centre and a hundred and seventy-three from Yerevan — for its elevation figure of 2080 metres, for the count of thirty-six thermal springs, for the bottling plant's date of 1949, and for the waterfall at about seventy metres. It is also cited for a discrepancy rather than a fact: its own population figure of 9276 for the community is a registered count and stands more than half again above the census total above. Not cited for chemistry, for medical claims, or for anything the census answers.",
    },
    {
      author: "Institute of Geological Sciences, National Academy of Sciences of the Republic of Armenia",
      title: "Section of Mineral Waters",
      publisher: "geology.am, Yerevan",
      identifier: { kind: "url", value: "https://geology.am/en/museum-mineral-water/" },
      note: "The institutional geological source, and the one that carries this article's chemistry. Cited for the country-wide context — more than seven hundred mineral springs and boreholes recorded in Armenia, temperatures from about 40 degrees at the coolest recognised thermal fields to over 80 at the hottest — and for Jermuk specifically: the springs in the Arpa gorge on the Jermuk plateau, a temperature range of roughly 40 to 58 degrees Celsius, a hydrocarbonate–sulphate composition with sodium, calcium and magnesium among the cations, mineralisation of about 4 to 5 grams per litre, and carbon dioxide in the gas. It is also the source of the comparison with Karlovy Vary that the article reports as a resemblance claim rather than a measurement.",
    },
    {
      author: "Armine Saghatelyan, Armine Margaryan, Hovik Panosyan and Nils-Kåre Birkeland",
      title:
        "Microbial Diversity of Terrestrial Geothermal Springs in Armenia and Nagorno-Karabakh: A Review",
      publisher: "Microorganisms 9(7), 1473, MDPI",
      year: "2021",
      identifier: { kind: "doi", value: "10.3390/microorganisms9071473" },
      note: "The one peer-reviewed measurement this article rests on, and it is a measurement of a single spring rather than of the field. Cited for its Jermuk sample: a temperature above 53 degrees Celsius, a circumneutral pH of 7.5, an elevation of 2080 metres, and a description of the source as vigorously degassing and of carbon hydro-sulphate–sodium type — which is compatible with the institutional range above and is why the article can say the two agree. Its tabulated total mineralisation for the Armenian springs it surveys is not usable as stated and is deliberately not quoted here; the mineralisation figure in this article comes from the geological institute instead. The review's own subject is microbial ecology, and nothing in this article rests on that half of it.",
    },
    {
      author: "T. Kh. Hakobyan, S. T. Melik-Bakhshyan and H. Kh. Barseghyan",
      title: "Dictionary of Toponymy of Armenia and Adjacent Regions, volume 4 (Ն–Վ)",
      publisher: "Yerevan State University Press, Yerevan",
      year: "1986–2001",
      identifier: {
        kind: "archive",
        value:
          "Հակոբյան Թ. Խ., Մելիք-Բախշյան Ս. Տ., Բարսեղյան Հ. Խ., «Հայաստանի և հարակից շրջանների տեղանունների բառարան», հ. 4, ԵՊՀ հրատարակչություն, Երևան",
      },
      note: "The standard Armenian toponymic reference, and the work behind the place-name half of this article's second section — the older name Istisu and the reversion to Jermuk in 1924. Registered with an archival identifier rather than a URL or a page because neither could be verified: the volume is not online in a form this article could open, and a page number circulates in secondary citations that has not been checked against the book. It has not been read directly, that is recorded rather than glossed, and the two claims it supports are also carried by the municipality's own page above. The article's statement that jermuk is an ordinary Armenian common noun does not rest on it.",
    },
    {
      title: "Armenian Soviet Encyclopedia, volume 9 — Jermuk",
      publisher: "Armenian Encyclopedia Publishing House, Yerevan",
      identifier: {
        kind: "archive",
        value: "«Հայկական սովետական հանրագիտարան», հ. 9, «Ջերմուկ» յօդուած, Երևան",
      },
      note: "The reference work behind the Soviet-period detail that the municipality's page does not carry: the master plan of 1945 and its revisions, and the attribution of the sanatorium and the mineral-water gallery to the architect Gevorg Tamanyan, built between 1950 and 1956. Like the toponymic dictionary above it is registered with an archival identifier and has not been read directly — the article's account of it comes from Armenian secondary literature citing it — and every claim in the article that depends on it is written as something Armenian reference works report rather than as an established fact. The bed-capacity and airfield figures for the resort at its height are attributed to this literature in the same way, and are given as orders of magnitude.",
    },
    {
      title: "Lake Sevan — \"Sevan\" National Park SNCO",
      publisher: "Ministry of Environment of the Republic of Armenia, Yerevan",
      identifier: { kind: "url", value: "https://sevan-park.am/en/2019/03/29/lake-sevan/" },
      note: "Already registered for the Lake Sevan article, and cited here for one thing: the Arpa–Sevan diversion, which begins at the Kechut reservoir on the Arpa immediately below Jermuk and has carried water under the Vardenis range into the lake since 1981. That is the fact that makes the upper Arpa a managed water system rather than a wilderness, and it is the relationship this article's only authored link points at. Not cited for anything about Jermuk itself.",
    },
    {
      author: "CEE Bankwatch Network",
      title: "Amulsar gold mine, Armenia",
      publisher: "Bankwatch, Prague",
      identifier: { kind: "url", value: "https://bankwatch.org/project/amulsar-gold-mine-armenia" },
      note: "Cited for the existence and course of the dispute over the Amulsar deposit and for nothing else: that the Armenian government commissioned an independent technical assessment in 2019, that its authors reported the data available to them were insufficient for a comprehensive environmental risk assessment, and that no government decision followed from it. Registered with its position stated rather than hidden — Bankwatch is a network of environmental organisations that has campaigned against this project — which is precisely why it is used only for the process and never for a technical conclusion. The assessment report itself was not obtained, the article therefore adjudicates nothing about the springs, and the one paragraph that mentions Amulsar says so.",
    },
  ],
  "haghpat-monastery": [
    {
      title: "Monasteries of Haghpat and Sanahin",
      publisher: "UNESCO World Heritage List, no. 777",
      year: "inscribed 1996, extended 2000",
      identifier: { kind: "url", value: "https://whc.unesco.org/en/list/777/" },
      note: "The primary designation record, and the source for the whole of this article's World Heritage section. It carries the four facts that matter and that secondary accounts routinely flatten: the date of inscription is 1996, the significant modification to the boundaries is 2000, the criteria are (ii) and (iv), and the dossier is numbered 777bis — the 'bis' being the trace of the extension. Its Statement of Outstanding Universal Value is also the source for the 976 foundation by Queen Khosrovanuysh, for Surb Nshan as built between 976 and 991 to designs by Trdat, for the bas-relief of Smbat and Gurgen, for the belfry of 1245, the Hamazasp building of 1257, the eleventh-century scriptorium and the Amenaprkich khachkar of 1273. Where it disagrees with the sources below — on the start of the church, on the century of the gavit, on the date and the name of the book room — this article records the disagreement rather than choosing.",
    },
    {
      title: "Advisory Body Evaluation (ICOMOS), Haghpat Monastery, no. 777",
      publisher: "ICOMOS for the UNESCO World Heritage Committee",
      year: "1996",
      identifier: { kind: "url", value: "https://whc.unesco.org/document/154246" },
      note: "The evaluation of the original nomination, and the document that proves the designation was staged: it is headed 'Haghpat Monastery' and evaluates Haghpat alone, on a nomination dated 16 October 1995. It is the source for the political chronology this article uses — the monastery taken and burned in 1105 by the Seljuk commander it names as Amir-Ghzil, the fortress of Kaian built in 1233 to protect Haghpat and Sanahin and stormed in 1241 — and for the conservation history: repairs in 1651, 1676 and 1677, work by the Armenian SSR's monument committee in 1939 and 1940, and major campaigns between 1960 and 1980. It gives 966-67 for the start of Surb Nshan, against the 976 of the statement above. Its figure of some five hundred monks is for the two monasteries together and is an assertion of the document, not a count this article can verify. The canonical archive path for this file redirects; the document URL above is the one that resolves.",
    },
    {
      title: "Advisory Body Evaluation (ICOMOS), Monasteries of Haghpat and Sanahin (extension), no. 777bis",
      publisher: "ICOMOS for the UNESCO World Heritage Committee",
      year: "2000",
      identifier: { kind: "url", value: "https://whc.unesco.org/document/154248" },
      note: "The evaluation of the 1999 extension nomination, and the other half of the proof that the property grew in two stages. It is headed as an extension, its subject is Sanahin, and it states in its own words that 'the inscription of the Haghpat Monastery in 1996 was on the basis of criteria ii and iv'. Cited here only for the designation history and for the shared context of the two houses; nothing in this article about Haghpat's buildings rests on it, because its architectural description is of Sanahin.",
    },
    {
      author: "S. Kh. Mnatsakanyan and Adriano Alpago-Novello",
      title: "Hakhpat",
      publisher: "Documents of Armenian Architecture / Documenti di Architettura Armena 1, Faculty of Architecture of the Politecnico di Milano with the Academy of Sciences of Yerevan, Milan",
      year: "1967",
      identifier: { kind: "url", value: "https://archive.org/details/daa-01-hakhpat-1967" },
      note: "The specialist architectural survey of the complex, and the first volume of the series whose Geghard volume is already registered for that article. It carries most of this article's building chronology: Surb Nshan begun in 966-67 and finished in 991 on the evidence of an inscription on the north side, the church attributed to Trdat, the bas-relief of Smbat and Gurgen holding a model of the church, Saint Gregory of 1005-1025 with its dome replaced by a barrel vault, the chapel of the Virgin raised on Princess Khatun's grant, the belfry of 1245 with its interlocking course of stones read as an anti-seismic measure, the thirteenth-century refectory and hall of Abbot Hamazasp, and the Amenaprkich khachkar of 1273. Two things make it more useful than a later summary. It describes the gavit's function directly — assembly, the teaching of novices, and burial — which is what allows this article to explain the word rather than mistranslate it. And it dates the gavit to 1310-1320, on the site of a Kiurikian funerary building of 1185 associated with Mariam, a century later than the UNESCO documentation, which is the largest open disagreement about the site. Its own internal arithmetic is also what tests the foundation date: it states that the work on the church lasted fifteen years, which fits a start in 976 and not the 966-67 it gives.",
    },
    {
      author: "Robert H. Hewsen",
      title: "Armenia: A Historical Atlas",
      publisher: "University of Chicago Press",
      year: "2001",
      identifier: { kind: "isbn", value: "9780226332284" },
      note: "Already registered for seven other articles. Cited here for the historical geography of Lori — the position of the district in the north of the Armenian lands, the Debed and its valley, and the Kiurikian kingdom that Gurgen inherited and that buried its dead at Haghpat. This is the archive's first article about anywhere in Lori, so the frame it supplies is doing more work than usual.",
    },
    {
      author: "Richard G. Hovannisian (ed.)",
      title: "The Armenian People from Ancient to Modern Times, Volume I: The Dynastic Periods, from Antiquity to the Fourteenth Century",
      publisher: "Palgrave Macmillan",
      year: "2004",
      identifier: { kind: "isbn", value: "9781403966360" },
      note: "Already registered for five other articles. Cited here for the political frame rather than the buildings: the Bagratid restoration of Armenian kingship at the end of the ninth century, the branch kingdoms that followed it, the Seljuk period, and the Zakarian ascendancy in northern Armenia under Georgian overlordship that the thirteenth-century building campaign at Haghpat belongs to.",
    },
    {
      author: "Christina Maranci",
      title: "The Art of Armenia: An Introduction",
      publisher: "Oxford University Press",
      year: "2018",
      identifier: { kind: "isbn", value: "9780190269005" },
      note: "Already registered for four other articles. Cited here for the architectural vocabulary this article has to use in English without distorting it — the domed hall, the triangular niche, the khachkar, and above all the gavit as a building type rather than as a mistranslated narthex — and for Trdat's place in the period, including the cathedral at Ani and the rebuilding of the dome of Hagia Sophia after the earthquake of 986.",
    },
  ],
};


/** The bibliography for one article. Empty only if the slug is unknown. */
export function getSources(slug: string): Source[] {
  return SOURCES[slug] ?? [];
}

/** The whole registry, for the validation script. */
export function getSourceRegistry(): Readonly<Record<string, Source[]>> {
  return SOURCES;
}
