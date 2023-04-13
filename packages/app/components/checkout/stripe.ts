import type { Stripe } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";

let cachedStripePromise: PromiseLike<Stripe | null> | Stripe | null = null;

export const stripePromise = () => {
  if (!cachedStripePromise)
    cachedStripePromise = process.env.NEXT_PUBLIC_STRIPE_KEY
      ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
      : null;

  return cachedStripePromise;
};
