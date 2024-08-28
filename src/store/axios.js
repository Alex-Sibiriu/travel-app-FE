import axios from "axios";

const apiClient = axios.create({
	baseURL: "https://travel-app-be-production.up.railway.app",
	withCredentials: true,
});

apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default apiClient;
