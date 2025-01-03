import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  wind: number;
  humidity: number;
  constructor(
    temperature: number,
    wind: number,
    humidity: number
  ) {
    this.temperature = temperature;
    this.wind = wind;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;
  cityName: string;
  constructor(
    cityName: string = ''
  ){
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = cityName;
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try{
      const url = `${this.baseURL}/geo/1.0/direct?q=${query}&appid=${process.env.API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        console.error(response.status);
        return null;
      }
      const locationData = await response.json();
      const coordinates: Coordinates = {
        lat: locationData[0].lat,
        lon: locationData[0].lon
      };
      return coordinates;
    }
    catch(error){
      console.error(error);
      return null;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    }
  };
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(cityName: string): string {
    const query: string = encodeURIComponent(cityName);
    return `${this.baseURL}/geo/1.0/direct?q=${query}&appid=${process.env.API_KEY}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${process.env.API_KEY}`;
    return weatherQuery;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    try{
      const locationData = await this.fetchLocationData(this.cityName);
      if (locationData) {
        const coordinates = this.destructureLocationData(locationData);
        return coordinates;
      }
      else {
        console.error('Error');
        return null;
      }
    }
    catch(error){
      console.error(error);
      return null;
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const currentWeatherResponse = await fetch(this.buildWeatherQuery(coordinates));
    const currentWeatherData = await currentWeatherResponse.json();
  
    const forecastResponse = await fetch(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${process.env.API_KEY}`);
    const forecastData = await forecastResponse.json();
  
    return {
      current: currentWeatherData,
      forecast: forecastData
    };
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    return new Weather(
      response.main.temp,
      response.main.humidity,
      response.wind.speed
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    return weatherData.map((entry: any) => {
        return {
            date: entry.dt_txt,
            temperature: entry.main.temp,
            wind: entry.wind.speed,
            humidity: entry.main.humidity
        };
    });
}
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData();
    if (coordinates) {

      const weatherData = await this.fetchWeatherData(coordinates);

      return {
        currentWeather: this.parseCurrentWeather(weatherData.current),
        forecast: this.buildForecastArray(this.parseCurrentWeather(weatherData.current), weatherData.forecast.list)
      };
    } else {
      throw new Error('Could not retrieve weather data');
    }
  }
}

export default new WeatherService();
