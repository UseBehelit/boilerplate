import { useLocalSearchParams } from 'expo-router';

import { MarketplaceDetail } from '@/screens/marketplace/detail';

export default function MarketplaceItemRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <MarketplaceDetail id={id} />;
}
