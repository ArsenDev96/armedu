import type { TimelineEntry } from "@/data/types";
import {
  BuildingIcon,
  ChevronRightIcon,
  ChurchIcon,
  CrossIcon,
  CrownIcon,
  FortressIcon,
  SwordIcon,
} from "@/components/ui/icons";

/** Marker icon per timeline entry, keyed by id so the content data stays presentation-free. */
const MARKERS: Record<string, typeof FortressIcon> = {
  urartu: FortressIcon,
  artaxiad: CrownIcon,
  christianity: CrossIcon,
  avarayr: SwordIcon,
  bagratid: ChurchIcon,
  "first-republic": BuildingIcon,
};

/**
 * Informational timeline. `detailed` (the default) renders period, title and
 * description; `rail` is the homepage form — a horizontal run of icon
 * medallions with just a title and period, scrollable when it overflows.
 */
export function Timeline({
  entries,
  variant = "detailed",
}: {
  entries: TimelineEntry[];
  variant?: "detailed" | "rail";
}) {
  if (variant === "rail") return <TimelineRail entries={entries} />;

  return (
    <div>
      {/* Vertical — mobile and tablet */}
      <ol className="relative space-y-8 border-l-2 border-line pl-6 lg:hidden">
        {entries.map((entry) => (
          <li key={entry.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[31px] h-3.5 w-3.5 rounded-full border-2 border-burgundy bg-paper"
            />
            <p className="text-xs font-semibold tracking-wide text-burgundy uppercase">
              {entry.period}
            </p>
            <h3 className="mt-1 text-lg text-ink">{entry.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-3">{entry.description}</p>
          </li>
        ))}
      </ol>

      {/* Horizontal rows — desktop */}
      <ol className="hidden lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
        {entries.map((entry) => (
          <li key={entry.id} className="relative pt-8">
            <span aria-hidden="true" className="absolute top-[15px] right-0 left-0 h-0.5 bg-line" />
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 block h-8 w-8 rounded-full border-2 border-burgundy bg-paper p-[5px]"
            >
              <span className="block h-full w-full rounded-full bg-burgundy" />
            </span>
            <p className="mt-4 text-xs font-semibold tracking-wide text-burgundy uppercase">
              {entry.period}
            </p>
            <h3 className="mt-1.5 text-lg leading-snug text-ink">{entry.title}</h3>
            <p className="mt-2 pr-6 text-sm leading-relaxed text-ink-3">{entry.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TimelineRail({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative">
      {/* No column gap on the rail: the per-item line segments must touch, or
          the connecting line reads as six broken dashes. */}
      <ol className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-0 lg:overflow-visible lg:px-0">
        {entries.map((entry, index) => {
          const Icon = MARKERS[entry.id] ?? FortressIcon;
          return (
            <li
              key={entry.id}
              className="relative w-[8.5rem] shrink-0 snap-start text-center lg:w-auto lg:px-2"
            >
              {/* Connecting rail — trimmed at the first and last medallion. */}
              <span
                aria-hidden="true"
                className={`absolute top-6 h-px bg-line-strong ${
                  index === 0 ? "right-0 left-1/2" : ""
                } ${index === entries.length - 1 ? "right-1/2 left-0" : ""} ${
                  index !== 0 && index !== entries.length - 1 ? "right-0 left-0" : ""
                }`}
              />
              <span
                aria-hidden="true"
                className="relative mx-auto grid h-12 w-12 place-items-center rounded-full border border-burgundy/35 bg-surface text-burgundy shadow-[0_1px_2px_rgba(27,24,21,0.05)]"
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm leading-snug font-semibold text-ink">{entry.title}</h3>
              <p className="mt-1.5 text-xs text-ink-3">{entry.period}</p>
            </li>
          );
        })}
      </ol>

      {/* Scroll affordance, mirroring the chevron in the design. */}
      <span
        aria-hidden="true"
        className="absolute top-6 -right-1 hidden -translate-y-1/2 text-ink-3 md:block lg:hidden"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </span>
    </div>
  );
}
