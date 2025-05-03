"use client";

import { motion } from "framer-motion";
import { ReactNode, memo } from "react";
import { useThemeValue } from "@/components/ThemeProvider";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  animateOnHover?: boolean;
  animateOnMount?: boolean;
  delay?: number;
  weatherReactive?: boolean;
  weatherType?: "sunny" | "rainy" | "cloudy" | "snowy" | "stormy" | "clear";
}

function GlassCardComponent({
  children,
  className = "",
  interactive = false,
  animateOnHover = false,
  animateOnMount = true,
  delay = 0,
  weatherReactive = false,
  weatherType = "clear"
}: GlassCardProps) {
  const { isReducedMotion, style } = useThemeValue();

  const baseClasses = "glass-card p-6 overflow-hidden";
  const interactiveClasses = interactive ? "cursor-pointer" : "";

  // Add weather-reactive class if enabled
  const weatherClasses = weatherReactive ? `weather-reactive weather-${weatherType}` : "";

  // Disable animations if reduced motion is preferred
  const shouldAnimate = animateOnMount && !isReducedMotion;
  const shouldHoverAnimate = animateOnHover && !isReducedMotion;

  // Apply theme-specific styles
  const themeClasses = style !== "default" ? `theme-${style}-card` : "";

  return (
    <motion.div
      className={`${baseClasses} ${interactiveClasses} ${weatherClasses} ${themeClasses} ${className}`}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : undefined}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: delay * 0.1
      }}
      whileHover={
        shouldHoverAnimate
          ? {
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }
          : undefined
      }
      whileTap={interactive && !isReducedMotion ? { scale: 0.98 } : undefined}
      style={{
        willChange: shouldAnimate || shouldHoverAnimate ? "transform, opacity" : "auto"
      }}
    >
      {children}
    </motion.div>
  );
}

// Export memoized component for better performance
export const GlassCard = memo(GlassCardComponent);
