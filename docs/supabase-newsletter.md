# Newsletter collection with Supabase

Supabase is used in this project for **one purpose only**: storing the email
addresses people submit through the newsletter form.

It is **not** used for content, authentication, profiles, article storage,
search, or anything else. Every article, writer, literary work, category,
timeline entry and source stays in local TypeScript files under `src/data/`.

## 1. Create the project

1. Sign in at [supabase.com](https://supabase.com) and create a new project.
2. Wait for provisioning to finish (roughly two minutes).

## 2. Create the table and its policy

Open **SQL Editor → New query**, paste the contents of
[`supabase-newsletter.sql`](./supabase-newsletter.sql), and run it.

That script creates the `newsletter_subscribers` table, enables row level
security, and adds a single policy allowing anonymous `INSERT`.

## 3. Copy the credentials

Go to **Project Settings → API** and copy:

| Dashboard field   | Environment variable             |
| ----------------- | -------------------------------- |
| Project URL       | `NEXT_PUBLIC_SUPABASE_URL`       |
| `anon` public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY`  |

Then, in the project root:

```bash
cp .env.example .env.local
```

and fill both values in. Restart `npm run dev` afterwards — Next.js reads
environment variables at server start.

## 4. Verify

Submit an address through any newsletter form, then check
**Table Editor → newsletter_subscribers** in the dashboard. You should see one
row with the normalised email, the `source` of the form you used, and the
`locale` of the edition you submitted from — `hy` from `/hy`, `hyw` from `/hyw`,
`en` from `/en`.

## Security notes

> **The `service_role` key must never appear in frontend code.**

- `service_role` bypasses row level security completely. Anyone who obtains it
  can read, edit and delete the entire subscriber list.
- Never assign it to a `NEXT_PUBLIC_*` variable. Anything prefixed
  `NEXT_PUBLIC_` is inlined into the JavaScript bundle that every visitor
  downloads.
- Never commit it, and never paste it into `.env.example`.
- This project has no server-side Supabase usage at all, so it has no
  legitimate reason to hold the service-role key anywhere.

The `anon` key *is* safe to publish — that is what it is designed for. What
protects the table is the policy set: anon may `INSERT` and nothing else, so a
visitor can add their own address but cannot read anyone else's.

## What the form writes

```ts
{
  email: email.trim().toLowerCase(),
  source: "homepage" | "footer" | "contact-page" | "article-page" | "writers-page",
  locale: "hy" | "hyw" | "en"
}
```

`locale` is the **active route locale** — the edition the reader was actually in
when they subscribed, taken from the `/[locale]` URL segment. It is never a
hard-coded default. The only permitted values are:

| Value | Edition |
| ----- | ------- |
| `hy`  | Հայերեն — Eastern Armenian, the default and primary edition |
| `hyw` | Արեւմտահայերէն — Western Armenian |
| `en`  | English |

The SQL adds a `check` constraint enforcing exactly that set, so a regression in
the form surfaces as a rejected insert rather than as unusable rows. If a fourth
edition is added later, extend both the constraint and `SUPPORTED_LOCALES`.

`source` records which form the subscription came from. `email` carries a unique
constraint; a repeat submission returns Postgres error `23505`, which the form
reports as a friendly "already subscribed" message rather than an error.

## Running without Supabase

The project must run on a fresh clone with no credentials. When either variable
is missing, `getSupabaseClient()` returns `null`, and the newsletter form shows a
development notice explaining that collection is not configured. It never
pretends the subscription succeeded, and it never crashes the page.
