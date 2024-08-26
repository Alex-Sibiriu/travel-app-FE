import { useRouteError } from "react-router-dom";
import MainNavigation from "../components/MainNavigation/MainNavigation";

function ErrorPage() {
	const error = useRouteError();

	let errorMessage = "Impossibile trovare la pagina!";
	if (error.status === 500) {
		errorMessage = error.data?.message || "Errore interno al server";
	} else if (error.status === 404) {
		errorMessage = "Pagina non trovata!";
	} else if (error.message) {
		errorMessage = error.message;
	}

	return (
		<>
			<MainNavigation />
			<main className="error-text bg-error relative text-center text-3xl sm:text-5xl lg:text-8xl flex flex-col justify-center items-center text-orange-600 font-bold">
				<h1 className="pb-20">C'è stato un errore!</h1>
				<p>{errorMessage}</p>
				<a
					className="absolute bottom-0 left-0 text-sm text-black"
					href="https://br.freepik.com/vetores-gratis/um-homem-na-ilha-deserta-isolado_23722809.htm#fromView=search&page=1&position=46&uuid=869ac1e1-648c-4421-b9bf-21955d0e002c"
					target="_blank"
				>
					Imagem de brgfx no Freepik
				</a>
			</main>
		</>
	);
}

export default ErrorPage;
