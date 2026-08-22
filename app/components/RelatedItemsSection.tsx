import Link from 'next/link';

export type RelatedItem = {
  title: string;
  desc: string;
  href: string;
};

type Variant = 'onDark' | 'onLight';

/**
 * The card grid pattern used across the site for "Related Services" on
 * location pages and, going forward, for "Other Service Areas" on location
 * pages and "Related Services" on service pages. Cards match downtown
 * Charleston's original layout so the site's visual vocabulary is one thing.
 *
 * Variant switches the card background so the cards visually pop off whichever
 * section color they sit in: `onDark` for cards inside a `bg-[#0a1628]`
 * section, `onLight` for cards inside a `bg-[#0d1f3c]` section.
 */
export default function RelatedItemsSection({
  heading,
  intro,
  items,
  variant = 'onDark',
}: {
  heading: string;
  intro?: string;
  items: RelatedItem[];
  variant?: Variant;
}) {
  const sectionBg = variant === 'onDark' ? 'bg-[#0a1628]' : 'bg-[#0d1f3c]';
  const cardBg = variant === 'onDark' ? 'bg-[#0d1f3c]' : 'bg-[#0a1628]';

  // 2 or 3 cards side by side; more than 3 wraps to the next row.
  const cols = items.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <section className={`py-8 lg:py-12 ${sectionBg}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-4">{heading}</h2>
        {intro && (
          <p className="text-gray-400 leading-relaxed mb-10 max-w-2xl">
            {intro}
          </p>
        )}
        <div className={`grid grid-cols-1 ${cols} gap-6 ${intro ? '' : 'mt-10'}`}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block ${cardBg} border border-[#0e7c7b]/20 rounded-lg p-6 hover:border-[#00d4d4]/50 transition-colors group`}
            >
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#00d4d4] transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.desc}</p>
              <span className="inline-flex items-center gap-1 text-[#00d4d4] font-semibold text-sm group-hover:gap-2 transition-all">
                Learn more <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
