import { NextResponse } from "next/server";
import {
  openWeatherGeoSchema,
  openWeatherCurrentSchema,
} from "@/lib/validations/weather";

export async function GET(request: Request) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta configurar OPENWEATHER_API_KEY en el servidor." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();

  if (!city) {
    return NextResponse.json(
      { error: "Debes enviar una ciudad para buscar." },
      { status: 400 },
    );
  }

  if (city.length < 2) {
    return NextResponse.json(
      { error: "El nombre de la ciudad debe tener al menos 2 caracteres." },
      { status: 400 },
    );
  }

  try {
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`,
      { next: { revalidate: 300 } },
    );

    if (!geoResponse.ok) {
      return NextResponse.json(
        { error: "No se pudo consultar la ciudad." },
        { status: 502 },
      );
    }

    const geoRaw: unknown = await geoResponse.json();
    const geoData = openWeatherGeoSchema.parse(geoRaw);
    const location = geoData[0];

    if (!location) {
      return NextResponse.json(
        { error: "Ciudad no encontrada. Intenta con otro nombre." },
        { status: 404 },
      );
    }

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric&lang=es`,
      { next: { revalidate: 300 } },
    );

    if (!weatherResponse.ok) {
      return NextResponse.json(
        { error: "No se pudo consultar el clima actual." },
        { status: 502 },
      );
    }

    const weatherRaw: unknown = await weatherResponse.json();
    const current = openWeatherCurrentSchema.parse(weatherRaw);
    const weatherItem = current.weather[0];

    const searchedParts = [
      location.name,
      location.state,
      location.country,
    ].filter(Boolean);

    return NextResponse.json({
      searched: searchedParts.join(", "),
      weather: {
        temp: Math.round(current.main.temp),
        humidity: Math.round(current.main.humidity),
        desc: weatherItem.description,
        feelsLike: Math.round(current.main.feels_like),
        icon: weatherItem.icon,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Error inesperado consultando OpenWeatherMap." },
      { status: 500 },
    );
  }
}
