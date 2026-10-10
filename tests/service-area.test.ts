import { describe, expect, it } from 'vitest';
import { checkServiceArea } from '@/lib/service-area';

describe('checkServiceArea', () => {
  it('takes every advertised town and the places around them', () => {
    for (const zip of ['29401', '29403', '29407', '29412', '29439', '29451', '29464', '29482', '29483', '29492', '29455', '29461', '29445', '29420', '29426']) {
      expect(checkServiceArea(zip).verdict, zip).toBe('in');
    }
  });

  it('measures from the nearest town and rounds to whole miles', () => {
    expect(checkServiceArea('29483')).toEqual({ verdict: 'in', miles: 3, town: 'Summerville' });
    expect(checkServiceArea('29438')).toEqual({ verdict: 'near', miles: 22, town: 'West Ashley' });
    expect(checkServiceArea('29902')).toEqual({ verdict: 'near', miles: 49, town: 'Folly Beach' });
  });

  it('calls anything past 50 miles, or any real ZIP outside the local table, far', () => {
    expect(checkServiceArea('29910').verdict).toBe('far');
    expect(checkServiceArea('10001').verdict).toBe('far');
    expect(checkServiceArea('90210').verdict).toBe('far');
  });

  it('lets through what it cannot place rather than guessing', () => {
    expect(checkServiceArea('29402').verdict).toBe('unknown');
    expect(checkServiceArea('00000').verdict).toBe('unknown');
    expect(checkServiceArea('2940').verdict).toBe('unknown');
    expect(checkServiceArea('abcde').verdict).toBe('unknown');
  });
});
