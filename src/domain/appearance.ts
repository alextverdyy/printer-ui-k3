export interface Appearance {
  version: 1;
  accent: string | null;
  textScale: 1 | 1.1 | 1.2;
}

export const defaultAppearance: Appearance = { version: 1, accent: null, textScale: 1 };

export function parseAppearance(value: unknown): Appearance {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Choose a screen appearance JSON file.');
  const data = value as Record<string, unknown>;
  if (Object.keys(data).some((key) => !['version', 'accent', 'textScale'].includes(key)) || data.version !== 1) {
    throw new Error('This file is not a supported screen appearance profile.');
  }
  if (data.accent !== null && (typeof data.accent !== 'string' || !/^#[\da-f]{6}$/i.test(data.accent))) {
    throw new Error('Accent must be a six digit hex color.');
  }
  if (![1, 1.1, 1.2].includes(Number(data.textScale)) || typeof data.textScale !== 'number') {
    throw new Error('Text size must be 100%, 110%, or 120%.');
  }
  return { version: 1, accent: data.accent as string | null, textScale: data.textScale as Appearance['textScale'] };
}

// Choose readable foreground text for any user-selected accent.
export function accentForeground(hex: string): '#000000' | '#ffffff' {
  const channels = hex.slice(1).match(/../g)!.map((part) => {
    const n = parseInt(part, 16) / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return luminance > 0.179 ? '#000000' : '#ffffff';
}

export function blendedAccent(hex: string, share: number): string {
  const base = [35, 40, 52]; // --surface-strong, the selected/pressed button surface
  const channels = hex.slice(1).match(/../g)!.map((part, index) =>
    Math.round(parseInt(part, 16) * share + base[index] * (1 - share)));
  return '#' + channels.map((value) => value.toString(16).padStart(2, '0')).join('');
}
