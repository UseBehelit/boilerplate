import { Button } from '@/components/ui/button';
import { Text, View } from '@/tw';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ emoji = '🗒️', title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-2 px-8">
      <Text className="text-5xl">{emoji}</Text>
      <Text className="text-center text-lg font-semibold text-neutral-900 dark:text-white">{title}</Text>
      {description ? (
        <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} variant="secondary" onPress={onAction} className="mt-2" />
      ) : null}
    </View>
  );
}
