import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { STRIPE_PLANS } from "@/lib/constants/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY missing at runtime");
  // Podés fijar apiVersion o dejar que use la de tu cuenta
  return new Stripe(key);

}

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET missing at runtime");
  return secret;
}

export async function POST(request: Request) {
  try {
    // 1) Raw body + firma (NECESARIO para validar)
    const rawBody = await request.text();
    const signature = (await headers()).get("stripe-signature") ?? "";

    const stripe = getStripe();
    const webhookSecret = getWebhookSecret();

    // 2) Verificar firma y parsear evento (snapshot payloads)
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    // 3) Manejo de eventos
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Recuperar line items para obtener el priceId
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;

      const priceIdToPlan = {
        [STRIPE_PLANS.lite.monthlyPriceId.dev]: "lite",
        [STRIPE_PLANS.lite.monthlyPriceId.prod]: "lite",
        [STRIPE_PLANS.lite.yearlyPriceId.dev]: "lite",
        [STRIPE_PLANS.lite.yearlyPriceId.prod]: "lite",
        [STRIPE_PLANS.pro.monthlyPriceId.dev]: "pro",
        [STRIPE_PLANS.pro.monthlyPriceId.prod]: "pro",
        [STRIPE_PLANS.pro.yearlyPriceId.dev]: "pro",
        [STRIPE_PLANS.pro.yearlyPriceId.prod]: "pro",
        [STRIPE_PLANS.business.monthlyPriceId.dev]: "business",
        [STRIPE_PLANS.business.monthlyPriceId.prod]: "business",
        [STRIPE_PLANS.business.yearlyPriceId.dev]: "business",
        [STRIPE_PLANS.business.yearlyPriceId.prod]: "business",
      } as const;

      const plan = priceId ? priceIdToPlan[priceId as keyof typeof priceIdToPlan] : undefined;
      if (!plan) {
        console.error(`[Stripe] Invalid or missing price ID: ${priceId}`);
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      }

      const customerEmail = session.customer_email;
      if (!customerEmail) {
        console.error("[Stripe] No customer email in session");
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
      }

      await db
        .update(users)
        .set({ plan, stripeCustomerId: session.customer as string })
        .where(eq(users.email, customerEmail));
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price?.id;

      const priceIdToPlan = {
        [STRIPE_PLANS.lite.monthlyPriceId.dev]: "lite",
        [STRIPE_PLANS.lite.monthlyPriceId.prod]: "lite",
        [STRIPE_PLANS.lite.yearlyPriceId.dev]: "lite",
        [STRIPE_PLANS.lite.yearlyPriceId.prod]: "lite",
        [STRIPE_PLANS.pro.monthlyPriceId.dev]: "pro",
        [STRIPE_PLANS.pro.monthlyPriceId.prod]: "pro",
        [STRIPE_PLANS.pro.yearlyPriceId.dev]: "pro",
        [STRIPE_PLANS.pro.yearlyPriceId.prod]: "pro",
        [STRIPE_PLANS.business.monthlyPriceId.dev]: "business",
        [STRIPE_PLANS.business.monthlyPriceId.prod]: "business",
        [STRIPE_PLANS.business.yearlyPriceId.dev]: "business",
        [STRIPE_PLANS.business.yearlyPriceId.prod]: "business",
      } as const;

      const plan = priceId ? priceIdToPlan[priceId as keyof typeof priceIdToPlan] : undefined;
      if (!plan) {
        console.error(`[Stripe] Invalid price ID on subscription.updated: ${priceId}`);
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      }

      await db
        .update(users)
        .set({ plan })
        .where(eq(users.stripeCustomerId, subscription.customer as string));
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      await db
        .update(users)
        .set({ plan: "free" })
        .where(eq(users.stripeCustomerId, subscription.customer as string));
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      console.error(`[Stripe] Payment failed for customer ${invoice.customer}`);
      // acá podrías notificar al usuario por email, etc.
    }

    if (event.type === "customer.deleted") {
      const customer = event.data.object as Stripe.Customer;
      await db
        .update(users)
        .set({ plan: "free", stripeCustomerId: null })
        .where(eq(users.stripeCustomerId, customer.id));
    }

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // OJO: si la verificación de firma falla, devolvé 400 para que Stripe reintente con backoff
    const msg = error?.message ?? "Webhook handler failed";
    console.error("[Stripe webhook error]", msg);
    const status = /signature/i.test(msg) ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
