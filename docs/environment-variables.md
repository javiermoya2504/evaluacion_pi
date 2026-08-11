# Variables de entorno

No se deben guardar valores reales ni secretos en Git. Para desarrollo local,
copiar `.env.example` a `.env.local` y reemplazar los valores de ejemplo.

Para Sprint 4 se agregaron ejemplos separados por ambiente:

- `.env.development.example`: desarrollo local/dev.
- `.env.staging.example`: staging/preview en Vercel.
- `.env.backup.example`: backup PostgreSQL y subida a Google Drive con
  `rclone`.

## Aplicacion

| Variable | Obligatoria | Alcance | Descripcion |
| --- | --- | --- | --- |
| `APP_ENV` | No | Local, Dev, Staging | Nombre interno del ambiente. Usar `development` o `staging`. |
| `NEXT_PUBLIC_APP_ENV` | No | Local, Dev, Staging | Nombre del ambiente visible en el cliente. No debe contener secretos. |
| `NEXTAUTH_URL` | Si, excepto Vercel | Local, Dev, Staging, Produccion | URL canonica de la aplicacion. En Vercel puede omitirse si se usan variables de sistema automaticas. |
| `NEXTAUTH_SECRET` | Si | Local, Dev, Staging, Preview, Produccion | Secreto largo y aleatorio usado para firmar sesiones de NextAuth. Debe ser distinto por ambiente. |
| `GOOGLE_CLIENT_ID` | Si | Local, Dev, Staging, Preview, Produccion | Identificador OAuth 2.0 del cliente de Google. |
| `GOOGLE_CLIENT_SECRET` | Si | Local, Dev, Staging, Preview, Produccion | Secreto OAuth 2.0 del cliente de Google. |

## Email

| Variable | Obligatoria | Alcance | Descripcion |
| --- | --- | --- | --- |
| `EMAIL_PROVIDER` | No | Local, Preview, Produccion, Worker | `console`, `resend` o `smtp`. Si se omite se infiere por secretos disponibles. |
| `EMAIL_FROM` | Si | Preview, Produccion, Worker | Remitente verificado. |
| `EMAIL_REPLY_TO` | No | Preview, Produccion, Worker | Correo de respuesta por defecto. |
| `RESEND_API_KEY` | Si para Resend | GitHub Secrets, Vercel, Worker | API key de Resend. |
| `SMTP_HOST` | Si para SMTP | GitHub Secrets, Vercel, Worker | Host del proveedor SMTP. |
| `SMTP_PORT` | No | GitHub Secrets, Vercel, Worker | Puerto SMTP. Por defecto `587`. |
| `SMTP_USER` | Si para SMTP | GitHub Secrets, Vercel, Worker | Usuario SMTP. |
| `SMTP_PASSWORD` | Si para SMTP | GitHub Secrets, Vercel, Worker | Password SMTP. |
| `SMTP_SECURE` | No | GitHub Secrets, Vercel, Worker | `true` para TLS directo. |
| `REDIS_URL` | Si para colas remotas | Vercel, Worker | Redis compartido por la app y el worker BullMQ. |
| `EMAIL_WORKER_CONCURRENCY` | No | Worker | Numero de jobs concurrentes. Por defecto `5`. |

`AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET` se aceptan como alias de compatibilidad,
pero la configuracion recomendada usa `GOOGLE_CLIENT_ID` y
`GOOGLE_CLIENT_SECRET`.

## GitHub Actions

| Secreto | Obligatorio | Uso |
| --- | --- | --- |
| `JWT_SECRET` | Si | CI lo valida y lo inyecta como `NEXTAUTH_SECRET` durante el build. |
| `EMAIL_FROM` | Si | CI valida que exista remitente para Sprint 9. |
| `RESEND_API_KEY` | Alternativa | CI acepta Resend como proveedor de email. |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` | Alternativa | CI acepta SMTP si no hay `RESEND_API_KEY`. |

El secreto se configura en **Settings > Secrets and variables > Actions** del
repositorio. No debe agregarse a `.env.example` porque pertenece a CI y su valor
debe permanecer secreto.

## Backups PostgreSQL

| Variable | Obligatoria | Alcance | Descripcion |
| --- | --- | --- | --- |
| `DATABASE_URL` | Si, salvo que se usen variables `PG*` | Servidor de backup | URL de conexion leida por `pg_dump` y `pg_restore`. |
| `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` | Alternativa | Servidor de backup | Variables nativas de PostgreSQL si no se define `DATABASE_URL`. |
| `RCLONE_REMOTE` | Si | Servidor de backup | Nombre del remote de `rclone` configurado contra Google Drive. |
| `RCLONE_BACKUP_PATH` | Si | Servidor de backup | Carpeta destino dentro del remote de Google Drive. |
| `BACKUP_DIR` | No | Servidor de backup | Ruta local temporal para guardar dumps antes de subirlos. |
| `BACKUP_PREFIX` | No | Servidor de backup | Prefijo del archivo generado. |
| `BACKUP_RETENTION_DAYS` | No | Servidor de backup | Dias de retencion de backups locales. |
| `RESTORE_DATABASE_URL` | Si para restore | Servidor de prueba | Base destino para probar restauraciones. No debe apuntar a produccion. |

Estas variables deben vivir fuera del repositorio, por ejemplo en
`/etc/evaluacion-pi/backup.env`, y cargarse con `BACKUP_ENV_FILE`.

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

Para Sprint 9, configurar `EMAIL_FROM` y `RESEND_API_KEY` o SMTP en los
entornos **Preview** y **Production**. Los logs de email se emiten como JSON con
`email_event` para filtrarlos desde Runtime Logs.

Ver tambien:

- [Sprint 9 - Email y worker BullMQ](sprint-9-email-worker.md)
- [Sprint 4 - Buffer](sprint-4-buffer.md)
- [Sprint 5 - Backups PostgreSQL](sprint-5-backups.md)
