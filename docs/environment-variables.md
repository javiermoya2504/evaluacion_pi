# Variables de entorno

No se deben guardar valores reales ni secretos en Git. Para desarrollo local,
copiar `.env.example` a `.env.local` y reemplazar los valores de ejemplo.

## Aplicacion

| Variable | Obligatoria | Alcance | Descripcion |
| --- | --- | --- | --- |
| `NEXTAUTH_URL` | Si, excepto Vercel | Local, Produccion | URL canonica de la aplicacion. Vercel puede detectarla automaticamente si expone sus variables de sistema. |
| `NEXTAUTH_SECRET` | Si | Local, Preview, Produccion | Secreto largo y aleatorio usado para firmar sesiones de NextAuth. |
| `GOOGLE_CLIENT_ID` | Si | Local, Preview, Produccion | Identificador OAuth 2.0 del cliente de Google. |
| `GOOGLE_CLIENT_SECRET` | Si | Local, Preview, Produccion | Secreto OAuth 2.0 del cliente de Google. |

`AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET` se aceptan como alias de compatibilidad,
pero la configuracion recomendada usa `GOOGLE_CLIENT_ID` y
`GOOGLE_CLIENT_SECRET`.

## GitHub Actions

| Secreto | Obligatorio | Uso |
| --- | --- | --- |
| `JWT_SECRET` | Si | CI lo valida y lo inyecta como `NEXTAUTH_SECRET` durante el build. |

El secreto se configura en **Settings > Secrets and variables > Actions** del
repositorio. No debe agregarse a `.env.example` porque pertenece a CI y su valor
debe permanecer secreto.

## Vercel

La integracion nativa Vercel for GitHub ya esta conectada al repositorio y crea
un Preview Deployment en cada pull request. `NEXTAUTH_SECRET`,
`GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` deben configurarse para los entornos
**Preview** y **Production**. `NEXTAUTH_URL` no necesita definirse en Vercel si
esta activa la opcion **Automatically expose System Environment Variables**.

Este proyecto no necesita `VERCEL_TOKEN`, `VERCEL_ORG_ID` ni
`VERCEL_PROJECT_ID` en GitHub Actions mientras use la integracion nativa. Esas
variables solo serian necesarias si el despliegue se migrara a un workflow
manual con Vercel CLI.
