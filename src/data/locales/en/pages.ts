import type { StaticPagesContent } from "@/data/types";

export const pages: StaticPagesContent = {
  about: {
    title: "About",
    metaDescription:
      "Armat is an independent educational platform publishing clear, source-based articles about Armenian history, writers, literary works and cultural heritage.",
    heading: "About the platform",
    lead: "Armat is an independent educational project. We publish clear articles about Armenian history, writers, literary works and cultural heritage, list the works behind them so that any claim can be checked, and make them free to read for anyone, anywhere.",
    audiencesEyebrow: "Who it is for",
    audiencesTitle: "Written for four kinds of reader",
    audiencesDescription:
      "The same article should work for a fourteen-year-old writing an essay and for a parent in Los Angeles reading at the kitchen table.",
    audiences: [
      {
        title: "Students",
        text: "Short, structured articles with key facts, dates and sources that can be cited in homework and presentations.",
      },
      {
        title: "Teachers",
        text: "Material organised by period and topic, written to be assigned directly or adapted into lesson plans.",
      },
      {
        title: "Parents",
        text: "Background reading that makes it easy to answer a child's question about a name, a date or a poem.",
      },
      {
        title: "The diaspora",
        text: "An entry point into Armenian culture for families outside Armenia, in a language everyone at home can read.",
      },
    ],
    principlesEyebrow: "How we work",
    principlesTitle: "Editorial principles",
    principles: [
      {
        title: "Accuracy before ambition",
        text: "Every article lists the works behind it, each with an ISBN or a permanent link, so a claim can be followed to something you can actually find in a library. Where historians disagree — and on several of these questions they genuinely do — we say so rather than choosing a side.",
      },
      {
        title: "Plain language",
        text: "Armenian history is often written in a register that keeps newcomers out. We write for a reader who has never opened a history book — without simplifying the substance.",
      },
      {
        title: "Culture, not symbolism",
        text: "The focus is on what people wrote, built and argued about. Heritage is presented as something to understand, not something to decorate.",
      },
      {
        title: "Corrections",
        text: "This is an early archive and it has contained mistakes. When one is found it is fixed in all three languages rather than quietly left in the edition nobody checked. If you find something wrong, please tell us.",
      },
    ],
    languagesHeading: "Languages",
    languagesBody:
      "The platform is published in Eastern Armenian, Western Armenian and English. Armenian is the primary edition. The Western Armenian edition is complete and has undergone multiple AI-assisted editorial reviews, but it has not been reviewed by a native Western Armenian editor. The content structure is translation-first, so each article is translated rather than rewritten, and readers can switch language without losing their place.",
    nextHeading: "What is next",
    nextBody:
      "This is an early version. The article archive will keep growing. The pictures are illustrations made for the site rather than documentary photographs, and replacing them with licensed museum material is still on the list. Suggestions and corrections from teachers are especially welcome.",
    newsletterEyebrow: "Newsletter",
    newsletterTitle: "Receive new Armenian history and literature articles",
    newsletterDescription: "One email a month, with the newest articles and classroom material.",
  },

  contact: {
    title: "Contact",
    metaDescription:
      "Get in touch with the Armat editorial team about corrections, classroom use, translations or collaboration.",
    heading: "Contact us",
    lead: "This is a small editorial project and we read everything that arrives. Use the form below and we will reply to the address you give us.",
    reasonsEyebrow: "Why people write to us",
    reasonsTitle: "What we can help with",
    reasons: [
      {
        title: "Corrections",
        text: "Found a date, a name or a spelling that is wrong? Tell us which article and we will check it against our sources.",
      },
      {
        title: "Classroom use",
        text: "Teachers are welcome to use these articles in lessons. Write to us if you need a topic that is not covered yet.",
      },
      {
        title: "Language review and images",
        text: "We are looking for help reviewing and improving the Western Armenian language, and for museums and archives willing to share imagery.",
      },
    ],
    alsoHere: "Also here:",
    newsletterEyebrow: "Newsletter",
    newsletterTitle: "Receive new Armenian history and literature articles",
  },

  privacy: {
    title: "Privacy Policy",
    metaDescription:
      "How Armat handles visitor data. The platform collects no personal information beyond an optional newsletter address and anything you choose to write in the contact form.",
    lastUpdated: "Last updated: 3 August 2026",
    lead: "Armat is an educational project and is built to work without collecting personal data. This page explains, in plain language, what that means in practice.",
    sections: [
      {
        heading: "What we collect",
        body: "Reading an article on this site requires no account and no personal information. If you subscribe to the newsletter, we store the email address you provide, the page the subscription came from and the language you were reading in — nothing else. If you write to us through the contact form, we store the name, email address and message you send, together with the language you wrote in, and use them only to reply to you.",
      },
      {
        heading: "Analytics",
        body: "The site uses Google Analytics to count visits and see which articles are read. It records the pages you open, the language edition you read in, an approximate location derived from your IP address, and general details about your device and browser. It does not tell us who you are, and we never combine it with a newsletter address or a contact message. Those two forms are the other exception: both are stored by Supabase, a hosting provider acting on our behalf, which also receives your IP address as part of that request, and a contact message is additionally delivered to our mailbox by email. You can switch analytics off for every site by turning on \"Do Not Track\" or a content blocker in your browser.",
      },
      {
        heading: "Cookies",
        body: "The site itself sets no cookies and stores nothing in your browser about you. Google Analytics does set its own cookies, which is how it tells a returning reader from a new one; they carry a random identifier and no personal information. Blocking cookies for this site disables them and the site keeps working exactly as before. Your chosen language is part of the web address, not something we save about you.",
      },
      {
        heading: "Children",
        body: "The platform is written for school-age readers and deliberately avoids collecting information from them. No account is needed, no profile is created and nothing a reader writes is published on the site.",
      },
      {
        heading: "Your rights",
        body: "You can ask us at any time to remove your email address from the newsletter list, or to delete a message you sent us. Send the request through the contact form and we will confirm the deletion.",
      },
    ],
  },
  visit: {
    title: "Visit Armenia: Places, Nature & Food",
    metaDescription:
      "Discover places to visit in Armenia, from historic monasteries and ancient sites to Lake Sevan, museums and traditional Armenian food.",
    heading: "Visit Armenia",
    lead: "Discover Armenia through historic places, landscapes, monasteries, museums and food. Everything here links into the archive, so you can read about a site before you stand in front of it.",
    placesEyebrow: "Where to begin",
    placesTitle: "Places to discover",
    placesDescription:
      "Six sites that between them cover most of what the country is known for: a classical temple, two monasteries, a fortress, a manuscript collection and a mountain lake.",
    placesCta: "Explore all places",
    typesEyebrow: "By kind of site",
    typesTitle: "Explore by type",
    typesDescription:
      "The same four groups the places listing filters by. Each one opens the full listing with that filter applied.",
    foodEyebrow: "At the table",
    foodTitle: "Armenian food to try",
    foodDescription:
      "Four dishes of four different kinds — a bread, a main dish, food from the grill and a sweet — each explained as cooking rather than as a menu.",
    foodCta: "Explore Armenian cuisine",
    learnEyebrow: "Context",
    learnTitle: "Learn before you visit",
    learnDescription:
      "Four articles that explain what the places above are evidence of. Each is already linked from the sites it belongs with.",
    learnCta: "Learn about Armenia",
    mapEyebrow: "On the map",
    mapTitle: "Explore Armenia on the map",
    mapDescription:
      "See where Armat's featured places are located across Armenia. Select a marker to read what a site is before you go and see it.",
    mapRegionLabel: "Map of places written about on Armat",
    mapListTitle: "Mapped places",
    mapSelectPrompt: "Select a place on the map to see what it is.",
    mapCta: "Learn about this place",
    mapFilterLabel: "Show places by type",
    mapUnavailable: "The map could not be loaded. All the places on it are listed below.",
    mapClusterLabel: "{count} places",
  },
};
