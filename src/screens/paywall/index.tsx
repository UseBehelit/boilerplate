import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import RevenueCatUI from 'react-native-purchases-ui';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { isPurchasesConfigured } from '@/lib/purchases';
import { Text } from '@/tw';

export function Paywall() {
  const router = useRouter();
  const queryClient = useQueryClient();

  if (!isPurchasesConfigured()) {
    return (
      <Screen className="items-center justify-center gap-4 px-6">
        <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
          Set EXPO_PUBLIC_REVENUECAT_IOS_KEY / EXPO_PUBLIC_REVENUECAT_ANDROID_KEY to enable the paywall.
        </Text>
        <Button label="Close" variant="secondary" onPress={() => router.back()} />
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
