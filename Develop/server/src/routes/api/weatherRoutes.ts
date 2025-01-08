import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    //🟦This gets cityName from the request body
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    //🟦This gets the weatherData from the getWeatherForCity method given a cityName
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    //🟦This adds a city to the search history using the addCity method in historyService.ts
    await HistoryService.addCity(cityName);

    //🟦Sends back the weatherData
    return res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while retrieving weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try{
    const getHistory = await HistoryService.getCities();//🟦Uses getCities to get all cities from the search history
    res.status(200).json(getHistory); //🟦Sends back the history
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
      await HistoryService.removeCity(id); //🟦Uses the removeCity method to remove a city from the search history
      res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error' });
  }
});

export default router;
