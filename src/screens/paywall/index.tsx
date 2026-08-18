import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import RevenueCatUI from 'react-native-purchases-ui';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { useTranslation } from '@/hooks/use-translation';
import { isPurchasesConfigured } from '@/lib/purchases';
import { Text } from '@/tw';

export function Paywall() {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  if (!isPurchasesConfigured()) {
    return (
      <Screen className="items-center justify-center gap-4 px-6">
        <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
          {t('paywall.notConfigured')}
        </Text>
        <Button label={t('common.close')} variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <RevenueCatUI.Paywall
      style={{ flex: 1 }}
      onDismiss={() => router.back()}
      onPurchaseCompleted={() => {
        queryClient.invalidateQueries({ queryKey: ['entitlement'] });
        router.back();
      }}
    />
  );
}
