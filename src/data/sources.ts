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
      note: "The work that established Armenian colophons as a historical source in their own right. Cited for what a hishatakaran records and for the claim that these manuscripts are read by historians who do not read Armenian.",
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
      title: "Colophons of Armenian Manuscripts, 1301-1480: A Source for Middle Eastern History",
      publisher: "Harvard Armenian Texts and Studies 2, Harvard University Press, Cambridge MA",
      year: "1969",
      identifier: { kind: "doi", value: "10.4159/harvard.9780674432635" },
      note: "The documentary evidence that manuscripts were actually copied at this monastery, as against the assertion that a scriptorium existed. Sanjian indexes Ayrivank at 1444, 1447, 1452, 1459 and 1476, with a scribe named Mateos working there across a dozen of those years. The volume begins at 1301, so it cannot speak to the thirteenth century, and this article does not make it do so.",
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
};

/** The bibliography for one article. Empty only if the slug is unknown. */
export function getSources(slug: string): Source[] {
  return SOURCES[slug] ?? [];
}

/** The whole registry, for the validation script. */
export function getSourceRegistry(): Readonly<Record<string, Source[]>> {
  return SOURCES;
}
