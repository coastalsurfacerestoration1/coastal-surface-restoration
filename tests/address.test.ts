import { describe, expect, it } from 'vitest';
import { OTHER_CITY, parseAddressComponents, type AddressComponent } from '@/lib/address';

const c = (types: string[], longText: string, shortText = longText): AddressComponent => ({
  longText,
  shortText,
  types,
});

const base = (locality: string, extra: AddressComponent[] = []) => [
  c(['street_number'], '123'),
  c(['route'], 'King Street', 'King St'),
  ...extra,
  c(['locality', 'political'], locality),
  c(['administrative_area_level_2', 'political'], 'Charleston County'),
  c(['administrative_area_level_1', 'political'], 'South Carolina', 'SC'),
  c(['country', 'political'], 'United States', 'US'),
  c(['postal_code'], '29401'),
  c(['postal_code_suffix'], '1234'),
];

describe('parseAddressComponents', () => {
  it('fills every field for a listed city', () => {
    expect(parseAddressComponents(base('Charleston'))).toEqual({
      street: '123 King St',
      street2: '',
      city: 'Charleston',
      cityOther: '',
      state: 'SC',
      zip: '29401',
    });
  });

  it('prefers a listed neighborhood over the locality', () => {
    const parsed = parseAddressComponents(
      base('Charleston', [c(['neighborhood', 'political'], 'West Ashley')]),
    );
    expect(parsed?.city).toBe('West Ashley');
  });

  it('ignores a neighborhood that is not on the list', () => {
    const parsed = parseAddressComponents(
      base('Charleston', [c(['neighborhood', 'political'], 'Harleston Village')]),
    );
    expect(parsed?.city).toBe('Charleston');
  });

  it('matches curly apostrophes and Mt abbreviations', () => {
    expect(parseAddressComponents(base('Sullivan’s Island'))?.city).toBe("Sullivan's Island");
    expect(parseAddressComponents(base('Mt Pleasant'))?.city).toBe('Mount Pleasant');
  });

  it('puts an unlisted locality in Other', () => {
    const parsed = parseAddressComponents(base('Awendaw'));
    expect(parsed?.city).toBe(OTHER_CITY);
    expect(parsed?.cityOther).toBe('Awendaw');
  });

  it('carries the unit into street2', () => {
    const parsed = parseAddressComponents(base('Charleston', [c(['subpremise'], '4B')]));
    expect(parsed?.street2).toBe('4B');
  });

  it('refuses a place with no street number', () => {
    expect(parseAddressComponents(base('Charleston').slice(1))).toBeNull();
  });
});
