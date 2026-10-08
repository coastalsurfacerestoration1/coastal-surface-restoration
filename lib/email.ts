/**
 * Domains common enough among customers that a near miss is almost certainly a
 * typo. bellsouth.net and the cable providers are on it because older
 * Charleston homeowners still use them.
 */
const COMMON_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'live.com',
  'msn.com',
  'me.com',
  'comcast.net',
  'att.net',
  'bellsouth.net',
  'charter.net',
  'verizon.net',
  'sbcglobal.net',
];

/** Plain Levenshtein distance. The strings here are a dozen characters at most. */
function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}

/**
 * The address the customer probably meant, or null when it looks fine.
 *
 * Only ever a suggestion. A domain that is merely unusual, a business domain
 * say, is left alone: it is only flagged when it sits one or two keystrokes
 * from a common one, which is what gmial.com or yahoo.con look like and what a
 * real company domain almost never does.
 */
export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf('@');
  if (at < 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (!domain || COMMON_DOMAINS.includes(domain)) return null;

  let best: string | null = null;
  let bestDistance = Infinity;
  for (const candidate of COMMON_DOMAINS) {
    const d = distance(domain, candidate);
    if (d < bestDistance) {
      best = candidate;
      bestDistance = d;
    }
  }
  // Two edits catches a transposition (gmial) or a dropped letter plus a wrong
  // one. Short domains get one, since two edits away from me.com is almost any
  // four letter domain.
  const allowed = domain.length <= 6 ? 1 : 2;
  return best && bestDistance <= allowed ? `${local}@${best}` : null;
}
