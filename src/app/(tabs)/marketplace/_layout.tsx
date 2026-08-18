import { Stack } from 'expo-router';

import { useTranslation } from '@/hooks/use-translation';

export default function MarketplaceLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('marketplace.title') }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
