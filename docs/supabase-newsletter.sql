-- ---------------------------------------------------------------------------
-- Armat — newsletter subscribers
--
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
--
-- This is the ONLY table the project uses. Articles, writers, literary works,
-- categories, timelines, sources and every other piece of educational content
-- stay in local TypeScript files under src/data and are never stored here.
--
-- Security model: the browser holds the anon key, which is public by design.
-- Row level security is what protects the table. The policy below grants anon
-- INSERT and nothing else — no SELECT, no UPDATE, no DELETE — so a visitor can
-- add their own address but cannot read, change or delete anyone else's.
-- Reading the list is done from the Supabase dashboard, which authenticates as
-- an owner and bypasses RLS.
-- ---------------------------------------------------------------------------

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  -- The edition the reader subscribed from. The form writes the active route
  -- locale, which is always one of: 'hy' (Armenian, the default and primary
  -- edition), 'hyw' (Western Armenian) or 'en' (English).
  locale text not null default 'hy',
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

create policy "Allow public newsletter signup"
on newsletter_subscribers
for insert
to anon
with check (true);

-- Optional: reject anything outside the three supported editions, so a bug in
-- the form can never quietly fill the column with unusable values.
alter table newsletter_subscribers
  drop constraint if exists newsletter_subscribers_locale_check;

alter table newsletter_subscribers
  add constraint newsletter_subscribers_locale_check
  check (locale in ('hy', 'hyw', 'en'));

-- ---------------------------------------------------------------------------
-- Deliberately NOT created:
--
--   * a select policy  — nobody may read the subscriber list from the browser
--   * an update policy — addresses cannot be edited from the browser
--   * a delete policy  — unsubscribes are handled by an editor, not by anon
--
-- Adding any of them would expose every subscriber's email address to every
-- visitor, because the anon key is embedded in the client bundle.
-- ---------------------------------------------------------------------------
