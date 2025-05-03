// Format temperature based on units
export const formatTemperature = (temp: number, units: 'metric' | 'imperial'): string => {
  const symbol = units === 'metric' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
};

// Format wind speed based on units
export const formatWindSpeed = (speed: number, units: 'metric' | 'imperial'): string => {
  const value = units === 'metric' ? speed : speed;
  const unit = units === 'metric' ? 'm/s' : 'mph';
  return `${speed.toFixed(1)} ${unit}`;
};

// Format date from timestamp
export const formatDate = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// Format time from timestamp
export const formatTime = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Get weather icon URL from OpenWeatherMap
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Get background class based on weather condition
export const getWeatherBackgroundClass = (weatherId: number): string => {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  if (weatherId >= 200 && weatherId < 300) {
    return 'bg-stormy'; // Thunderstorm
  } else if (weatherId >= 300 && weatherId < 600) {
    return 'bg-rainy'; // Drizzle and Rain
  } else if (weatherId >= 600 && weatherId < 700) {
    return 'bg-snowy'; // Snow
  } else if (weatherId >= 700 && weatherId < 800) {
    return 'bg-cloudy'; // Atmosphere (fog, mist, etc.)
  } else if (weatherId === 800) {
    return 'bg-sunny'; // Clear sky
  } else if (weatherId > 800) {
    return 'bg-cloudy'; // Clouds
  }
  return '';
};

// Group forecast data by day
export const groupForecastByDay = (forecastList: any[]): any[] => {
  const grouped: Record<string, any[]> = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });
  
  return Object.values(grouped);
};
