import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to get location ID from city name
async function getLocationId(cityName: string, apiKey: string): Promise<string | null> {
    try {
        const url = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(cityName)}&key=${apiKey}`;
        const response = await axios.get(url);
        if (response.data && response.data.code === '200' && response.data.location.length > 0) {
            return response.data.location[0].id;
        }
        console.warn(`Could not find location ID for city: ${cityName}`);
        return null;
    } catch (error) {
        console.error(`Error getting location ID for ${cityName}:`, error);
        return null;
    }
}

// Main function to get weather data
export async function getWeather(cityName: string) {
    const apiKey = process.env.HEWEATHER_KEY||'c72cea469bb14f8d87135353fb548c6e';
    if (!apiKey) {
        throw new Error('HeWeather API key not configured in .env file.');
    }

    try {
        const locationId = await getLocationId(cityName, apiKey);
        if (!locationId) {
            throw new Error(`Could not find location ID for ${cityName}`);
        }

        // Fetch both current weather and 3-day forecast in parallel
        const [nowResponse, forecastResponse] = await Promise.all([
            axios.get(`https://devapi.qweather.com/v7/weather/now?location=${locationId}&key=${apiKey}`),
            axios.get(`https://devapi.qweather.com/v7/weather/3d?location=${locationId}&key=${apiKey}`)
        ]);

        // Check if both API calls were successful
        if (nowResponse.data.code !== '200' || forecastResponse.data.code !== '200') {
             throw new Error(`HeWeather API error. Now: ${nowResponse.data.code}, Forecast: ${forecastResponse.data.code}`);
        }
        
        const now = nowResponse.data.now;
        const forecast = forecastResponse.data.daily;

        // Combine the results into a single object
        return {
            city: cityName,
            now: {
                temp: now.temp,
                text: now.text,
                icon: `https://icons.qweather.com/assets/icons/${now.icon}.svg`
            },
            forecast: forecast.map((day: any) => ({
                date: new Date(day.fxDate).toLocaleDateString('zh-CN', { weekday: 'short' }),
                temp: `${day.tempMin}° / ${day.tempMax}°`,
                description: day.textDay,
                icon: `https://icons.qweather.com/assets/icons/${day.iconDay}.svg`
            }))
        };
    } catch (error) {
        console.error(`Error fetching weather for ${cityName}:`, error);
        throw error; // Re-throw the error to be caught by the route handler
    }
}
