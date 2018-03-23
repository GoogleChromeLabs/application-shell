// This file will be bundled into a valid service worker via the 'bundle-sw' gulp task.
// manifest.js will be created as part of the 'write-sw-manifest' gulp task.
import manifest from '/tmp/manifest.js';
import swLib from 'sw-lib';

swLib.cacheRevisionedAssets(manifest);

// Route all navigations to the App Shell.
swLib.router.registerNavigationRoute('/shell');

swLib.router.registerRoute(
  new RegExp('^https://www\.ifixit\.com/api/2\.0'),
  swLib.staleWhileRevalidate({
    cacheName: 'ifixit-api',
  })
);

swLib.router.registerRoute(
  new RegExp('\.cloudfront\.net/'),
  swLib.cacheFirst({
    cacheName: 'images',
    cacheExpiration: {maxEntries: 50},
    // The images are returned as opaque responses, with a status of 0.
    // Normally these wouldn't be cached; here we opt-in to caching them.
    cacheableResponse: {statuses: [0]},
  })
);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
