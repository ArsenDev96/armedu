/**
 * The complete set of visible interface strings.
 *
 * Every locale bundle must supply a `UiDictionary`. Because every field is
 * required and nothing is optional, a missing translation is a TypeScript error
 * at build time rather than an English string leaking onto an Armenian page.
 *
 * Content — article prose, writer biographies, category copy — is *not* here.
 * It lives in the content collections alongside this dictionary.
 */
export interface UiDictionary {
  /** Site-level strings. */
  site: {
    /** Product name. Latin in every edition — it is a proper name. */
    name: string;
    tagline: string;
    description: string;
    /**
     * Subjects the edition as a whole covers, in this locale's own language.
     *
     * Inherited by every page that does not declare its own set, because Next
     * merges `keywords` down the layout tree rather than concatenating them.
     * Keep it to what the site genuinely publishes — see `ArticleSummary.keywords`
     * for why this field is not a place to be ambitious.
     */
    keywords: string[];
    skipToContent: string;
    homeLinkLabel: string;
  };

  nav: {
    mainLabel: string;
    mobileLabel: string;
    breadcrumbLabel: string;
    home: string;
    history: string;
    writers: string;
    works: string;
    cuisine: string;
    about: string;
    /**
     * Header-bar labels. The names above carry the "Armenian" qualifier because
     * breadcrumbs and the footer show them standing alone; in the header the
     * logo already supplies that context, and repeating it on four items was
     * 200px of the width that kept the horizontal nav off 1024px screens. See
     * the note above the nav in `Header.tsx`.
     */
    historyShort: string;
    writersShort: string;
    worksShort: string;
    cuisineShort: string;
    /**
     * Places has no `…Short` twin: the label is already the bare noun the four
     * above had to be shortened into, so `NavItem.shortLabel` is left unset and
     * the header falls back to this one.
     */
    places: string;
    contact: string;
    privacy: string;
    search: string;
    sitemap: string;
    allHistoryArticles: string;
    allWriters: string;
    allWorks: string;
    allCuisineArticles: string;
    allPlaces: string;
    /** Accessible name for a nav dropdown toggle; `{item}` is the parent label. */
    submenuLabel: string;
    toggleMenu: string;
  };

  header: {
    searchButtonLabel: string;
    searchInputLabel: string;
    searchPlaceholder: string;
    searchSubmit: string;
    selectLanguage: string;
    languageHeading: string;
    /** Accessible name pattern for a language link, e.g. "Switch to Armenian". */
    switchToLanguage: string;
    currentLanguage: string;
  };

  footer: {
    description: string;
    socialLabel: string;
    exploreTitle: string;
    historyTitle: string;
    writersTitle: string;
    resourcesTitle: string;
    timeline: string;
    allArticles: string;
    /**
     * Labels for the footer's five thematic history links. Each names the one
     * article it points at, and none may restate a listing filter the taxonomy no
     * longer has — see the note on `FOOTER_HISTORY` in `src/lib/navigation.ts`.
     */
    ancientArmenia: string;
    christianity: string;
    armenianAlphabet: string;
    medievalArmenia: string;
    modernArmenia: string;
    importantFigures: string;
    languageTitle: string;
    /** Heading above the footer's newsletter form. */
    newsletterTitle: string;
    /** `{year}` and `{name}` are substituted. */
    copyright: string;
  };

  home: {
    heroTitleLead: string;
    heroTitleAccent: string;
    heroTitleTail: string;
    heroDescription: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    /** Alt text for the Khor Virap / Ararat photograph. */
    heroImageAlt: string;
    categoriesHeading: string;
    featuredHeading: string;
    featuredAction: string;
    timelineHeading: string;
    timelineAction: string;
    writersHeading: string;
    writersAction: string;
    cuisineHeading: string;
    cuisineAction: string;
    newsletterHeading: string;
    newsletterDescription: string;
    diasporaTitle: string;
    diasporaText: string;
    diasporaCta: string;
  };

  listing: {
    filtersHeading: string;
    clearSearch: string;
    clearAllFilters: string;
    /** `{count}` substituted. `available` is the unfiltered state. */
    countArticlesOne: string;
    countArticlesOther: string;
    countWritersOne: string;
    countWritersOther: string;
    countWorksOne: string;
    countWorksOther: string;
    matchesSearch: string;
    available: string;
    history: {
      title: string;
      metaDescription: string;
      /** Overrides `site.keywords` on this listing. */
      keywords: string[];
      lead: string;
      searchLabel: string;
      searchPlaceholder: string;
      /**
       * Headings for the two filter axes. History is the only listing with more
       * than one, and a second unlabelled row of pills would read as one flat
       * vocabulary — which is the confusion the old mixed period list created.
       */
      periodFilterHeading: string;
      topicTypeFilterHeading: string;
      featuredEyebrow: string;
      featuredTitle: string;
      allEyebrow: string;
      allTitle: string;
      allDescription: string;
      timelineEyebrow: string;
      timelineTitle: string;
      timelineDescription: string;
      readArticle: string;
    };
    writers: {
      title: string;
      metaDescription: string;
      /** Overrides `site.keywords` on this listing. */
      keywords: string[];
      lead: string;
      searchLabel: string;
      searchPlaceholder: string;
      featuredEyebrow: string;
      featuredTitle: string;
      notableWorks: string;
      readBiography: string;
      allEyebrow: string;
      allTitle: string;
      allDescription: string;
      newsletterEyebrow: string;
      newsletterTitle: string;
      newsletterDescription: string;
    };
    works: {
      title: string;
      metaDescription: string;
      /** Overrides `site.keywords` on this listing. */
      keywords: string[];
      lead: string;
      searchLabel: string;
      searchPlaceholder: string;
      featuredEyebrow: string;
      featuredTitle: string;
      readSummary: string;
      allEyebrow: string;
      allTitle: string;
      allDescription: string;
    };
    cuisine: {
      title: string;
      metaDescription: string;
      /** Overrides `site.keywords` on this listing. */
      keywords: string[];
      lead: string;
      searchLabel: string;
      searchPlaceholder: string;
      featuredEyebrow: string;
      featuredTitle: string;
      allEyebrow: string;
      allTitle: string;
      allDescription: string;
      readArticle: string;
    };
    places: {
      title: string;
      metaDescription: string;
      /** Overrides `site.keywords` on this listing. */
      keywords: string[];
      lead: string;
      searchLabel: string;
      searchPlaceholder: string;
      featuredEyebrow: string;
      featuredTitle: string;
      allEyebrow: string;
      allTitle: string;
      allDescription: string;
      readArticle: string;
    };
  };

