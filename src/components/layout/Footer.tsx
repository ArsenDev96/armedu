import Link from "next/link";
import { footerLanguages, footerNav, site, socialLinks } from "@/data/site";
import { Logo } from "@/components/layout/Logo";
import { SocialIcon } from "@/components/ui/icons";

export function Footer() {
  const year = 2026;

  return (
    <footer className="bg-[#3a1a1e] text-white/65">
      <div className="container-page py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_repeat(5,minmax(0,1fr))] lg:gap-8">
          <div className="max-w-xs">
            <Logo tone="light" />
            <p className="mt-5 text-sm leading-relaxed">
              A platform dedicated to preserving and sharing Armenian history, literature, and
              culture with the world.
            </p>
            <div className="mt-6 flex gap-2" aria-label="Social media">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                >
                  <SocialIcon name={social.icon} className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((group) => (
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
              Language
            </h2>
            <ul className="mt-4 space-y-2.5">
              {footerLanguages.map((language) => (
                <li key={language.label} className="text-sm">
                  {language.available ? (
                    <span aria-current="true" className="text-white">
                      {language.label}
                    </span>
                  ) : (
                    <span className="text-white/40" title="Edition in preparation">
                      {language.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
