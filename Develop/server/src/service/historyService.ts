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
    this.id = uuidv4(); //🟦uuidv4 generates an id for the city
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try{
      const data = await fs.readFile('db/searchHistory.json', 'utf-8'); //🟦Reads from searchHistory.json in the db folder
      return JSON.parse(data); //🟦Returns the parsed data
    }
    catch(error){
      console.error(error);
      throw new Error;
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try{
      const data = JSON.stringify(cities, null, 2);
      await fs.writeFile('db/searchHistory.json', data); //🟦Writes the cities array to the searchHistory file
    }
    catch(error){
      console.error(error);
      throw new Error;
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    try {
      const data = await this.read(); //🟦Uses the read method to read history
      return data.map((cityData: any) => new City(cityData.name)); //🟦Creates new instances of the City class
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    try {
      const cities = await this.getCities(); //🟦Gets the search history
      const newCity = new City(city); //🟦Creates a new city which is pushed into the cities array
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
      const index = cities.findIndex((city: City) => city.id === id);
      cities.splice(index, 1); //🟦Uses the splice method to remove the city
      await this.write(cities); //🟦Writes the updated cities to searchHistory.json
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export default new HistoryService();
