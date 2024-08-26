import { useSelector } from "react-redux";
import ColoredBtn from "./UI/ColoredBtn";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { debounce } from "lodash";
import InputStop from "./UI/InputStop";

export default function StopForm({ existingStop, handleCancel }) {
	const selectedTravel = useSelector((state) => state.travel.selectedTravel);
	const activeDay = useSelector((state) => state.travel.activeDay);
	const [addressAdvice, setAddressAdvice] = useState([]);
	const [selectedPlace, setSelectedPlace] = useState(null);
	const isSubmitting = useSelector((state) => state.travel.isSubmitting);

	const place = selectedPlace?.address.freeformAddress || "";
	const long = selectedPlace?.position.lon || existingStop?.longitude || "";
	const lat = selectedPlace?.position.lat || existingStop?.latitude || "";

	const refPlace = useRef(place);

	function handleSelect(place) {
		setSelectedPlace(place);
		setAddressAdvice([]);
		if (refPlace.current) {
			refPlace.current.value = place.address.freeformAddress;
		}
	}

	const debouncedGetAdvices = debounce(async (place) => {
		try {
			const response = await axios.get(
				`https://api.tomtom.com/search/2/search/${encodeURIComponent(
					place
				)}.json`,
				{
					params: {
						key: "sOhLhoDd5uQFkArKiM1liP4BtoqFAxAk",
						limit: 8,
						language: "it-IT",
						sortBy: "relevance",
					},
				}
			);
			setAddressAdvice(response.data.results || []);
		} catch (error) {
			console.error("Error fetching address advice", error);
		}
	}, 500);

	function handlePlaceChange(event) {
		setSelectedPlace(null);
		const newPlace = event.target.value;
		if (newPlace.length > 2) {
			debouncedGetAdvices(newPlace);
		} else {
			setAddressAdvice([]);
		}
	}

	useEffect(() => {
		return () => {
			debouncedGetAdvices.cancel();
		};
	}, [debouncedGetAdvices]);

	return (
		<div
			onClick={() => setAddressAdvice([])}
			className="flex flex-wrap transition-all duration-500 text-zinc-900"
		>
			<input
				name="travel_id"
				type="hidden"
				value={selectedTravel.id}
				required
			/>

			<input name="day" type="hidden" value={activeDay.id} required />

			<input
				name="order"
				type="hidden"
				defaultValue={existingStop?.order}
				required
			/>

			<input name="longitude" type="hidden" value={long} required />

			<input name="latitude" type="hidden" value={lat} required />

			<div className="w-full md:w-1/2 text-left pt-4 px-2">
				<InputStop
					label="Titolo *"
					type="text"
					id="title"
					defaultValue={existingStop?.title}
					required
					maxLength={150}
				/>
			</div>

			<div className="w-full md:w-1/2 text-left pt-4 px-2 relative">
				<InputStop
					label="Di quale luogo parliamo? (Seleziona uno dei consigliati)*"
					id="place"
					defaultValue={existingStop?.place}
					ref={refPlace}
					onChange={handlePlaceChange}
					required
				/>
				<ul className="absolute w-full">
					{addressAdvice.length > 1 &&
						addressAdvice.map((advice) => (
							<li
								className="bg-zinc-300 text-zinc-900 cursor-pointer border-2 border-t-0 mr-4 border-white p-1"
								key={advice.id}
								onClick={() => handleSelect(advice)}
							>
								{advice.address.freeformAddress}
							</li>
						))}
				</ul>
			</div>

			<div className="w-full md:w-1/2 text-left pt-4 px-2">
				<InputStop
					textarea
					label="Inserisci una descrizione"
					id="description"
					defaultValue={existingStop?.description}
				/>
			</div>

			<div className="w-full md:w-1/2 text-left pt-4 px-2">
				<InputStop
					textarea
					label="Inserisci i piatti di tuo interesse"
					id="food"
					defaultValue={existingStop?.food}
				/>
			</div>

			<small className="pt-8 px-2">* Questi campi sono obbligatori</small>

			<div className="flex justify-center gap-4 items-center w-full">
				{existingStop && (
					<ColoredBtn
						onClick={handleCancel}
						disabled={isSubmitting}
						type="button"
					>
						Annulla
					</ColoredBtn>
				)}

				<button
					disabled={isSubmitting}
					className={`${
						isSubmitting
							? "bg-orange-500 text-orange-50"
							: "text-gray-800 bg-orange-500"
					} px-6 py-3 my-8 font-bold rounded-md text-lg transition-all border-2 border-orange-500  hover:bg-orange-500 hover:text-orange-50 hover:border-white`}
				>
					{isSubmitting ? "Attendi..." : "Salva"}
				</button>
			</div>
		</div>
	);
}
