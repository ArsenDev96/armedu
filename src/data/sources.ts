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
};

/** The bibliography for one article. Empty only if the slug is unknown. */
export function getSources(slug: string): Source[] {
  return SOURCES[slug] ?? [];
}

/** The whole registry, for the validation script. */
export function getSourceRegistry(): Readonly<Record<string, Source[]>> {
  return SOURCES;
}
