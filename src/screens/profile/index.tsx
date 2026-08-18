import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { useEntitlement } from '@/hooks/use-entitlement';
import { useAuthStore } from '@/stores/auth-store';
import { Text, View } from '@/tw';

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Profile() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { isPro } = useEntitlement();

  if (!user) return null;

  return (
    <Screen className="px-6">
      <View className="items-center gap-3 pb-8 pt-10">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-600">
          <Text className="text-2xl font-bold text-white">{initials(user.name)}</Text>
        </View>
        <View className="items-center gap-0.5">
          <Text className="text-xl font-bold text-neutral-900 dark:text-white">{user.name}</Text>
          <Text className="text-base text-neutral-500 dark:text-neutral-400">{user.email}</Text>
        </View>
      </View>

      <View className="gap-3 rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-900">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-neutral-900 dark:text-white">Plan</Text>
          <Text className="text-base text-neutral-500 dark:text-neutral-400">{isPro ? 'Pro' : 'Free'}</Text>
        </View>
        {!isPro && <Button label="Upgrade to Pro" onPress={() => router.push('/paywall')} />}
      </View>
    </Screen>
  );
}
