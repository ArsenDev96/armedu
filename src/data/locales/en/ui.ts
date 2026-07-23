import type { UiDictionary } from "@/data/ui";

export const ui: UiDictionary = {
  site: {
    name: "Armat",
    tagline: "Armenian history, literature and culture",
    description:
      "Clear and accessible articles about Armenian historical events, famous writers, important literary works, and cultural heritage.",
    skipToContent: "Skip to content",
    homeLinkLabel: "Armat — home",
  },

  nav: {
    mainLabel: "Main navigation",
    mobileLabel: "Mobile navigation",
    breadcrumbLabel: "Breadcrumb",
    home: "Home",
    history: "Armenian History",
    writers: "Armenian Writers",
    works: "Literary Works",
    about: "About",
    contact: "Contact",
    privacy: "Privacy Policy",
    search: "Search",
    sitemap: "Sitemap",
    allHistoryArticles: "All history articles",
    allWriters: "All writers",
    allWorks: "All literary works",
    submenuLabel: "{item} submenu",
    toggleMenu: "Toggle navigation menu",
  },

  header: {
    searchButtonLabel: "Search articles",
    searchInputLabel: "Search articles, writers and works",
    searchPlaceholder: "Search articles, writers, works…",
    searchSubmit: "Search",
    selectLanguage: "Select language",
    languageHeading: "Language",
    switchToLanguage: "Switch to {language}",
    currentLanguage: "Current language: {language}",
  },

  footer: {
    description:
      "A platform dedicated to preserving and sharing Armenian history, literature, and culture with the world.",
    socialLabel: "Social media",
    exploreTitle: "Explore",
    historyTitle: "History",
    writersTitle: "Writers",
    resourcesTitle: "Resources",
    timeline: "Timeline",
    allArticles: "All Articles",
    ancientArmenia: "Ancient Armenia",
    armenianKingdoms: "Armenian Kingdoms",
    medievalArmenia: "Medieval Armenia",
    modernArmenia: "Modern Armenia",
    importantFigures: "Important Figures",
    languageTitle: "Language",
    copyright: "© {year} {name}. All rights reserved.",
  },

  home: {
    heroTitleLead: "Discover Armenian ",
    heroTitleAccent: "history, literature,",
    heroTitleTail: " and culture",
    heroDescription:
      "Clear and accessible articles about Armenian historical events, famous writers, important literary works, and cultural heritage.",
    heroPrimaryCta: "Explore Armenian History",
    heroSecondaryCta: "Discover Armenian Writers",
    heroImageAlt:
      "Khor Virap monastery on the Armenian highland, with the snow-capped peak of Mount Ararat behind it",
    categoriesHeading: "Explore the platform",
    featuredHeading: "Featured Articles",
    featuredAction: "View all articles",
    timelineHeading: "Explore Armenian History",
    timelineAction: "View full timeline",
    writersHeading: "Popular Writers",
    writersAction: "View all writers",
    newsletterHeading: "Be the first to discover what’s new on Armat",
    newsletterDescription:
      "Join our email list and be the first to hear about new articles, stories, and platform updates.",
    diasporaTitle: "Stay connected to Armenian culture",
    diasporaText:
      "Explore Armenian history and literature through clear articles created for Armenian families, students, and teachers around the world.",
    diasporaCta: "Start Exploring",
  },

  listing: {
    filtersHeading: "Filters",
    clearSearch: "Clear",
    clearAllFilters: "Clear all filters",
    countArticlesOne: "{count} article",
    countArticlesOther: "{count} articles",
    countWritersOne: "{count} writer",
    countWritersOther: "{count} writers",
    countWorksOne: "{count} work",
    countWorksOther: "{count} works",
    matchesSearch: "match your search",
    available: "available",
    history: {
      title: "Armenian History",
      metaDescription:
        "Explore important periods, kingdoms, people, battles and events in Armenian history — from the Kingdom of Urartu to the First Republic of Armenia.",
      lead: "Three thousand years of history on the Armenian Highland, told in short, readable articles. Every topic includes key facts, a timeline of dates and the sources behind it, so it can be used for homework, lesson planning or simple curiosity.",
      searchLabel: "Search history articles",
      searchPlaceholder: "Search historical events, kingdoms and people…",
      featuredEyebrow: "Featured topic",
      featuredTitle: "Where most readers begin",
      allEyebrow: "All history articles",
      allTitle: "Periods, people and events",
      allDescription:
        "Articles are added regularly. Use the search field and the period filters above to narrow the archive.",
      timelineEyebrow: "Timeline",
      timelineTitle: "Armenian history at a glance",
      timelineDescription: "A quick overview of the periods covered on the platform.",
      readArticle: "Read the article",
    },
    writers: {
      title: "Armenian Writers",
      metaDescription:
        "Biographies of the poets and novelists who shaped Armenian literature — Hovhannes Tumanyan, Yeghishe Charents, Raffi, Avetik Isahakyan, Khachatur Abovyan and Paruyr Sevak.",
      lead: "Armenian literature is carried by a small number of writers whose work almost every Armenian family knows by heart. These biographies explain who they were, what they wrote, and why their books still matter — in language students can actually use.",
      searchLabel: "Search Armenian writers",
      searchPlaceholder: "Search writers, poems and novels…",
      featuredEyebrow: "Featured writer",
      featuredTitle: "The poet of all Armenians",
      notableWorks: "Notable works",
      readBiography: "Read the biography",
      allEyebrow: "All writers",
      allTitle: "From Abovyan to Sevak",
      allDescription:
        "Six writers who span two centuries of Armenian literature, each with a full biography.",
      newsletterEyebrow: "Newsletter",
      newsletterTitle: "Receive new Armenian history and literature articles",
      newsletterDescription: "New biographies and article summaries, once a month.",
    },
    works: {
      title: "Literary Works",
      metaDescription:
        "Summaries, historical context, characters and key ideas from important Armenian literary works, including Anush, Wounds of Armenia, The Fool and David of Sassoun.",
      lead: "What happens in the story, who the characters are, when it was written and what it is really about. Each article gives the context a reader needs before opening the book — and the arguments a student needs after finishing it.",
      searchLabel: "Search literary works",
      searchPlaceholder: "Search poems, novels and epics…",
      featuredEyebrow: "Featured work",
      featuredTitle: "Armenia's best-known love story",
      readSummary: "Read the summary",
      allEyebrow: "All works",
      allTitle: "The books Armenian students read",
      allDescription:
        "Poems, novels and epics that shaped the modern Armenian literary language.",
    },
  },

  empty: {
    heading: "No matches found",
    bodyWithQuery:
      "Nothing here matches “{query}” with the filter you have selected. Try a shorter term, a different spelling, or remove the filter.",
    bodyNoQuery:
      "Nothing matches the filter you have selected. The archive grows regularly — try another period in the meantime.",
    clearLabel: "Clear search and filters",
  },

  search: {
    title: "Search",
    metaDescription:
      "Search every Armenian history article, writer biography and literary work on Armat.",
    heading: "Search",
    lead: "One field across the whole site — {count} articles, biographies and literary works.",
    inputLabel: "Search Armenian history, writers and literary works",
    placeholder: "Search articles, writers, works…",
    clear: "Clear",
    prompt: "Type to search across history, writers and literary works.",
    resultsOne: "{count} result for “{query}”",
    resultsOther: "{count} results for “{query}”",
    groupHistory: "History",
    groupWriters: "Writers",
    groupWorks: "Literary Works",
    groupCountOne: "{count} result",
    groupCountOther: "{count} results",
    typeHistory: "History",
    typeWriter: "Writer",
    typeWork: "Literary work",
    noQueryHeading: "What are you looking for?",
    noQueryBody:
      "Search covers every history article, writer biography and literary work on the site. Try a name, a century, a battle or the title of a book.",
    browseHistory: "Browse history",
    browseWriters: "Browse writers",
    browseWorks: "Browse works",
    noResultsHeading: "No results found",
    noResultsBody:
      "Nothing on the site matches “{query}”. Check the spelling, try a shorter term, or browse a section instead.",
    noResultsClear: "Clear search",
  },

  article: {
    updated: "Updated",
    author: "Author",
    readingTimeLabel: "Reading time",
    readingTime: "{minutes} min read",
    backToCategory: "Back to {category}",
    tableOfContents: "Table of contents",
    keyFacts: "Key facts",
    relatedTopics: "Related topics",
    importantDates: "Important dates",
    interestingFacts: "Interesting facts",
    relatedFigures: "Related historical figures",
    sources: "Sources",
    visitSource: "Visit source",
    relatedArticles: "Related articles",
    previous: "Previous",
    next: "Next",
    previousAria: "Previous in {category}: {title}",
    nextAria: "Next in {category}: {title}",
    moreInCategory: "More in {category}",
    copyLink: "Copy link",
    copied: "Copied",
    copyFailed: "Press Ctrl+C to copy",
    copiedAnnouncement: "Link copied to clipboard",
    copyFailedAnnouncement:
      "Copying failed. Copy the address from the address bar instead.",
    imagePlaceholderCaption:
      "Illustration placeholder — {title}. Replace with licensed imagery before launch.",
    imageAiIllustrationCaption:
      "AI-generated illustration for {title} — an imagined scene.",
    imageAiPortraitCaption:
      "AI-generated portrait of {title} — an imagined likeness, not a real photograph.",
    imageAlt: "Illustration for {title}",
    portraitAlt: "Portrait placeholder of {name}",
    portraitIllustrationAlt: "Illustrated portrait of {name}",
    imageCredit: "Image: {credit}",
    typeHistory: "History",
    typeWriters: "Writers",
    typeWorks: "Works",
  },

  unavailable: {
    eyebrow: "Not yet translated",
    heading: "This article is not available in English yet",
    body: "The archive is being translated article by article, and this one is not in English yet. It is available in the languages below.",
    readInOther: "Read in {language}",
    backToCategory: "Back to {category}",
    metaTitle: "Not available in English",
  },

  newsletter: {
    emailLabel: "Email address",
    placeholder: "your@email.com",
    placeholderInline: "Enter your email address",
    button: "Join Armat",
    submitting: "Joining…",
    noteDefault:
      "No spam, and you can unsubscribe at any time.",
    noteInline: "No spam. Only meaningful updates from Armat.",
    invalid: "Please enter a valid email address, for example name@example.com.",
    success: "Thank you — you are on the list. The next issue will reach this address.",
    duplicate: "This address is already subscribed. Nothing more to do.",
    error: "Something went wrong on our side. Please try again in a moment.",
    unconfigured:
      "Newsletter collection is not configured in this environment, so nothing was saved. Add the Supabase credentials from .env.example to enable it.",
    devNote:
      "Development note: Supabase is not configured, so submissions cannot be stored yet.",
  },

  contactForm: {
    eyebrow: "Write to us",
    title: "Send us a message",
    description:
      "Write your question or suggestion and we will get back to you by email.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    // Deliberately not "Email address": the newsletter form on the same page
    // already uses that label, and two identical labels are ambiguous both to a
    // screen reader and to anything selecting a field by name.
    emailLabel: "Your email address",
    emailPlaceholder: "name@example.com",
    messageLabel: "Message",
    messagePlaceholder: "Write your question or suggestion here…",
    requiredMark: "required",
    submit: "Send",
    submitting: "Sending…",
    invalidName: "Please enter your name.",
    invalidEmail: "Please enter a valid email address, for example name@example.com.",
    invalidMessage: "Please write a message of at least ten characters.",
    success: "Thank you — your message has reached us. We reply to the address you gave.",
    error: "The message could not be sent. Please try again, or write to us by email.",
    rateLimited: "Several messages have already been sent from here. Please try again a little later.",
    unconfigured:
      "The contact form is not configured in this environment, so nothing was sent. Add the SMTP settings from .env.example to enable it.",
    devNote:
      "Development note: SMTP is not configured, so messages cannot be sent yet.",
    privacyNote:
      "Your name, address and message are used only to reply to you.",
  },

  notFound: {
    eyebrow: "Error 404",
    title: "This page could not be found",
    body: "The article may have moved, or the address may contain a typo. The sections below are a good place to continue.",
    backHome: "Back to home",
    exploreHistory: "Explore Armenian History",
  },
};
