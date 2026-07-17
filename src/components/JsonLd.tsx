// Structured data (schema.org) — renderiza no DOM para o Google indexar rich snippets.
// Funciona em Server e Client Components.
interface JsonLdProps {
  data: Record<string, unknown>;
}

export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
