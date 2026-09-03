import { readFileSync, writeFileSync } from "node:fs";

const p = "src/data/sources.ts";
let s = readFileSync(p, "utf8");

/** This file is CRLF end to end; patching with LF would rewrite every line. */
const crlf = (text) => text.replace(/\r?\n/g, "\r\n");

const anchor = `      note: "Where the same scholar sets the argument out at length, and the reason the article credits the etymology to Կարո Դավթյան rather than to Martirosyan: he states that the analysis was already published in Davtyan's 1966 dialect study of Mountainous Karabakh, and presents his own contribution as the supporting evidence — the parallels in which a forest X means a wild X, the sound change that gives միր- from մայրի in the Karabakh and Goris speech, and the case against the rival reading of the name as Mihr's bird. Cited so that the lexical paragraph attributes each part of the argument to whoever actually made it.",
    },
  ],
`;

const count = s.split(crlf(anchor)).length - 1;
if (count !== 1) throw new Error("anchor matches " + count + " times");

const block =
  anchor +
  `
  /*
   * \`baghdasar-aghbar\` is the section's first play, and its bibliography is shaped
   * by two problems the prose has to solve. The first is chronological: four
   * different years — composition, serialisation, premiere, and a premiere date
   * that no source actually attests — circulate as though they were one fact, so
   * the chronology entries are separated from the critical ones and each is cited
   * for the date it establishes and no other. The second is the title: there is no
   * canonical English form, which is why two translations with two different
   * titles are cited as evidence rather than as authority.
   */
  "baghdasar-aghbar": [
    {
      author: "Հակոբ Պարոնյան, բնագիրը և ծանոթագրությունները՝ Ա. Ս. Մանուկյանի",
      title: "Երկերի ժողովածու տասը հատորով, հատոր 1",
      publisher: "ՀՍՍՌ ԳԱ Մ. Աբեղյանի անվան գրականության ինստիտուտ, Երևան",
      year: "1962",
      identifier: { kind: "archive", value: "Հակոբ Պարոնյան, Երկերի ժողովածու, հ. 1, Երևան, 1962, «Պաղտասար աղբար», էջ 297–421, ծանոթագրություններ՝ էջ 459–461" },
      note: "The text of record and the source of almost everything the article states as fact rather than as reading. It supplies the play's own subtitle, Կատակերգություն երեք արարքով, and so the three acts; the dramatis personae exactly as printed, which is what settles the wife's name as Անույշ; the textological note fixing first publication in Paronyan's own Խիկար across August–December 1886 and January–February 1887; the editorial gloss defining the Դատաստանական խորհուրդ as a body of four laymen and four clerics with jurisdiction over matrimonial cases; the list of translations, which is where the French, English and Russian titles and their dates come from; and the note that the 1933 English translator renamed four characters. It is also the source for Paronyan's own statement of method at the relaunch of Խիկար — that he would stop publishing the allegorical writing which necessity forces on a satirist and in which satire dies, and write instead a series of comedies drawn from national manners, of which this was to be the first. Cited for text and chronology, never for evaluation. The edition prints reformed orthography, so the Armenian this article quotes is the academic text rather than Paronyan's own classical spelling.",
    },
    {
      title: "Հայկական սովետական հանրագիտարան, հատորներ 1, 9 և 11",
      publisher: "Հայկական հանրագիտարանի գլխավոր խմբագրություն, Երևան",
      year: "1974–1985",
      identifier: { kind: "archive", value: "ՀՍՀ, հատոր 9, էջ 204–205; հատոր 11, էջ 532 և 193; հատոր 1, էջ 21" },
      note: "Three entries doing three different jobs, which is why they are cited together rather than as one page. The Պարոնյան entry in volume 9, signed by Ա. Մանուկյան, carries the chronology of the periodicals, the genre of each work — which is what keeps Ազգային ջոջեր, Մեծապատիվ մուրացկաններ and this play apart — the typing of the cast, and the one compact critical judgement the article quotes, that the comedy of situation and above all of speech is strong. The Վրույր entry in volume 11 is the only source found that names a year, a city and a person for the first staging: Tiflis, 1895, staged by Aram Vruyr, who played the title part. The same volume's theatre entry carries the 1927 Yerevan production. The Աբելյան entry in volume 1 gives his assumption of the role in 1897, which the article uses to show the part spreading and takes care not to present as a premiere.",
    },
    {
      author: "Արսեն Գլջյան",
      title: "«Պարոնյանի թատերգության գլուխգործոցը նոր մեկնաբանությամբ», Կանթեղ. գիտական հոդվածների ժողովածու, 2002, թիվ 3, էջ 3–12",
      publisher: "Երևան",
      year: "2002",
      identifier: { kind: "url", value: "https://arar.sci.am/dlibra/publication/182081/edition/165312" },
      note: "The fullest modern study devoted to this play alone, and the source of the reading the character section rests on. Gldjyan rejects the received tragicomic account of Baghdasar in as many words and argues instead for a figure in two phases: the sobered Baghdasar of the later acts shows vitality, common sense and a sense of humour, and is not, in extremity, as stupid as he looks — but he remains a nonentity, and not a petty one to be pitied as a victim of circumstance, since he is among those responsible for the evil sprouting in his own society. Also cited for the reading of the maid Soghome against the sympathetic-servant type, and for the observation that both Baghdasar and Kipar try to buy the verdict and only Kipar succeeds.",
    },
    {
      author: "Վ. Ս. Դարբինյան",
      title: "«Հակոբ Պարոնյանի թատերգությունները», Լրաբեր հասարակական գիտությունների, 1972, թիվ 5, էջ 73–80",
      publisher: "ՀՍՍՀ ԳԱ, Երևան",
      year: "1972",
      identifier: { kind: "url", value: "https://arar.sci.am/dlibra/publication/38446/edition/34521" },
      note: "Cited as the position against Gldjyan's, so that the article can report a live disagreement rather than choose a winner. Darbinyan holds that the author expresses no positive attitude toward any character in the play; that Baghdasar only appears to be a suffering husband and is mocked precisely through that appearance, his suffering set in quotation marks; and that he cannot tell real love from outward attraction, which is the true motive of his so-called tragedy. Also the source for the survey of the plays as a sequence and for the gap of about fifteen years between Շողոքորթը and this comedy.",
    },
    {
      author: "Ս. Ն. Սարինյան",
      title: "«Պարոնյանի ծիծաղի փիլիսոփայությունը», Լրաբեր հասարակական գիտությունների, 1993, թիվ 4, էջ 39–48",
      publisher: "ՀՀ ԳԱԱ, Երևան",
      year: "1993",
      identifier: { kind: "url", value: "https://arar.sci.am/dlibra/publication/42312/edition/37892" },
      note: "The formulation the satire section turns on: that in this play the real and the satirical are of equal weight, there is no parallel track running beside the comedy, and the world is submerged whole inside the satire. Cited with care about what it contrasts — Sarinyan is setting the play against Sundukyan's drama, where the comic is drawn against a background of positive reality and the line between them stays visible, not against Paronyan's own prose. He also holds that Ատամնաբոյժն արեւելեան can be read alongside Molière's comedies while this play is something else in its social and psychological landscape.",
    },
    {
      author: "Ալբերտ Մակարյան",
      title: "«Հակոբ Պարոնյանի «Մեծապատիվ մուրացկանները» վիպակի պոետիկան», Հայագիտական հանդես, 2016, թիվ 2 (32), էջ 101–115",
      publisher: "Խ. Աբովյանի անվան ՀՊՄՀ, Երևան",
      year: "2016",
      identifier: { kind: "url", value: "https://arar.sci.am/dlibra/publication/401231/edition/371275" },
      note: "Cited for two things and not for its main subject. First, the shape of the career: Makaryan states that Paronyan began his literary work as a dramatist and ended as one, naming Երկու տերով ծառա մը in 1865 and this play in 1886 as the two ends. Second, the only scholarly attestation found for the medium of his dialogue — that he often gives whole pages over to nothing but the characters' living talk, delivered in rich Constantinople Armenian speech. The article leans on that phrase rather than characterising the play's language on its own authority, because no study devoted to the language of this play could be located.",
    },
    {
      title: "Հայոց լեզվի բարբառային բառարան",
      publisher: "ՀՀ ԳԱԱ Հ. Աճառյանի անվան լեզվի ինստիտուտ, Երևան",
      year: "2001–2012",
      identifier: { kind: "archive", value: "Հայոց լեզվի բարբառային բառարան, բառահոդվածներ «աղբար» և «աղբեր»" },
      note: "The evidence for the one word in the title, and the reason the article refuses the reading that most invites itself. The dictionary marks աղբար as dialectal and refers it to աղբեր, whose dialect list opens with Պոլիս — so the form is native Constantinople speech rather than a provincial import, and cannot be used to make Baghdasar a rustic. The idioms recorded under it are markers of intimacy rather than of low origin. The article states the register contrast — inherited spoken form against the learned եղբայր — and stops there, because the later pejorative sense the word acquired in Soviet Armenia belongs to the twentieth century and cannot be read back into an 1886 title.",
    },
    {
      author: "Hagop Baronian, translated and edited by Mischa Kudian",
      title: "Balthazar: A Satirical Farce in Three Acts",
      publisher: "Mashtots Press, London",
      year: "1992",
      identifier: { kind: "isbn", value: "9780903039208" },
      note: "One of the two published English versions, and cited as evidence about the title rather than as the authority on it. Kudian, who had already given English readers Մեծապատիվ մուրացկաններ as Honourable Beggars, dropped the Armenian word from the title altogether and called the play simply Balthazar. That is half the reason this article treats Baghdasar Aghbar as a transliteration rather than a translation: the two translators who actually printed the play in English did not agree on what to call it.",
    },
    {
      author: "Hagop Baronian and others, translated by Paul Rapley and Aramazd Stepanian",
      title: "Armenian Playwrights, Volume I",
      publisher: "C.A.P.S. Publications",
      year: "2020",
      identifier: { kind: "isbn", value: "9781649991294" },
      note: "The other half of the title evidence, and the more revealing half. This translation keeps the Armenian title transliterated as Baghdasar Akhpar and then glosses it in parentheses as Uncle Baghdasar — that is, the most recent translators declined to settle on an English title and printed both solutions at once. Cited for that, and for the description of the play as a late nineteenth-century marital comedy with a strong satirical bent.",
    },
    {
      title: "«Բաղդասարը բաժանվում է կնոջից», ռեժիսոր՝ Գրիգոր Մելիք-Ավագյան, սցենար՝ Աղասի Այվազյան, «Հայֆիլմ»",
      publisher: "Госфильмофонд России, каталог",
      year: "1976",
      identifier: { kind: "url", value: "https://gosfilmofond.ru/films/255195/" },
      note: "The state film archive's catalogue record, cited so that the screen adaptation is described from a catalogue rather than from a synopsis site. It supplies the production year of 1976 against an April 1977 release, the studio, the director and screenwriter, the classification as a feature film rather than a filmed stage production, and Mher Mkrtchyan in the title part. It is also the source for the qualification the article makes twice: the film is built on motifs of the play rather than being an adaptation of its text, and it spells the name Բաղդասար where the play has Պաղտասար.",
    },
  ],
`;

s = s.replace(crlf(anchor), crlf(block));
writeFileSync(p, s, "utf8");
console.log("sources.ts: baghdasar-aghbar added");
