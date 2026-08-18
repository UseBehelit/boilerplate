import { Text } from '@/tw';

type Variant = 'neutral' | 'accent';

interface BadgeProps {
  label: string;
  variant?: Variant;
  className?: string;
}

const classesByVariant: Record<Variant, string> = {
  neutral: 'bg-neutral-200 dark:bg-neutral-700',
  accent: 'bg-blue-600',
};

const textByVariant: Record<Variant, string> = {
  neutral: 'text-neutral-700 dark:text-neutral-200',
  accent: 'text-white',
};

export function Badge({ label, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <Text
      className={`self-start rounded-full px-2.5 py-1 text-xs font-semibold ${classesByVariant[variant]} ${textByVariant[variant]} ${className}`}>
      {label}
    </Text>
  );
}
