-- ---------------------------------------------------------------------------
-- Armat — contact messages
--
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
--
-- This is the second and last table the project uses; the first is
-- `newsletter_subscribers`. Articles, writers, literary works and every other
-- piece of educational content stay in local TypeScript files under src/data.
--
-- Why the table exists at all: the contact form's primary delivery is SMTP
-- email. This table is the safety copy, so a message is not lost when the mail
-- server rejects it, times out, or silently drops it into a spam folder.
--
-- Security model: rows are written by the server route `/api/contact`, which
-- holds the same anon key the browser does. Row level security is therefore
-- what protects the table, exactly as with the newsletter — the policy below
-- grants INSERT and nothing else. Reading the messages is done from the
-- Supabase dashboard, which authenticates as an owner and bypasses RLS.
-- ---------------------------------------------------------------------------

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  -- The edition the reader wrote from: 'hy' (Armenian, the default and primary
  -- edition), 'hyw' (Western Armenian) or 'en' (English). Knowing this tells an
  -- editor which language to reply in.
  locale text not null default 'hy',
  -- Whether the SMTP send succeeded. A row with `false` is a message that
  -- reached the database but may never have reached the inbox — those are the
  -- ones worth checking by hand.
  emailed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

create policy "Allow public contact submissions"
on contact_messages
for insert
to anon
with check (true);

-- Same guard as the newsletter: a bug in the form can never quietly fill the
-- column with values no editor can interpret.
alter table contact_messages
  drop constraint if exists contact_messages_locale_check;

alter table contact_messages
  add constraint contact_messages_locale_check
  check (locale in ('hy', 'hyw', 'en'));

-- Length guards, mirroring the validation in `/api/contact`. The route rejects
-- oversized input before it gets here; this stops anything that bypasses it.
alter table contact_messages
  drop constraint if exists contact_messages_length_check;

alter table contact_messages
  add constraint contact_messages_length_check
  check (
    char_length(name) between 1 and 120
    and char_length(email) between 3 and 254
    and char_length(message) between 10 and 5000
  );

-- Newest first is the only order an editor reads this table in.
create index if not exists contact_messages_created_at_idx
  on contact_messages (created_at desc);

-- ---------------------------------------------------------------------------
-- Deliberately NOT created:
--
--   * a select policy  — nobody may read the messages from the browser
--   * an update policy — a submitted message cannot be edited from the browser
--   * a delete policy  — messages are cleared by an editor, not by anon
--
-- Note there is no unique constraint on `email`: unlike a newsletter address,
-- the same person may legitimately write more than once.
-- ---------------------------------------------------------------------------
