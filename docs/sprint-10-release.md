# Sprint 10 - Documentacion, performance y release

## Estado

| Criterio | Estado | Evidencia |
| --- | --- | --- |
| Swagger UI accesible en `/api/docs` | Implementado | `app/api/docs/route.ts` y OpenAPI en `/api/docs/openapi` |
| Performance test final del sistema completo | Implementado | `tests/performance/k6-final.js` |
| Secrets actualizados en produccion | Requiere validacion operativa | Checklist de Vercel incluido abajo |
| Review y merge Sprint 10 a `dev` | Pendiente hasta que CI y review aprueben | PR `feature` -> `dev` |

## Prueba final de performance

La prueba cubre salud, Swagger/OpenAPI, login y, cuando se proporciona un JWT,
las lecturas autenticadas de todos los modulos. Usa carga gradual y exige menos
de 1% de errores, mas de 99% de checks exitosos y p95 global menor a 750 ms.

```bash
BASE_URL=https://preview.example.vercel.app pnpm perf:final
```

Para probar todo el flujo autenticado:

```bash
BASE_URL=https://preview.example.vercel.app API_TOKEN=<jwt> pnpm perf:final
```

Guardar el resumen de k6 como evidencia del sprint. La ejecucion final debe
apuntar al Preview Deployment del commit que se revisara, nunca a produccion.

## Checklist de secrets en Vercel Production

La revision confirma nombres, alcance y fecha de rotacion, pero nunca expone
valores. En **Project Settings > Environment Variables**, comprobar:

- `NEXTAUTH_SECRET`: Production, valor distinto a Preview y rotado.
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`: Production y callback OAuth del
  dominio productivo.
- `EMAIL_FROM` y `RESEND_API_KEY`, o bien `SMTP_HOST`, `SMTP_USER` y
  `SMTP_PASSWORD`: Production.
- `REDIS_URL`: Production si el worker BullMQ esta activo.
- `NEXTAUTH_URL`: solo si no se exponen automaticamente las variables de
  sistema de Vercel.

Despues de cambiar una variable se debe crear un nuevo deployment; los
deployments existentes no reciben el valor actualizado. Registrar solamente
nombre, alcance, responsable y fecha de verificacion.

## Gate de merge a dev

1. Ejecutar `pnpm typecheck`, `pnpm test` y `pnpm build`.
2. Ejecutar `pnpm perf:final` contra el Preview Deployment.
3. Confirmar el checklist de Production sin copiar valores secretos.
4. Revisar y aprobar el PR `feature` -> `dev`.
5. Hacer merge a `dev`. No promover ni fusionar a `main` sin autorizacion.
