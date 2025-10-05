const REPO_NAME = '/Allah-is-one'; // This is the magic part
const CACHE_NAME = 'dhikr-counter-v2'; // Note: Changed to v2 to force an update
const urlsToCache = [
  `${REPO_NAME}/`,
  `${REPO_NAME}/index.html`,
  `${REPO_NAME}/style.css`,
  `${REPO_NAME}/script.js`,
  `${REPO_NAME}/manifest.json`,
  `${REPO_NAME}/icon-192.png`,
  `${REPO_NAME}/icon-512.png`
];

// Install the service worker and cache all the app's files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve files from the cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the file is in the cache, return it.
        if (response) {
          return response;
        }
        // Otherwise, try to get it from the network.
        return fetch(event.request);
      }
    )
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
