# Sprint 6 - Seguridad API y headers

Fecha de revision: 2026-06-28.

## Criterios DevOps

### 1. Security headers con Next.js headers

Estado: completado.

Evidencia versionada:

- `next.config.mjs`

La aplicacion usa `headers()` de Next.js para aplicar encabezados de seguridad
en todas las rutas:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `X-DNS-Prefetch-Control`

La CSP queda como politica base compatible con la aplicacion Next.js actual. Si
mas adelante se endurece con nonces o hashes, debe validarse contra el build y
los flujos reales de login/dashboard.

### 2. Rate limiting en `/api/*`

Estado: completado.

Evidencia versionada:

- `middleware.ts`

El middleware aplica rate limiting antes de procesar cualquier ruta `/api/*`.
La politica actual es:

- `/api/auth/*`: 20 solicitudes por minuto por IP.
- Resto de `/api/*`: 100 solicitudes por minuto por IP.
- Respuesta al exceder limite: HTTP `429` con `Retry-After`.
- Headers de observabilidad: `X-RateLimit-Limit`,
  `X-RateLimit-Remaining` y `X-RateLimit-Reset`.

Nota operativa: el limitador en memoria cubre el requisito basico del sprint.
Para produccion distribuida con varias instancias, se recomienda migrarlo a un
backend compartido como Redis o Upstash.

### 3. Checklist OWASP basico completado

Estado: completado.

| Control | Estado | Evidencia |
| --- | --- | --- |
| Encabezados de seguridad HTTP | Completado | `next.config.mjs` |
| Anti-clickjacking | Completado | `X-Frame-Options: DENY` y `frame-ancestors 'none'` |
| MIME sniffing deshabilitado | Completado | `X-Content-Type-Options: nosniff` |
| HTTPS reforzado | Completado | `Strict-Transport-Security` |
| Politica de permisos del navegador | Completado | `Permissions-Policy` |
| Rate limiting API | Completado | `middleware.ts` |
| Rate limiting login/registro | Completado | `/api/auth/*` con limite mas estricto |
| Validacion de entrada | Completado | Zod en `lib/validations` y rutas API |
| Autenticacion en API protegida | Completado | `middleware.ts` y `lib/middleware/role.ts` |
| Autorizacion por rol | Completado | `ROLE_PROTECTED_ROUTES` y `withRoles` |
| Secretos fuera del repo | Completado | `.env.*.example` sin valores reales |
| Hash de contrasenas | Completado | `bcryptjs` con rondas configuradas |
| JWT con secreto obligatorio | Completado | `getJwtSecret()` falla si no hay secreto |
| Mensajes de error genericos en login | Completado | Login no revela si email existe |
| CI para lint, typecheck, tests y build | Completado | `.github/workflows/ci.yml` |

## Review de Sprint 6

Revision local esperada antes del PR:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Validacion ejecutada el 2026-06-28:

- `pnpm lint`: sin errores, 5 warnings existentes no bloqueantes.
- `pnpm typecheck`: completado.
- `pnpm test`: 1 archivo de pruebas, 2 pruebas completadas.
- `pnpm build`: completado.
- Prueba HTTP local con `next dev`: `/login` respondio `200` con CSP y
  `X-Frame-Options: DENY`.
- Prueba HTTP local de `/api/auth/login`: al exceder 20 solicitudes por minuto
  respondio `429` con `Retry-After`, `X-RateLimit-Limit`,
  `X-RateLimit-Remaining` y `X-RateLimit-Reset`.

Estado del merge a `dev`: listo para review, no mergeado desde esta rama.

Flujo acordado:

1. Mantener el trabajo del sprint en `feature`.
2. Validar lint, TypeScript, tests y build.
3. Abrir PR de `feature` hacia `dev`.
4. Revisar cambios de seguridad y confirmar que no haya secretos versionados.
5. Hacer merge a `dev` despues de CI aprobado y autorizacion del sprint.
6. No promover a `main` hasta autorizacion explicita del cierre de etapa.
