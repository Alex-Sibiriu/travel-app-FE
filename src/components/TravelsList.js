import { useNavigate } from "react-router-dom";
import countries from "../utilities/countriesList";

import { setSelectedTravel, setActiveDay } from "../store/travelSlice";
import { useDispatch } from "react-redux";

function getFlag(country) {
	const nation = countries.find((nation) => nation.country === country);
	return nation.flag;
}

export default function TravelsList({ travels }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	function selectTravel(travel) {
		dispatch(
			setActiveDay({
				id: null,
				dayStops: [],
			})
		);
		dispatch(setSelectedTravel(travel));
		navigate(`/travel/${travel.slug}`);
	}

	return (
		<div className="w-11/12 mx-auto pt-8 flex flex-wrap justify-center">
			{travels.map((travel) => (
				<div
					onClick={() => selectTravel(travel)}
					key={travel.slug}
					className="w-full grow-0 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 pt-8 rounded-md overflow-hidden transition-all hover:scale-105 hover:brightness-110 cursor-pointer"
				>
					<div className="rounded-3xl overflow-hidden border-4 border-zinc-400 bg-orange-600">
						<img
							src={`/asset/flags/${getFlag(travel.country)}`}
							alt={travel.country}
							onError={(e) => {
								e.target.onerror = null;
								e.target.style.display = "none";
								e.target.parentNode.insertAdjacentHTML(
									"beforeend",
									'<div class="h-52 min-w-52 px-4 flex items-center justify-center text-white bg-zinc-600">Impossibile caricare l\'immagine</div>'
								);
							}}
						/>
					</div>
					<p className="text-black mt-2 bg-gradient-to-l from-transparent via-white to-transparent font-bold text-xl">
						{travel.title}
					</p>
				</div>
			))}
			{travels.length < 1 && (
				<p className="font-bold text-stone-600 bg-gradient-to-r from-transparent via-white to-transparent px-32 py-2 text-xl uppercase">
					Non hai ancora organizzato un viaggio.
				</p>
			)}
		</div>
	);
}
