# Sprint 8 - Performance y cache

## Checklist

- Performance test basico con k6: `tests/performance/k6-smoke.js` y script `pnpm perf:k6`.
- Queries lentos identificados y documentados en este archivo.
- Cache de Next.js configurada con `cacheComponents`, perfiles `cacheLife` e invalidacion por tags.
- PR acumulados a `dev`: verificado el 2026-07-12 con GitHub; no hay PRs abiertos pendientes.

## Prueba basica de performance

Prerequisito local: tener k6 instalado y levantar la app con `pnpm dev` o `pnpm start`.

```bash
BASE_URL=http://localhost:3000 pnpm perf:k6
```

La prueba cubre:

- `GET /api/health`, con validacion de HTTP 200 y `Cache-Control: no-store`.
- `GET /login`, para revisar una pagina publica.
- Lecturas autenticadas opcionales si se define `API_TOKEN`: `/api/materias`, `/api/equipos` y `/api/evaluaciones`.

Parametros utiles:

```bash
BASE_URL=http://localhost:3000 K6_VUS=10 K6_DURATION=1m API_TOKEN=<jwt> pnpm perf:k6
```

Umbrales iniciales:

- Error rate menor a 5%.
- p95 menor a 750 ms.

Nota: el script queda versionado, pero la ejecucion local requiere instalar k6 en la maquina o en el runner de CI.

## Cache de Next.js

Configuracion aplicada:

- `next.config.mjs` habilita `cacheComponents`.
- `cacheLife.default` define una politica general de stale/revalidate/expire.
- `cacheLife.sprint8Data` define una politica corta para datos operativos.
- Los stores de `materias`, `rubricas`, `evaluaciones` y `equipos` usan la politica compartida `CACHE_LIFE.sprint8Data` y `cacheTag(...)`.
- Las rutas que escriben datos ejecutan `revalidateTag(tag, "max")` para evitar lecturas obsoletas despues de crear, actualizar o eliminar.
- `/api/health` conserva `Cache-Control: no-store` porque debe reflejar el estado vivo del servicio.

## Queries lentos identificados

La app actual lee datos operativos desde archivos JSON, por lo que no hay queries SQL en runtime para medir con `EXPLAIN ANALYZE`. Aun asi, las migraciones Postgres ya definen vistas y relaciones que pueden volverse lentas al activar la base de datos como fuente principal.

## PR acumulados hacia dev

Verificacion en GitHub realizada el 2026-07-12:

- PR #23 `DevOps Sprint 7`: base `dev`, head `feature`, cerrado y merged.
- PR #20 `DevOps Sprint 6 de feature para dev`: base `dev`, head `feature`, cerrado y merged.
- Consulta de PRs abiertos: sin resultados.

Resultado: no se ejecuto merge nuevo hacia `dev` porque no habia PR acumulado abierto.

### Q1 - Vista consolidada de rubrica global

Archivo: `Database/migrations/015_create_vista_rubrica_global.sql`

Riesgo: la vista `v_rubrica_global_consolidado` encadena joins por `rubrica_global`, `rubrica_global_criterio`, `criterio`, `competencia`, `rubrica_materia` y `materia`. Sin indices en FKs de join, PostgreSQL puede hacer sequential scans al crecer criterios y rubricas.

Mitigacion agregada:

- `idx_criterio_rubrica_materia`
- `idx_rubrica_global_parcial`
- `idx_rubrica_global_usuario_creador`
- `idx_rubrica_global_criterio_criterio`

Validacion sugerida:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM v_rubrica_global_consolidado
WHERE id_rubrica_global = 1;
```

### Q2 - Equipos por proyecto y usuarios por equipo

Archivos:

- `Database/migrations/017_create_equipo.sql`
- `Database/migrations/018_create_equipo_usuario.sql`

Riesgo: los tableros de proyecto normalmente filtran equipos por proyecto y consultan integrantes. La PK compuesta de `equipo_usuario(id_equipo, id_usuario)` ayuda por equipo, pero no por busquedas centradas en usuario.

Mitigacion agregada:

- `idx_equipo_proyecto`
- `idx_equipo_usuario_usuario`
- `idx_proyecto_carrera`

Validacion sugerida:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT e.*
FROM equipo e
WHERE e.id_proyecto = 1;

EXPLAIN (ANALYZE, BUFFERS)
SELECT eu.*
FROM equipo_usuario eu
WHERE eu.id_usuario = 1;
```

### Q3 - Usuarios y docentes por carrera, rol o materia

Archivos:

- `Database/migrations/003_create_usuario.sql`
- `Database/migrations/010_create_docente_materia.sql`

Riesgo: reportes administrativos y permisos suelen filtrar por rol, carrera, docente y materia. `docente_materia` ya tiene indice por la llave unica `(id_usuario, id_materia)` y por `id_materia`, pero faltaba cubrir filtros directos por usuario en reportes.

Mitigacion agregada:

- `idx_usuario_rol`
- `idx_usuario_carrera`
- `idx_docente_materia_usuario`

Validacion sugerida:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM usuario
WHERE id_rol = 2
  AND activo = true;

EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM docente_materia
WHERE id_usuario = 1;
```
