import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public cityName: string,
    public date: string,
    public icon: string, 
    public temperature: number,
    public humidity: number,
    public windSpeed: number
  ) {}
}
// TODO: Complete the WeatherService class
// TODO: Define the baseURL, API key, and city name properties
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const geocodeUrl = this.buildGeocodeQuery(query);
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    // Assuming the API returns latitude and longitude in the first result
    const { lat, lon } = data[0] || {};
    return { lat, lon };
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geocode?q=${query}&key=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
    private buildWeatherQuery(coordinates: Coordinates): string {
      return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
    }
  
  
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string) {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const data = await response.json();
    return data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any, cityName: string): Weather {
    const { main, weather, wind, dt } = response;
    const temperature = main.temp;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const icon = weather[0]?.icon;
    const date = new Date(dt * 1000).toLocaleString();

    return new Weather(cityName, date, icon, temperature, humidity, windSpeed);
  }


  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast = weatherData.map((data: any) => {
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const icon = data.weather[0]?.icon;
    const date = new Date(data.dt * 1000).toLocaleString();

    return new Weather(currentWeather.cityName, date, icon, temperature, humidity, windSpeed);
    });

    return forecast;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData, city);
      const forecastArray = this.buildForecastArray(currentWeather, weatherData.list || []);
      return { currentWeather, forecastArray };
    } catch (error) {
      console.error('Error getting weather:', error);
      throw new Error('Unable to fetch weather data.');
    }
  }
}

export default new WeatherService();
