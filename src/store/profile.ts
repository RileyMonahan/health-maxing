import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nowIso } from '@/domain/ids';
import type { NotificationPrefs, UserProfile } from '@/domain/models';
import { appStorage, STORAGE_PREFIX } from '@/services/storage';

interface ProfileState {
  profile: UserProfile | null;
  notifications: NotificationPrefs;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  setNotifications: (patch: Partial<NotificationPrefs>) => void;
  reset: () => void;
}

const DEFAULT_NOTIFICATIONS: NotificationPrefs = { checkIn: true, workout: true, meals: false, coach: true };

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      notifications: DEFAULT_NOTIFICATIONS,
      setProfile: (profile) => set({ profile }),
      updateProfile: (patch) =>
        set((s) => (s.profile ? { profile: { ...s.profile, ...patch, updatedAt: nowIso() } } : s)),
      setNotifications: (patch) => set((s) => ({ notifications: { ...s.notifications, ...patch } })),
      reset: () => set({ profile: null, notifications: DEFAULT_NOTIFICATIONS }),
    }),
    { name: `${STORAGE_PREFIX}profile`, storage: appStorage, version: 1 },
  ),
);
