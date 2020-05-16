const cacheList = ["./"];
const cacheName = "picon-1";
self.addEventListener('install', e => e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(cacheList).then(() => self.skipWaiting()))));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => e.respondWith(caches.open(cacheName).then(cache => cache.match(e.request, {ignoreSearch: true})).then(response => (e.request.cache !== 'only-if-cached' || e.request.mode === 'same-origin') ? (response || fetch(e.request)) : response)));