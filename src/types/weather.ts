export type WeatherData = {
  temp: number;
  humidity: number;
  desc: string;
  feelsLike: number;
  icon: string;
};

export type WeatherResponse = {
  searched: string;
  weather: WeatherData;
};

export type WeatherErrorResponse = {
  error: string;
};