  empty: {
    heading: string;
    /** `{query}` substituted. */
    bodyWithQuery: string;
    bodyNoQuery: string;
    clearLabel: string;
  };

  search: {
    title: string;
    metaDescription: string;
    heading: string;
    /** `{count}` substituted — total indexed entries. */
    lead: string;
    inputLabel: string;
    placeholder: string;
    clear: string;
    prompt: string;
    /** `{count}` and `{query}` substituted. */
    resultsOne: string;
    resultsOther: string;
    groupHistory: string;
    groupWriters: string;
    groupWorks: string;
    groupCuisine: string;
    groupPlaces: string;
    /** `{count}` substituted, used under each group heading. */
    groupCountOne: string;
    groupCountOther: string;
    typeHistory: string;
    typeWriter: string;
    typeWork: string;
    typeCuisine: string;
    typePlace: string;
    noQueryHeading: string;
    noQueryBody: string;
    browseHistory: string;
    browseWriters: string;
    browseWorks: string;
    browseCuisine: string;
    browsePlaces: string;
    noResultsHeading: string;
    /** `{query}` substituted. */
    noResultsBody: string;
    noResultsClear: string;
  };

  article: {
    updated: string;
    author: string;
    readingTimeLabel: string;
    /** `{minutes}` substituted, e.g. "8 min read". */
    readingTime: string;
    /** `{category}` substituted. */
    backToCategory: string;
    tableOfContents: string;
    /**
     * Heading over the article's `summary` block. Rendered only when the article
     * declares one, so the heading is never shown above nothing.
     */
    summary: string;
    keyFacts: string;
    relatedTopics: string;
    importantDates: string;
    interestingFacts: string;
    relatedFigures: string;
    sources: string;
    visitSource: string;
    relatedArticles: string;
    previous: string;
    next: string;
    /** `{category}` and `{title}` substituted. */
    previousAria: string;
    nextAria: string;
    moreInCategory: string;
    copyLink: string;
    copied: string;
    copyFailed: string;
    copiedAnnouncement: string;
    copyFailedAnnouncement: string;
    /** `{title}` substituted. Shown only under the generated fallback artwork. */
    imagePlaceholderCaption: string;
    /**
     * `{title}` substituted. Caption under the shared, AI-generated artwork. The
     * provenance it states is recorded once in `ARTWORK_PROVENANCE`
     * (`lib/media.ts`), next to the files; this is the localized prose of it.
     *
     * Two forms, because the honest claim differs. A place or a work gets an
     * imagined *illustration*; a writer gets an imagined *portrait* — an invented
     * likeness of a real person for whom real photographs exist. Both must name
     * the AI origin outright: on a site used by students, a generated likeness
     * passed off as a document is worse than no picture at all.
     */
    imageAiIllustrationCaption: string;
    /** `{title}` is the writer's name. The portrait counterpart of the above. */
    imageAiPortraitCaption: string;
    imageAlt: string;
    /** `{name}` substituted. The generated placeholder portrait. */
    portraitAlt: string;
    /** `{name}` substituted. A drawn portrait, not a photograph. */
    portraitIllustrationAlt: string;
    imageCredit: string;
    typeHistory: string;
    typeWriters: string;
    typeWorks: string;
    typeCuisine: string;
    typePlaces: string;
    /**
     * Headings for the cuisine at-a-glance panel (`CuisineDetails`). Grouped
     * rather than flattened into `article` because they are rendered by one
     * block that only cuisine articles have, and a reader of any other category
     * never sees them.
     */
    cuisine: {
      detailsHeading: string;
      ingredients: string;
      preparation: string;
      occasions: string;
      regions: string;
      serving: string;
    };
  };

  /** Shown when an article exists in the project but not in this language. */
  unavailable: {
    eyebrow: string;
    heading: string;
    body: string;
    readInOther: string;
    backToCategory: string;
    metaTitle: string;
  };

  newsletter: {
    emailLabel: string;
    placeholder: string;
    placeholderInline: string;
    button: string;
    submitting: string;
    noteDefault: string;
    noteInline: string;
    invalid: string;
    success: string;
    duplicate: string;
    error: string;
    unconfigured: string;
    devNote: string;
  };

  /**
   * The contact form on `/contact`. Unlike the newsletter, this posts to a
   * server route (`/api/contact`) because SMTP credentials must never reach
   * the browser.
   */
  contactForm: {
    eyebrow: string;
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    /** Appended to the label of every field, which are all required. */
    requiredMark: string;
    submit: string;
    submitting: string;
    invalidName: string;
    invalidEmail: string;
    invalidMessage: string;
    success: string;
    error: string;
    rateLimited: string;
    unconfigured: string;
    devNote: string;
    privacyNote: string;
  };

  notFound: {
    eyebrow: string;
    title: string;
    body: string;
    backHome: string;
    exploreHistory: string;
  };
}
