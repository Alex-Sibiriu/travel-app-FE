const CACHE_NAME = "appV4";

// Questo array include le risorse critiche da precacheare
const urlsToCache = ["/", "/auth", "/offline", "/index.html"];

this.addEventListener("install", (event) => {
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
				return response;
			}

			return fetch(event.request)
				.then((networkResponse) => {
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
				})
				.catch((error) => {
					console.error("Fetch failed:", error);
				});
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
