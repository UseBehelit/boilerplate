import Constants from 'expo-constants';
import * as Localization from 'expo-localization';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Switch } from 'react-native';

import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { ListSection } from '@/components/ui/list-section';
import { Screen } from '@/components/ui/screen';
import { useAuthStore } from '@/stores/auth-store';

export function Settings() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
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

  const locale = Localization.getLocales()[0]?.languageTag ?? 'en-US';
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen className="gap-6 px-6 pt-4">
      <ListSection title="Notifications">
        <ListRow
          label="Push notifications"
          right={<Switch value={notificationsEnabled} onValueChange={handleToggleNotifications} />}
        />
      </ListSection>

      <ListSection title="About">
        <ListRow label="Language" value={locale} />
        <ListRow label="Version" value={version} />
      </ListSection>

      <Button label="Sign out" variant="secondary" onPress={handleSignOut} />
    </Screen>
  );
}
