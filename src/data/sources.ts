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
};

/** The bibliography for one article. Empty only if the slug is unknown. */
export function getSources(slug: string): Source[] {
  return SOURCES[slug] ?? [];
}

/** The whole registry, for the validation script. */
export function getSourceRegistry(): Readonly<Record<string, Source[]>> {
  return SOURCES;
}
