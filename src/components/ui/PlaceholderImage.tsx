import { cn } from "@/lib/cn";

type Variant = "motif" | "portrait" | "wide";

interface PlaceholderImageProps {
  /** Stable string (usually the article slug) — the same seed always renders the same artwork. */
  seed: string;
  /** Describes the image for screen readers, exactly as a real `alt` attribute would. */
  alt: string;
  className?: string;
  variant?: Variant;
  /** Optional caption drawn inside the artwork, e.g. a portrait's initials. */
  label?: string;
}

function hash(seed: string): number {
  let value = 0;
  for (let i = 0; i < seed.length; i += 1) {
    value = (value * 31 + seed.charCodeAt(i)) % 100000;
  }
  return value;
}

/** Warm, muted palette pairs used for the generated artwork. */
const PALETTES = [
  ["#f4ece1", "#e3cfae", "#7b2c37"],
  ["#f6eeea", "#e8cdc6", "#8a3b3b"],
  ["#f3efe6", "#dcd3bd", "#b5852f"],
  ["#efeae4", "#d8cabc", "#5f202a"],
  ["#f5f0e8", "#dfd2c0", "#8c6a35"],
];

/** Four geometric compositions loosely inspired by khachkar and manuscript ornament. */
function motif(index: number) {
  switch (index) {
    case 0:
      return (
        <>
          <circle cx="200" cy="150" r="86" />
          <circle cx="200" cy="150" r="58" strokeOpacity="0.35" />
          <path d="M200 64v172M114 150h172" strokeOpacity="0.3" />
          <rect x="170" y="120" width="60" height="60" transform="rotate(45 200 150)" />
        </>
      );
    case 1:
      return (
        <>
          <path d="M200 60c40 0 72 32 72 72v118H128V132c0-40 32-72 72-72Z" />
          <path d="M200 96c22 0 40 18 40 40v114h-80V136c0-22 18-40 40-40Z" strokeOpacity="0.3" />
          <path d="M128 190h144" strokeOpacity="0.25" />
        </>
      );
    case 2:
      return (
        <>
          <circle cx="200" cy="150" r="78" strokeOpacity="0.3" />
          {[0, 45, 90, 135].map((angle) => (
            <ellipse
              key={angle}
              cx="200"
              cy="150"
              rx="78"
              ry="30"
              transform={`rotate(${angle} 200 150)`}
              strokeOpacity="0.32"
            />
          ))}
        </>
      );
    default:
      return (
        <>
          <rect x="122" y="72" width="156" height="156" rx="10" />
          <rect x="150" y="100" width="100" height="100" rx="6" strokeOpacity="0.35" />
          <path d="M200 72v156M122 150h156" strokeOpacity="0.22" />
          <circle cx="200" cy="150" r="26" strokeOpacity="0.4" />
        </>
      );
  }
}

/**
 * Locally generated placeholder artwork. Real photography can replace this
 * component per article without changing any layout, since it fills its box.
 */
export function PlaceholderImage({
  seed,
  alt,
  className,
  variant = "motif",
  label,
}: PlaceholderImageProps) {
  const h = hash(seed);
  const [bg, mid, accent] = PALETTES[h % PALETTES.length];
  const rotation = h % 30;
  const id = `ph-${h}-${variant}`;
  const initials = label
    ? label
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
    : null;

  return (
    <svg
      role="img"
      aria-label={alt}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor={mid} />
        </linearGradient>
        <pattern
          id={`${id}-net`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${rotation})`}
        >
          <path
            d="M0 20 H40 M20 0 V40 M0 0 L40 40 M40 0 L0 40"
            stroke={accent}
            strokeOpacity="0.12"
            strokeWidth="1"
            fill="none"
          />
        </pattern>
      </defs>

      <rect width="400" height="300" fill={`url(#${id}-bg)`} />
      <rect width="400" height="300" fill={`url(#${id}-net)`} />

      {variant === "portrait" ? (
        <g>
          <circle cx="200" cy="150" r="74" fill={accent} fillOpacity="0.1" />
          <circle
            cx="200"
            cy="150"
            r="74"
            fill="none"
            stroke={accent}
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          {initials ? (
            <text
              x="200"
              y="170"
              textAnchor="middle"
              fontSize="52"
              fontFamily="Georgia, serif"
              fill={accent}
              fillOpacity="0.7"
            >
              {initials}
            </text>
          ) : (
            <path d="M148 300c0-38 23-64 52-64s52 26 52 64z" fill={accent} fillOpacity="0.16" />
          )}
        </g>
      ) : variant === "wide" ? (
        /* A band of smaller motifs, so that very wide crops stay balanced. */
        <g fill="none" stroke={accent} strokeOpacity="0.42" strokeWidth="3">
          {[60, 200, 340].map((x, index) => (
            <g key={x} transform={`translate(${x - 200 * 0.4} ${150 - 150 * 0.4}) scale(0.4)`}>
              {motif((h + index) % 4)}
            </g>
          ))}
        </g>
      ) : (
        <g
          fill="none"
          stroke={accent}
          strokeOpacity="0.5"
          strokeWidth="2"
          transform={`rotate(${rotation % 12} 200 150)`}
        >
          {motif(h % 4)}
        </g>
      )}
    </svg>
  );
}
