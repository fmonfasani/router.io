# Contribuir a Router.io

1. Crea un fork y una branch: `feat/mi-feature`.
2. Instalación local: `pnpm i && pnpm dev`.
3. Estilo de commits: Conventional Commits (`feat:`, `fix:`, etc.).
4. Agrega tests si aplica y corre `pnpm build`.
5. Abre un PR usando el template y referencia el issue.

## Entorno
- Node 20+
- pnpm 10+
- PostgreSQL local o Docker
- Variables en `.env.local` (ver `.env.example`)

## Código
- DB en `lib/db/*` (solo server). No importar DB en client components.
- Acciones de servidor en `app/actions/*` con `'use server'`.
- UI en `components/*`.
