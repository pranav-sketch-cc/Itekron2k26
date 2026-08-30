/// <reference types="node" />
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { supabaseAdmin } from './_lib/supabaseAdmin';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { registration_id, event_id } = req.body;

    if (!registration_id || !event_id) {
      return res.status(400).json({ error: 'Missing registration_id or event_id' });
    }

    // Determine event price strictly server-side (in paise)
    const isConvera = String(event_id).toLowerCase().includes('convera');
    const amountInPaise = isConvera ? 15000 : 5000; // ₹150 vs ₹50

    // Create Razorpay Order
    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${registration_id.slice(0, 8)}_${Date.now()}`,
      notes: {
        registration_id,
        event_id,
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Persist razorpay_order_id into registrations table
    const { error: dbError } = await supabaseAdmin
      .from('registrations')
      .update({
        razorpay_order_id: razorpayOrder.id,
        payment_status: 'pending',
      })
      .eq('id', registration_id);

    if (dbError) {
      console.error('Database update error:', dbError);
      return res.status(500).json({ error: 'Failed to record payment order' });
    }

    return res.status(200).json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay Order:', error);
    return res.status(500).json({ error: 'Failed to create payment order' });
  }
}