import { create } from 'zustand';

import { canReadStorageSync, storage } from '@/lib/mmkv';
import { isSupportedLocale, type Locale } from '@/i18n/resources';

export type LocalePreference = 'system' | Locale;

const STORAGE_KEY = 'locale.preference';

function isLocalePreference(value: string | undefined): value is LocalePreference {
  return value === 'system' || (value !== undefined && isSupportedLocale(value));
}

function readStoredPreference(): LocalePreference {
  if (!canReadStorageSync()) return 'system';
  const raw = storage.getString(STORAGE_KEY);
  return isLocalePreference(raw) ? raw : 'system';
}

interface LocaleState {
  preference: LocalePreference;
  setPreference: (preference: LocalePreference) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  preference: readStoredPreference(),
  setPreference: (preference) => {
    storage.set(STORAGE_KEY, preference);
    set({ preference });
  },
}));
