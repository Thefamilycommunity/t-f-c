/* THE FAMILY COMMUNITY — Service Worker */
const CACHE_NAME = 'tfc-cache-v1.2.2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap'
];

/* Install: cache aset inti */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS.map((url) => cache.add(url).catch(() => null))
      );
    })
  );
});

/* Activate: hapus cache lama */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* Fetch: network-first untuk API, cache-first untuk aset statis */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Jangan cache GAS / Firebase / wa.me / api eksternal
  const bypass = [
    'script.google.com',
    'script.googleusercontent.com',
    'firebaseio.com',
    'googleapis.com',
    'gstatic.com/firebasejs',
    'wa.me',
    'api.allorigins.win',
    'corsproxy.io'
  ];
  if (bypass.some((host) => url.hostname.includes(host) || url.href.includes(host))) {
    return; // biarkan browser handle langsung
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (!res || res.status !== 200 || res.type === 'opaque') return res;
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});

/* Terima pesan dari halaman (misal: skipWaiting) */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});