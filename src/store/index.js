import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import selTravelReducer from "./travelSlice";

const store = configureStore({
	reducer: { auth: authReducer, travel: selTravelReducer },
});

export default store;
