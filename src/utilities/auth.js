import { redirect } from "react-router-dom";

export function getTokenDuration() {
	const storedExpirationDate = localStorage.getItem("expiration");

	if (!storedExpirationDate) {
		return 0;
	}

	const expirationDate = new Date(storedExpirationDate);
	const now = new Date();
	const duration = expirationDate.getTime() - now.getTime();
	return duration;
}

export function getAuthToken() {
	const token = localStorage.getItem("token");

	if (!token) {
		return null;
	}

	const tokenDuration = getTokenDuration();

	if (tokenDuration < 0) {
		return null;
	}

	return token;
}

export function checkAuthLoader() {
	const token = getAuthToken();

	if (!token) {
		localStorage.removeItem("token");
		localStorage.removeItem("expiration");
		localStorage.removeItem("user");
		return redirect("/auth?mode=login&message=session%20expired");
	}

	return null;
}
