import { create } from 'zustand';

import { canReadStorageSync, storage } from '@/lib/mmkv';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme.preference';

function isThemePreference(value: string | undefined): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

function readStoredPreference(): ThemePreference {
  if (!canReadStorageSync()) return 'system';
  const raw = storage.getString(STORAGE_KEY);
  return isThemePreference(raw) ? raw : 'system';
}

interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  preference: readStoredPreference(),
  setPreference: (preference) => {
    storage.set(STORAGE_KEY, preference);
    set({ preference });
  },
}));
