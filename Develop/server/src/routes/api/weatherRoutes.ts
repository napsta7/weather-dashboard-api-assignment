import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    // Get the city name from the request body
    const { cityName } = req.body;

    // Check if city is provided
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Get weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(cityName); // Assuming this method takes a city name as a parameter

    // Save city to search history
    await HistoryService.addCity(cityName); // Use the addCity method to save the city

    // Send the weather data back to the client
    return res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while retrieving weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try{
    const getHistory = await HistoryService.getCities();
    res.status(200).json(getHistory);
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error' });
}
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await HistoryService.removeCity(id);
      res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error' });
  }
});

export default router;
