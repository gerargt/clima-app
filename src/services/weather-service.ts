import { weatherResponseSchema } from "@/lib/validations/weather";
import type { WeatherResponse } from "@/types/weather";

export async function fetchWeather(city: string): Promise<WeatherResponse> {
  const response = await fetch(
    `/api/weather?city=${encodeURIComponent(city)}`,
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: null }));

    if (response.status === 404) {
      throw new Error(
        "Ciudad no encontrada. Verifica el nombre e intenta de nuevo.",
      );
    }

    if (response.status === 429) {
      throw new Error("Demasiadas consultas. Intenta de nuevo en un momento.");
    }

    throw new Error(
      (data as { error?: string }).error ??
        "No se pudo consultar el clima.",
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("Respuesta inválida del servidor.");
  }

  try {
    return weatherResponseSchema.parse(data);
  } catch {
    throw new Error("Respuesta inválida del servidor.");
  }
}
