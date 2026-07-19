"use client";

import { useState } from "react";
import { MailIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Visual-only subscription form for the MVP: it validates the field and shows a
 * confirmation, but nothing is sent anywhere yet.
 */
export function NewsletterForm({
  compact = false,
  variant = "default",
}: {
  compact?: boolean;
  /** `inline` is the homepage form: mail glyph inside a squared-off field. */
  variant?: "default" | "inline";
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inline = variant === "inline";

  return (
    <div className={cn(compact ? "" : "mx-auto max-w-xl text-center", inline && "max-w-lg")}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (email.trim()) setSubmitted(true);
        }}
        className={cn("flex flex-col gap-3 sm:flex-row", inline && "sm:gap-2")}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>

        {inline ? (
          <div className="flex w-full items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-3 transition focus-within:border-burgundy">
            <span className="text-ink-3" aria-hidden="true">
              <MailIcon className="h-4 w-4" />
            </span>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
            />
          </div>
        ) : (
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-full border border-line bg-surface px-5 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink-3 focus:border-burgundy"
          />
        )}

        <button
          type="submit"
          className={cn(
            "shrink-0 bg-burgundy font-semibold text-white transition hover:bg-burgundy-dark",
            inline ? "rounded-lg px-7 py-3 text-sm" : "rounded-full px-7 py-3.5 text-sm",
          )}
        >
          Subscribe
        </button>
      </form>

      <p
        aria-live="polite"
        className={cn("mt-3 text-ink-3", inline ? "text-center text-xs" : "text-sm")}
      >
        {submitted
          ? "Thank you — your address has been noted. Newsletter delivery starts soon."
          : inline
            ? "No spam. Unsubscribe anytime."
            : "One short email per month. No spam, and you can unsubscribe at any time."}
      </p>
    </div>
  );
}
