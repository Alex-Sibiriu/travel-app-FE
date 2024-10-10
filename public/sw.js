const CACHE_NAME = "appV11";

// Questo array include le risorse critiche da precacheare
const urlsToCache = ["/", "/auth", "/offline", "/index.html"];

this.addEventListener("install", (event) => {
	self.skipWaiting();
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache);
		})
	);
});

this.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response; // Risposta dalla cache
			}

			// Controlla se l'URL ha uno schema valido
			if (
				event.request.url.startsWith("http://") ||
				event.request.url.startsWith("https://")
			) {
				return fetch(event.request).then((networkResponse) => {
					if (
						!networkResponse ||
						networkResponse.status !== 200 ||
						networkResponse.type !== "basic"
					) {
						return networkResponse;
					}

					const responseToCache = networkResponse.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseToCache);
					});

					return networkResponse;
				});
			}
			// Se non è uno schema valido, non fare nulla
			return fetch(event.request);
		})
	);
});

this.addEventListener("activate", (event) => {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
