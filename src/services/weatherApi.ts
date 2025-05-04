import axios from 'axios';
import { WeatherData, ForecastData, GeocodingData } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_URL || 'https://api.openweathermap.org/data/2.5';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0';

// Get current weather by coordinates
export const getCurrentWeather = async (lat: number, lon: number, units: string = 'metric'): Promise<WeatherData> => {
  try {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is missing');
    }

    const response = await axios.get(`${API_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units,
      },
    });

    if (!response.data) {
      throw new Error('No data received from weather API');
    }

    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching current weather:', error);
    if (axios.isAxiosError(error) && error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      throw new Error(`Weather API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (axios.isAxiosError(error) && error.request) {
      // The request was made but no response was received
      throw new Error('No response from weather service. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('An error occurred while fetching weather data');
    }
  }
};

// Get 5-day forecast by coordinates
export const getForecast = async (lat: number, lon: number, units: string = 'metric'): Promise<ForecastData> => {
  try {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is missing');
    }

    const response = await axios.get(`${API_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units,
      },
    });

    if (!response.data) {
      throw new Error('No data received from forecast API');
    }

    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching forecast:', error);
    if (axios.isAxiosError(error) && error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      throw new Error(`Forecast API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (axios.isAxiosError(error) && error.request) {
      // The request was made but no response was received
      throw new Error('No response from weather service. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('An error occurred while fetching forecast data');
    }
  }
};

// Get coordinates by city name (geocoding)
export const getCoordinates = async (cityName: string, limit: number = 5): Promise<GeocodingData[]> => {
  try {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is missing');
    }

    if (!cityName || cityName.trim() === '') {
      throw new Error('City name is required');
    }

    const response = await axios.get(`${GEO_API_URL}/direct`, {
      params: {
        q: cityName,
        limit,
        appid: API_KEY,
      },
    });

    if (!response.data) {
      throw new Error('No data received from geocoding API');
    }

    // Return empty array if no results instead of throwing an error
    if (Array.isArray(response.data) && response.data.length === 0) {
      console.log(`No locations found for query: ${cityName}`);
      return [];
    }

    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching coordinates:', error);
    if (axios.isAxiosError(error) && error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      throw new Error(`Geocoding API error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (axios.isAxiosError(error) && error.request) {
      // The request was made but no response was received
      throw new Error('No response from geocoding service. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('An error occurred while fetching location data');
    }
  }
};
