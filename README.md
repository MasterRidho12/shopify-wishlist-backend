# 🛍️ Wishlist Backend API (Supabase & Shopify)

Backend service untuk fitur Wishlist toko online Shopify (Liquid Storefront). Menyediakan endpoint REST API serverless yang terhubung langsung ke database PostgreSQL Supabase.

---

## 🚀 Endpoints API

### 1. Menambah ke Wishlist (`POST /api/add-to-wishlist`)
Menambahkan produk ke wishlist pengguna.
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "user_identifier": "ridho_123",
    "product_handle": "jaket-denim-keren",
    "Equitiy": 1
  }
  ```
- **Response**: `201 Created`

---

### 2. Mengambil Daftar Wishlist (`GET /api/get-wishlist`)
Mengambil semua item wishlist berdasarkan `user_identifier`.
- **Method**: `GET`
- **Query Params**: `?user_identifier=ridho_123`
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 1,
      "product_handle": "jaket-denim-keren",
      "Equitiy": 1,
      "created_at": "2026-09-29T04:12:09.214169+00:00"
    }
  ]
  ```

---

### 3. Menghapus dari Wishlist (`POST /api/remove-from-wishlist`)
Menghapus produk tertentu dari wishlist pengguna.
- **Method**: `POST` atau `DELETE`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "user_identifier": "ridho_123",
    "product_handle": "jaket-denim-keren"
  }
  ```
- **Response**: `200 OK`

---

## 🗄️ Skema Database (Supabase)

Tabel `wishlist_items`:
```sql
CREATE TABLE IF NOT EXISTS wishlist_items (
    id BIGSERIAL PRIMARY KEY,
    user_identifier TEXT NOT NULL,
    product_handle TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    Equitiy NUMERIC,
    CONSTRAINT unique_user_product UNIQUE (user_identifier, product_handle)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist_items(user_identifier);
```

---

## ⚙️ Menjalankan Secara Lokal

1. Salin `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
2. Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_KEY`.
3. Jalankan server:
   ```bash
   npm start
   ```
4. Endpoint aktif di `http://localhost:1212`.
