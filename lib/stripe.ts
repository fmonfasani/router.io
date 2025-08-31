// lib/stripe.ts (alternativa tipada)
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY missing at runtime");

  _stripe = new Stripe(key, {
    apiVersion: "2025-02-24.acacia", // ✅ coincide con las typings instaladas
  });
  return _stripe;
}
