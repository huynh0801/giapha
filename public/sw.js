// Service Worker for Gia Phả Dòng Họ PWA
const CACHE_NAME = "giapha-pwa-v2";
const PRECACHE_URLS = [
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
  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  const url = event.request.url;

  // NEVER intercept dynamic routes, next internals, auth or API calls
  if (
    url.includes("/api/") ||
    url.includes("/_next/") ||
    url.includes("supabase.co") ||
    url.startsWith("chrome-extension") ||
    event.request.headers.get("RSC") === "1" ||
    event.request.headers.get("Next-Router-State-Tree") ||
    event.request.mode === "navigate"
  ) {
    return;
  }

  // Only handle static assets
  const isStaticAsset =
    url.match(/\.(png|jpg|jpeg|svg|css|woff2|ico|webmanifest|json)$/) ||
    url.endsWith("/site.webmanifest");

  if (!isStaticAsset) {
    return;
  }

  // Network-first strategy with cache fallback for static assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
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
