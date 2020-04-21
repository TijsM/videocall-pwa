/* eslint-disable*/

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
);

self.addEventListener("install", (event) => { 
  console.log("[Service Worker] installing Service Worker ....", event);
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  console.log("[Service Worker] Activating Service Worker ....", event);
});


// JS, CSS caching
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "static-resources",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 20 * 24 * 60 * 60, // 20 Days
      }),
    ],
  })
);



workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
