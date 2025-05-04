"use client";

import { format } from "date-fns";
import { CloudIcon } from "@heroicons/react/24/outline";
import { useWeatherStore } from "@/store/weatherStore";
import { CurrentWeather } from "./CurrentWeather";
import { WeatherStats } from "./WeatherStats";
import { WeatherStatItem } from "./WeatherStats";
import { WeatherChart } from "./WeatherChart";
import { WeatherForecast } from "./WeatherForecast";
import { WeatherParticles } from "./WeatherParticles";

export function WeatherDashboard() {
  const {
    currentWeather,
    forecast,
    selectedLocation,
    isLoading,
    error,
    units
  } = useWeatherStore();

  // If no location is selected or data is loading, show the welcome message
  if (!selectedLocation || !currentWeather) {
    console.log("Showing welcome message - no location or weather data");
    return (
      <div className="text-center p-8 rounded-lg border border-border bg-card/80 backdrop-blur-sm">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-full">
              <CloudIcon className="h-16 w-16 text-gradient" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Weather Dashboard
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Search for a city above to get real-time weather information, forecasts, and more.
          Our dashboard provides current conditions, 5-day forecasts, and detailed weather charts.
        </p>
        <div className="mt-6 inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm">
          <span className="mr-2">💡</span> Try searching for cities like &quot;London&quot;, &quot;New York&quot;, or &quot;Tokyo&quot;
        </div>
      </div>
    );
  }

  // Format date and time
  const date = new Date();
  const formattedDate = format(date, "EEEE, MMMM d");
  const formattedTime = format(date, "h:mm a");

  // Format sunrise and sunset times
  const sunrise = new Date(currentWeather.sys.sunrise * 1000);
  const sunset = new Date(currentWeather.sys.sunset * 1000);
  const formattedSunrise = format(sunrise, "h:mm a");
  const formattedSunset = format(sunset, "h:mm a");

  // Get weather type for particles
  const getWeatherType = () => {
    const code = currentWeather.weather[0].icon.substring(0, 2);
    if (code === "01") return "sunny";
    if (code === "02" || code === "03" || code === "04") return "cloudy";
    if (code === "09" || code === "10") return "rainy";
    if (code === "11") return "stormy";
    if (code === "13") return "snowy";
    return "clear";
  };

  // Prepare forecast data
  const prepareForecasts = () => {
    if (!forecast) return [];

    // Define a type for the daily forecast data
    interface DailyForecast {
      day: string;
      date: string;
      temps: number[];
      icons: string[];
      descriptions: string[];
    }

    // Group forecast data by day
    const dailyForecasts: Record<string, DailyForecast> = {};

    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = format(date, "EEE");
      const dateStr = format(date, "MMM d");
      const key = `${day}-${dateStr}`;

      if (!dailyForecasts[key]) {
        dailyForecasts[key] = {
          day,
          date: dateStr,
          temps: [],
          icons: [],
          descriptions: []
        };
      }

      dailyForecasts[key].temps.push(item.main.temp);
      dailyForecasts[key].icons.push(item.weather[0].icon);
      dailyForecasts[key].descriptions.push(item.weather[0].description);
    });

    // Convert to array and calculate min/max temps
    return Object.values(dailyForecasts).map((day, index) => ({
      day: day.day,
      date: day.date,
      tempMax: Math.round(Math.max(...day.temps)),
      tempMin: Math.round(Math.min(...day.temps)),
      // Use the most common icon for the day
      iconCode: getMostFrequent(day.icons),
      // Use the most common description for the day
      description: getMostFrequent(day.descriptions),
      index
    })).slice(0, 5); // Limit to 5 days
  };

  // Helper function to get most frequent item in array
  const getMostFrequent = <T extends string | number>(arr: T[]): T => {
    const counts: Record<string, number> = {};
    let maxItem = arr[0];
    let maxCount = 1;

    for (const item of arr) {
      const key = String(item);
      counts[key] = (counts[key] || 0) + 1;
      if (counts[key] > maxCount) {
        maxItem = item;
        maxCount = counts[key];
      }
    }

    return maxItem;
  };

  // Prepare hourly temperature data for chart
  const prepareHourlyTemps = () => {
    if (!forecast) return {
      categories: [],
      tempData: [],
      feelsLikeData: []
    };

    const next24Hours = forecast.list.slice(0, 8); // 8 x 3 hours = 24 hours

    const categories = next24Hours.map(item =>
      format(new Date(item.dt * 1000), "h a")
    );

    const tempData = next24Hours.map(item =>
      Math.round(item.main.temp)
    );

    const feelsLikeData = next24Hours.map(item =>
      Math.round(item.main.feels_like)
    );

    return {
      categories,
      tempData,
      feelsLikeData
    };
  };

  // Prepare humidity and precipitation data for chart
  const prepareHumidityPrecipData = () => {
    if (!forecast) return {
      categories: [],
      humidityData: [],
      precipData: []
    };

    const next24Hours = forecast.list.slice(0, 8);

    const categories = next24Hours.map(item =>
      format(new Date(item.dt * 1000), "h a")
    );

    const humidityData = next24Hours.map(item =>
      item.main.humidity
    );

    const precipData = next24Hours.map(item => {
      // First check if there's actual rain data
      if (item.rain && item.rain["3h"]) {
        // Convert mm to percentage (assuming 10mm is 100%)
        const value = Math.round(item.rain["3h"] * 10);
        console.log(`Rain data for ${format(new Date(item.dt * 1000), "h a")}: ${item.rain["3h"]}mm → ${value}%`);
        return value;
      }

      // If no rain data, use probability of precipitation (pop) which is already a value between 0 and 1
      const value = Math.round(item.pop * 100);
      console.log(`Precipitation chance for ${format(new Date(item.dt * 1000), "h a")}: ${item.pop} → ${value}%`);
      return value;
    });

    console.log('Precipitation data:', {
      categories,
      precipData
    });

    return {
      categories,
      humidityData,
      precipData
    };
  };

  // Prepare wind speed data for chart
  const prepareWindData = () => {
    if (!forecast) return {
      categories: [],
      windData: []
    };

    const next24Hours = forecast.list.slice(0, 8);

    const categories = next24Hours.map(item =>
      format(new Date(item.dt * 1000), "h a")
    );

    const windData = next24Hours.map(item =>
      Math.round(item.wind.speed * 10) / 10
    );

    return {
      categories,
      windData
    };
  };

  const hourlyTemps = prepareHourlyTemps();
  const humidityPrecipData = prepareHumidityPrecipData();
  const windData = prepareWindData();
  const forecasts = prepareForecasts();

  // Get accurate min/max temperatures from forecast data for today
  const getTodayMinMaxTemps = () => {
    if (!forecast || forecast.list.length === 0) {
      return {
        min: Math.round(currentWeather.main.temp_min),
        max: Math.round(currentWeather.main.temp_max)
      };
    }

    // For min/max temperatures, we'll use the first 24 hours of forecast data
    // This ensures we get a good range of temperatures for the day
    const forecastsToUse = forecast.list.slice(0, 8); // 8 x 3 hours = 24 hours

    console.log('Using forecast data:', forecastsToUse.map(item => ({
      time: format(new Date(item.dt * 1000), "yyyy-MM-dd HH:mm"),
      temp: item.main.temp
    })));

    // Calculate min and max temperatures
    const temps = forecastsToUse.map(item => item.main.temp);

    // Get the actual min and max values
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    // Ensure we have different values (add a small difference if they're the same)
    const roundedMin = Math.round(minTemp);
    const roundedMax = Math.round(maxTemp);

    // If min and max are the same after rounding, adjust values to ensure they're different
    let finalMin = roundedMin;
    let finalMax = roundedMax;

    // If they're exactly the same (even before rounding), create an artificial range
    if (minTemp === maxTemp) {
      // Create a +/- 2 degree range around the current temperature
      finalMin = Math.round(minTemp) - 1;
      finalMax = Math.round(maxTemp) + 1;
    }
    // If they're the same after rounding but different before rounding
    else if (roundedMin === roundedMax) {
      // Adjust one of them to ensure they're different
      finalMax = roundedMin + 1;
    }

    console.log('Temperature range:', {
      temps,
      minTemp,
      maxTemp,
      roundedMin,
      roundedMax,
      finalMin,
      finalMax
    });

    return {
      min: finalMin,
      max: finalMax
    };
  };

  const { min: lowTemp, max: highTemp } = getTodayMinMaxTemps();

  return (
    <div className="space-y-8">
      {/* Current Weather */}
      <div className="relative">
        <WeatherParticles weatherType={getWeatherType()} intensity="low" />
        <CurrentWeather
          cityName={currentWeather.name}
          countryCode={currentWeather.sys.country}
          date={formattedDate}
          time={formattedTime}
          temperature={Math.round(currentWeather.main.temp)}
          feelsLike={Math.round(currentWeather.main.feels_like)}
          description={currentWeather.weather[0].description}
          iconCode={currentWeather.weather[0].icon}
          high={highTemp}
          low={lowTemp}
          humidity={currentWeather.main.humidity}
          windSpeed={currentWeather.wind.speed}
          windDirection={currentWeather.wind.deg}
          pressure={currentWeather.main.pressure}
          visibility={currentWeather.visibility / 1000} // Convert to km
          sunrise={formattedSunrise}
          sunset={formattedSunset}
          units={units}
        />
      </div>

      {/* Weather Stats */}
      <WeatherStats title="Weather Details" delay={5}>
        <WeatherStatItem
          icon={<CloudIcon className="h-5 w-5" />}
          label="Humidity"
          value={currentWeather.main.humidity}
          unit="%"
          color="text-blue-500"
          delay={1}
        />
        <WeatherStatItem
          icon={<CloudIcon className="h-5 w-5" />}
          label="Wind Speed"
          value={currentWeather.wind.speed}
          unit={units === "metric" ? "m/s" : "mph"}
          color="text-green-500"
          delay={2}
        />
        <WeatherStatItem
          icon={<CloudIcon className="h-5 w-5" />}
          label="Pressure"
          value={currentWeather.main.pressure}
          unit="hPa"
          color="text-purple-500"
          delay={3}
        />
      </WeatherStats>

      {/* Charts and Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weather Chart */}
        <WeatherChart
          title="Temperature Forecast"
          subtitle="Next 24 hours"
          categories={hourlyTemps.categories}
          series={[
            {
              name: "Temperature",
              data: hourlyTemps.tempData
            },
            {
              name: "Feels Like",
              data: hourlyTemps.feelsLikeData
            }
          ]}
          type="area"
          yAxisTitle={units === "metric" ? "°C" : "°F"}
          delay={6}
        />

        {/* Weather Forecast */}
        <WeatherForecast
          title="5-Day Forecast"
          forecasts={forecasts}
          delay={7}
        />
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeatherChart
          title="Humidity & Precipitation Chance"
          subtitle="Next 24 hours"
          categories={humidityPrecipData.categories}
          series={[
            {
              name: "Humidity",
              data: humidityPrecipData.humidityData
            },
            {
              name: "Precipitation Chance",
              data: humidityPrecipData.precipData
            }
          ]}
          type="line"
          yAxisTitle="%"
          colors={["#6366f1", "#22c55e"]}
          delay={8}
        />

        <WeatherChart
          title="Wind Speed"
          subtitle="Next 24 hours"
          categories={windData.categories}
          series={[
            {
              name: "Wind Speed",
              data: windData.windData
            }
          ]}
          type="bar"
          yAxisTitle={units === "metric" ? "m/s" : "mph"}
          colors={["#0ea5e9"]}
          delay={9}
        />
      </div>
    </div>
  );
}
