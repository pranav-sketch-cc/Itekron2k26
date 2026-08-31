import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import Razorpay from "razorpay";
import { supabaseAdmin } from "./_lib/supabaseAdmin.js";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  throw new Error("Razorpay server environment variables are missing");
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

function getExpectedAmount(eventId: string): number {
  return eventId === "CONVERA01" ? 15000 : 5000;
}

function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const generatedSignature = crypto
    .createHmac("sha256", razorpayKeySecret!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (generatedSignature.length !== signature.length) {
    return false;
  }

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
      success: false,
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
        success: false,
        error: "Missing payment verification details",
      });
    }

    /*
     * Find the existing registration.
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
      console.error("Registration lookup failed:", registrationError);

      return res.status(404).json({
        success: false,
        error: "Registration not found",
      });
    }

    /*
     * The order returned by Razorpay MUST belong to this
     * exact registration.
     */
    if (
      registration.razorpay_order_id !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Razorpay order does not belong to this registration",
      });
    }

    /*
     * Idempotency:
     * if the exact payment was already processed,
     * safely return success.
     */
    if (
      registration.payment_status === "completed" &&
      registration.razorpay_payment_id ===
        razorpay_payment_id
    ) {
      return res.status(200).json({
        success: true,
        verified: true,
        already_processed: true,
        registration_id:
          registration.registration_id,
        registration_uuid: registration.id,
        event_id: registration.event_id,
      });
    }

    /*
     * Calculate the expected amount SERVER-SIDE.
     *
     * Normal events = ₹50
     * Convera = ₹150
     *
     * Razorpay amount is in paise.
     */
    const expectedAmount = getExpectedAmount(
      registration.event_id
    );

    /*
     * Verify Razorpay HMAC signature.
     */
    const signatureValid =
      verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

    if (!signatureValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid Razorpay payment signature",
      });
    }

    /*
     * Fetch the real payment from Razorpay.
     *
     * This prevents trusting only the browser callback.
     */
    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    if (!payment) {
      return res.status(400).json({
        success: false,
        error:
          "Payment could not be found in Razorpay",
      });
    }

    /*
     * Verify order association.
     */
    if (
      payment.order_id !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        error: "Payment order mismatch",
      });
    }

    /*
     * Verify amount.
     */
    if (
      Number(payment.amount) !==
      expectedAmount
    ) {
      return res.status(400).json({
        success: false,
        error: "Payment amount mismatch",
      });
    }

    /*
     * Verify currency.
     */
    if (payment.currency !== "INR") {
      return res.status(400).json({
        success: false,
        error: "Invalid payment currency",
      });
    }

    /*
     * Only captured payments are successful.
     */
    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        error:
          `Payment is not captured. Current status: ${payment.status}`,
      });
    }

    /*
     * Update the EXISTING registration.
     *
     * IMPORTANT:
     * Do not create a second registration here.
     */
    const { data: updatedRegistration, error: updateError } =
      await supabaseAdmin
        .from("registrations")
        .update({
          payment_status: "completed",
          status: "completed",
          razorpay_payment_id,
          razorpay_signature,
        })
        .eq("id", registration.id)
        .eq(
          "razorpay_order_id",
          razorpay_order_id
        )
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

    if (
      updateError ||
      !updatedRegistration
    ) {
      console.error(
        "Registration update failed:",
        updateError
      );

      return res.status(500).json({
        success: false,
        error:
          "Payment verified but registration update failed",
      });
    }

    console.log(
      "Payment verified successfully:",
      {
        registrationId:
          updatedRegistration.registration_id,
        razorpayOrderId:
          razorpay_order_id,
        razorpayPaymentId:
          razorpay_payment_id,
        amount: expectedAmount,
      }
    );

    return res.status(200).json({
      success: true,
      verified: true,
      registration_id:
        updatedRegistration.registration_id,
      registration_uuid:
        updatedRegistration.id,
      event_id:
        updatedRegistration.event_id,
      payment_id:
        updatedRegistration.razorpay_payment_id,
      amount: expectedAmount,
    });
  } catch (error: any) {
    console.error(
      "Payment verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Payment verification failed",
    });
  }
}