"use client";

import { create } from 'zustand';
import { WeatherData, ForecastData, GeocodingData } from '@/types/weather';
import { getCurrentWeather, getForecast, getCoordinates } from '@/services/weatherApi';

interface WeatherStore {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  searchResults: GeocodingData[];
  selectedLocation: GeocodingData | null;
  isLoading: boolean;
  error: string | null;
  units: 'metric' | 'imperial';
  recentSearches: string[];
  favorites: GeocodingData[];

  // Actions
  searchLocations: (query: string) => Promise<void>;
  selectLocation: (location: GeocodingData) => void;
  fetchWeatherData: () => Promise<void>;
  setUnits: (units: 'metric' | 'imperial') => void;
  clearError: () => void;
  addToRecentSearches: (cityName: string) => void;
  addToFavorites: (location: GeocodingData) => void;
  removeFromFavorites: (locationId: string) => void;
  setLoadingState: (isLoading: boolean) => void;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  currentWeather: null,
  forecast: null,
  searchResults: [],
  selectedLocation: null,
  isLoading: false,
  error: null,
  units: 'metric',
  recentSearches: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('recentSearches') || '[]')
    : [],
  favorites: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('favoriteLocations') || '[]')
    : [],

  searchLocations: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const results = await getCoordinates(query);
      set({ searchResults: results, isLoading: false });
    } catch (error) {
      set({
        error: 'Failed to search locations. Please try again.',
        isLoading: false,
        searchResults: []
      });
    }
  },

  selectLocation: (location: GeocodingData) => {
    set({ selectedLocation: location, searchResults: [] });
    get().addToRecentSearches(location.name);
    get().fetchWeatherData();
  },

  fetchWeatherData: async () => {
    const { selectedLocation, units } = get();

    if (!selectedLocation) return;

    try {
      set({ isLoading: true, error: null });

      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(selectedLocation.lat, selectedLocation.lon, units),
        getForecast(selectedLocation.lat, selectedLocation.lon, units)
      ]);

      set({
        currentWeather: weatherData,
        forecast: forecastData,
        isLoading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch weather data. Please try again.',
        isLoading: false
      });
    }
  },

  setUnits: (units: 'metric' | 'imperial') => {
    set({ units });
    const { selectedLocation } = get();
    if (selectedLocation) {
      get().fetchWeatherData();
    }
  },

  clearError: () => set({ error: null }),

  addToRecentSearches: (cityName: string) => {
    const { recentSearches } = get();

    // Don't add duplicates
    if (recentSearches.includes(cityName)) {
      // Move to the top if it exists
      const newRecentSearches = [
        cityName,
        ...recentSearches.filter(name => name !== cityName)
      ];

      set({ recentSearches: newRecentSearches });

      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      }

      return;
    }

    // Add to the beginning and limit to 5 items
    const newRecentSearches = [cityName, ...recentSearches].slice(0, 5);

    set({ recentSearches: newRecentSearches });

    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    }
  },

  addToFavorites: (location: GeocodingData) => {
    const { favorites } = get();

    // Check if already in favorites
    const locationId = `${location.lat}-${location.lon}`;
    const existingIndex = favorites.findIndex(
      fav => `${fav.lat}-${fav.lon}` === locationId
    );

    if (existingIndex !== -1) {
      return; // Already in favorites
    }

    // Add to favorites (limit to 10)
    const newFavorites = [...favorites, location].slice(0, 10);

    set({ favorites: newFavorites });

    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteLocations', JSON.stringify(newFavorites));
    }
  },

  removeFromFavorites: (locationId: string) => {
    const { favorites } = get();

    const newFavorites = favorites.filter(
      location => `${location.lat}-${location.lon}` !== locationId
    );

    set({ favorites: newFavorites });

    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteLocations', JSON.stringify(newFavorites));
    }
  },

  // Directly set the loading state (for testing and manual control)
  setLoadingState: (isLoading: boolean) => {
    set({ isLoading });
  }
}));
