import type { ColorSchemeName } from 'react-native';
import { colorScheme } from 'react-native-css';

// Keeps Tailwind's `dark:` classes (resolved by react-native-css, which tracks
// the OS Appearance independently) in sync with the app's own light/dark logic.
export function applyColorScheme(scheme: ColorSchemeName) {
  colorScheme.set(scheme);
}
