# Sprint 9 - Email y worker BullMQ

Este sprint migra el entregable de logs desde Railway hacia Vercel para la app
web y deja el procesamiento de correo en un contenedor separado, porque BullMQ
necesita un proceso persistente conectado a Redis.

## Alcance verificado

1. GitHub Secrets debe tener `EMAIL_FROM` y una de estas dos opciones:
   `RESEND_API_KEY` para Resend, o `SMTP_HOST`, `SMTP_USER` y
   `SMTP_PASSWORD` para SMTP. El workflow de CI valida esta configuracion en
   pushes y pull requests internos.
2. `Dockerfile.worker` empaqueta el worker `pnpm worker:email` separado de la
   app Next.js.
3. `compose.yaml` levanta `redis` y `email-worker` junto con frontend/backend
   para pruebas locales.
4. Los logs de email son JSON estructurado por consola con la clave
   `email_event`; en Vercel se filtran en Runtime Logs por `email_event`.
5. El merge de Sprint 9 debe hacerse mediante pull request de `feature` hacia
   `dev`. `main` no se toca hasta autorizacion explicita.

## Variables de entorno

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `EMAIL_PROVIDER` | No | `resend`, `smtp` o `console`. Si se omite, se infiere por secretos disponibles. |
| `EMAIL_FROM` | Si | Remitente verificado, por ejemplo `Evaluacion PI <no-reply@dominio.com>`. |
| `EMAIL_REPLY_TO` | No | Respuesta por defecto. |
| `RESEND_API_KEY` | Si para Resend | API key de Resend. |
| `SMTP_HOST` | Si para SMTP | Host SMTP. |
| `SMTP_PORT` | No | Puerto SMTP. Por defecto `587`. |
| `SMTP_USER` | Si para SMTP | Usuario SMTP. |
| `SMTP_PASSWORD` | Si para SMTP | Password SMTP. |
| `SMTP_SECURE` | No | `true` para TLS directo. |
| `REDIS_URL` | Si en ambientes remotos | Redis compartido por app y worker. |
| `EMAIL_WORKER_CONCURRENCY` | No | Concurrencia del worker. Por defecto `5`. |

## GitHub Secrets

Configurar en `Settings > Secrets and variables > Actions`:

```text
EMAIL_FROM
RESEND_API_KEY
```

Si se usa SMTP en lugar de Resend:

```text
EMAIL_FROM
SMTP_HOST
SMTP_USER
SMTP_PASSWORD
SMTP_PORT
SMTP_SECURE
```

`REDIS_URL` debe vivir en el proveedor donde corra el worker. Solo debe estar en
GitHub Secrets si un workflow futuro ejecuta jobs que encolen o consuman email.

## Vercel

La app sigue desplegando por la integracion nativa Vercel for GitHub. Configurar
las mismas variables de email en Vercel para **Preview** y **Production** cuando
la app vaya a encolar correos desde rutas API o server actions.

Para revisar logs:

1. Abrir el proyecto en Vercel.
2. Ir a **Logs** o **Runtime Logs** del deployment.
3. Filtrar por `email_event`.

El worker BullMQ debe ejecutarse como proceso persistente fuera de las funciones
serverless web. Puede desplegarse con `Dockerfile.worker` en cualquier runtime
de contenedores que soporte procesos long-running y acceso a `REDIS_URL`.
