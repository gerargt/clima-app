import { Badge } from "@/components/ui/badge";
import { Droplets, Thermometer } from "lucide-react";
import type { ElementType } from "react";
import type { WeatherData } from "@/types/weather";

type WeatherResultCardProps = {
  searched: string;
  weather: WeatherData;
};

type StatCardProps = {
  icon: ElementType;
  label: string;
  value: string;
};

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => (
  <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
    <Icon className="size-4 text-white/40 shrink-0" />
    <div>
      <p className="text-[11px] text-white/40 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  </div>
);

export function WeatherResultCard({ searched, weather }: WeatherResultCardProps) {
  return (
    <div className="w-full flex flex-col gap-4 p-4 rounded-xl bg-gradient-to-br from-indigo-900/80 via-blue-900/60 to-zinc-900">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="uppercase tracking-widest">Ubicación</p>
          <p className="truncate text-2xl font-bold text-white capitalize" title={searched}>
            {searched}
          </p>
        </div>
        <Badge variant="secondary" className="ml-2 shrink-0">
          {weather.desc}
        </Badge>
      </div>

      <div className="flex items-end">
        <p className="text-6xl font-black sm:text-8xl">
          {weather.temp}
          <span className="text-3xl font-light">°C</span>
        </p>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.desc}
          className="size-20 -my-4"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <StatCard icon={Droplets} label="Humedad" value={`${weather.humidity}%`} />
        <StatCard icon={Thermometer} label="Sensación" value={`${weather.feelsLike}°C`} />
      </div>
    </div>
  );
}
