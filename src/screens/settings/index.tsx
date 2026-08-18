import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Switch } from 'react-native';

import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { ListSection } from '@/components/ui/list-section';
import { Screen } from '@/components/ui/screen';
import { useTranslation } from '@/hooks/use-translation';
import type { TranslationKey } from '@/i18n/resources';
import { useAuthStore } from '@/stores/auth-store';
import { type LocalePreference, useLocaleStore } from '@/stores/locale-store';
import { type ThemePreference, useThemeStore } from '@/stores/theme-store';

const themeOptions: { value: ThemePreference; labelKey: TranslationKey }[] = [
  { value: 'system', labelKey: 'common.system' },
  { value: 'light', labelKey: 'settings.themeLight' },
  { value: 'dark', labelKey: 'settings.themeDark' },
];

// Only 'en' is registered in src/i18n/resources.ts right now — add more
// locales there (and a row here) as translations are added.
const languageOptions: { value: LocalePreference; labelKey: TranslationKey }[] = [
  { value: 'system', labelKey: 'common.system' },
  { value: 'en', labelKey: 'settings.languageEnglish' },
];

export function Settings() {
  const router = useRouter();
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);
  const themePreference = useThemeStore((state) => state.preference);
  const setThemePreference = useThemeStore((state) => state.setPreference);
  const localePreference = useLocaleStore((state) => state.preference);
  const setLocalePreference = useLocaleStore((state) => state.setPreference);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setNotificationsEnabled(status === 'granted');
    });
  }, []);

  async function handleToggleNotifications(next: boolean) {
    if (!next) {
      // OS permissions can't be revoked from the app — this just reflects local intent.
      setNotificationsEnabled(false);
      return;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationsEnabled(status === 'granted');
  }

  function handleSignOut() {
    logout();
    router.replace('/(auth)/login');
  }

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen className="gap-6 px-6 pt-4">
      <ListSection title={t('settings.appearance')}>
        {themeOptions.map((option) => (
          <ListRow
            key={option.value}
            label={t(option.labelKey)}
            onPress={() => setThemePreference(option.value)}
            right={
              themePreference === option.value ? (
                <Ionicons name="checkmark" size={20} color="#2563eb" />
              ) : undefined
            }
          />
        ))}
      </ListSection>

      <ListSection title={t('settings.language')}>
        {languageOptions.map((option) => (
          <ListRow
            key={option.value}
            label={t(option.labelKey)}
            onPress={() => setLocalePreference(option.value)}
            right={
              localePreference === option.value ? (
                <Ionicons name="checkmark" size={20} color="#2563eb" />
              ) : undefined
            }
          />
        ))}
      </ListSection>

      <ListSection title={t('settings.notifications')}>
        <ListRow
          label={t('settings.pushNotifications')}
          right={<Switch value={notificationsEnabled} onValueChange={handleToggleNotifications} />}
        />
      </ListSection>

      <ListSection title={t('settings.about')}>
        <ListRow label={t('settings.version')} value={version} />
      </ListSection>

      <Button label={t('settings.signOut')} variant="secondary" onPress={handleSignOut} />
    </Screen>
  );
}
