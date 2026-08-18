import { useRouter } from 'expo-router';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { useEntitlement } from '@/hooks/use-entitlement';
import { useTranslation } from '@/hooks/use-translation';
import { useAuthStore } from '@/stores/auth-store';
import { Text, View } from '@/tw';

export function Profile() {
  const router = useRouter();
  const { t } = useTranslation();
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
          <Text className="text-base font-semibold text-neutral-900 dark:text-white">{t('profile.plan')}</Text>
          <Badge label={isPro ? t('profile.pro') : t('profile.free')} variant={isPro ? 'accent' : 'neutral'} />
        </View>
        {!isPro && <Button label={t('profile.upgrade')} onPress={() => router.push('/paywall')} />}
      </Card>
    </Screen>
  );
}
