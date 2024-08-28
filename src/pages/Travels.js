import { Await, defer, Link, redirect, useLoaderData } from "react-router-dom";
import axios from "../store/axios";
import { Suspense } from "react";
import TravelsList from "../components/TravelsList";
import Loader from "../components/Loader/Loader";
import ColoredBtn from "../components/UI/ColoredBtn";

function TravelsPage() {
	const { travels } = useLoaderData();

	return (
		<div className="text-center py-8">
			<div className="sm:w-3/4 max-w-[800px] border-8 border-orange-600 mx-auto pt-4 rounded-3xl overflow-hidden bg-gradient-to-br from-sage to-darkSage text-zinc-900 shadow-md shadow-zinc-900">
				<h1 className="py-8 font-bold text-3xl capitalize">Elenco di viaggi</h1>

				<h2 className="font-bold text-xl">
					Controlla i tuoi itinerari o inizia ad organizzare un altro viaggio!
				</h2>

				<Suspense fallback={<div className="pb-8"></div>}>
					<Await resolve={travels}>
						{!navigator.onLine && <div className="pb-8"></div>}
						{navigator.onLine && (
							<Link to="/travel-form?mode=create" className="py-8 inline-block">
								<ColoredBtn color="orange">+ Nuovo Viaggio</ColoredBtn>
							</Link>
						)}
					</Await>
				</Suspense>
			</div>

			<Suspense fallback={<Loader />}>
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
