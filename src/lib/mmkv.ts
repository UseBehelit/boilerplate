import { Platform } from 'react-native';
import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'boilerplate-storage' });

// On web, MMKV falls back to `localStorage`, which doesn't exist during
// server-side rendering (expo-router's static web output). Reading storage
// at module scope — e.g. to seed a store's initial state — must check this
// first, or SSR crashes with "Tried to access storage on the server".
export function canReadStorageSync() {
  return Platform.OS !== 'web' || typeof window !== 'undefined';
}
