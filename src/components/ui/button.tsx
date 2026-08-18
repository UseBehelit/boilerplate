import { ActivityIndicator } from 'react-native';

import { Pressable, Text } from '@/tw';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const containerByVariant: Record<Variant, string> = {
  primary: 'bg-blue-600 active:bg-blue-700',
  secondary: 'bg-neutral-100 dark:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700',
  ghost: 'bg-transparent active:bg-neutral-100 dark:active:bg-neutral-900',
};

const labelByVariant: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-neutral-900 dark:text-white',
  ghost: 'text-blue-600',
};

export function Button({ label, onPress, variant = 'primary', loading, disabled, className = '' }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`h-12 flex-row items-center justify-center rounded-xl px-4 ${containerByVariant[variant]} ${isDisabled ? 'opacity-50' : ''} ${className}`}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#2563eb'} />
      ) : (
        <Text className={`text-base font-semibold ${labelByVariant[variant]}`}>{label}</Text>
      )}
    </Pressable>
  );
}
