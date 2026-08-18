import { useEffect } from 'react';
import { Appearance } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { applyColorScheme } from '@/lib/color-scheme';
import { useThemeStore } from '@/stores/theme-store';

/**
 * Syncs the app's resolved light/dark scheme (system, or the user's override
 * from theme-store) into react-native-css, which otherwise only tracks the OS
 * Appearance on its own and would ignore a forced light/dark preference.
 *
 * When a preference is forced, react-native-css's own Appearance listener
 * still fires on OS changes and resets to the system value — this re-asserts
 * the override immediately after, since it subscribes after react-native-css
 * does (it registers at import time, before this component ever mounts).
 */
export function ThemeSync() {
  const preference = useThemeStore((state) => state.preference);
  const scheme = useColorScheme();

  useEffect(() => {
    applyColorScheme(scheme);
    if (preference === 'system') return;

    const subscription = Appearance.addChangeListener(() => applyColorScheme(scheme));
    return () => subscription.remove();
  }, [scheme, preference]);

  return null;
}
