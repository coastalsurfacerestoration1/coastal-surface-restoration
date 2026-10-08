import { describe, expect, it } from 'vitest';
import { suggestEmail } from '@/lib/email';
import { domainAcceptsMail } from '@/lib/email-domain';

describe('suggestEmail', () => {
  it('fixes common domain typos', () => {
    expect(suggestEmail('jane@gmial.com')).toBe('jane@gmail.com');
    expect(suggestEmail('jane@gmail.con')).toBe('jane@gmail.com');
    expect(suggestEmail('jane@yaho.com')).toBe('jane@yahoo.com');
    expect(suggestEmail('jane@bellsouth.ent')).toBe('jane@bellsouth.net');
  });

  it('leaves correct and unrelated domains alone', () => {
    expect(suggestEmail('jane@gmail.com')).toBeNull();
    expect(suggestEmail('tyler@coastalsurfacerestoration.com')).toBeNull();
    expect(suggestEmail('jane@example.org')).toBeNull();
  });

  it('ignores input that is not an address yet', () => {
    expect(suggestEmail('jane')).toBeNull();
    expect(suggestEmail('@gmial.com')).toBeNull();
  });
});

const notFound = () => Promise.reject(Object.assign(new Error('nope'), { code: 'ENOTFOUND' }));
const noData = () => Promise.reject(Object.assign(new Error('nope'), { code: 'ENODATA' }));

describe('domainAcceptsMail', () => {
  it('accepts a domain with MX records', async () => {
    const resolver = {
      resolveMx: async () => [{ exchange: 'mx.example.net', priority: 10 }],
      resolve4: notFound,
      resolve6: notFound,
    };
    expect(await domainAcceptsMail('a@x.com', resolver)).toBe(true);
  });

  it('accepts a domain with only an address record', async () => {
    const resolver = { resolveMx: noData, resolve4: async () => ['192.0.2.1'], resolve6: notFound };
    expect(await domainAcceptsMail('a@x.com', resolver)).toBe(true);
  });

  it('rejects a domain that does not exist', async () => {
    const resolver = { resolveMx: notFound, resolve4: notFound, resolve6: notFound };
    expect(await domainAcceptsMail('a@gmial.cmo', resolver)).toBe(false);
  });

  it('rejects a null MX', async () => {
    const resolver = {
      resolveMx: async () => [{ exchange: '', priority: 0 }],
      resolve4: async () => ['192.0.2.1'],
      resolve6: notFound,
    };
    expect(await domainAcceptsMail('a@example.com', resolver)).toBe(false);
  });

  it('lets the quote through when DNS itself fails', async () => {
    const broken = () => Promise.reject(Object.assign(new Error('x'), { code: 'ESERVFAIL' }));
    const resolver = { resolveMx: broken, resolve4: broken, resolve6: broken };
    expect(await domainAcceptsMail('a@x.com', resolver)).toBe(true);
  });
});
