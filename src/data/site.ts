/**
 * Site identity, centralised.
 *
 * The public origin is derived from this one constant — nothing else in the app
 * hard-codes the domain, so every canonical URL, Open Graph tag, hreflang,
 * sitemap entry and JSON-LD `@id` follows from it.
 *
 * There is deliberately **no contact address here**. The project publishes no
 * mailbox anywhere — not on the contact page, not in structured data — and
 * readers reach the editors through the contact form, which posts to
 * `/api/contact`. Where messages are delivered is a deployment detail, set by
 * `CONTACT_TO_EMAIL` on the server and never shipped to the browser.
 *
 * Human-readable strings (name, tagline, description) live in each locale's UI
 * dictionary, not here — they are translated.
 */
const SITE_DOMAIN = "armat.site";
const SITE_ORIGIN = `https://${SITE_DOMAIN}`;

export const site = {
  domain: SITE_DOMAIN,
  url: SITE_ORIGIN,
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
