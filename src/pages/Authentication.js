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
			<div className="order-2 w-full xl:h-full lg:flex lg:justify-center lg:items-center content-center xl:w-3/5 shrink-0 p-4">
				<HomeDescription />
			</div>
			<div className="w-full xl:w-2/5 shrink-0 p-4 order-1 xl:order-3">
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

	if (
		authData.password_confirmation &&
		authData.password !== authData.password_confirmation
	) {
		return redirect(
			"/auth?mode=register&message=Le%20password%20non%20corrispondono"
		);
	}

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
		console.log(error);

		return redirect(
			`/auth?mode=${mode}&message=${
				error.response?.data?.message || error.message
			}`
		);
	}
}
