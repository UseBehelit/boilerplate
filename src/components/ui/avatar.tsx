import { Text, View } from '@/tw';

type Size = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name: string;
  size?: Size;
  className?: string;
}

const containerBySize: Record<Size, string> = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
};

const textBySize: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  return (
    <View className={`items-center justify-center rounded-full bg-blue-600 ${containerBySize[size]} ${className}`}>
      <Text className={`font-bold text-white ${textBySize[size]}`}>{initials(name)}</Text>
    </View>
  );
}
