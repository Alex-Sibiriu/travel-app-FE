import axios from "../store/axios";

import { useEffect, useState } from "react";
import MainNavigation from "../components/MainNavigation/MainNavigation";

import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/auth";

export default function RootLayout() {
	const [isOffline, setIsOffline] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const token = localStorage.getItem("token");

		function handleOnline() {
			if (token === "OFFLINE") {
				navigate("/auth?mode=login");
				dispatch(logout());
			}
		}

		function handleOffline() {
			setIsOffline(!isOffline);
		}

		async function handleLogout() {
			dispatch(logout());
			navigate("/auth?mode=login");

			if (token && token !== "OFFLINE") {
				try {
					const response = await axios.post("/api/logout");
					console.log(response.data);
				} catch (error) {
					console.log("Errore durante il logout: ", error);
				}
			}
		}

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		window.addEventListener("beforeunload", handleLogout);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			window.removeEventListener("beforeunload", handleLogout);
		};
	}, [navigate, isOffline, dispatch]);

	return (
		<div className="h-screen my-bg bg-cyan-800 text-white overflow-auto">
			<MainNavigation />
			<main className="flex flex-col">
				<div className="flex-grow">
					<Outlet key={isOffline} />
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
			</main>
		</div>
	);
}
