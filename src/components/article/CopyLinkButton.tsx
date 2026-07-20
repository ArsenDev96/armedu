"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type State = "idle" | "copied" | "failed";

export interface CopyLinkLabels {
  idle: string;
  copied: string;
  failed: string;
  copiedAnnouncement: string;
  failedAnnouncement: string;
}

/**
 * Copies the current page URL to the clipboard.
 *
 * `window.location.href` already carries the locale prefix, so the copied link
 * always points at the edition the reader is actually looking at.
 *
 * No sharing SDKs and no third-party script: one button, the Clipboard API, and
 * a `document.execCommand` fallback for browsers that refuse it over plain HTTP
 * — which includes localhost in some configurations.
 */
export function CopyLinkButton({
  labels,
  className,
}: {
  labels: CopyLinkLabels;
  className?: string;
}) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function flash(next: State) {
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2500);
  }

  async function copy() {
    const url = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        flash("copied");
        return;
      }
    } catch {
      // Permission denied or an insecure context — fall through to the fallback.
    }

    try {
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(field);
      flash(ok ? "copied" : "failed");
    } catch {
      flash("failed");
    }
  }

  const visible =
    state === "copied" ? labels.copied : state === "failed" ? labels.failed : labels.idle;

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
        state === "copied"
          ? "border-burgundy bg-burgundy-soft text-burgundy"
          : "border-line text-ink-2 hover:border-burgundy hover:text-burgundy",
        className,
      )}
    >
      <LinkIcon className="h-4 w-4" />
      <span>{visible}</span>
      {/* Announced separately so the visible label can stay short. */}
      <span aria-live="polite" className="sr-only">
        {state === "copied"
          ? labels.copiedAnnouncement
          : state === "failed"
            ? labels.failedAnnouncement
            : ""}
      </span>
    </button>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.32-1.32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
