/* Engagement Invitation — Offline Service Worker */
const CACHE_VERSION = 'engagement-offline-v3';
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

function isShellRequest(request) {
  if (request.mode === 'navigate') return true;

  const path = new URL(request.url).pathname;
  return (
    path.endsWith('/index.html') ||
    path.endsWith('/') ||
    path.endsWith('/manifest.webmanifest') ||
    path.endsWith('/sw.js')
  );
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match('./index.html');
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    const cache = await caches.open(CACHE_VERSION);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
    );
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    isShellRequest(request) ? networkFirst(request) : cacheFirst(request)
  );
});
