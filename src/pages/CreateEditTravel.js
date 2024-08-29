import axios from "../store/axios";

import TravelForm from "../components/TravelForm";
import { json, redirect } from "react-router-dom";

export default function CreateEditTravelPage({ travel }) {
	return <TravelForm travel={travel} />;
}

export async function action({ request }) {
	localStorage.removeItem("errors");
	const searchParams = new URL(request.url).searchParams;
	const mode = searchParams.get("mode");

	if (mode !== "edit" && mode !== "create") {
		throw json({ message: "Modalità non supportata" }, { status: 422 });
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
		}
	} catch (error) {
		if (error.response && error.response.data.errors) {
			localStorage.setItem(
				"errors",
				JSON.stringify(error.response.data.errors)
			);
		} else {
			localStorage.setItem(
				"errors",
				JSON.stringify({
					err: ["Si è verificato un errore " + error.message],
				})
			);
		}

		return redirect(`/travel-form?mode=${mode}`);
	}
}
