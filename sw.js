// Guarda la app para que abra sin señal (por ejemplo en una estación de servicio).
const C = 'registro-vehiculos-v1';
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html'])).catch(() => {}));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  const ok = u.origin === location.origin || /(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/.test(u.host);
  if (!ok) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)).catch(() => {}); return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html')))
  );
});
