# Sprint 12 - Cierre de infraestructura y release v1.0.0

## Cumplimiento

| Entregable | Estado | Evidencia |
| --- | --- | --- |
| README de infraestructura completo | Cumplido | `docs/infrastructure-readme.md` |
| Guia de despliegue desde cero | Cumplido | `docs/deployment-vercel-from-zero.md` |
| Runbook v2 con incidencias reales | Cumplido | `docs/runbook-incidents-v2.md` |
| Tag release v1.0.0 | Preparado | Tag anotado `v1.0.0` sobre el commit de cierre |

La documentacion y operacion productiva se orientan exclusivamente a Vercel.
Railway no forma parte de este release.

## Gate del release

1. `pnpm typecheck`, `pnpm test` y `pnpm build` exitosos.
2. CI y Preview Deployment exitosos para el commit etiquetado.
3. Verificacion funcional y de performance contra Preview.
4. Revisión/aprobacion del PR segun la estrategia de ramas.
5. Merge a `main` unicamente con autorizacion expresa.
6. Despues del merge, sincronizacion al repositorio Vercel y validacion de
   produccion.

El tag identifica el candidato estable; no autoriza por si mismo un merge o
deployment productivo.
