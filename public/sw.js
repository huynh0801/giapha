// Service Worker for Gia Phả Dòng Họ PWA
const CACHE_NAME = "giapha-pwa-v1";
const PRECACHE_URLS = [
  "/",
  "/site.webmanifest",
  "/images/landing/logo.png",
  "/android-chrome-192x192.png",
  "/apple-touch-icon.png",
  "/favicon-32x32.png",
  "/favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests and exclude Supabase or API endpoints
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("/api/") ||
    event.request.url.includes("supabase.co") ||
    event.request.url.startsWith("chrome-extension")
  ) {
    return;
  }

  // Network-first strategy with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful basic responses for static assets
        if (
          response &&
          response.status === 200 &&
          (event.request.url.match(/\.(png|jpg|jpeg|svg|css|woff2|ico|webmanifest|json)$/) ||
           event.request.url.endsWith("/site.webmanifest"))
        ) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
