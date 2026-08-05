import { BUSINESS, SITE_URL } from '@/lib/seo';
import { SERVICE_AREAS } from '@/lib/schema';

// Served as a static file at build time rather than per request.
export const dynamic = 'force-static';

const SERVICES: [string, string, string][] = [
  [
    'Rust & Paint Removal',
    '/services/rust-removal-charleston',
    'Corrosion and failed coatings removed from iron, steel, and aluminum without abrasives or chemicals',
  ],
  [
    'Historic Ironwork Restoration',
    '/services/historic-ironwork-restoration-charleston',
    'Wrought iron gates, railings, and antique metalwork cleaned without removing base metal or forged detail',
  ],
  [
    'Marine Cleaning',
    '/services/marine-cleaning-charleston',
    'Boat trailers, dock hardware, and marine fittings cleaned dockside with nothing discharged into the water',
  ],
  [
    'Brick & Masonry Cleaning',
    '/services/brick-cleaning-charleston',
    'Efflorescence and soiling removed from historic brick, stucco, and stone without pressure washing damage',
  ],
  [
    'Graffiti Removal',
    '/services/graffiti-removal-charleston',
    'Spray paint removed from masonry, metal, and concrete without ghosting or surface gouging',
  ],
  [
    'Vacation Rental Restoration',
    '/services/vacation-rental-cleaning-charleston',
    'Railings, hardware, and entryways maintained on a turnover-friendly schedule for rental properties',
  ],
  [
    'Antique & Hardware Restoration',
    '/services/antique-restoration-charleston',
    'Rust and old finishes lifted from antiques and heirlooms while preserving patina and maker marks',
  ],
  [
    'Commercial Exterior Cleaning',
    '/services/commercial-exterior-cleaning-charleston',
    'Storefronts, signage, and exterior metal restored outside business hours with no runoff or downtime',
  ],
];

const LOCATIONS: [string, string][] = [
  ['Downtown Charleston', '/locations/downtown-charleston'],
  ['Mount Pleasant', '/locations/mount-pleasant'],
  ["Isle of Palms & Sullivan's Island", '/locations/isle-of-palms-sullivans-island'],
  ['James Island & Folly Beach', '/locations/james-island-folly-beach'],
];

/**
 * llms.txt, a plain-language summary for AI answer engines.
 *
 * Generated from the same constants the site renders from, so the contact
 * details and service areas here cannot drift from the pages or the schema.
 */
export function GET() {
  const body = `# Coastal Surface Restoration

> Mobile laser cleaning and surface restoration serving Charleston, South Carolina and the surrounding Lowcountry. Rust, paint, graffiti, and corrosion are removed on site using a pulsed fiber laser, with no chemicals, no abrasive blasting media, and no water runoff.

Laser cleaning removes the contaminant layer while leaving the underlying material intact, which makes it suited to historic brick, lime mortar, original stucco, and irreplaceable wrought iron. The equipment is portable, so work is performed at the property, at the dock, or in the driveway rather than at a shop.

## Key facts

- Business: ${BUSINESS.name}
- Phone: ${BUSINESS.phone}
- Email: ${BUSINESS.email}
- Hours: Monday to Saturday, 8:00 AM to 7:00 PM
- Service model: mobile, service-area business with no walk-in storefront
- Pricing: free estimates on every job, ${'$'}400 minimum job size
- Estimates: send photos of the piece and pricing follows, usually within 24 hours
- Credentials: licensed and insured, ANSI Z136.1 certified Laser Safety Officer
- Service areas: ${SERVICE_AREAS.join(', ')}

## Services

${SERVICES.map(([name, path, desc]) => `- [${name}](${SITE_URL}${path}): ${desc}`).join('\n')}

## Service areas

${LOCATIONS.map(([name, path]) => `- [${name}](${SITE_URL}${path}): laser cleaning services in ${name}`).join('\n')}

## Company

- [About](${SITE_URL}/about): background on the business and its founder, Tyler Scherzer
- [Contact](${SITE_URL}/contact): phone, email, hours, and frequently asked questions
- [Request a quote](${SITE_URL}/quote): free estimate request form
- [Gallery](${SITE_URL}/gallery): before and after project photos

## Notes

- Laser cleaning is not pressure washing, sandblasting, or chemical stripping. It is a dry, non-contact process, which is why it is used where those methods would damage the surface or create runoff.
- Bare steel left uncoated in coastal salt air will begin to flash rust, so exterior work is timed so a protective coating can follow.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
