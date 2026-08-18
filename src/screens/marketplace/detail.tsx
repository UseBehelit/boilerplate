import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { fetchMarketplaceItem } from '@/lib/demo-data';
import { Text, View } from '@/tw';

export function MarketplaceDetail({ id }: { id: string }) {
  const { data: item, isLoading } = useQuery({
    queryKey: ['marketplace-item', id],
    queryFn: () => fetchMarketplaceItem(id),
  });

  if (isLoading) {
    return (
      <Screen className="items-center justify-center">
        <ActivityIndicator />
      </Screen>
    );
  }

  if (!item) {
    return (
      <Screen>
        <EmptyState emoji="🔍" title="Item not found" description="This item may have been removed." />
      </Screen>
    );
  }

  return (
    <Screen className="px-6">
      <View className="flex-1 gap-4 pt-6">
        <Text className="text-7xl">{item.emoji}</Text>
        <Text className="text-2xl font-bold text-neutral-900 dark:text-white">{item.title}</Text>
        <Text className="text-xl font-semibold text-blue-600">{item.price}</Text>
        <Text className="text-base text-neutral-500 dark:text-neutral-400">{item.description}</Text>
      </View>
      <View className="pb-4">
        <Button label="Add to cart" onPress={() => {}} />
      </View>
    </Screen>
  );
}
