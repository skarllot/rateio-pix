const CACHE_NAME = "rateio-pix-v3";
const APP_ASSETS = ["./", "./index.html", "./styles.css", "./pix.js", "./qrcode.min.js", "./app.js", "./favicon.svg", "./manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (event.request.url.startsWith(self.location.origin)) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      if (event.request.mode === "navigate") return caches.match("./index.html");
      return new Response("Offline", { status: 503, statusText: "Offline" });
    }
  })());
});
