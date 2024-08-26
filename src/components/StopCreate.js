import { useRef, useState } from "react";
import { Form } from "react-router-dom";
import axios from "../store/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";

import {
	setSelectedTravel,
	addStop,
	setIsSubmitting,
} from "../store/travelSlice";
import { useDispatch } from "react-redux";
import StopForm from "./StopForm";

export default function StopCreate() {
	const [stopAdded, setStopAdded] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [errors, setErrors] = useState({});
	const dispatch = useDispatch();

	const formRef = useRef(null);

	async function handleSubmit(e) {
		e.preventDefault();
		dispatch(setIsSubmitting(true));
		setErrors({});
		const data = new FormData(e.target);

		const authData = {
			travel_id: data.get("travel_id"),
			day: data.get("day"),
			longitude: data.get("longitude"),
			latitude: data.get("latitude"),
			title: data.get("title"),
			place: data.get("place"),
			description: data.get("description"),
			food: data.get("food"),
		};

		try {
			const response = await axios.post("/api/stops/store", authData);

			if (response.data.success) {
				dispatch(addStop(response.data.stop));
				dispatch(setSelectedTravel(response.data.travel));

				formRef.current.reset();
				setIsExpanded(false);

				setStopAdded(true);
				setTimeout(() => {
					setStopAdded(false);
				}, 3000);
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
	}

	function toggleExpand() {
		setIsExpanded(!isExpanded);
		setErrors({});
		formRef.current.reset();
	}

	return (
		<Form
			ref={formRef}
			onSubmit={handleSubmit}
			method="POST"
			className={`text-start rounded-3xl border-t-8 border-orange-600 transition-all duration-500 ${
				stopAdded
					? "bg-gradient-to-t from-green-700 to-green-600 text-white"
					: "bg-gradient-to-t from-darkSage to-sage text-zinc-900"
			}`}
		>
			<p
				onClick={toggleExpand}
				className="w-full py-8 px-4 text-center text-2xl font-bold hover:cursor-pointer"
			>
				{stopAdded ? "Tappa aggiunta con successo!" : "Aggiungi una tappa "}
				{!stopAdded && (
					<span className="bounce inline-block">
						{isExpanded ? (
							<FontAwesomeIcon icon={faAngleUp} />
						) : (
							<FontAwesomeIcon icon={faAngleDown} />
						)}
					</span>
				)}
			</p>

			<div
				className={`transition-all px-4 duration-500 overflow-hidden w-full ${
					isExpanded ? "max-h-[1000px] py-4" : "max-h-0"
				}`}
			>
				{Object.keys(errors).map((key) => (
					<div key={key} className="text-red-700 text-center my-4">
						{errors[key].map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				))}
				<StopForm />
			</div>
		</Form>
	);
}
