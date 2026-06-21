# Railway staging

Este archivo deja versionada la configuracion base del entorno staging para el
Sprint 4. Los secretos reales se configuran en Railway, nunca en Git.

## Configuracion versionada

`railway.json` define la configuracion de despliegue que Railway debe tomar al
detectar este repositorio:

- Builder: `DOCKERFILE`.
- Dockerfile: `Dockerfile.frontend`.
- Start command: `CMD ["node", "server.js"]` desde el Dockerfile.
- Healthcheck: `/login`.
- Restart policy: `ON_FAILURE`.
- Overrides por ambiente: `dev`, `staging` y `pr`.

Railway lee `railway.json` o `railway.toml` junto al codigo y combina esa
configuracion con los ajustes del dashboard. La configuracion en codigo
sobrescribe los valores del dashboard para el deployment en curso. Railway
tambien permite overrides por ambiente y un ambiente especial `pr` para
deployments efimeros de pull request.

Se usa `Dockerfile.frontend` porque el proyecto ya compila Next.js con
`output: "standalone"` y el Dockerfile copia `public` y `.next/static` al
artefacto standalone antes de ejecutar `node server.js`.

## Ambientes esperados

| Ambiente Railway | Rama sugerida | Uso | Archivo de referencia |
| --- | --- | --- | --- |
| `dev` | `dev` | Validacion integrada despues de mergear sprint. | `.env.development.example` |
| `staging` | `feature` o rama de buffer aprobada | Demo previa a promover a `dev`. | `.env.staging.example` |
| `pr` | Pull requests | Validacion efimera por PR. | Variables heredadas del ambiente base |

## Variables por ambiente

Configurar estas variables en el servicio de Railway, dentro de cada ambiente:

| Variable | `dev` | `staging` | Notas |
| --- | --- | --- | --- |
| `APP_ENV` | `development` | `staging` | Identificador interno del ambiente. |
| `NEXT_PUBLIC_APP_ENV` | `development` | `staging` | Visible en cliente; no poner secretos. |
| `NEXTAUTH_URL` | URL publica de `dev` en Railway | URL publica de `staging` en Railway | Debe coincidir con el dominio del deployment. |
| `NEXTAUTH_SECRET` | Secreto propio de `dev` | Secreto propio de `staging` | No reutilizar entre ambientes. |
| `GOOGLE_CLIENT_ID` | OAuth client de dev | OAuth client de staging | Puede ser el mismo solo si el equipo lo autoriza. |
| `GOOGLE_CLIENT_SECRET` | OAuth secret de dev | OAuth secret de staging | Secreto, no versionar. |

Para Google OAuth, agregar tambien estos redirect URI en el cliente
correspondiente:

```text
https://<dominio-dev>/api/auth/callback/google
https://<dominio-staging>/api/auth/callback/google
```

## Checklist de Railway

1. Crear o verificar el proyecto `evaluacion-pi` en Railway.
2. Conectar el repo `javiermoya2504/evaluacion_pi`.
3. Crear los ambientes `dev` y `staging`.
4. Asociar `dev` a la rama `dev` y `staging` a la rama `feature` mientras dure
   el buffer.
5. Configurar las variables de entorno por ambiente.
6. Generar dominio publico para cada ambiente.
7. Verificar que `/login` pase el healthcheck.
8. No promover nada hacia `main` hasta recibir autorizacion explicita.
