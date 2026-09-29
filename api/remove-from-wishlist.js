// @ts-check
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export default async function handler(req, res) {
  // Set header CORS agar bisa di-fetch dari toko Shopify (Liquid Storefront)
  if (typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Izinkan POST dan DELETE
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user_identifier, product_handle } = req.body || {};

  if (!user_identifier || !product_handle) {
    return res.status(400).json({ error: 'User identifier and product handle are required' });
  }

  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_identifier', user_identifier)
      .eq('product_handle', product_handle);

    if (error) {
      throw error;
    }

    return res.status(200).json({ message: 'Successfully removed from wishlist' });
  } catch (error) {
    return res.status(500).json({ error: 'Error removing from wishlist', details: error.message });
  }
}