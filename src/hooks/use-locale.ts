import { useLocales } from 'expo-localization';

import { defaultLocale, isSupportedLocale, type Locale } from '@/i18n/resources';
import { useLocaleStore } from '@/stores/locale-store';

export function useLocale(): Locale {
  const preference = useLocaleStore((state) => state.preference);
  const systemLocales = useLocales();

  if (preference !== 'system') return preference;

  const deviceCode = systemLocales[0]?.languageCode;
  return deviceCode && isSupportedLocale(deviceCode) ? deviceCode : defaultLocale;
}
