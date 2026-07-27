/**
 * Server-rendered JSON-LD. Must stay a Server Component with a plain <script>
 * tag — next/script (any strategy other than beforeInteractive) is omitted from
 * the initial HTML and is invisible to non-JS crawlers.
 */
export function JsonLd({ id, data }: { id?: string; data: unknown }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
