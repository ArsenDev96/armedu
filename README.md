# ArmEdu — Armenian educational content platform (MVP)

An informational website about Armenian history, writers, literary works and cultural
heritage, built for students, teachers, parents and Armenians living abroad.

The MVP is deliberately content-only: no accounts, no login, no quizzes, comments,
payments, dashboards or progress tracking.

## Stack

- Next.js 16 (App Router) with TypeScript
- Tailwind CSS v4 (design tokens declared in `src/app/globals.css`)
- Local, statically typed content — no database

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all pages are statically generated)
npm start
npm run typecheck
```

## Project structure

```
src/
  app/
    page.tsx                 Homepage (hero, categories, featured, timeline,
                             writers, diaspora, newsletter)
    history/page.tsx         History listing: intro, search, period filters,
                             featured topic, article grid, timeline
    history/[slug]/page.tsx  History article page (e.g. /history/tigran-the-great)
    writers/page.tsx         Writers listing + featured writer
    writers/[slug]/page.tsx  Writer biography page
    works/page.tsx           Literary works listing
    works/[slug]/page.tsx    Literary work page
    about, contact, privacy  Supporting pages
    sitemap.ts, robots.ts    SEO route metadata
  components/
    layout/                  Header (nav, search, language selector), Footer, Logo
    sections/                Hero, Timeline, ListingControls, FeaturedItem,
                             NewsletterForm
    cards/                   ArticleCard, CategoryCard, WriterCard, WorkCard
    article/                 ArticleLayout, Breadcrumbs, TableOfContents,
                             RelatedArticles
    ui/                      Primitives (Card, Pill, ButtonLink, Section…) and the
                             generated PlaceholderImage
  data/
    types.ts                 Content model + locale list
    site.ts                  Site metadata, navigation, footer links
    index.ts                 Locale registry with fallback
    locales/en/              English content bundle
      history.ts             Categories, timeline, period filters
      writers.ts             Writer cards + literary period filters
      works.ts               Literary work cards
      articles/              Full article content, grouped by section
  lib/content.ts             Read helpers used by the pages
```

## Adding content

Add an object to the relevant file under `src/data/locales/en/articles/`. Every
article conforms to the `Article` interface in `src/data/types.ts`, so the page
layout, table of contents, key facts, dates, related figures and sources all render
automatically. New slugs are picked up by `generateStaticParams` and the sitemap.

## Adding a language

The content model is locale-first: `src/data/index.ts` holds a registry of locale
bundles and falls back to English for anything missing.

1. Copy `src/data/locales/en` to `src/data/locales/hy` (or `hyw`, `ru`) and translate.
2. Register it in `src/data/index.ts`.
3. Wire the header's language selector (currently visual only) to the chosen locale.

## Known MVP limitations

- Search and the listing filters are presentational; they do not narrow results yet.
- The language selector highlights a choice but does not switch content.
- The newsletter form validates and confirms locally; nothing is submitted anywhere.
- Article imagery uses locally generated SVG placeholders (`PlaceholderImage`), which
  can be replaced with licensed photography without touching any layout.
