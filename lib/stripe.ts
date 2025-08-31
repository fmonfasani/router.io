// lib/stripe.ts  ✅ Lazy, sin top-level instantiation
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // No tirar error en build: sólo al invocarlo en runtime
    throw new Error("STRIPE_SECRET_KEY missing at runtime");
  }
  _stripe = new Stripe(key, {
    apiVersion: "2025-08-27.basil", // o quítalo para usar la default de tu cuenta
  });
  return _stripe;
}
