import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  const { city } = req.body;  // Assuming the city name is passed in the request body

  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    // Get weather data from WeatherService
    const weatherData = await WeatherService.getWeatherForCity(city);
    const weather = weatherData.currentWeather;

    // Save city to the search history
    HistoryService.addCity(city);

    // Return weather data
    return res.status(200).json({
      city: weather.cityName,
      date: weather.date,
      icon: `http://openweathermap.org/img/wn/${weather.icon}.png`,  // Weather icon URL
      temperature: weather.temperature,
      windSpeed: weather.windSpeed,
      humidity: weather.humidity,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ message: 'Unable to fetch weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    return res.status(200).json(cities);  // Return the list of cities in search history
  } catch (error) {
    console.error('Error retrieving search history:', error);
    return res.status(500).json({ message: 'Unable to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
//  router.delete('/history/:id', async (req, res) => {});

export default router;
