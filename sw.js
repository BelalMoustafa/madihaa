/* Engagement Invitation — Offline Service Worker */
const CACHE_VERSION = 'engagement-offline-v2';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/bg-music.mp3',
  './assets/calendar-frame.webp',
  './assets/childhood.jpg',
  './assets/engagement.jpg',
  './assets/filigree.webp',
  './assets/flower-frame.webp',
  './assets/flower1.webp',
  './assets/flower2.webp',
  './assets/flower3.webp',
  './assets/fonts/fonts.css',
  './assets/fonts/alexbrush-1.woff2',
  './assets/fonts/alexbrush-2.woff2',
  './assets/fonts/alexbrush-3.woff2',
  './assets/fonts/amiri-4.woff2',
  './assets/fonts/amiri-5.woff2',
  './assets/fonts/amiri-6.woff2',
  './assets/fonts/amiri-7.woff2',
  './assets/fonts/amiri-8.woff2',
  './assets/fonts/amiri-9.woff2',
  './assets/fonts/amiri-10.woff2',
  './assets/fonts/amiri-11.woff2',
  './assets/fonts/amiri-12.woff2',
  './assets/fonts/cormorantgaramond-13.woff2',
  './assets/fonts/cormorantgaramond-14.woff2',
  './assets/fonts/cormorantgaramond-15.woff2',
  './assets/fonts/cormorantgaramond-16.woff2',
  './assets/fonts/cormorantgaramond-17.woff2',
  './assets/fonts/cormorantgaramond-18.woff2',
  './assets/fonts/cormorantgaramond-19.woff2',
  './assets/fonts/cormorantgaramond-20.woff2',
  './assets/fonts/cormorantgaramond-21.woff2',
  './assets/fonts/cormorantgaramond-22.woff2',
  './assets/fonts/greatvibes-23.woff2',
  './assets/fonts/greatvibes-24.woff2',
  './assets/fonts/greatvibes-25.woff2',
  './assets/fonts/greatvibes-26.woff2',
  './assets/fonts/greatvibes-27.woff2',
  './assets/fonts/greatvibes-28.woff2',
  './assets/fonts/librebaskerville-29.woff2',
  './assets/fonts/librebaskerville-30.woff2',
  './assets/fonts/librebaskerville-31.woff2',
  './assets/fonts/librebaskerville-32.woff2',
  './assets/fonts/montserrat-33.woff2',
  './assets/fonts/montserrat-34.woff2',
  './assets/fonts/montserrat-35.woff2',
  './assets/fonts/montserrat-36.woff2',
  './assets/fonts/montserrat-37.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
