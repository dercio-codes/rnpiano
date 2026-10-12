// RNPiano service worker. Bump VERSION to invalidate old caches.
const VERSION = "v1";
const STATIC = `rnpiano-static-${VERSION}`;
const PAGES = `rnpiano-pages-${VERSION}`;
const PRECACHE = ["/", "/icons/icon-192.png", "/icons/icon-512.png"];

// Never touch the private area or anything that carries a session.
const BYPASS = [/^\/admin(\/|$)/, /^\/login(\/|$)/, /^\/api\//, /^\/sw\.js$/];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => ![STATIC, PAGES].includes(k)).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

const isStaticAsset = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.startsWith("/_next/image") ||
  url.pathname.startsWith("/icons/") ||
  url.pathname.startsWith("/covers/") ||
  /\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2?)$/i.test(url.pathname);

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (BYPASS.some((re) => re.test(url.pathname))) return;
  // Next's RSC/prefetch requests are not full pages; leave them to the network.
  if (req.headers.get("RSC") || url.searchParams.has("_rsc")) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && !res.redirected) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(PAGES);
          return (
            (await cache.match(req)) ||
            (await cache.match("/")) ||
            new Response("You're offline. Reconnect to load RNPiano.", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
          );
        }),
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      }),
    );
  }
});
