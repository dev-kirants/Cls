// Attendance Ledger service worker: app opens even with a weak connection; data always comes live from Firestore.
const CACHE = 'attendance-ledger-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.hostname === 'firestore.googleapis.com') return;      // never cache live data
  if (url.origin === location.origin) {                                                  // your own files: newest first, cache as fallback
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })
      .catch(() => caches.match(req).then(m => m || caches.match('./index.html'))));
    return;
  }
  if (/cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url.hostname)) {   // libraries & fonts: cached copy first
    e.respondWith(caches.match(req).then(m => m || fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })));
  }
});
