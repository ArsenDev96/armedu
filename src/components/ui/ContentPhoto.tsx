import Image from "next/image";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { cn } from "@/lib/cn";

/**
 * One image slot. Renders the shipped artwork when the slug has any, and falls
 * back to the generated `PlaceholderImage` when it does not — so a content entry
 * added before its artwork still renders a complete card.
 *
 * Both branches fill their container exactly, which is what lets every existing
 * layout (`aspect-[4/3]`, `aspect-[21/9]`, the writer card's side column) stay
 * untouched. The `fill` image needs a positioned ancestor, so the component
 * supplies its own rather than requiring every call site to add `relative`.
 */
export function ContentPhoto({
  src,
  alt,
  seed,
  sizes,
  variant = "motif",
  label,
  className,
  /** Object-position class; the portrait crops need the focus off-centre. */
  focus,
  priority,
}: {
  src: string | undefined;
  alt: string;
  /** Used only by the fallback artwork. */
  seed: string;
  sizes: string;
  variant?: "motif" | "portrait" | "wide";
  label?: string;
  className?: string;
  focus?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <PlaceholderImage
        seed={seed}
        alt={alt}
        variant={variant}
        label={variant === "portrait" ? label : undefined}
        className={className}
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", focus ?? "object-center", className)}
      />
    </div>
  );
}
