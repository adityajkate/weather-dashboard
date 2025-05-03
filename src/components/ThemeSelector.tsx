"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import {
  SunIcon,
  MoonIcon,
  SwatchIcon,
  EyeIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export function ThemeSelector() {
  const {
    mode,
    style,
    motion: motionPreference,
    contrast,
    setMode,
    setStyle,
    setMotion,
    setContrast,
    isDark,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      <motion.button
        onClick={toggleDropdown}
        className="px-3 py-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 transition-all relative overflow-hidden flex items-center gap-2"
        aria-label="Theme settings"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div className="relative z-10">
          <SwatchIcon className="h-5 w-5 text-primary" />
        </motion.div>
        <span className="text-sm font-medium">Theme</span>

        <motion.span
          className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-56 rounded-lg bg-card border border-border shadow-lg z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3">
              <h3 className="font-medium text-sm mb-2">Appearance</h3>

              {/* Light/Dark Mode */}
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">Theme Mode</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setMode("light"); closeDropdown(); }}
                    className={`flex-1 p-2 rounded-md flex flex-col items-center gap-1 transition-all ${
                      mode === "light" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                    aria-label="Light mode"
                  >
                    <SunIcon className="h-5 w-5" />
                    <span className="text-xs">Light</span>
                  </button>
                  <button
                    onClick={() => { setMode("dark"); closeDropdown(); }}
                    className={`flex-1 p-2 rounded-md flex flex-col items-center gap-1 transition-all ${
                      mode === "dark" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                    aria-label="Dark mode"
                  >
                    <MoonIcon className="h-5 w-5" />
                    <span className="text-xs">Dark</span>
                  </button>
                  <button
                    onClick={() => { setMode("system"); closeDropdown(); }}
                    className={`flex-1 p-2 rounded-md flex flex-col items-center gap-1 transition-all ${
                      mode === "system" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                    aria-label="System mode"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    <span className="text-xs">Auto</span>
                  </button>
                </div>
              </div>

              {/* Theme Style */}
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">Color Theme</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setStyle("default"); closeDropdown(); }}
                    className={`p-2 rounded-md flex flex-col items-center gap-1 transition-all ${
                      style === "default" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                    aria-label="Default theme"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-teal-500" />
                    <span className="text-xs">Default</span>
                  </button>
                  <button
                    onClick={() => { setStyle("neon"); closeDropdown(); }}
                    className={`p-2 rounded-md flex flex-col items-center gap-1 transition-all ${
                      style === "neon" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                    aria-label="Neon theme"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400" />
                    <span className="text-xs">Neon</span>
                  </button>
                  <button
                    onClick={() => { setStyle("pastel"); closeDropdown(); }}
                    className={`p-2 rounded-md flex flex-col items-center gap-1 transition-all ${
                      style === "pastel" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                    aria-label="Pastel theme"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-300 to-pink-300" />
                    <span className="text-xs">Pastel</span>
                  </button>
                </div>
              </div>

              {/* Accessibility Options */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Accessibility</p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setMotion(motionPreference === "reduced" ? "full" : "reduced");
                      closeDropdown();
                    }}
                    className="w-full p-2 rounded-md flex items-center justify-between transition-all hover:bg-muted"
                    aria-label="Toggle reduced motion"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowPathIcon className="h-4 w-4" />
                      <span className="text-xs">Reduced Motion</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors ${
                      motionPreference === "reduced" ? "bg-primary" : "bg-muted-foreground/30"
                    }`}>
                      <div className={`w-3 h-3 rounded-full bg-card transform transition-transform ${
                        motionPreference === "reduced" ? "translate-x-4" : "translate-x-1"
                      }`} />
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setContrast(contrast === "high" ? "normal" : "high");
                      closeDropdown();
                    }}
                    className="w-full p-2 rounded-md flex items-center justify-between transition-all hover:bg-muted"
                    aria-label="Toggle high contrast"
                  >
                    <div className="flex items-center gap-2">
                      <EyeIcon className="h-4 w-4" />
                      <span className="text-xs">High Contrast</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors ${
                      contrast === "high" ? "bg-primary" : "bg-muted-foreground/30"
                    }`}>
                      <div className={`w-3 h-3 rounded-full bg-card transform transition-transform ${
                        contrast === "high" ? "translate-x-4" : "translate-x-1"
                      }`} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
