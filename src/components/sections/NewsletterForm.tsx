"use client";

import { useId, useRef, useState } from "react";
import type { Locale } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { MailIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import {
  getSupabaseClient,
  isSupabaseConfigured,
  NEWSLETTER_TABLE,
} from "@/lib/supabase/client";

/** Where a subscription originated, stored alongside the address. */
export type NewsletterSource =
  | "homepage"
  | "footer"
  | "contact-page"
  | "article-page"
  | "writers-page";

type Status =
  | "idle"
  | "invalid"
  | "submitting"
  | "success"
  | "duplicate"
  | "error"
  | "unconfigured";

/**
 * Deliberately simple: one `@`, something on each side of it, no whitespace.
 * The address is confirmed by the first newsletter that reaches it, not here.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Postgres unique-violation — the address is already on the list. */
const UNIQUE_VIOLATION = "23505";

export function NewsletterForm({
  locale,
  ui,
  compact = false,
  variant = "default",
  source = "homepage",
}: {
  /** The edition the reader subscribed from; stored in the `locale` column. */
  locale: Locale;
  ui: UiDictionary;
  compact?: boolean;
  /** `inline` is the homepage form: mail glyph inside a squared-off field. */
  variant?: "default" | "inline";
  /** Recorded in the `source` column so signups can be attributed to a page. */
  source?: NewsletterSource;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldId = useId();
  const messageId = `${fieldId}-message`;

  const inline = variant === "inline";
  const submitting = status === "submitting";
  const settled = status === "success" || status === "duplicate";

  const messages: Record<Status, string> = {
    idle: "",
    invalid: ui.newsletter.invalid,
    submitting: ui.newsletter.submitting,
    success: ui.newsletter.success,
    duplicate: ui.newsletter.duplicate,
    error: ui.newsletter.error,
    unconfigured: ui.newsletter.unconfigured,
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return; // Guard against double submits.

    const normalized = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalized)) {
      setStatus("invalid");
      inputRef.current?.focus();
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      // No credentials on this machine. Say so plainly rather than reporting a
      // success that never happened.
      setStatus("unconfigured");
      return;
    }

    setStatus("submitting");

    const { error } = await supabase
      .from(NEWSLETTER_TABLE)
      // `locale` is the edition the reader is actually in — never a hard-coded
      // default — so the list can be segmented by language later.
      .insert({ email: normalized, source, locale });

    if (!error) {
      setStatus("success");
      setEmail("");
      return;
    }

    if (error.code === UNIQUE_VIOLATION) {
      setStatus("duplicate");
      setEmail("");
      return;
    }

    // Raw Supabase errors are useful while developing and meaningless (or
    // leaky) to a reader, so they stay in the console.
    if (process.env.NODE_ENV === "development") {
      console.error("[newsletter] insert failed", error);
    }
    setStatus("error");
  }

  const message = messages[status];
  const isProblem = status === "invalid" || status === "error" || status === "unconfigured";

  const fieldProps = {
    ref: inputRef,
    id: fieldId,
    type: "email" as const,
    value: email,
    disabled: submitting,
    "aria-invalid": isProblem || undefined,
    "aria-describedby": message ? messageId : undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
      if (status !== "idle") setStatus("idle");
    },
  };

  return (
    <div className={cn(compact ? "" : "mx-auto max-w-xl text-center", inline && "max-w-lg")}>
      <form
        noValidate
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-3 sm:flex-row", inline && "sm:gap-2")}
      >
        <label htmlFor={fieldId} className="sr-only">
          {ui.newsletter.emailLabel}
        </label>

        {inline ? (
          <div
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg border bg-surface px-3.5 py-3 transition focus-within:border-burgundy",
              isProblem ? "border-burgundy" : "border-line",
            )}
          >
            <span className="text-ink-3" aria-hidden="true">
              <MailIcon className="h-4 w-4" />
            </span>
            <input
              {...fieldProps}
              placeholder={ui.newsletter.placeholderInline}
              className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3 disabled:opacity-60"
            />
          </div>
        ) : (
          <input
            {...fieldProps}
            placeholder={ui.newsletter.placeholder}
            className={cn(
              "w-full min-w-0 rounded-full border bg-surface px-5 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink-3 focus:border-burgundy disabled:opacity-60",
              isProblem ? "border-burgundy" : "border-line",
            )}
          />
        )}

        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "shrink-0 bg-burgundy font-semibold text-white transition hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-60",
            inline ? "rounded-lg px-7 py-3 text-sm" : "rounded-full px-7 py-3.5 text-sm",
          )}
        >
          {submitting ? ui.newsletter.submitting : ui.newsletter.button}
        </button>
      </form>

      <p
        id={messageId}
        aria-live="polite"
        className={cn(
          "mt-3",
          inline ? "text-center text-xs" : "text-sm",
          settled || isProblem ? "text-burgundy" : "text-ink-3",
        )}
      >
        {message || (inline ? ui.newsletter.noteInline : ui.newsletter.noteDefault)}
      </p>

      {!isSupabaseConfigured() && status === "idle" ? (
        <p
          className={cn("mt-1.5 text-ink-3/80", inline ? "text-center text-[0.6875rem]" : "text-xs")}
        >
          {ui.newsletter.devNote}
        </p>
      ) : null}
    </div>
  );
}
