import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// TODO: Define a City class with name and id properties
class City {
  constructor(
    public id: string,
    public name: string)
    {}
}
// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.resolve(__dirname, 'searchHistory.json');
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      const cities = JSON.parse(data);
      return cities.map((city: any) => new City(city.id, city.name)); // Convert plain objects to City instances
    } catch (error) {
      if (error.code === 'ENOENT') {
        // If the file doesn't exist, return an empty array
        return [];
      }
      throw error;
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write(cities: City[]): Promise<void> {
    const jsonData = JSON.stringify(cities, null, 2); // Pretty print the JSON
    await fs.promises.writeFile(this.filePath, jsonData, 'utf-8');
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  async addCity(city: string): Promise<void> {
    const cities = await this.read();
    const id = uuidv4();
    cities.push(new City(id, city));
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const index = cities.findIndex(city => city.id === id);
    if (index === -1) {
      throw new Error('City not found');
    }
    cities.splice(index, 1);
    await this.write(cities);
  }
}

export default new HistoryService();
