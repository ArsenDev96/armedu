import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js).
 *
 * The measurement ID lives here rather than in an environment variable for the
 * same reason the domain lives in `src/data/site.ts`: it is site identity, not a
 * secret, and it is baked into the client bundle either way. Nothing is gained
 * by making a public string configurable at deploy time.
 *
 * Nothing is rendered outside a production build, so local development and the
 * Playwright suite never send hits and the property stays free of noise. To
 * verify the tag locally, run a real production build (`npm run build && npm
 * run start`) — `next start` sets NODE_ENV=production, so the tag loads.
 *
 * `afterInteractive` is the correct strategy for gtag: the tag must run on every
 * page but must not block the first paint. `beforeInteractive` would delay
 * hydration for an analytics script, and `lazyOnload` drops the hits of readers
 * who leave quickly — exactly the readers analytics exists to count.
 */

const GA_MEASUREMENT_ID = "G-BQ1HWH334Y";

export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      {/*
        The inline half of the snippet. It has to be a `<Script>` too, not a raw
        `<script>`: React does not execute inline scripts it renders on the
        client, so a plain tag here would run on the first server-rendered page
        and silently stop working after any client-side navigation.
      */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
