# Runbook de incidencias v2

Fecha: 2026-08-11

Plataforma: Vercel

Servicio: Evaluacion PI

Salud: `GET /api/health`

## Uso y severidad

Este documento reemplaza operativamente al runbook v1 y conserva su alcance:
deployment, disponibilidad, autenticacion, datos, correo y configuracion.

| Nivel | Impacto | Objetivo de respuesta |
| --- | --- | --- |
| SEV-1 | Produccion caida o datos expuestos/perdidos | Inmediato; congelar cambios |
| SEV-2 | Funcion critica degradada para varios usuarios | Menos de 30 minutos |
| SEV-3 | Preview o funcion parcial con alternativa | Mismo dia laboral |

Un incident commander coordina; DevOps revisa Vercel y rollback; Desarrollo
diagnostica codigo; Datos controla migraciones/restauraciones. Nunca registrar
tokens, cookies, cadenas de conexion, datos personales ni contenido de correo.

## Flujo comun

1. Registrar hora UTC, URL, ambiente, deployment, commit, sintomas y alcance.
2. Consultar `/api/health`, Deployment/Build Logs y Runtime Logs.
3. Asignar severidad, congelar cambios relacionados y nombrar responsables.
4. Contener: promover el ultimo deployment sano o desactivar el flujo afectado.
5. Corregir en `feature`, validar CI y Preview; no pasar a `main` sin permiso.
6. Confirmar recuperacion funcional y observar 15 min (SEV-2) o 30 min
   (SEV-1).
7. Documentar causa raiz y acciones con responsable/fecha en menos de 48 h.

## Incidencias reales del proyecto

Los siguientes casos provienen del historial del repositorio. Se documentan
como evidencia operativa; no implican que hayan afectado produccion.

### INC-001: rate limit bloqueo la prueba k6 de salud y Swagger

- Evidencia: commits `2dafff6`, `184036f` y `3a28d9e` del repositorio espejo.
- Sintoma: la validacion repetitiva de `/api/health` y `/api/docs` recibia
  limitacion, generando fallos que no representaban degradacion del servicio.
- Causa: middleware de rate limit aplicado tambien a endpoints publicos usados
  para salud y documentacion.
- Correccion aplicada: excluir salud y Swagger del rate limit y volver a
  ejecutar la prueba final.
- Prevencion: mantener una prueba que compruebe HTTP 200 repetido en ambos
  endpoints y revisar excepciones al modificar middleware.
- Respuesta: distinguir `429` de `5xx`, comprobar el commit desplegado y hacer
  rollback si una regla nueva vuelve a bloquear observabilidad.

### INC-002: script k6 uso nombres reservados

- Evidencia: commit `c95603d` (`fix: evita variables reservadas de k6`).
- Sintoma: la prueba no iniciaba o producia un error de ejecucion antes de
  generar metricas utiles.
- Causa: variables del script colisionaban con identificadores reservados de
  k6.
- Correccion aplicada: renombrar los identificadores y repetir la validacion.
- Prevencion: ejecutar `pnpm perf:final` contra Preview antes del gate y guardar
  su resumen como evidencia.
- Respuesta: confirmar que el fallo es del runner, no de Vercel; conservar el
  deployment y corregir la prueba en `feature`.

### INC-003: validacion final de performance incompleta

- Evidencia: commit `4c1e039` (`fix: completa validacion final de performance`).
- Sintoma: el criterio del sprint podia declararse sin cubrir todos los checks
  finales esperados.
- Causa: gate de performance incompleto en la primera entrega.
- Correccion aplicada: completar la prueba final antes de integrar.
- Prevencion: exigir umbrales versionados, URL Preview y evidencia del mismo
  commit revisado.
- Respuesta: detener el merge, identificar el check faltante, completar la
  prueba y no reutilizar resultados de otro commit.

## Diagnostico rapido por escenario

### Deployment fallido

Localizar el primer error en Build Logs y reproducir con `pnpm install
--frozen-lockfile`, `pnpm typecheck`, `pnpm test` y `pnpm build`. Revisar Node,
pnpm, lockfile y variables por nombre, sin mostrar valores.

### Errores 5xx o autenticacion

Correlacionar ruta/hora/deployment. Confirmar `NEXTAUTH_SECRET`, callback OAuth
y dominio. Probar con cuenta de prueba. No registrar JWT, cookies ni codigos.

### Datos, correo o cola

Confirmar proveedor y limites de conexiones antes de tocar esquemas. Para
correo, revisar eventos JSON y configuracion Resend/SMTP. Para BullMQ, revisar
Redis y el worker persistente externo. Reintentar solo trabajos idempotentes.

## Plantilla de cierre

```text
ID / severidad:
Inicio, deteccion y recuperacion (UTC):
Ambiente / deployment / commit:
Impacto:
Causa raiz y factores contribuyentes:
Contencion y recuperacion:
Validacion posterior:
Acciones (responsable y fecha):
```

## Checklist

- [ ] Servicio y flujo afectado recuperados.
- [ ] Deployment/commit sanos identificados.
- [ ] Secretos potencialmente expuestos revocados y rotados.
- [ ] Salud y monitoreo sin cache verificados.
- [ ] Interesados informados.
- [ ] Evidencia, timeline y acciones registrados.
