import { BUSINESS, SITE_URL } from '@/lib/seo';
import { SERVICE_AREAS } from '@/lib/schema';

// Served as a static file at build time rather than per request.
export const dynamic = 'force-static';

const SERVICES: [string, string, string][] = [
  [
    'Rust & Paint Removal',
    '/services/rust-removal-charleston',
    'Rust and failed paint removed from iron and steel after a test spot, with no blast media or chemicals',
  ],
  [
    'Ironwork and Railings',
    '/services/historic-ironwork-restoration-charleston',
    'Steel and iron railings, gates and fences cleaned after a test spot, priced per linear foot. Pre-1978 paint and individually listed properties are declined',
  ],
  [
    'Marine Cleaning',
    '/services/marine-cleaning-charleston',
    'Stainless and bronze hardware, trailers and removed parts cleaned on land or on the hard, never over water',
  ],
  [
    'Graffiti Removal',
    '/services/graffiti-removal-charleston',
    'Dark spray paint tags on hard, non-historic brick, block and metal after a test patch. Red and yellow get a test patch first and may leave a stain. Silver or metallic paint on masonry is declined',
  ],
  [
    'Rental Property Railings',
    '/services/vacation-rental-cleaning-charleston',
    'Rust on railings, gates and exterior hardware at rental properties, scheduled around guest turnovers',
  ],
  [
    'Antiques, Tools and Car Parts',
    '/services/antique-restoration-charleston',
    'Rust and old paint removed from vintage tools, hinges, cast iron and classic car parts after a test spot',
  ],
  [
    'Commercial Metalwork',
    '/services/commercial-exterior-cleaning-charleston',
    'Steel and stainless railings, gates and fixtures at businesses, scheduled outside business hours',
  ],
  [
    'Stainless Steel',
    '/services/rust-removal-charleston',
    'Weld heat tint and tea staining removed from 304 and 316 stainless rails, frames and fittings',
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

The laser is set to remove the coating and stop at the base material, and every job starts with a test spot. It works best on rust and paint on iron and steel, stainless weld tint, and marine hardware on land. Historic soft brick, lime mortar, stucco and pre-1978 paint are declined. The equipment is portable, so work happens at the property or in the driveway, never over water.

## Key facts

- Business: ${BUSINESS.name}
- Phone: ${BUSINESS.phone}
- Email: ${BUSINESS.email}
- Hours: Saturday and Sunday 8:00 AM to 9:00 PM, Monday to Friday 4:00 PM to 9:00 PM
- Service model: mobile, service-area business with no walk-in storefront
- Pricing: free estimates, quoted per object, per job or per linear foot for railings, $400 minimum
- Estimates: send photos of the piece and pricing follows within one business day
- Credentials: general liability insured; business licensed in Charleston, Mount Pleasant and North Charleston; owner trained to ANSI Z136.1 through the Laser Institute of America and acts as Laser Safety Officer
- Service areas: ${SERVICE_AREAS.join(', ')}

## Services

${SERVICES.map(([name, path, desc]) => `- [${name}](${SITE_URL}${path}): ${desc}`).join('\n')}

## Service areas

${LOCATIONS.map(([name, path]) => `- [${name}](${SITE_URL}${path}): laser cleaning services in ${name}`).join('\n')}

## Learn

- [How Laser Cleaning Works](${SITE_URL}/how-laser-cleaning-works): plain-language explanation of the technology, what it removes, and where its limits are

## Company

- [About](${SITE_URL}/about): background on the business and its founder, Tyler Scherzer
- [Contact](${SITE_URL}/contact): phone, email, hours, and frequently asked questions
- [Request a quote](${SITE_URL}/quote): free estimate request form
- [Gallery](${SITE_URL}/gallery): bench test photos and illustrations, with project photos added as jobs are completed

## Notes

- Laser cleaning is not pressure washing, sandblasting, or chemical stripping. It is a dry, non-contact process with no blast media to clean up. Removed coating becomes dust and fume, which is extracted and HEPA cleaned.
- Not offered: efflorescence, boat hulls and gelcoat, any work over water, interior wood, pre-1978 paint unless lead tested, individually listed historic properties, soft historic brick and lime mortar, car body panels, sealed or epoxy floors.
- Pricing: quoted per object, per job, or per linear foot for railings, with a $400 minimum. Never per square foot.
- Bare steel left uncoated in coastal salt air will begin to flash rust, so exterior work is timed so a protective coating can follow.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
