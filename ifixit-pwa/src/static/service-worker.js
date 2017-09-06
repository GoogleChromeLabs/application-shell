// Alternatively, use your own local copy of workbox-sw.prod.vX.Y.Z.js
importScripts('https://unpkg.com/workbox-sw@2.0.0/build/importScripts/workbox-sw.prod.v2.0.0.js');

const workboxSW = new WorkboxSW();
// Pass in an empty array for our dev environment service worker.
// As part of the production build process, the `service-worker` gulp task will
// automatically replace the empty array with the current the precache manifest.
workboxSW.precache([]);

// All navigation requests should be routed to the App Shell.
workboxSW.router.registerNavigationRoute('/app-shell');

// Use a stale-while-revalidate strategy for all iFixit API requests.
workboxSW.router.registerRoute(
  new RegExp('^https://www\\.ifixit\\.com/api/2\\.0'),
  workboxSW.strategies.staleWhileRevalidate({cacheName: 'ifixit-api'})
);

// Use a cache-first strategy for the images, all of which have unique URLs.
workboxSW.router.registerRoute(
  new RegExp('^https://\\w+\\.cloudfront\\.net/'),
  workboxSW.strategies.cacheFirst({
    cacheName: 'images',
    cacheExpiration: {maxEntries: 50},
    // The images are returned as opaque responses, with a status of 0.
    // Normally these wouldn't be cached; here we opt-in to caching them.
    cacheableResponse: {statuses: [0]}
  })
);
