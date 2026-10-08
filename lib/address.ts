export const OTHER_CITY = 'Other / not listed';

/**
 * Cities offered in the address dropdown.
 *
 * Deliberately not SERVICE_AREAS from lib/schema.ts: that list is the areas we
 * advertise, including neighborhoods like the Historic District that are not
 * mailing cities. This one has to match what a customer would write on an
 * envelope, so it lists municipalities and keeps an escape hatch for the rest.
 */
export const ADDRESS_CITIES = [
  'Charleston',
  'Mount Pleasant',
  'North Charleston',
  'West Ashley',
  'James Island',
  'Johns Island',
  'Daniel Island',
  'Folly Beach',
  'Isle of Palms',
  "Sullivan's Island",
  'Summerville',
  OTHER_CITY,
];

/** The shape Google's Place.addressComponents uses, trimmed to what we read. */
export type AddressComponent = {
  longText: string | null;
  shortText: string | null;
  types: string[];
};

/** The quote form's address fields, as filled from a picked suggestion. */
export type ParsedAddress = {
  street: string;
  street2: string;
  city: string;
  cityOther: string;
  state: string;
  zip: string;
};

/** Lowercase, curly apostrophes straightened, "Mt" spelled out. */
function normalizeCity(name: string): string {
  return name
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/^mt\.?\s/, 'mount ')
    .replace(/\s+/g, ' ')
    .trim();
}

function listedCity(name: string | null | undefined): string | null {
  if (!name) return null;
  const wanted = normalizeCity(name);
  return ADDRESS_CITIES.find((c) => c !== OTHER_CITY && normalizeCity(c) === wanted) ?? null;
}

/**
 * Turns a picked Google place into the form's address fields.
 *
 * City picks the most specific listed name. Google files a West Ashley or
 * Daniel Island address under locality "Charleston" with the area as a
 * neighborhood or sublocality, and a customer choosing from our dropdown would
 * pick the area, so that wins when it is on the list. Anything not on the list
 * lands in Other with Google's locality as the typed city, which is exactly
 * what a customer would have done by hand.
 *
 * Returns null when there is no street number, since a route alone or a whole
 * town is not somewhere a truck can go and the form would reject it anyway.
 */
export function parseAddressComponents(components: AddressComponent[]): ParsedAddress | null {
  const find = (type: string) => components.find((c) => c.types.includes(type));
  const long = (type: string) => find(type)?.longText?.trim() ?? '';
  const short = (type: string) => find(type)?.shortText?.trim() ?? '';

  const number = long('street_number');
  const route = short('route') || long('route');
  if (!number || !route) return null;

  const area =
    listedCity(long('neighborhood')) ??
    listedCity(long('sublocality_level_1')) ??
    listedCity(long('sublocality'));
  const locality = long('locality') || long('postal_town') || long('administrative_area_level_3');
  const city = area ?? listedCity(locality);

  return {
    street: `${number} ${route}`,
    street2: long('subpremise'),
    city: city ?? OTHER_CITY,
    cityOther: city ? '' : locality,
    state: short('administrative_area_level_1').toUpperCase(),
    zip: long('postal_code').slice(0, 5),
  };
}
