# Vercel Deployment Checklist

## Estado Actual
✅ Build local: exitoso
✅ TypeScript: sin errores
✅ ESLint: solo warnings preexistentes
✅ APIs: todas probadas y funcionando
✅ Storage: implementado con adaptador (JSON local, KV en producción)

## PASO 1: Crear Proyecto en Vercel

1. Ve a https://vercel.com/new
2. Selecciona el repositorio `evaluacion_pi`
3. Selecciona rama `sprint11-auth` (o `main`)
4. Configura el proyecto

## PASO 2: Configurar Variables de Entorno en Vercel Dashboard

**Production Environment:**

| Variable | Valor | Notas |
|----------|-------|-------|
| `NEXTAUTH_URL` | `https://tu-dominio.vercel.app` | Cambiar a tu dominio real |
| `NEXTAUTH_SECRET` | `(genera uno seguro)` | Usar `openssl rand -base64 32` |
| `JWT_SECRET` | `(genera uno seguro)` | Distinto de NEXTAUTH_SECRET |
| `JWT_EXPIRES_IN` | `7d` | Tiempo de expiración de token |
| `GOOGLE_CLIENT_ID` | `(tu Google OAuth ID)` | Desde Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | `(tu Google OAuth Secret)` | Desde Google Cloud Console |
| `EMAIL_PROVIDER` | `resend` o `console` | `console` para testing |
| `EMAIL_FROM` | `"App <noreply@example.com>"` | Email válido de tu dominio |
| `RESEND_API_KEY` | `(tu API key)` | Opcional si usas console |
| `REDIS_URL` | `(desde Upstash)` | Para worker email (opcional) |

**Preview Environment:**
Las mismas variables que Production (Vercel las copia por defecto)

**Development Environment:**
No es necesario en Vercel

## PASO 3: Configurar Vercel KV

1. En Vercel Dashboard, ve a tu proyecto
2. Selecciona "Storage" → "Create Database"
3. Selecciona "Vercel KV"
4. Confirma el nombre y región
5. Las variables se agregan automáticamente:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

## PASO 4: Configurar Email (Opcional)

### Opción A: Resend (Recomendado)
1. Ve a https://resend.com
2. Crea una cuenta
3. Obtén tu API Key
4. Agregala como `RESEND_API_KEY` en Vercel
5. Configura email "From" válido verificado en Resend

### Opción B: Console (Testing)
1. Establece `EMAIL_PROVIDER=console` 
2. Los emails se mostrarán en logs de Vercel

### Opción C: SMTP
1. Configura variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
2. Establece `EMAIL_PROVIDER=smtp`

## PASO 5: Google OAuth (Opcional)

1. Ve a https://console.cloud.google.com
2. Crea un proyecto
3. Habilita "Google+ API"
4. Crea credenciales OAuth 2.0 (Aplicación web)
5. Agrega "Authorized redirect URIs":
   - `https://tu-dominio.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (para local)
6. Obtén Client ID y Secret
7. Agrega como `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`

## PASO 6: Desplegar

1. Confirma todas las variables en Vercel Dashboard
2. Click "Deploy" o espera a que se construya automáticamente
3. Espera a que el build termine (5-10 minutos)

## PASO 7: Verificar Deployment

1. Abre tu URL en Vercel
2. Intenta registrarte: `/register`
3. Intenta iniciar sesión: `/login`
4. Accede a `/dashboard`
5. Verifica que los datos persisten (recarga la página)

## Troubleshooting

### "Error: JWT_SECRET no está configurado"
- Verifica que `JWT_SECRET` está en Vercel Environment Variables
- Redeploya después de agregar

### "Error: Vercel KV no disponible"
- Verifica que creaste Vercel KV en Storage
- Verifica que `KV_REST_API_URL` y `KV_REST_API_TOKEN` están presentes

### "401 Credenciales incorrectas"
- Registra un usuario nuevo primero
- Usa email/password correctos
- Verifica que se guardó en KV

### "Datos no persisten"
- Verifica que `KV_REST_API_URL` está configurado
- Revisa logs en Vercel Runtime Logs
- Prueba despliegue con `vercel env pull`

## Rollback

Si algo falla:

```bash
# Revertir a deployment anterior
vercel rollback

# O volver a latest main
git push origin sprint11-auth:main  # NO HAGAS ESTO, solo si necesario
```

## Monitoreo

1. Vercel Dashboard: Revisar status y metricas
2. Logs: Vercel → Functions → Runtime Logs
3. Uptime: Configura UptimeRobot en Settings

## Notas

- Datos se persisten en Vercel KV entre deployments
- Vercel KV tiene plan free generoso
- Si necesitas datos borrados, ve a Storage → Delete Database
- No exposer JWT_SECRET ni NEXTAUTH_SECRET en Git
