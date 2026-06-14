# evaluaci-n_pi

## DevOps

- [Estrategia de ramas](docs/branching-strategy.md)
- [Variables de entorno](docs/environment-variables.md)
- [Cierre DevOps del Sprint 3](docs/sprint-3-devops.md)
- CI base en `.github/workflows/ci.yml` para validar lint, TypeScript y el
  test suite y build en cada pull request y en los pushes a `feature`, `dev` y
  `main`.
- Preview automatico de Vercel para cada pull request mediante la integracion
  nativa del repositorio con Vercel.
- Contenedores de produccion en `Dockerfile.frontend` y `Dockerfile.backend`.
- Orquestacion local en `compose.yaml`.

La aplicacion actual es un proyecto Next.js full-stack. Las paginas y las rutas
API de `app/api` se compilan en un mismo runtime standalone; por ello ambos
Dockerfiles generan hoy el mismo artefacto, aunque conservan nombres separados
para el entregable de frontend y backend.

```bash
docker build -f Dockerfile.frontend -t evaluacion-pi-frontend .
docker build -f Dockerfile.backend -t evaluacion-pi-backend .
docker run --rm -p 3000:3000 --env-file .env.local evaluacion-pi-frontend
docker compose up --build --wait
docker compose down
```

El servicio `frontend` queda disponible en `http://localhost:3000` y el
servicio `backend` en `http://localhost:3001`. Ambos reutilizan `.env.local`
cuando el archivo existe.

En GitHub Actions, el secreto del repositorio `JWT_SECRET` se inyecta como
`NEXTAUTH_SECRET` durante el build. CI falla de forma explicita en ramas del
repositorio si el secreto no esta configurado.

`pnpm build` ejecuta ESLint antes de compilar. Cualquier error de ESLint o
TypeScript detiene el build y bloquea la validacion del pull request.

### Validacion Docker del Sprint 0

Las imagenes se construyeron y probaron localmente con Docker Desktop:

- `evaluacion-pi-frontend:sprint-0`: `/login` respondio HTTP 200.
- `evaluacion-pi-backend:sprint-0`: `/api/auth/providers` respondio HTTP 200.
- Ambas imagenes ejecutan el proceso con el usuario no privilegiado `nextjs`.

Las imagenes Docker no se almacenan directamente en Git. El repositorio guarda
los Dockerfiles reproducibles; las imagenes se generan con los comandos
documentados arriba o se publican posteriormente en un registro de contenedores.

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_jBkB2XGXuKim8G7zOMJ3yOdnGsHj)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Google login y publicacion

Para que muchas cuentas de Google puedan iniciar sesion, la pantalla de consentimiento OAuth debe estar publicada en Google Cloud. Si se queda en modo de prueba, Google solo permite entrar a los usuarios agregados como testers.

Variables necesarias en local y en el hosting:

```env
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=pon_aqui_una_clave_larga_y_segura
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
```

En Google Cloud Console:

1. Abre APIs & Services > OAuth consent screen.
2. Completa la informacion requerida de la app.
3. Publica la app para que salga de Testing.
4. En Credentials > OAuth 2.0 Client IDs, agrega estos redirect URIs:

```text
http://localhost:3000/api/auth/callback/google
https://tu-dominio.com/api/auth/callback/google
```

En Vercel o el hosting que uses, configura las mismas variables de entorno y despliega la rama conectada al proyecto.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
