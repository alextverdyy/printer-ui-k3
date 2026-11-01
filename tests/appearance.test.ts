import { describe, expect, it } from 'vitest';
import { accentForeground, blendedAccent, defaultAppearance, parseAppearance } from '../src/domain/appearance';

describe('appearance profile boundary', () => {
  it('round trips only supported local appearance data', () => {
    const profile = { version: 1, accent: '#e7b94a', textScale: 1.2 };
    expect(parseAppearance(JSON.parse(JSON.stringify(profile)))).toEqual(profile);
    expect(parseAppearance(defaultAppearance)).toEqual(defaultAppearance);
  });
  it('rejects printer credentials, CSS injection, invalid scales and future schemas', () => {
    for (const value of [null, [], { ...defaultAppearance, moonraker_api_key: 'fixture' },
      { ...defaultAppearance, accent: 'url(https://invalid.test)' },
      { ...defaultAppearance, textScale: '1.2' }, { ...defaultAppearance, textScale: 2 },
      { ...defaultAppearance, version: 2 }]) {
      expect(() => parseAppearance(value)).toThrow();
    }
  });
  it('keeps action labels readable on very bright and dark custom accents', () => {
    expect(accentForeground('#ffffff')).toBe('#000000');
    expect(accentForeground('#000000')).toBe('#ffffff');
    expect(accentForeground('#7b4dff')).toBe('#ffffff');
    expect(accentForeground(blendedAccent('#ffffff', 0.3))).toBe('#ffffff');
    expect(accentForeground(blendedAccent('#ffffff', 0.4))).toBe('#000000');
  });
});
