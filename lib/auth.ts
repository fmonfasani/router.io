import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const { handlers, auth } = NextAuth({
  adapter: DrizzleAdapter(db, { schema }),
  providers: [
    Email({
      from: "no-reply@tuapp.dev",
      // custom sendMagicLink...
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
