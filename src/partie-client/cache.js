
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            console.log("Hello");
            return cache.addAll([
                '/src/partie-client/accueil.html',
                '/src/partie-client/scripts/accueil.js'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
    );
});
