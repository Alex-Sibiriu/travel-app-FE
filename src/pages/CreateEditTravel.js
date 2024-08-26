import axios from "../store/axios";

import TravelForm from "../components/TravelForm";
import { json, redirect } from "react-router-dom";

export default function CreateEditTravelPage({ travel }) {
	return <TravelForm travel={travel} />;
}

export async function action({ request }) {
	const searchParams = new URL(request.url).searchParams;
	const mode = searchParams.get("mode");

	if (mode !== "edit" && mode !== "create") {
		throw json({ message: "Modalità non supportate" }, { status: 422 });
	}

	const data = await request.formData();
	const authData = {
		id: data.get("id"),
		user_id: data.get("user_id"),
		title: data.get("title"),
		starting_date: data.get("starting_date"),
		ending_date: data.get("ending_date"),
		country: data.get("country") || null,
	};

	let httpCall = null;

	if (mode === "edit") {
		httpCall = axios.patch(`/api/travels/update/${authData.id}`, authData);
	} else {
		httpCall = axios.post("/api/travels/store", authData);
	}

	try {
		const response = await httpCall;

		const resData = response.data;

		if (resData.success) {
			if (mode === "edit") {
				localStorage.setItem("selectedTravel", JSON.stringify(resData.travel));
				const slug = resData.travel.slug;

				return redirect(`/travel/${slug}`);
			}
			return redirect("/");
		} else {
			throw json(
				{ message: resData.message || "Operazione fallita" },
				{ status: 400 }
			);
		}
	} catch (error) {
		throw json(
			{ message: error.message || "Si è verificato un errore" },
			{ status: 500 }
		);
	}
}
