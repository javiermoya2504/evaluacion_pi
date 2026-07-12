# Sprint 7 - Monitoreo y release

Fecha de revision: 2026-07-12.

## Criterios DevOps

### 1. Monitoreo con UptimeRobot configurado

Estado: completado en codigo, pendiente de ejecutar con credenciales reales de
UptimeRobot.

Evidencia versionada:

- `app/api/health/route.ts`
- `app/api/health/route.test.ts`
- `railway.json`
- `scripts/configure-uptimerobot.mjs`
- `.env.uptimerobot.example`

La aplicacion expone `GET /api/health` para monitoreo externo. La respuesta es
HTTP 200, no cacheable y contiene estado, servicio, ambiente, timestamp y uptime
del proceso.

Railway queda configurado para usar `/api/health` como healthcheck en los
ambientes `dev`, `staging` y `pr`.

Configuracion esperada para UptimeRobot:

```bash
cp .env.uptimerobot.example .env.uptimerobot
# editar .env.uptimerobot con el API key real, URL staging real y contactos
set -a
. ./.env.uptimerobot
set +a
node scripts/configure-uptimerobot.mjs
```

Prueba sin llamar al API:

```bash
DRY_RUN=1 UPTIMEROBOT_MONITOR_URL=https://evaluacion-pi-staging.up.railway.app/api/health UPTIMEROBOT_ALERT_CONTACT_IDS=123456 node scripts/configure-uptimerobot.mjs
```

### 2. Alertas por email si servicio cae

Estado: completado en codigo, pendiente de confirmar contactos reales en la
cuenta de UptimeRobot.

El script requiere `UPTIMEROBOT_ALERT_CONTACT_IDS`. Si no se define al menos un
contacto de alerta, falla antes de crear o actualizar el monitor. Para contactos
de email existentes en UptimeRobot, usar el formato `id_threshold_recurrence`
o solo el `id`; el script normaliza `id` a `id_0_0`.

Checklist de verificacion en UptimeRobot:

1. El contacto de email esta creado y confirmado.
2. `UPTIMEROBOT_ALERT_CONTACT_IDS` contiene el contacto confirmado.
3. El monitor `Evaluacion PI Staging` apunta a `/api/health`.
4. El intervalo es de 300 segundos.
5. La alerta queda asociada al monitor.

### 3. Tag release `v0.2.0`

Estado: version preparada, tag pendiente de crear y publicar despues de la
autorizacion de merge a `main`.

Evidencia versionada:

- `package.json`
- `package-lock.json`

La version del proyecto queda en `0.2.0`. El tag no se crea todavia porque debe
apuntar al commit aprobado de release, no a un commit intermedio de `feature`.

Comandos para el cierre autorizado:

```bash
git checkout main
git pull origin main
git merge --no-ff dev
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin main
git push origin v0.2.0
```

### 4. Demo en staging + merge a main aprobado

Estado: staging listo para demo; merge a `main` pendiente de autorizacion
explicita.

Flujo acordado para este proyecto:

1. Mantener el trabajo del Sprint 7 en `feature`.
2. Validar lint, TypeScript, tests y build.
3. Desplegar staging desde `feature` en Railway.
4. Revisar la demo en la URL publica de staging.
5. Promover hacia `dev` solo despues de aprobacion del sprint.
6. Promover hacia `main` y crear `v0.2.0` solo cuando se autorice el cierre de
   etapa.

## Review de Sprint 7

Revision local esperada antes del PR:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Validacion ejecutada el 2026-07-12:

- `DRY_RUN=1 ... node scripts/configure-uptimerobot.mjs`: completado; normalizo
  el contacto `123456` a `123456_0_0`.
- `corepack pnpm test`: 2 archivos de pruebas, 3 pruebas completadas.
- `corepack pnpm typecheck`: completado.
- `corepack pnpm lint`: completado con 5 warnings existentes no bloqueantes.
- `corepack pnpm build`: completado; Next.js genero `/api/health` como ruta
  dinamica.

Prueba manual esperada despues del despliegue de staging:

```bash
curl -i https://evaluacion-pi-staging.up.railway.app/api/health
```

La respuesta debe ser `200 OK` y contener `"status":"ok"`.
