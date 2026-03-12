"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { WeatherResultCard } from "@/components/weather-result-card";
import { LoadingState } from "@/components/loading-state";
import { ErrorAlert } from "@/components/error-alert";
import { useWeather } from "@/hooks/use-weather";

export default function Home() {
  const {
    city,
    setCity,
    search,
    clearValidationError,
    searched,
    weather,
    isLoading,
    error,
  } = useWeather();

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-6 md:items-center">
      <Card className="w-full max-w-[32rem]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mi Clima App</CardTitle>
          <CardDescription>
            Ingresa una ciudad para consultar el clima
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div>
            <Field orientation="horizontal">
              <InputGroup>
                <InputGroupInput
                  placeholder="Escribe una ciudad..."
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (error) clearValidationError();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      search();
                    }
                  }}
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
              <Button onClick={search} disabled={isLoading}>
                Buscar
              </Button>
            </Field>
          </div>

          <div className="w-full min-h-[250px] max-h-[60vh] overflow-y-auto md:min-h-[275px] md:max-h-[275px]">
            {!weather && !isLoading && !error && (
              <div className="p-10 text-center">
                <p className="text-5xl mb-3 opacity-80">🌍</p>
                <p className="text-xs text-muted-foreground">
                  Ingresa el nombre de una ciudad
                  <br />
                  para ver su clima actual
                </p>
              </div>
            )}

            {error && <ErrorAlert message={error} />}

            {isLoading && <LoadingState text="Consultando clima" />}

            {weather && !isLoading && !error && (
              <WeatherResultCard searched={searched} weather={weather} />
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Datos en tiempo real desde OpenWeatherMap.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
