
# Daim Post (Mono-repo)

Modern, multilingual posting app with AI-assisted proofreading. Ships with:

- **Backend (Node + Express + Prisma)** with PostgreSQL (Docker) or SQLite (dev)
- **Web (Next.js + Tailwind + i18n)** ready for `daim-post.online`
- **Mobile (Expo React Native)** for Android & iOS
- **Desktop (Electron)** wrapper that loads the web app
- **AI Bot** endpoint (pluggable) with basic local fixer; ready to connect to OpenAI

## Quick Start (Dev)

```bash
# 1) Backend
cd backend
cp .env.example .env
# choose SQLite for dev (default), then:
npm i
npx prisma migrate dev --name init
npm run dev

# 2) Web
cd ../web
cp .env.example .env.local
npm i
npm run dev

# 3) Mobile (Expo)
cd ../mobile
npm i
npm run start
# use Expo Go to test

# 4) Desktop (Electron)
cd ../desktop
npm i
npm run dev
```

## Production

- Use Postgres via `docker-compose` in `/backend`
- Set `WEB_BASE_URL=https://daim-post.online` and point DNS to your hosting
- Deploy Web on Vercel; Backend on Railway/Render; DB on Supabase/Neon

See each folder README for details.
