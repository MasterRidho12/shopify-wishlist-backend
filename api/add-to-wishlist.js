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
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user_identifier, product_handle, Equitiy, quantity, equity } = req.body || {};

  if (!user_identifier || !product_handle) {
    return res.status(400).json({ error: 'User identifier and product handle are required' });
  }

  const cleanUser = String(user_identifier).trim();
  const cleanHandle = String(product_handle).trim();
  const equitiyVal = Equitiy !== undefined ? Equitiy : (quantity !== undefined ? quantity : equity);

  /** @type {Record<string, any>} */
  const insertData = {
    user_identifier: cleanUser,
    product_handle: cleanHandle
  };

  if (equitiyVal !== undefined && equitiyVal !== null && equitiyVal !== '') {
    insertData.Equitiy = Number(equitiyVal);
  }

  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert(insertData);

    if (error) {
      // Handle jika item sudah ada di wishlist (unique constraint violation)
      if (error.code === '23505') {
        return res.status(200).json({ message: 'Item already in wishlist' });
      }
      throw error;
    }

    return res.status(201).json({ 
      message: 'Successfully added to wishlist',
      data: insertData
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error adding to wishlist', details: error.message });
  }
}