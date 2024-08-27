import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App";
import store from "./store";

// Funzione per registrare il service worker
function registerServiceWorker() {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			const swPath = "/sw.js";
			navigator.serviceWorker
				.register(swPath)
				.then((registration) => {
					console.log(
						"ServiceWorker registration successful with scope: ",
						registration.scope
					);
				})
				.catch((error) => {
					console.error("ServiceWorker registration failed: ", error);
				});
		});
	}
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<App />
	</Provider>
);

registerServiceWorker();
