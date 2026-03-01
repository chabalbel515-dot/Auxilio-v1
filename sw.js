const CACHE_NAME = 'sielz-engine-v3';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './engine.js',
   // './manifest.json',
    './1000053165.jpg'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(res => {
            const fetchUpdate = fetch(e.request).then(netRes => {
                caches.open(CACHE_NAME).then(c => c.put(e.request, netRes.clone()));
                return netRes;
            });
            return res || fetchUpdate;
        })
    );
});
