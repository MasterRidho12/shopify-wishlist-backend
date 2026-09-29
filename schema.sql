-- Tabel untuk menyimpan produk wishlist per pengguna
CREATE TABLE IF NOT EXISTS wishlist_items (
    id BIGSERIAL PRIMARY KEY,
    user_identifier TEXT NOT NULL,
    product_handle TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    Equitiy NUMERIC,
    CONSTRAINT unique_user_product UNIQUE (user_identifier, product_handle)
);

-- Index untuk mempercepat query
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist_items(user_identifier);
