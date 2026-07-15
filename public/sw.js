/*
 * KILL-SWITCH service worker.
 *
 * The previous sw.js used a cache-first strategy for /_next/static/ and /fonts/. In
 * dev those paths are stable but their contents change on every edit, so it pinned the
 * first version it cached and served stale CSS/JS/fonts forever — which looked like
 * "my changes don't apply" (gray text that was actually black on the server, fonts
 * rendering old glyphs, files appearing to revert).
 *
 * Nothing in the app registers a service worker anymore, so this one is orphaned. This
 * replacement exists only to evict the old one from browsers that still have it: on
 * activate it deletes every cache, unregisters itself, and reloads open tabs. After it
 * runs once, the app is served straight from the network with no SW in the way.
 *
 * If a PWA is wanted later, add a fresh worker that only cache-first's CONTENT-HASHED
 * assets, and bump a versioned cache name on every deploy.
 */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));

      await self.registration.unregister();

      // Reload every open tab this worker controls, so they pick up fresh assets now.
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        try {
          client.navigate(client.url);
        } catch {
          /* some clients can't be navigated; ignore */
        }
      }
    })()
  );
});

// Pass everything straight through to the network while this worker is still alive.
self.addEventListener("fetch", () => {});
