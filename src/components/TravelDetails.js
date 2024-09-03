import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActiveDay, deleteTravel } from "../store/travelSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import countries from "../utilities/countriesList";
import SwiperDays from "./SwiperDays";
import StopsList from "./StopsList";
import ColoredBtn from "./UI/ColoredBtn";
import axios from "../store/axios";
import { useRef, useState } from "react";
import Modal from "./UI/Modal";
import { setIsSubmitting } from "../store/travelSlice";
import TravelGallery from "./TravelGallery";

function getFlag(country) {
	const nation = countries.find((nation) => nation.country === country);
	return nation.flag;
}

function formatDate(dateString) {
	const options = { day: "numeric", month: "long", year: "numeric" };
	const date = new Date(dateString);

	return date.toLocaleDateString("it-IT", options);
}

export default function TravelDetails() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedTravel = JSON.parse(localStorage.getItem("selectedTravel"));
	const activeDay = useSelector((state) => state.travel.activeDay);
	const isSubmitting = useSelector((state) => state.travel.isSubmitting);
	const [isGallery, setIsGallery] = useState(false);

	const modal = useRef();

	if (!selectedTravel) {
		// Se selectedTravel è null, reindirizza alla home
		navigate("/");
		return null;
	}

	const days = [];

	const diffTime = Math.abs(
		new Date(selectedTravel.ending_date) -
			new Date(selectedTravel.starting_date)
	);
	const travelDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

	for (let i = 0; i < travelDuration; i++) {
		days.push({ id: i + 1, dayStops: [] });
	}

	days.forEach((day, index) => {
		selectedTravel.stops.forEach((stop) => {
			if (stop.day === index + 1) {
				day.dayStops.push(stop);
			}
		});
	});

	function selectDay(day) {
		dispatch(setActiveDay(day));
	}

	async function handleDelete() {
		if (!navigator.onLine) {
			return;
		}

		dispatch(setIsSubmitting(true));
		try {
			const response = await axios.delete(
				`api/travels/delete/${selectedTravel.id}`
			);

			if (response.data.success) {
				navigate("/");
				dispatch(deleteTravel());
			} else {
				throw new Error(response.data.message || "Operazione fallita");
			}
		} catch (error) {
			console.error("Si è verificato un errore", error);
		}
		dispatch(setIsSubmitting(false));
	}

	return (
		<div className="w-11/12 mx-auto pt-8 text-center">
			<Modal
				ref={modal}
				fn={handleDelete}
				title="Vuoi veramente eliminare questo viaggio?"
			/>
			<div className="sm:w-3/4 max-w-[1200px] border-8 border-orange-600 mx-auto pt-4 rounded-3xl overflow-hidden bg-gradient-to-br from-sage to-darkSage text-zinc-900 shadow-md shadow-zinc-900">
				<h1 className="font-bold text-3xl tracking-widest text-center">
					{selectedTravel.title}
				</h1>

				<div className="flex py-8 px-4">
					<div className="w-full md:w-1/2 hidden sm:block text-right pr-12">
						<img
							className="max-h-48 inline-block ml-3 border-4 border-zinc-400 rounded-3xl shadow-zinc-800 shadow-md"
							src={`/asset/flags/${getFlag(selectedTravel.country)}`}
							alt={selectedTravel.country}
							onError={(e) => {
								e.target.onerror = null;
								e.target.style.display = "none";
								e.target.parentNode.insertAdjacentHTML(
									"beforeend",
									'<div class="h-52 min-w-52 px-4 rounded-md flex items-center justify-center text-white bg-zinc-600">Impossibile caricare l\'immagine</div>'
								);
							}}
						/>
					</div>
					<div className="flex flex-col w-full md:w-1/2 sm:text-left gap-10 py-4">
						<span>
							<strong>Data di inizio: </strong>
							{formatDate(selectedTravel.starting_date)}
						</span>
						<span>
							<strong>Data di fine: </strong>
							{formatDate(selectedTravel.ending_date)}
						</span>
						<span>
							<strong>Durata: </strong>
							{travelDuration} {travelDuration > 1 ? "giorni" : "giorno"}
						</span>
					</div>
				</div>

				{navigator.onLine && (
					<div className="flex justify-center gap-4 pb-8 px-2">
						<Link to="/travel-form?mode=edit">
							<ColoredBtn color={"orange"} disabled={isSubmitting}>
								Modifica <FontAwesomeIcon icon={faPencil} />
							</ColoredBtn>
						</Link>

						<ColoredBtn
							disabled={isSubmitting}
							onClick={() => modal.current.open()}
							color={"red"}
						>
							Elimina Viaggio <FontAwesomeIcon icon={faTrashCan} />
						</ColoredBtn>
					</div>
				)}
			</div>

			<div className="max-w-[480px] border-2 border-orange-600 text-orange-600 cursor-pointer flex justify-center mx-auto rounded-full overflow-hidden font-bold text-md sm:text-xl lg:text-2xl tracking-widest my-8">
				<h2
					onClick={isSubmitting ? null : () => setIsGallery(false)}
					className={`w-1/2 py-1 px-2 sm:py-2 sm:px-4 lg:py-3 transition-all duration-500 ${
						!isGallery
							? "bg-orange-600 text-white"
							: "bg-sage hover:bg-green-100"
					}`}
				>
					ITINERARIO
				</h2>
				<h2
					onClick={isSubmitting ? null : () => setIsGallery(true)}
					className={`w-1/2 py-1 px-2 sm:py-2 sm:px-4 lg:py-3 transition-all duration-500 ${
						isGallery
							? "bg-orange-600 text-white"
							: "bg-sage hover:bg-green-100"
					}`}
				>
					GALLERIA
				</h2>
			</div>

			<div className="max-w-[1200px] mx-auto pb-4">
				{isGallery && <TravelGallery />}
				{!isGallery && (
					<SwiperDays days={days} selectDay={selectDay} activeDay={activeDay} />
				)}
				{!isGallery && <StopsList />}
			</div>
		</div>
	);
}
