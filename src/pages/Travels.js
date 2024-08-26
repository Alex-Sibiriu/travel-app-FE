import {
	Await,
	defer,
	json,
	Link,
	redirect,
	useLoaderData,
} from "react-router-dom";
import axios from "../store/axios";
import { Suspense } from "react";
import TravelsList from "../components/TravelsList";
import Loader from "../components/Loader/Loader";
import ColoredBtn from "../components/UI/ColoredBtn";

function TravelsPage() {
	const { travels } = useLoaderData();

	return (
		<div className="text-center">
			<h1 className="py-8 font-bold text-3xl capitalize">Elenco di viaggi</h1>

			<Suspense fallback={<Loader />}>
				<h2 className="font-bold text-xl">
					Controlla i tuoi itinerari o inizia ad organizzare un altro viaggio!
				</h2>

				<Link to="/travel-form?mode=create" className="py-8 inline-block">
					<ColoredBtn color="orange">+ Nuovo Viaggio</ColoredBtn>
				</Link>
				<Await resolve={travels}>
					{(loadedTravels) => <TravelsList travels={loadedTravels} />}
				</Await>
			</Suspense>
		</div>
	);
}

export default TravelsPage;

async function loadTravels() {
	const attualToken = localStorage.getItem("token");

	if (attualToken === "OFFLINE") {
		console.log("Stai visualizzando i dati in modalità offline.");
		const localTravels = JSON.parse(localStorage.getItem("travels")) || [];
		return localTravels;
	}

	try {
		const response = await axios.get(`api/travels`);

		const resData = await response.data.travels;
		localStorage.setItem("travels", JSON.stringify(resData));
		return resData;
	} catch (error) {
		console.log("ERROREEEEEEEEE", error);
		if (error.code === "ERR_NETWORK") {
			const localTravels = JSON.parse(localStorage.getItem("travels")) || [];
			return localTravels;
		}

		return redirect("/auth?mode=login&message=session-expired");
	}
}

export function loader() {
	return defer({
		travels: loadTravels(),
	});
}
