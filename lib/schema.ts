import { BUSINESS, SITE_NAME, SITE_URL } from './seo';

/**
 * Stable node id for the business. Other schema blocks on the site reference
 * it with { '@id': BUSINESS_ID } instead of restating the whole business, so
 * search engines treat every page as describing one entity rather than a
 * separate business per page.
 */
export const BUSINESS_ID = `${SITE_URL}/#business`;

/**
 * Cities we advertise as served, matching the list on /contact. Keep this in
 * sync with the Google Business Profile service areas — a mismatch between the
 * two is a local ranking signal, not a cosmetic difference.
 */
export const SERVICE_AREAS = [
  'Charleston',
  'Mount Pleasant',
  'Isle of Palms',
  "Sullivan's Island",
  'James Island',
  'Folly Beach',
  'West Ashley',
  'Summerville',
] as const;

/**
 * The business itself.
 *
 * Modeled as a service-area business: there is no storefront customers visit,
 * so no street address is claimed. `address` is deliberately limited to the
 * locality/region — enough for search engines to place the business, without
 * asserting a walk-in location that does not exist.
 */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': BUSINESS_ID,
    name: BUSINESS.name,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/opengraph-image`,
    description:
      "Charleston's mobile laser cleaning specialist for historic, marine, and property restoration. Rust, paint, graffiti, and corrosion removed on site with no chemicals, no abrasives, and no water runoff.",
    telephone: '+1-854-222-7790',
    email: BUSINESS.email,
    priceRange: '$$',
    currenciesAccepted: 'USD',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Charleston',
      addressRegion: 'SC',
      addressCountry: 'US',
    },
    // Downtown Charleston, used as the midpoint of the service area rather
    // than as a location customers visit. The radius reaches Summerville,
    // the furthest city we advertise.
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 32.7765,
      longitude: -79.9311,
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 32.7765,
        longitude: -79.9311,
      },
      geoRadius: '40000',
    },
    areaServed: SERVICE_AREAS.map((name) => ({
      '@type': 'City',
      name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'South Carolina',
      },
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '08:00',
        closes: '19:00',
      },
    ],
    founder: {
      '@type': 'Person',
      name: 'Tyler Scherzer',
      jobTitle: 'Founder & Laser Safety Officer',
    },
    knowsAbout: [
      'Laser cleaning',
      'Rust removal',
      'Historic ironwork restoration',
      'Marine hardware cleaning',
      'Brick and masonry cleaning',
      'Graffiti removal',
    ],
    // Add the Google Business Profile URL here once the listing is verified.
    sameAs: [...BUSINESS.socials],
  };
}

type ServiceInput = {
  /** Service name as a customer would say it. */
  name: string;
  description: string;
  /** Root-relative path of the page describing this service. */
  path: string;
  /** Broad category, e.g. 'Rust removal'. */
  serviceType: string;
  /** Narrow the served area for a location page. Defaults to all of them. */
  areaServed?: readonly string[];
};

/**
 * A service offered by the business.
 *
 * `provider` points at BUSINESS_ID rather than repeating the business, so all
 * of these resolve to the single entity declared in the root layout.
 */
export function serviceSchema({
  name,
  description,
  path,
  serviceType,
  areaServed = SERVICE_AREAS,
}: ServiceInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}${path}#service`,
    name,
    description,
    serviceType,
    url: `${SITE_URL}${path}`,
    provider: { '@id': BUSINESS_ID },
    areaServed: areaServed.map((area) => ({ '@type': 'City', name: area })),
  };
}

export type QA = { q: string; a: string };

/**
 * FAQPage markup for a set of questions.
 *
 * Google requires the answers to be visible on the page, so this is always
 * generated from the same array that renders the visible FAQ section rather
 * than being written separately.
 */
export function faqSchema(items: readonly QA[], path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}${path}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(trail: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

/** Lets search engines resolve the site name and pair it with the business. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { '@id': BUSINESS_ID },
    inLanguage: 'en-US',
  };
}
