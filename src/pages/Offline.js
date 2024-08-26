import { useNavigate } from "react-router-dom";
import ColoredBtn from "../components/UI/ColoredBtn";

export default function OfflinePage() {
	const navigate = useNavigate();

	function handleOffline() {
		localStorage.setItem("token", "OFFLINE");
		const expiration = new Date();
		expiration.setHours(expiration.getHours() + 1);
		localStorage.setItem("expiration", expiration.toISOString());

		navigate("/");
	}

	return (
		<div className="my-bg flex flex-col items-center justify-center h-screen bg-cyan-800 overflow-auto relative px-2">
			<div className="sm:w-11/12 max-w-[1200px] border-8 border-orange-600 mx-auto py-4 rounded-3xl overflow-hidden bg-gradient-to-br from-sage to-darkSage text-zinc-900 shadow-md shadow-zinc-900 text-center px-4">
				<h1 className="text-4xl font-bold text-orange-600 pb-8">Travel Ease</h1>
				<h2>Nessuna connessione ad internet, passare alla modalità offline?</h2>
				<small className="block pt-2 pb-8">
					(Alcune funzionalità potrebbero essere limitate)
				</small>

				<ColoredBtn color={"orange"} onClick={handleOffline}>
					Continua
				</ColoredBtn>
			</div>
			<div className="p-4 absolute bottom-0 left-0">
				<a
					className="text-zinc-300"
					href="https://www.freepik.com/free-vector/travel-pattern-background_3714886.htm"
				>
					Image by freepik
				</a>
			</div>
		</div>
	);
}
