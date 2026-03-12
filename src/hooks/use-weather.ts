"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "@/services/weather-service";
import { useState } from "react";
import type { WeatherData } from "@/types/weather";

type UseWeatherReturn = {
  city: string;
  setCity: (city: string) => void;
  search: () => void;
  clearValidationError: () => void;
  searched: string;
  weather: WeatherData | null;
  isLoading: boolean;
  error: string;
};

export function useWeather(): UseWeatherReturn {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [validationError, setValidationError] = useState("");

  const query = useQuery({
    queryKey: ["weather", searchCity],
    queryFn: () => fetchWeather(searchCity),
    enabled: searchCity.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const search = () => {
    const trimmed = city.trim();

    if (!trimmed) {
      setValidationError("Escribe una ciudad para consultar el clima.");
      return;
    }

    if (trimmed.length < 2) {
      setValidationError(
        "El nombre de la ciudad debe tener al menos 2 caracteres.",
      );
      return;
    }

    setValidationError("");

    if (trimmed === searchCity) {
      void query.refetch();
    } else {
      setSearchCity(trimmed);
    }
  };

  const fetchError = query.error instanceof Error ? query.error.message : "";

  return {
    city,
    setCity,
    search,
    clearValidationError: () => setValidationError(""),
    searched: query.data?.searched ?? "",
    weather: query.data?.weather ?? null,
    isLoading: query.isFetching,
    error: validationError || fetchError,
  };
}
