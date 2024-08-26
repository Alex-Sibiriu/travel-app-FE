import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/auth";
import axios from "../../store/axios";

import classes from "./MainNavigation.module.css";

function MainNavigation() {
	const dispatch = useDispatch();

	async function handleLogout() {
		try {
			const response = await axios.post("/api/logout");
			console.log(response.data);
			dispatch(logout());
		} catch (error) {
			console.log("Errore durante il logout: ", error);
		}
	}
	return (
		<header className="w-full bg-orange-600 h-16 shadow-md shadow-zinc-800">
			<nav className="h-full mx-auto container px-8">
				<ul className="flex h-full justify-end gap-4">
					<li>
						<NavLink
							to="/"
							className={({ isActive }) =>
								isActive ? classes.active : undefined
							}
						>
							Viaggi
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/auth?mode=login"
							onClick={handleLogout}
							className={({ isActive }) =>
								isActive ? classes.active : undefined
							}
						>
							Logout
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default MainNavigation;
