import Constants from 'expo-constants';
import * as Localization from 'expo-localization';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { type ReactNode, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { useAuthStore } from '@/stores/auth-store';
import { Pressable, Text, View } from '@/tw';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-xs font-semibold uppercase text-neutral-400 dark:text-neutral-500">{title}</Text>
      <View className="gap-px overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">{children}</View>
    </View>
  );
}

function Row({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between bg-white px-4 py-3 active:opacity-60 dark:bg-black">
      <Text className="text-base text-neutral-900 dark:text-white">{label}</Text>
      <Text className={`text-base ${onPress ? 'font-semibold text-blue-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
        {value}
      </Text>
    </Pressable>
  );
}

export function Settings() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setNotificationsEnabled(status === 'granted');
    });
  }, []);

  async function handleEnableNotifications() {
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
      <Section title="Notifications">
        <Row
          label="Push notifications"
          value={notificationsEnabled ? 'On' : 'Turn on'}
          onPress={notificationsEnabled ? undefined : handleEnableNotifications}
        />
      </Section>

      <Section title="About">
        <Row label="Language" value={locale} />
        <Row label="Version" value={version} />
      </Section>

      <Button label="Sign out" variant="secondary" onPress={handleSignOut} />
    </Screen>
  );
}
