# Sprint 5 - Backups PostgreSQL

Fecha de revision: 2026-06-21.

## Criterios DevOps

### 1. Script backup pg_dump + rclone -> Google Drive

Estado: completado en codigo, pendiente de configurar secretos reales en el
servidor.

Evidencia versionada:

- `scripts/backup-postgres-to-gdrive.sh`
- `.env.backup.example`

El script usa `pg_dump --format=custom`, comprime el resultado con `gzip` y lo
sube a Google Drive mediante un remote de `rclone`.

Configuracion esperada en el servidor:

```bash
cp .env.backup.example /etc/evaluacion-pi/backup.env
rclone config
BACKUP_ENV_FILE=/etc/evaluacion-pi/backup.env DRY_RUN=1 ./scripts/backup-postgres-to-gdrive.sh
```

El archivo `/etc/evaluacion-pi/backup.env` debe contener `DATABASE_URL`,
`RCLONE_REMOTE`, `RCLONE_BACKUP_PATH`, `BACKUP_DIR` y la retencion local. No se
deben versionar secretos ni credenciales de Google Drive.

### 2. Cron semanal de backup configurado

Estado: completado en codigo, pendiente de instalar en el servidor.

Evidencia versionada:

- `ops/cron/evaluacion-pi-backup.cron`

La programacion incluida ejecuta el backup cada domingo a las 03:00 hora del
servidor:

```cron
0 3 * * 0 BACKUP_ENV_FILE=/etc/evaluacion-pi/backup.env /opt/evaluacion_pi/scripts/backup-postgres-to-gdrive.sh >> /var/log/evaluacion-pi-backup.log 2>&1
```

Instalacion sugerida:

```bash
sudo install -d -m 750 /etc/evaluacion-pi /var/backups/evaluacion-pi/postgres
sudo cp .env.backup.example /etc/evaluacion-pi/backup.env
sudo crontab ops/cron/evaluacion-pi-backup.cron
sudo crontab -l
```

### 3. Probar restore del backup

Estado: probado con PostgreSQL temporal en Docker.

Evidencia versionada:

- `scripts/restore-postgres-backup.sh`

Prueba recomendada sin tocar produccion:

```bash
createdb evaluacion_pi_restore_test
RESTORE_DATABASE_URL=postgresql://usuario:password@localhost:5432/evaluacion_pi_restore_test \
  ./scripts/restore-postgres-backup.sh /var/backups/evaluacion-pi/postgres/evaluacion_pi_YYYYMMDDTHHMMSSZ.dump.gz
psql postgresql://usuario:password@localhost:5432/evaluacion_pi_restore_test -c '\dt'
dropdb evaluacion_pi_restore_test
```

Validacion de entradas sin restaurar:

```bash
RESTORE_DATABASE_URL=postgresql://usuario:password@localhost:5432/evaluacion_pi_restore_test \
  DRY_RUN=1 ./scripts/restore-postgres-backup.sh /ruta/al/backup.dump.gz
```

Evidencia local de restore:

- Imagen usada: `postgres:16-alpine`.
- Contenedor temporal: `evaluacion-pi-sprint5-restore-test`.
- Base origen: `evaluacion_pi`.
- Base destino: `evaluacion_pi_restore_test`.
- Tabla de prueba: `sprint5_restore_check`.
- Filas sembradas antes del backup: 2.
- Comando de backup probado: `pg_dump --format=custom --no-owner --no-acl`.
- Comando de restore probado: `pg_restore --clean --if-exists --no-owner --no-acl`.
- Resultado de verificacion: `SELECT COUNT(*) FROM sprint5_restore_check;` devolvio `2`.
- El contenedor temporal fue eliminado al terminar la prueba.

### 4. Review y merge Sprint 5 a dev

Estado: listo para review, no mergeado.

Como DevOps, el flujo acordado se mantiene:

1. Trabajar en `feature`.
2. Validar scripts, docs, lint, typecheck, tests y build.
3. Abrir PR de `feature` hacia `dev`.
4. Revisar que no haya secretos versionados.
5. Hacer merge a `dev` solo despues de CI aprobado y autorizacion del sprint.
6. No promover a `main` hasta autorizacion explicita del cierre de etapa.

## Checklist operativo

- `pg_dump`, `pg_restore`, `gzip` y `rclone` instalados en el servidor.
- Remote de `rclone` conectado a Google Drive.
- `/etc/evaluacion-pi/backup.env` creado con permisos restrictivos.
- `BACKUP_DIR` fuera del repositorio.
- Cron instalado para el usuario que tenga acceso a `pg_dump` y `rclone`.
- Restore probado contra una base temporal, nunca directo en produccion.
