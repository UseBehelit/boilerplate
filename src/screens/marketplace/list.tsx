import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';

import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { fetchMarketplaceItems, type MarketplaceItem } from '@/lib/demo-data';
import { Text, View } from '@/tw';

export function MarketplaceList() {
  const router = useRouter();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['marketplace-items'],
    queryFn: fetchMarketplaceItems,
  });

  return (
    <Screen>
      <FlatList
        data={isLoading ? [] : items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, gap: 12 }}
        renderItem={({ item }) => <MarketplaceCard item={item} onPress={() => router.push(`/marketplace/${item.id}`)} />}
      />
    </Screen>
  );
}

function MarketplaceCard({ item, onPress }: { item: MarketplaceItem; onPress: () => void }) {
  return (
    <Card onPress={onPress} className="flex-row items-center gap-4">
      <Text className="text-3xl">{item.emoji}</Text>
      <View className="flex-1 gap-0.5">
        <Text className="text-base font-semibold text-neutral-900 dark:text-white">{item.title}</Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400" numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <Text className="text-base font-bold text-blue-600">{item.price}</Text>
    </Card>
  );
}
