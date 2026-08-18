import type { ComponentProps } from 'react';

import { Text, TextInput, View } from '@/tw';

interface TextFieldProps extends ComponentProps<typeof TextInput> {
  label: string;
  error?: string;
}

export function TextField({ label, error, className = '', ...inputProps }: TextFieldProps) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{label}</Text>
      <TextInput
        placeholderTextColor="#9ca3af"
        className={`h-12 rounded-xl border px-4 text-base text-neutral-900 dark:text-white ${
          error ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'
        } ${className}`}
        {...inputProps}
      />
      {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
    </View>
  );
}
