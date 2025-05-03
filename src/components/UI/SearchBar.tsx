"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useWeatherStore } from '@/store/weatherStore';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  className = "",
  placeholder = "Search for a city...",
  onSearch
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    searchLocations,
    searchResults,
    selectLocation,
    isLoading,
    recentSearches
  } = useWeatherStore();

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length <= 2) {
      setIsDropdownOpen(false);
    }
  };

  // Debounce search as user types
  useEffect(() => {
    if (query.trim().length > 2) {
      const timer = setTimeout(() => {
        searchLocations(query);
        setIsDropdownOpen(true);
        if (onSearch) onSearch(query);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [query, searchLocations, onSearch]);

  // Handle search submission
  const handleSearch = () => {
    if (query.trim().length > 2) {
      searchLocations(query);
      setIsDropdownOpen(true);
      if (onSearch) onSearch(query);
    }
  };

  // Handle location selection
  const handleSelectLocation = (index: number) => {
    selectLocation(searchResults[index]);
    setQuery(searchResults[index].name);
    setIsDropdownOpen(false);
    inputRef.current?.blur();
  };

  // Handle recent location selection
  const handleSelectRecentLocation = (cityName: string) => {
    setQuery(cityName);
    searchLocations(cityName);
    setIsDropdownOpen(true);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    } else if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search input
  const handleClearSearch = () => {
    setQuery('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        {/* Focus effect */}
        <motion.div
          className="absolute inset-0 bg-primary/5 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1.05 : 0.95
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Search input */}
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-11 pr-12 rounded-lg border border-input bg-card shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     transition-all input-primary"
            aria-label="Search for a city"
          />

          {/* Search icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </div>

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground
                       hover:text-foreground transition-colors p-1 rounded-full"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}

          {/* Search button */}
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white
                     p-1.5 rounded-md hover:bg-primary/90 transition-colors"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Search results dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="absolute z-10 w-full mt-2 bg-card rounded-lg shadow-md border border-border
                     max-h-60 overflow-auto"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <motion.div
                  key={`${result.lat}-${result.lon}`}
                  className="px-4 py-3 hover:bg-muted cursor-pointer transition-colors
                           border-b border-border last:border-0 flex items-start"
                  onClick={() => handleSelectLocation(index)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}
                >
                  <MapPinIcon className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.state ? `${result.state}, ` : ''}{result.country}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-muted-foreground">
                {isLoading ? 'Searching...' : 'No results found. Try a different city name.'}
              </div>
            )}

            {/* Recent searches */}
            {query.length <= 2 && recentSearches.length > 0 && (
              <div className="border-t border-border pt-2">
                <div className="px-4 py-2 text-xs text-muted-foreground">Recent searches</div>
                {recentSearches.map((city, index) => (
                  <motion.div
                    key={`recent-${index}`}
                    className="px-4 py-2 hover:bg-muted cursor-pointer transition-colors
                             flex items-center"
                    onClick={() => handleSelectRecentLocation(city)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="text-sm">{city}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
