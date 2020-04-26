/* eslint-disable*/

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
);

/* 
-----
static caching
-----
*/
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

/* 
-----
push notifications
-----
*/
self.addEventListener("push", function (e) {
  //the payload that the backend added - this can be used to have different notifications
  const payload = JSON.parse(e.data.text())
  console.log(payload);
  let options;
  if (payload.name === "inRoom") {
    
    options = {
      body: "Open the app and say hi!",
      icon: "images/example.png",
      vibrate: [300, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };

    e.waitUntil(
      self.registration.showNotification(`someboy is in ${payload.roomName}`, options)
    );
  } else {
    options = {
      body: "This notification was generated from a push!",
      icon: "images/example.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
      actions: [
        {
          action: "explore",
          title: "Explore this new world",
          icon: "images/checkmark.png",
        },
        { action: "close", title: "Close", icon: "images/xmark.png" },
      ],
    };

    e.waitUntil(self.registration.showNotification("HELLO WORLD", options));
  }
});
