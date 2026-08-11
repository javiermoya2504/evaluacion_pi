# Guia de despliegue en Vercel desde cero

Esta guia crea un ambiente nuevo sin Railway y sin reutilizar secretos en Git.

## 1. Prerrequisitos

- Acceso al repositorio `javiermoya2504/evaluacion_pi`.
- Cuenta/equipo de Vercel con permiso para crear proyectos.
- Proyecto PostgreSQL accesible desde funciones serverless.
- Cliente OAuth de Google y, si aplica, cuenta Resend/SMTP y Redis.
- Node.js 22, Corepack y Git para validar localmente.

## 2. Validar el codigo

```bash
git clone https://github.com/javiermoya2504/evaluacion_pi.git
cd evaluacion_pi
git checkout feature
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

No continuar si alguna validacion falla.

## 3. Crear el proyecto en Vercel

1. En Vercel seleccionar **Add New > Project** e importar el repositorio.
2. Elegir Next.js como framework y la raiz del repositorio como Root Directory.
3. Confirmar los valores versionados en `vercel.json`:
   - Install Command: `corepack enable && pnpm install --frozen-lockfile`.
   - Build Command: `pnpm build`.
4. Conservar `main` como Production Branch. No cambiarla a `feature` o `dev`.
5. Activar las variables de sistema de Vercel si se desea omitir
   `NEXTAUTH_URL`.

## 4. Configurar variables

En **Project Settings > Environment Variables**, crear sin revelar valores:

| Variable | Preview | Production | Condicion |
| --- | --- | --- | --- |
| `NEXTAUTH_SECRET` | Si | Si, valor diferente | Siempre |
| `GOOGLE_CLIENT_ID` | Si | Si | Login Google |
| `GOOGLE_CLIENT_SECRET` | Si | Si | Login Google |
| `NEXTAUTH_URL` | Opcional | Opcional | Solo si no se usan variables de sistema |
| `EMAIL_FROM` | Si | Si | Correo |
| `RESEND_API_KEY` | Si | Si | Si se usa Resend |
| `SMTP_HOST/USER/PASSWORD` | Si | Si | Alternativa SMTP |
| `REDIS_URL` | Si | Si | Si se usa BullMQ |

Consultar `docs/environment-variables.md` para opciones adicionales. Despues
de cambiar una variable siempre se genera un deployment nuevo.

## 5. Configurar Google OAuth

1. Completar y publicar la pantalla de consentimiento en Google Cloud.
2. Crear credenciales OAuth 2.0 de tipo Web application.
3. Registrar cada callback de Preview que se vaya a probar y el productivo:

   ```text
   https://<dominio-productivo>/api/auth/callback/google
   ```

4. Guardar ID y secreto en los ambientes correspondientes de Vercel.

Los dominios Preview cambian; para un flujo estable se recomienda asignar un
dominio de staging a la rama de integracion y autorizar su callback.

## 6. Desplegar y validar Preview

1. Abrir o actualizar un PR desde `feature`; la integracion Git genera Preview.
2. Confirmar que CI y el deployment aparecen exitosos.
3. Validar:

   ```bash
   curl -i https://<preview>/api/health
   BASE_URL=https://<preview> pnpm perf:final
   ```

4. Probar login, permisos, evaluaciones y correo con cuentas/datos de prueba.
5. Revisar Build Logs y Runtime Logs sin copiar secretos.

## 7. Publicar en produccion

Este paso se ejecuta solamente con autorizacion expresa:

1. Aprobar los PR `feature -> dev` y posteriormente `dev -> main` conforme a la
   estrategia del equipo.
2. Confirmar variables Production, callback OAuth y respaldo reciente.
3. Hacer merge a `main`; Vercel despliega automaticamente el mismo commit.
4. Verificar `/api/health`, login y un flujo funcional.
5. Observar Runtime Logs al menos 15 minutos.
6. Sincronizar despues el commit de `main` al repositorio espejo
   `fernandobe1313/evaluacion-pi-vercel`.

## 8. Rollback

Ante una regresion, pausar merges y en **Deployments** seleccionar el ultimo
deployment sano y usar **Promote to Production**. Verificar salud y el flujo
afectado. No revertir migraciones ni restaurar datos sin el responsable de
base de datos. Registrar el evento con el runbook v2.

## Criterio de finalizacion

- CI y Preview exitosos.
- Health check HTTP 200 y flujo critico validado.
- Variables separadas y callback OAuth correcto.
- Monitoreo activo y responsables identificados.
- Produccion y espejo sin cambios hasta contar con autorizacion.
