"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  CloudIcon,
  SunIcon,
  MoonIcon,
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

type WeatherIconType =
  | "01d" | "01n" // clear sky
  | "02d" | "02n" // few clouds
  | "03d" | "03n" // scattered clouds
  | "04d" | "04n" // broken clouds
  | "09d" | "09n" // shower rain
  | "10d" | "10n" // rain
  | "11d" | "11n" // thunderstorm
  | "13d" | "13n" // snow
  | "50d" | "50n" // mist
  | string; // fallback for any other icon code

interface AnimatedWeatherIconProps {
  iconCode: WeatherIconType;
  size?: "sm" | "md" | "lg" | "xl";
  useCustomIcon?: boolean;
}

export function AnimatedWeatherIcon({
  iconCode,
  size = "md",
  useCustomIcon = true
}: AnimatedWeatherIconProps) {
  // Size mapping
  const sizeMap = {
    sm: { icon: 24, container: "h-8 w-8" },
    md: { icon: 40, container: "h-12 w-12" },
    lg: { icon: 64, container: "h-20 w-20" },
    xl: { icon: 96, container: "h-28 w-28" }
  };

  const iconSize = sizeMap[size].icon;
  const containerClass = sizeMap[size].container;

  // If using OpenWeatherMap icons
  if (!useCustomIcon) {
    return (
      <div className={`relative ${containerClass}`}>
        <Image
          src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
          alt="Weather icon"
          width={iconSize * 2}
          height={iconSize * 2}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Custom animated icons based on weather code
  const getAnimatedIcon = () => {
    // Clear sky - day
    if (iconCode === "01d") {
      return (
        <div className="relative w-full h-full">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-weather-sunny z-10 relative"
            style={{ width: '100%', height: '100%' }}
          >
            <SunIcon className="w-full h-full" />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-weather-sunny/20 rounded-full blur-xl z-0"
            animate={{
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      );
    }

    // Clear sky - night
    if (iconCode === "01n") {
      return (
        <div className="relative w-full h-full">
          <motion.div
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-gray-300 z-10 relative"
            style={{ width: '100%', height: '100%' }}
          >
            <MoonIcon className="w-full h-full" />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-gray-300/10 rounded-full blur-xl z-0"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      );
    }

    // Few clouds - day
    if (iconCode === "02d") {
      return (
        <div className="relative w-full h-full">
          <motion.div
            className="absolute left-0 bottom-0 text-weather-sunny z-0"
            animate={{
              rotate: 360,
              y: [0, -2, 0]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ width: '70%', height: '70%', left: '5%', bottom: '5%' }}
          >
            <SunIcon className="w-full h-full" />
          </motion.div>
          <motion.div
            className="absolute right-0 top-0 text-weather-cloudy z-10"
            animate={{
              x: [0, 5, 0],
              y: [0, -2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ width: '80%', height: '80%', right: '0%', top: '10%' }}
          >
            <CloudIcon className="w-full h-full" />
          </motion.div>
        </div>
      );
    }

    // Few clouds - night
    if (iconCode === "02n") {
      return (
        <div className="relative w-full h-full">
          <motion.div
            className="absolute left-0 bottom-0 text-gray-300 z-0"
            animate={{
              scale: [1, 1.05, 1],
              y: [0, -2, 0]
            }}
            transition={{
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ width: '60%', height: '60%', left: '5%', bottom: '5%' }}
          >
            <MoonIcon className="w-full h-full" />
          </motion.div>
          <motion.div
            className="absolute right-0 top-0 text-gray-400 z-10"
            animate={{
              x: [0, 5, 0],
              y: [0, -2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ width: '80%', height: '80%', right: '0%', top: '10%' }}
          >
            <CloudIcon className="w-full h-full" />
          </motion.div>
        </div>
      );
    }

    // Scattered clouds or broken clouds
    if (iconCode === "03d" || iconCode === "03n" || iconCode === "04d" || iconCode === "04n") {
      return (
        <div className="relative w-full h-full">
          <motion.div
            className="absolute left-0 bottom-0 text-weather-cloudy-dark z-0"
            animate={{
              x: [0, -3, 0],
              y: [0, 2, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ width: '70%', height: '70%', left: '5%', bottom: '5%' }}
          >
            <CloudIcon className="w-full h-full" />
          </motion.div>
          <motion.div
            className="absolute right-0 top-0 text-weather-cloudy z-10"
            animate={{
              x: [0, 3, 0],
              y: [0, -2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ width: '80%', height: '80%', right: '0%', top: '10%' }}
          >
            <CloudIcon className="w-full h-full" />
          </motion.div>
        </div>
      );
    }

    // Shower rain or rain
    if (iconCode === "09d" || iconCode === "09n" || iconCode === "10d" || iconCode === "10n") {
      return (
        <div className="relative">
          <motion.div
            className="text-weather-rainy"
            animate={{
              y: [0, -2, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <CloudArrowDownIcon className="w-full h-full" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-1/4 w-0.5 h-2 bg-weather-rainy rounded-full"
            animate={{
              y: [0, 10, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeIn",
              delay: 0.2
            }}
          />
          <motion.div
            className="absolute bottom-0 left-2/4 w-0.5 h-2 bg-weather-rainy rounded-full"
            animate={{
              y: [0, 10, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeIn",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute bottom-0 left-3/4 w-0.5 h-2 bg-weather-rainy rounded-full"
            animate={{
              y: [0, 10, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeIn",
              delay: 0.8
            }}
          />
        </div>
      );
    }

    // Thunderstorm
    if (iconCode === "11d" || iconCode === "11n") {
      return (
        <div className="relative">
          <motion.div
            className="text-weather-stormy"
            animate={{
              y: [0, -2, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <BoltIcon className="w-full h-full" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-yellow-400"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeOut",
              repeatDelay: 2.5
            }}
          />
        </div>
      );
    }

    // Snow
    if (iconCode === "13d" || iconCode === "13n") {
      return (
        <div className="relative">
          <motion.div
            className="text-weather-snowy-dark"
            animate={{
              y: [0, -2, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <CloudArrowUpIcon className="w-full h-full" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-1/4 w-1.5 h-1.5 bg-white rounded-full"
            animate={{
              y: [0, 10, 0],
              opacity: [0, 1, 0],
              rotate: 180
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 0.2
            }}
          />
          <motion.div
            className="absolute bottom-0 left-2/4 w-1.5 h-1.5 bg-white rounded-full"
            animate={{
              y: [0, 10, 0],
              opacity: [0, 1, 0],
              rotate: 180
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 0.7
            }}
          />
          <motion.div
            className="absolute bottom-0 left-3/4 w-1.5 h-1.5 bg-white rounded-full"
            animate={{
              y: [0, 10, 0],
              opacity: [0, 1, 0],
              rotate: 180
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 1.2
            }}
          />
        </div>
      );
    }

    // Mist/Fog
    if (iconCode === "50d" || iconCode === "50n") {
      return (
        <div className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-weather-cloudy-light/30 rounded-full blur-md"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/4 left-0 right-0 h-0.5 bg-weather-cloudy-light/60 rounded-full"
            animate={{
              x: [-10, 10, -10],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-2/4 left-0 right-0 h-0.5 bg-weather-cloudy-light/60 rounded-full"
            animate={{
              x: [10, -10, 10],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute top-3/4 left-0 right-0 h-0.5 bg-weather-cloudy-light/60 rounded-full"
            animate={{
              x: [-5, 5, -5],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      );
    }

    // Default fallback
    return (
      <div className="text-weather-cloudy">
        <CloudIcon className="w-full h-full" />
      </div>
    );
  };

  return (
    <div className={`relative ${containerClass}`}>
      {getAnimatedIcon()}
    </div>
  );
}
