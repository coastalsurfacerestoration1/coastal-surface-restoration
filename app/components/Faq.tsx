import { faqSchema, type QA } from '@/lib/schema';
import JsonLd from './JsonLd';

/**
 * FAQ section plus its FAQPage JSON-LD, both built from one `items` array.
 *
 * Answers are rendered as plain visible text because search engines discard
 * FAQ markup whose answers are not present on the page, and because these
 * short self-contained answers are the passages AI search tends to quote.
 */
export default function Faq({
  items,
  path,
  heading = 'Common Questions',
}: {
  items: readonly QA[];
  /** Root-relative path of the page, used for the schema node id. */
  path: string;
  heading?: string;
}) {
  return (
    <>
      <JsonLd data={faqSchema(items, path)} />
      <section className="py-8 lg:py-12 bg-[#0d1f3c] border-t border-[#0e7c7b]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10">{heading}</h2>
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.q}
                className="bg-[#0a1628] border border-[#0e7c7b]/20 rounded-lg p-6"
              >
                <h3 className="text-white font-bold mb-3">{item.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
