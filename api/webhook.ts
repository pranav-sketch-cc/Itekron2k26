import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;
const webhookSecret =
  process.env.RAZORPAY_WEBHOOK_SECRET;

if (
  !supabaseUrl ||
  !supabaseServiceRoleKey ||
  !webhookSecret
) {
  throw new Error(
    "Required webhook environment variables are missing"
  );
}

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret!)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    /*
     * ---------------------------------------------------------
     * Razorpay webhook signature must be generated from the
     * RAW request body.
     * ---------------------------------------------------------
     */

    const signature =
      req.headers["x-razorpay-signature"];

    if (!signature || Array.isArray(signature)) {
      return res.status(400).json({
        error: "Missing Razorpay webhook signature",
      });
    }

    const rawBody =
      typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body);

    /*
     * ---------------------------------------------------------
     * 1. Verify Razorpay webhook signature
     * ---------------------------------------------------------
     */
    const valid = verifyWebhookSignature(
      rawBody,
      signature
    );

    if (!valid) {
      return res.status(400).json({
        error: "Invalid webhook signature",
      });
    }

    const payload =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const event = payload?.event;

    /*
     * ---------------------------------------------------------
     * 2. We only care about successful captured payments
     * ---------------------------------------------------------
     */
    if (event !== "payment.captured") {
      return res.status(200).json({
        received: true,
        ignored: true,
        event,
      });
    }

    const payment =
      payload?.payload?.payment?.entity;

    if (!payment) {
      return res.status(400).json({
        error: "Payment entity missing from webhook",
      });
    }

    const paymentId = payment.id;
    const orderId = payment.order_id;
    const amount = payment.amount;
    const currency = payment.currency;
    const paymentStatus = payment.status;

    if (!paymentId || !orderId) {
      return res.status(400).json({
        error: "Payment ID or order ID missing",
      });
    }

    /*
     * ---------------------------------------------------------
     * 3. Only accept captured INR payments
     * ---------------------------------------------------------
     */
    if (
      paymentStatus !== "captured" ||
      currency !== "INR"
    ) {
      return res.status(400).json({
        error: "Invalid captured payment payload",
      });
    }

    /*
     * ---------------------------------------------------------
     * 4. Find existing registration using Razorpay order ID
     * ---------------------------------------------------------
     */
    const { data: registration, error: registrationError } =
      await supabaseAdmin
        .from("registrations")
        .select(`
          id,
          registration_id,
          event_id,
          registration_type,
          status,
          payment_required,
          payment_status,
          participant_email,
          razorpay_order_id,
          razorpay_payment_id
        `)
        .eq("razorpay_order_id", orderId)
        .single();

    if (registrationError || !registration) {
      console.error(
        "Registration not found for webhook order:",
        orderId,
        registrationError
      );

      /*
       * Return 200 so Razorpay does not endlessly retry a webhook
       * for an order that our database does not know.
       */
      return res.status(200).json({
        received: true,
        processed: false,
        reason: "registration_not_found",
      });
    }

    /*
     * ---------------------------------------------------------
     * 5. Server-side expected amount validation
     *
     * Normal = ₹50
     * Convera = ₹150
     * ---------------------------------------------------------
     */
    const expectedAmount =
      registration.event_id === "CONVERA01"
        ? 15000
        : 5000;

    if (amount !== expectedAmount) {
      console.error(
        "Webhook amount mismatch",
        {
          orderId,
          paymentId,
          receivedAmount: amount,
          expectedAmount,
          eventId: registration.event_id,
        }
      );

      return res.status(400).json({
        error: "Webhook payment amount mismatch",
      });
    }

    /*
     * ---------------------------------------------------------
     * 6. Idempotency
     *
     * Razorpay can retry the same webhook.
     *
     * If already paid with the same payment ID,
     * simply acknowledge it.
     * ---------------------------------------------------------
     */
    if (
      registration.payment_status === "paid" &&
      registration.status === "confirmed" &&
      registration.razorpay_payment_id === paymentId
    ) {
      return res.status(200).json({
        received: true,
        processed: true,
        already_processed: true,
        registration_id:
          registration.registration_id,
      });
    }

    /*
     * ---------------------------------------------------------
     * 7. Confirm the EXISTING registration
     *
     * IMPORTANT:
     * We are NOT creating another registration.
     * ---------------------------------------------------------
     */
    const { data: updatedRegistration, error: updateError } =
      await supabaseAdmin
        .from("registrations")
        .update({
          payment_status: "paid",
          status: "confirmed",
          razorpay_payment_id: paymentId,
        })
        .eq("id", registration.id)
        .eq("razorpay_order_id", orderId)
        .select(`
          id,
          registration_id,
          event_id,
          status,
          payment_status,
          razorpay_order_id,
          razorpay_payment_id
        `)
        .single();

    if (updateError || !updatedRegistration) {
      console.error(
        "Webhook registration update failed:",
        updateError
      );

      return res.status(500).json({
        error: "Failed to update registration",
      });
    }

    /*
     * ---------------------------------------------------------
     * 8. Success
     * ---------------------------------------------------------
     */
    return res.status(200).json({
      received: true,
      processed: true,
      registration_id:
        updatedRegistration.registration_id,
      payment_id:
        updatedRegistration.razorpay_payment_id,
    });
  } catch (error: any) {
    console.error(
      "Razorpay webhook error:",
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Webhook processing failed",
    });
  }
}