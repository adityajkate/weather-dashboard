"use client";

import { useCallback, useMemo, memo } from "react";
import { useThemeValue } from "@/components/ThemeProvider";
import dynamic from "next/dynamic";
import { loadSlim } from "tsparticles-slim";
import { Engine } from "tsparticles-engine";

// Dynamically import tsparticles to avoid SSR issues
const Particles = dynamic(() => import("react-tsparticles").then((mod) => mod.Particles), {
  ssr: false,
  loading: () => null,
});

type WeatherType = "sunny" | "rainy" | "cloudy" | "snowy" | "stormy" | "clear";

interface WeatherParticlesProps {
  weatherType: WeatherType;
  intensity?: "low" | "medium" | "high";
}

// Component for weather particles
function WeatherParticlesComponent({
  weatherType,
  intensity = "medium"
}: WeatherParticlesProps) {
  const { isDark, isReducedMotion } = useThemeValue();

  // Generate a unique key for the particles component
  const particleKey = useMemo(() =>
    `weather-particles-${weatherType}-${intensity}-${isDark ? "dark" : "light"}`,
    [weatherType, intensity, isDark]
  );

  // Initialize the tsparticles engine
  const particlesInit = useCallback(async (engine: Engine) => {
    try {
      await loadSlim(engine);
    } catch (error) {
      console.error("Failed to initialize particles:", error);
    }
  }, []);

  // Skip rendering if reduced motion is enabled or if we're in SSR
  if (isReducedMotion || typeof window === 'undefined') {
    return null;
  }

  // Memoize particle options to avoid recalculation on each render
  const particleOptions = useMemo(() => {
    // Get particle count based on intensity
    const particleCount = (() => {
      switch (intensity) {
        case "low": return 20;
        case "medium": return 30;
        case "high": return 40;
        default: return 30;
      }
    })();

    const baseOptions = {
      background: {
        color: {
          value: "transparent",
        },
      },
      fullScreen: false,
      particles: {
        number: {
          value: particleCount,
        },
        move: {
          enable: true,
          speed: 1,
        },
        opacity: {
          value: 0.5,
        },
        size: {
          value: 3,
        },
      },
    };

    switch (weatherType) {
      case "sunny":
        return {
          ...baseOptions,
          particles: {
            ...baseOptions.particles,
            color: {
              value: isDark ? "#ffcc00" : "#ff9500",
            },
            move: {
              ...baseOptions.particles.move,
              direction: "top" as const,
            },
          },
        };

      case "rainy":
        return {
          ...baseOptions,
          particles: {
            ...baseOptions.particles,
            color: {
              value: isDark ? "#90e0ef" : "#0077b6",
            },
            move: {
              ...baseOptions.particles.move,
              direction: "bottom" as const,
              speed: 8,
              straight: true,
            },
          },
        };

      case "snowy":
        return {
          ...baseOptions,
          particles: {
            ...baseOptions.particles,
            color: {
              value: "#ffffff",
            },
            move: {
              ...baseOptions.particles.move,
              direction: "bottom" as const,
              speed: 1.5,
            },
          },
        };

      case "stormy":
        return {
          ...baseOptions,
          particles: {
            ...baseOptions.particles,
            color: {
              value: ["#9a8c98", "#4a4e69", "#22223b"],
            },
            move: {
              ...baseOptions.particles.move,
              direction: "bottomLeft" as const,
              speed: 5,
            },
          },
        };

      case "cloudy":
        return {
          ...baseOptions,
          particles: {
            ...baseOptions.particles,
            color: {
              value: isDark ? "#9CA3AF" : "#D1D5DB",
            },
            move: {
              ...baseOptions.particles.move,
              direction: "right" as const,
            },
          },
        };

      default:
        return baseOptions;
    }
  }, [weatherType, intensity, isDark]);

  return (
    <Particles
      id={particleKey}
      init={particlesInit}
      options={particleOptions}
      className="absolute inset-0 -z-10"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        willChange: "transform, opacity",
      }}
    />
  );
}

// Export memoized component
const WeatherParticles = memo(WeatherParticlesComponent);
export { WeatherParticles };
