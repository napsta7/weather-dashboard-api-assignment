import { Router, Response, Request } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;
  const apiKey = process.env.API_KEY;
  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
    res.json(weatherData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error' });
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
