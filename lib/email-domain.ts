import { promises as dns } from 'node:dns';

type Resolver = {
  resolveMx(domain: string): Promise<{ exchange: string }[]>;
  resolve4(domain: string): Promise<unknown[]>;
  resolve6(domain: string): Promise<unknown[]>;
};

/** Long enough for a slow resolver, short enough not to hold up a quote. */
const TIMEOUT_MS = 2500;

/** DNS answers that mean the name definitely has no such record. */
const NO_RECORD = new Set(['ENOTFOUND', 'ENODATA']);

class Unknown extends Error {}

async function has(lookup: () => Promise<unknown[]>): Promise<boolean> {
  try {
    const records = await lookup();
    return records.length > 0;
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code && NO_RECORD.has(code)) return false;
    throw new Unknown();
  }
}

/**
 * Whether the email's domain can receive mail at all.
 *
 * Mail goes to the domain's MX records, or to its plain address when it has
 * none, so a domain with neither is a typo or made up. A "null MX", a single
 * record pointing at ".", is a domain saying outright that it takes no mail.
 *
 * This proves nothing about the mailbox itself: t@gmail.com passes. Only
 * sending to it can tell that.
 *
 * Anything other than a definite "no such record" answers true. A timeout or a
 * resolver error is our problem, not the customer's, and must never turn a
 * real quote away.
 */
export async function domainAcceptsMail(email: string, resolver: Resolver = dns): Promise<boolean> {
  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase();
  if (!domain) return false;

  const check = async () => {
    try {
      const mx = await resolver.resolveMx(domain);
      if (mx.length > 0) return !(mx.length === 1 && (mx[0].exchange === '' || mx[0].exchange === '.'));
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (!code || !NO_RECORD.has(code)) throw new Unknown();
    }
    return (await has(() => resolver.resolve4(domain))) || (await has(() => resolver.resolve6(domain)));
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<boolean>((resolve) => {
    timer = setTimeout(() => resolve(true), TIMEOUT_MS);
  });
  try {
    return await Promise.race([check(), timeout]);
  } catch {
    return true;
  } finally {
    clearTimeout(timer);
  }
}
