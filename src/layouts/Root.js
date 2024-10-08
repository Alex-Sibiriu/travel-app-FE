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

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [navigate, isOffline, dispatch]);

	return (
		<div className="h-screen my-bg bg-cyan-800 text-white overflow-auto">
			<MainNavigation />
			<main className="flex flex-col">
				<div className="flex-grow">
					<Outlet key={isOffline} />
				</div>
			</main>
		</div>
	);
}
