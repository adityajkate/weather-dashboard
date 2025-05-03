"use client";

import { motion } from "framer-motion";
import { AnimatedWeatherIcon } from "./AnimatedWeatherIcon";
import { WeatherParticles } from "./WeatherParticles";
import { GlassCard } from "@/components/UI/GlassCard";
import { useThemeValue } from "@/components/ThemeProvider";
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline";

interface CurrentWeatherProps {
  cityName: string;
  countryCode: string;
  date: string;
  time: string;
  temperature: number | string;
  feelsLike: number | string;
  description: string;
  iconCode: string;
  high: number | string;
  low: number | string;
  humidity: number | string;
  windSpeed: number | string;
  windDirection: number | string;
  pressure: number | string;
  visibility: number | string;
  sunrise: string;
  sunset: string;
  units: "metric" | "imperial";
  className?: string;
}

export function CurrentWeather({
  cityName,
  countryCode,
  date,
  time,
  temperature,
  feelsLike,
  description,
  iconCode,
  high,
  low,
  humidity,
  windSpeed,
  windDirection,
  pressure,
  visibility,
  sunrise,
  sunset,
  units,
  className = ""
}: CurrentWeatherProps) {
  const { isReducedMotion } = useThemeValue();
  // Determine weather type for particles
  const getWeatherType = () => {
    const code = iconCode.substring(0, 2);
    if (code === "01") return "sunny";
    if (code === "02" || code === "03" || code === "04") return "cloudy";
    if (code === "09" || code === "10") return "rainy";
    if (code === "11") return "stormy";
    if (code === "13") return "snowy";
    return "clear";
  };

  const weatherType = getWeatherType();

  // Determine temperature unit
  const tempUnit = units === "metric" ? "°C" : "°F";
  const speedUnit = units === "metric" ? "m/s" : "mph";

  // Determine weather condition class
  const getWeatherClass = () => {
    const code = iconCode.substring(0, 2);
    if (code === "01") return "weather-card-sunny";
    if (code === "02" || code === "03" || code === "04") return "weather-card-cloudy";
    if (code === "09" || code === "10") return "weather-card-rainy";
    if (code === "11") return "weather-card-stormy";
    if (code === "13") return "weather-card-snowy";
    return "weather-card-sunny";
  };

  const weatherClass = getWeatherClass();

  // Animation settings
  const shouldAnimate = !isReducedMotion;
  const animationProps = shouldAnimate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Background particles */}
      <WeatherParticles weatherType={weatherType} intensity="low" />

      {/* Main content */}
      <GlassCard
        className="p-0 overflow-visible"
        weatherReactive={true}
        weatherType={weatherType}
        animateOnMount={shouldAnimate}
      >
        <div className={`${weatherClass} p-8 relative z-10`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Location and basic info */}
            <motion.div
              className="animate-slide-up"
              {...animationProps}
              transition={{
                ...animationProps.transition,
                delay: 0.1
              }}
              style={{ willChange: shouldAnimate ? 'transform, opacity' : 'auto' }}
            >
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <h2 className="text-2xl font-bold">{cityName}, {countryCode}</h2>
            </div>

            <div className="flex items-center mt-2 text-white/80">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <p className="text-sm mr-3">{date}</p>
              <ClockIcon className="h-4 w-4 mr-1" />
              <p className="text-sm">{time}</p>
            </div>

            <div className="flex items-center mt-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-md"></div>
                <AnimatedWeatherIcon iconCode={iconCode} size="xl" />
              </div>
              <div className="ml-4">
                <div className="flex items-start">
                  <p className="text-6xl font-bold">{temperature}</p>
                  <span className="text-2xl mt-1">{tempUnit}</span>
                </div>
                <p className="capitalize text-lg mt-1">{description}</p>
                <p className="text-sm mt-1">Feels like {feelsLike}{tempUnit}</p>
              </div>
            </div>

            <div className="flex mt-4 space-x-4">
              <div className="flex items-center">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span className="font-medium">{high}{tempUnit}</span>
              </div>
              <div className="flex items-center">
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                <span className="font-medium">{low}{tempUnit}</span>
              </div>
            </div>
          </motion.div>

          {/* Weather details */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-4 mt-4 md:mt-0"
            {...animationProps}
            transition={{
              ...animationProps.transition,
              delay: 0.2
            }}
            style={{ willChange: shouldAnimate ? 'transform, opacity' : 'auto' }}
          >
            <div className="glass p-4 rounded-lg flex flex-col items-center">
              <p className="text-sm text-white/70 mb-1">Humidity</p>
              <p className="text-xl font-semibold">{humidity}%</p>
            </div>
            <div className="glass p-4 rounded-lg flex flex-col items-center">
              <p className="text-sm text-white/70 mb-1">Wind</p>
              <p className="text-xl font-semibold">{windSpeed} {speedUnit}</p>
            </div>
            <div className="glass p-4 rounded-lg flex flex-col items-center">
              <p className="text-sm text-white/70 mb-1">Pressure</p>
              <p className="text-xl font-semibold">{pressure} hPa</p>
            </div>
            <div className="glass p-4 rounded-lg flex flex-col items-center">
              <p className="text-sm text-white/70 mb-1">Visibility</p>
              <p className="text-xl font-semibold">{visibility} km</p>
            </div>
          </motion.div>
        </div>

        {/* Sunrise/Sunset */}
        <motion.div
          className="flex justify-between mt-8"
          {...animationProps}
          transition={{
            ...animationProps.transition,
            delay: 0.3
          }}
          style={{ willChange: shouldAnimate ? 'transform, opacity' : 'auto' }}
        >
          <div className="glass rounded-lg px-6 py-3 flex-1 mr-4 text-center">
            <p className="text-sm text-white/70 mb-1">Sunrise</p>
            <p className="text-lg font-semibold">{sunrise}</p>
          </div>
          <div className="glass rounded-lg px-6 py-3 flex-1 text-center">
            <p className="text-sm text-white/70 mb-1">Sunset</p>
            <p className="text-lg font-semibold">{sunset}</p>
          </div>
        </motion.div>
      </div>
      </GlassCard>
    </div>
  );
}
