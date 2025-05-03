"use client";

import { motion } from "framer-motion";
import { AnimatedWeatherIcon } from "./AnimatedWeatherIcon";
import { GlassCard } from "../UI/GlassCard";

interface ForecastItemProps {
  day: string;
  date: string;
  iconCode: string;
  tempMax: number | string;
  tempMin: number | string;
  description: string;
  index: number;
}

export function ForecastItem({
  day,
  date,
  iconCode,
  tempMax,
  tempMin,
  description,
  index
}: ForecastItemProps) {
  return (
    <motion.div
      className="flex flex-col items-center p-4 rounded-lg bg-card/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.1 + (index * 0.05)
      }}
      whileHover={{ scale: 1.03 }}
    >
      <p className="font-semibold text-center">{day}</p>
      <p className="text-xs text-muted-foreground mb-2">{date}</p>
      
      <div className="my-2">
        <AnimatedWeatherIcon iconCode={iconCode} size="md" />
      </div>
      
      <p className="text-sm capitalize mb-2">{description}</p>
      
      <div className="flex justify-between w-full mt-1">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Min</p>
          <p className="text-sm">{tempMin}</p>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Max</p>
          <p className="text-sm font-semibold">{tempMax}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface WeatherForecastProps {
  title: string;
  subtitle?: string;
  forecasts: ForecastItemProps[];
  className?: string;
  delay?: number;
}

export function WeatherForecast({
  title,
  subtitle,
  forecasts,
  className = "",
  delay = 0
}: WeatherForecastProps) {
  return (
    <GlassCard className={className} delay={delay}>
      <div className="mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecasts.map((forecast, index) => (
          <ForecastItem
            key={`${forecast.day}-${index}`}
            {...forecast}
            index={index}
          />
        ))}
      </div>
    </GlassCard>
  );
}
