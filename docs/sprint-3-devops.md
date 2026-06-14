# Sprint 3 - Cierre de etapa 1

## Criterios DevOps

### 1. Tests en pipeline CI

El workflow `.github/workflows/ci.yml` instala las dependencias con lockfile,
ejecuta `pnpm typecheck`, `pnpm test` y finalmente `pnpm build`.

Los tests unitarios usan Vitest. La primera cobertura valida `lib/utils.ts`,
incluyendo clases condicionales y la resolucion de clases Tailwind en conflicto.

### 2. Proteccion de `main`

La rama debe configurarse en GitHub con estas reglas:

- Requerir pull request antes de hacer merge.
- Requerir al menos una aprobacion.
- Descartar aprobaciones cuando se agreguen commits nuevos.
- Requerir que pase el check `Lint, typecheck and build`.
- Bloquear pushes directos y force pushes.

Esta configuracion requiere permisos de administracion del repositorio y no se
versiona dentro del codigo fuente.

### 3. Release `v0.1.0`

El tag anotado `v0.1.0` debe crearse sobre el commit aprobado para el cierre de
la etapa. No debe apuntar a `main` hasta que el contenido de `feature` haya sido
autorizado y promovido.

### 4. Demo en staging

La integracion de Vercel genera un despliegue `Preview` por cada push y pull
request. Para este proyecto, `Preview` es el entorno de staging previo a
produccion. GitHub muestra el estado y la URL de la demo en cada commit.

El acceso al despliegue esta protegido actualmente por Vercel Authentication;
los revisores deben pertenecer al equipo de Vercel o desactivar esa proteccion
para que la demo sea publica.
