import {
	Form,
	useNavigate,
	useNavigation,
	useSearchParams,
} from "react-router-dom";

import countries from "../utilities/countriesList";
import ColoredBtn from "./UI/ColoredBtn";
import { useState } from "react";

export default function TravelForm() {
	const travel = JSON.parse(localStorage.getItem("selectedTravel"));
	const errors = JSON.parse(localStorage.getItem("errors")) || {};
	const navigate = useNavigate();

	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	const [searchParams] = useSearchParams();
	const isEdit = searchParams.get("mode") === "edit";

	const user = localStorage.getItem("user");
	const userId = JSON.parse(user).id;

	const today = new Date().toISOString().split("T")[0];

	const [endDateMin, setEndDateMin] = useState(
		isEdit ? travel?.starting_date : new Date().toISOString().split("T")[0]
	);

	const [startDateMax, setStartDateMax] = useState(
		isEdit ? travel?.ending_date : new Date().toISOString().split("T")[0]
	);

	function handleStartDateChange(event) {
		const selectedStartDate = event.target.value;
		setEndDateMin(selectedStartDate);
	}

	function handleEndDateChange(event) {
		const selectedEndDate = event.target.value;
		setStartDateMax(selectedEndDate);
	}

	return (
		<div className="w-11/12 max-w-[800px] shadow-lg py-8 mt-8 mx-auto font-bold text-orange-100 bg-gradient-to-b from-orange-600 to-orange-400 rounded-xl text-center">
			<Form method="POST" className="flex flex-wrap px-8 sm:px-16">
				<h1 className="text-3xl w-full capitalize text-center">
					{isEdit ? "Modifica" : "Crea"} Viaggio
				</h1>

				{Object.keys(errors).map((key) => (
					<div key={key} className="text-red-700 text-center my-4">
						{errors[key].map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				))}

				<input name="user_id" type="hidden" required value={userId} />

				<input name="id" type="hidden" required value={travel?.id} />

				<div className="py-4 w-full mx-auto flex flex-col">
					<label htmlFor="title" className="inline-block text-start">
						Titolo
					</label>
					<input
						name="title"
						id="title"
						type="text"
						className="bg-orange-300 px-2 py-1 text-white rounded-lg"
						defaultValue={isEdit ? travel?.title : ""}
						required
					/>
				</div>

				<div className="py-4 w-full sm:w-1/2 flex flex-col sm:pr-4">
					<label htmlFor="starting_date" className="inline-block text-start">
						Data d'inizio
					</label>
					<input
						name="starting_date"
						id="starting_date"
						type="date"
						className="bg-orange-300 px-2 py-1 text-white rounded-lg focus:outline-orange-600"
						defaultValue={isEdit ? travel?.starting_date : ""}
						min={today}
						max={startDateMax}
						onChange={handleStartDateChange}
						required
					/>
				</div>

				<div className="py-4 w-full sm:w-1/2 mx-auto flex flex-col sm:pl-4">
					<label htmlFor="ending_date" className="inline-block text-start">
						Data di fine
					</label>
					<input
						name="ending_date"
						id="ending_date"
						type="date"
						className="bg-orange-300 px-2 py-1 text-white rounded-lg"
						defaultValue={isEdit ? travel?.ending_date : ""}
						min={endDateMin}
						onChange={handleEndDateChange}
						required
					/>
				</div>

				<div className="py-4 w-full sm:w-1/2 mx-auto text-start sm:pr-4">
					<label htmlFor="country" className="inline-block text-start pr-4">
						Quale stato visiterai?
					</label>

					<select
						name="country"
						className="bg-orange-300 max-w-full p-1.5 text-white rounded-lg overflow-auto"
						defaultValue={isEdit ? travel?.country : undefined}
					>
						{countries.map((nation) => (
							<option
								key={nation.flag}
								value={nation.country}
								className="text-wrap max-w-full inline-block"
							>
								{nation.country}
							</option>
						))}
					</select>
				</div>

				<div className="pt-12 sm:w-1/2 flex gap-4 mx-auto sm:pl-4 sm:justify-end">
					<ColoredBtn
						color={"transparent"}
						disabled={isSubmitting}
						type="button"
						onClick={
							isEdit
								? () => navigate(`/travel/${travel.slug}`)
								: () => navigate(`/`)
						}
					>
						Annulla
					</ColoredBtn>

					<ColoredBtn color={"orange"}>
						{isSubmitting ? "Inviando..." : isEdit ? "Modifica" : "Crea"}
					</ColoredBtn>
				</div>
			</Form>
		</div>
	);
}
