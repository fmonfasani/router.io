# Router.io

[![CI](https://github.com/fmonfasani/router.io/actions/workflows/ci.yml/badge.svg)](../../actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Labs/OTT routing y lead capture. Stack: **Next.js 14**, **Drizzle ORM**, **PostgreSQL**, **Stripe**.

## Demo / Deploy
- App: https://router-io.vercel.app
- Docs: (Wiki) → https://github.com/fmonfasani/router.io/wiki

## Características
- Webhooks de Stripe (suscripciones)
- DB con Drizzle + migraciones SQL
- UI moderna (Radix + Tailwind)
- Logs / Leads / Endpoints

## Empezar
```bash
pnpm i
cp .env.example .env.local
pnpm dev
