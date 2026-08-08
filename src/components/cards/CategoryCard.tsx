import Image from "next/image";
import Link from "next/link";
import type { Category, CategoryId } from "@/data/types";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { BookIcon, ColumnsIcon, FortressIcon, QuillIcon, WheatIcon } from "@/components/ui/icons";
import { ArrowLink, Card } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

/**
 * Medallion icon and colour per section, so the data model stays
 * presentation-free.
 *
 * `wash` is the same colour at low opacity, and it is what a section shows in
 * place of photography while it has none. The generated `PlaceholderImage` was
 * the obvious fallback and the wrong one here: at the 35% opacity the banner
 * fades its photograph to, it renders as an almost-white smear beside three
 * photographed cards, and reads as an image that failed to load rather than as
 * a card that is not claiming to have one.
 */
const MEDALLIONS: Record<
  CategoryId,
  { Icon: typeof ColumnsIcon; className: string; wash: string }
> = {
  history: { Icon: ColumnsIcon, className: "bg-burgundy text-white", wash: "from-burgundy/12" },
  writers: { Icon: QuillIcon, className: "bg-gold text-white", wash: "from-gold/15" },
  works: { Icon: BookIcon, className: "bg-[#1f3450] text-white", wash: "from-[#1f3450]/12" },
  cuisine: { Icon: WheatIcon, className: "bg-[#5d6b34] text-white", wash: "from-[#5d6b34]/15" },
  places: { Icon: FortressIcon, className: "bg-[#2f5d5b] text-white", wash: "from-[#2f5d5b]/14" },
};

export function CategoryCard({
  category,
  href,
  variant = "default",
}: {
  category: Category;
  /** Locale-prefixed destination; the category itself stores a locale-free path. */
  href: string;
  /** `banner` is the homepage form: icon medallion, copy, photography behind. */
  variant?: "default" | "banner";
}) {
  const { Icon, className: medallion, wash } = MEDALLIONS[category.id];

  if (variant === "banner") {
    return (
      <Card as="article" interactive className="group relative h-full overflow-hidden">
        {/* Photography is weighted to the right and faded out towards the copy,
            so the text keeps its contrast against the card. A section with no
            photograph yet carries a wash in its own colour instead — see the
            note on MEDALLIONS. */}
        {category.image ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-[52%] opacity-35 photo-fade-left-soft"
          >
            <Image
              src={category.image}
              alt=""
              fill
              sizes="(min-width: 768px) 18vw, 50vw"
              className="object-cover"
            />
            {/* Lifts the photograph towards the card's own white, so the copy
                keeps its contrast where the two overlap. */}
            <span className="absolute inset-0 bg-gradient-to-r from-surface via-surface/45 to-transparent" />
          </div>
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 w-[52%] bg-gradient-to-l to-transparent",
              wash,
            )}
          />
        )}

        <div className="relative flex h-full flex-col p-6">
          <span
            aria-hidden="true"
            className={`mb-5 grid h-12 w-12 shrink-0 place-items-center rounded-full ${medallion}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="text-lg text-ink">
            <Link href={href} className="transition hover:text-burgundy">
              <span className="absolute inset-0" />
              {category.title}
            </Link>
          </h3>
          <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-2">{category.description}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy">
            {category.linkLabel}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card as="article" interactive className="group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
        {category.image ? (
          <Image
            src={category.image}
            alt={`Photograph representing the ${category.title} section`}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <PlaceholderImage
            seed={category.imageSeed}
            alt={`Illustration representing the ${category.title} section`}
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="text-xl text-ink">
          <Link href={href} className="transition hover:text-burgundy">
            {category.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-3">{category.description}</p>
        <ArrowLink href={href} className="mt-6">
          {category.linkLabel}
        </ArrowLink>
      </div>
    </Card>
  );
}
