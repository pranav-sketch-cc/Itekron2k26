import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (
  !supabaseUrl ||
  !supabaseServiceRoleKey ||
  !razorpayKeyId ||
  !razorpayKeySecret
) {
  throw new Error("Required server environment variables are missing");
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

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

function getExpectedAmount(eventId: string): number {
  return eventId === "CONVERA01" ? 15000 : 5000;
}

function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const generatedSignature = crypto
    .createHmac("sha256", razorpayKeySecret!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
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
    const {
      registration_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (
      !registration_id ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        error: "Missing payment verification details",
      });
    }

    /*
     * ---------------------------------------------------------
     * 1. Find the EXISTING registration
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
        .eq("id", registration_id)
        .single();

    if (registrationError || !registration) {
      return res.status(404).json({
        error: "Registration not found",
      });
    }

    /*
     * ---------------------------------------------------------
     * 2. Make sure this order belongs to this registration
     * ---------------------------------------------------------
     */
    if (registration.razorpay_order_id !== razorpay_order_id) {
      return res.status(400).json({
        error: "Razorpay order does not belong to this registration",
      });
    }

    /*
     * ---------------------------------------------------------
     * 3. Idempotency
     *
     * If payment was already verified, don't create/update
     * everything again.
     * ---------------------------------------------------------
     */
    if (
      registration.payment_status === "paid" &&
      registration.status === "confirmed" &&
      registration.razorpay_payment_id === razorpay_payment_id
    ) {
      return res.status(200).json({
        success: true,
        verified: true,
        already_processed: true,
        registration_id: registration.registration_id,
      });
    }

    /*
     * ---------------------------------------------------------
     * 4. Server-side amount calculation
     *
     * Normal event = ₹50
     * Convera = ₹150
     *
     * Razorpay uses paise.
     * ---------------------------------------------------------
     */
    const expectedAmount = getExpectedAmount(registration.event_id);

    /*
     * ---------------------------------------------------------
     * 5. Verify Razorpay signature
     * ---------------------------------------------------------
     */
    const signatureValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!signatureValid) {
      return res.status(400).json({
        error: "Invalid Razorpay payment signature",
      });
    }

    /*
     * ---------------------------------------------------------
     * 6. Fetch the ACTUAL payment from Razorpay
     *
     * Do not trust the browser callback alone.
     * ---------------------------------------------------------
     */
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (!payment) {
      return res.status(400).json({
        error: "Payment could not be found in Razorpay",
      });
    }

    /*
     * ---------------------------------------------------------
     * 7. Verify payment against the server-side values
     * ---------------------------------------------------------
     */
    if (payment.order_id !== razorpay_order_id) {
      return res.status(400).json({
        error: "Payment order mismatch",
      });
    }

    if (payment.amount !== expectedAmount) {
      return res.status(400).json({
        error: "Payment amount mismatch",
      });
    }

    if (payment.currency !== "INR") {
      return res.status(400).json({
        error: "Invalid payment currency",
      });
    }

    if (payment.status !== "captured") {
      return res.status(400).json({
        error: `Payment is not captured. Current status: ${payment.status}`,
      });
    }

    /*
     * ---------------------------------------------------------
     * 8. Update EXISTING registration
     *
     * No new registration.
     * No new participant.
     * No new table.
     * ---------------------------------------------------------
     */
    const { data: updatedRegistration, error: updateError } =
      await supabaseAdmin
        .from("registrations")
        .update({
          payment_status: "paid",
          status: "confirmed",
          razorpay_payment_id,
          razorpay_signature,
        })
        .eq("id", registration.id)
        .eq("razorpay_order_id", razorpay_order_id)
        .select(`
          id,
          registration_id,
          event_id,
          registration_type,
          status,
          payment_status,
          participant_email,
          razorpay_order_id,
          razorpay_payment_id
        `)
        .single();

    if (updateError || !updatedRegistration) {
      console.error(
        "Registration update failed:",
        updateError
      );

      return res.status(500).json({
        error: "Payment verified but registration update failed",
      });
    }

    /*
     * ---------------------------------------------------------
     * 9. Tell frontend payment is genuinely verified
     * ---------------------------------------------------------
     */
    return res.status(200).json({
      success: true,
      verified: true,
      registration_id: updatedRegistration.registration_id,
      registration_uuid: updatedRegistration.id,
      event_id: updatedRegistration.event_id,
      payment_id: updatedRegistration.razorpay_payment_id,
      amount: expectedAmount,
    });
  } catch (error: any) {
    console.error(
      "Payment verification error:",
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Payment verification failed",
    });
  }
}