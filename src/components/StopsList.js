import { useSelector, useDispatch } from "react-redux";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import StopDetail from "./StopDetail";
import StopCreate from "./StopCreate";
import {
	changeStopOrder,
	setSelectedTravel,
	setIsSubmitting,
} from "../store/travelSlice";
import { useRef } from "react";

import axios from "../store/axios";
import Loader from "./Loader/Loader";

export default function StopsList() {
	const activeDay = useSelector((state) => state.travel.activeDay);
	const isSubmitting = useSelector((state) => state.travel.isSubmitting);
	const dispatch = useDispatch();

	let oldOrder = useRef(null);

	function handleReorder(newOrder) {
		if (!navigator.onLine) {
			return;
		}
		dispatch(changeStopOrder(newOrder));
	}

	async function handleDragEnd(stop) {
		if (stop.order == oldOrder.current || !navigator.onLine) {
			return;
		}

		dispatch(setIsSubmitting(true));

		try {
			const response = await axios.patch(`/api/stops/update/${stop.id}`, stop);

			if (response.data.success) {
				dispatch(setSelectedTravel(response.data.travel));
			} else {
				throw new Error(response.data.message || "Operazione fallita");
			}
		} catch (error) {
			console.error("Si è verificato un errore", error);
		}
		dispatch(setIsSubmitting(false));
	}

	return (
		<Reorder.Group
			values={activeDay.dayStops}
			onReorder={handleReorder}
			className="bg-orange-600 border-8 border-orange-600 rounded-3xl overflow-hidden relative shadow-zinc-800 shadow-md"
		>
			{isSubmitting && (
				<div className="absolute z-30 top-0 left-0 w-full h-full flex justify-center items-center backdrop-brightness-50">
					<Loader small={true} />
				</div>
			)}
			{!activeDay.id && (
				<li className="font-bold text-stone-200 py-4">
					Seleziona una giornata per vederne l'itinerario
				</li>
			)}

			{activeDay.id && activeDay.dayStops.length <= 0 && (
				<li className="font-bold text-stone-200 py-4">
					Non ci sono attività per questa giornata
				</li>
			)}
			<AnimatePresence>
				{activeDay.dayStops.length > 0 &&
					activeDay.dayStops.map((stop) => (
						<Reorder.Item
							key={`stop-${stop.id}`}
							value={stop}
							layoutId={`stop-${stop.id}`}
							initial={{ opacity: 0, y: -60, height: 0, scaleY: 0 }}
							animate={{ opacity: 1, y: 0, height: "auto", scaleY: 1 }}
							exit={{ opacity: 0, y: 60, height: 0, scaleY: 0 }}
							transition={{ duration: 0.5 }}
							onDragStart={() => (oldOrder.current = stop.order)}
							onDragEnd={() => handleDragEnd(stop)}
						>
							<StopDetail stop={stop} />
						</Reorder.Item>
					))}
			</AnimatePresence>
			{activeDay.id && <li>{navigator.onLine && <StopCreate />}</li>}
		</Reorder.Group>
	);
}
