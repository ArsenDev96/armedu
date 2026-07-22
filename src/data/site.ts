/**
 * Site identity, centralised.
 *
 * The public origin and the mailbox names are derived from these three
 * constants — nothing else in the app hard-codes the domain, so every canonical
 * URL, Open Graph tag, hreflang, sitemap entry and JSON-LD `@id` follows from
 * this one line.
 *
 * Human-readable strings (name, tagline, description) live in each locale's UI
 * dictionary, not here — they are translated.
 */
const SITE_DOMAIN = "armat.site";
const CONTACT_MAILBOX = "hello";
const SITE_ORIGIN = `https://${SITE_DOMAIN}`;

export const site = {
  domain: SITE_DOMAIN,
  url: SITE_ORIGIN,
  contactEmail: `${CONTACT_MAILBOX}@${SITE_DOMAIN}`,
};

export interface SocialLink {
  label: string;
  icon: string;
  /**
   * Absolute profile URL. Entries without one are not rendered at all — an icon
   * that goes nowhere is worse than no icon.
   */
  href?: string;
}

/**
 * Social profiles. None exist yet, so this list is intentionally empty and every
 * social block in the UI hides itself. Add an entry with a real `href` and the
 * footer and contact page pick it up automatically.
 */
export const socialLinks: SocialLink[] = [];

/** Only the profiles that actually resolve somewhere. */
export function getAvailableSocialLinks(): (SocialLink & { href: string })[] {
  return socialLinks.filter(
    (link): link is SocialLink & { href: string } => Boolean(link.href && link.href !== "#"),
  );
}
