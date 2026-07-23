"use client";

import { useId, useRef, useState } from "react";
import type { Locale } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { cn } from "@/lib/cn";

/**
 * The contact form.
 *
 * Unlike `NewsletterForm`, this does not talk to Supabase from the browser: the
 * message is POSTed to `/api/contact`, which owns the SMTP credentials and
 * writes the Supabase copy server-side. The browser never sees either secret.
 */

type Field = "name" | "email" | "message";

type Status =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "rate-limited"
  | "unconfigured";

/** Same rule as the server; the server is what actually decides. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_MESSAGE = 10;

export function ContactForm({
  locale,
  ui,
  /** Rendered by the caller when false, so the form itself stays quiet. */
  configured = true,
}: {
  locale: Locale;
  ui: UiDictionary;
  configured?: boolean;
}) {
  const copy = ui.contactForm;

  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");

  const baseId = useId();
  const statusId = `${baseId}-status`;
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  const submitting = status === "submitting";

  function validate(): Partial<Record<Field, string>> {
    const found: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) found.name = copy.invalidName;
    if (!EMAIL_PATTERN.test(values.email.trim())) found.email = copy.invalidEmail;
    if (values.message.trim().length < MIN_MESSAGE) found.message = copy.invalidMessage;
    return found;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return; // Guard against double submits.

    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setStatus("idle");
      // Focus the first field that failed, in visual order.
      const order: Field[] = ["name", "email", "message"];
      refs[order.find((field) => found[field])!].current?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          // The edition the reader wrote from, so an editor knows which
          // language to reply in.
          locale,
          website: honeypot,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; reason?: string }
        | null;

      if (response.ok && payload?.ok) {
        setStatus("success");
        setValues({ name: "", email: "", message: "" });
        return;
      }

      if (payload?.reason === "rate-limited") setStatus("rate-limited");
      else if (payload?.reason === "unconfigured") setStatus("unconfigured");
      else setStatus("error");
    } catch {
      // Offline, DNS failure, the dev server restarting mid-request.
      setStatus("error");
    }
  }

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== "idle" && status !== "submitting") setStatus("idle");
  }

  const statusMessage: Record<Status, string> = {
    idle: "",
    submitting: copy.submitting,
    success: copy.success,
    error: copy.error,
    "rate-limited": copy.rateLimited,
    unconfigured: copy.unconfigured,
  };

  const message = statusMessage[status];
  const isProblem =
    status === "error" || status === "rate-limited" || status === "unconfigured";

  const fieldClass = (field: Field) =>
    cn(
      "w-full min-w-0 rounded-lg border bg-surface px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-3 focus:border-burgundy disabled:opacity-60",
      errors[field] ? "border-burgundy" : "border-line",
    );

  return (
    <form noValidate onSubmit={handleSubmit} className="mx-auto max-w-xl">
      {/*
        Honeypot: hidden from readers and from assistive technology, but a bot
        filling every input it finds will complete it. `sr-only` alone would
        still be announced, so it is removed from the tree entirely.
      */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${baseId}-website`}>Website</label>
        <input
          id={`${baseId}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldShell
          id={`${baseId}-name`}
          label={copy.nameLabel}
          required={copy.requiredMark}
          error={errors.name}
        >
          <input
            ref={refs.name}
            id={`${baseId}-name`}
            type="text"
            name="name"
            autoComplete="name"
            required
            value={values.name}
            disabled={submitting}
            placeholder={copy.namePlaceholder}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${baseId}-name-error` : undefined}
            onChange={(event) => update("name", event.target.value)}
            className={fieldClass("name")}
          />
        </FieldShell>

        <FieldShell
          id={`${baseId}-email`}
          label={copy.emailLabel}
          required={copy.requiredMark}
          error={errors.email}
        >
          <input
            ref={refs.email}
            id={`${baseId}-email`}
            type="email"
            name="email"
            autoComplete="email"
            required
            value={values.email}
            disabled={submitting}
            placeholder={copy.emailPlaceholder}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${baseId}-email-error` : undefined}
            onChange={(event) => update("email", event.target.value)}
            className={fieldClass("email")}
          />
        </FieldShell>
      </div>

      <div className="mt-5">
        <FieldShell
          id={`${baseId}-message`}
          label={copy.messageLabel}
          required={copy.requiredMark}
          error={errors.message}
        >
          <textarea
            ref={refs.message}
            id={`${baseId}-message`}
            name="message"
            rows={6}
            required
            value={values.message}
            disabled={submitting}
            placeholder={copy.messagePlaceholder}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${baseId}-message-error` : undefined}
            onChange={(event) => update("message", event.target.value)}
            className={cn(fieldClass("message"), "min-h-[9rem] resize-y leading-relaxed")}
          />
        </FieldShell>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="order-2 text-xs leading-relaxed text-ink-3 sm:order-1 sm:max-w-xs">
          {copy.privacyNote}
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="order-1 shrink-0 rounded-full bg-burgundy px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-60 sm:order-2"
        >
          {submitting ? copy.submitting : copy.submit}
        </button>
      </div>

      <p
        id={statusId}
        aria-live="polite"
        className={cn(
          "mt-4 text-sm",
          status === "success" || isProblem ? "text-burgundy" : "text-ink-3",
        )}
      >
        {message}
      </p>

      {!configured && status === "idle" ? (
        <p className="mt-1.5 text-xs text-ink-3/80">{copy.devNote}</p>
      ) : null}
    </form>
  );
}

/** Label, control and error message, so the three fields stay identical. */
function FieldShell({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/*
        The asterisk is decoration only. Giving it an `aria-label` would splice
        the word into the field's accessible name with no separator ("your email
        addressrequired"); `aria-required` on the control is what actually tells
        assistive technology the field is mandatory.
      */}
      <label htmlFor={id} className="block text-sm font-medium text-ink-2">
        {label}
        <span className="ml-1 text-ink-3/70" aria-hidden="true" title={required}>
          *
        </span>
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-burgundy">
          {error}
        </p>
      ) : null}
    </div>
  );
}
