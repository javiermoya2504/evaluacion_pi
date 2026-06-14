# Estrategia de ramas

Este proyecto utiliza una estrategia ligera de ramas orientada a sprints.

## Ramas permanentes

- `main`: contiene solo versiones aprobadas y listas para entrega o despliegue.
- `feature`: rama de integracion donde se concentra el trabajo de los sprints.

`main` no debe recibir commits directos. La promocion de `feature` a `main` se
realiza mediante pull request unicamente cuando la etapa completa haya sido
revisada y autorizada por el responsable del proyecto.

## Flujo de trabajo

1. Actualizar la rama local `feature` desde `origin/feature`.
2. Implementar y verificar el alcance del sprint en `feature`.
3. Publicar los cambios en `origin/feature` para la integracion del equipo.
4. Corregir cualquier fallo reportado por CI antes de cerrar el sprint.
5. Al terminar todos los sprints de una etapa, abrir un pull request de
   `feature` hacia `main` solo después de recibir autorizacion explicita.
6. Fusionar el pull request mediante **Squash and merge** para mantener un
   historial de entregas claro.

Para cambios que necesiten revision aislada, se puede crear una rama temporal
desde `feature` con alguno de estos prefijos:

- `feature/<descripcion>` para funcionalidad nueva.
- `fix/<descripcion>` para correcciones.
- `docs/<descripcion>` para documentacion.
- `chore/<descripcion>` para mantenimiento o DevOps.

Las ramas temporales regresan a `feature`, nunca directamente a `main`, y se
eliminan despues de fusionarse.

## Convencion de commits

Se recomienda Conventional Commits:

```text
feat: agrega modulo de evaluaciones
fix: corrige validacion del formulario
docs: documenta estrategia de ramas
ci: agrega validacion de build
chore: actualiza configuracion de Docker
```

## Protecciones recomendadas en GitHub

Configurar una regla para `main` con:

- Pull request obligatorio antes de fusionar.
- Al menos una aprobacion.
- Workflow `CI / validate` aprobado.
- Rama actualizada antes de fusionar.
- Bloqueo de pushes directos y force pushes.

Configurar `feature` con el workflow `CI / validate` obligatorio y bloqueo de
force pushes. Los pushes directos pueden mantenerse mientras sea el flujo
acordado por el equipo.

## Correcciones urgentes

Una correccion urgente parte de `main` en `fix/<descripcion>`. Despues de su
aprobacion se fusiona a `main` y el mismo cambio debe integrarse de regreso en
`feature` para evitar divergencias.
