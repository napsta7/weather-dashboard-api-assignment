import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates { //🟦Coordinates object takes latitude and longitude
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather { //🟦Defines properties of the Weather object
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
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
    this.baseURL = process.env.API_BASE_URL, //🟦References the .env file holding the base url and API key
    this.apiKey = process.env.API_KEY
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) { //🟦This method uses the URL in buildGeocodeQuery to get the coordinates of a city given the city name
    try{
      this.cityName = query;
      const fetchLocationDataURL = this.buildGeocodeQuery();
      const response = await fetch(fetchLocationDataURL).then(data => data.json());
      const locationData: Coordinates[] = response;
      return locationData[0];
    }
    catch(error){
      console.error('Error fetching location data.');
      throw error;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates { //🟦This destructures the latitude and longitude of the city
    if (!locationData) {
      console.error('No location data found');
    }
    const { lat, lon } = locationData;
    const coordinates: Coordinates = { lat, lon };
    return coordinates;
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string { //🟦This builds the query to get the coordinates of a city, which can be used in other methods
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
    return geocodeQuery;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string { //🟦This builds the query to get the weather for a city given the coordinates
    const weatherQuery = `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    //console.log(weatherQuery);
    return weatherQuery;
  }
  // TODO: Create fetchAndDestructureLocationData method //🟦This uses both fetchLocationData and destructureLocationData to return the destructured data
  private async fetchAndDestructureLocationData() {
    //try{
      const locationData = await this.fetchLocationData(this.cityName);
    
      const destructureData = this.destructureLocationData(locationData);
      return destructureData;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) { //🟦This uses the buildWeatherQuery and passes the coordinates to it
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
  private parseCurrentWeather(response: any) { //🟦This returns a new Weather object with the city's name, date, weather icon, the description for the icon, the temperature in, wind speed, and humidity
    const tempF = Math.floor((response.main.temp - 273.15) * (9 / 5) + 32);
    console.log(tempF);
    const windSpeed = response.wind.speed;
    const humidity = response.main.humidity;
    const city = response.name;
    const date = new Date().toLocaleDateString();
    const icon = response.weather[0].icon;
    const iconDescription = response.weather[0].description;
    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {//🟦This builds an array for the 5 day forecast, and only shows the forecast for each day rather than the forecast every 3 hours.
    const forecastArray: Weather[] = [currentWeather];
    const dailyForecasts: { [key: string]: Weather } = {};

    for (const day of weatherData) {
        const date = day.dt_txt.split(' ')[0]; //🟦Gets the date
        
        if (!dailyForecasts[date]) {
          const tempF = Math.floor((day.main.temp - 273.15) * (9 / 5) + 32);
            const windSpeed = day.wind.speed;
            const humidity = day.main.humidity;
            const icon = day.weather[0].icon;
            const iconDescription = day.weather[0].description;

            const weatherForecast = new Weather(currentWeather.city, date, icon, iconDescription, tempF, windSpeed, humidity); //🟦Creates a new Weather object for each date
            dailyForecasts[date] = weatherForecast; //🟦Stores it in the dailyForecast object
        }
    }

    for (const forecast of Object.values(dailyForecasts)) {
        forecastArray.push(forecast);
    }

    return forecastArray;
}
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData(); //🟦Uses this method to fetch and destructure data and stores it in coordinates variable
    if (coordinates) {
        const currentWeather = await this.fetchWeatherData(coordinates); //🟦Fetches the weather data given the coordinates of the city
        if (currentWeather) {
          const getWeatherURL = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`; //🟦This is the URL for getting the forecast data
          const weatherResponse = await fetch(getWeatherURL);
          if (!weatherResponse.ok) {
              console.error('Error fetching forecast data:', weatherResponse.statusText);
              return null;
          }
          const weatherData = await weatherResponse.json();
          const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
          return forecastArray; //🟦Returns the forecast array with the current weather and the weather data
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
