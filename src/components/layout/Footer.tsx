import Link from "next/link";
import { getAvailableSocialLinks } from "@/data/site";
import { LOCALES, type Locale } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { Logo } from "@/components/layout/Logo";
import { SocialIcon } from "@/components/ui/icons";
import type { FooterGroup } from "@/lib/navigation";

export function Footer({
  locale,
  groups,
  ui,
}: {
  locale: Locale;
  groups: FooterGroup[];
  ui: UiDictionary;
}) {
  const year = 2026;
  const socials = getAvailableSocialLinks();

  return (
    <footer className="bg-[#3a1a1e] text-white/65">
      <div className="container-page py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_repeat(5,minmax(0,1fr))] lg:gap-8">
          <div className="max-w-xs">
            <Logo ui={ui} tone="light" />
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

          <div>
            <h2 className="font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-white uppercase">
              {ui.footer.languageTitle}
            </h2>
            {/* Every edition exists, so every entry is a real link. */}
            <ul className="mt-4 space-y-2.5">
              {LOCALES.map((entry) => (
                <li key={entry.code} className="text-sm">
                  {entry.code === locale ? (
                    <span aria-current="true" className="text-white">
                      {entry.label}
                    </span>
                  ) : (
                    <Link
                      href={`/${entry.code}`}
                      hrefLang={entry.htmlLang}
                      lang={entry.htmlLang}
                      className="transition hover:text-white"
                    >
                      {entry.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            {ui.footer.copyright
              .replace("{year}", String(year))
              .replace("{name}", ui.site.name)}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={`/${locale}/privacy`} className="transition hover:text-white">
              {ui.nav.privacy}
            </Link>
            <Link href={`/${locale}/contact`} className="transition hover:text-white">
              {ui.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
