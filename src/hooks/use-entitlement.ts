import { useQuery } from '@tanstack/react-query';

import { fetchIsPro } from '@/lib/purchases';

export function useEntitlement() {
  const { data: isPro = false, ...rest } = useQuery({
    queryKey: ['entitlement', 'pro'],
    queryFn: fetchIsPro,
  });

  return { isPro, ...rest };
}
