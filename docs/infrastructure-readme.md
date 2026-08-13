# Infraestructura de Evaluacion PI

Version: 1.0.0

Plataforma de aplicacion: Vercel (no Railway)

## Arquitectura

La aplicacion es un monolito full-stack de Next.js 16. Las paginas y rutas de
`app/api` se compilan y despliegan juntas en Vercel. La integracion Git de
Vercel construye un Preview por pull request; produccion corresponde
exclusivamente a `main` y requiere autorizacion del responsable del proyecto.

| Componente | Implementacion | Operacion |
| --- | --- | --- |
| Web y API | Next.js App Router sobre Vercel | `pnpm build`; salud en `/api/health` |
| Autenticacion | NextAuth/Google OAuth y JWT propio | Secretos separados por ambiente |
| Datos | PostgreSQL externo | Conexion mediante variables; backups fuera de Vercel |
| Correo | Resend o SMTP | Logs JSON; nunca registrar contenido sensible |
| Cola | BullMQ con Redis | El worker es un proceso persistente externo a Vercel |
| Monitoreo | UptimeRobot y Runtime Logs | Sondeo de `/api/health` |
| CI | GitHub Actions | lint, tipos, tests y build |

## Flujo de ambientes

| Rama | Ambiente | Regla |
| --- | --- | --- |
| `feature` | Preview | Integracion continua y validacion del sprint |
| `dev` | Preview/staging | Integracion aprobada entre disciplinas |
| `main` | Production | Merge y despliegue solo con autorizacion expresa |

El repositorio principal es `javiermoya2504/evaluacion_pi`. El repositorio
`fernandobe1313/evaluacion-pi-vercel` se sincroniza despues del merge autorizado
a `main`; no es la fuente primaria durante el desarrollo del sprint.

## Configuracion reproducible

- Node.js 22 y pnpm 10.11.0.
- `vercel.json` fija framework, instalacion congelada y comando de build.
- `pnpm-lock.yaml` es la fuente de versiones reproducibles.
- `.github/workflows/ci.yml` valida pushes y pull requests.
- `next.config.mjs` habilita artefacto standalone, cache y headers de seguridad.
- Los Dockerfiles y `compose.yaml` se conservan para desarrollo/validacion
  local; no describen el runtime productivo.

## Secretos y configuracion

Nunca se guardan valores reales en Git. La matriz completa esta en
[`environment-variables.md`](environment-variables.md). Como minimo, Vercel
requiere `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`; correo
requiere `EMAIL_FROM` y Resend o SMTP. `REDIS_URL` se configura cuando la cola
esta activa. Los valores de Preview y Production deben estar aislados.

La integracion Git nativa no requiere `VERCEL_TOKEN`, `VERCEL_ORG_ID` ni
`VERCEL_PROJECT_ID`. Si se adopta despliegue por CLI, esos tres valores se
guardan como secretos de CI, nunca en el repositorio.

## Operacion y continuidad

- Disponibilidad: `GET /api/health`, sin cache.
- Incidentes: seguir [`runbook-incidents-v2.md`](runbook-incidents-v2.md).
- Rollback: promover en Vercel el ultimo deployment sano ya validado.
- Backups: `scripts/backup-postgres-to-gdrive.sh` y cron documentado; probar la
  restauracion en una base no productiva.
- Worker: BullMQ necesita un host de procesos persistentes; una funcion de
  Vercel no sustituye al worker.

## Responsabilidades

DevOps administra Vercel, CI, variables, monitoreo y releases; Desarrollo
mantiene la aplicacion y pruebas; Datos administra PostgreSQL, migraciones y
restauracion; el responsable del proyecto autoriza cualquier paso a `main`.

## Comandos de verificacion

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

La instalacion detallada esta en
[`deployment-vercel-from-zero.md`](deployment-vercel-from-zero.md).
