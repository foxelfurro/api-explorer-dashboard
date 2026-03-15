# API Explorer Dashboard

Panel web oficial para operar el backend de inventario, catálogo y ventas.

## Estado de la versión

**Versión oficial actual: 1.0.0**

## Funcionalidades

- Inicio de sesión con JWT.
- Catálogo de administración (listar, crear y editar productos).
- Exploración de catálogo para vendedores.
- Inventario de vendedor (listar y editar stock/precio personalizado).
- Registro de ventas.

## Requisitos

- Node.js 18+
- npm 9+

## Configuración con `.env`

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Configura tus variables:

- `VITE_API_BASE_URL`: URL del backend que expone los endpoints (la usa este frontend).
- `DATABASE_URL`: URL de la base de datos para referencia de backend/infra.

> Si `VITE_API_BASE_URL` está definido, la app lo usa como base por defecto.
> También puedes sobreescribirlo desde la pantalla de login, valor que se guarda en `localStorage`.

## Ejecutar en local

```bash
npm install
npm run dev
```

## Comandos útiles

```bash
npm run lint
npm run test
npm run build
```

## Nota importante

Este frontend consume los endpoints del backend existentes y **no modifica contratos ni rutas de API**.
