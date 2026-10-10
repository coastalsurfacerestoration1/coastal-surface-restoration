import { KNOWN, NEAR } from './zip-centroids';

/**
 * How far a quote can come from, measured from the ZIP's centroid to the
 * nearest service town. Tyler, 2026-10-09:
 *
 * - within 20 miles: taken as usual.
 * - 20 to 50 miles: refused, but Tyler still gets the email and a sheet row
 *   marked blocked, since a real customer that close may still be worth a call.
 * - past 50 miles: refused and dropped. That far out it is more likely a bot or
 *   a mistake than a job.
 *
 * A ZIP the Census table cannot place (PO box only ZIPs such as 29402, or a
 * typo that happens to be five digits) is let through and flagged the old way,
 * so a gap in the data never costs a real lead.
 *
 * The centroid is a few miles from any given house, which is plenty for tiers
 * this wide, and it needs no API key and sends the address nowhere.
 */
export const SERVICE_RADIUS_MILES = 20;
export const DROP_BEYOND_MILES = 50;

/** Rough centers of the towns in SERVICE_AREAS (lib/schema.ts). */
const TOWNS: readonly (readonly [string, number, number])[] = [
  ['Charleston', 32.7765, -79.9311],
  ['Mount Pleasant', 32.7941, -79.8626],
  ['Isle of Palms', 32.7868, -79.7948],
  ["Sullivan's Island", 32.7632, -79.8365],
  ['James Island', 32.7215, -79.9543],
  ['Folly Beach', 32.6552, -79.9404],
  ['West Ashley', 32.7846, -80.039],
  ['Summerville', 33.0185, -80.1756],
];

export type AreaCheck =
  /** Within the service radius. */
  | { verdict: 'in'; miles: number; town: string }
  /** 20 to 50 miles out: refused, still logged for Tyler. */
  | { verdict: 'near'; miles: number; town: string }
  /** Past 50 miles, or a real ZIP nowhere near: refused and dropped. */
  | { verdict: 'far'; miles?: number; town?: string }
  /** Not a ZIP the table knows, so let it through. */
  | { verdict: 'unknown' };

/** What the customer is told, at either refusal tier, so the tiers stay private. */
export const OUT_OF_AREA_MESSAGE =
  'That address is outside our service area, which covers about 20 miles around Charleston. ' +
  'Call or text 854-222-7790 and we can talk about it.';

export function checkServiceArea(zip: string): AreaCheck {
  if (!/^\d{5}$/.test(zip)) return { verdict: 'unknown' };
  const point = NEAR[zip];
  if (!point) return isKnownZip(zip) ? { verdict: 'far' } : { verdict: 'unknown' };

  let best = { miles: Infinity, town: '' };
  for (const [town, lat, lng] of TOWNS) {
    const miles = distanceMiles(point[0], point[1], lat, lng);
    if (miles < best.miles) best = { miles, town };
  }
  const miles = Math.round(best.miles);
  if (best.miles <= SERVICE_RADIUS_MILES) return { verdict: 'in', miles, town: best.town };
  if (best.miles <= DROP_BEYOND_MILES) return { verdict: 'near', miles, town: best.town };
  return { verdict: 'far', miles, town: best.town };
}

let known: Uint8Array | null = null;

function isKnownZip(zip: string): boolean {
  if (!known) {
    const binary = atob(KNOWN);
    known = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  }
  const n = Number(zip);
  return (known[n >> 3] & (1 << (n & 7))) !== 0;
}

/** Great circle distance in miles. */
function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = Math.PI / 180;
  const h =
    Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lng2 - lng1) * rad) / 2) ** 2;
  return 2 * 3958.8 * Math.asin(Math.sqrt(h));
}
