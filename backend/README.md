
# Backend (Node + Express + Prisma)

## Setup (Dev)
```bash
cp .env.example .env
npm i
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
## Production
- Set `DATABASE_URL` to Postgres (e.g. Supabase/Neon)
- Set `CORS_ORIGIN=https://daim-post.online`
- Run `npm start`
