/**
 * Line icons used across the homepage — category medallions, timeline markers
 * and small inline glyphs. All are stroke-based on a 24×24 grid and inherit
 * `currentColor`, so a parent sets the size and colour.
 */

type IconProps = { className?: string };

function Svg({ children, className }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
    >
      {children}
    </svg>
  );
}

/* ---------- Category medallions ---------- */

/** Classical colonnade — the Armenian History section (Garni-inspired). */
export function ColumnsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 7h18L12 3 3 7Z" />
      <path d="M6 7v10M10 7v10M14 7v10M18 7v10" />
      <path d="M4 17h16M3 21h18" />
    </Svg>
  );
}

/** Quill — the Armenian Writers section. */
export function QuillIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 3c-6 0-11 3.5-13 9l-2 6 6-2c5.5-2 9-7 9-13Z" />
      <path d="M11 13c1.5-1.5 3-2.5 5-3.2" />
      <path d="M5 19l-2 2" />
    </Svg>
  );
}

/** Open book — the Literary Works section. */
export function BookIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 6.5C10.5 5 8.4 4.3 5 4.3c-.7 0-1 .3-1 1v12c0 .6.3.9 1 .9 3.4 0 5.5.7 7 2.1 1.5-1.4 3.6-2.1 7-2.1.7 0 1-.3 1-.9v-12c0-.7-.3-1-1-1-3.4 0-5.5.7-7 2.2Z" />
      <path d="M12 6.5v14" />
    </Svg>
  );
}

/* ---------- Timeline markers ---------- */

/** Fortress — Kingdom of Urartu. */
export function FortressIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 21V8l2 1.6L8 8l2 1.6L12 8l2 1.6L16 8l2 1.6L20 8v13Z" />
      <path d="M10 21v-5h4v5" />
      <path d="M4 13h16" />
    </Svg>
  );
}

/** Crown — the Artaxiad dynasty. */
export function CrownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 8l3.5 3L12 5l5.5 6L21 8l-2 10H5L3 8Z" />
      <path d="M5 21h14" />
    </Svg>
  );
}

/** Cross — the adoption of Christianity. */
export function CrossIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3v18" />
      <path d="M6 8h12" />
      <path d="M8 13h8" />
    </Svg>
  );
}

/** Sword — the Battle of Avarayr. */
export function SwordIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M18 3h3v3l-9.5 9.5-3-3L18 3Z" />
      <path d="M8.5 12.5 4 17l3 3 4.5-4.5" />
      <path d="M5.5 18.5 3 21" />
    </Svg>
  );
}

/** Domed church — Bagratid Armenia. */
export function ChurchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2v3" />
      <path d="M10.5 3.5h3" />
      <path d="M8 21v-9a4 4 0 0 1 8 0v9" />
      <path d="M5 21V13l3-2M19 21V13l-3-2" />
      <path d="M3 21h18" />
      <path d="M11 21v-4h2v4" />
    </Svg>
  );
}

/** Parliament building — the First Republic. */
export function BuildingIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 9 12 4l9 5" />
      <path d="M5 9v9M9 9v9M15 9v9M19 9v9" />
      <path d="M3 18h18M3 21h18" />
    </Svg>
  );
}

/* ---------- Inline glyphs ---------- */

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </Svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </Svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m9 5 7 7-7 7" />
    </Svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </Svg>
  );
}

/* ---------- Social ---------- */

const SOCIAL_PATHS: Record<string, string> = {
  facebook:
    "M13.9 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.7V13h2.8v8h3.4Z",
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.1 3.2-1.6 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.3-.2-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.9s0-3.5.1-4.8C2.3 4 3.8 2.4 7.1 2.3c1.3-.1 1.6-.1 4.9-.1Zm0 3.8a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8Zm6.2-9.4a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z",
  telegram:
    "M21.9 4.3 18.6 19.6c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.1 13.4l-4.8-1.5c-1.1-.3-1.1-1 .2-1.5l18.8-7.3c.9-.3 1.7.2 1.6 1.2Z",
  twitter:
    "M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1-5.7 6.1H1.6l7.5-8.6L1.2 3h6.6l4.5 5.6L17.5 3Zm-1.1 16.1h1.8L7.7 4.8H5.8l10.6 14.3Z",
};

export function SocialIcon({ name, className }: { name: string; className?: string }) {
  const path = SOCIAL_PATHS[name];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className ?? "h-4 w-4"}
    >
      <path d={path} />
    </svg>
  );
}
