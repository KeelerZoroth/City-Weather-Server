import { Router, type Request, type Response } from 'express';
import { v4 as uuidv4 } from "uuid"
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
// TODO: GET weather data from city name
  const collectedData: any = await WeatherService.getWeatherForCity(req.body.cityName);
// TODO: save city to search history
  const allCities = await HistoryService.getCities();
  if((allCities.filter(element => element.name === req.body.cityName)).length === 0){
    const cityString = `{
      "name": "${req.body.cityName}",
      "id": "${uuidv4()}"
    }`;
    HistoryService.addCity(cityString);
  }
  res.send(collectedData);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  res.send(await HistoryService.getCities());
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  res.send((await HistoryService.removeCity(req.params.id)));
});

export default router;
