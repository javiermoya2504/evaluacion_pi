# Sprint 11 - Checklist final de seguridad

Fecha de revision tecnica: 2026-08-11

Alcance: rama `feature`, aplicacion Next.js desplegada en Vercel

Version: 1.0

## Resultado

La revision tecnica queda **aprobada con seguimiento**. Los controles exigidos
para el cierre estan implementados y no se identificaron secretos reales en los
archivos versionados. Permanecen dos riesgos aceptados que deben vigilarse:

1. El rate limiting usa memoria del proceso y no comparte estado entre
   instancias serverless. Si el riesgo o el trafico aumentan, debe migrarse a un
   almacen compartido compatible con Vercel, como Upstash Redis.
2. La CSP actual permite `unsafe-inline` y `unsafe-eval` por compatibilidad con
   la aplicacion. Su endurecimiento requiere una prueba funcional separada con
   nonces o hashes.

## Checklist

| Control | Estado | Evidencia o verificacion |
| --- | --- | --- |
| HTTPS y HSTS | Cumple | Vercel sirve HTTPS y `next.config.mjs` configura HSTS |
| CSP, anti-clickjacking y MIME sniffing | Cumple con riesgo aceptado | `next.config.mjs`; CSP documentada arriba |
| Politica de permisos y referrer | Cumple | `Permissions-Policy` y `Referrer-Policy` globales |
| Autenticacion y sesiones | Cumple | NextAuth, JWT y secreto obligatorio en `lib/auth.ts` |
| Autorizacion por rol | Cumple | Middleware y controles de rol en rutas protegidas |
| Validacion de entradas | Cumple | Esquemas Zod en `lib/validations/` y rutas API |
| Hash de contrasenas | Cumple | `bcryptjs`; no se almacenan contrasenas en texto plano |
| Rate limiting | Cumple con riesgo aceptado | Politicas diferenciadas para autenticacion y API; excepcion operativa documentada arriba |
| Health check sin datos sensibles | Cumple | `GET /api/health`; solo publica estado operativo |
| Health check sin cache | Cumple | `Cache-Control: no-store, max-age=0` y prueba automatizada |
| Secretos fuera del repositorio | Cumple | Solo archivos `.env.*.example`; valores reales en Vercel |
| Separacion Preview/Production | Cumple en configuracion | Variables separadas por ambiente en Vercel; verificar valores en dashboard |
| Dependencias bloqueadas | Cumple | `pnpm-lock.yaml` y `--frozen-lockfile` en `vercel.json` |
| CI de calidad y seguridad basica | Cumple | lint, TypeScript, tests y build en `.github/workflows/ci.yml` |
| Logs sin secretos | Cumple en codigo | Errores genericos y eventos estructurados; verificar Runtime Logs durante incidentes |
| Rollback documentado | Cumple | `docs/runbook-incidents-v1.md` usa Promote/Redeploy de Vercel |
| Railway fuera de la operacion vigente | Cumple | El runbook y el despliegue de Sprint 11 usan Vercel; documentos historicos de Railway no son operativos |

## Verificacion antes de firmar

Ejecutar sobre el commit candidato de `feature`:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

En el Preview Deployment del mismo commit:

```bash
curl -i https://<preview>.vercel.app/api/health
```

Se espera HTTP `200`, `status: "ok"` y `Cache-Control` con `no-store`. La
revision de Vercel debe comprobar solo nombres, alcance y fecha de rotacion de
variables; nunca copiar valores secretos a este documento o al PR.

## Registro de firma

La aprobacion del PR de Sprint 11 funciona como firma electronica trazable. No
se debe marcar el cierre como firmado sin esa aprobacion humana.

| Rol | Identidad | Estado | Evidencia |
| --- | --- | --- | --- |
| Ejecucion tecnica DevOps | Codex, por encargo del responsable DevOps | Completada el 2026-08-11 | Commit y resultados de CI del PR |
| Responsable DevOps | Por registrar | Pendiente de aprobacion | Review aprobatorio en GitHub |
| Revisor del proyecto | Por registrar | Pendiente de aprobacion | Review aprobatorio en GitHub |

## Criterio de cierre

El entregable se considera **firmado** cuando el PR tenga al menos la aprobacion
del responsable DevOps, los checks obligatorios esten en verde y este archivo
forme parte del commit aprobado. No requiere ni autoriza merge a `main`.
