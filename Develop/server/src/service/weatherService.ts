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
  baseURL: string | undefined;
  apiKey: string | undefined;
  cityName = '';
  constructor(){
    this.baseURL = process.env.API_BASE_URL,
    this.apiKey = process.env.API_KEY
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try{
      this.cityName = query;
      const fetchLocationDataURL = this.buildGeocodeQuery();
      console.log(this.cityName, fetchLocationDataURL);
      const response = await fetch(fetchLocationDataURL);
      // const response = await fetch(fetchLocationDataURL).then(data => data.json());

      // if (!response.ok) {
      //   console.error('Error fetching location data:', response.statusText);
      //   return null;
      // }
      const jsonData = await response.json();
      const { lat, lon } = jsonData;
      const locationData: Coordinates = { 
        lat,
        lon
      };
      return locationData;
    }
    catch(error){
      console.error('Error fetching location data.');
      return error;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData) {
      console.error('No location data found');
    }
    const { lat, lon } = locationData;
    const coordinates: Coordinates = { lat, lon };
    return coordinates;
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
    return geocodeQuery;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    return weatherQuery;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    //try{
      const locationData = await this.fetchLocationData(this.cityName);
      console.log('should be coordinates', typeof locationData , locationData);
      // ts-ignore
      const destructureData = this.destructureLocationData(locationData);
      return destructureData;
    //}
    // catch(error){
    //   console.error('Error fetching and destructuring location data');
    //   throw new Error('Error fetching and destructuring location data');
    // }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try{
      const response = await fetch(this.buildWeatherQuery(coordinates));
      if (!response.ok) {
        console.error('Error fetching weather data:', response.statusText);
        return null;
        }
      const weatherData = await response.json();
      return this.parseCurrentWeather(weatherData);
    }
    catch(error){
      console.error('Error fetching weather data');
      return null;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const temperature = response.main.temp;
    const wind = response.wind.speed;
    const humidity = response.main.humidity;
    return new Weather(temperature, wind, humidity);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [currentWeather];
    for (const day of weatherData){
      const temperature = day.main.temp;
      const wind = day.wind.speed;
      const humidity = day.main.humidity;
      const weatherForecast = new Weather(temperature, wind, humidity);
      forecastArray.push(weatherForecast);
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    console.log(coordinates);
    if (coordinates) {
        const currentWeather = await this.fetchWeatherData(coordinates);
        if (currentWeather) {
          console.log(currentWeather);
          const getWeatherURL = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&cnt=5&appid=${this.apiKey}`;
          const weatherResponse = await fetch(getWeatherURL);
          if (!weatherResponse.ok) {
              console.error('Error fetching forecast data:', weatherResponse.statusText);
              return null;
          }
          const weatherData = await weatherResponse.json();
          const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
          return forecastArray;
      } else {
          console.error('Current weather data is not available');
      }
    } else {
        console.error('Error getting the weather for the city');
    }
    return null;
}
}

export default new WeatherService();
