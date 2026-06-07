# evaluaci-n_pi

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
