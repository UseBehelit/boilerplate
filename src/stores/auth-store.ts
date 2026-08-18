import { create } from 'zustand';

import { canReadStorageSync, storage } from '@/lib/mmkv';
import { configurePurchases } from '@/lib/purchases';

const STORAGE_KEY = 'auth.user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isSubmitting: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

function readStoredUser(): AuthUser | null {
  if (!canReadStorageSync()) return null;
  const raw = storage.getString(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

function persistUser(user: AuthUser) {
  storage.set(STORAGE_KEY, JSON.stringify(user));
  configurePurchases(user.id);
}

// Stand-in for a real backend call — replace with your API client.
async function fakeAuthRequest<T>(result: T, { fail = false }: { fail?: boolean } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (fail) throw new Error('Invalid email or password');
  return result;
}

const initialUser = readStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: initialUser !== null,
  isSubmitting: false,
  error: null,

  login: async (email, password) => {
    set({ isSubmitting: true, error: null });
    try {
      const user = await fakeAuthRequest(
        { id: email, name: email.split('@')[0], email },
        { fail: !email || !password },
      );
      persistUser(user);
      set({ user, isAuthenticated: true, isSubmitting: false });
    } catch (error) {
      set({ isSubmitting: false, error: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ isSubmitting: true, error: null });
    try {
      const user = await fakeAuthRequest(
        { id: email, name, email },
        { fail: !name || !email || !password },
      );
      persistUser(user);
      set({ user, isAuthenticated: true, isSubmitting: false });
    } catch (error) {
      set({ isSubmitting: false, error: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  },

  logout: () => {
    storage.remove(STORAGE_KEY);
    set({ user: null, isAuthenticated: false });
  },
}));
