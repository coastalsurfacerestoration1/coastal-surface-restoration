/**
 * Renders a JSON-LD block.
 *
 * `<` is escaped to its unicode form because JSON.stringify does not sanitize
 * strings for embedding in HTML — this is the approach Next documents for
 * structured data.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
