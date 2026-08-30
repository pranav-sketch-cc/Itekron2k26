/// <reference types="node" />
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { supabaseAdmin } from './_lib/supabaseAdmin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { registration_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!registration_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing verification attributes' });
    }

    // 1. Fetch server-recorded razorpay_order_id
    const { data: regRecord, error: fetchErr } = await supabaseAdmin
      .from('registrations')
      .select('id, user_id, event_id, payment_status, razorpay_order_id')
      .eq('id', registration_id)
      .single();

    if (fetchErr || !regRecord || !regRecord.razorpay_order_id) {
      return res.status(404).json({ error: 'Registration or order record not found' });
    }

    // IDEMPOTENCY CHECK: If already completed, exit cleanly
    if (regRecord.payment_status === 'completed') {
      return res.status(200).json({ success: true, message: 'Payment already verified' });
    }

    // 2. Compute expected HMAC signature
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const body = `${regRecord.razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await supabaseAdmin
        .from('registrations')
        .update({ payment_status: 'failed' })
        .eq('id', registration_id);

      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Determine pricing
    const isConvera = String(regRecord.event_id).toLowerCase().includes('convera');
    const amountPaid = isConvera ? 150 : 50;

    // 3. Mark registration as completed
    const { error: updateErr } = await supabaseAdmin
      .from('registrations')
      .update({
        payment_status: 'completed',
        amount_paid: amountPaid,
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq('id', registration_id);

    if (updateErr) {
      console.error('Failed to update registration status:', updateErr);
      return res.status(500).json({ error: 'Failed to update payment status' });
    }

    return res.status(200).json({ success: true, message: 'Payment verified and registration confirmed' });
  } catch (error: any) {
    console.error('Verification handler error:', error);
    return res.status(500).json({ error: 'Internal verification failure' });
  }
}