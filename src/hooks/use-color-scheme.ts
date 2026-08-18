import { useColorScheme as useRNColorScheme } from 'react-native';

import { useThemeStore } from '@/stores/theme-store';

export function useColorScheme(): 'light' | 'dark' {
  const preference = useThemeStore((state) => state.preference);
  const systemScheme = useRNColorScheme();

  if (preference !== 'system') return preference;
  return systemScheme === 'dark' ? 'dark' : 'light';
}
