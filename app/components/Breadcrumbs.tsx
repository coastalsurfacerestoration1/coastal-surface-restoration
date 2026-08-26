import Link from 'next/link';
import { breadcrumbSchema, type Crumb } from '@/lib/schema';
import JsonLd from './JsonLd';

/**
 * Visible breadcrumb trail plus the matching BreadcrumbList JSON-LD.
 *
 * Both come from one `trail` so the markup and the structured data cannot
 * disagree, which is the thing Google flags. The last crumb is the current
 * page and is rendered as text rather than a link.
 */
export default function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#397774]/20 bg-[#0e273e]"
      >
        <ol className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {trail.map((crumb, i) => {
            const isCurrent = i === trail.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-x-2">
                {i > 0 && (
                  <span className="text-gray-600" aria-hidden="true">
                    /
                  </span>
                )}
                {isCurrent ? (
                  <span className="text-gray-500" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className="text-gray-400 hover:text-[#397774] transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
