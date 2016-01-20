/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

importScripts('third_party/serviceworker-cache-polyfill.js');

var CACHE_NAME = 'appshell';
var CACHE_VERSION = '@VERSION@';

self.oninstall = function(event) {
  var urls = [
    '/app-shell',
    '/images/chrome-touch-icon-192x192.png',

    '/images/side-nav-bg@2x.jpg',

    '/images/ic_menu_24px.svg',
    '/images/ic_add_24px.svg',
    '/images/ic_info_outline_24px.svg',

    '/scripts/core.js',
    '/styles/core.css',

    '/favicon.ico',
    '/manifest.json',

    '/api/',
    '/api/url-1',
    '/api/url-2',
    '/api/index'
  ];

  urls = urls.map(function(url) {
    return new Request(url, {credentials: 'include'});
  });

  event.waitUntil(
    caches
      .open(CACHE_NAME + '-v' + CACHE_VERSION)
      .then(function(cache) {
        return cache.addAll(urls);
      })
  );
};

self.onactivate = function(event) {
  var currentCacheName = CACHE_NAME + '-v' + CACHE_VERSION;
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        // TODO: This should never get called
        // can we drop this check?
        if (cacheName.indexOf(CACHE_NAME) === -1) {
          return;
        }

        if (cacheName !== currentCacheName) {
          return caches.delete(cacheName);
        }
      })
    );
  });
};

self.onfetch = function(event) {
  var request = event.request;
  event.respondWith(
    // Check the cache for a hit of the asset as is.
    caches.match(request).then((response) => {
      // If we have a response return it.
      if (response) {
        console.log('    sw: [cached] ' + request.url);
        return response;
      }

      // For other requests on our domain, return the app shell
      var url = new URL(request.url);
      if (url.host === this.location.host) {
        if (
          url.pathname.indexOf('.') === -1 &&
          url.pathname.indexOf('/partials') !== 0
        ) {
          console.log('    sw: [app-shell redirect] ' + request.url);
          return caches.match('/app-shell');
        }
      }

      // If here, then it should be a request for external url
      // analytics or web fonts for example.
      console.log('    sw: [fetch] ' + request.url);
      return fetch(request);
    })
  );
};
