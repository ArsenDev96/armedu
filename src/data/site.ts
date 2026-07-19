export const site = {
  name: "ArmEdu",
  tagline: "Armenian history, literature and culture",
  description:
    "Clear and accessible articles about Armenian historical events, famous writers, important literary works, and cultural heritage.",
  url: "https://armedu.example.org",
  locale: "en_US",
  contactEmail: "hello@armedu.example.org",
};

export interface NavItem {
  href: string;
  label: string;
  /** Rendered as a dropdown under the header item. Every entry is a real page. */
  children?: { href: string; label: string }[];
}

export const mainNav: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/history",
    label: "Armenian History",
    children: [
      { href: "/history/kingdom-of-urartu", label: "Kingdom of Urartu" },
      { href: "/history/tigran-the-great", label: "Tigran the Great" },
      { href: "/history/adoption-of-christianity", label: "Adoption of Christianity" },
      { href: "/history/battle-of-avarayr", label: "Battle of Avarayr" },
      { href: "/history/bagratid-armenia", label: "Bagratid Armenia" },
      { href: "/history", label: "All history articles" },
    ],
  },
  {
    href: "/writers",
    label: "Armenian Writers",
    children: [
      { href: "/writers/hovhannes-tumanyan", label: "Hovhannes Tumanyan" },
      { href: "/writers/yeghishe-charents", label: "Yeghishe Charents" },
      { href: "/writers/raffi", label: "Raffi" },
      { href: "/writers/avetik-isahakyan", label: "Avetik Isahakyan" },
      { href: "/writers/khachatur-abovyan", label: "Khachatur Abovyan" },
      { href: "/writers", label: "All writers" },
    ],
  },
  {
    href: "/works",
    label: "Literary Works",
    children: [
      { href: "/works/anush", label: "Anush" },
      { href: "/works/david-of-sassoun", label: "David of Sassoun" },
      { href: "/works/wounds-of-armenia", label: "Wounds of Armenia" },
      { href: "/works/the-fool", label: "The Fool" },
      { href: "/works", label: "All literary works" },
    ],
  },
  { href: "/about", label: "About" },
];

export const footerNav = [
  {
    title: "Explore",
    links: [
      { href: "/history", label: "Armenian History" },
      { href: "/writers", label: "Armenian Writers" },
      { href: "/works", label: "Literary Works" },
      { href: "/#timeline", label: "Timeline" },
      { href: "/history", label: "All Articles" },
    ],
  },
  {
    title: "History",
    links: [
      { href: "/history/kingdom-of-urartu", label: "Ancient Armenia" },
      { href: "/history/tigran-the-great", label: "Armenian Kingdoms" },
      { href: "/history/bagratid-armenia", label: "Medieval Armenia" },
      { href: "/history/first-republic-of-armenia", label: "Modern Armenia" },
      { href: "/history/mesrop-mashtots-armenian-alphabet", label: "Important Figures" },
    ],
  },
  {
    title: "Writers",
    links: [
      { href: "/writers", label: "All Writers" },
      { href: "/writers/hovhannes-tumanyan", label: "Hovhannes Tumanyan" },
      { href: "/writers/yeghishe-charents", label: "Yeghishe Charents" },
      { href: "/writers/raffi", label: "Raffi" },
      { href: "/writers/khachatur-abovyan", label: "Khachatur Abovyan" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/works", label: "Literary Works" },
      { href: "/sitemap.xml", label: "Sitemap" },
      { href: "/contact", label: "Contact Us" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

/**
 * Footer language column. Only the locales with a content bundle are links;
 * the rest are listed as planned editions so the column does not promise
 * pages that do not exist yet.
 */
export const footerLanguages = [
  { label: "Հայերեն", available: false },
  { label: "English", available: true },
  { label: "Русский", available: false },
  { label: "Western Armenian", available: false },
];

export const socialLinks = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "YouTube", href: "#", icon: "youtube" },
  { label: "Telegram", href: "#", icon: "telegram" },
  { label: "X", href: "#", icon: "twitter" },
];
