"use client";

import { createContext, useContext, useEffect } from "react";
import { useThemeStore, ThemeMode, ThemeStyle, MotionPreference, ContrastMode } from "@/store/themeStore";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  defaultStyle?: ThemeStyle;
  defaultMotion?: MotionPreference;
  defaultContrast?: ContrastMode;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  mode: ThemeMode;
  style: ThemeStyle;
  motion: MotionPreference;
  contrast: ContrastMode;
  setMode: (mode: ThemeMode) => void;
  setStyle: (style: ThemeStyle) => void;
  setMotion: (motion: MotionPreference) => void;
  setContrast: (contrast: ContrastMode) => void;
  isDark: boolean;
  isReducedMotion: boolean;
  isHighContrast: boolean;
};

const initialState: ThemeProviderState = {
  mode: "system",
  style: "default",
  motion: "full",
  contrast: "normal",
  setMode: () => null,
  setStyle: () => null,
  setMotion: () => null,
  setContrast: () => null,
  isDark: false,
  isReducedMotion: false,
  isHighContrast: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultStyle = "default",
  defaultMotion = "full",
  defaultContrast = "normal",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const {
    mode,
    style,
    motion,
    contrast,
    setMode,
    setStyle,
    setMotion,
    setContrast
  } = useThemeStore();

  // Initialize with defaults if needed
  useEffect(() => {
    if (mode === "system" && defaultTheme !== "system") {
      setMode(defaultTheme);
    }
    if (style === "default" && defaultStyle !== "default") {
      setStyle(defaultStyle);
    }
    if (motion === "full" && defaultMotion !== "full") {
      setMotion(defaultMotion);
    }
    if (contrast === "normal" && defaultContrast !== "normal") {
      setContrast(defaultContrast);
    }
  }, []);

  // Apply theme classes to document
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;

    // Handle light/dark mode
    root.classList.remove("light", "dark");

    let currentMode = mode;
    if (mode === "system" && enableSystem) {
      currentMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    root.classList.add(currentMode);

    // Handle theme style
    root.classList.remove("theme-default", "theme-neon", "theme-pastel");
    root.classList.add(`theme-${style}`);

    // Handle motion preference
    root.classList.remove("motion-full", "motion-reduced");
    root.classList.add(`motion-${motion}`);

    // Handle contrast mode
    root.classList.remove("contrast-normal", "contrast-high");
    root.classList.add(`contrast-${contrast}`);

  }, [mode, style, motion, contrast, enableSystem]);

  // Detect system preference changes
  useEffect(() => {
    if (!enableSystem || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (mode === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode, enableSystem]);

  // Detect reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => {
      if (motion === "system") {
        const root = window.document.documentElement;
        root.classList.remove("motion-full", "motion-reduced");
        root.classList.add(mediaQuery.matches ? "motion-reduced" : "motion-full");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [motion]);

  // Calculate derived states - safely check for window object
  const isDark =
    typeof window !== 'undefined' ? (
      mode === "dark" ||
      (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) : mode === "dark";

  const isReducedMotion =
    typeof window !== 'undefined' ? (
      motion === "reduced" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) : motion === "reduced";

  const isHighContrast = contrast === "high";

  const value = {
    mode,
    style,
    motion,
    contrast,
    setMode: (mode: ThemeMode) => {
      if (disableTransitionOnChange && typeof document !== 'undefined') {
        document.documentElement.classList.add("disable-transition");
        setTimeout(() => {
          document.documentElement.classList.remove("disable-transition");
        }, 0);
      }
      setMode(mode);
    },
    setStyle,
    setMotion,
    setContrast,
    isDark,
    isReducedMotion,
    isHighContrast,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

// Utility hook for accessing theme values with performance optimization
export const useThemeValue = () => {
  const { isDark, isReducedMotion, isHighContrast, style } = useTheme();
  return { isDark, isReducedMotion, isHighContrast, style };
};