/**
 * Billing. NOT WIRED TO A PAYMENT PROVIDER YET.
 *
 * To take real money you need a Nigerian payment gateway — Paystack or Flutterwave.
 * Both are card + bank transfer + USSD, both settle in NGN. The flow:
 *
 *   1. Server route (e.g. app/api/checkout/route.ts) calls the provider's
 *      "initialize transaction" endpoint with the amount in KOBO (₦1,000 = 100_000)
 *      and the user's email, using your SECRET key. The secret key must never reach
 *      the client.
 *   2. It returns an authorization_url; send the user there.
 *   3. The provider redirects back to your callback URL.
 *   4. A webhook (server-side) confirms payment and flips the user to Pro. Trust the
 *      webhook, never the redirect — the redirect can be forged by the user.
 *
 * Until then startCheckout() reports that it isn't configured rather than pretending
 * to succeed, so nobody can believe they've paid when they haven't.
 */
export const PRICE_NGN = 1000;
export const PRICE_LABEL = "₦1,000";

export type CheckoutResult =
  | { ok: true; authorizationUrl: string }
  | { ok: false; reason: "not-configured" | "failed" };

export async function startCheckout(): Promise<CheckoutResult> {
  // TODO: POST to your own /api/checkout, which talks to Paystack/Flutterwave with the
  // secret key server-side, and return the authorization_url it hands back.
  return { ok: false, reason: "not-configured" };
}
