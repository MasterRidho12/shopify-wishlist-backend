// @ts-check
import http from 'http';

// Import Handler Serverless Functions
import addWishlistHandler from './api/add-to-wishlist.js';
import getWishlistHandler from './api/get-wishlist.js';
import removeWishlistHandler from './api/remove-from-wishlist.js';

const PORT = 1212;

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host}`);
  
  // Ambil pathname
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Response helpers
  // @ts-ignore
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  // @ts-ignore
  res.json = function (data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data, null, 2));
    return res;
  };

  // Helper parser for query (otomatis bersihkan enter ↵ dan spasi)
  // @ts-ignore
  req.query = {};
  for (const [key, value] of parsedUrl.searchParams.entries()) {
    // @ts-ignore
    req.query[key.trim()] = value.trim();
  }

  if (req.method === 'POST' || req.method === 'DELETE') {
    let bodyData = '';
    for await (const chunk of req) {
      bodyData += chunk;
    }
    try {
      // @ts-ignore
      req.body = bodyData ? JSON.parse(bodyData) : {};
    } catch {
      // @ts-ignore
      req.body = bodyData || {};
    }
  }

  // Root Info
  if (pathname === '/' || pathname === '') {
    // @ts-ignore
    return res.status(200).json({
      status: 'online',
      message: 'Wishlist Backend Server is running. Ready for Postman testing!',
      endpoints: {
        add_wishlist: `POST http://localhost:${PORT}/api/add-to-wishlist`,
        get_wishlist: `GET http://localhost:${PORT}/api/get-wishlist?user_identifier=USER_ID`,
        remove_wishlist: `POST http://localhost:${PORT}/api/remove-from-wishlist`
      }
    });
  }

  // RUTE ENDPOINT (Gunakan .includes agar kebal terhadap karakter enter ↵ atau trailing character apapun)
  if (pathname.includes('add-to-wishlist') || pathname.includes('add-wishlist')) {
    return addWishlistHandler(req, res);
  }
  if (pathname.includes('get-wishlist')) {
    return getWishlistHandler(req, res);
  }
  if (pathname.includes('remove-from-wishlist')) {
    return removeWishlistHandler(req, res);
  }

  // 404
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Endpoint tidak ditemukan', path_received: pathname }));
});

server.listen(PORT, () => {
  console.log(`🚀 Wishlist Backend Server siap menerima request Postman di: http://localhost:${PORT}`);
});
