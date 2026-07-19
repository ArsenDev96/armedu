import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Pill({
  children,
  tone = "burgundy",
  className,
}: {
  children: ReactNode;
  tone?: "burgundy" | "gold" | "neutral";
  className?: string;
}) {
  const tones = {
    burgundy: "bg-burgundy-soft text-burgundy",
    gold: "bg-gold-soft text-[#8c6a35]",
    neutral: "bg-paper-2 text-ink-3",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  interactive = false,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "div" | "article" | "li";
}) {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]",
        interactive &&
          "transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      {children}
    </Component>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "light" | "outline-gold";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className }: ButtonProps) {
  const variants = {
    primary:
      "bg-burgundy text-white hover:bg-burgundy-dark shadow-[0_10px_24px_-14px_rgba(123,44,55,0.9)]",
    secondary: "bg-surface text-ink border border-line-strong hover:border-burgundy hover:text-burgundy",
    ghost: "text-burgundy hover:bg-burgundy-soft",
    light: "bg-white text-ink hover:bg-white/90",
    "outline-gold":
      "border border-gold/60 bg-surface/70 text-burgundy hover:border-gold hover:bg-gold-soft",
  } as const;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap transition",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy transition hover:text-burgundy-dark",
        className,
      )}
    >
      {children}
      <span aria-hidden="true" className="transition-transform group-hover/link:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  headingLevel: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  headingLevel?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 md:mb-10",
        align === "left" ? "md:flex-row md:items-end md:justify-between" : "items-center text-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-burgundy uppercase">
            {eyebrow}
          </p>
        ) : null}
        <Heading className="text-2xl leading-tight text-ink sm:text-3xl md:text-[2.1rem]">
          {title}
        </Heading>
        {description ? (
          <p className="mt-3 text-base leading-relaxed text-ink-3">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * Tight heading row used on the homepage: a serif title on the left and an
 * optional "view all" link on the right, with no eyebrow or description.
 */
export function RowHeading({
  title,
  action,
  className,
  headingLevel: Heading = "h2",
}: {
  title: string;
  action?: ReactNode;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div className={cn("mb-6 flex items-baseline justify-between gap-6", className)}>
      <Heading className="text-xl leading-tight text-ink sm:text-2xl">{title}</Heading>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
  tone = "paper",
  padding = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "paper" | "surface" | "tinted";
  /** `tight` is the homepage rhythm — sections sit close together there. */
  padding?: "default" | "tight";
}) {
  const tones = {
    paper: "",
    surface: "bg-surface",
    tinted: "bg-paper-2",
  } as const;

  const paddings = {
    default: "py-14 md:py-20",
    tight: "py-5 md:py-7",
  } as const;

  return (
    <section id={id} className={cn(paddings[padding], tones[tone], className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}
