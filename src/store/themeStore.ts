import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeStyle = 'default' | 'neon' | 'pastel';
export type MotionPreference = 'full' | 'reduced' | 'system';
export type ContrastMode = 'normal' | 'high';

interface ThemeState {
  mode: ThemeMode;
  style: ThemeStyle;
  motion: MotionPreference;
  contrast: ContrastMode;
  setMode: (mode: ThemeMode) => void;
  setStyle: (style: ThemeStyle) => void;
  setMotion: (motion: MotionPreference) => void;
  setContrast: (contrast: ContrastMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      style: 'default',
      motion: 'full',
      contrast: 'normal',
      setMode: (mode) => set({ mode }),
      setStyle: (style) => set({ style }),
      setMotion: (motion) => set({ motion }),
      setContrast: (contrast) => set({ contrast }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
