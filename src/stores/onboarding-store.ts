import { create } from 'zustand';

import { canReadStorageSync, storage } from '@/lib/mmkv';

const STORAGE_KEY = 'onboarding.completed';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasCompletedOnboarding: canReadStorageSync() ? (storage.getBoolean(STORAGE_KEY) ?? false) : false,
  completeOnboarding: () => {
    storage.set(STORAGE_KEY, true);
    set({ hasCompletedOnboarding: true });
  },
}));
