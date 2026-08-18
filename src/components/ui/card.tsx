import type { ReactNode } from 'react';

import { Pressable } from '@/tw';

interface CardProps {
  children?: ReactNode;
  onPress?: () => void;
  className?: string;
}

export function Card({ children, onPress, className = '' }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-900 ${onPress ? 'active:opacity-70' : ''} ${className}`}>
      {children}
    </Pressable>
  );
}
