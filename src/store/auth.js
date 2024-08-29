import { createSlice } from "@reduxjs/toolkit";
import { redirect } from "react-router-dom";

const initialAuthState = {
	isAuthenticated: false,
};

const authSlice = createSlice({
	name: "authentication",
	initialState: initialAuthState,
	reducers: {
		login(state) {
			state.isAuthenticated = true;
		},

		logout(state) {
			state.isAuthenticated = false;
			localStorage.removeItem("token");
			localStorage.removeItem("expiration");
			return redirect("/auth?mode=login");
		},
	},
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
