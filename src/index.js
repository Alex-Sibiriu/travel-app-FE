import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);

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

registerServiceWorker();
