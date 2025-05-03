"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CloudIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ThemeSelector } from '../ThemeSelector';
import { useWeatherStore } from '@/store/weatherStore';
import { useThemeValue } from '../ThemeProvider';

export function Header() {
  const { units, setUnits, favorites } = useWeatherStore();
  const { style } = useThemeValue();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg mr-3">
              <CloudIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Weather<span className="text-foreground">Dashboard</span>
            </h1>
          </motion.div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:justify-end md:flex-1 md:ml-10 space-x-4">
            {/* Unit toggle */}
            <div className="flex items-center p-1 bg-muted rounded-lg">
              <button
                onClick={() => setUnits('metric')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  units === 'metric'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground hover:bg-muted-foreground/10'
                }`}
                aria-label="Switch to Celsius"
              >
                °C
              </button>
              <button
                onClick={() => setUnits('imperial')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  units === 'imperial'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground hover:bg-muted-foreground/10'
                }`}
                aria-label="Switch to Fahrenheit"
              >
                °F
              </button>
            </div>

            {/* Theme controls */}
            <div className="flex items-center">
              <ThemeSelector />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4 space-y-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center p-1 bg-muted rounded-lg">
              <button
                onClick={() => setUnits('metric')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  units === 'metric'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground hover:bg-muted-foreground/10'
                }`}
                aria-label="Switch to Celsius"
              >
                °C
              </button>
              <button
                onClick={() => setUnits('imperial')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  units === 'imperial'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground hover:bg-muted-foreground/10'
                }`}
                aria-label="Switch to Fahrenheit"
              >
                °F
              </button>
            </div>

            <div className="flex items-center">
              <ThemeSelector />
            </div>
          </div>

          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Favorite Locations</h3>
              <div className="space-y-2">
                {favorites.map((location, index) => (
                  <motion.button
                    key={`${location.lat}-${location.lon}`}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => {
                      useWeatherStore.getState().selectLocation(location);
                      setIsMobileMenuOpen(false);
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {location.state ? `${location.state}, ` : ''}{location.country}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </header>
  );
}
