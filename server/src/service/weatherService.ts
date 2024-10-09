import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object

class Weather{
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  humidity: number;
  windSpeed: number;
  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    humidity: number,
    windSpeed: number
  ){
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private APIKey: string;
  private cityName: string;
  constructor(
    baseURL: string,
    APIKey: string,
    cityName: string
  ){
    this.baseURL = baseURL;
    this.APIKey = APIKey;
    this.cityName = cityName;
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    return await fetch(`${this.baseURL}/${query}`).then(response => response.json());
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    try {
      return {lat: locationData.lat, lon: locationData.lon}
    } catch {
      return {lat: 0, lon: 0}
    }
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.APIKey}`
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&limit=1&appid=${this.APIKey}`
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    return this.destructureLocationData((await this.fetchLocationData(this.buildGeocodeQuery()))[0]);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    return await this.fetchLocationData(this.buildWeatherQuery(coordinates));
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    return new Weather(this.cityName, new Date(response.dt * 1000).toDateString(), response.weather[0].icon, response.weather[0].description, response.main.temp, response.main.humidity, response.wind.speed);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    return [currentWeather, ...(weatherData.filter((_element, index) => (index % 8) === 0))]
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const currentCoords: Coordinates = await this.fetchAndDestructureLocationData();
    const currentData = await fetch(`${this.baseURL}/data/2.5/weather?lat=${currentCoords.lat}&lon=${currentCoords.lon}&limit=1&appid=${this.APIKey}`).then(response => response.json());
    const forecastRawData = await this.fetchWeatherData(await this.fetchAndDestructureLocationData());
    const forecastFormatedData = forecastRawData.list.map((element: any) => {return this.parseCurrentWeather(element)});
    return this.buildForecastArray(this.parseCurrentWeather(currentData), forecastFormatedData);
  }
}

export default new WeatherService(process.env.API_BASE_URL as string, process.env.API_KEY as string, "");
