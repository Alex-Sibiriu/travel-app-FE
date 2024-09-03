import axios from "../store/axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar as faSolidStar,
	faPencil,
	faTrashCan,
	faAngleDown,
	faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";
import StopForm from "./StopForm";
import ColoredBtn from "./UI/ColoredBtn";
import { useDispatch, useSelector } from "react-redux";
import {
	setSelectedTravel,
	updateStop,
	deleteStop,
	setIsSubmitting,
} from "../store/travelSlice";
import CheckboxSwitch from "./UI/CheckboxSwitch/CheckboxSwitch";
import TomTomMap from "./UI/Map";
import Modal from "./UI/Modal";

export default function StopDetail({ stop }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [rating, setStopRating] = useState(stop.rating);
	const [isEdit, setIsEdit] = useState(false);
	const [errors, setErrors] = useState({});
	const isSubmitting = useSelector((state) => state.travel.isSubmitting);
	const dispatch = useDispatch();

	const modal = useRef();

	// Gestione del rating
	const starRating = [];

	for (let i = 1; i <= 5; i++) {
		starRating.push({
			icon: rating >= i ? faSolidStar : faRegularStar,
			point: i,
		});
	}

	function handleRating(newRating) {
		if (!navigator.onLine) {
			return;
		}
		setStopRating(newRating);
	}

	useEffect(() => {
		async function updateRating() {
			setIsSubmitting(true);

			try {
				const response = await axios.patch(`api/stops/update/${stop.id}`, {
					...stop,
					rating: rating,
				});

				if (response.data.success) {
					dispatch(updateStop(response.data.stop));
					dispatch(setSelectedTravel(response.data.travel));
				} else {
					throw new Error(response.data.message || "Operazione fallita");
				}
			} catch (error) {
				if (error.response && error.response.status === 422) {
					console.error("Validation Error:", error.response.data.errors);
				} else {
					console.error("Error:", error.message);
				}
			}
			setIsSubmitting(false);
		}

		if (rating !== stop.rating) {
			updateRating();
		}
	}, [rating, dispatch, stop]);

	// Gestione della finestra
	function handleEdit() {
		setIsEdit(true);
	}

	function handleExpand() {
		setIsExpanded(!isExpanded);
		setIsEdit(false);
	}

	function handleCancel() {
		setIsEdit(false);
		setErrors({});
	}

	// Gestione della richiesta http
	async function handleSubmit(e) {
		e.preventDefault();
		dispatch(setIsSubmitting(true));
		const data = new FormData(e.target);

		console.log("SI attiva handlesubmit");

		const authData = {
			travel_id: data.get("travel_id"),
			day: data.get("day"),
			longitude: data.get("longitude"),
			latitude: data.get("latitude"),
			title: data.get("title"),
			order: data.get("order"),
			place: data.get("place"),
			description: data.get("description"),
			food: data.get("food"),
		};

		try {
			const response = await axios.patch(
				`/api/stops/update/${stop.id}`,
				authData
			);

			if (response.data.success) {
				dispatch(updateStop(response.data.stop));
				dispatch(setSelectedTravel(response.data.travel));
			} else {
				throw new Error(response.data.message || "Operazione fallita");
			}
		} catch (error) {
			if (error.response && error.response.data.errors) {
				setErrors(error.response.data.errors);
			} else {
				setErrors({
					err: ["Si è verificato un errore " + error.message],
				});
			}
		}

		dispatch(setIsSubmitting(false));
		setIsEdit(false);
	}

	async function handleVisitedToggle() {
		console.log("SI attiva visited toggle");
		try {
			dispatch(setIsSubmitting(true));

			const updatedStop = { ...stop, is_visited: !stop.is_visited };

			const response = await axios.patch(
				`/api/stops/update/${stop.id}`,
				updatedStop
			);
			if (response.data.success) {
				dispatch(updateStop(response.data.stop));
			} else {
				throw new Error(response.data.message || "Operazione fallita");
			}
		} catch (error) {
			console.error("Si è verificato un errore", error);
		}
		dispatch(setIsSubmitting(false));
	}

	async function handleDelete() {
		dispatch(setIsSubmitting(true));
		setIsExpanded(false);
		try {
			const response = await axios.delete(`api/stops/delete/${stop.id}`);

			if (response.data.success) {
				dispatch(deleteStop(stop));
			} else {
				throw new Error(response.data.message || "Operazione fallita");
			}
		} catch (error) {
			console.error("Si è verificato un errore", error);
		}
		dispatch(setIsSubmitting(false));
	}

	return (
		<>
			<Modal
				ref={modal}
				title="Vuoi veramente eliminare questa attività?"
				fn={handleDelete}
			/>
			<div
				className={`transition-all duration-1000 border-2 rounded-3xl text-start overflow-hidden border-orange-600 text-zinc-900 bg-gradient-to-t ${
					stop.is_visited
						? "from-green-700 to-green-500 "
						: "from-darkSage to-sage "
				} ${isExpanded && !isEdit ? "pt-4" : "pt-0"}`}
				key={stop.slug}
			>
				<div
					className={`lg:flex justify-between px-4 overflow-hidden transition-all duration-500 ${
						isExpanded && !isEdit ? "max-h-[2500px] py-4" : "max-h-0 py-0"
					}`}
				>
					<div className="md:pr-8">
						<h2 className="pb-4">
							<strong className="text-lg">Attività: </strong>
							{stop.title}
						</h2>

						<p className="pb-4">
							<strong className="text-lg">Luogo: </strong>
							{stop.place}
						</p>

						{stop.description && (
							<p className="pb-4">
								<strong className="text-lg block sm:inline-block">
									Descrizione:
								</strong>{" "}
								{stop.description}
							</p>
						)}

						{stop.food && (
							<p className="pb-4">
								<strong className="text-lg">Piatti Tradizionali:</strong>{" "}
								{stop.food}
							</p>
						)}

						<CheckboxSwitch
							label="Hai già visitato questa tappa?"
							disabled={isSubmitting || !navigator.onLine}
							inputId={`check-${stop.id}`}
							defaultChecked={stop.is_visited}
							onChange={handleVisitedToggle}
						/>

						<div
							className={`my-0 text-center overflow-hidden transition-all duration-500 sm:text-left  ${
								stop.is_visited ? "opacity-100" : "opacity-40"
							}`}
						>
							<strong>Valuta questa tappa</strong>
							<div className="text-yellow-500 text-xl pt-1">
								{starRating.map((star, index) => (
									<FontAwesomeIcon
										key={star.point}
										icon={star.icon}
										className={`mr-1 ${
											isSubmitting || !stop.is_visited || !navigator.onLine
												? "select-none"
												: "cursor-pointer"
										}`}
										onClick={
											stop.is_visited ? () => handleRating(star.point) : null
										}
									/>
								))}
							</div>
						</div>

						{navigator.onLine && (
							<div className="flex  gap-4 py-8">
								{!stop.is_visited && (
									<ColoredBtn
										disabled={isSubmitting}
										color={"orange"}
										onClick={handleEdit}
									>
										<FontAwesomeIcon icon={faPencil} />
									</ColoredBtn>
								)}
								<ColoredBtn
									disabled={isSubmitting}
									color={"red"}
									onClick={() => modal.current.open()}
								>
									<FontAwesomeIcon icon={faTrashCan} />
								</ColoredBtn>
							</div>
						)}
					</div>

					<div className="w-full lg:w-2/5 border-4 bg-zinc-300 border-zinc-400 rounded-lg overflow-hidden">
						{isExpanded && !isSubmitting && <TomTomMap stop={stop} />}
					</div>
				</div>

				<Form
					onSubmit={handleSubmit}
					className={`overflow-hidden transition-all duration-500 ${
						isExpanded && isEdit ? "max-h-[1000px] py-4" : "max-h-0"
					}`}
				>
					<h2 className="text-center font-bold">{stop.title}</h2>

					{Object.keys(errors).map((key) => (
						<div key={key} className="text-red-700 text-center my-4">
							{errors[key].map((error, index) => (
								<p key={index}>{error}</p>
							))}
						</div>
					))}

					<StopForm
						handleCancel={handleCancel}
						isSubmitting={isSubmitting}
						existingStop={stop}
					/>
				</Form>

				<div
					className={`${
						!isExpanded
							? `cursor-grab px-4 hover:bg-gradient-to-r ${
									stop.is_visited
										? "from-green-500 via-green-700 to-green-500"
										: "from-sage via-darkSage to-sage"
							  } `
							: ""
					}`}
				>
					<p
						onClick={handleExpand}
						className="text-center capitalize w-fit mx-auto font-extrabold cursor-pointer py-4"
					>
						{isExpanded ? "Nascondi" : stop.title}
						<span className="bounce inline-block  text-xl ml-2 transition-transform duration-300">
							{isExpanded ? (
								<FontAwesomeIcon icon={faAngleUp} />
							) : (
								<FontAwesomeIcon icon={faAngleDown} />
							)}
						</span>
					</p>
				</div>
			</div>
		</>
	);
}
