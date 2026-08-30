/// <reference types="node" />
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import { supabaseAdmin } from './_lib/supabaseAdmin';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (err: any) => reject(err));
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const razorpaySignature = req.headers['x-razorpay-signature'] as string;

  if (!webhookSecret || !razorpaySignature) {
    return res.status(400).json({ error: 'Missing webhook secret or signature header' });
  }

  let rawBodyBuffer: Buffer;
  try {
    rawBodyBuffer = await getRawBody(req);
  } catch (err: any) {
    return res.status(400).json({ error: 'Failed to read raw request body' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBodyBuffer)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  let eventPayload: any;
  try {
    eventPayload = JSON.parse(rawBodyBuffer.toString('utf8'));
  } catch (err: any) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const eventType = eventPayload?.event;

  if (eventType === 'payment.captured' || eventType === 'order.paid') {
    try {
      const paymentEntity = eventPayload?.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (!orderId || !paymentId) {
        return res.status(200).json({ status: 'ignored', message: 'Missing order_id or payment_id' });
      }

      const { data: reg, error: fetchErr } = await supabaseAdmin
        .from('registrations')
        .select('id, event_id, payment_status')
        .eq('razorpay_order_id', orderId)
        .single();

      if (fetchErr || !reg) {
        return res.status(200).json({ status: 'not_found', message: 'Registration record not found' });
      }

      if (reg.payment_status === 'completed') {
        return res.status(200).json({ status: 'already_completed', message: 'Payment already processed' });
      }

      const isConvera = String(reg.event_id).toLowerCase().includes('convera');
      const amountPaid = isConvera ? 150 : 50;

      const { error: updateErr } = await supabaseAdmin
        .from('registrations')
        .update({
          payment_status: 'completed',
          amount_paid: amountPaid,
          razorpay_payment_id: paymentId,
        })
        .eq('id', reg.id);

      if (updateErr) {
        return res.status(500).json({ error: 'Database update failed' });
      }

      return res.status(200).json({ status: 'success', message: 'Registration status updated to completed' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(200).json({ status: 'ignored', message: 'Event type ignored' });
}