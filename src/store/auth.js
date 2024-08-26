import { createSlice } from "@reduxjs/toolkit";

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
		},
	},
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
