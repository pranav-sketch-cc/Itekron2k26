/// <reference types="node" />

import type { VercelRequest, VercelResponse } from "@vercel/node";
import Razorpay from "razorpay";
import { supabaseAdmin } from "./_lib/supabaseAdmin.js";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

function getEventAmount(eventId: string): number {
  return String(eventId).toLowerCase().includes("convera")
    ? 15000
    : 5000;
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

  if (!keyId || !keySecret) {
    console.error("Razorpay environment variables are missing");

    return res.status(500).json({
      success: false,
      error: "Razorpay is not configured on the server",
    });
  }

  try {
    const {
      registration_id,
      event_id,
    } = req.body || {};

    if (!registration_id || !event_id) {
      return res.status(400).json({
        success: false,
        error: "Missing registration_id or event_id",
      });
    }

    /*
     * Find the EXISTING registration first.
     * We never create a new registration here.
     */
    const {
      data: registration,
      error: registrationError,
    } = await supabaseAdmin
      .from("registrations")
      .select(`
        id,
        registration_id,
        event_id,
        payment_status,
        razorpay_order_id
      `)
      .eq("id", registration_id)
      .single();

    if (registrationError || !registration) {
      console.error(
        "Registration lookup failed:",
        registrationError
      );

      return res.status(404).json({
        success: false,
        error: "Registration not found",
      });
    }

    /*
     * Make sure the requested event matches the
     * event stored on the registration.
     */
    if (
      String(registration.event_id) !==
      String(event_id)
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Event does not match the registration",
      });
    }

    /*
     * If an order already exists, return it instead of
     * creating another Razorpay order.
     *
     * This prevents accidental duplicate orders when
     * the user clicks Register/Pay more than once.
     */
    if (registration.razorpay_order_id) {
      const amount = getEventAmount(
        registration.event_id
      );

      return res.status(200).json({
        success: true,
        order_id:
          registration.razorpay_order_id,
        amount,
        currency: "INR",
        key_id: keyId,
        existing_order: true,
      });
    }

    /*
     * Server-side pricing:
     *
     * Convera = ₹150 = 15000 paise
     * Everything else = ₹50 = 5000 paise
     */
    const amountInPaise = getEventAmount(
      registration.event_id
    );

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    /*
     * Create Razorpay order.
     */
    const razorpayOrder =
      await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt:
          `rcpt_${registration.id.slice(0, 8)}_${Date.now()}`,
        notes: {
          registration_id: registration.id,
          event_id: String(
            registration.event_id
          ),
        },
      });

    /*
     * Save Razorpay order ID against the SAME
     * existing registration.
     */
    const {
      data: updatedRegistration,
      error: updateError,
    } = await supabaseAdmin
      .from("registrations")
      .update({
        razorpay_order_id:
          razorpayOrder.id,
        payment_status: "pending",
      })
      .eq("id", registration.id)
      .is("razorpay_order_id", null)
      .select(`
        id,
        registration_id,
        event_id,
        payment_status,
        razorpay_order_id
      `)
      .single();

    if (
      updateError ||
      !updatedRegistration
    ) {
      console.error(
        "Failed to save Razorpay order:",
        updateError
      );

      return res.status(500).json({
        success: false,
        error:
          "Failed to save payment order",
      });
    }

    return res.status(200).json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: keyId,
      registration_id:
        updatedRegistration.id,
    });
  } catch (error: any) {
    console.error(
      "Razorpay order creation failed:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Failed to create payment order",
    });
  }
}