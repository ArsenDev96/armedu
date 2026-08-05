import Link from "next/link";
import { getAvailableSocialLinks } from "@/data/site";
import type { Locale } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Logo } from "@/components/layout/Logo";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { SocialIcon } from "@/components/ui/icons";
import type { FooterGroup } from "@/lib/navigation";

/**
 * Footer.
 *
 * Three bands: the masthead and the signup, the link columns, then the small
 * print. It used to be one six-column row — brand, four link groups and a
 * language column — which left each column about 160px inside the 1280px
 * container. Armenian does not fit in 160px: «Նոր ժամանակների Հայաստան» broke
 * across three lines, and so did half its neighbours. Four columns across the
 * full width give each one ~280px, and the language links moved to the bottom
 * bar, where they read as small print rather than as a fifth section.
 */
export function Footer({
  locale,
  groups,
  ui,
}: {
  locale: Locale;
  groups: FooterGroup[];
  ui: UiDictionary;
}) {
  // Evaluated when the page is built, not written down: a literal year is right
  // until the first of January and then quietly wrong on all thirteen routes.
  const year = new Date().getFullYear();
  const socials = getAvailableSocialLinks();

  return (
    <footer className="bg-[#3a1a1e] text-white/65">
      <div className="container-page py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-sm">
            <Logo ui={ui} tone="light" placement="footer" />
            <p className="mt-5 text-sm leading-relaxed">{ui.footer.description}</p>
            {socials.length > 0 ? (
              <div className="mt-6 flex gap-2" aria-label={ui.footer.socialLabel}>
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                  >
                    <SocialIcon name={social.icon} className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/*
            The signup was on four pages and not on the one block that renders on
            all thirteen — so the reader most likely to want it, the one who has
            just finished an article, was never offered it.
          */}
          <div className="w-full lg:max-w-md lg:justify-self-end">
            <h2 className="font-serif text-xl font-semibold text-white">
              {ui.footer.newsletterTitle}
            </h2>
            <div className="mt-4">
              <NewsletterForm
                locale={locale}
                ui={ui}
                compact
                variant="inline"
                tone="light"
                source="footer"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-white uppercase">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            {ui.footer.copyright
              .replace("{year}", String(year))
              .replace("{name}", ui.site.name)}
          </p>
          {/* Every edition exists, so every entry is a real link. */}
          <nav aria-label={ui.footer.languageTitle}>
            <LanguageSwitcher locale={locale} ui={ui} layout="bar" />
          </nav>
        </div>
      </div>
    </footer>
  );
}
