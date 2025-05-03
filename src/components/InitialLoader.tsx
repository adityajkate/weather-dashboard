"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[100] bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center relative">
        {/* Background gradient */}
        <div
          className="absolute -inset-10 -z-10 opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.2), transparent 70%)",
            filter: "blur(20px)"
          }}
        />

        {/* Main title */}
        <motion.h1
          className="text-5xl md:text-7xl font-extralight text-white tracking-[0.2em] uppercase"
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.2em" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            textShadow: "0 0 20px rgba(255,255,255,0.2)"
          }}
        >
          Weather
        </motion.h1>

        {/* Animated line */}
        <motion.div
          className="h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent my-6 mx-auto"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
        />

        {/* Secondary title */}
        <motion.h2
          className="text-4xl md:text-6xl font-thin text-white/90 tracking-widest uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          style={{
            textShadow: "0 0 15px rgba(255,255,255,0.1)"
          }}
        >
          Dashboard
        </motion.h2>

        {/* Creator credit */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <p className="text-white/70 text-sm font-light tracking-wider">
            Created by <span className="font-medium text-primary">AdityaKate</span>
          </p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          className="mt-6 flex justify-center items-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
