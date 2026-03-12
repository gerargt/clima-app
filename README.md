# Clima App

Aplicación de clima construida con Next.js que consulta OpenWeatherMap.

## Requisitos

- Node.js 20+
- pnpm

## Configuración inicial

1. Instala dependencias:

```bash
pnpm install
```

2. Crea el archivo `.env.local` en la raíz del proyecto con tu API key:

```env
OPENWEATHER_API_KEY=tu_api_key_aqui
```

## Ejecutar la aplicación

Inicia el servidor de desarrollo:

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Ejecutar pruebas unitarias

Ejecutar todos los tests:

```bash
pnpm test
```

Ejecutar tests con coverage:

```bash
pnpm test:coverage
```

El proyecto está configurado con un umbral mínimo global de cobertura del 80%.
