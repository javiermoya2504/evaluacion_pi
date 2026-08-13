# Arquitectura de Persistencia

## Overview

La aplicación utiliza una arquitectura de **almacenamiento adaptativo** que funciona tanto en desarrollo local como en producción (Vercel).

## Desarrollo Local

En desarrollo (cuando `KV_REST_API_URL` no está configurado):
- **Storage**: Archivos JSON en `data/` directory
- **Acceso**: Directo al filesystem
- **Persistencia**: Solo durante la sesión dev, datos se pierden al `git clean`

## Producción (Vercel)

En producción (cuando `KV_REST_API_URL` está configurado):
- **Storage**: Vercel KV (Redis compatible)
- **Acceso**: A través de API HTTP de Vercel
- **Persistencia**: Permanente entre deployments

## Variables de Entorno Requeridas en Vercel

Para que la aplicación persista datos en Vercel, necesitas agregar en Vercel Dashboard:

```
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

Estas variables se generan automáticamente cuando:
1. Vas a Vercel Dashboard
2. Seleccionas tu proyecto
3. Vas a "Storage" → "Vercel KV"
4. Creas una nueva base de datos KV
5. Los tokens se agregan automáticamente a las variables de entorno

## Datos Incluidos

La aplicación inicializa con datos seed cuando se ejecuta por primera vez:

- **Materias**: 5 materias por defecto
- **Equipos**: 2 equipos de demostración
- **Usuarios**: Se crean dinámicamente al registrar

## Migración de Datos

Si necesitas migrar datos de JSON a KV:

1. Ejecutar la app localmente para generar data en JSON
2. Conectar a KV con `KV_REST_API_URL` y `KV_REST_API_TOKEN`
3. Los datos se sincronizarán automáticamente en la siguiente lectura

## Consideraciones

- Vercel KV tiene límites de free tier (ver pricing en Vercel)
- Para apps grandes, considerar Vercel Postgres + Prisma ORM
- Los datos en KV se pueden borrar desde Vercel Dashboard
- Backups: Configurar desde Vercel Settings → Database Backups
