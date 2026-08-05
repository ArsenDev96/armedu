import Image from "next/image";
import type { UiDictionary } from "@/data/ui";

/**
 * Logo: the Armat brand mark — a gold rooted tree rising from an open book — set
 * beside the platform name and tagline. The same emblem is the favicon and the
 * iOS icon, so the three read as one identity.
 *
 * The mark ships a burgundy background baked in. That reads well on the light
 * header; on the burgundy footer (`tone="light"`) the badge would otherwise melt
 * into the bar, so there it gains a hairline ring to hold its edge. The image is
 * decorative — the adjacent name is the accessible label — so its `alt` is empty.
 */
export function Logo({
  ui,
  tone = "dark",
  placement = "header",
  priority = false,
}: {
  ui: UiDictionary;
  tone?: "dark" | "light";
  /**
   * Both placements hide the tagline on phones. The header hides it again
   * between `lg` and `xl`, because that band is where the horizontal nav is
   * tightest and the Armenian tagline is ~155px wide — the difference between
   * a nav bar and a hamburger on every laptop in it. The footer has a column
   * to itself and keeps it.
   */
  placement?: "header" | "footer";
  /** Eager-load above the fold (header); the footer instance leaves it lazy. */
  priority?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/brand/armat-mark.png"
        alt=""
        width={40}
        height={40}
        priority={priority}
        className={`h-9 w-9 shrink-0 rounded-xl md:h-10 md:w-10 ${
          tone === "light" ? "ring-1 ring-white/20" : ""
        }`}
      />
      <span className="leading-tight">
        <span
          className={`block font-serif text-lg font-semibold ${
            tone === "light" ? "text-white" : "text-burgundy"
          }`}
        >
          {ui.site.name}
        </span>
        <span
          className={`hidden text-[11px] tracking-wide sm:block ${
            placement === "header" ? "lg:hidden xl:block" : ""
          } ${tone === "light" ? "text-white/60" : "text-ink-3"}`}
        >
          {ui.site.tagline}
        </span>
      </span>
    </span>
  );
}
