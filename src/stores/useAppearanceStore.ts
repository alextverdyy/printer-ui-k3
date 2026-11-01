import { create } from 'zustand';
import { accentForeground, blendedAccent, defaultAppearance, parseAppearance, type Appearance } from '../domain/appearance';

const key = 'k3-screen-appearance';
function load(): Appearance {
  try { return parseAppearance(JSON.parse(localStorage.getItem(key) || 'null')); }
  catch { return { ...defaultAppearance }; }
}
function apply(appearance: Appearance) {
  document.documentElement.style.setProperty('--ui-text-scale', String(appearance.textScale));
  const style = document.body.style;
  if (appearance.accent) {
    const color = appearance.accent;
    style.setProperty('--accent', color);
    style.setProperty('--accent-rgb', color.slice(1).match(/../g)!.map((part) => parseInt(part, 16)).join(', '));
    style.setProperty('--accent-foreground', accentForeground(color));
    style.setProperty('--accent-text', accentForeground(blendedAccent(color, 0.3)));
    style.setProperty('--accent-pressed-foreground', accentForeground(blendedAccent(color, 0.4)));
  } else {
    ['--accent', '--accent-rgb', '--accent-foreground', '--accent-text', '--accent-pressed-foreground'].forEach((name) => style.removeProperty(name));
  }
}
const initial = load();
apply(initial);
export const useAppearanceStore = create<{
  appearance: Appearance;
  error: string;
  setAppearance: (value: Appearance) => void;
}>((set) => ({
  appearance: initial,
  error: '',
  setAppearance(value) {
    const appearance = parseAppearance(value);
    try { localStorage.setItem(key, JSON.stringify(appearance)); }
    catch { set({ error: 'Your browser could not save this change. Free some storage and try again.' }); return; }
    apply(appearance);
    set({ appearance, error: '' });
  },
}));
