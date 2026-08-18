import type { ReactNode } from 'react';

import { Text, View } from '@/tw';

interface ListSectionProps {
  title: string;
  children: ReactNode;
}

export function ListSection({ title, children }: ListSectionProps) {
  return (
    <View className="gap-2">
      <Text className="text-xs font-semibold uppercase text-neutral-400 dark:text-neutral-500">{title}</Text>
      <View className="gap-px overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">{children}</View>
    </View>
  );
}
