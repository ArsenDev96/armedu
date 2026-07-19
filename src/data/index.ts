import { DEFAULT_LOCALE, type Locale, type LocaleContent } from "./types";
import { en } from "./locales/en";

/**
 * Locale registry. Additional locales (hy, hyw, ru) can be registered here once
 * their content bundles exist; missing locales fall back to the default.
 */
const bundles: Partial<Record<Locale, LocaleContent>> = {
  en,
};

export function getContent(locale: Locale = DEFAULT_LOCALE): LocaleContent {
  return bundles[locale] ?? bundles[DEFAULT_LOCALE]!;
}

export function getAvailableLocales(): Locale[] {
  return Object.keys(bundles) as Locale[];
}
