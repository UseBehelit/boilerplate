function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface DashboardStat {
  key: string;
  label: string;
  value: string;
}

// Stand-in for a real API call — replace with your data source.
export async function fetchDashboardStats(): Promise<DashboardStat[]> {
  await wait(400);
  return [
    { key: 'orders', label: 'Orders', value: '128' },
    { key: 'revenue', label: 'Revenue', value: '$4.2k' },
    { key: 'active', label: 'Active users', value: '342' },
  ];
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  emoji: string;
  description: string;
}

const marketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Starter Kit',
    price: '$19',
    emoji: '🧰',
    description: 'Everything you need to bootstrap a new project, bundled together.',
  },
  {
    id: '2',
    title: 'Design Tokens',
    price: '$9',
    emoji: '🎨',
    description: 'A curated set of colors, spacing, and typography tokens.',
  },
  {
    id: '3',
    title: 'Icon Pack',
    price: '$5',
    emoji: '🧩',
    description: 'Hundreds of hand-crafted icons in a consistent style.',
  },
  {
    id: '4',
    title: 'API Template',
    price: '$29',
    emoji: '🔌',
    description: 'A ready-to-extend backend template with auth and billing wired up.',
  },
];

// Stand-in for a real API call — replace with your data source.
export async function fetchMarketplaceItems(): Promise<MarketplaceItem[]> {
  await wait(400);
  return marketplaceItems;
}

export async function fetchMarketplaceItem(id: string): Promise<MarketplaceItem | undefined> {
  await wait(300);
  return marketplaceItems.find((item) => item.id === id);
}
