// @ts-check
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase client di server
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export default async function handler(req, res) {
  // Set header CORS agar bisa di-fetch dari toko Shopify (Liquid Storefront)
  if (typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Hanya izinkan metode GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user_identifier } = req.query || {};

  if (!user_identifier) {
    return res.status(400).json({ error: 'User identifier is required' });
  }

  // Bersihkan spasi atau karakter enter (↵)
  const cleanUser = String(user_identifier).trim();

  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id, product_handle, Equitiy, created_at')
      .eq('user_identifier', cleanUser);

    if (error) {
      throw error;
    }

    return res.status(200).json(data || []);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching wishlist', details: error.message });
  }
}