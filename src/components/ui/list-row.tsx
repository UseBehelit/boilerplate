import type { ReactNode } from 'react';

import { Pressable, Text } from '@/tw';

interface ListRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  right?: ReactNode;
}

export function ListRow({ label, value, onPress, right }: ListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between bg-white px-4 py-3 active:opacity-60 dark:bg-black">
      <Text className="text-base text-neutral-900 dark:text-white">{label}</Text>
      {right ??
        (value ? (
          <Text className={`text-base ${onPress ? 'font-semibold text-blue-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
            {value}
          </Text>
        ) : null)}
    </Pressable>
  );
}
