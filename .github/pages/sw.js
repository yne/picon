const version = "0.0.1";
const cacheName = `picon-${version}`;
//(grep -o 'http[^")'"']*" static/index.html ; ls static) | sed -E "s:(.*):'\1',:"
const assets = [
'/picon/',
'/picon/editor.html',
'/picon/opentype.js',
'/picon/script.js',
'/picon/style.css',
];
self.addEventListener('install', e => e.waitUntil(caches.open(cacheName).then(c => c.addAll(assets).then(() => self.skipWaiting()))));

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  event.respondWith(caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => response || fetch(event.request))
  );
});
