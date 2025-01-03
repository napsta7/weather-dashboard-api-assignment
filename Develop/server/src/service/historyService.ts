import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string
  constructor(
    name: string
  ){
    this.name = name,
    this.id = uuidv4();
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try{
      const data = await fs.readFile('Develop/server/searchHistory.json', 'utf-8');
      return JSON.parse(data);
    }
    catch(error){
      console.error(error);
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try{
      const data = JSON.stringify(cities, null, 2);
      await fs.writeFile('Develop/server/searchHistory.json', data);
    }
    catch(error){
      console.error(error);
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    try {
      const data = await this.read();
      return data.map((cityData: any) => new City(cityData.name));
    } catch (error) {
      console.error(error);
    }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    try {
      const cities = await this.getCities();
      const newCity = new City(city);
      cities.push(newCity);
      await this.write(cities);
    }
    catch(error){
      console.error(error);
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    try {
      const cities = await this.getCities();
      const updatedCities = cities.filter((city: City) => city.id !== id);
      await this.write(updatedCities);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export default new HistoryService();
