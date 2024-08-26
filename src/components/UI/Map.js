import { useEffect, useRef, useState } from "react";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsToDot } from "@fortawesome/free-solid-svg-icons";

export default function TomTomMap({ stop }) {
	const dayStops = useSelector((state) => state.travel.activeDay.dayStops);
	const mapContainer = useRef(null);
	const [mapInstance, setMapInstance] = useState(null);
	const [mapError, setMapError] = useState(false); // Stato per gestire l'errore della mappa

	const otherStops = [...dayStops].filter((s) => s.id !== stop.id);

	useEffect(() => {
		if (mapContainer.current && !mapInstance) {
			try {
				const map = tt.map({
					key: "sOhLhoDd5uQFkArKiM1liP4BtoqFAxAk",
					container: mapContainer.current,
					center: [stop.longitude, stop.latitude],
					zoom: 10,
					language: "it-IT",
				});

				// Evita la propagazione del drag della mappa
				["pointerdown", "mousedown", "touchstart"].forEach((eventName) => {
					mapContainer.current.addEventListener(eventName, (event) => {
						event.stopPropagation();
					});
				});

				// Funzione per creare i marker
				const createMarker = (lngLat, color, order) => {
					const markerElement = document.createElement("div");
					markerElement.innerHTML = order;
					markerElement.style.backgroundColor = color;
					markerElement.style.color = "white";
					markerElement.style.padding = "5px";
					markerElement.style.borderRadius = "50%";
					markerElement.style.textAlign = "center";
					markerElement.style.fontWeight = "bold";
					markerElement.style.width = "30px";
					markerElement.style.height = "30px";
					markerElement.style.display = "flex";
					markerElement.style.alignItems = "center";
					markerElement.style.justifyContent = "center";
					markerElement.style.cursor = "pointer";

					return new tt.Marker({ element: markerElement }).setLngLat(lngLat);
				};

				// Pulizia dei marker e dei layer esistenti
				const removeExistingMarkers = () => {
					const existingMarkers = document.querySelectorAll(".tt-marker");
					existingMarkers.forEach((marker) => marker.remove());
				};

				const removeExistingLayers = () => {
					if (map.getLayer("route")) {
						map.removeLayer("route");
						map.removeSource("route");
					}
				};

				removeExistingMarkers();
				removeExistingLayers();

				// Aggiungo il marker per lo stop corrente
				const currentMarker = createMarker(
					[stop.longitude, stop.latitude],
					"#F97316",
					stop.order
				);
				currentMarker.addTo(map);

				// Creo e aggiungo il popup per il marker corrente
				const popupOffsets = {
					top: [0, 0],
					bottom: [0, -30],
					"bottom-right": [0, -40],
					"bottom-left": [0, -40],
					left: [25, -35],
					right: [-25, -35],
				};

				const currentPopup = new tt.Popup({ offset: popupOffsets }).setHTML(
					`${stop.title}`
				);
				currentMarker.setPopup(currentPopup);

				// Aggiungo i marker per gli altri stop
				otherStops.forEach((otherStop) => {
					const otherMarker = createMarker(
						[otherStop.longitude, otherStop.latitude],
						otherStop.is_visited ? "green" : "black",
						otherStop.order
					);
					otherMarker.addTo(map);

					// Aggiungo i popup per i marker degli altri stop
					const otherPopup = new tt.Popup({ offset: popupOffsets }).setHTML(
						`${otherStop.title}`
					);
					otherMarker.setPopup(otherPopup);
				});

				// Aggiungo il layer del percorso
				map.on("load", () => {
					map.addLayer({
						id: "route",
						type: "line",
						source: {
							type: "geojson",
							data: {
								type: "Feature",
								geometry: {
									type: "LineString",
									coordinates: dayStops.map((stop) => [
										stop.longitude,
										stop.latitude,
									]),
								},
							},
						},
						paint: {
							"line-color": "#F97316",
							"line-width": 3,
							"line-dasharray": [4, 2],
						},
					});
				});

				setMapInstance(map);
			} catch (error) {
				console.error("Errore durante il caricamento della mappa:", error);
				// Imposto l'errore se c'è un problema
				setMapError(true);
			}
		}
	}, [stop, otherStops, mapInstance]);

	// Funzione per ricentralizzare la mappa
	const recenterMap = () => {
		if (mapInstance) {
			mapInstance.setCenter([stop.longitude, stop.latitude]);
		}
	};

	return (
		<div className="relative">
			{mapError ? (
				<div className="text-red-600 text-center">
					Impossibile caricare la mappa
				</div>
			) : (
				<>
					<div
						ref={mapContainer}
						className="w-full text-zinc-800 aspect-video lg:aspect-square"
					></div>
					<button
						onClick={recenterMap}
						className="absolute top-4 right-4 bg-orange-300 text-zinc-600 py-1 px-2 rounded"
					>
						<FontAwesomeIcon icon={faArrowsToDot} />
					</button>
				</>
			)}
		</div>
	);
}
