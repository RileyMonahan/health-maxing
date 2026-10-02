import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

// Single persistence adapter for every store. Swap this (or add a sync layer
// behind it) when moving data to a backend such as Supabase.
export const appStorage = createJSONStorage(() => AsyncStorage);

export const STORAGE_PREFIX = 'hm:';
