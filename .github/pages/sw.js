const version = "0.0.1";
const cacheName = `picon-${version}`;
//(grep -o 'http[^")'"']*" static/index.html ; ls static) | sed -E "s:(.*):'\1',:"
const assets = [
'https://unpkg.com/vue@2.6.11/dist/vue.min.js',
'/picon/opentype.js',
'/picon/',
'/picon/editor.html',
'/picon/favicon.ico',
'/picon/script.js',
'/picon/style.css',
'/picon/sw.js',
"/picon/compare/clarity-bug.png",
"/picon/compare/clarity-phone.png",
"/picon/compare/clarity-pic.png",
"/picon/compare/clarity-vol.png",
"/picon/compare/entypo-bug.png",
"/picon/compare/entypo-phone.png",
"/picon/compare/entypo-pic.png",
"/picon/compare/entypo-vol.png",
"/picon/compare/feather-bug.png",
"/picon/compare/feather-phone.png",
"/picon/compare/feather-pic.png",
"/picon/compare/feather-vol.png",
"/picon/compare/fontawesome-bug.png",
"/picon/compare/fontawesome-phone.png",
"/picon/compare/fontawesome-pic.png",
"/picon/compare/fontawesome-vol.png",
"/picon/compare/jam-bug.png",
"/picon/compare/jam-phone.png",
"/picon/compare/jam-pic.png",
"/picon/compare/jam-vol.png",
"/picon/compare/material-bug.png",
"/picon/compare/material-phone.png",
"/picon/compare/material-pic.png",
"/picon/compare/material-vol.png",
"/picon/compare/picon-bug.png",
"/picon/compare/picon-phone.png",
"/picon/compare/picon-pic.png",
"/picon/compare/picon-vol.png",
];
self.addEventListener('install', e => e.waitUntil(caches.open(cacheName).then(c => c.addAll(assets).then(() => self.skipWaiting()))));

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  event.respondWith(caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => response || fetch(event.request))
  );
});
