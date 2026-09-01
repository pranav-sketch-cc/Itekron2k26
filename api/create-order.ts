/// <reference types="node" />

import type { VercelRequest, VercelResponse } from "@Vercel/node";
import Razorpay from "razorpay";
import { supabaseAdmin } from "./_lib/supabaseAdmin.js";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

type EventPricing = {
  requiresPayment: boolean;
  amount: number;
};

function getEventPricing(
  eventName: string,
  category: string | null | undefined
): EventPricing {
  const normalizedName = String(eventName || "")
    .trim()
    .toLowerCase();

  const normalizedCategory = String(category || "")
    .trim()
    .toLowerCase();

  /*
   * Convera:
   * ₹150 = 15000 paise
   */
  if (normalizedName.includes("convera")) {
    return {
      requiresPayment: true,
      amount: 15000,
    };
  }

  /*
   * Other Technical events:
   * ₹50 = 5000 paise
   */
  if (normalizedCategory === "technical") {
    return {
      requiresPayment: true,
      amount: 5000,
    };
  }

  /*
   * Non-Technical events:
   * No payment required.
   */
  return {
    requiresPayment: false,
    amount: 0,
  };
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
    console.error(
      "Razorpay environment variables are missing"
    );

    return res.status(500).json({
      success: false,
      error:
        "Razorpay is not configured on the server",
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
        error:
          "Missing registration_id or event_id",
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
     * Make sure the requested event matches
     * the event stored on the registration.
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
     * Fetch the actual event from Supabase.
     *
     * Pricing is based on the database event data,
     * not on frontend values.
     */
    const {
      data: event,
      error: eventError,
    } = await supabaseAdmin
      .from("events")
      .select(`
        id,
        name,
        category
      `)
      .eq("id", registration.event_id)
      .single();

    if (eventError || !event) {
      console.error(
        "Event lookup failed:",
        eventError
      );

      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    /*
     * Calculate the authoritative server-side price.
     *
     * Convera       = ₹150
     * Other Tech    = ₹50
     * Non-Technical = ₹0
     */
    const pricing = getEventPricing(
      event.name,
      event.category
    );

    /*
     * Non-Technical events don't need Razorpay.
     */
    if (!pricing.requiresPayment) {
      return res.status(200).json({
        success: true,
        requires_payment: false,
        amount: 0,
        currency: "INR",
        registration_id:
          registration.id,
      });
    }

    /*
     * If an order already exists, return it instead of
     * creating another Razorpay order.
     *
     * This prevents accidental duplicate orders.
     */
    if (registration.razorpay_order_id) {
      return res.status(200).json({
        success: true,
        order_id:
          registration.razorpay_order_id,
        amount: pricing.amount,
        currency: "INR",
        key_id: keyId,
        registration_id:
          registration.id,
        existing_order: true,
        requires_payment: true,
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    /*
     * Create Razorpay order.
     */
    const razorpayOrder =
      await razorpay.orders.create({
        amount: pricing.amount,
        currency: "INR",
        receipt:
          `rcpt_${registration.id.slice(
            0,
            8
          )}_${Date.now()}`,
        notes: {
          registration_id:
            registration.id,
          event_id: String(
            registration.event_id
          ),
          event_name: String(
            event.name
          ),
          event_category:
            String(event.category || ""),
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
      order_id:
        razorpayOrder.id,
      amount:
        razorpayOrder.amount,
      currency:
        razorpayOrder.currency,
      key_id: keyId,
      registration_id:
        updatedRegistration.id,
      requires_payment: true,
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