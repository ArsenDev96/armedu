import { SUPPORTED_LOCALES, type Locale, type LocaleContent } from "./types";
import { en } from "./locales/en";
import { hy } from "./locales/hy";
import { hyw } from "./locales/hyw";

/**
 * Locale registry.
 *
 * Every supported locale must have a complete bundle — the `Record` type makes a
 * missing edition a compile error. There is **no fallback**: `getLocaleBundle`
 * cannot quietly hand back English when an Armenian bundle is incomplete,
 * because there is nowhere for it to fall back to. Content that is missing for a
 * locale is missing, and the UI says so explicitly.
 */
const bundles: Record<Locale, LocaleContent> = {
  hy,
  hyw,
  en,
};

export function getLocaleBundle(locale: Locale): LocaleContent {
  return bundles[locale];
}

export function getAvailableLocales(): Locale[] {
  return [...SUPPORTED_LOCALES];
}
