import { readFileSync, writeFileSync } from "node:fs";

const p = "scripts/_bagh_en.txt";
let s = readFileSync(p, "utf8");

/* 1. Fold the Constantinople section into the tribunal section: 19 sections → 18. */
const startMark = `      {\n        id: "constantinople",`;
const endMark = `        ],\n      },\n      {\n        id: "among-his-satires",`;
const i = s.indexOf(startMark);
const j = s.indexOf(endMark);
if (i < 0 || j < 0) throw new Error("constantinople section markers not found");

const folded =
  `          "All of this rests on a fact about the city. The Armenians of Ottoman Constantinople governed much of their own communal life under a National Constitution, with elected assemblies, councils and courts — which is why a play about one divorce can be a play about institutions. The tribunal, the councillors, the procedural offices and the charitable undertakings are parts of a single apparatus, staffed by the notables of a middle class that had lately acquired both money and the vocabulary of progress. Paronyan had spent his working life inside that world as a journalist and editor, and his subject was always the distance between what it said about itself and what it did. These are not generic hypocrites; they are a particular committee, in a particular city, using words the audience had heard at fundraising dinners.",\n` +
  `        ],\n      },\n      {\n        id: "among-his-satires",`;

// Everything from the tribunal's closing bracket through the constantinople block is replaced.
const tribunalClose = s.lastIndexOf(`        ],\n      },\n`, i);
if (tribunalClose < 0) throw new Error("tribunal close not found");
s = s.slice(0, tribunalClose) + folded + s.slice(j + endMark.length);

/* 2. Relations stay sparse: only the author is earned in the prose. */
const relFrom = `    relatedSlugs: ["hakob-paronyan", "mtnadzor", "the-fool"],`;
const relTo = `    relatedSlugs: ["hakob-paronyan"],`;
if (!s.includes(relFrom)) throw new Error("relatedSlugs not found");
s = s.replace(relFrom, relTo);

writeFileSync(p, s, "utf8");

const ids = [...s.matchAll(/^\s+id: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
console.log(`sections: ${ids.length}`);
console.log(ids.join(", "));
