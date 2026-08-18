import { useQuery } from '@tanstack/react-query';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { useTranslation } from '@/hooks/use-translation';
import { fetchDashboardStats } from '@/lib/demo-data';
import { useAuthStore } from '@/stores/auth-store';
import { Text, View } from '@/tw';

export function Home() {
  const { t } = useTranslation();
  const name = useAuthStore((state) => state.user?.name ?? 'there');
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });
  const sheetRef = useRef<BottomSheet>(null);

  return (
    <Screen className="px-6">
      <View className="gap-1 pt-4">
        <Text className="text-3xl font-bold text-neutral-900 dark:text-white">{t('home.greeting', { name })}</Text>
        <Text className="text-base text-neutral-500 dark:text-neutral-400">{t('home.subtitle')}</Text>
      </View>

      <View className="mt-6 flex-row flex-wrap gap-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Card key={i} className="h-24 flex-1 basis-1/3" />)
          : stats.map((stat) => (
              <Card key={stat.key} className="h-24 flex-1 basis-1/3 justify-between">
                <Text className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{stat.label}</Text>
                <Text className="text-xl font-bold text-neutral-900 dark:text-white">{stat.value}</Text>
              </Card>
            ))}
      </View>

      <View className="mt-6">
        <Button label={t('home.viewDetails')} variant="secondary" onPress={() => sheetRef.current?.expand()} />
      </View>

      <BottomSheet ref={sheetRef} index={-1} snapPoints={['40%']} enablePanDownToClose>
        <BottomSheetView>
          <View className="gap-3 px-6 pb-8 pt-2">
            <Text className="text-xl font-bold text-neutral-900 dark:text-white">{t('home.sheetTitle')}</Text>
            <Text className="text-base text-neutral-500 dark:text-neutral-400">{t('home.sheetDescription')}</Text>
            <Button label={t('common.close')} variant="ghost" onPress={() => sheetRef.current?.close()} />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Screen>
  );
}
