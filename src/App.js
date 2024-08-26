import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layouts/Root";
import { checkAuthLoader } from "./utilities/auth";

import ErrorPage from "./pages/Error";

import TravelsPage from "./pages/Travels";
import { loader as travelsLoader } from "./pages/Travels";

import AuthenticationPage from "./pages/Authentication";
import { action as authAction } from "./pages/Authentication";

import CreateEditTravelPage from "./pages/CreateEditTravel";
import { action as createEditTravelAction } from "./pages/CreateEditTravel";

import TravelDetailPage from "./pages/TravelDetail";

import OfflinePage from "./pages/Offline";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		loader: checkAuthLoader,
		children: [
			{
				index: true,
				element: <TravelsPage />,
				loader: travelsLoader,
			},
			{
				path: "travel-form",
				element: <CreateEditTravelPage />,
				action: createEditTravelAction,
			},
			{
				path: "travel/:travelSlug",
				element: <TravelDetailPage />,
			},
		],
	},
	{ path: "/auth", element: <AuthenticationPage />, action: authAction },
	{ path: "/offline", element: <OfflinePage /> },
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
