import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { SUPPORTED_LOCALES, type Locale } from "@/data/types";
import { getUi } from "@/lib/i18n";

/**
 * The contact form's server side.
 *
 * This is the only server route in the project, and it exists for one reason:
 * SMTP credentials cannot live in the browser. Everything else — articles,
 * search, navigation — is still static.
 *
 * A submission is handled in two independent steps:
 *
 *   1. a copy is written to Supabase (`contact_messages`)
 *   2. the message is emailed to the editorial address over SMTP
 *
 * Step 1 is the safety net. If the mail server is down, misconfigured, or
 * quietly files the message as spam, the message is still recoverable from the
 * dashboard. The reader is told the send succeeded only if at least one of the
 * two actually stored or delivered their message.
 */

export const runtime = "nodejs"; // nodemailer opens TCP sockets; not edge-safe.
export const dynamic = "force-dynamic";

/** Mirrors the client-side check in `ContactForm`; the client is not trusted. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: { min: 1, max: 120 },
  email: { min: 3, max: 254 },
  message: { min: 10, max: 5000 },
} as const;

export type ContactFailure =
  | "invalid"
  | "rate-limited"
  | "unconfigured"
  | "error";

/* -------------------------------------------------------------------------- */
/*  Rate limiting                                                             */
/* -------------------------------------------------------------------------- */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/**
 * Per-process memory, which is the right scope for a single-server project and
 * is deliberately not persisted: a restart clearing the counters is acceptable,
 * a database round trip per submission is not. This stops a bored visitor and a
 * runaway script, not a distributed flood.
 */
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  // The map would otherwise grow for the lifetime of the process.
  if (hits.size > 5000) {
    for (const [id, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(id);
    }
  }

  return false;
}

/** The left-most entry in `x-forwarded-for` is the original client. */
function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/* -------------------------------------------------------------------------- */
/*  Configuration                                                             */
/* -------------------------------------------------------------------------- */

const smtp = {
  host: process.env.SMTP_HOST?.trim(),
  port: Number(process.env.SMTP_PORT?.trim() || 587),
  user: process.env.SMTP_USER?.trim(),
  password: process.env.SMTP_PASSWORD?.trim(),
  // Implicit TLS on 465; STARTTLS on 587 and 25.
  secure: (process.env.SMTP_SECURE?.trim() || "").toLowerCase() === "true",
  from: process.env.CONTACT_FROM_EMAIL?.trim(),
  to: process.env.CONTACT_TO_EMAIL?.trim(),
};

function smtpConfigured(): boolean {
  return Boolean(smtp.host && smtp.user && smtp.password);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

/* -------------------------------------------------------------------------- */
/*  Handler                                                                   */
/* -------------------------------------------------------------------------- */

interface Submission {
  name: string;
  email: string;
  message: string;
  locale: Locale;
}

function fail(reason: ContactFailure, status: number) {
  return NextResponse.json({ ok: false, reason }, { status });
}

function parse(body: unknown): Submission | null {
  if (typeof body !== "object" || body === null) {
    console.warn("[contact] rejected: body is not a JSON object");
    return null;
  }
  const raw = body as Record<string, unknown>;

  // Honeypot. A real reader never sees this field, so anything in it is a bot.
  // Answered with the same shape as a success so the bot learns nothing.
  //
  // The name is deliberately not `website`: password managers fill anything
  // that looks like a URL or address field, off-screen or not, and were
  // rejecting real submissions here. See the matching comment in `ContactForm`.
  if (typeof raw.reference_id === "string" && raw.reference_id.trim() !== "") {
    console.warn("[contact] rejected: honeypot filled");
    return null;
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  const locale = typeof raw.locale === "string" ? raw.locale : "";

  // Which constraint failed, for the server log only. The response stays a bare
  // "invalid" — a bot that is told exactly which check it tripped can iterate
  // against it. Lengths are logged rather than values, so a reader's name,
  // address and message never reach the log.
  const failures: string[] = [];
  if (name.length < LIMITS.name.min) failures.push("name: empty");
  if (name.length > LIMITS.name.max) failures.push(`name: ${name.length} > ${LIMITS.name.max}`);
  if (email.length < LIMITS.email.min || email.length > LIMITS.email.max)
    failures.push(`email: length ${email.length}`);
  else if (!EMAIL_PATTERN.test(email)) failures.push("email: failed pattern");
  if (message.length < LIMITS.message.min)
    failures.push(`message: ${message.length} < ${LIMITS.message.min}`);
  if (message.length > LIMITS.message.max)
    failures.push(`message: ${message.length} > ${LIMITS.message.max}`);
  if (!(SUPPORTED_LOCALES as readonly string[]).includes(locale))
    failures.push(`locale: ${JSON.stringify(locale)} not in ${SUPPORTED_LOCALES.join("|")}`);

  if (failures.length > 0) {
    console.warn(`[contact] rejected: ${failures.join("; ")}`);
    return null;
  }

  return { name, email, message, locale: locale as Locale };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    console.warn("[contact] rejected: request body was not valid JSON");
    return fail("invalid", 400);
  }

  const submission = parse(body);
  if (!submission) return fail("invalid", 400);

  if (rateLimited(clientKey(request))) return fail("rate-limited", 429);

  const emailed = await sendEmail(submission);
  const stored = await storeCopy(submission, emailed);

  if (!emailed && !stored) {
    // Nothing was delivered and nothing was saved. Distinguish "this machine
    // was never set up" from "a configured service failed", because the first
    // is a developer's problem and the second is worth retrying. Reporting a
    // success here would be the one unacceptable answer.
    return smtpConfigured() ? fail("error", 502) : fail("unconfigured", 503);
  }

  // Delivered, filed, or both. If SMTP failed but the copy is safe in Supabase
  // the reader is still told it arrived, because from their side it has.
  return NextResponse.json({ ok: true });
}

/* -------------------------------------------------------------------------- */
/*  Delivery                                                                  */
/* -------------------------------------------------------------------------- */

async function sendEmail({ name, email, message, locale }: Submission): Promise<boolean> {
  if (!smtpConfigured()) return false;

  // The brand name is translated, so it comes from the reader's own edition.
  const brand = getUi(locale).site.name;

  try {
    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user!, pass: smtp.password! },
    });

    await transport.sendMail({
      // The envelope sender must be an address the SMTP server is willing to
      // send as — never the reader's address, which would fail SPF and get the
      // whole message filed as spam. The reader is reachable via Reply-To.
      from: `${brand} <${smtp.from || smtp.user}>`,
      // Falls back to the authenticated mailbox, which is guaranteed to exist —
      // no address is hard-coded in the repository any more.
      to: smtp.to || smtp.user!,
      replyTo: `${name} <${email}>`,
      subject: `[${brand} · ${locale}] ${name}`,
      text: [
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Edition: ${locale}`,
        "",
        message,
      ].join("\n"),
    });

    return true;
  } catch (error) {
    // Never surfaced to the reader: an SMTP error string can leak the host and
    // the account it authenticated as.
    console.error("[contact] SMTP send failed", error);
    return false;
  }
}

async function storeCopy(
  { name, email, message, locale }: Submission,
  emailed: boolean,
): Promise<boolean> {
  if (!supabaseUrl || !supabaseKey) return false;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase
      .from("contact_messages")
      .insert({ name, email, message, locale, emailed });

    if (error) {
      console.error("[contact] Supabase insert failed", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[contact] Supabase insert threw", error);
    return false;
  }
}
