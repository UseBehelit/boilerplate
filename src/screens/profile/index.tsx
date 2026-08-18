import { useRouter } from 'expo-router';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { useEntitlement } from '@/hooks/use-entitlement';
import { useAuthStore } from '@/stores/auth-store';
import { Text, View } from '@/tw';

export function Profile() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { isPro } = useEntitlement();

  if (!user) return null;

  return (
    <Screen className="px-6">
      <View className="items-center gap-3 pb-8 pt-10">
        <Avatar name={user.name} size="lg" />
        <View className="items-center gap-0.5">
          <Text className="text-xl font-bold text-neutral-900 dark:text-white">{user.name}</Text>
          <Text className="text-base text-neutral-500 dark:text-neutral-400">{user.email}</Text>
        </View>
      </View>

      <Card className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-neutral-900 dark:text-white">Plan</Text>
          <Badge label={isPro ? 'Pro' : 'Free'} variant={isPro ? 'accent' : 'neutral'} />
        </View>
        {!isPro && <Button label="Upgrade to Pro" onPress={() => router.push('/paywall')} />}
      </Card>
    </Screen>
  );
}
