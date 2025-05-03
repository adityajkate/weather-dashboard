"use client";

import { useCallback, useMemo, memo } from "react";
import { useThemeValue } from "@/components/ThemeProvider";
import dynamic from "next/dynamic";

// Dynamically import tsparticles to avoid SSR issues
const Particles = dynamic(() => import("react-tsparticles").then((mod) => mod.Particles), {
  ssr: false,
  loading: () => null,
});

// Import tsparticles engine separately
const loadSlimModule = dynamic(() =>
  import("tsparticles-slim").then((mod) => {
    return { loadSlim: mod.loadSlim };
  }), {
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
  const particlesInit = useCallback(async (engine: any) => {
    try {
      if (loadSlimModule && loadSlimModule.loadSlim) {
        await loadSlimModule.loadSlim(engine);
      }
    } catch (error) {
      console.error("Failed to initialize particles:", error);
    }
  }, []);

  // Skip particles if reduced motion is enabled or if we're in SSR
  if (isReducedMotion || typeof window === 'undefined') {
    return null;
  }

  // Get particle count based on intensity
  const getParticleCount = () => {
    switch (intensity) {
      case "low": return 20;
      case "medium": return 30;
      case "high": return 40;
      default: return 30;
    }
  };

  // Memoize particle configuration
  const particlesOptions = useMemo(() => {
    const baseConfig = {
      fpsLimit: 60,
      particles: {
        number: {
          value: getParticleCount(),
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#ffffff"
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: false,
          },
          onclick: {
            enable: false,
          },
          resize: true
        }
      },
      retina_detect: true,
      background: {
        color: {
          value: "transparent"
        }
      }
    };

    // Customize based on weather type
    switch (weatherType) {
      case "sunny":
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            color: {
              value: isDark ? "#ffcc00" : "#ff9500"
            },
            shape: {
              type: "circle",
            },
            size: {
              value: 2,
              random: true,
            },
            opacity: {
              value: 0.6,
              random: true,
            },
            move: {
              ...baseConfig.particles.move,
              speed: 1,
              direction: "top",
            }
          }
        };

      case "rainy":
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            color: {
              value: isDark ? "#90e0ef" : "#0077b6"
            },
            shape: {
              type: "line",
            },
            size: {
              value: 8,
              random: false,
            },
            opacity: {
              value: 0.5,
              random: false,
            },
            move: {
              ...baseConfig.particles.move,
              speed: 8,
              direction: "bottom",
              straight: true,
            }
          }
        };

      case "snowy":
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            color: {
              value: "#ffffff"
            },
            shape: {
              type: "circle",
            },
            size: {
              value: 3,
              random: true,
            },
            opacity: {
              value: 0.8,
              random: true,
            },
            move: {
              ...baseConfig.particles.move,
              speed: 1.5,
              direction: "bottom",
              straight: false,
            }
          }
        };

      case "stormy":
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            color: {
              value: ["#9a8c98", "#4a4e69", "#22223b"]
            },
            shape: {
              type: "circle",
            },
            size: {
              value: 4,
              random: true,
            },
            opacity: {
              value: 0.7,
              random: true,
            },
            move: {
              ...baseConfig.particles.move,
              speed: 5,
              direction: "bottom-left",
              straight: false,
            }
          }
        };

      case "cloudy":
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            color: {
              value: isDark ? "#9CA3AF" : "#D1D5DB"
            },
            shape: {
              type: "circle",
            },
            size: {
              value: 6,
              random: true,
            },
            opacity: {
              value: 0.3,
              random: true,
            },
            move: {
              ...baseConfig.particles.move,
              speed: 1,
              direction: "right",
              straight: false,
            }
          }
        };

      default:
        return baseConfig;
    }
  }, [weatherType, intensity, isDark]);

  return (
    <Particles
      id={particleKey}
      init={particlesInit}
      options={particlesOptions}
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
