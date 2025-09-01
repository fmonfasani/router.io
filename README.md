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


## Prerequisites

Before starting, ensure you have the following:

- An account with [Resend](https://resend.com/)
- An account with [Vercel](https://vercel.com/)
- A PostgreSQL database (we recommend [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))

## Environment Variables

After creating your accounts, rename `.env.example` to `.env.local` for local development and provide values for the following variables:

- `DATABASE_URL` – connection string for your PostgreSQL database **(required)**
- `RESEND_API_KEY` – API key from [Resend](https://resend.com/)
- `AUTH_SECRET` – secret used by NextAuth
- `NODE_ENV` – typically set to `development`

## Step-by-Step Instructions

1. **Clone the Repository**

   ```sh
   git clone https://github.com/routerso/router.git
   cd router/main
   ```
### Without Docker

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Set Up Environment Variables**

   Ensure your `.env` file is correctly configured as mentioned above.

4. **Generate the Database Migrations**

   ```sh
   npm drizzle-kit generate
   ```

5. **Run the Database Migrations**

   ```sh
   npm tsx lib/db/migrate.ts
   ```

6. **Start the Development Server**

   ```sh
   npm run dev
   ```
### With docker

2. **Set Up Environment Variables**

   Ensure your `.env` file is correctly configured as mentioned above.

3. **Run Docker Command
   ```sh
   docker compose up
   ```
## Deploying to Vercel

- Push your code to a GitHub repository.
- Connect your repository to Vercel.
- Set the environment variables in Vercel's dashboard under "Settings > Environment Variables".

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Resend Documentation](https://resend.com/docs)

For any issues or questions, please open an issue on the [GitHub repository](https://github.com/routerso/router).

