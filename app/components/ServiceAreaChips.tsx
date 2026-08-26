import Link from 'next/link';

/**
 * Chip list of areas served. Names that map to a dedicated location page are
 * rendered as `<Link>` so each service page contributes internal links into
 * the location cluster; names without a page fall through to the `/locations`
 * index rather than being dead spans.
 *
 * A shared source of truth means adding a new location page (say, Daniel
 * Island) is a one-line map addition here, not eight service-page edits.
 */
const AREA_HREF: Record<string, string> = {
  // Downtown / peninsula neighborhoods
  'Downtown Charleston': '/locations/downtown-charleston',
  'Historic District': '/locations/downtown-charleston',
  'South of Broad': '/locations/downtown-charleston',
  'Charleston Peninsula': '/locations/downtown-charleston',
  'French Quarter': '/locations/downtown-charleston',
  'Harleston Village': '/locations/downtown-charleston',
  'Ansonborough': '/locations/downtown-charleston',
  'Radcliffeborough': '/locations/downtown-charleston',
  'King Street': '/locations/downtown-charleston',
  'Upper Peninsula': '/locations/downtown-charleston',
  'Charleston Harbor': '/locations/downtown-charleston',
  // Mount Pleasant and adjacent
  'Mount Pleasant': '/locations/mount-pleasant',
  'Old Village': '/locations/mount-pleasant',
  'Shem Creek': '/locations/mount-pleasant',
  'Wando': '/locations/mount-pleasant',
  // Barrier islands
  'Isle of Palms': '/locations/isle-of-palms-sullivans-island',
  "Sullivan's Island": '/locations/isle-of-palms-sullivans-island',
  'Wild Dunes': '/locations/isle-of-palms-sullivans-island',
  // South-side islands
  'James Island': '/locations/james-island-folly-beach',
  'Folly Beach': '/locations/james-island-folly-beach',
};

/** Default list, used when a page does not pass its own. */
export const DEFAULT_AREAS = [
  'Downtown Charleston',
  'Historic District',
  'South of Broad',
  'Mount Pleasant',
  'West Ashley',
  'James Island',
  'Daniel Island',
  'Isle of Palms',
  "Sullivan's Island",
  'North Charleston',
  'Summerville',
  'Folly Beach',
] as const;

type Variant = 'onDark' | 'onLight';

const chipBase =
  'px-4 py-2 rounded text-sm border transition-colors';

const chipVariant: Record<Variant, string> = {
  // Chip on a bg-[#0e273e] section (e.g. inside a service page's service area).
  onDark: 'bg-[#1a3958] border-[#397774]/20 text-gray-300',
  // Chip on a bg-[#1a3958] section (e.g. inside a location page's neighborhood list).
  onLight: 'bg-[#0e273e] border-[#397774]/20 text-gray-300',
};

const linkHover =
  'hover:text-[#397774] hover:border-[#397774]/50';

export default function ServiceAreaChips({
  areas = DEFAULT_AREAS,
  variant = 'onDark',
}: {
  areas?: readonly string[];
  variant?: Variant;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {areas.map((area) => {
        const href = AREA_HREF[area] ?? '/locations';
        return (
          <Link
            key={area}
            href={href}
            className={`${chipBase} ${chipVariant[variant]} ${linkHover}`}
          >
            {area}
          </Link>
        );
      })}
    </div>
  );
}
