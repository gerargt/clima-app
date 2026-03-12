import { z } from "zod";

export const weatherDataSchema = z.object({
  temp: z.number(),
  humidity: z.number(),
  desc: z.string(),
  feelsLike: z.number(),
  icon: z.string(),
});

export const weatherResponseSchema = z.object({
  searched: z.string(),
  weather: weatherDataSchema,
});

export const openWeatherGeoSchema = z.array(
  z.object({
    name: z.string(),
    lat: z.number(),
    lon: z.number(),
    state: z.string().optional(),
    country: z.string(),
  }),
);

export const openWeatherCurrentSchema = z.object({
  weather: z
    .array(
      z.object({
        description: z.string(),
        icon: z.string(),
      }),
    )
    .min(1),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
  }),
});
