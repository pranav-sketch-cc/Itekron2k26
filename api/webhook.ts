import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { supabaseAdmin } from './_lib/supabaseAdmin.js';

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  if (!WEBHOOK_SECRET || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  /*
   * Razorpay webhook should only accept POST requests.
   */
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  if (!WEBHOOK_SECRET) {
    console.error(
      'RAZORPAY_WEBHOOK_SECRET is not configured'
    );

    return res.status(500).json({
      success: false,
      error: 'Webhook secret is not configured',
    });
  }

  try {
    /*
     * Razorpay signature verification MUST use the
     * original/raw request body.
     *
     * Vercel may already parse req.body, so we handle
     * both raw body and parsed body safely.
     */
    let rawBody: string;

    if (typeof req.body === 'string') {
      rawBody = req.body;
    } else if (Buffer.isBuffer(req.body)) {
      rawBody = req.body.toString('utf8');
    } else {
      rawBody = JSON.stringify(req.body);
    }

    const webhookSignature =
      req.headers['x-razorpay-signature'];

    const signature = Array.isArray(webhookSignature)
      ? webhookSignature[0]
      : webhookSignature;

    if (
      !signature ||
      !verifyWebhookSignature(
        rawBody,
        signature
      )
    ) {
      console.error(
        'Invalid Razorpay webhook signature'
      );

      return res.status(400).json({
        success: false,
        error: 'Invalid webhook signature',
      });
    }

    let payload: any;

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON payload',
      });
    }

    const event = payload?.event;

    /*
     * We only care about successful payment events.
     *
     * payment.captured:
     * Razorpay confirms that the payment has been captured.
     *
     * order.paid:
     * Razorpay confirms that the order has been paid.
     */
    if (
      event !== 'payment.captured' &&
      event !== 'order.paid'
    ) {
      /*
       * Return 200 for other legitimate Razorpay events.
       * This prevents unnecessary webhook retries.
       */
      return res.status(200).json({
        success: true,
        received: true,
        ignored: true,
        event,
      });
    }

    /*
     * -------------------------------------------------------
     * Extract Razorpay payment/order information
     * -------------------------------------------------------
     */

    const paymentEntity =
      payload?.payload?.payment?.entity;

    const orderEntity =
      payload?.payload?.order?.entity;

    const razorpayPaymentId =
      paymentEntity?.id || null;

    const razorpayOrderId =
      paymentEntity?.order_id ||
      orderEntity?.id ||
      null;

    if (!razorpayOrderId) {
      console.error(
        'Razorpay webhook did not contain order_id'
      );

      /*
       * Return 400 because we cannot safely associate
       * this payment with an existing registration.
       */
      return res.status(400).json({
        success: false,
        error: 'Missing Razorpay order ID',
      });
    }

    /*
     * -------------------------------------------------------
     * Find the EXISTING registration.
     *
     * IMPORTANT:
     * We never create a registration from a webhook.
     *
     * We only update a registration whose
     * razorpay_order_id already exists.
     * -------------------------------------------------------
     */
    const {
      data: registration,
      error: registrationError,
    } = await supabaseAdmin
      .from('registrations')
      .select(
        'id, registration_id, event_id, status, payment_status, razorpay_order_id, razorpay_payment_id'
      )
      .eq(
        'razorpay_order_id',
        razorpayOrderId
      )
      .maybeSingle();

    if (registrationError) {
      console.error(
        'Registration lookup failed:',
        registrationError
      );

      return res.status(500).json({
        success: false,
        error: 'Failed to lookup registration',
      });
    }

    /*
     * A webhook for an order that doesn't belong to one
     * of our registrations must not create anything.
     */
    if (!registration) {
      console.error(
        'No registration found for Razorpay order:',
        razorpayOrderId
      );

      /*
       * Return 200 rather than repeatedly retrying forever.
       * The payment exists at Razorpay, but it is not linked
       * to a registration in our database.
       */
      return res.status(200).json({
        success: true,
        received: true,
        linked: false,
        message:
          'No matching registration found',
      });
    }

    /*
     * -------------------------------------------------------
     * IDEMPOTENCY
     * -------------------------------------------------------
     *
     * Razorpay can send the same webhook more than once.
     *
     * If our registration is already completed/paid and
     * the same payment has already been recorded, simply
     * acknowledge the webhook.
     */
    if (
      registration.payment_status === 'completed' &&
      registration.razorpay_payment_id ===
        razorpayPaymentId
    ) {
      return res.status(200).json({
        success: true,
        received: true,
        already_processed: true,
        registration_id:
          registration.registration_id ||
          registration.id,
      });
    }

    /*
     * -------------------------------------------------------
     * PAYMENT SUCCESS
     * -------------------------------------------------------
     *
     * Only update the existing registration.
     *
     * Do NOT trust amount/event information from the browser.
     * The registration/order was already created by our
     * server-side order flow.
     */
    const updatePayload: Record<
      string,
      unknown
    > = {
      payment_status: 'completed',
      status: 'completed',
    };

    if (razorpayPaymentId) {
      updatePayload.razorpay_payment_id =
        razorpayPaymentId;
    }

    const {
      error: updateError,
    } = await supabaseAdmin
      .from('registrations')
      .update(updatePayload)
      .eq(
        'id',
        registration.id
      );

    if (updateError) {
      console.error(
        'Failed to update registration after payment:',
        updateError
      );

      /*
       * Return 500 so Razorpay can retry the webhook.
       */
      return res.status(500).json({
        success: false,
        error:
          'Failed to update registration',
      });
    }

    console.log(
      'Razorpay webhook processed successfully:',
      {
        event,
        registrationId:
          registration.registration_id ||
          registration.id,
        razorpayOrderId,
        razorpayPaymentId,
      }
    );

    return res.status(200).json({
      success: true,
      received: true,
      processed: true,
      registration_id:
        registration.registration_id ||
        registration.id,
      razorpay_order_id:
        razorpayOrderId,
      razorpay_payment_id:
        razorpayPaymentId,
    });
  } catch (error) {
    console.error(
      'Razorpay webhook error:',
      error
    );

    /*
     * 500 tells Razorpay that processing failed and
     * allows the webhook to be retried.
     */
    return res.status(500).json({
      success: false,
      error: 'Webhook processing failed',
    });
  }
}