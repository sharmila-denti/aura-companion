import { getProfile } from './store';

export type GenderTheme = 'feminine' | 'masculine' | 'neutral';

export function getGenderTheme(): GenderTheme {
  const profile = getProfile();
  if (!profile) return 'feminine';
  if (profile.gender === 'male') return 'masculine';
  if (profile.gender === 'other') return 'neutral';
  return 'feminine';
}

export function applyGenderTheme() {
  const theme = getGenderTheme();
  const root = document.documentElement;

  // Remove all theme classes
  root.classList.remove('theme-feminine', 'theme-masculine', 'theme-neutral');
  root.classList.add(`theme-${theme}`);
}
