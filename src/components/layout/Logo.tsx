import { site } from "@/data/site";

/**
 * Logo: an interlaced knot inspired by Armenian manuscript ornament, paired
 * with the platform name and tagline.
 */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9 shrink-0 text-gold md:h-10 md:w-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 4 30 12v16L20 36 10 28V12L20 4Z" />
        <path d="M20 11 26 15v10l-6 4-6-4V15l6-4Z" />
        <path d="M20 4v7M20 29v7M10 12l4 3M26 25l4 3M30 12l-4 3M14 25l-4 3" />
      </svg>
      <span className="leading-tight">
        <span
          className={`block font-serif text-lg font-semibold ${
            tone === "light" ? "text-white" : "text-burgundy"
          }`}
        >
          {site.name}
        </span>
        <span
          className={`hidden text-[11px] tracking-wide sm:block ${
            tone === "light" ? "text-white/60" : "text-ink-3"
          }`}
        >
          {site.tagline}
        </span>
      </span>
    </span>
  );
}
