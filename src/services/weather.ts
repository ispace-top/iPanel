import axios from 'axios';
import { readConfig } from './config';
// ** FIX: Removed dotenv import and config call from this file. **
// This will now be handled globally by index.ts

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
        if (axios.isAxiosError(error)) {
            console.error(`Error getting location ID for ${cityName}:`, error.response?.data || error.message);
        } else if (error instanceof Error) {
            console.error(`Error getting location ID for ${cityName}:`, error.message);
        } else {
            console.error(`An unknown error occurred while getting location ID for ${cityName}:`, error);
        }
        return null;
    }
}

// Main function to get weather data
export async function getWeather(cityName: string) {
    const config = await readConfig();
    const apiKey = config.weather?.apiKey || process.env.HEWEATHER_KEY;
    if (!apiKey) {
        console.error('HeWeather API key not configured. Configure it in the settings or add HEWEATHER_KEY to your .env file.');
        throw new Error('HeWeather API key not configured.');
    }

    try {
        const locationId = await getLocationId(cityName, apiKey);
        if (!locationId) {
            throw new Error(`Could not find location ID for ${cityName}`);
        }

        const [nowResponse, forecastResponse] = await Promise.all([
            axios.get(`https://devapi.qweather.com/v7/weather/now?location=${locationId}&key=${apiKey}`),
            axios.get(`https://devapi.qweather.com/v7/weather/3d?location=${locationId}&key=${apiKey}`)
        ]);

        if (nowResponse.data.code !== '200' || forecastResponse.data.code !== '200') {
             throw new Error(`HeWeather API error. Now: ${nowResponse.data.code}, Forecast: ${forecastResponse.data.code}`);
        }
        
        const now = nowResponse.data.now;
        const forecast = forecastResponse.data.daily;

        return {
            city: cityName,
            now: {
                temp: now.temp,
                text: now.text,
                icon: now.icon, // 添加图标ID
                iconId: now.icon.replace(/\D/g, '') // 提取纯数字ID
            },
            forecast: forecast.map((day: any) => ({
                date: new Date(day.fxDate).toLocaleString('zh-CN', { weekday: 'short' }),
                temp: `${day.tempMin}° / ${day.tempMax}°`,
                description: day.textDay,
                icon: day.iconDay, // 添加图标ID
                iconId: day.iconDay.replace(/\D/g, '') // 提取纯数字ID
            }))
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error fetching weather for ${cityName}:`, error.response?.data || error.message);
        } else if (error instanceof Error) {
            console.error(`Error fetching weather for ${cityName}:`, error.message);
        } else {
            console.error(`An unknown error occurred while fetching weather for ${cityName}:`, error);
        }
        throw error;
    }
}
