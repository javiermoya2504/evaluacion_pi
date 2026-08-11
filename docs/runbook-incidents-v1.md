# Runbook de incidencias v1

Fecha: 2026-08-11

Plataforma: Vercel

Servicio: Evaluacion PI

Endpoint de salud: `GET /api/health`

## Objetivo y alcance

Este runbook guia la deteccion, contencion, recuperacion y cierre de incidentes
de la aplicacion desplegada en Vercel. No aplica a Railway. Cubre fallos de
deployment, indisponibilidad, errores elevados, autenticacion, base de datos,
correo y configuracion de variables.

## Severidad

| Nivel | Ejemplo | Respuesta inicial |
| --- | --- | --- |
| SEV-1 | Produccion no responde, perdida o exposicion confirmada de datos | Inmediata; detener cambios y escalar a responsables |
| SEV-2 | Funcion critica degradada, login o evaluaciones fallan para varios usuarios | Menos de 30 minutos |
| SEV-3 | Error parcial con alternativa disponible o Preview defectuoso | Mismo dia laboral |

Nunca publicar secretos, tokens, datos personales ni cadenas de conexion en el
PR, issue, chat o bitacora del incidente.

## Roles minimos

| Rol | Responsabilidad |
| --- | --- |
| Incident commander | Coordina, asigna severidad y autoriza recuperacion |
| DevOps | Revisa Vercel, deployment, logs, variables y rollback |
| Desarrollo | Diagnostica aplicacion, API y regresiones |
| Datos | Revisa conectividad, integridad y cambios de esquema |
| Comunicacion | Informa estado, impacto y recuperacion sin exponer datos sensibles |

Una persona puede cubrir mas de un rol, pero debe existir un unico incident
commander durante el evento.

## 1. Detectar y confirmar

1. Registrar hora, reportante, ambiente, URL, commit y sintomas.
2. Comprobar el endpoint sin autenticacion:

   ```bash
   curl -i https://<dominio>.vercel.app/api/health
   ```

3. Confirmar en **Vercel > Project > Deployments** el estado del deployment y
   el commit asociado.
4. Revisar **Runtime Logs** filtrando por ruta, status HTTP y ventana temporal.
5. Reproducir solo con datos de prueba. No copiar payloads sensibles.

Una respuesta saludable devuelve HTTP `200`, JSON con `status: "ok"` y
`Cache-Control: no-store`. Este endpoint confirma que la funcion responde, no
que la base de datos, OAuth o el proveedor de correo esten sanos.

## 2. Clasificar y contener

1. Asignar SEV-1, SEV-2 o SEV-3.
2. Pausar merges y deployments relacionados mientras se investiga.
3. Si el ultimo deployment introdujo el fallo, usar en Vercel la accion
   **Promote to Production** sobre el ultimo deployment sano, o **Redeploy** si
   la organizacion no permite promoverlo directamente.
4. Si existe sospecha de secreto expuesto, revocarlo primero en el proveedor,
   crear uno nuevo en Vercel y generar un deployment nuevo. Los deployments
   existentes no reciben variables actualizadas.
5. Si hay riesgo de corrupcion de datos, detener escrituras afectadas antes de
   intentar reparaciones. No ejecutar migraciones destructivas durante el
   diagnostico inicial.

## 3. Diagnosticar por escenario

### Deployment fallido

1. Abrir **Build Logs** y localizar el primer error, no solo el resumen final.
2. Verificar que Vercel use pnpm y `pnpm-lock.yaml` con instalacion congelada.
3. Reproducir sobre el mismo commit con `pnpm install --frozen-lockfile`,
   `pnpm typecheck`, `pnpm test` y `pnpm build`.
4. Corregir en `feature` y validar un Preview Deployment. No promover a `main`
   sin autorizacion explicita.

### Aplicacion o API con errores 5xx

1. Correlacionar hora, ruta y deployment en Runtime Logs.
2. Revisar cambios recientes y variables requeridas sin mostrar sus valores.
3. Verificar `/api/health`; si responde, probar el flujo afectado con una cuenta
   de prueba y permisos equivalentes.
4. Hacer rollback si el error coincide con el deployment reciente.

### Login u OAuth

1. Confirmar `NEXTAUTH_SECRET` en el ambiente afectado.
2. Revisar dominio y callback autorizado de Google.
3. Confirmar si `NEXTAUTH_URL` es necesario; en Vercel se prefieren las
   variables de sistema automaticas cuando la configuracion lo permite.
4. No registrar cookies, JWT, authorization codes ni secretos OAuth.

### Base de datos

1. Confirmar alcance y disponibilidad del proveedor de base de datos.
2. Validar nombre y alcance de la variable de conexion en Vercel.
3. Revisar pools y limites de conexiones serverless.
4. Escalar al responsable de datos antes de rollback de esquema o restauracion.

### Correo o cola

1. Revisar eventos estructurados de email en Runtime Logs.
2. Verificar nombres y alcance de `RESEND_API_KEY` o SMTP y `EMAIL_FROM`.
3. Si se usa BullMQ, confirmar `REDIS_URL` y el estado del worker externo; una
   funcion de Vercel no sustituye un worker persistente.
4. Reintentar solo operaciones idempotentes para evitar correos duplicados.

## 4. Recuperar y validar

1. Confirmar que el deployment sano esta activo en el dominio de produccion.
2. Verificar `/api/health` y el flujo que origino la incidencia.
3. Observar logs y tasa de errores durante al menos 15 minutos para SEV-2 y 30
   minutos para SEV-1.
4. Comunicar recuperacion, impacto conocido y cualquier seguimiento pendiente.
5. Reanudar merges solo cuando el incident commander cierre la contencion.

## 5. Cerrar y aprender

Dentro de las siguientes 48 horas para SEV-1 o SEV-2, registrar:

- linea de tiempo en zona horaria UTC;
- impacto y duracion;
- causa raiz y factores contribuyentes;
- como se detecto y por que los controles previos no bastaron;
- acciones correctivas con responsable y fecha;
- enlaces a deployments, PR e issue, sin secretos.

Plantilla breve:

```text
Incidente:
Severidad:
Inicio / deteccion / recuperacion (UTC):
Impacto:
Deployment y commit:
Causa raiz:
Contencion y recuperacion:
Acciones de seguimiento (responsable y fecha):
```

## Lista rapida de salida

- [ ] Servicio y flujo afectado recuperados.
- [ ] Health check responde sin cache.
- [ ] Deployment y commit sanos identificados.
- [ ] Secretos potencialmente expuestos revocados y rotados.
- [ ] Usuarios interesados notificados.
- [ ] Evidencia y linea de tiempo registradas.
- [ ] Acciones correctivas asignadas.
- [ ] Postmortem programado cuando corresponda.
