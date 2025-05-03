"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedWeatherIcon } from "./AnimatedWeatherIcon";

type WeatherCondition = "sunny" | "rainy" | "cloudy" | "snowy" | "stormy" | "clear";

interface WeatherCardProps {
  title: string;
  subtitle?: string;
  iconCode: string;
  condition: WeatherCondition;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  delay?: number;
}

export function WeatherCard({
  title,
  subtitle,
  iconCode,
  condition,
  children,
  className = "",
  interactive = false,
  delay = 0
}: WeatherCardProps) {
  // Map condition to class name
  const conditionClassMap: Record<WeatherCondition, string> = {
    sunny: "weather-card-sunny",
    rainy: "weather-card-rainy",
    cloudy: "weather-card-cloudy",
    snowy: "weather-card-snowy",
    stormy: "weather-card-stormy",
    clear: "weather-card-sunny"
  };
  
  const cardClass = conditionClassMap[condition] || "weather-card-cloudy";
  
  return (
    <motion.div
      className={`weather-card ${cardClass} ${className} ${interactive ? "interactive-card" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: delay * 0.1
      }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
          </div>
          <AnimatedWeatherIcon iconCode={iconCode} size="md" />
        </div>
        
        <div className="weather-card-content">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
