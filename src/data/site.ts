/**
 * Placeholder identity, centralised.
 *
 * The project runs on localhost and has no registered domain yet, so the public
 * origin and the mailbox names are derived from these three constants. Changing
 * the domain later is a one-line edit here — nothing else in the app hard-codes
 * it. `example.org` is reserved for documentation (RFC 2606), so the placeholder
 * can never collide with a real address.
 *
 * Human-readable strings (name, tagline, description) live in each locale's UI
 * dictionary, not here — they are translated.
 */
const SITE_DOMAIN = "armedu.example.org";
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
