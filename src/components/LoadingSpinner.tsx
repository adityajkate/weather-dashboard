"use client";

import { useWeatherStore } from "@/store/weatherStore";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function LoadingSpinner() {
  const { isLoading } = useWeatherStore();
  const [isVisible, setIsVisible] = useState(false);

  // Handle visibility with a small delay when hiding
  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!isLoading && !isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[99] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      style={{
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'auto' : 'none'
      }}
    >
      <motion.div
        className="bg-black/60 backdrop-blur-md px-8 py-6 rounded-lg border border-white/10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center">
          {/* Loading spinner */}
          <div className="relative w-12 h-12">
            <motion.div
              className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 border-2 border-transparent border-b-secondary rounded-full"
              animate={{ rotate: -180 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Loading text */}
          <p className="text-white/80 mt-4 text-sm font-light tracking-wider">
            Loading...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
