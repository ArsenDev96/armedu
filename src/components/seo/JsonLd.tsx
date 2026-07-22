/**
 * Renders a Schema.org graph into the page.
 *
 * `<script type="application/ld+json">` is not executable JavaScript, so React's
 * `dangerouslySetInnerHTML` is the documented way to emit it — there is no
 * alternative that produces valid JSON-LD. The payload is built server-side from
 * the content bundle, never from user input, and `<` is escaped so a string in
 * the content could not close the script tag early.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
