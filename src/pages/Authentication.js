import { redirect, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import axios from "../store/axios";
import HomeDescription from "../components/HomeDescription";
import { useEffect } from "react";

export default function AuthenticationPage() {
	const navigate = useNavigate();

	useEffect(() => {
		if (!navigator.onLine) {
			navigate("/offline");
		}

		function handleOffline() {
			navigate("/offline");
		}

		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("offline", handleOffline);
		};
	}, [navigate]);

	return (
		<div className="my-bg flex flex-wrap items-center h-screen bg-cyan-800 overflow-auto">
			<div className="order-2 w-full xl:h-full xl:flex lg:flex-col xl:justify-between content-center xl:w-1/2 shrink-0 p-4">
				<div className="flex-grow flex items-center justify-center">
					<HomeDescription />
				</div>
				<div className="p-4">
					<a
						className="text-zinc-300"
						href="https://www.freepik.com/free-vector/travel-pattern-background_3714886.htm"
						target="_blank"
						rel="noreferrer"
					>
						Image by freepik
					</a>
				</div>
			</div>
			<div className="w-full xl:w-1/2 shrink-0 p-4 order-1 xl:order-3">
				<AuthForm />
			</div>
		</div>
	);
}

export async function action({ request }) {
	const searchParams = new URL(request.url).searchParams;
	const mode = searchParams.get("mode") || "login";

	if (mode !== "login" && mode !== "register") {
		return redirect("/auth?mode=login&message=modalità non supportata");
	}

	const data = await request.formData();
	const authData = {
		name: data.get("name") || null,
		email: data.get("email"),
		password: data.get("password"),
		password_confirmation: data.get("password_confirmation") || null,
	};

	try {
		const response = await axios.post(`/api/${mode}`, authData);

		const resData = response.data;
		const token = resData.token;

		const user = JSON.stringify(resData.user);

		localStorage.setItem("token", token);
		localStorage.setItem("user", user);
		const expiration = new Date();
		expiration.setHours(expiration.getHours() + 6);
		localStorage.setItem("expiration", expiration.toISOString());

		return redirect("/");
	} catch (error) {
		console.log(error.message);

		return redirect(`/auth?mode=login&message=${error.message}`);
	}
}
